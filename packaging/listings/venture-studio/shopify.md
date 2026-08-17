# CLEAR AI Digital Product Venture Studio — Shopify listing

> Generated from `packaging/products/01-decide.json` by `npm run pkg:listings`.
> Edit the catalogue, not this file — it is overwritten on every run.

Paste each block into the matching field. Character counts are shown so nothing
arrives truncated.

Images for this product: `dist/mockups/venture-studio/` — cover, square, story and gallery shots.
Package files: `dist/packages/venture-studio/` — one ZIP per licence tier.
Support address on all listings: hassanmosh5@gmail.com

---

## Product setup

| Field | Value |
|---|---|
| Handle | `venture-studio` |
| Product type | Digital download |
| Vendor | MOSH Digital Studios |
| Collection | 🧭 Start & decide |
| Charge tax | Your call — digital goods are taxed differently by market |
| **This is a physical product** | **Untick.** Nothing here ships. |
| Inventory tracking | Off |

**Title** — 39/70 characters

```
CLEAR AI Digital Product Venture Studio
```

**SEO title** — 68/70 characters

```
CLEAR AI Digital Product Venture Studio — Ninety-nine scored ideas,…
```

**Meta description** — 155/155 characters

```
Crosses what you already know with 33 product types into a ranked catalogue — then locks nine of thirteen tabs until you have checked six real listings by…
```


**Tags**

```
digital product ideas, product catalogue planning, idea validation, venture studio, marketplace research, product scoring, solo founder, info product, listing copy, offline app
```

## Variants — one per licence

| Option: Licence | Price | SKU | File |
|---|---|---|---|
| Solo licence | $79 | `VENTURESTUDIO-SOLO` | `venture-studio-solo.zip` |
| Studio licence | $198 | `VENTURESTUDIO-STUDIO` | `venture-studio-studio.zip` |
| Agency licence | $395 | `VENTURESTUDIO-AGENCY` | `venture-studio-agency.zip` |

## Description (HTML) — paste into the code view of the description box

```html
<p><strong>Crosses what you already know with 33 product types into a ranked catalogue — then locks nine of thirteen tabs until you have checked six real listings by hand.</strong></p>
<h3>The problem</h3>
<p>Most people with something worth selling make the same three mistakes in the same order: they pick the product type first, they validate after building, and they think in single products instead of catalogues. The idea is the cheap part — three knowledge assets crossed with thirty-three product types is ninety-nine scored ideas in the time it takes to type three phrases. What is expensive is finding out, in month three, that nobody was looking for it.</p>
<p>It deals specifically with:</p>
<ul><li>Staring at a blank page trying to think of &#39;a good digital product idea&#39;</li><li>Validation theatre — asking friends, reading a trend article, calling it research</li><li>Building one product at a time when the economics only work as a catalogue</li><li>Listings written to a character limit you discover after the copy is finished</li></ul>
<h3>Who it is for</h3>
<ul><li>Anyone with expertise and no idea which part of it is sellable</li><li>Studios planning a catalogue rather than a single product</li><li>People who have built the thing first, twice, and would like to stop</li></ul>
<h3>What you get</h3>
<ul><li>Assets and Opportunities — three things you know × 33 product types, scored on six criteria into a ranked list</li><li>Validate — six marketplace checks you must do by hand; nine tabs stay locked until you have</li><li>Blueprint and four tiers, plus an ecosystem of nine rungs from free to flagship</li><li>Catalogue plans at 30, 90 and 365 days, including the point where upkeep eats the whole week</li><li>Listings with every marketplace character limit enforced as you type</li><li>A funnel, six licences, six SOPs, and a board of eight directors that is allowed to block</li><li>One-click export of the whole thing as a ~10,000-word dossier</li></ul>
<p>Delivered as a ZIP: the app, a START-HERE page, full usage instructions, your licence, and a checksum list of every file. Free updates to the version you bought for 12 months. You keep the files forever either way.</p>
<h3>How you use it</h3>
<ol><li>Open index.html. A worked example is loaded so you can see a finished dossier before typing anything.</li><li>Clear it, then enter three things you genuinely know. Be specific — &#39;payroll for Ghanaian SMEs&#39; beats &#39;business&#39;.</li><li>Read the ranked opportunities, including the low scores. Why an idea scored 31 is the useful part.</li><li>Do the six validation checks with real marketplace tabs open. The app makes zero network requests, by design.</li><li>Past the gate, work through Blueprint → Catalogue → Listings, then export the dossier.</li></ol>
<h3>What should be true when you finish</h3>
<ul><li>A ranked catalogue of ideas with the bad ones scored, not just the good ones</li><li>Six pieces of real marketplace evidence, gathered by you, on the record</li><li>A 365-day catalogue plan that shows the month upkeep starts eating production</li></ul>
<h3>Do not buy this if</h3>
<ul><li>Anyone who wants market data supplied for them — it has never seen a marketplace</li><li>People in a hurry to build. The gate exists precisely to slow that down</li></ul>
<h3>What it cannot do</h3>
<p>It makes no income claims and cannot verify a single figure you enter. Nine of the thirteen tabs stay shut until you supply real evidence.</p>
<p><em>These are decision and drafting tools, not professional advice. They compute from figures you supply and cannot verify any of them. Nothing here is financial, legal, tax, medical or investment advice.</em></p>
<h3>Guarantee</h3>
<p>14-day refund, no questions asked. Reply to your receipt and say the word. Support: hassanmosh5@gmail.com — One reply within two working days, from the person who built it.</p>
```

## Images

Upload in this order:

1. `dist/mockups/venture-studio/square.png` — main image, square, works in every grid
2. `dist/mockups/venture-studio/cover.png`
3. `dist/mockups/venture-studio/gallery-*.png`

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
