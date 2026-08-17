# AI Website + CRM Automation — Shopify listing

> Generated from `packaging/products/05-agents.json` by `npm run pkg:listings`.
> Edit the catalogue, not this file — it is overwritten on every run.

Paste each block into the matching field. Character counts are shown so nothing
arrives truncated.

Images for this product: `dist/mockups/website-crm/` — cover, square, story and gallery shots.
Package files: `dist/packages/website-crm/` — one ZIP per licence tier.
Support address on all listings: hassanmosh5@gmail.com

---

## Product setup

| Field | Value |
|---|---|
| Handle | `website-crm` |
| Product type | Digital download |
| Vendor | MOSH Digital Studios |
| Collection | 🤖 AI agents & automation |
| Charge tax | Your call — digital goods are taxed differently by market |
| **This is a physical product** | **Untick.** Nothing here ships. |
| Inventory tracking | Off |

**Title** — 27/70 characters

```
AI Website + CRM Automation
```

**SEO title** — 67/70 characters

```
AI Website + CRM Automation — At thirty enquiries a month, most of…
```

**Meta description** — 154/155 characters

```
The site page by page, the CRM pipeline stage by stage, the tool stack with its running cost — and, per automation, whether your volume pays for building…
```


**Tags**

```
crm automation, website and crm, local business automation, lead pipeline, automation payback, tool stack cost, agency services, n8n zapier planning, funnel, offline
```

## Variants — one per licence

| Option: Licence | Price | SKU | File |
|---|---|---|---|
| Solo licence | $59 | `WEBSITECRM-SOLO` | `website-crm-solo.zip` |
| Studio licence | $148 | `WEBSITECRM-STUDIO` | `website-crm-studio.zip` |
| Agency licence | $295 | `WEBSITECRM-AGENCY` | `website-crm-agency.zip` |

## Description (HTML) — paste into the code view of the description box

```html
<p><strong>The site page by page, the CRM pipeline stage by stage, the tool stack with its running cost — and, per automation, whether your volume pays for building it.</strong></p>
<h3>The problem</h3>
<p>Website and CRM automation is the most saleable service there is, and it is where the largest amount of confident nonsense lives: build lists of forty automations, tool stacks priced like an enterprise, and payback claims nobody has ever checked. At thirty enquiries a month most of that build list is a hobby — which is knowable in advance, from arithmetic.</p>
<p>It deals specifically with:</p>
<ul><li>Forty-automation build lists sold to businesses with thirty enquiries a month</li><li>Tool stacks whose monthly cost nobody totalled</li><li>Pipeline stages copied from a template and never matched to how deals actually move</li><li>Automations built in the order they were thought of</li></ul>
<h3>Who it is for</h3>
<ul><li>Agencies selling website-and-CRM builds to local businesses</li><li>Business owners quoted for a forty-automation build</li><li>Anyone whose CRM has twelve custom fields and no one filling them</li></ul>
<h3>What you get</h3>
<ul><li>The site planned page by page for your business model</li><li>A CRM pipeline stage by stage, with the fields each stage genuinely needs</li><li>Automation recipes per business model, each with a payback calculation at your volume</li><li>A tool stack with its real monthly running cost totalled</li><li>Message templates for each automated touchpoint</li><li>A verdict per automation: build now, build later, or do not build</li></ul>
<p>Delivered as a ZIP: the app, a START-HERE page, full usage instructions, your licence, and a checksum list of every file. Free updates to the version you bought for 12 months. You keep the files forever either way.</p>
<h3>How you use it</h3>
<ol><li>Open index.html and pick your business model, then enter monthly enquiry volume and your hourly rate.</li><li>Read the &#39;do not build yet&#39; list carefully — it is usually most of the list.</li><li>Total the tool stack cost before subscribing to anything.</li><li>Build the top three automations only, then re-run the arithmetic.</li><li>Use the templates as the starting text for each touchpoint.</li></ol>
<h3>What should be true when you finish</h3>
<ul><li>A build list ordered by payback rather than by enthusiasm</li><li>A monthly tool cost you knew before signing up to anything</li><li>A pipeline that matches how your deals actually move</li></ul>
<h3>Do not buy this if</h3>
<ul><li>Anyone wanting the automations built — this decides which ones deserve building</li><li>Enterprise CRM migrations</li></ul>
<h3>What it cannot do</h3>
<p>Payback is computed from your volume and your hourly rate. Change either and the build list changes — which is the point.</p>
<p><em>These are decision and drafting tools, not professional advice. They compute from figures you supply and cannot verify any of them. Nothing here is financial, legal, tax, medical or investment advice.</em></p>
<h3>Guarantee</h3>
<p>14-day refund, no questions asked. Reply to your receipt and say the word. Support: hassanmosh5@gmail.com — One reply within two working days, from the person who built it.</p>
```

## Images

Upload in this order:

1. `dist/mockups/website-crm/square.png` — main image, square, works in every grid
2. `dist/mockups/website-crm/cover.png`
3. `dist/mockups/website-crm/gallery-*.png`

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
