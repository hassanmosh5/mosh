# Business Dashboard Templates — Shopify listing

> Generated from `packaging/products/03-agency.json` by `npm run pkg:listings`.
> Edit the catalogue, not this file — it is overwritten on every run.

Paste each block into the matching field. Character counts are shown so nothing
arrives truncated.

Images for this product: `dist/mockups/business-dashboards/` — cover, square, story and gallery shots.
Package files: `dist/packages/business-dashboards/` — one ZIP per licence tier.
Support address on all listings: hassanmosh5@gmail.com

---

## Product setup

| Field | Value |
|---|---|
| Handle | `business-dashboards` |
| Product type | Digital download |
| Vendor | MOSH Digital Studios |
| Collection | 🏗 Agency & client work |
| Charge tax | Your call — digital goods are taxed differently by market |
| **This is a physical product** | **Untick.** Nothing here ships. |
| Inventory tracking | Off |

**Title** — 28/70 characters

```
Business Dashboard Templates
```

**SEO title** — 67/70 characters

```
Business Dashboard Templates — Ten minutes of figures, one working…
```

**Meta description** — 153/155 characters

```
Starts from the smallest set of numbers you will realistically write down each week and derives everything else — with the formulas and a spreadsheet to…
```


**Tags**

```
business dashboard, kpi tracking, small business metrics, weekly review, revenue tracking, freelance finances, spreadsheet template, profit tracking, simple analytics, offline
```

## Variants — one per licence

| Option: Licence | Price | SKU | File |
|---|---|---|---|
| Solo licence | $29 | `BUSINESSDASHBOARDS-SOLO` | `business-dashboards-solo.zip` |
| Studio licence | $73 | `BUSINESSDASHBOARDS-STUDIO` | `business-dashboards-studio.zip` |
| Agency licence | $145 | `BUSINESSDASHBOARDS-AGENCY` | `business-dashboards-agency.zip` |

## Description (HTML) — paste into the code view of the description box

```html
<p><strong>Starts from the smallest set of numbers you will realistically write down each week and derives everything else — with the formulas and a spreadsheet to graduate into.</strong></p>
<h3>The problem</h3>
<p>Most dashboard advice lists every metric that exists, which guarantees the dashboard is never built: tracking forty numbers is a bookkeeping project, and you have a business to run. The alternative is to start from what a person will actually write down each week — a handful of figures — and derive as much as possible from those.</p>
<p>It deals specifically with:</p>
<ul><li>Running on the bank balance, which lags reality by a month</li><li>Dashboards abandoned because they needed forty inputs a week</li><li>Metrics with no formula written down, so they change meaning quietly</li><li>Outgrowing the tool and having to start from nothing</li></ul>
<h3>Who it is for</h3>
<ul><li>Anyone running a business on the bank balance and a feeling</li><li>Freelancers who want to know whether the month worked before the month ends</li><li>Studios with six revenue lines and no single view</li></ul>
<h3>What you get</h3>
<ul><li>Six templates matched to business type: digital products, agency services, coaching, content, e-commerce, local service</li><li>A weekly input set small enough to actually complete</li><li>Every derived metric shown with its formula and its source</li><li>Trends that need only a few weeks of data before they say anything</li><li>A spreadsheet export, so when you outgrow this page you rebuild it in five minutes</li><li>Nothing uploaded — the figures stay on your machine</li></ul>
<p>Delivered as a ZIP: the app, a START-HERE page, full usage instructions, your licence, and a checksum list of every file. Free updates to the version you bought for 12 months. You keep the files forever either way.</p>
<h3>How you use it</h3>
<ol><li>Open index.html and pick the template closest to your business.</li><li>Fill in one week of real figures. Estimates are fine, mark them as such.</li><li>Do it again next week. Two points is a line; four is a trend.</li><li>Read the formulas next to the derived metrics until you can explain them.</li><li>Export to the spreadsheet when the page stops being enough.</li></ol>
<h3>What should be true when you finish</h3>
<ul><li>A weekly number-writing habit that takes under ten minutes</li><li>Derived metrics you can explain, because the formula is on screen</li><li>An exit path to a spreadsheet rather than a dead end</li></ul>
<h3>Do not buy this if</h3>
<ul><li>Businesses needing accounting-grade reporting</li><li>Anyone hoping it will pull figures from their bank or Stripe — you type them</li></ul>
<h3>What it cannot do</h3>
<p>Every derived figure shows the formula that produced it and the input it came from. Nothing is estimated behind your back.</p>
<p><em>These are decision and drafting tools, not professional advice. They compute from figures you supply and cannot verify any of them. Nothing here is financial, legal, tax, medical or investment advice.</em></p>
<h3>Guarantee</h3>
<p>14-day refund, no questions asked. Reply to your receipt and say the word. Support: hassanmosh5@gmail.com — One reply within two working days, from the person who built it.</p>
```

## Images

Upload in this order:

1. `dist/mockups/business-dashboards/square.png` — main image, square, works in every grid
2. `dist/mockups/business-dashboards/cover.png`
3. `dist/mockups/business-dashboards/gallery-*.png`

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
