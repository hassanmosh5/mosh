/**
 * Shopify — orders/paid → download link per line item.
 *
 * Shopify does not deliver digital files on its own, so this route is the
 * delivery mechanism for Shopify sales. An order can contain several products;
 * each line item that maps to a package becomes its own sale row, keyed on
 * `<order id>:<sku>`, so a replayed webhook re-issues nothing.
 */

import { NextResponse } from "next/server";

import { findProduct } from "@/lib/fulfilment/catalog";
import { deliverDownload, logFulfilment } from "@/lib/fulfilment/delivery";
import { issueGrant } from "@/lib/fulfilment/grants";
import { parseShopify } from "@/lib/fulfilment/payloads";
import { verifyShopify } from "@/lib/fulfilment/signatures";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const rawBody = await request.text();

  const verified = verifyShopify(
    rawBody,
    request.headers.get("x-shopify-hmac-sha256"),
    process.env.SHOPIFY_WEBHOOK_SECRET
  );
  if (!verified.ok) {
    console.warn(`[shopify] rejected: ${verified.reason}`);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const topic = request.headers.get("x-shopify-topic");
  if (topic && topic !== "orders/paid") {
    return NextResponse.json({ ok: true, ignored: `topic ${topic}` });
  }

  let order: unknown;
  try {
    order = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Malformed JSON" }, { status: 400 });
  }

  const { sales, unmapped, reason } = parseShopify(order as Parameters<typeof parseShopify>[0]);
  if (reason) {
    console.warn(`[shopify] not actionable: ${reason}`);
    return NextResponse.json({ ok: true, ignored: reason });
  }

  if (unmapped.length) {
    // Not fatal — the rest of the order still ships — but somebody has to fix
    // the SKU, so it is logged as an error rather than a note.
    console.error(
      `[shopify] unmapped line items (add them to packaging/listings/_imports/sku-map.json): ${unmapped.join(", ")}`
    );
  }

  const delivered: string[] = [];
  const failed: string[] = [];

  for (const sale of sales) {
    const result = await issueGrant({
      platform: "SHOPIFY",
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
        `[shopify] PAID BUT UNDELIVERABLE ref=${sale.reference} email=${sale.email} — ${result.reason}`
      );
      failed.push(sale.productSlug);
      continue;
    }

    if (result.status === "already-issued") {
      delivered.push(`${sale.productSlug} (already sent)`);
      continue;
    }

    const product = findProduct(sale.productSlug)!;
    const outcome = await deliverDownload({
      email: sale.email,
      token: result.token!,
      product,
      tierName: result.tierName,
      expiresAt: result.expiresAt,
      maxDownloads: result.maxDownloads,
      platform: "shopify",
    });
    logFulfilment(outcome, {
      platform: "shopify",
      email: sale.email,
      productSlug: sale.productSlug,
      tier: sale.tier,
    });
    delivered.push(sale.productSlug);
  }

  return NextResponse.json({ ok: true, delivered, failed, unmapped });
}
