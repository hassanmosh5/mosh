/**
 * Paystack — charge.success → download link.
 *
 * Paystack takes the money and does not host files, so this route is the
 * delivery mechanism for every Paystack sale. It verifies the signature on the
 * raw body, re-verifies the transaction against Paystack's own API when a
 * secret key is available, and only then issues a grant.
 *
 * It always answers 200 once the signature checks out. Paystack retries on any
 * other status, and retrying will not fix a payload that names a product we do
 * not sell — that needs a human, so it is logged loudly and acknowledged.
 */

import { NextResponse } from "next/server";

import { findProduct } from "@/lib/fulfilment/catalog";
import { deliverDownload, logFulfilment } from "@/lib/fulfilment/delivery";
import { issueGrant } from "@/lib/fulfilment/grants";
import { parsePaystack } from "@/lib/fulfilment/payloads";
import { verifyPaystack } from "@/lib/fulfilment/signatures";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Confirms the charge with Paystack rather than trusting the body alone. */
async function confirmWithPaystack(
  reference: string,
  secretKey: string
): Promise<{ ok: boolean; reason?: string }> {
  try {
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      { headers: { Authorization: `Bearer ${secretKey}` }, cache: "no-store" }
    );
    if (!response.ok) return { ok: false, reason: `verify returned ${response.status}` };

    const body = (await response.json()) as { data?: { status?: string } };
    return body.data?.status === "success"
      ? { ok: true }
      : { ok: false, reason: `transaction status "${body.data?.status}"` };
  } catch (error) {
    return { ok: false, reason: `verify call failed: ${(error as Error).message}` };
  }
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

  // Signature proves the message came from Paystack; this proves the money did.
  const confirmed = await confirmWithPaystack(sale.reference, secretKey!);
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

  if (result.status === "already-issued") {
    console.info(`[paystack] replay of ${sale.reference}, nothing to do`);
    return NextResponse.json({ ok: true, duplicate: true });
  }

  const product = findProduct(sale.productSlug)!;
  const outcome = await deliverDownload({
    email: sale.email,
    token: result.token!,
    product,
    tierName: result.tierName,
    expiresAt: result.expiresAt,
    maxDownloads: result.maxDownloads,
    platform: "paystack",
  });
  logFulfilment(outcome, {
    platform: "paystack",
    email: sale.email,
    productSlug: sale.productSlug,
    tier: sale.tier,
  });

  return NextResponse.json({ ok: true, delivered: outcome.sent });
}
