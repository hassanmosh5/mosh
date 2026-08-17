# AI Commercial Production Kits — Shopify listing

> Generated from `packaging/products/05-agents.json` by `npm run pkg:listings`.
> Edit the catalogue, not this file — it is overwritten on every run.

Paste each block into the matching field. Character counts are shown so nothing
arrives truncated.

Images for this product: `dist/mockups/commercial-kits/` — cover, square, story and gallery shots.
Package files: `dist/packages/commercial-kits/` — one ZIP per licence tier.
Support address on all listings: hassanmosh5@gmail.com

---

## Product setup

| Field | Value |
|---|---|
| Handle | `commercial-kits` |
| Product type | Digital download |
| Vendor | MOSH Digital Studios |
| Collection | 🤖 AI agents & automation |
| Charge tax | Your call — digital goods are taxed differently by market |
| **This is a physical product** | **Untick.** Nothing here ships. |
| Inventory tracking | Off |

**Title** — 29/70 characters

```
AI Commercial Production Kits
```

**SEO title** — 68/70 characters

```
AI Commercial Production Kits — Whether generating it is worth what…
```

**Meta description** — 154/155 characters

```
One brief becomes a production kit — script with beat timings, shot list with risk flags, generation prompts, deliverable specs and a clearance checklist.
```


**Tags**

```
ai video, commercial production, shot list, video brief, generation prompts, advert planning, video cost, clearance checklist, creative production, offline
```

## Variants — one per licence

| Option: Licence | Price | SKU | File |
|---|---|---|---|
| Solo licence | $49 | `COMMERCIALKITS-SOLO` | `commercial-kits-solo.zip` |
| Studio licence | $123 | `COMMERCIALKITS-STUDIO` | `commercial-kits-studio.zip` |
| Agency licence | $245 | `COMMERCIALKITS-AGENCY` | `commercial-kits-agency.zip` |

## Description (HTML) — paste into the code view of the description box

```html
<p><strong>One brief becomes a production kit — script with beat timings, shot list with risk flags, generation prompts, deliverable specs and a clearance checklist.</strong></p>
<h3>The problem</h3>
<p>AI video is sold on capability and bought on cost, and the two are rarely compared in the same document. Generation credits, re-rolls for the shots that never come out right, licensing, voice, and the editing that stitches it together add up to a number nobody computes until afterwards — by which point the alternative, which was often stock or a phone camera, is no longer on the table.</p>
<p>It deals specifically with:</p>
<ul><li>Committing to AI video without costing the re-rolls</li><li>Shot lists with no risk flags, so the impossible shots are discovered mid-production</li><li>Generation prompts written ad hoc, producing inconsistent looks across a single spot</li><li>No clearance checklist — music, likeness, trademarks discovered at delivery</li></ul>
<h3>Who it is for</h3>
<ul><li>Anyone quoted for an AI-generated video commercial</li><li>Small agencies adding video without a crew</li><li>Founders deciding between AI generation, stock, and a shoot</li></ul>
<h3>What you get</h3>
<ul><li>A script with beat timings that fit the actual slot length</li><li>A shot list with risk flags on the shots AI generation reliably fails</li><li>Generation prompts per shot, written to hold a consistent look</li><li>Deliverable specs per placement — aspect ratios, durations, safe areas</li><li>A clearance checklist covering music, likeness and trademarks</li><li>Cost arithmetic comparing generation, stock and a small shoot</li></ul>
<p>Delivered as a ZIP: the app, a START-HERE page, full usage instructions, your licence, and a checksum list of every file. Free updates to the version you bought for 12 months. You keep the files forever either way.</p>
<h3>How you use it</h3>
<ol><li>Open index.html and write the brief: product, audience, slot length, placements.</li><li>Read the cost comparison before generating anything.</li><li>Work the shot list and pay attention to the risk flags — those are the re-roll budget.</li><li>Use the per-shot prompts to keep the look consistent.</li><li>Run the clearance checklist before delivery, not after.</li></ol>
<h3>What should be true when you finish</h3>
<ul><li>A verdict on whether generating this particular spot is worth it</li><li>A shot list where the hard shots are flagged before anyone starts</li><li>Deliverables that fit each placement without a re-export</li></ul>
<h3>Do not buy this if</h3>
<ul><li>Anyone expecting video to be generated here — this is the production kit</li><li>Broadcast compliance in regulated categories</li></ul>
<h3>What it cannot do</h3>
<p>Generation pricing moves constantly. Update the per-second costs before you rely on the comparison.</p>
<p><em>These are decision and drafting tools, not professional advice. They compute from figures you supply and cannot verify any of them. Nothing here is financial, legal, tax, medical or investment advice.</em></p>
<h3>Guarantee</h3>
<p>14-day refund, no questions asked. Reply to your receipt and say the word. Support: hassanmosh5@gmail.com — One reply within two working days, from the person who built it.</p>
```

## Images

Upload in this order:

1. `dist/mockups/commercial-kits/square.png` — main image, square, works in every grid
2. `dist/mockups/commercial-kits/cover.png`
3. `dist/mockups/commercial-kits/gallery-*.png`

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
