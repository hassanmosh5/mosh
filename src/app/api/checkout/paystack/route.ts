import { NextResponse } from "next/server";
import { z } from "zod";

import { findProduct, findTier, loadCatalog } from "@/lib/fulfilment/catalog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  productSlug: z.string().min(1),
  tier: z.string().min(1),
  email: z.email(),
});

function priceGhs(productPriceUsd: number, multiplier: number, rate: number, roundTo: number): number {
  return Math.ceil((productPriceUsd * multiplier * rate) / roundTo) * roundTo;
}

export async function POST(request: Request) {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json(
      { error: "Payments are not configured yet. PAYSTACK_SECRET_KEY is missing." },
      { status: 503 }
    );
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid email and choose a licence." }, { status: 400 });
  }

  const { productSlug, tier, email } = parsed.data;
  const catalog = loadCatalog();
  const product = findProduct(productSlug);
  const tierRecord = findTier(tier);

  if (!product) return NextResponse.json({ error: "Product not found." }, { status: 404 });
  if (!tierRecord) return NextResponse.json({ error: "Licence not found." }, { status: 404 });

  const currency = catalog.currency;
  const amountGhs = priceGhs(
    product.priceUsd,
    tierRecord.multiplier,
    currency.ghsPerUsd,
    currency.roundTo.GHS
  );
  const amountMinor = amountGhs * 100;
  const reference = `MOSH-${product.slug}-${tierRecord.id}-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
  const origin = process.env.SITE_URL?.replace(/\/$/, "") ?? new URL(request.url).origin;

  const response = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email.trim().toLowerCase(),
      amount: String(amountMinor),
      currency: "GHS",
      reference,
      callback_url: `${origin}/checkout/paystack?reference=${encodeURIComponent(reference)}`,
      metadata: {
        product_slug: product.slug,
        tier: tierRecord.id,
        custom_fields: [
          { display_name: "Product", variable_name: "product_slug", value: product.slug },
          { display_name: "Licence", variable_name: "tier", value: tierRecord.id },
        ],
      },
    }),
    cache: "no-store",
  });

  const body = (await response.json().catch(() => null)) as {
    status?: boolean;
    message?: string;
    data?: { authorization_url?: string; reference?: string };
  } | null;

  if (!response.ok || !body?.status || !body.data?.authorization_url) {
    console.error(`[checkout] Paystack initialization failed: ${response.status}`, body?.message);
    return NextResponse.json(
      { error: body?.message ?? "Paystack could not start the payment." },
      { status: 502 }
    );
  }

  return NextResponse.json({
    authorizationUrl: body.data.authorization_url,
    reference: body.data.reference ?? reference,
    product: product.name,
    tier: tierRecord.name,
    amountGhs,
  });
}
