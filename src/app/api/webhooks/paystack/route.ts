/**
 * Paystack — charge.success → download link.
 *
 * Paystack takes the money and does not host files, so this route is the
 * delivery mechanism for every Paystack sale. It verifies the signature on the
 * raw body, re-verifies the transaction against Paystack's own API, checks the
 * paid amount against the catalogue price, and only then issues a grant.
 *
 * Delivery is retriable: a paid sale is acknowledged only after Resend accepts
 * the delivery email. A webhook replay can therefore recover from a transient
 * email failure without creating a second sale.
 */

import { NextResponse } from "next/server";

import { findProduct, findTier, loadCatalog } from "@/lib/fulfilment/catalog";
import { deliverDownload, logFulfilment } from "@/lib/fulfilment/delivery";
import { issueGrant, reissueGrant } from "@/lib/fulfilment/grants";
import { parsePaystack } from "@/lib/fulfilment/payloads";
import { verifyPaystack } from "@/lib/fulfilment/signatures";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function expectedAmountMinor(productSlug: string, tierId: string): number | null {
  const catalog = loadCatalog();
  const product = findProduct(productSlug);
  const tier = findTier(tierId);
  if (!product || !tier) return null;

  const amountGhs = Math.ceil(
    (product.priceUsd * tier.multiplier * catalog.currency.ghsPerUsd) /
      catalog.currency.roundTo.GHS
  ) * catalog.currency.roundTo.GHS;
  return amountGhs * 100;
}

/** Confirms the charge, amount and currency with Paystack rather than trusting the body alone. */
async function confirmWithPaystack(
  reference: string,
  secretKey: string,
  expectedAmount: number,
  expectedCurrency: string
): Promise<{ ok: boolean; reason?: string }> {
  try {
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      { headers: { Authorization: `Bearer ${secretKey}` }, cache: "no-store" }
    );
    if (!response.ok) return { ok: false, reason: `verify returned ${response.status}` };

    const body = (await response.json()) as {
      data?: { status?: string; amount?: number; currency?: string };
    };
    const data = body.data;
    if (data?.status !== "success") {
      return { ok: false, reason: `transaction status "${data?.status}"` };
    }
    if (data.amount !== expectedAmount) {
      return {
        ok: false,
        reason: `amount mismatch: expected ${expectedAmount}, Paystack reports ${data.amount}`,
      };
    }
    if (data.currency?.toUpperCase() !== expectedCurrency.toUpperCase()) {
      return {
        ok: false,
        reason: `currency mismatch: expected ${expectedCurrency}, Paystack reports ${data.currency}`,
      };
    }
    return { ok: true };
  } catch (error) {
    return { ok: false, reason: `verify call failed: ${(error as Error).message}` };
  }
}

function deliveryWasSent(payload: unknown): boolean {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return false;
  const fulfilment = (payload as Record<string, unknown>)._fulfilment;
  return Boolean(
    fulfilment &&
      typeof fulfilment === "object" &&
      !Array.isArray(fulfilment) &&
      (fulfilment as Record<string, unknown>).deliveredAt
  );
}

async function markDeliverySent(saleId: string, deliveryId: string): Promise<void> {
  const current = await prisma.sale.findUnique({
    where: { id: saleId },
    select: { payload: true },
  });
  const payload =
    current?.payload && typeof current.payload === "object" && !Array.isArray(current.payload)
      ? current.payload
      : {};

  await prisma.sale.update({
    where: { id: saleId },
    data: {
      payload: {
        ...payload,
        _fulfilment: {
          deliveredAt: new Date().toISOString(),
          deliveryId,
        },
      },
    },
  });
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const secretKey = process.env.PAYSTACK_SECRET_KEY;

  const verified = verifyPaystack(rawBody, request.headers.get("x-paystack-signature"), secretKey);
  if (!verified.ok) {
    console.warn(`[paystack] rejected: ${verified.reason}`);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Malformed JSON" }, { status: 400 });
  }

  const parsed = parsePaystack(body as Parameters<typeof parsePaystack>[0]);
  if (!parsed.ok) {
    console.info(`[paystack] not actionable: ${parsed.reason}`);
    return NextResponse.json({ ok: true, ignored: parsed.reason });
  }

  const sale = parsed.sale;
  const expectedAmount = expectedAmountMinor(sale.productSlug, sale.tier);
  if (expectedAmount === null) {
    console.error(`[paystack] could not calculate expected price for ${sale.productSlug}/${sale.tier}`);
    return NextResponse.json({ ok: true, ignored: "could not calculate expected price" });
  }

  // Signature proves the message came from Paystack; this proves the money did.
  const confirmed = await confirmWithPaystack(sale.reference, secretKey!, expectedAmount, "GHS");
  if (!confirmed.ok) {
    console.warn(`[paystack] ${sale.reference} not confirmed: ${confirmed.reason}`);
    return NextResponse.json({ ok: true, ignored: confirmed.reason });
  }

  const result = await issueGrant({
    platform: "PAYSTACK",
    reference: sale.reference,
    email: sale.email,
    productSlug: sale.productSlug,
    tier: sale.tier,
    amountMinor: sale.amountMinor,
    currency: sale.currency,
    payload: JSON.parse(rawBody),
  });

  if (result.status === "unknown-product" || result.status === "not-built") {
    console.error(
      `[paystack] PAID BUT UNDELIVERABLE ref=${sale.reference} email=${sale.email} — ${result.reason}`
    );
    return NextResponse.json({ ok: true, undeliverable: result.reason });
  }

  const product = findProduct(sale.productSlug)!;
  let token: string;
  let grantId: string;
  let expiresAt: Date;
  let maxDownloads: number;
  let tierName: string;

  if (result.status === "already-issued") {
    const existingSale = await prisma.sale.findUnique({
      where: { id: result.saleId },
      select: { payload: true },
    });

    if (deliveryWasSent(existingSale?.payload)) {
      console.info(`[paystack] replay of ${sale.reference}, delivery already confirmed`);
      return NextResponse.json({ ok: true, duplicate: true });
    }

    // The original grant's raw token is intentionally not stored. Mint a fresh
    // one for a failed delivery attempt; the payment reference still prevents
    // a second sale from being recorded.
    const replacement = await reissueGrant(result.saleId);
    token = replacement.token;
    grantId = result.grantId;
    expiresAt = replacement.expiresAt;
    maxDownloads = result.maxDownloads;
    tierName = result.tierName;
    console.info(`[paystack] retrying undelivered sale ${sale.reference}`);
  } else {
    token = result.token!;
    grantId = result.grantId;
    expiresAt = result.expiresAt;
    maxDownloads = result.maxDownloads;
    tierName = result.tierName;
  }

  const outcome = await deliverDownload({
    email: sale.email,
    token,
    product,
    tierName,
    expiresAt,
    maxDownloads,
    platform: "paystack",
    siteUrl: process.env.SITE_URL ?? new URL(request.url).origin,
  });
  logFulfilment(outcome, {
    platform: "paystack",
    email: sale.email,
    productSlug: sale.productSlug,
    tier: sale.tier,
  });

  if (!outcome.sent) {
    // Do not acknowledge a paid-but-undelivered webhook. Paystack can retry,
    // and the replay path above will mint a new token and try again.
    return NextResponse.json({ ok: false, delivered: false }, { status: 500 });
  }

  await markDeliverySent(result.saleId, outcome.id);
  console.info(`[paystack] delivery confirmed ref=${sale.reference} grant=${grantId}`);

  return NextResponse.json({ ok: true, delivered: true });
}
