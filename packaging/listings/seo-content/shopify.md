# SEO & Content Marketing Systems — Shopify listing

> Generated from `packaging/products/04-growth.json` by `npm run pkg:listings`.
> Edit the catalogue, not this file — it is overwritten on every run.

Paste each block into the matching field. Character counts are shown so nothing
arrives truncated.

Images for this product: `dist/mockups/seo-content/` — cover, square, story and gallery shots.
Package files: `dist/packages/seo-content/` — one ZIP per licence tier.
Support address on all listings: hassanmosh5@gmail.com

---

## Product setup

| Field | Value |
|---|---|
| Handle | `seo-content` |
| Product type | Digital download |
| Vendor | MOSH Digital Studios |
| Collection | ðŸ“ˆ Marketing & growth |
| Charge tax | Your call — digital goods are taxed differently by market |
| **This is a physical product** | **Untick.** Nothing here ships. |
| Inventory tracking | Off |

**Title** — 31/70 characters

```
SEO & Content Marketing Systems
```

**SEO title** — 67/70 characters

```
SEO & Content Marketing Systems — Not how many search it — whether…
```

**Meta description** — 153/155 characters

```
Keyword selection, clustering, internal linking and structured data, plus the arithmetic that says whether a content programme ever repays what it costs.
```


**Tags**

```
seo strategy, keyword research, content clusters, internal linking, structured data, content roi, article brief, organic traffic, blog planning, offline tool
```

## Variants — one per licence

| Option: Licence | Price | SKU | File |
|---|---|---|---|
| Solo licence | $49 | `SEOCONTENT-SOLO` | `seo-content-solo.zip` |
| Studio licence | $123 | `SEOCONTENT-STUDIO` | `seo-content-studio.zip` |
| Agency licence | $245 | `SEOCONTENT-AGENCY` | `seo-content-agency.zip` |

## Description (HTML) — paste into the code view of the description box

```html
<p><strong>Keyword selection, clustering, internal linking and structured data, plus the arithmetic that says whether a content programme ever repays what it costs.</strong></p>
<h3>The problem</h3>
<p>Keyword tools answer how many people search a phrase and leave the only question that matters to you: would writing it ever pay you back. So content marketing fails in a predictable way — the articles get written, they are perfectly good, they rank on page four, and eighteen months later nobody can say whether the programme made or lost money.</p>
<p>It deals specifically with:</p>
<ul><li>Keywords chosen by search volume, which is the wrong variable on its own</li><li>Articles written as isolated posts with no cluster or internal linking</li><li>No structured data, so the pages compete without the features that win clicks</li><li>A content budget with no payback model behind it</li></ul>
<h3>Who it is for</h3>
<ul><li>Anyone whose blog has forty posts and no traffic</li><li>Agencies selling content retainers they cannot justify with numbers</li><li>Founders deciding between SEO and paid</li></ul>
<h3>What you get</h3>
<ul><li>Keyword selection scored on intent, difficulty and what a click is worth to you</li><li>Clustering — the pillar and its supporting articles, planned as one unit</li><li>An internal linking map that ships with the cluster</li><li>Structured data per article type, written out</li><li>Article briefs detailed enough to hand to a writer or a model</li><li>Payback arithmetic: cost per article against the traffic and value it must earn</li></ul>
<p>Delivered as a ZIP: the app, a START-HERE page, full usage instructions, your licence, and a checksum list of every file. Free updates to the version you bought for 12 months. You keep the files forever either way.</p>
<h3>How you use it</h3>
<ol><li>Open index.html and enter what a conversion is worth to you. Everything downstream needs it.</li><li>Score your candidate keywords; ignore the volume column on its own.</li><li>Build one cluster completely before writing a second pillar.</li><li>Generate the briefs and the linking map together.</li><li>Check the payback model before committing to a monthly output.</li></ol>
<h3>What should be true when you finish</h3>
<ul><li>A ranked keyword list where the ranking accounts for what a visitor is worth</li><li>Clusters planned before writing, not discovered afterwards</li><li>The month the programme breaks even, computed from your own costs</li></ul>
<h3>Do not buy this if</h3>
<ul><li>Anyone wanting live keyword data — it makes no network requests, so the volumes are yours to supply</li><li>Sites needing technical SEO audits of existing code</li></ul>
<h3>What it cannot do</h3>
<p>It cannot see the SERP. It structures and computes; the search data has to come from you, from whatever tool you already use.</p>
<p><em>These are decision and drafting tools, not professional advice. They compute from figures you supply and cannot verify any of them. Nothing here is financial, legal, tax, medical or investment advice.</em></p>
<h3>Guarantee</h3>
<p>14-day refund, no questions asked. Reply to your receipt and say the word. Support: hassanmosh5@gmail.com — One reply within two working days, from the person who built it.</p>
```

## Images

Upload in this order:

1. `dist/mockups/seo-content/square.png` — main image, square, works in every grid
2. `dist/mockups/seo-content/cover.png`
3. `dist/mockups/seo-content/gallery-*.png`

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
