# Billionaire Structures Guide — Shopify listing

> Generated from `packaging/products/06-life.json` by `npm run pkg:listings`.
> Edit the catalogue, not this file — it is overwritten on every run.

Paste each block into the matching field. Character counts are shown so nothing
arrives truncated.

Images for this product: `dist/mockups/billionaire-structures/` — cover, square, story and gallery shots.
Package files: `dist/packages/billionaire-structures/` — one ZIP per licence tier.
Support address on all listings: hassanmosh5@gmail.com

---

## Product setup

| Field | Value |
|---|---|
| Handle | `billionaire-structures` |
| Product type | Digital download |
| Vendor | MOSH Digital Studios |
| Collection | ðŸ¦ Money, property & life |
| Charge tax | Your call — digital goods are taxed differently by market |
| **This is a physical product** | **Untick.** Nothing here ships. |
| Inventory tracking | Off |

**Title** — 28/70 characters

```
Billionaire Structures Guide
```

**SEO title** — 69/70 characters

```
Billionaire Structures Guide — It will tell you that you need almost…
```

**Meta description** — 149/155 characters

```
33 holding structures with who controls them, who pays the tax and what happens at death — each priced, and given a verdict against your own numbers.
```


**Tags**

```
holding company, family trust, estate planning, asset protection, succession planning, family office, wealth structures, inheritance tax, business structure, offline guide
```

## Variants — one per licence

| Option: Licence | Price | SKU | File |
|---|---|---|---|
| Solo licence | $69 | `BILLIONAIRESTRUCTURES-SOLO` | `billionaire-structures-solo.zip` |
| Studio licence | $173 | `BILLIONAIRESTRUCTURES-STUDIO` | `billionaire-structures-studio.zip` |
| Agency licence | $345 | `BILLIONAIRESTRUCTURES-AGENCY` | `billionaire-structures-agency.zip` |

## Description (HTML) — paste into the code view of the description box

```html
<p><strong>33 holding structures with who controls them, who pays the tax and what happens at death — each priced, and given a verdict against your own numbers.</strong></p>
<h3>The problem</h3>
<p>A list of the structures rich people use is free and useless. Every one of them has an annual bill, a failure mode, and a level of wealth below which it costs more than it will ever save — and almost nobody who sells them says so. Most of the field, moreover, is an answer to a transfer tax that half the world does not levy.</p>
<p>It deals specifically with:</p>
<ul><li>Being sold a structure designed for a tax your country does not have</li><li>No way to compare an annual cost against a benefit you cannot quantify</li><li>Four different questions — control, tax, protection, succession — treated as one</li><li>Plans with red lines in them that nobody has audited</li></ul>
<h3>Who it is for</h3>
<ul><li>Business owners who have been quoted for a trust and cannot tell whether it is warranted</li><li>Anyone in a country with no estate tax being sold structures designed around one</li><li>People with real assets and no plan for what happens when they die</li></ul>
<h3>What you get</h3>
<ul><li>33 structures: who owns it, who controls it, who pays the tax, what happens at death</li><li>A price on each one — setup and annual — so the cost is visible next to the benefit</li><li>15 editable death-tax regimes, including the many that levy nothing</li><li>The freeze, liquidity, control and giving arithmetic</li><li>A verdict per structure against your own figures, most of which will be &#39;not you&#39;</li><li>A red-lines audit that can fail a plan outright</li></ul>
<p>Delivered as a ZIP: the app, a START-HERE page, full usage instructions, your licence, and a checksum list of every file. Free updates to the version you bought for 12 months. You keep the files forever either way.</p>
<h3>How you use it</h3>
<ol><li>Open index.html and select your jurisdiction first — it rules structures out by name.</li><li>Enter your real figures. The verdicts are meaningless without them.</li><li>Read the structures it rules out and why. That is most of the value.</li><li>Run the red-lines audit on any plan you have been sold.</li><li>Take the output to a qualified adviser rather than acting on it.</li></ol>
<h3>What should be true when you finish</h3>
<ul><li>A shortlist that is usually much shorter than expected, with reasons</li><li>The wealth level at which each structure starts to pay for itself</li><li>A written brief you can take to an actual adviser, so the meeting starts at question four</li></ul>
<h3>Do not buy this if</h3>
<ul><li>Anyone wanting legal or tax advice — this is educational and computes from your inputs</li><li>People looking for offshore secrecy; that is not what this is about</li></ul>
<h3>What it cannot do</h3>
<p>Not legal, tax or financial advice. Regimes change and the app&#39;s 15 are editable precisely because they go stale. Anything you act on should be checked by someone qualified and accountable in your jurisdiction.</p>
<p><em>These are decision and drafting tools, not professional advice. They compute from figures you supply and cannot verify any of them. Nothing here is financial, legal, tax, medical or investment advice.</em></p>
<h3>Guarantee</h3>
<p>14-day refund, no questions asked. Reply to your receipt and say the word. Support: hassanmosh5@gmail.com — One reply within two working days, from the person who built it.</p>
```

## Images

Upload in this order:

1. `dist/mockups/billionaire-structures/square.png` — main image, square, works in every grid
2. `dist/mockups/billionaire-structures/cover.png`
3. `dist/mockups/billionaire-structures/gallery-*.png`

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
