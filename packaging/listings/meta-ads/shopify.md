# Meta Ads & Pixel Blueprints — Shopify listing

> Generated from `packaging/products/04-growth.json` by `npm run pkg:listings`.
> Edit the catalogue, not this file — it is overwritten on every run.

Paste each block into the matching field. Character counts are shown so nothing
arrives truncated.

Images for this product: `dist/mockups/meta-ads/` — cover, square, story and gallery shots.
Package files: `dist/packages/meta-ads/` — one ZIP per licence tier.
Support address on all listings: hassanmosh5@gmail.com

---

## Product setup

| Field | Value |
|---|---|
| Handle | `meta-ads` |
| Product type | Digital download |
| Vendor | MOSH Digital Studios |
| Collection | ðŸ“ˆ Marketing & growth |
| Charge tax | Your call — digital goods are taxed differently by market |
| **This is a physical product** | **Untick.** Nothing here ships. |
| Inventory tracking | Off |

**Title** — 27/70 characters

```
Meta Ads & Pixel Blueprints
```

**SEO title** — 67/70 characters

```
Meta Ads & Pixel Blueprints — Whether your budget can work at all,…
```

**Meta description** — 150/155 characters

```
The tracking code, the event map, the campaign structure — and the arithmetic that decides whether any of it can work at the budget you actually have.
```


**Tags**

```
meta ads, facebook pixel, conversions api, campaign structure, learning phase, cpa calculator, ad budget, event tracking, paid traffic, offline tool
```

## Variants — one per licence

| Option: Licence | Price | SKU | File |
|---|---|---|---|
| Solo licence | $49 | `METAADS-SOLO` | `meta-ads-solo.zip` |
| Studio licence | $123 | `METAADS-STUDIO` | `meta-ads-studio.zip` |
| Agency licence | $245 | `METAADS-AGENCY` | `meta-ads-agency.zip` |

## Description (HTML) — paste into the code view of the description box

```html
<p><strong>The tracking code, the event map, the campaign structure — and the arithmetic that decides whether any of it can work at the budget you actually have.</strong></p>
<h3>The problem</h3>
<p>Paid traffic fails at small budgets in a way nobody warns about: the campaign never gathers enough conversion events to leave the learning phase, so the algorithm optimises on noise and the money goes out in a straight line. That is arithmetic, and it can be checked before the first cedi is spent — but almost every guide starts with campaign structure and never mentions it.</p>
<p>It deals specifically with:</p>
<ul><li>Spending a budget too small to exit the learning phase</li><li>A Pixel installed but no event map, so nothing is optimisable</li><li>Campaign structures copied from a video with different economics</li><li>No idea what a conversion may cost before it stops making sense</li></ul>
<h3>Who it is for</h3>
<ul><li>Anyone about to spend their first $500 on Meta ads</li><li>Agencies running client ads without a documented event map</li><li>Sellers whose Pixel fires on every page and measures nothing</li></ul>
<h3>What you get</h3>
<ul><li>The tracking setup: Pixel and Conversions API, with what each one is actually for</li><li>An event map derived from your funnel, not a generic list of standard events</li><li>Campaign structure per objective, with the budget each structure needs</li><li>The learning-phase arithmetic: events per week required, at your conversion rate</li><li>Maximum allowable cost per acquisition from your own margin</li><li>A verdict that is allowed to say your budget cannot work yet</li></ul>
<p>Delivered as a ZIP: the app, a START-HERE page, full usage instructions, your licence, and a checksum list of every file. Free updates to the version you bought for 12 months. You keep the files forever either way.</p>
<h3>How you use it</h3>
<ol><li>Open index.html and enter your margin and conversion rate first.</li><li>Read the learning-phase verdict before designing anything. If it says the budget is too small, that is the most valuable output here.</li><li>Build the event map from your real funnel steps.</li><li>Take the tracking spec to whoever installs it — it is written to be handed over.</li><li>Set up campaigns to the structure, and hold the budget it specifies.</li></ol>
<h3>What should be true when you finish</h3>
<ul><li>A yes or no on paid traffic at your current budget and margin</li><li>An event map you can hand to whoever installs the code</li><li>A campaign structure with a budget that matches it</li></ul>
<h3>Do not buy this if</h3>
<ul><li>Anyone wanting creative or copy — this is measurement and structure</li><li>Advertisers with large budgets and an in-house analyst</li></ul>
<h3>What it cannot do</h3>
<p>It has no access to your ad account and cannot see your results. Everything is computed from figures you enter, and the thresholds are stated on screen.</p>
<p><em>These are decision and drafting tools, not professional advice. They compute from figures you supply and cannot verify any of them. Nothing here is financial, legal, tax, medical or investment advice.</em></p>
<h3>Guarantee</h3>
<p>14-day refund, no questions asked. Reply to your receipt and say the word. Support: hassanmosh5@gmail.com — One reply within two working days, from the person who built it.</p>
```

## Images

Upload in this order:

1. `dist/mockups/meta-ads/square.png` — main image, square, works in every grid
2. `dist/mockups/meta-ads/cover.png`
3. `dist/mockups/meta-ads/gallery-*.png`

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
