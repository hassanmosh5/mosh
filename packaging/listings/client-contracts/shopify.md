# The Proposal & Contract Kit — Shopify listing

> Generated from `packaging/products/03-agency.json` by `npm run pkg:listings`.
> Edit the catalogue, not this file — it is overwritten on every run.

Paste each block into the matching field. Character counts are shown so nothing
arrives truncated.

Images for this product: `dist/mockups/client-contracts/` — cover, square, story and gallery shots.
Package files: `dist/packages/client-contracts/` — one ZIP per licence tier.
Support address on all listings: hassanmosh5@gmail.com

---

## Product setup

| Field | Value |
|---|---|
| Handle | `client-contracts` |
| Product type | Digital download |
| Vendor | MOSH Digital Studios |
| Collection | ðŸ— Agency & client work |
| Charge tax | Your call — digital goods are taxed differently by market |
| **This is a physical product** | **Untick.** Nothing here ships. |
| Inventory tracking | Off |

**Title** — 27/70 characters

```
The Proposal & Contract Kit
```

**SEO title** — 70/70 characters

```
The Proposal & Contract Kit — Proposal, contract, change order — same…
```

**Meta description** — 133/155 characters

```
One form produces the proposal, the services agreement, the change order and the emails that carry them, so the figures always agree.
```


**Tags**

```
freelance contract, client proposal, services agreement, change order, scope creep, consulting contract, proposal template, agency documents, invoice terms, offline tool
```

## Variants — one per licence

| Option: Licence | Price | SKU | File |
|---|---|---|---|
| Solo licence | $49 | `CLIENTCONTRACTS-SOLO` | `client-contracts-solo.zip` |
| Studio licence | $123 | `CLIENTCONTRACTS-STUDIO` | `client-contracts-studio.zip` |
| Agency licence | $245 | `CLIENTCONTRACTS-AGENCY` | `client-contracts-agency.zip` |

## Description (HTML) — paste into the code view of the description box

```html
<p><strong>One form produces the proposal, the services agreement, the change order and the emails that carry them, so the figures always agree.</strong></p>
<h3>The problem</h3>
<p>The gap between a good call and a signed engagement is four documents nobody enjoys writing, so they get written badly and fast: a proposal with a price, a contract from a template site with the wrong currency, no change order at all, and an email that undersells all three. Then the numbers in the contract do not match the numbers in the proposal, and the argument in month two is about which one counted.</p>
<p>It deals specifically with:</p>
<ul><li>Proposals and contracts that quote different prices, dates or scopes</li><li>Scope creep with no mechanism to charge for it</li><li>Six clauses re-typed per client and forgotten in a hurry</li><li>The 24-hour follow-up that never goes out because writing it takes an hour</li></ul>
<h3>Who it is for</h3>
<ul><li>Freelancers sending proposals in a text document</li><li>Anyone who has done unpaid extra work because scope was never written</li><li>Agencies re-typing the same six clauses per engagement</li></ul>
<h3>What you get</h3>
<ul><li>One intake form: fee, dates, client, jurisdiction, scope, revisions</li><li>A one-page proposal with three tiers and an expiry date</li><li>A services agreement carrying the six clauses an engagement needs — scope, revisions, payment, IP, confidentiality, termination</li><li>A change order that prices additional work against the original agreement</li><li>The covering emails for all three, written from the same data</li><li>Print-ready output; nothing leaves your device</li></ul>
<p>Delivered as a ZIP: the app, a START-HERE page, full usage instructions, your licence, and a checksum list of every file. Free updates to the version you bought for 12 months. You keep the files forever either way.</p>
<h3>How you use it</h3>
<ol><li>Open index.html and fill the intake once.</li><li>Generate the proposal and send it the same day. Speed is most of the win rate here.</li><li>On acceptance, generate the agreement — the numbers carry over automatically.</li><li>Read every clause and delete what does not apply to your engagement.</li><li>When scope changes, raise a change order rather than an opinion.</li></ol>
<h3>What should be true when you finish</h3>
<ul><li>A proposal out within 24 hours of the call, priced in tiers</li><li>A contract whose figures cannot disagree with the proposal</li><li>A written route to charging for extra work instead of absorbing it</li></ul>
<h3>Do not buy this if</h3>
<ul><li>Anything over a few thousand, unusual risk, or personal data at scale — have a lawyer read it</li><li>Employment contracts, or jurisdictions you have not checked</li></ul>
<h3>What it cannot do</h3>
<p>Not legal advice. This is a drafting aid built from general practice; contract law varies by country, by state and by the facts of your engagement.</p>
<p><em>These are decision and drafting tools, not professional advice. They compute from figures you supply and cannot verify any of them. Nothing here is financial, legal, tax, medical or investment advice.</em></p>
<h3>Guarantee</h3>
<p>14-day refund, no questions asked. Reply to your receipt and say the word. Support: hassanmosh5@gmail.com — One reply within two working days, from the person who built it.</p>
```

## Images

Upload in this order:

1. `dist/mockups/client-contracts/square.png` — main image, square, works in every grid
2. `dist/mockups/client-contracts/cover.png`
3. `dist/mockups/client-contracts/gallery-*.png`

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
