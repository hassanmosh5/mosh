# The Canva Template Library Builder — Shopify listing

> Generated from `packaging/products/02-package.json` by `npm run pkg:listings`.
> Edit the catalogue, not this file — it is overwritten on every run.

Paste each block into the matching field. Character counts are shown so nothing
arrives truncated.

Images for this product: `dist/mockups/canva-templates/` — cover, square, story and gallery shots.
Package files: `dist/packages/canva-templates/` — one ZIP per licence tier.
Support address on all listings: hassanmosh5@gmail.com

---

## Product setup

| Field | Value |
|---|---|
| Handle | `canva-templates` |
| Product type | Digital download |
| Vendor | MOSH Digital Studios |
| Collection | ðŸ“¦ Package & sell |
| Charge tax | Your call — digital goods are taxed differently by market |
| **This is a physical product** | **Untick.** Nothing here ships. |
| Inventory tracking | Off |

**Title** — 34/70 characters

```
The Canva Template Library Builder
```

**SEO title** — 69/70 characters

```
The Canva Template Library Builder — The build sheet you need before…
```

**Meta description** — 155/155 characters

```
Niche × pack type × angle produces a complete spec — brand kit, per-template pixel dimensions, type pairing, layout — then prices, validates and schedules…
```


**Tags**

```
canva templates, template pack, etsy digital products, design system, brand kit, template business, creative market, product spec, catalogue planning, offline tool
```

## Variants — one per licence

| Option: Licence | Price | SKU | File |
|---|---|---|---|
| Solo licence | $39 | `CANVATEMPLATES-SOLO` | `canva-templates-solo.zip` |
| Studio licence | $98 | `CANVATEMPLATES-STUDIO` | `canva-templates-studio.zip` |
| Agency licence | $195 | `CANVATEMPLATES-AGENCY` | `canva-templates-agency.zip` |

## Description (HTML) — paste into the code view of the description box

```html
<p><strong>Niche × pack type × angle produces a complete spec — brand kit, per-template pixel dimensions, type pairing, layout — then prices, validates and schedules the catalogue.</strong></p>
<h3>The problem</h3>
<p>Canva templates are among the highest-volume digital products there are, and the advice about them stops at &#39;pick a niche and make a pack&#39;. What is missing is the document you need before opening Canva: which templates, at which pixel dimensions, in which colours, with which type pairing, laid out how. Without it you design one template at a time and the pack takes a fortnight.</p>
<p>It deals specifically with:</p>
<ul><li>Starting a pack with no build sheet and finishing it in fragments</li><li>Inconsistent dimensions and type across templates in the same pack</li><li>Pricing a pack by looking at one competitor</li><li>A catalogue plan that exists only as an intention</li></ul>
<h3>Who it is for</h3>
<ul><li>Designers selling template packs on Etsy, Creative Market or their own store</li><li>Anyone who opens Canva, makes three templates and loses the thread</li><li>Sellers planning a catalogue rather than a one-off pack</li></ul>
<h3>What you get</h3>
<ul><li>Pack Builder — 3,456 niche × pack-type × angle combinations, each producing a full spec</li><li>A brand kit per pack: palette, type pairing, spacing rules</li><li>Per-template build sheets with exact pixel dimensions and layout notes</li><li>Pricing bands and the six validation methods applied to your specific pack</li><li>Listing SEO structure for the marketplaces that sell these</li><li>A catalogue schedule, so pack two is planned before pack one ships</li></ul>
<p>Delivered as a ZIP: the app, a START-HERE page, full usage instructions, your licence, and a checksum list of every file. Free updates to the version you bought for 12 months. You keep the files forever either way.</p>
<h3>How you use it</h3>
<ol><li>Open index.html and choose niche, pack type and angle.</li><li>Read the generated brand kit and change what does not suit you — it is a starting point.</li><li>Take the per-template build sheet into Canva and work down it.</li><li>Run the validation before you build the second pack, not after.</li><li>Use the listing SEO structure when you upload.</li></ol>
<h3>What should be true when you finish</h3>
<ul><li>A build sheet you can work straight through in Canva</li><li>A pack that looks like one product rather than twelve unrelated files</li><li>A price you can defend and a listing already structured</li></ul>
<h3>Do not buy this if</h3>
<ul><li>Anyone expecting the templates themselves — this builds the specification, not the artwork</li><li>Designers with an established system who only need a marketplace</li></ul>
<h3>What it cannot do</h3>
<p>It generates specifications from fixed rules. Whether the niche has buyers is the validation step&#39;s job, and it needs you to look.</p>
<p><em>These are decision and drafting tools, not professional advice. They compute from figures you supply and cannot verify any of them. Nothing here is financial, legal, tax, medical or investment advice.</em></p>
<h3>Guarantee</h3>
<p>14-day refund, no questions asked. Reply to your receipt and say the word. Support: hassanmosh5@gmail.com — One reply within two working days, from the person who built it.</p>
```

## Images

Upload in this order:

1. `dist/mockups/canva-templates/square.png` — main image, square, works in every grid
2. `dist/mockups/canva-templates/cover.png`
3. `dist/mockups/canva-templates/gallery-*.png`

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
