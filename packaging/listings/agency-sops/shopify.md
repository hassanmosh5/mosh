# The Agency Operations System — Shopify listing

> Generated from `packaging/products/03-agency.json` by `npm run pkg:listings`.
> Edit the catalogue, not this file — it is overwritten on every run.

Paste each block into the matching field. Character counts are shown so nothing
arrives truncated.

Images for this product: `dist/mockups/agency-sops/` — cover, square, story and gallery shots.
Package files: `dist/packages/agency-sops/` — one ZIP per licence tier.
Support address on all listings: hassanmosh5@gmail.com

---

## Product setup

| Field | Value |
|---|---|
| Handle | `agency-sops` |
| Product type | Digital download |
| Vendor | MOSH Digital Studios |
| Collection | ðŸ— Agency & client work |
| Charge tax | Your call — digital goods are taxed differently by market |
| **This is a physical product** | **Untick.** Nothing here ships. |
| Inventory tracking | Off |

**Title** — 28/70 characters

```
The Agency Operations System
```

**SEO title** — 69/70 characters

```
The Agency Operations System — Six procedures, pre-written from real…
```

**Meta description** — 136/155 characters

```
The six SOPs a digital service agency runs on, arriving already written for your service line — and every line of every one is editable.
```


**Tags**

```
agency sop, standard operating procedures, delivery workflow, freelance systems, client onboarding, team documentation, scaling agency, process template, operations, offline app
```

## Variants — one per licence

| Option: Licence | Price | SKU | File |
|---|---|---|---|
| Solo licence | $39 | `AGENCYSOPS-SOLO` | `agency-sops-solo.zip` |
| Studio licence | $98 | `AGENCYSOPS-STUDIO` | `agency-sops-studio.zip` |
| Agency licence | $195 | `AGENCYSOPS-AGENCY` | `agency-sops-agency.zip` |

## Description (HTML) — paste into the code view of the description box

```html
<p><strong>The six SOPs a digital service agency runs on, arriving already written for your service line — and every line of every one is editable.</strong></p>
<h3>The problem</h3>
<p>The first $1,000 month is a problem of action. The first $5,000 month is a problem of systems — and the systems are six specific procedures, not a general intention to get organised. Everyone knows this. Nobody writes them, because a blank SOP template is one of the least inviting documents in existence.</p>
<p>It deals specifically with:</p>
<ul><li>Delivery that depends entirely on you remembering how you did it last time</li><li>Onboarding that takes a week because nothing is documented</li><li>Quality that varies by how tired you were that Thursday</li><li>Being unable to hire because you cannot explain the job</li></ul>
<h3>Who it is for</h3>
<ul><li>Freelancers whose first $5,000 month keeps turning into chaos</li><li>Anyone about to hire and realising nothing is written down</li><li>Agencies where every project runs slightly differently</li></ul>
<h3>What you get</h3>
<ul><li>Stage — Hustler / Operator / Owner as a diagnostic, so you build the procedures for the stage you are in</li><li>Six SOPs, pre-written from real delivery workflows for your service line, all of them editable</li><li>The brief-to-delivery workflow with its timings</li><li>The monthly client cycle, step by step</li><li>An efficiency audit that finds what to systematise next</li><li>Export as documents you can hand to a contractor on day one</li></ul>
<p>Delivered as a ZIP: the app, a START-HERE page, full usage instructions, your licence, and a checksum list of every file. Free updates to the version you bought for 12 months. You keep the files forever either way.</p>
<h3>How you use it</h3>
<ol><li>Open index.html and pick your service line — the SOPs arrive populated for it.</li><li>Do the stage diagnostic first. Building Owner-stage systems while you are a Hustler wastes a fortnight.</li><li>Edit every line. A procedure you have not corrected is a procedure you will not follow.</li><li>Run one real project against the SOP and fix what was wrong.</li><li>Export and store them where whoever does the work can reach them.</li></ol>
<h3>What should be true when you finish</h3>
<ul><li>Six written procedures, today, instead of six blank templates</li><li>A first hire who can follow the work without shadowing you</li><li>Delivery that survives a week when you are ill</li></ul>
<h3>Do not buy this if</h3>
<ul><li>Solo operators with one client and no plan to add another</li><li>Anyone wanting compliance documentation — these are operating procedures, not ISO</li></ul>
<h3>What it cannot do</h3>
<p>The procedures come pre-written from documented workflows, not from a model. They will be wrong about your business in places, and the edit boxes are where you fix that.</p>
<p><em>These are decision and drafting tools, not professional advice. They compute from figures you supply and cannot verify any of them. Nothing here is financial, legal, tax, medical or investment advice.</em></p>
<h3>Guarantee</h3>
<p>14-day refund, no questions asked. Reply to your receipt and say the word. Support: hassanmosh5@gmail.com — One reply within two working days, from the person who built it.</p>
```

## Images

Upload in this order:

1. `dist/mockups/agency-sops/square.png` — main image, square, works in every grid
2. `dist/mockups/agency-sops/cover.png`
3. `dist/mockups/agency-sops/gallery-*.png`

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
