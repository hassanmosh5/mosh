# Invoice & Payment Automation — Shopify listing

> Generated from `packaging/products/03-agency.json` by `npm run pkg:listings`.
> Edit the catalogue, not this file — it is overwritten on every run.

Paste each block into the matching field. Character counts are shown so nothing
arrives truncated.

Images for this product: `dist/mockups/invoice-automation/` — cover, square, story and gallery shots.
Package files: `dist/packages/invoice-automation/` — one ZIP per licence tier.
Support address on all listings: hassanmosh5@gmail.com

---

## Product setup

| Field | Value |
|---|---|
| Handle | `invoice-automation` |
| Product type | Digital download |
| Vendor | MOSH Digital Studios |
| Collection | ðŸ— Agency & client work |
| Charge tax | Your call — digital goods are taxed differently by market |
| **This is a physical product** | **Untick.** Nothing here ships. |
| Inventory tracking | Off |

**Title** — 28/70 characters

```
Invoice & Payment Automation
```

**SEO title** — 65/70 characters

```
Invoice & Payment Automation — Get it out right, then get it paid
```

**Meta description** — 155/155 characters

```
An invoice that adds up to the cent, due dates derived from your stated terms, a chase sequence that writes its own emails, and a live picture of what you…
```


**Tags**

```
invoice template, freelance invoicing, payment reminders, late payment, net 30, chase sequence, accounts receivable, small business cash flow, invoice generator, offline
```

## Variants — one per licence

| Option: Licence | Price | SKU | File |
|---|---|---|---|
| Solo licence | $39 | `INVOICEAUTOMATION-SOLO` | `invoice-automation-solo.zip` |
| Studio licence | $98 | `INVOICEAUTOMATION-STUDIO` | `invoice-automation-studio.zip` |
| Agency licence | $195 | `INVOICEAUTOMATION-AGENCY` | `invoice-automation-agency.zip` |

## Description (HTML) — paste into the code view of the description box

```html
<p><strong>An invoice that adds up to the cent, due dates derived from your stated terms, a chase sequence that writes its own emails, and a live picture of what you are owed.</strong></p>
<h3>The problem</h3>
<p>Almost none of the gap between finishing work and being paid is a collections problem. It is a decisions problem: what to number the invoice, when it falls due, when to chase, what to say, what to charge for being late. Those get re-decided on every invoice, badly, under time pressure — which is why the invoice goes out late, the terms drift, the reminder never gets sent, and the money arrives whenever the client feels like it.</p>
<p>It deals specifically with:</p>
<ul><li>Invoices that do not quite add up, or use last quarter&#39;s tax rate</li><li>Due dates invented per invoice instead of derived from a payment term</li><li>Reminders never sent because each one has to be written from scratch</li><li>No idea what is actually outstanding this week</li></ul>
<h3>Who it is for</h3>
<ul><li>Freelancers whose invoices go out late and get paid later</li><li>Anyone who has never sent a payment reminder because writing it feels rude</li><li>Small studios with money owed across several clients and no single view of it</li></ul>
<h3>What you get</h3>
<ul><li>An invoice builder that reconciles to the cent, with tax and discounts handled explicitly</li><li>Payment terms set once — deposits, Net 7/14/30 — with every date derived from them</li><li>A chase sequence that writes each reminder, escalating in tone on a schedule you set</li><li>Late fees calculated rather than threatened</li><li>An ageing view: what is owed, by whom, and when it fell due</li><li>Print and export, with your own branding</li></ul>
<p>Delivered as a ZIP: the app, a START-HERE page, full usage instructions, your licence, and a checksum list of every file. Free updates to the version you bought for 12 months. You keep the files forever either way.</p>
<h3>How you use it</h3>
<ol><li>Open index.html and set your payment terms once, in Settings.</li><li>Build the invoice; check the total reconciles before you send.</li><li>Let the chase sequence generate reminder one — send it on the day it says.</li><li>Escalate on the schedule rather than on your mood.</li><li>Check the ageing view every Monday. It takes ninety seconds.</li></ol>
<h3>What should be true when you finish</h3>
<ul><li>Invoices out the same day the work finishes</li><li>Reminders that send themselves out of a queue instead of your conscience</li><li>One number for what you are owed, and one for what is overdue</li></ul>
<h3>Do not buy this if</h3>
<ul><li>Accounting or bookkeeping — this does not do your books</li><li>Businesses needing e-invoicing compliance in regulated jurisdictions</li></ul>
<h3>What it cannot do</h3>
<p>The arithmetic is exact and the dates are derived from your terms. It does not connect to your bank, so payments are marked by you.</p>
<p><em>These are decision and drafting tools, not professional advice. They compute from figures you supply and cannot verify any of them. Nothing here is financial, legal, tax, medical or investment advice.</em></p>
<h3>Guarantee</h3>
<p>14-day refund, no questions asked. Reply to your receipt and say the word. Support: hassanmosh5@gmail.com — One reply within two working days, from the person who built it.</p>
```

## Images

Upload in this order:

1. `dist/mockups/invoice-automation/square.png` — main image, square, works in every grid
2. `dist/mockups/invoice-automation/cover.png`
3. `dist/mockups/invoice-automation/gallery-*.png`

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
