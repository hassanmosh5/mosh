# Course Creation Systems — Shopify listing

> Generated from `packaging/products/02-package.json` by `npm run pkg:listings`.
> Edit the catalogue, not this file — it is overwritten on every run.

Paste each block into the matching field. Character counts are shown so nothing
arrives truncated.

Images for this product: `dist/mockups/course-creation/` — cover, square, story and gallery shots.
Package files: `dist/packages/course-creation/` — one ZIP per licence tier.
Support address on all listings: hassanmosh5@gmail.com

---

## Product setup

| Field | Value |
|---|---|
| Handle | `course-creation` |
| Product type | Digital download |
| Vendor | MOSH Digital Studios |
| Collection | 📦 Package & sell |
| Charge tax | Your call — digital goods are taxed differently by market |
| **This is a physical product** | **Untick.** Nothing here ships. |
| Inventory tracking | Off |

**Title** — 23/70 characters

```
Course Creation Systems
```

**SEO title** — 69/70 characters

```
Course Creation Systems — The hundred hours, counted before you start
```

**Meta description** — 155/155 characters

```
Curriculum designed backwards from a measurable outcome, time-boxed lesson scripts, an honest production estimate, pricing arithmetic and a drop-off audit.
```


**Tags**

```
online course creation, curriculum design, course pricing, backwards design, course production, elearning, drop off, teachable, course launch, offline tool
```

## Variants — one per licence

| Option: Licence | Price | SKU | File |
|---|---|---|---|
| Solo licence | $49 | `COURSECREATION-SOLO` | `course-creation-solo.zip` |
| Studio licence | $123 | `COURSECREATION-STUDIO` | `course-creation-studio.zip` |
| Agency licence | $245 | `COURSECREATION-AGENCY` | `course-creation-agency.zip` |

## Description (HTML) — paste into the code view of the description box

```html
<p><strong>Curriculum designed backwards from a measurable outcome, time-boxed lesson scripts, an honest production estimate, pricing arithmetic and a drop-off audit.</strong></p>
<h3>The problem</h3>
<p>A course is the most expensive digital product there is. A prompt pack is an afternoon; a course is a hundred hours, and almost nobody works that out before starting — which is why so many are abandoned halfway through module three, with the recording done and the workbook never written. The production estimate belongs at the beginning.</p>
<p>It deals specifically with:</p>
<ul><li>Curricula designed forwards from what you know rather than backwards from what they must be able to do</li><li>Production hours discovered at hour sixty</li><li>Lessons that sprawl because nothing time-boxed them</li><li>Pricing decided by looking at what someone else charges</li></ul>
<h3>Who it is for</h3>
<ul><li>Anyone who has abandoned a course in module three</li><li>Coaches turning a programme into something self-paced</li><li>Experts who have been told &#39;you should make a course&#39; and believed it</li></ul>
<h3>What you get</h3>
<ul><li>A validation gate that sits in front of the production estimate, not after it</li><li>Curriculum designed backwards from one measurable outcome</li><li>Time-boxed lesson scripts with the structure each lesson type needs</li><li>An honest production-hours estimate, including the parts people forget</li><li>Pricing and platform arithmetic on your numbers</li><li>A drop-off audit — where students leave, and what to change</li><li>A launch schedule that fits the production plan</li></ul>
<p>Delivered as a ZIP: the app, a START-HERE page, full usage instructions, your licence, and a checksum list of every file. Free updates to the version you bought for 12 months. You keep the files forever either way.</p>
<h3>How you use it</h3>
<ol><li>Open index.html and state the outcome first — what a finished student can do that they could not before.</li><li>Pass the validation gate before touching curriculum. If it fails, that is the cheapest failure available.</li><li>Build the curriculum backwards from the outcome; delete anything that does not serve it.</li><li>Read the production estimate honestly and decide again with that number in view.</li><li>Set price and platform in the arithmetic tab, then follow the launch schedule.</li></ol>
<h3>What should be true when you finish</h3>
<ul><li>The real hour count before you commit a single weekend</li><li>A curriculum where every lesson exists to serve the stated outcome</li><li>A price and a platform chosen with the fees included</li></ul>
<h3>Do not buy this if</h3>
<ul><li>Anyone wanting the course content written for them</li><li>People who have already recorded everything and want a marketing plan</li></ul>
<h3>What it cannot do</h3>
<p>The production estimate is derived from your own scope, and it is usually larger than expected. That is the tool working.</p>
<p><em>These are decision and drafting tools, not professional advice. They compute from figures you supply and cannot verify any of them. Nothing here is financial, legal, tax, medical or investment advice.</em></p>
<h3>Guarantee</h3>
<p>14-day refund, no questions asked. Reply to your receipt and say the word. Support: hassanmosh5@gmail.com — One reply within two working days, from the person who built it.</p>
```

## Images

Upload in this order:

1. `dist/mockups/course-creation/square.png` — main image, square, works in every grid
2. `dist/mockups/course-creation/cover.png`
3. `dist/mockups/course-creation/gallery-*.png`

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
