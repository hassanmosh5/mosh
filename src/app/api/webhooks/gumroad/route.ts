/**
 * Gumroad Ping — records the sale; Gumroad delivers the file itself.
 *
 * Gumroad does not sign its pings, so this endpoint is authenticated by a
 * secret in the URL plus a seller-id check. That is weaker than the HMAC the
 * other platforms use, which is precisely why this route issues no download
 * link: a forged ping can write a row for someone to notice, and nothing else.
 *
 * If you ever want Gumroad buyers served from here instead, set
 * GUMROAD_ISSUE_DOWNLOADS=true — but read the note in docs/SELLING.md first.
 */

import { NextResponse } from "next/server";

import { findProduct } from "@/lib/fulfilment/catalog";
import { deliverDownload, logFulfilment } from "@/lib/fulfilment/delivery";
import { issueGrant } from "@/lib/fulfilment/grants";
import { parseGumroad } from "@/lib/fulfilment/payloads";
import { verifyGumroad } from "@/lib/fulfilment/signatures";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const url = new URL(request.url);

  const verified = verifyGumroad(url.searchParams.get("secret"), undefined, {
    pingSecret: process.env.GUMROAD_PING_SECRET,
    sellerId: undefined,
  });
  if (!verified.ok) {
    console.warn(`[gumroad] rejected: ${verified.reason}`);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = new URLSearchParams(await request.text());

  // The seller-id check needs the body, so it runs as a second pass.
  const sellerVerified = verifyGumroad(url.searchParams.get("secret"), form.get("seller_id") ?? undefined, {
    pingSecret: process.env.GUMROAD_PING_SECRET,
    sellerId: process.env.GUMROAD_SELLER_ID,
  });
  if (!sellerVerified.ok) {
    console.warn(`[gumroad] rejected: ${sellerVerified.reason}`);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = parseGumroad(form);
  if (!parsed.ok) {
    console.info(`[gumroad] not actionable: ${parsed.reason}`);
    return NextResponse.json({ ok: true, ignored: parsed.reason });
  }

  const sale = parsed.sale;
  if (sale.isTest) {
    return NextResponse.json({ ok: true, ignored: "test ping" });
  }

  const result = await issueGrant({
    platform: "GUMROAD",
    reference: sale.reference,
    email: sale.email,
    productSlug: sale.productSlug,
    tier: sale.tier,
    amountMinor: sale.amountMinor,
    currency: sale.currency,
    payload: Object.fromEntries(form),
  });

  if (result.status === "unknown-product" || result.status === "not-built") {
    console.error(`[gumroad] sale ${sale.reference} not recorded — ${result.reason}`);
    return NextResponse.json({ ok: true, unrecorded: result.reason });
  }

  const issueDownloads = process.env.GUMROAD_ISSUE_DOWNLOADS === "true";
  if (!issueDownloads || result.status === "already-issued" || !result.token) {
    console.info(
      `[gumroad] recorded sale ${sale.reference} for ${sale.productSlug} — Gumroad is delivering the file`
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
    platform: "gumroad",
  });
  logFulfilment(outcome, {
    platform: "gumroad",
    email: sale.email,
    productSlug: sale.productSlug,
    tier: sale.tier,
  });

  return NextResponse.json({ ok: true, recorded: true, delivered: outcome.sent });
}
