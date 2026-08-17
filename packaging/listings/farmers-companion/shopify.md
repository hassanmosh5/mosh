# Farmer's Companion — Shopify listing

> Generated from `packaging/products/06-life.json` by `npm run pkg:listings`.
> Edit the catalogue, not this file — it is overwritten on every run.

Paste each block into the matching field. Character counts are shown so nothing
arrives truncated.

Images for this product: `dist/mockups/farmers-companion/` — cover, square, story and gallery shots.
Package files: `dist/packages/farmers-companion/` — one ZIP per licence tier.
Support address on all listings: hassanmosh5@gmail.com

---

## Product setup

| Field | Value |
|---|---|
| Handle | `farmers-companion` |
| Product type | Digital download |
| Vendor | MOSH Digital Studios |
| Collection | 🏦 Money, property & life |
| Charge tax | Your call — digital goods are taxed differently by market |
| **This is a physical product** | **Untick.** Nothing here ships. |
| Inventory tracking | Off |

**Title** — 18/70 characters

```
Farmer's Companion
```

**SEO title** — 56/70 characters

```
Farmer's Companion — It will not let you type in a yield
```

**Meta description** — 139/155 characters

```
Which crop on which plot, planted when, watered and fed with what — ranked against whatever actually runs out first: labour, water or cash.
```


**Tags**

```
farm planning, crop planning, smallholder, yield estimate, irrigation planning, farm cash flow, agriculture tool, crop rotation, labour planning, offline
```

## Variants — one per licence

| Option: Licence | Price | SKU | File |
|---|---|---|---|
| Solo licence | $39 | `FARMERSCOMPANION-SOLO` | `farmers-companion-solo.zip` |
| Studio licence | $98 | `FARMERSCOMPANION-STUDIO` | `farmers-companion-studio.zip` |
| Agency licence | $195 | `FARMERSCOMPANION-AGENCY` | `farmers-companion-agency.zip` |

## Description (HTML) — paste into the code view of the description box

```html
<p><strong>Which crop on which plot, planted when, watered and fed with what — ranked against whatever actually runs out first: labour, water or cash.</strong></p>
<h3>The problem</h3>
<p>Every farm-planning spreadsheet asks for a yield, and nobody can honestly supply one. Worse, most of them rank crops by margin per hectare — which is the right ranking only if land is what you run out of, and land almost never is. What runs out first is the week three crops all need weeding, the water in the driest month, or the cash between the fertiliser and the first sale.</p>
<p>It deals specifically with:</p>
<ul><li>Yield figures typed in as wishes and then treated as facts</li><li>Ranking by margin per hectare when land is not the binding constraint</li><li>Planting calendars that collide in the peak labour week</li><li>Cash-flow gaps between input costs and first sale</li></ul>
<h3>Who it is for</h3>
<ul><li>Smallholders planning a season across several plots</li><li>Agricultural extension workers and cooperatives</li><li>Anyone whose farm plan is a spreadsheet with an optimistic yield in it</li></ul>
<h3>What you get</h3>
<ul><li>Yield derived from six checkable things, with the whole multiplication shown</li><li>Constraint detection: peak-week labour, water in the dry month, or working capital</li><li>Ranking by margin per unit of the binding constraint, with a warning when it disagrees with per-hectare</li><li>Plot-by-plot planting calendar with the collisions flagged</li><li>Irrigation and fertiliser plans per planting</li><li>Season cash flow, including the gap before the first sale</li></ul>
<p>Delivered as a ZIP: the app, a START-HERE page, full usage instructions, your licence, and a checksum list of every file. Free updates to the version you bought for 12 months. You keep the files forever either way.</p>
<h3>How you use it</h3>
<ol><li>Open index.html and enter your plots, labour hours and water availability honestly.</li><li>Let it derive the yield. It starts at the crop ceiling and works down from what it can check.</li><li>Read which constraint it found binding — that is the whole ranking.</li><li>Fix the calendar collisions before planting, not during weeding.</li><li>Check the cash-flow gap and plan for it.</li></ol>
<h3>What should be true when you finish</h3>
<ul><li>A crop plan ranked against what actually limits your farm</li><li>A yield estimate you can defend, with every factor visible</li><li>The week the labour plan breaks, before the season starts</li></ul>
<h3>Do not buy this if</h3>
<ul><li>Anyone wanting local variety data or live prices — you supply those</li><li>Large mechanised operations with farm-management software</li></ul>
<h3>What it cannot do</h3>
<p>It derives rather than accepts yields, which makes it conservative. Local conditions, varieties and prices are yours to enter, and it cannot check any of them.</p>
<p><em>These are decision and drafting tools, not professional advice. They compute from figures you supply and cannot verify any of them. Nothing here is financial, legal, tax, medical or investment advice.</em></p>
<h3>Guarantee</h3>
<p>14-day refund, no questions asked. Reply to your receipt and say the word. Support: hassanmosh5@gmail.com — One reply within two working days, from the person who built it.</p>
```

## Images

Upload in this order:

1. `dist/mockups/farmers-companion/square.png` — main image, square, works in every grid
2. `dist/mockups/farmers-companion/cover.png`
3. `dist/mockups/farmers-companion/gallery-*.png`

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
| URL | `https://REPLACE-ME.example.com/api/webhooks/shopify` |

Copy the signing secret Shopify shows you into `SHOPIFY_WEBHOOK_SECRET`. The
route verifies the HMAC on the raw body, matches each line item's SKU to a
package, and emails a signed download link that expires in
30 days after 8 downloads.

Map each variant SKU in `packaging/sku-map.json` so the webhook knows which
ZIP a line item refers to.

---
14-day refund, no questions asked. Reply to your receipt and say the word.

Support: hassanmosh5@gmail.com — One reply within two working days, from the person who built it.
