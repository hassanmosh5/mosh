# The Digital Marketing Toolkits — Shopify listing

> Generated from `packaging/products/03-agency.json` by `npm run pkg:listings`.
> Edit the catalogue, not this file — it is overwritten on every run.

Paste each block into the matching field. Character counts are shown so nothing
arrives truncated.

Images for this product: `dist/mockups/marketing-toolkit/` — cover, square, story and gallery shots.
Package files: `dist/packages/marketing-toolkit/` — one ZIP per licence tier.
Support address on all listings: hassanmosh5@gmail.com

---

## Product setup

| Field | Value |
|---|---|
| Handle | `marketing-toolkit` |
| Product type | Digital download |
| Vendor | MOSH Digital Studios |
| Collection | 🏗 Agency & client work |
| Charge tax | Your call — digital goods are taxed differently by market |
| **This is a physical product** | **Untick.** Nothing here ships. |
| Inventory tracking | Off |

**Title** — 30/70 characters

```
The Digital Marketing Toolkits
```

**SEO title** — 69/70 characters

```
The Digital Marketing Toolkits — Eight tools for running a marketing…
```

**Meta description** — 155/155 characters

```
Prospect scoring, five outreach scripts, an eight-step production workflow with real timings, six priced packages and the retention behaviours — as tools,…
```


**Tags**

```
social media management, marketing agency, client prospecting, outreach scripts, smma, service packages, content workflow, client retention, freelance marketing, offline
```

## Variants — one per licence

| Option: Licence | Price | SKU | File |
|---|---|---|---|
| Solo licence | $49 | `MARKETINGTOOLKIT-SOLO` | `marketing-toolkit-solo.zip` |
| Studio licence | $123 | `MARKETINGTOOLKIT-STUDIO` | `marketing-toolkit-studio.zip` |
| Agency licence | $245 | `MARKETINGTOOLKIT-AGENCY` | `marketing-toolkit-agency.zip` |

## Description (HTML) — paste into the code view of the description box

```html
<p><strong>Prospect scoring, five outreach scripts, an eight-step production workflow with real timings, six priced packages and the retention behaviours — as tools, not prose.</strong></p>
<h3>The problem</h3>
<p>The operational knowledge for running a marketing service exists — a method for finding prospects, scripts for approaching them, a workflow with real time estimates, priced packages, retention behaviours. It exists as prose you have to re-read every time you need it, which means in practice you re-invent it every month, worse each time.</p>
<p>It deals specifically with:</p>
<ul><li>Prospecting by scrolling until someone looks like they need help</li><li>Outreach messages written fresh each time and sent to nobody twice</li><li>Packages priced without knowing how many hours they contain</li><li>Clients who leave in month four because nothing was built to keep them</li></ul>
<h3>Who it is for</h3>
<ul><li>Anyone selling social media management as a service</li><li>Freelancers who can do the work but not find the clients</li><li>Agencies pricing packages by copying a competitor</li></ul>
<h3>What you get</h3>
<ul><li>Prospect Audit — score businesses on four gap signals; the list ranks itself</li><li>Five outreach scripts, generated with the prospect&#39;s own gaps in them</li><li>An eight-step production workflow with real per-step timings</li><li>Six priced packages with the hours each one actually contains</li><li>Three retention behaviours and the four pitfalls that lose accounts</li><li>A content engine: niche scoring and article briefs</li><li>Reporting a client will actually read</li></ul>
<p>Delivered as a ZIP: the app, a START-HERE page, full usage instructions, your licence, and a checksum list of every file. Free updates to the version you bought for 12 months. You keep the files forever either way.</p>
<h3>How you use it</h3>
<ol><li>Open index.html and score ten local businesses in the Prospect Audit.</li><li>Generate outreach for the top three; send it the same day.</li><li>Price from the packages tab, not from what feels askable.</li><li>Deliver against the eight-step workflow and time yourself once.</li><li>Set up the retention behaviours in month one, not month four.</li></ol>
<h3>What should be true when you finish</h3>
<ul><li>A ranked prospect list rather than a browsing session</li><li>A package price you can hold in a negotiation because you know its hours</li><li>A delivery month that runs on a workflow instead of adrenaline</li></ul>
<h3>Do not buy this if</h3>
<ul><li>Anyone wanting the content produced for them</li><li>Agencies with an established sales system that only need more traffic</li></ul>
<h3>What it cannot do</h3>
<p>The timings are the documented ones, not aspirational. Your first month will be slower; time yourself and replace them.</p>
<p><em>These are decision and drafting tools, not professional advice. They compute from figures you supply and cannot verify any of them. Nothing here is financial, legal, tax, medical or investment advice.</em></p>
<h3>Guarantee</h3>
<p>14-day refund, no questions asked. Reply to your receipt and say the word. Support: hassanmosh5@gmail.com — One reply within two working days, from the person who built it.</p>
```

## Images

Upload in this order:

1. `dist/mockups/marketing-toolkit/square.png` — main image, square, works in every grid
2. `dist/mockups/marketing-toolkit/cover.png`
3. `dist/mockups/marketing-toolkit/gallery-*.png`

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
