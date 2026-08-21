# The Faceless YouTube Toolkits — Shopify listing

> Generated from `packaging/products/04-growth.json` by `npm run pkg:listings`.
> Edit the catalogue, not this file — it is overwritten on every run.

Paste each block into the matching field. Character counts are shown so nothing
arrives truncated.

Images for this product: `dist/mockups/youtube-toolkit/` — cover, square, story and gallery shots.
Package files: `dist/packages/youtube-toolkit/` — one ZIP per licence tier.
Support address on all listings: hassanmosh5@gmail.com

---

## Product setup

| Field | Value |
|---|---|
| Handle | `youtube-toolkit` |
| Product type | Digital download |
| Vendor | MOSH Digital Studios |
| Collection | ðŸ“ˆ Marketing & growth |
| Charge tax | Your call — digital goods are taxed differently by market |
| **This is a physical product** | **Untick.** Nothing here ships. |
| Inventory tracking | Off |

**Title** — 29/70 characters

```
The Faceless YouTube Toolkits
```

**SEO title** — 68/70 characters

```
The Faceless YouTube Toolkits — Six tools for an eighteen-month game
```

**Meta description** — 155/155 characters

```
Niche scoring out of 21, a ten-step production workflow with its prompts, a Shorts strategy, a five-layer monetisation stack and the month-by-month income…
```


**Tags**

```
faceless youtube, youtube automation, niche research, video production workflow, youtube shorts, monetisation, rpm, content at scale, channel planning, offline
```

## Variants — one per licence

| Option: Licence | Price | SKU | File |
|---|---|---|---|
| Solo licence | $39 | `YOUTUBETOOLKIT-SOLO` | `youtube-toolkit-solo.zip` |
| Studio licence | $98 | `YOUTUBETOOLKIT-STUDIO` | `youtube-toolkit-studio.zip` |
| Agency licence | $195 | `YOUTUBETOOLKIT-AGENCY` | `youtube-toolkit-agency.zip` |

## Description (HTML) — paste into the code view of the description box

```html
<p><strong>Niche scoring out of 21, a ten-step production workflow with its prompts, a Shorts strategy, a five-layer monetisation stack and the month-by-month income curve.</strong></p>
<h3>The problem</h3>
<p>Content at scale is the hardest income stream to act on, because everything in it is a long game: a niche test, a production workflow, a Shorts strategy, a monetisation stack, an income curve that takes eighteen months to resolve. All of it arrives as prose you read once and then have to remember for a year and a half.</p>
<p>It deals specifically with:</p>
<ul><li>Choosing a niche by interest rather than by RPM and durability</li><li>A production process re-invented per video, so video four takes as long as video one</li><li>Monetisation left entirely to ad revenue</li><li>Quitting at month five because nobody said what month five looks like</li></ul>
<h3>Who it is for</h3>
<ul><li>Anyone starting a faceless channel</li><li>Creators three months in and wondering whether the curve is normal</li><li>People choosing a niche by what they like watching</li></ul>
<h3>What you get</h3>
<ul><li>Niche Scorecard — seven criteria out of 21, with the RPM band attached</li><li>A ten-step production workflow that fills in its own prompts</li><li>A Shorts strategy that feeds the long-form channel rather than replacing it</li><li>The five-layer monetisation stack, calculated on your figures</li><li>A weekly schedule you can actually hold alongside a job</li><li>The month-by-month income curve, with a marker for which row you are on today</li></ul>
<p>Delivered as a ZIP: the app, a START-HERE page, full usage instructions, your licence, and a checksum list of every file. Free updates to the version you bought for 12 months. You keep the files forever either way.</p>
<h3>How you use it</h3>
<ol><li>Open index.html and score three candidate niches before choosing one.</li><li>Run the production workflow for your first video and time each step.</li><li>Set up the monetisation stack early; ad revenue alone is the slowest layer.</li><li>Keep the weekly schedule visible.</li><li>Check the income curve monthly to see whether you are on, above or below the expected row.</li></ol>
<h3>What should be true when you finish</h3>
<ul><li>A niche chosen on scores you can defend in month nine</li><li>A repeatable production run instead of a per-video adventure</li><li>A realistic view of when money appears, so month five is not a surprise</li></ul>
<h3>Do not buy this if</h3>
<ul><li>Anyone wanting videos produced for them</li><li>Channels already monetised and looking for platform-specific optimisation</li></ul>
<h3>What it cannot do</h3>
<p>The income curve is a documented model, not a promise. Your channel will differ; the value is in knowing what normal looks like before you panic.</p>
<p><em>These are decision and drafting tools, not professional advice. They compute from figures you supply and cannot verify any of them. Nothing here is financial, legal, tax, medical or investment advice.</em></p>
<h3>Guarantee</h3>
<p>14-day refund, no questions asked. Reply to your receipt and say the word. Support: hassanmosh5@gmail.com — One reply within two working days, from the person who built it.</p>
```

## Images

Upload in this order:

1. `dist/mockups/youtube-toolkit/square.png` — main image, square, works in every grid
2. `dist/mockups/youtube-toolkit/cover.png`
3. `dist/mockups/youtube-toolkit/gallery-*.png`

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
