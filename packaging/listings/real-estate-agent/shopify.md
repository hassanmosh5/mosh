# AI Real Estate Agent — Shopify listing

> Generated from `packaging/products/05-agents.json` by `npm run pkg:listings`.
> Edit the catalogue, not this file — it is overwritten on every run.

Paste each block into the matching field. Character counts are shown so nothing
arrives truncated.

Images for this product: `dist/mockups/real-estate-agent/` — cover, square, story and gallery shots.
Package files: `dist/packages/real-estate-agent/` — one ZIP per licence tier.
Support address on all listings: hassanmosh5@gmail.com

---

## Product setup

| Field | Value |
|---|---|
| Handle | `real-estate-agent` |
| Product type | Digital download |
| Vendor | MOSH Digital Studios |
| Collection | ðŸ¤– AI agents & automation |
| Charge tax | Your call — digital goods are taxed differently by market |
| **This is a physical product** | **Untick.** Nothing here ships. |
| Inventory tracking | Off |

**Title** — 20/70 characters

```
AI Real Estate Agent
```

**SEO title** — 65/70 characters

```
AI Real Estate Agent — Leads are not lost to competitors, but to…
```

**Meta description** — 145/155 characters

```
Which enquiries the assistant answers first, what it asks, what it must never say, and whether the arithmetic works at your lead volume — with a…
```


**Tags**

```
real estate ai, property leads, lead response time, estate agent automation, fair housing, qualification script, system prompt, test bench, property crm, offline
```

## Variants — one per licence

| Option: Licence | Price | SKU | File |
|---|---|---|---|
| Solo licence | $59 | `REALESTATEAGENT-SOLO` | `real-estate-agent-solo.zip` |
| Studio licence | $148 | `REALESTATEAGENT-STUDIO` | `real-estate-agent-studio.zip` |
| Agency licence | $295 | `REALESTATEAGENT-AGENCY` | `real-estate-agent-agency.zip` |

## Description (HTML) — paste into the code view of the description box

```html
<p><strong>Which enquiries the assistant answers first, what it asks, what it must never say, and whether the arithmetic works at your lead volume — with a fair-housing checker.</strong></p>
<h3>The problem</h3>
<p>Agents buy leads and then lose them to the clock — not to a competitor with a better CRM, but to a Tuesday evening, a valuation that overran, and a portal enquiry that sat unanswered until Thursday. And the unit of decision is the source, not &#39;leads&#39;: a portal enquiry and a past-client referral share a name and nothing else.</p>
<p>It deals specifically with:</p>
<ul><li>Portal enquiries answered two days late, when the lead has already booked elsewhere</li><li>Treating every lead source identically when their values differ by an order of magnitude</li><li>Automated copy that strays into fair-housing violations</li><li>Rollouts with no test bench and no gate, going live on hope</li></ul>
<h3>Who it is for</h3>
<ul><li>Estate agents buying portal leads and losing them to response time</li><li>Property businesses automating first response</li><li>Agencies building assistants for property clients</li></ul>
<h3>What you get</h3>
<ul><li>Source-by-source analysis, because a portal lead and a referral are different products</li><li>What a lost lead actually costs, computed at your volume and conversion</li><li>A system prompt and qualification scripts generated from your own stock and policies</li><li>A hard refusal list — valuations, legal advice, anything it must not say</li><li>A 46-case test bench covering the awkward cases</li><li>A fair-housing copy checker</li><li>A rollout plan with gates that refuse to open</li></ul>
<p>Delivered as a ZIP: the app, a START-HERE page, full usage instructions, your licence, and a checksum list of every file. Free updates to the version you bought for 12 months. You keep the files forever either way.</p>
<h3>How you use it</h3>
<ol><li>Open index.html and enter lead volumes and conversion by source.</li><li>Read the cost of a lost lead per source. It reorders priorities immediately.</li><li>Generate prompts and scripts for the highest-value source first.</li><li>Run every piece of customer-facing copy through the fair-housing checker.</li><li>Do not open a rollout gate until the 46-case bench passes.</li></ol>
<h3>What should be true when you finish</h3>
<ul><li>A response-time target with money attached to it</li><li>A prompt and script set specific to each lead source</li><li>Copy checked against fair-housing language before it reaches a member of the public</li></ul>
<h3>Do not buy this if</h3>
<ul><li>Anyone wanting a working assistant — nothing here talks to a model</li><li>Legal compliance sign-off; the checker is an aid, not an approval</li></ul>
<h3>What it cannot do</h3>
<p>The fair-housing checker flags language patterns. It is not legal advice and does not certify compliance — have a qualified person review anything public.</p>
<p><em>These are decision and drafting tools, not professional advice. They compute from figures you supply and cannot verify any of them. Nothing here is financial, legal, tax, medical or investment advice.</em></p>
<h3>Guarantee</h3>
<p>14-day refund, no questions asked. Reply to your receipt and say the word. Support: hassanmosh5@gmail.com — One reply within two working days, from the person who built it.</p>
```

## Images

Upload in this order:

1. `dist/mockups/real-estate-agent/square.png` — main image, square, works in every grid
2. `dist/mockups/real-estate-agent/cover.png`
3. `dist/mockups/real-estate-agent/gallery-*.png`

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
