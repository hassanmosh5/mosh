# Social Media Content Automation — Shopify listing

> Generated from `packaging/products/04-growth.json` by `npm run pkg:listings`.
> Edit the catalogue, not this file — it is overwritten on every run.

Paste each block into the matching field. Character counts are shown so nothing
arrives truncated.

Images for this product: `dist/mockups/social-automation/` — cover, square, story and gallery shots.
Package files: `dist/packages/social-automation/` — one ZIP per licence tier.
Support address on all listings: hassanmosh5@gmail.com

---

## Product setup

| Field | Value |
|---|---|
| Handle | `social-automation` |
| Product type | Digital download |
| Vendor | MOSH Digital Studios |
| Collection | 📈 Marketing & growth |
| Charge tax | Your call — digital goods are taxed differently by market |
| **This is a physical product** | **Untick.** Nothing here ships. |
| Inventory tracking | Off |

**Title** — 31/70 characters

```
Social Media Content Automation
```

**SEO title** — 70/70 characters

```
Social Media Content Automation — The calendar your week can actually…
```

**Meta description** — 144/155 characters

```
Reconciles what you promised to post, what your source material can yield, and how many hours you have — before week three empties the calendar.
```


**Tags**

```
content calendar, social media planning, repurposing, batch production, posting schedule, content system, creator workflow, capacity planning, instagram planning, offline
```

## Variants — one per licence

| Option: Licence | Price | SKU | File |
|---|---|---|---|
| Solo licence | $39 | `SOCIALAUTOMATION-SOLO` | `social-automation-solo.zip` |
| Studio licence | $98 | `SOCIALAUTOMATION-STUDIO` | `social-automation-studio.zip` |
| Agency licence | $195 | `SOCIALAUTOMATION-AGENCY` | `social-automation-agency.zip` |

## Description (HTML) — paste into the code view of the description box

```html
<p><strong>Reconciles what you promised to post, what your source material can yield, and how many hours you have — before week three empties the calendar.</strong></p>
<h3>The problem</h3>
<p>A content plan is allowed to contain three contradictory numbers: what you promised to post, what your source material can actually yield, and how many hours exist. Nothing in the usual planning process forces them to agree, so the calendar is arithmetically impossible on the day it is written — and everyone blames discipline in week three.</p>
<p>It deals specifically with:</p>
<ul><li>Posting schedules that were never producible</li><li>Repurposing claims that do not survive contact with the source material</li><li>Production hours nobody counted</li><li>A queue that empties silently and takes reach with it</li></ul>
<h3>Who it is for</h3>
<ul><li>Anyone whose content calendar is half empty by week three</li><li>Agencies promising posting volumes they then cannot staff</li><li>Creators repurposing one video into &#39;twenty pieces of content&#39; in theory</li></ul>
<h3>What you get</h3>
<ul><li>The three-number reconciliation: promise, yield, hours — with the shortfall named</li><li>Realistic repurposing ratios per source type</li><li>A production system with batching, so a week&#39;s posts are made in one session</li><li>A calendar that refuses to schedule more than your inputs support</li><li>Per-platform format specs so one asset is not remade five times</li><li>The rescue plan for a queue that has already run dry</li></ul>
<p>Delivered as a ZIP: the app, a START-HERE page, full usage instructions, your licence, and a checksum list of every file. Free updates to the version you bought for 12 months. You keep the files forever either way.</p>
<h3>How you use it</h3>
<ol><li>Open index.html and enter your posting promise, your source material and your real weekly hours.</li><li>Read the shortfall. Fix it by lowering the promise or raising the input — not by resolving to try harder.</li><li>Set the repurposing ratios to what you have actually achieved before.</li><li>Batch-produce against the calendar in one session per week.</li><li>Re-run the reconciliation whenever you take on a new channel.</li></ol>
<h3>What should be true when you finish</h3>
<ul><li>A calendar that can survive the month it was written for</li><li>The honest number of posts your source material yields</li><li>A batching session that replaces daily scrambling</li></ul>
<h3>Do not buy this if</h3>
<ul><li>Scheduling or publishing — it plans, it does not post</li><li>Anyone wanting the content written for them</li></ul>
<h3>What it cannot do</h3>
<p>The reconciliation only works with honest hours. Optimistic input produces an optimistic calendar and the same empty week three.</p>
<p><em>These are decision and drafting tools, not professional advice. They compute from figures you supply and cannot verify any of them. Nothing here is financial, legal, tax, medical or investment advice.</em></p>
<h3>Guarantee</h3>
<p>14-day refund, no questions asked. Reply to your receipt and say the word. Support: hassanmosh5@gmail.com — One reply within two working days, from the person who built it.</p>
```

## Images

Upload in this order:

1. `dist/mockups/social-automation/square.png` — main image, square, works in every grid
2. `dist/mockups/social-automation/cover.png`
3. `dist/mockups/social-automation/gallery-*.png`

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
