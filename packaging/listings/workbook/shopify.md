# Star Explorers — Interactive Workbook for Kids — Shopify listing

> Generated from `packaging/products/06-life.json` by `npm run pkg:listings`.
> Edit the catalogue, not this file — it is overwritten on every run.

Paste each block into the matching field. Character counts are shown so nothing
arrives truncated.

Images for this product: `dist/mockups/workbook/` — cover, square, story and gallery shots.
Package files: `dist/packages/workbook/` — one ZIP per licence tier.
Support address on all listings: hassanmosh5@gmail.com

---

## Product setup

| Field | Value |
|---|---|
| Handle | `workbook` |
| Product type | Digital download |
| Vendor | MOSH Digital Studios |
| Collection | ðŸ¦ Money, property & life |
| Charge tax | Your call — digital goods are taxed differently by market |
| **This is a physical product** | **Untick.** Nothing here ships. |
| Inventory tracking | Off |

**Title** — 46/70 characters

```
Star Explorers — Interactive Workbook for Kids
```

**SEO title** — 67/70 characters

```
Star Explorers — Interactive Workbook for Kids — Seven activities,…
```

**Meta description** — 148/155 characters

```
Counting, maths, phonics, patterns, shapes, memory and a doodle pad for ages 4–8 — offline, with no ads, no accounts and no data leaving the device.
```


**Tags**

```
kids learning app, ages 4-8, phonics, counting, shapes, offline kids app, no ads, early years, homeschool, educational game
```

## Variants — one per licence

| Option: Licence | Price | SKU | File |
|---|---|---|---|
| Solo licence | $14 | `WORKBOOK-SOLO` | `workbook-solo.zip` |
| Studio licence | $35 | `WORKBOOK-STUDIO` | `workbook-studio.zip` |
| Agency licence | $70 | `WORKBOOK-AGENCY` | `workbook-agency.zip` |

## Description (HTML) — paste into the code view of the description box

```html
<p><strong>Counting, maths, phonics, patterns, shapes, memory and a doodle pad for ages 4–8 — offline, with no ads, no accounts and no data leaving the device.</strong></p>
<h3>The problem</h3>
<p>Almost every learning app for small children is a funnel: adverts between activities, a subscription prompt at the third level, an account that collects data about a five-year-old. The learning content is usually fine. Everything around it is designed for someone other than the child.</p>
<p>It deals specifically with:</p>
<ul><li>Adverts and upsell prompts interrupting a four-year-old</li><li>Accounts and data collection for young children</li><li>Apps that need a connection, so the car journey is out</li><li>One difficulty level, which is either too easy or too hard within a week</li></ul>
<h3>Who it is for</h3>
<ul><li>Parents of children roughly 4–8</li><li>Teachers who need something that works on a school laptop with no internet</li><li>Anyone tired of children&#39;s apps built around adverts</li></ul>
<h3>What you get</h3>
<ul><li>Counting Critters — counting to 5, 10 or 20</li><li>Math Lab — addition and subtraction with coloured counters as a visual aid</li><li>Word Builder — phonics and spelling with letter tiles</li><li>Pattern Party — AB, AAB/ABB and ABC sequences</li><li>Shape Safari — ten shapes drawn as crisp SVG</li><li>Memory Match — 4, 6 or 8 pairs</li><li>Doodle Pad — ten colours, three brush sizes, prompts, save as PNG</li><li>Three difficulty levels applied across every activity</li></ul>
<p>Delivered as a ZIP: the app, a START-HERE page, full usage instructions, your licence, and a checksum list of every file. Free updates to the version you bought for 12 months. You keep the files forever either way.</p>
<h3>How you use it</h3>
<ol><li>Open index.html on any device — a tablet works best for small hands.</li><li>Set the difficulty on the home screen; it applies everywhere.</li><li>Let them choose the activity. The order does not matter.</li><li>Doodle Pad drawings save as PNG to the device.</li><li>Add it to the home screen so it opens like an app.</li></ol>
<h3>What should be true when you finish</h3>
<ul><li>An activity set a child can use unsupervised without meeting an advert</li><li>Difficulty that grows with them rather than being outgrown in a week</li><li>Something that works on a plane, in a car, or in a classroom with no wifi</li></ul>
<h3>Do not buy this if</h3>
<ul><li>Children older than about eight</li><li>Anyone needing progress reports or a curriculum mapping</li></ul>
<h3>What it cannot do</h3>
<p>No adverts, no accounts, no network requests, and nothing stored anywhere but the device. You can verify all of that by reading the single file.</p>
<p><em>These are decision and drafting tools, not professional advice. They compute from figures you supply and cannot verify any of them. Nothing here is financial, legal, tax, medical or investment advice.</em></p>
<h3>Guarantee</h3>
<p>14-day refund, no questions asked. Reply to your receipt and say the word. Support: hassanmosh5@gmail.com — One reply within two working days, from the person who built it.</p>
```

## Images

Upload in this order:

1. `dist/mockups/workbook/square.png` — main image, square, works in every grid
2. `dist/mockups/workbook/cover.png`
3. `dist/mockups/workbook/gallery-*.png`

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
