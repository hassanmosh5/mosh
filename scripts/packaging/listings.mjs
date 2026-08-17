#!/usr/bin/env node
/**
 * Writes the paste-ready listing for every product on every platform.
 *
 * Output goes to packaging/listings/, which is committed: the copy is the
 * deliverable, and someone should be able to read and edit it without running
 * Node. Regenerate with `npm run pkg:listings` after any catalogue change.
 *
 * Every character limit is enforced by throwing. A listing that arrives
 * truncated on a marketplace is worse than a build that fails here.
 */

import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

import { PACKAGING_DIR, ROOT, fit, formatMoney, loadCatalog, platform } from "./catalog.mjs";
import { descriptionHtml, guarantee, longDescription, trimToSentence } from "./copy.mjs";

const LISTINGS_DIR = join(PACKAGING_DIR, "listings");

const counted = (label, value, max) =>
  `**${label}** — ${value.length}/${max} characters\n\n\`\`\`\n${value}\n\`\`\`\n`;

function header(product, platformName, catalog) {
  return `# ${product.name} — ${platformName} listing

> Generated from \`packaging/products/${product.sourceFile}\` by \`npm run pkg:listings\`.
> Edit the catalogue, not this file — it is overwritten on every run.

Paste each block into the matching field. Character counts are shown so nothing
arrives truncated.

Images for this product: \`dist/mockups/${product.slug}/\` — cover, square, story and gallery shots.
Package files: \`dist/packages/${product.slug}/\` — one ZIP per licence tier.
Support address on all listings: ${catalog.meta.supportEmail}

---
`;
}

// ---------------------------------------------------------------- Gumroad

function gumroad(product, catalog) {
  const limits = platform(catalog, "gumroad").limits;
  const name = fit(product.name, limits.name.max, `${product.slug} gumroad name`);
  const summary = fit(
    trimToSentence(product.oneLiner, limits.summary.max),
    limits.summary.max,
    `${product.slug} gumroad summary`
  );
  const description = fit(
    longDescription(product, catalog, { currency: "USD", includePrices: false }),
    limits.description.max,
    `${product.slug} gumroad description`
  );
  const tags = product.keywords.slice(0, limits.tags.maxCount).map((tag) => tag.slice(0, limits.tags.maxLength));

  return `${header(product, "Gumroad", catalog)}
## Product setup

| Field | Value |
|---|---|
| Type | Digital product |
| URL / permalink | \`${product.slug}\` → https://${catalog.meta.gumroadHandle}.gumroad.com/l/${product.slug} |
| Category | ${product.category.name} |
| Call to action | I want this! |

${counted("Name", name, limits.name.max)}
${counted("Summary (shows under the title)", summary, limits.summary.max)}
**Tags** — ${tags.length}/${limits.tags.maxCount}

\`\`\`
${tags.join(", ")}
\`\`\`

## Versions — one product, three prices

Use Gumroad **Versions**, not three separate products. Three products split your
reviews and your ranking three ways.

| Version | Price | Attach this file |
|---|---|---|
${product.tiers
  .map(
    (tier) =>
      `| ${tier.name}${tier.default ? " ← set as default" : ""} | ${formatMoney(tier.pricing.usd, "USD")} | \`${product.slug}-${tier.id}.zip\` |`
  )
  .join("\n")}

Gumroad attaches different files to different versions. Use that rather than
maintaining three products by hand.

**Purchasing power parity:** turn it on. This is built for buyers on metered
data; pricing in US dollars without PPP prices most of them out of it.

## Description — paste into the description field

${counted("Description", description, limits.description.max)}

## Cover and thumbnail

Gumroad wants a 1280×720 cover and a 600×600 thumbnail.

- Cover: \`dist/mockups/${product.slug}/cover.png\` (already 1280×720)
- Thumbnail: \`dist/mockups/${product.slug}/square.png\` — crop to 600×600
- Extra gallery images: \`dist/mockups/${product.slug}/gallery-*.png\`

These are screenshots of the product running, not stock photography. That is
deliberate — the cover shows what arrives.

## Receipt / thank-you note

Paste into **Content → Receipt note**:

\`\`\`
${
  product.usage
    .slice(0, 3)
    .map((step, index) => `${index + 1}. ${step}`)
    .join("\n")
}
\`\`\`

The full receipt text is in \`dist/packages/${product.slug}/receipt-<tier>.txt\`.

## Delivery

Gumroad hosts the file and emails the link itself — nothing else to configure.

If you also want the sale recorded in your own database, point
**Settings → Advanced → Ping** at:

\`\`\`
${catalog.meta.siteUrl}/api/webhooks/gumroad?secret=YOUR_GUMROAD_PING_SECRET
\`\`\`

Gumroad does not sign its pings, so the URL secret and the seller-ID check in
that route are what authenticate it. See \`docs/SELLING.md\`.

---
${guarantee(catalog)}
`;
}

// ------------------------------------------------------------------ Selar

function selar(product, catalog) {
  const limits = platform(catalog, "selar").limits;
  const name = fit(product.name, limits.name.max, `${product.slug} selar name`);
  const summary = fit(
    trimToSentence(product.tagline, limits.summary.max),
    limits.summary.max,
    `${product.slug} selar summary`
  );
  const description = fit(
    longDescription(product, catalog, { currency: "GHS", includePrices: false }),
    limits.description.max,
    `${product.slug} selar description`
  );

  return `${header(product, "Selar", catalog)}
## Why Selar for this catalogue

It settles in cedis and naira, accepts mobile money and bank transfer as well as
cards, and pays out locally. For West African buyers it converts better than a
dollar checkout, and the buyer is not paying a card's FX spread on top of your price.

## Product setup

| Field | Value |
|---|---|
| Product type | Digital product / downloadable |
| Link | \`${product.slug}\` → https://selar.com/${catalog.meta.selarHandle}/${product.slug} |
| Category | ${product.category.name} |

${counted("Product name", name, limits.name.max)}
${counted("Short description", summary, limits.summary.max)}

## Pricing

| Licence | GHS | NGN | USD |
|---|---|---|---|
${product.tiers
  .map(
    (tier) =>
      `| ${tier.name}${tier.default ? " (default)" : ""} | ${formatMoney(tier.pricing.ghs, "GHS")} | ${formatMoney(tier.pricing.ngn, "NGN")} | ${formatMoney(tier.pricing.usd, "USD")} |`
  )
  .join("\n")}

Rates were converted at ${catalog.currency.ghsPerUsd} GHS and ${catalog.currency.ngnPerUsd} NGN
to the dollar, noted ${catalog.currency.rateNotedOn}. **Re-check before launch** —
a stale rate quietly changes your margin.

## Description

${counted("Description", description, limits.description.max)}

## Images

- Main: \`dist/mockups/${product.slug}/square.png\`
- Additional: \`dist/mockups/${product.slug}/cover.png\`, \`gallery-*.png\`

## Delivery

Selar delivers the file itself. Upload \`${product.slug}-studio.zip\` as the
product file, and the other two tiers as separate products or variants depending
on what your Selar plan supports.

To mirror sales into your own records, set the webhook to:

\`\`\`
${catalog.meta.siteUrl}/api/webhooks/selar
\`\`\`

**Before you rely on that webhook:** confirm the signature header and algorithm
with Selar's current documentation and set \`SELAR_WEBHOOK_SECRET\` (and
\`SELAR_SIGNATURE_HEADER\` if it differs from the default). The route refuses
unverified requests rather than guessing — see \`docs/SELLING.md\`.

---
${guarantee(catalog)}
`;
}

// ---------------------------------------------------------------- Shopify

function shopify(product, catalog) {
  const limits = platform(catalog, "shopify").limits;
  const title = fit(product.name, limits.title.max, `${product.slug} shopify title`);
  const seoTitle = fit(
    trimToSentence(`${product.name} — ${product.tagline}`, limits.seoTitle.max),
    limits.seoTitle.max,
    `${product.slug} shopify seo title`
  );
  const metaDescription = fit(
    trimToSentence(product.oneLiner, limits.metaDescription.max),
    limits.metaDescription.max,
    `${product.slug} shopify meta description`
  );
  const html = fit(
    descriptionHtml(product, catalog),
    limits.description.max,
    `${product.slug} shopify description`
  );

  return `${header(product, "Shopify", catalog)}
## Product setup

| Field | Value |
|---|---|
| Handle | \`${product.slug}\` |
| Product type | Digital download |
| Vendor | ${catalog.meta.brand} |
| Collection | ${product.category.glyph} ${product.category.name} |
| Charge tax | Your call — digital goods are taxed differently by market |
| **This is a physical product** | **Untick.** Nothing here ships. |
| Inventory tracking | Off |

${counted("Title", title, limits.title.max)}
${counted("SEO title", seoTitle, limits.seoTitle.max)}
${counted("Meta description", metaDescription, limits.metaDescription.max)}

**Tags**

\`\`\`
${product.keywords.slice(0, limits.tags.maxCount).join(", ")}
\`\`\`

## Variants — one per licence

| Option: Licence | Price | SKU | File |
|---|---|---|---|
${product.tiers
  .map(
    (tier) =>
      `| ${tier.name} | ${formatMoney(tier.pricing.usd, "USD")} | \`${product.slug.toUpperCase().replace(/-/g, "")}-${tier.id.toUpperCase()}\` | \`${product.slug}-${tier.id}.zip\` |`
  )
  .join("\n")}

## Description (HTML) — paste into the code view of the description box

\`\`\`html
${html}
\`\`\`

## Images

Upload in this order:

1. \`dist/mockups/${product.slug}/square.png\` — main image, square, works in every grid
2. \`dist/mockups/${product.slug}/cover.png\`
3. \`dist/mockups/${product.slug}/gallery-*.png\`

## Digital delivery — read this before publishing

**Shopify does not deliver digital files on its own.** Pick one:

**Option A — a digital-downloads app.** Simplest. Install one, attach the ZIP
per variant, and it emails the buyer. No code, a monthly fee, and the buyer's
download lives inside that app.

**Option B — this repository's own fulfilment.** Create a webhook under
Settings → Notifications → Webhooks:

| Field | Value |
|---|---|
| Event | \`orders/paid\` |
| Format | JSON |
| URL | \`${catalog.meta.siteUrl}/api/webhooks/shopify\` |

Copy the signing secret Shopify shows you into \`SHOPIFY_WEBHOOK_SECRET\`. The
route verifies the HMAC on the raw body, matches each line item's SKU to a
package, and emails a signed download link that expires in
${catalog.policies.downloadWindowDays} days after ${catalog.policies.maxDownloads} downloads.

Map each variant SKU in \`packaging/sku-map.json\` so the webhook knows which
ZIP a line item refers to.

---
${guarantee(catalog)}
`;
}

// --------------------------------------------------------------- Paystack

function paystack(product, catalog) {
  const limits = platform(catalog, "paystack").limits;
  const name = fit(product.name, limits.name.max, `${product.slug} paystack name`);
  const description = fit(
    trimToSentence(
      `${product.oneLiner}\n\n${product.solves
        .slice(0, 3)
        .map((item) => `• ${item}`)
        .join("\n")}\n\nInstant download after payment. ${catalog.policies.refundText}`,
      limits.description.max
    ),
    limits.description.max,
    `${product.slug} paystack description`
  );
  const tier = product.tiers.find((t) => t.default) ?? product.tiers[0];

  return `${header(product, "Paystack Storefront", catalog)}
## Why Paystack for this catalogue

Mobile money, bank transfer and cards, settled in cedis or naira into a local
account. The catch is that **Paystack takes the money but does not host files** —
delivery is this repository's webhook, which is why the setup below matters more
than the copy does.

## Product setup

| Field | Value |
|---|---|
| Product | ${name} |
| Price (GHS) | ${formatMoney(tier.pricing.ghs, "GHS")} |
| Price (NGN) | ${formatMoney(tier.pricing.ngn, "NGN")} |
| Quantity | Unlimited |
| Success message | See below |

${counted("Product name", name, limits.name.max)}
${counted("Description", description, limits.description.max)}

**Product image:** \`dist/mockups/${product.slug}/square.png\`

## Pricing across tiers

Paystack storefront products carry one price. Create three products — one per
licence — or sell the ${tier.name} here and handle upgrades by email.

| Licence | GHS | NGN |
|---|---|---|
${product.tiers
  .map((t) => `| ${t.name} | ${formatMoney(t.pricing.ghs, "GHS")} | ${formatMoney(t.pricing.ngn, "NGN")} |`)
  .join("\n")}

## Metadata — this is what makes delivery work

On the payment page or product, add custom fields so the webhook knows what was
bought:

\`\`\`json
{
  "product_slug": "${product.slug}",
  "tier": "${tier.id}"
}
\`\`\`

If you cannot set metadata on a storefront product, name the Paystack product
**exactly** \`${product.name}\` or exactly \`${product.slug}\`. The webhook matches on
either, exactly — it will not guess at a near match, because the products in
this catalogue differ by a word in places and sending the wrong one to a paying
customer is worse than a webhook that fails and tells you.

## Webhook

Dashboard → Settings → API Keys & Webhooks → Webhook URL:

\`\`\`
${catalog.meta.siteUrl}/api/webhooks/paystack
\`\`\`

The route verifies the \`x-paystack-signature\` HMAC-SHA512 against your secret
key on the raw body, ignores anything that is not \`charge.success\`, and
re-verifies the transaction against Paystack's API before issuing a link.
A duplicate delivery of the same reference does not issue a second grant.

## Success message

\`\`\`
Payment received. Your download link is on its way to the email address you
paid with — check spam if it is not there in two minutes.

Link valid for ${catalog.policies.downloadWindowDays} days, ${catalog.policies.maxDownloads} downloads.
Problems: ${catalog.meta.supportEmail}
\`\`\`

---
${guarantee(catalog)}
`;
}

// ------------------------------------------------------- WhatsApp Business

function whatsapp(product, catalog) {
  const limits = platform(catalog, "whatsapp").limits;
  const name = fit(product.name, limits.name.max, `${product.slug} whatsapp name`);
  const tier = product.tiers.find((t) => t.default) ?? product.tiers[0];
  const solo = product.tiers[0];

  const description = fit(
    trimToSentence(
      [
        product.oneLiner,
        "",
        "Solves:",
        product.solves
          .slice(0, 3)
          .map((item) => `• ${item}`)
          .join("\n"),
        "",
        `Works offline. No account. ${catalog.policies.refundText}`,
      ].join("\n"),
      limits.description.max
    ),
    limits.description.max,
    `${product.slug} whatsapp description`
  );

  return `${header(product, "WhatsApp Business", catalog)}
## How selling works here

There is no payment API and no automatic delivery. Money arrives by mobile money
or bank transfer, **you** confirm it, and then you issue the same signed download
link the automated platforms use:

\`\`\`bash
npm run pkg:grant -- --product ${product.slug} --tier ${tier.id} \\
  --email buyer@example.com --platform whatsapp --reference "MoMo TXN ID"
\`\`\`

That prints a link valid for ${catalog.policies.downloadWindowDays} days and
${catalog.policies.maxDownloads} downloads, and records the sale against the
transaction reference so you can reconcile it later. Never send the ZIP as a
WhatsApp attachment: it strips your record of who has what, and it gives you no
way to revoke access.

## Catalogue item

${counted("Item name", name, limits.name.max)}
${counted("Description", description, limits.description.max)}

| Field | Value |
|---|---|
| Price | ${formatMoney(solo.pricing.ghs, "GHS")} (Solo) |
| Image | \`dist/mockups/${product.slug}/square.png\` |
| Link | ${catalog.meta.siteUrl}/products/${product.slug} |

WhatsApp shows roughly the first 200 characters before a "more" link, so the
first sentence is doing nearly all of the work.

## Messages to send

**1 — When someone asks what it is**

\`\`\`
${product.name}

${product.tagline}.

${trimToSentence(product.problem, 320)}

What you get:
${product.inside
  .slice(0, 4)
  .map((item) => {
    // Most entries read "Name — what it does". The name alone is too terse for
    // a sales message, so keep the explanation when the name is short.
    const head = item.split("—")[0].trim();
    return `• ${head.length < 28 ? trimToSentence(item, 96) : head}`;
  })
  .join("\n")}

${formatMoney(solo.pricing.ghs, "GHS")} — one payment, yours forever.
Works offline, no subscription, ${catalog.policies.refundDays}-day refund.

Want it? Send "YES" and I'll send payment details.
\`\`\`

**2 — Payment details**

\`\`\`
Send ${formatMoney(solo.pricing.ghs, "GHS")} to:

MoMo: ${catalog.meta.whatsappNumber} (${catalog.meta.seller})
Reference: ${product.slug.toUpperCase().slice(0, 12)}

Send me the transaction ID when it's done and your email address.
Your download link comes back within the hour.
\`\`\`

**3 — After you have confirmed the payment**

\`\`\`
Payment confirmed — thank you.

Your download: [LINK]

Valid ${catalog.policies.downloadWindowDays} days, ${catalog.policies.maxDownloads} downloads.
Unzip it and open START-HERE.md first.

First three things to do:
${product.usage
  .slice(0, 3)
  .map((step, index) => `${index + 1}. ${trimToSentence(step, 90)}`)
  .join("\n")}

Any problem at all, message me here. ${catalog.policies.supportPromise}
\`\`\`

**4 — Follow-up, three days later**

\`\`\`
Did you get a chance to open it?

The part people skip is ${trimToSentence(product.usage[1], 140)}

If something didn't work, tell me and I'll fix it or refund you — either is fine.
\`\`\`

## Objection replies

**"Is it a subscription?"**
\`\`\`
No. One payment, the files are yours permanently. ${catalog.policies.updatePolicy}
\`\`\`

**"Can I use it for client work?"**
\`\`\`
The ${solo.name} is for your own business only.
For client work you want the ${tier.name} — ${formatMoney(tier.pricing.ghs, "GHS")} — which
also includes the client brief and delivery checklist.
\`\`\`

**"Does it need internet?"**
\`\`\`
No. Download it once and it runs offline forever. Nothing you type is uploaded
anywhere — it stays on your own device.
\`\`\`

**"What if it's not what I expected?"**
\`\`\`
${catalog.policies.refundText} No argument, no form to fill in.
\`\`\`

## Rules worth keeping

- Only message people who messaged you first, or who agreed to hear from you.
- Broadcast lists rather than groups. A group of strangers discussing your product is not a sales channel.
- One follow-up, then stop. Two is a nuisance and gets you blocked, which costs the number.

---
${guarantee(catalog)}
`;
}

// ------------------------------------------------------------- CSV imports

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function csvRow(values) {
  return values.map(csvEscape).join(",");
}

function shopifyCsv(catalog) {
  const columns = [
    "Handle", "Title", "Body (HTML)", "Vendor", "Type", "Tags", "Published",
    "Option1 Name", "Option1 Value", "Variant SKU", "Variant Grams",
    "Variant Inventory Tracker", "Variant Inventory Policy",
    "Variant Fulfillment Service", "Variant Price", "Variant Requires Shipping",
    "Variant Taxable", "Image Src", "Image Position", "Image Alt Text",
    "SEO Title", "SEO Description", "Status",
  ];

  const rows = [csvRow(columns)];

  for (const product of catalog.products) {
    product.tiers.forEach((tier, index) => {
      const first = index === 0;
      rows.push(
        csvRow([
          product.slug,
          first ? product.name : "",
          first ? descriptionHtml(product, catalog) : "",
          first ? catalog.meta.brand : "",
          first ? "Digital download" : "",
          first ? product.keywords.slice(0, 60).join(", ") : "",
          first ? "TRUE" : "",
          "Licence",
          tier.name,
          `${product.slug.toUpperCase().replace(/-/g, "")}-${tier.id.toUpperCase()}`,
          0,
          "",
          "continue",
          "manual",
          tier.pricing.usd,
          "FALSE",
          "TRUE",
          first ? `${catalog.meta.siteUrl}/mockups/${product.slug}/square.png` : "",
          first ? 1 : "",
          first ? `${product.name} — ${product.tagline}` : "",
          first ? trimToSentence(`${product.name} — ${product.tagline}`, 70) : "",
          first ? trimToSentence(product.oneLiner, 155) : "",
          first ? "active" : "",
        ])
      );
    });
  }

  return rows.join("\n") + "\n";
}

/** Meta commerce catalogue feed — the format WhatsApp reads its catalogue from. */
function whatsappCsv(catalog) {
  const columns = [
    "id", "title", "description", "availability", "condition", "price",
    "link", "image_link", "brand", "google_product_category",
  ];
  const rows = [csvRow(columns)];

  for (const product of catalog.products) {
    const tier = product.tiers[0];
    rows.push(
      csvRow([
        product.slug,
        trimToSentence(product.name, 200),
        trimToSentence(`${product.oneLiner} Works offline, no account, one payment.`, 800),
        "in stock",
        "new",
        `${tier.pricing.ghs} GHS`,
        `${catalog.meta.siteUrl}/products/${product.slug}`,
        `${catalog.meta.siteUrl}/mockups/${product.slug}/square.png`,
        catalog.meta.brand,
        "Software",
      ])
    );
  }

  return rows.join("\n") + "\n";
}

function skuMap(catalog) {
  const map = {};
  for (const product of catalog.products) {
    for (const tier of product.tiers) {
      map[`${product.slug.toUpperCase().replace(/-/g, "")}-${tier.id.toUpperCase()}`] = {
        slug: product.slug,
        tier: tier.id,
      };
    }
  }
  return map;
}

// ------------------------------------------------------------------- index

function indexPage(catalog) {
  const byCategory = catalog.categories.map((category) => {
    const products = catalog.products.filter((p) => p.category.id === category.id);
    const rows = products
      .map(
        (product) =>
          `| [${product.name}](${product.slug}/) | ${product.tagline} | $${product.priceUsd} | ${formatMoney(product.tiers[0].pricing.ghs, "GHS")} |`
      )
      .join("\n");
    return `### ${category.glyph} ${category.name}

*${category.blurb}*

| Product | What it is | From (USD) | From (GHS) |
|---|---|---|---|
${rows}
`;
  });

  return `# Listings — every product, every platform

Generated by \`npm run pkg:listings\`. **Do not edit these files**; edit
\`packaging/catalog.json\` and \`packaging/products/*.json\` and regenerate.

${catalog.products.length} products × ${catalog.platforms.length} platforms.
Catalogue value if bought one at a time: **$${catalog.products.reduce((sum, p) => sum + p.priceUsd, 0)}**.

## Each product folder contains

| File | Platform |
|---|---|
${catalog.platforms.map((p) => `| \`${p.id}.md\` | ${p.name} |`).join("\n")}

## Bulk imports

| File | What it is |
|---|---|
| \`_imports/shopify-products.csv\` | Every product with its three variants, ready for Shopify's product importer |
| \`_imports/whatsapp-catalogue.csv\` | Meta commerce feed for the WhatsApp Business catalogue |
| \`_imports/sku-map.json\` | Variant SKU → package, used by the Shopify webhook at fulfilment time |
| \`_imports/price-list.csv\` | Every product × tier × currency, for your own records |

## Bundles

| Bundle | Contains | Price | Parts total | You save |
|---|---|---|---|---|
${catalog.bundles
  .map(
    (bundle) =>
      `| ${bundle.name} | ${bundle.productSlugs.length} products | $${bundle.priceUsd} | $${bundle.sumUsd} | ${bundle.savingPercent}% |`
  )
  .join("\n")}

## Products

${byCategory.join("\n")}

---

Before publishing anything, run \`npm run pkg:verify\`. It fails while any
\`${catalog.meta.placeholderMarker}\` placeholder is still in the catalogue, so a
listing cannot go out pointing at an example domain.
`;
}

function priceListCsv(catalog) {
  const rows = [csvRow(["slug", "product", "category", "tier", "seats", "client_work", "usd", "ghs", "ngn"])];
  for (const product of catalog.products) {
    for (const tier of product.tiers) {
      rows.push(
        csvRow([
          product.slug,
          product.name,
          product.category.name,
          tier.name,
          tier.seats,
          tier.clientWork ? "yes" : "no",
          tier.pricing.usd,
          tier.pricing.ghs,
          tier.pricing.ngn,
        ])
      );
    }
  }
  return rows.join("\n") + "\n";
}

function main() {
  const catalog = loadCatalog();
  rmSync(LISTINGS_DIR, { recursive: true, force: true });
  mkdirSync(join(LISTINGS_DIR, "_imports"), { recursive: true });

  const renderers = { gumroad, selar, shopify, paystack, whatsapp };
  let written = 0;

  for (const product of catalog.products) {
    const dir = join(LISTINGS_DIR, product.slug);
    mkdirSync(dir, { recursive: true });
    for (const [id, render] of Object.entries(renderers)) {
      writeFileSync(join(dir, `${id}.md`), render(product, catalog));
      written++;
    }
  }

  writeFileSync(join(LISTINGS_DIR, "_imports", "shopify-products.csv"), shopifyCsv(catalog));
  writeFileSync(join(LISTINGS_DIR, "_imports", "whatsapp-catalogue.csv"), whatsappCsv(catalog));
  writeFileSync(join(LISTINGS_DIR, "_imports", "price-list.csv"), priceListCsv(catalog));
  writeFileSync(
    join(LISTINGS_DIR, "_imports", "sku-map.json"),
    JSON.stringify(skuMap(catalog), null, 2) + "\n"
  );
  writeFileSync(join(LISTINGS_DIR, "README.md"), indexPage(catalog));

  console.log(`${written} listings + 4 import files → ${relative(ROOT, LISTINGS_DIR)}`);
}

main();
