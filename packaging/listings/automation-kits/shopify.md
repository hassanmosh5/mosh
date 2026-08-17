# AI Automation Kits — Shopify listing

> Generated from `packaging/products/03-agency.json` by `npm run pkg:listings`.
> Edit the catalogue, not this file — it is overwritten on every run.

Paste each block into the matching field. Character counts are shown so nothing
arrives truncated.

Images for this product: `dist/mockups/automation-kits/` — cover, square, story and gallery shots.
Package files: `dist/packages/automation-kits/` — one ZIP per licence tier.
Support address on all listings: hassanmosh5@gmail.com

---

## Product setup

| Field | Value |
|---|---|
| Handle | `automation-kits` |
| Product type | Digital download |
| Vendor | MOSH Digital Studios |
| Collection | 🏗 Agency & client work |
| Charge tax | Your call — digital goods are taxed differently by market |
| **This is a physical product** | **Untick.** Nothing here ships. |
| Inventory tracking | Off |

**Title** — 18/70 characters

```
AI Automation Kits
```

**SEO title** — 70/70 characters

```
AI Automation Kits — The audit produces the kit, the kit produces the…
```

**Meta description** — 146/155 characters

```
A thirty-minute audit script, ten ranked automation templates, a five-part proposal and the ROI arithmetic — as one pipeline instead of six lists.
```


**Tags**

```
ai automation consulting, business audit, automation proposal, roi calculator, value pricing, mrr, small business automation, consulting toolkit, discovery call, offline
```

## Variants — one per licence

| Option: Licence | Price | SKU | File |
|---|---|---|---|
| Solo licence | $59 | `AUTOMATIONKITS-SOLO` | `automation-kits-solo.zip` |
| Studio licence | $148 | `AUTOMATIONKITS-STUDIO` | `automation-kits-studio.zip` |
| Agency licence | $295 | `AUTOMATIONKITS-AGENCY` | `automation-kits-agency.zip` |

## Description (HTML) — paste into the code view of the description box

```html
<p><strong>A thirty-minute audit script, ten ranked automation templates, a five-part proposal and the ROI arithmetic — as one pipeline instead of six lists.</strong></p>
<h3>The problem</h3>
<p>The highest-ceiling service in this whole field is written down everywhere as separate lists: an audit script, some templates, a proposal format, a pricing table, an ROI calculation. In practice they are one pipeline — the audit produces the kit, the kit produces the price, and the audit and price together produce the proposal. Kept separate, each one is a document you have to interpret under pressure in front of a client.</p>
<p>It deals specifically with:</p>
<ul><li>Discovery calls that wander because there is no audit script</li><li>Recommending automations in the order you happen to think of them</li><li>Pricing a build by guessing at hours instead of at value</li><li>Proposals written the night before, from scratch</li></ul>
<h3>Who it is for</h3>
<ul><li>Consultants selling AI automation to small businesses</li><li>Anyone who can build automations but cannot price them</li><li>Agencies adding an automation line to existing services</li></ul>
<h3>What you get</h3>
<ul><li>A thirty-minute audit you can run live on a call</li><li>Ten automation templates that rank themselves against the audit answers</li><li>A fee that lands in the right band from the audit, not from nerve</li><li>A five-part proposal, already written when the audit finishes</li><li>ROI arithmetic in the client&#39;s own figures</li><li>Systems tab — the stage model, SOPs, value pricing and an MRR tracker for after the first yes</li></ul>
<p>Delivered as a ZIP: the app, a START-HERE page, full usage instructions, your licence, and a checksum list of every file. Free updates to the version you bought for 12 months. You keep the files forever either way.</p>
<h3>How you use it</h3>
<ol><li>Open index.html and run the audit live during the discovery call.</li><li>Let the automations rank themselves; do not re-order them by what you enjoy building.</li><li>Check the fee band against the ROI figure before quoting.</li><li>Generate the five-part proposal and send it within a day.</li><li>Once signed, move to the Systems tab — the second client is where the SOPs start to matter.</li></ol>
<h3>What should be true when you finish</h3>
<ul><li>A proposal ready before you leave the client&#39;s car park</li><li>A price with an ROI calculation attached to it</li><li>A recurring-revenue plan rather than a series of one-off builds</li></ul>
<h3>Do not buy this if</h3>
<ul><li>People wanting the automations built for them — this scopes and prices them</li><li>Enterprise procurement processes</li></ul>
<h3>What it cannot do</h3>
<p>The ROI is computed from the client&#39;s figures as they gave them. Nothing verifies those, and the proposal says which numbers came from whom.</p>
<p><em>These are decision and drafting tools, not professional advice. They compute from figures you supply and cannot verify any of them. Nothing here is financial, legal, tax, medical or investment advice.</em></p>
<h3>Guarantee</h3>
<p>14-day refund, no questions asked. Reply to your receipt and say the word. Support: hassanmosh5@gmail.com — One reply within two working days, from the person who built it.</p>
```

## Images

Upload in this order:

1. `dist/mockups/automation-kits/square.png` — main image, square, works in every grid
2. `dist/mockups/automation-kits/cover.png`
3. `dist/mockups/automation-kits/gallery-*.png`

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
