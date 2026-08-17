/**
 * Selar — records the sale; Selar delivers the file itself.
 *
 * Selar's signature scheme is not documented publicly at the time of writing,
 * so this route verifies a configurable HMAC and **refuses everything until
 * SELAR_WEBHOOK_SECRET is set**. That is deliberate: an unverified webhook that
 * writes sale rows is a way for a stranger to fill your database, and because
 * Selar delivers its own downloads, refusing costs a buyer nothing.
 *
 * Confirm the header name and encoding with Selar, set the two env vars, and
 * send yourself a test sale before trusting it.
 */

import { NextResponse } from "next/server";

import { findProduct } from "@/lib/fulfilment/catalog";
import { deliverDownload, logFulfilment } from "@/lib/fulfilment/delivery";
import { issueGrant } from "@/lib/fulfilment/grants";
import { parseSelar } from "@/lib/fulfilment/payloads";
import { verifySelar } from "@/lib/fulfilment/signatures";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEFAULT_HEADER = "x-selar-signature";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const headerName = process.env.SELAR_SIGNATURE_HEADER ?? DEFAULT_HEADER;
  const encoding = process.env.SELAR_SIGNATURE_ENCODING === "base64" ? "base64" : "hex";

  const verified = verifySelar(rawBody, request.headers.get(headerName), {
    secret: process.env.SELAR_WEBHOOK_SECRET,
    encoding,
  });
  if (!verified.ok) {
    console.warn(`[selar] rejected: ${verified.reason} (header "${headerName}", ${encoding})`);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Malformed JSON" }, { status: 400 });
  }

  const parsed = parseSelar(body as Parameters<typeof parseSelar>[0]);
  if (!parsed.ok) {
    console.info(`[selar] not actionable: ${parsed.reason}`);
    return NextResponse.json({ ok: true, ignored: parsed.reason });
  }

  const sale = parsed.sale;
  if (sale.isTest) return NextResponse.json({ ok: true, ignored: "test event" });

  const result = await issueGrant({
    platform: "SELAR",
    reference: sale.reference,
    email: sale.email,
    productSlug: sale.productSlug,
    tier: sale.tier,
    amountMinor: sale.amountMinor,
    currency: sale.currency,
    payload: JSON.parse(rawBody),
  });

  if (result.status === "unknown-product" || result.status === "not-built") {
    console.error(`[selar] sale ${sale.reference} not recorded — ${result.reason}`);
    return NextResponse.json({ ok: true, unrecorded: result.reason });
  }

  const issueDownloads = process.env.SELAR_ISSUE_DOWNLOADS === "true";
  if (!issueDownloads || result.status === "already-issued" || !result.token) {
    console.info(
      `[selar] recorded sale ${sale.reference} for ${sale.productSlug} — Selar is delivering the file`
    );
    return NextResponse.json({ ok: true, recorded: true, delivered: false });
  }

  const product = findProduct(sale.productSlug)!;
  const outcome = await deliverDownload({
    email: sale.email,
    token: result.token,
    product,
    tierName: result.tierName,
    expiresAt: result.expiresAt,
    maxDownloads: result.maxDownloads,
    platform: "selar",
  });
  logFulfilment(outcome, {
    platform: "selar",
    email: sale.email,
    productSlug: sale.productSlug,
    tier: sale.tier,
  });

  return NextResponse.json({ ok: true, recorded: true, delivered: outcome.sent });
}
