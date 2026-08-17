/**
 * The manual fulfilment path.
 *
 * WhatsApp Business has no payment API, so a mobile-money sale is confirmed by
 * a human and delivered through here. It is also the support route for a buyer
 * who lost their link on any platform.
 *
 * Guarded by a bearer token, because it can hand out anything in the catalogue.
 */

import { NextResponse } from "next/server";
import { z } from "zod";

import { findProduct } from "@/lib/fulfilment/catalog";
import { deliverDownload, logFulfilment } from "@/lib/fulfilment/delivery";
import { issueGrant } from "@/lib/fulfilment/grants";
import { verifyAdminToken } from "@/lib/fulfilment/signatures";
import { downloadUrl } from "@/lib/fulfilment/tokens";
import { loadCatalog } from "@/lib/fulfilment/catalog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  productSlug: z.string().min(1),
  tier: z.string().min(1),
  email: z.email(),
  /** The mobile-money transaction id, bank reference, or whatever you can reconcile against. */
  reference: z.string().min(3).max(120),
  platform: z.enum(["WHATSAPP", "MANUAL"]).default("WHATSAPP"),
  amountMinor: z.number().int().nonnegative().default(0),
  currency: z.string().length(3).default("GHS"),
  /** Off by default: on WhatsApp you usually paste the link into the chat yourself. */
  sendEmail: z.boolean().default(false),
});

export async function POST(request: Request) {
  const authorised = verifyAdminToken(
    request.headers.get("authorization"),
    process.env.FULFILMENT_ADMIN_TOKEN
  );
  if (!authorised.ok) {
    console.warn(`[manual] rejected: ${authorised.reason}`);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", issues: z.treeifyError(parsed.error) },
      { status: 400 }
    );
  }

  const input = parsed.data;
  const result = await issueGrant({
    platform: input.platform,
    reference: input.reference,
    email: input.email,
    productSlug: input.productSlug,
    tier: input.tier,
    amountMinor: input.amountMinor,
    currency: input.currency,
    payload: { source: "manual", enteredAt: new Date().toISOString() },
  });

  if (result.status === "unknown-product" || result.status === "not-built") {
    return NextResponse.json({ error: result.reason }, { status: 422 });
  }

  if (result.status === "already-issued") {
    return NextResponse.json(
      {
        error: `Reference "${input.reference}" has already been fulfilled. Its token cannot be shown again — issue a new link with the reissue script if the buyer lost theirs.`,
        saleId: result.saleId,
      },
      { status: 409 }
    );
  }

  const catalog = loadCatalog();
  const link = downloadUrl(process.env.SITE_URL ?? catalog.meta.siteUrl, result.token!);
  const product = findProduct(input.productSlug)!;

  let emailed = false;
  if (input.sendEmail) {
    const outcome = await deliverDownload({
      email: input.email,
      token: result.token!,
      product,
      tierName: result.tierName,
      expiresAt: result.expiresAt,
      maxDownloads: result.maxDownloads,
      platform: input.platform.toLowerCase(),
    });
    logFulfilment(outcome, {
      platform: input.platform.toLowerCase(),
      email: input.email,
      productSlug: input.productSlug,
      tier: input.tier,
    });
    emailed = outcome.sent;
  }

  console.info(
    `[manual] granted ${input.productSlug}/${input.tier} to ${input.email} against ${input.reference}`
  );

  return NextResponse.json({
    ok: true,
    link,
    emailed,
    product: product.name,
    tier: result.tierName,
    expiresAt: result.expiresAt.toISOString(),
    maxDownloads: result.maxDownloads,
  });
}
