# MOSH Packaging Agent — Shopify listing

> Generated from `packaging/products/02-package.json` by `npm run pkg:listings`.
> Edit the catalogue, not this file — it is overwritten on every run.

Paste each block into the matching field. Character counts are shown so nothing
arrives truncated.

Images for this product: `dist/mockups/packaging-agent/` — cover, square, story and gallery shots.
Package files: `dist/packages/packaging-agent/` — one ZIP per licence tier.
Support address on all listings: hassanmosh5@gmail.com

---

## Product setup

| Field | Value |
|---|---|
| Handle | `packaging-agent` |
| Product type | Digital download |
| Vendor | MOSH Digital Studios |
| Collection | ðŸ“¦ Package & sell |
| Charge tax | Your call — digital goods are taxed differently by market |
| **This is a physical product** | **Untick.** Nothing here ships. |
| Inventory tracking | Off |

**Title** — 20/70 characters

```
MOSH Packaging Agent
```

**SEO title** — 60/70 characters

```
MOSH Packaging Agent — Ten fields in, a sellable product out
```

**Meta description** — 153/155 characters

```
Turns one finished asset into the whole commercial package: four priced tiers, ~50 files, four marketplace listings, 120 keywords, 50 posts and a launch…
```


**Tags**

```
digital product packaging, product listing generator, gumroad listing, selar, licence template, product tiers, launch plan, marketplace seo, zip export, offline app
```

## Variants — one per licence

| Option: Licence | Price | SKU | File |
|---|---|---|---|
| Solo licence | $69 | `PACKAGINGAGENT-SOLO` | `packaging-agent-solo.zip` |
| Studio licence | $173 | `PACKAGINGAGENT-STUDIO` | `packaging-agent-studio.zip` |
| Agency licence | $345 | `PACKAGINGAGENT-AGENCY` | `packaging-agent-agency.zip` |

## Description (HTML) — paste into the code view of the description box

```html
<p><strong>Turns one finished asset into the whole commercial package: four priced tiers, ~50 files, four marketplace listings, 120 keywords, 50 posts and a launch plan, as a ZIP.</strong></p>
<h3>The problem</h3>
<p>An AI output is not a product. The gap between the two is not creativity, it is a list of specific artefacts: a licence saying what a buyer may resell, a price that sits somewhere defensible, a file list published before payment, a paragraph naming what the thing cannot do. That list is finite, nearly identical for every digital product, and writing it by hand for the fourth time is the reason most finished assets never get listed.</p>
<p>It deals specifically with:</p>
<ul><li>Finished work that never ships because packaging it is a day of tedium</li><li>Listings rewritten from scratch for each marketplace and truncated on paste</li><li>Prices picked by feel, with no tier structure underneath them</li><li>No licence — the most common cause of a resale dispute</li></ul>
<h3>Who it is for</h3>
<ul><li>Anyone with finished assets sitting in a folder, unlisted</li><li>Studios shipping more than one product a month</li><li>Sellers who have written the same licence and listing four times</li></ul>
<h3>What you get</h3>
<ul><li>A monetisation score on the asset before anything else is generated</li><li>Descriptions written to exact word counts, plus four priced tiers in dollars and cedis</li><li>~50 files across a ten-folder structure — five of them typeset as real PDFs in the browser</li><li>Listings for Gumroad, Selar, Paystack and Shopify with every character limit enforced</li><li>120 keywords, 50 social posts, a five-step funnel and a launch plan</li><li>Everything downloadable as one ZIP, plus a separate customer ZIP per tier</li></ul>
<p>Delivered as a ZIP: the app, a START-HERE page, full usage instructions, your licence, and a checksum list of every file. Free updates to the version you bought for 12 months. You keep the files forever either way.</p>
<h3>How you use it</h3>
<ol><li>Open index.html and fill in the ten fields about one finished asset.</li><li>Read the monetisation score before generating. A low score is information, not an obstacle.</li><li>Generate, then read the descriptions and edit the claims — it knows only what you typed.</li><li>Download the full ZIP for yourself and the per-tier customer ZIP for buyers.</li><li>Paste each marketplace listing into its platform; the character counts already fit.</li></ol>
<h3>What should be true when you finish</h3>
<ul><li>A folder you could upload to a marketplace this afternoon</li><li>The same ten inputs always produce the same fifty files — a listing you approved on Monday is the listing that ships</li><li>One folder it deliberately leaves empty, because it has never seen your product</li></ul>
<h3>Do not buy this if</h3>
<ul><li>People without a finished asset — it packages, it does not create</li><li>Anyone expecting it to describe features it was never told about</li></ul>
<h3>What it cannot do</h3>
<p>Nothing is sampled from a model, so output is deterministic. It has never seen your product and says so in the one folder it cannot fill.</p>
<p><em>These are decision and drafting tools, not professional advice. They compute from figures you supply and cannot verify any of them. Nothing here is financial, legal, tax, medical or investment advice.</em></p>
<h3>Guarantee</h3>
<p>14-day refund, no questions asked. Reply to your receipt and say the word. Support: hassanmosh5@gmail.com — One reply within two working days, from the person who built it.</p>
```

## Images

Upload in this order:

1. `dist/mockups/packaging-agent/square.png` — main image, square, works in every grid
2. `dist/mockups/packaging-agent/cover.png`
3. `dist/mockups/packaging-agent/gallery-*.png`

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
