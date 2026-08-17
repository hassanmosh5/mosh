#!/usr/bin/env node
/**
 * Issues a download link for a sale that arrived outside a webhook — a
 * mobile-money payment on WhatsApp, a bank transfer, a manual refund reversal.
 *
 *   npm run pkg:grant -- --product launch-kit --tier solo \
 *     --email buyer@example.com --reference "MoMo 8842119" [--send-email]
 *
 * It calls the same API route the webhooks use rather than touching the
 * database directly, so there is exactly one code path that can create a grant
 * and exactly one place where that logic can be wrong.
 */

import { loadCatalog } from "./catalog.mjs";

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index++) {
    const token = argv[index];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) {
      args[key] = true;
    } else {
      args[key] = next;
      index++;
    }
  }
  return args;
}

function usage(catalog, message) {
  const tiers = catalog.tiers.map((tier) => tier.id).join(" | ");
  console.error(`${message}

Usage:
  npm run pkg:grant -- --product <slug> --tier <${tiers}> \\
    --email <buyer@example.com> --reference <payment reference> \\
    [--platform WHATSAPP|MANUAL] [--amount <minor units>] [--currency GHS] [--send-email]

Environment:
  SITE_URL                 where the app is running (default http://localhost:3000)
  FULFILMENT_ADMIN_TOKEN   the same value the server has

Products: ${catalog.products.length} in the catalogue — see packaging/listings/README.md
`);
  process.exit(1);
}

async function main() {
  const catalog = loadCatalog();
  const args = parseArgs(process.argv.slice(2));

  if (args.help) usage(catalog, "Issue a download link for a manually-confirmed payment.");

  const productSlug = args.product;
  const tier = args.tier ?? (catalog.tiers.find((entry) => entry.default) ?? catalog.tiers[0]).id;
  const email = args.email;
  const reference = args.reference;

  if (!productSlug || !email || !reference) {
    usage(catalog, "Missing --product, --email or --reference.");
  }

  const product = catalog.products.find((entry) => entry.slug === productSlug);
  if (!product) usage(catalog, `Unknown product "${productSlug}".`);
  if (!catalog.tiers.some((entry) => entry.id === tier)) usage(catalog, `Unknown tier "${tier}".`);

  const siteUrl = process.env.SITE_URL ?? "http://localhost:3000";
  const adminToken = process.env.FULFILMENT_ADMIN_TOKEN;
  if (!adminToken) usage(catalog, "FULFILMENT_ADMIN_TOKEN is not set in this shell.");

  const tierRecord = catalog.tiers.find((entry) => entry.id === tier);
  const response = await fetch(`${siteUrl.replace(/\/$/, "")}/api/fulfilment/grant`, {
    method: "POST",
    headers: { Authorization: `Bearer ${adminToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      productSlug,
      tier,
      email,
      reference,
      platform: (args.platform ?? "WHATSAPP").toUpperCase(),
      amountMinor: Number(args.amount ?? tierRecord.pricing.ghs * 100),
      currency: (args.currency ?? "GHS").toUpperCase(),
      sendEmail: Boolean(args["send-email"]),
    }),
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    console.error(`\n✗ ${response.status}: ${body.error ?? "request failed"}\n`);
    process.exit(1);
  }

  console.log(`
✓ ${body.product} — ${body.tier}
  Buyer:      ${email}
  Reference:  ${reference}
  Expires:    ${body.expiresAt.slice(0, 10)} · ${body.maxDownloads} downloads
  Emailed:    ${body.emailed ? "yes" : "no — send the link yourself"}

  ${body.link}

Paste that into the chat with the message in
packaging/listings/${productSlug}/whatsapp.md ("After you have confirmed the payment").
`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
