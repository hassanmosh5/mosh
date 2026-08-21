# Local Business Website Studio — Shopify listing

> Generated from `packaging/products/04-growth.json` by `npm run pkg:listings`.
> Edit the catalogue, not this file — it is overwritten on every run.

Paste each block into the matching field. Character counts are shown so nothing
arrives truncated.

Images for this product: `dist/mockups/local-business-templates/` — cover, square, story and gallery shots.
Package files: `dist/packages/local-business-templates/` — one ZIP per licence tier.
Support address on all listings: hassanmosh5@gmail.com

---

## Product setup

| Field | Value |
|---|---|
| Handle | `local-business-templates` |
| Product type | Digital download |
| Vendor | MOSH Digital Studios |
| Collection | ðŸ“ˆ Marketing & growth |
| Charge tax | Your call — digital goods are taxed differently by market |
| **This is a physical product** | **Untick.** Nothing here ships. |
| Inventory tracking | Off |

**Title** — 29/70 characters

```
Local Business Website Studio
```

**SEO title** — 66/70 characters

```
Local Business Website Studio — A finished demo site in about ten…
```

**Meta description** — 138/155 characters

```
Builds a complete one-page site for twelve local trades and exports it as one self-contained HTML file you can hand over or host anywhere.
```


**Tags**

```
local business website, one page website, web design for tradespeople, html template, client demo, plumber website, salon website, freelance web design, landing page, offline builder
```

## Variants — one per licence

| Option: Licence | Price | SKU | File |
|---|---|---|---|
| Solo licence | $49 | `LOCALBUSINESSTEMPLATES-SOLO` | `local-business-templates-solo.zip` |
| Studio licence | $123 | `LOCALBUSINESSTEMPLATES-STUDIO` | `local-business-templates-studio.zip` |
| Agency licence | $245 | `LOCALBUSINESSTEMPLATES-AGENCY` | `local-business-templates-agency.zip` |

## Description (HTML) — paste into the code view of the description box

```html
<p><strong>Builds a complete one-page site for twelve local trades and exports it as one self-contained HTML file you can hand over or host anywhere.</strong></p>
<h3>The problem</h3>
<p>Selling a website to a local business works far better if you show the finished thing instead of describing it — the owner cannot evaluate a proposal but can absolutely evaluate their own shop front. The bottleneck is build time: nobody speculatively builds ten sites, because ten sites is a fortnight.</p>
<p>It deals specifically with:</p>
<ul><li>Pitching a website with a proposal instead of the website</li><li>A fortnight of speculative build time you cannot afford</li><li>Generic demo copy that does not sound like the trade</li><li>Handover that requires hosting, a build step and an explanation</li></ul>
<h3>Who it is for</h3>
<ul><li>Anyone selling websites to plumbers, salons, garages and restaurants</li><li>Freelancers who pitch with a deck and lose to whoever showed a demo</li><li>Local businesses building their own first site</li></ul>
<h3>What you get</h3>
<ul><li>Builder — every field of the site as a form, with live preview at three widths</li><li>Twelve trades with demo copy written for each: plumber, electrician, garage, cleaner, landscaper, salon, restaurant, bakery, dentist, gym, accountant, estate agent</li><li>Repeaters for services, jobs, testimonials, packages and FAQ, with per-section switches</li><li>Palettes and layouts chosen to suit each trade</li><li>Export as one self-contained HTML file — no build, no dependencies, no hosting requirement</li><li>Handover notes for a non-technical owner</li></ul>
<p>Delivered as a ZIP: the app, a START-HERE page, full usage instructions, your licence, and a checksum list of every file. Free updates to the version you bought for 12 months. You keep the files forever either way.</p>
<h3>How you use it</h3>
<ol><li>Open index.html and choose the trade — the demo copy arrives written for it.</li><li>Paste the client&#39;s real name, phone number, services and areas over the placeholders.</li><li>Check the preview at all three widths; local traffic is mostly phones.</li><li>Export the single HTML file and show it to the owner.</li><li>On acceptance, replace the remaining placeholder content with their real photos and copy.</li></ol>
<h3>What should be true when you finish</h3>
<ul><li>Ten demo sites in an afternoon rather than a fortnight</li><li>A file the client can host anywhere, or you can host for them</li><li>A pitch that opens with the thing rather than a description of it</li></ul>
<h3>Do not buy this if</h3>
<ul><li>Multi-page sites, e-commerce or booking systems</li><li>Anyone needing a CMS the client can edit themselves</li></ul>
<h3>What it cannot do</h3>
<p>Demo copy is written for the trade and is not about the specific business. Every claim in it must be replaced with something true before the client publishes.</p>
<p><em>These are decision and drafting tools, not professional advice. They compute from figures you supply and cannot verify any of them. Nothing here is financial, legal, tax, medical or investment advice.</em></p>
<h3>Guarantee</h3>
<p>14-day refund, no questions asked. Reply to your receipt and say the word. Support: hassanmosh5@gmail.com — One reply within two working days, from the person who built it.</p>
```

## Images

Upload in this order:

1. `dist/mockups/local-business-templates/square.png` — main image, square, works in every grid
2. `dist/mockups/local-business-templates/cover.png`
3. `dist/mockups/local-business-templates/gallery-*.png`

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
