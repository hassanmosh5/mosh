# The Wealth Ideas Prompt Generator — Shopify listing

> Generated from `packaging/products/02-package.json` by `npm run pkg:listings`.
> Edit the catalogue, not this file — it is overwritten on every run.

Paste each block into the matching field. Character counts are shown so nothing
arrives truncated.

Images for this product: `dist/mockups/prompt-generator/` — cover, square, story and gallery shots.
Package files: `dist/packages/prompt-generator/` — one ZIP per licence tier.
Support address on all listings: hassanmosh5@gmail.com

---

## Product setup

| Field | Value |
|---|---|
| Handle | `prompt-generator` |
| Product type | Digital download |
| Vendor | MOSH Digital Studios |
| Collection | ðŸ“¦ Package & sell |
| Charge tax | Your call — digital goods are taxed differently by market |
| **This is a physical product** | **Untick.** Nothing here ships. |
| Inventory tracking | Off |

**Title** — 33/70 characters

```
The Wealth Ideas Prompt Generator
```

**SEO title** — 68/70 characters

```
The Wealth Ideas Prompt Generator — 99,000 prompts from one matrix,…
```

**Meta description** — 150/155 characters

```
The Wealth Ideas Matrix wired into the CLEAR formula: pick role, context, audience, offer and niche, get a complete prompt — then a pack you can list.
```


**Tags**

```
prompt generator, clear formula, wealth ideas matrix, prompt pack builder, chatgpt prompts, ai prompt structure, listing copy, digital product, niche prompts, offline app
```

## Variants — one per licence

| Option: Licence | Price | SKU | File |
|---|---|---|---|
| Solo licence | $29 | `PROMPTGENERATOR-SOLO` | `prompt-generator-solo.zip` |
| Studio licence | $73 | `PROMPTGENERATOR-STUDIO` | `prompt-generator-studio.zip` |
| Agency licence | $145 | `PROMPTGENERATOR-AGENCY` | `prompt-generator-agency.zip` |

## Description (HTML) — paste into the code view of the description box

```html
<p><strong>The Wealth Ideas Matrix wired into the CLEAR formula: pick role, context, audience, offer and niche, get a complete prompt — then a pack you can list.</strong></p>
<h3>The problem</h3>
<p>A hundred rows of expert roles, business contexts, audiences, offers and niches is a reference table — useful to look at, impossible to use. The CLEAR structure is exactly what those columns were built for, and joining the two turns a table into a prompt generator. Most people never make that join, so the matrix stays a document and the prompts stay vague.</p>
<p>It deals specifically with:</p>
<ul><li>Prompts missing the role, audience and output specification that decide the quality</li><li>Rewriting the same prompt skeleton for every new client or niche</li><li>Prompt packs assembled by hand, one prompt at a time</li><li>Listing copy for a pack written from nothing at the end of a long build</li></ul>
<h3>Who it is for</h3>
<ul><li>Anyone whose prompts are one line long and produce one-line-quality output</li><li>Sellers building prompt packs for niches they do not personally work in</li><li>People who want variety without writing every prompt by hand</li></ul>
<h3>What you get</h3>
<ul><li>The generator — every CLEAR field pre-populated from the matrix, editable, combining into complete prompts</li><li>The Wealth Ideas Matrix itself: expert roles, business contexts, audiences, income-stream offers, niches</li><li>A pack builder that assembles selected prompts into a sellable file</li><li>Listing-copy generator for the finished pack</li><li>Saved sets, so a client&#39;s configuration is one click away next time</li></ul>
<p>Delivered as a ZIP: the app, a START-HERE page, full usage instructions, your licence, and a checksum list of every file. Free updates to the version you bought for 12 months. You keep the files forever either way.</p>
<h3>How you use it</h3>
<ol><li>Open index.html and pick a row of the matrix that resembles your buyer.</li><li>Edit each CLEAR field — the defaults are a starting point, not the answer.</li><li>Copy the assembled prompt into any model and check the output before you sell it.</li><li>Collect the ones that worked into a pack in the builder.</li><li>Generate the listing copy and export.</li></ol>
<h3>What should be true when you finish</h3>
<ul><li>Prompts that carry context, role and output format every time</li><li>A finished prompt pack for a niche, built in an afternoon</li><li>Listing copy generated from the pack rather than invented afterwards</li></ul>
<h3>Do not buy this if</h3>
<ul><li>Anyone wanting curated, ready-to-use prompts rather than combinations — buy the Prompt Packs instead</li><li>People who will sell packs without testing a single prompt</li></ul>
<h3>What it cannot do</h3>
<p>Combinatorial by design: it generates structure, and the judgement about which combinations are worth selling stays yours.</p>
<p><em>These are decision and drafting tools, not professional advice. They compute from figures you supply and cannot verify any of them. Nothing here is financial, legal, tax, medical or investment advice.</em></p>
<h3>Guarantee</h3>
<p>14-day refund, no questions asked. Reply to your receipt and say the word. Support: hassanmosh5@gmail.com — One reply within two working days, from the person who built it.</p>
```

## Images

Upload in this order:

1. `dist/mockups/prompt-generator/square.png` — main image, square, works in every grid
2. `dist/mockups/prompt-generator/cover.png`
3. `dist/mockups/prompt-generator/gallery-*.png`

## Digital delivery — read this before publishing

**Shopify does not deliver digital files on its own.** Pick one:

**Option A — a digital-downloads app.** Simplest. Install one, attach the ZIP
per variant, and it emails the buyer. No code, a monthly fee, and the buyer's
download lives inside that app.

**Option B — this repository's own fulfilment.** Create a webhook under
Settings → Notifications → Webhooks:

| Field | Value |
|---|---|
| Event | `orders/paid` |
| Format | JSON |
| URL | `https://paystack.shop/mosh-digital-studios/api/webhooks/shopify` |

Copy the signing secret Shopify shows you into `SHOPIFY_WEBHOOK_SECRET`. The
route verifies the HMAC on the raw body, matches each line item's SKU to a
package, and emails a signed download link that expires in
30 days after 8 downloads.

Map each variant SKU in `packaging/sku-map.json` so the webhook knows which
ZIP a line item refers to.

---
14-day refund, no questions asked. Reply to your receipt and say the word.

Support: hassanmosh5@gmail.com — One reply within two working days, from the person who built it.
