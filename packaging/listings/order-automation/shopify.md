# E-Commerce Order Automation — Shopify listing

> Generated from `packaging/products/05-agents.json` by `npm run pkg:listings`.
> Edit the catalogue, not this file — it is overwritten on every run.

Paste each block into the matching field. Character counts are shown so nothing
arrives truncated.

Images for this product: `dist/mockups/order-automation/` — cover, square, story and gallery shots.
Package files: `dist/packages/order-automation/` — one ZIP per licence tier.
Support address on all listings: hassanmosh5@gmail.com

---

## Product setup

| Field | Value |
|---|---|
| Handle | `order-automation` |
| Product type | Digital download |
| Vendor | MOSH Digital Studios |
| Collection | ðŸ¤– AI agents & automation |
| Charge tax | Your call — digital goods are taxed differently by market |
| **This is a physical product** | **Untick.** Nothing here ships. |
| Inventory tracking | Off |

**Title** — 27/70 characters

```
E-Commerce Order Automation
```

**SEO title** — 68/70 characters

```
E-Commerce Order Automation — 159 hours a month nobody invoices you…
```

**Meta description** — 150/155 characters

```
Costs an order desk minute by minute, ranks every automation by how fast it repays, turns exception handling into arithmetic, and exports the runbook.
```


**Tags**

```
ecommerce operations, order fulfilment, automation payback, runbook, shopify operations, exception handling, order desk, small business automation, hiring vs automating, offline
```

## Variants — one per licence

| Option: Licence | Price | SKU | File |
|---|---|---|---|
| Solo licence | $49 | `ORDERAUTOMATION-SOLO` | `order-automation-solo.zip` |
| Studio licence | $123 | `ORDERAUTOMATION-STUDIO` | `order-automation-studio.zip` |
| Agency licence | $245 | `ORDERAUTOMATION-AGENCY` | `order-automation-agency.zip` |

## Description (HTML) — paste into the code view of the description box

```html
<p><strong>Costs an order desk minute by minute, ranks every automation by how fast it repays, turns exception handling into arithmetic, and exports the runbook.</strong></p>
<h3>The problem</h3>
<p>A store&#39;s order desk is the part that scales worst. A listing is written once; an order is processed every single time, and the minutes are invisible — nobody invoices you for reading the order, checking the payment, picking, packing, buying postage, answering &#39;where is it?&#39;, or reconciling the payout. At ordinary figures a store doing 600 orders a month spends about 159 hours on it.</p>
<p>It deals specifically with:</p>
<ul><li>Fulfilment admin that never appears in any cost calculation</li><li>Automations chosen by what is easiest to build rather than what repays first</li><li>Exceptions handled by mood, so the same problem costs a different amount each time</li><li>No runbook, so the desk stops when the person who runs it is away</li></ul>
<h3>Who it is for</h3>
<ul><li>Store owners whose order desk quietly consumes the week</li><li>Anyone about to hire for fulfilment admin</li><li>Agencies automating operations for e-commerce clients</li></ul>
<h3>What you get</h3>
<ul><li>A minute-by-minute cost model of the order desk at your volume</li><li>Every automation ranked by payback period</li><li>Exception handling as decision rules: refunds, damages, missing parcels, chargebacks</li><li>The threshold volumes at which each automation starts to make sense</li><li>A hiring-versus-automating comparison on the same figures</li><li>An exportable runbook you can hand to whoever covers the desk</li></ul>
<p>Delivered as a ZIP: the app, a START-HERE page, full usage instructions, your licence, and a checksum list of every file. Free updates to the version you bought for 12 months. You keep the files forever either way.</p>
<h3>How you use it</h3>
<ol><li>Open index.html and enter your monthly order volume and the steps you really perform.</li><li>Read the total hours. It is usually the moment the case makes itself.</li><li>Take the top-ranked automation only, build it, then re-measure.</li><li>Turn the exception rules into policy and stop re-deciding them.</li><li>Export the runbook and store it where a stand-in can find it.</li></ol>
<h3>What should be true when you finish</h3>
<ul><li>The true monthly hour cost of your order desk</li><li>An automation order with payback attached to each item</li><li>A runbook that lets someone else run the desk on the day you cannot</li></ul>
<h3>Do not buy this if</h3>
<ul><li>Anyone wanting the automations implemented</li><li>Warehouse-scale logistics with a WMS</li></ul>
<h3>What it cannot do</h3>
<p>The default figures are a starting point; replace them with your own timings. The whole model is only as honest as the minutes you enter.</p>
<p><em>These are decision and drafting tools, not professional advice. They compute from figures you supply and cannot verify any of them. Nothing here is financial, legal, tax, medical or investment advice.</em></p>
<h3>Guarantee</h3>
<p>14-day refund, no questions asked. Reply to your receipt and say the word. Support: hassanmosh5@gmail.com — One reply within two working days, from the person who built it.</p>
```

## Images

Upload in this order:

1. `dist/mockups/order-automation/square.png` — main image, square, works in every grid
2. `dist/mockups/order-automation/cover.png`
3. `dist/mockups/order-automation/gallery-*.png`

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
