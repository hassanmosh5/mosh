# Store Setup Guides — Shopify & E-Commerce — Shopify listing

> Generated from `packaging/products/02-package.json` by `npm run pkg:listings`.
> Edit the catalogue, not this file — it is overwritten on every run.

Paste each block into the matching field. Character counts are shown so nothing
arrives truncated.

Images for this product: `dist/mockups/ecommerce-setup/` — cover, square, story and gallery shots.
Package files: `dist/packages/ecommerce-setup/` — one ZIP per licence tier.
Support address on all listings: hassanmosh5@gmail.com

---

## Product setup

| Field | Value |
|---|---|
| Handle | `ecommerce-setup` |
| Product type | Digital download |
| Vendor | MOSH Digital Studios |
| Collection | ðŸ“¦ Package & sell |
| Charge tax | Your call — digital goods are taxed differently by market |
| **This is a physical product** | **Untick.** Nothing here ships. |
| Inventory tracking | Off |

**Title** — 41/70 characters

```
Store Setup Guides — Shopify & E-Commerce
```

**SEO title** — 62/70 characters

```
Store Setup Guides — Shopify & E-Commerce — When to leave the…
```

**Meta description** — 144/155 characters

```
Six weighted questions on whether you need your own store yet, a break-even calculator for platform fees, and the build in eleven ordered steps.
```


**Tags**

```
shopify setup, own store vs marketplace, platform fees, break even, digital delivery, ecommerce guide, gumroad fees, store launch, checkout setup, offline guide
```

## Variants — one per licence

| Option: Licence | Price | SKU | File |
|---|---|---|---|
| Solo licence | $29 | `ECOMMERCESETUP-SOLO` | `ecommerce-setup-solo.zip` |
| Studio licence | $73 | `ECOMMERCESETUP-STUDIO` | `ecommerce-setup-studio.zip` |
| Agency licence | $145 | `ECOMMERCESETUP-AGENCY` | `ecommerce-setup-agency.zip` |

## Description (HTML) — paste into the code view of the description box

```html
<p><strong>Six weighted questions on whether you need your own store yet, a break-even calculator for platform fees, and the build in eleven ordered steps.</strong></p>
<h3>The problem</h3>
<p>Every step before this one is documented in detail — validation, listing SEO, pricing bands, launch plans — and then the last step, owning your store, is a single sentence: do it once you are earning consistently. That leaves the two questions that matter unanswered. Is it worth it at your volume, and in what order do you build it?</p>
<p>It deals specifically with:</p>
<ul><li>Opening a store too early and paying a monthly fee out of three sales</li><li>Staying on a marketplace long past the point the fees exceed a subscription</li><li>Building a store in the wrong order and redoing the checkout twice</li><li>No plan for the direct customer relationship the move was supposed to buy</li></ul>
<h3>Who it is for</h3>
<ul><li>Sellers doing consistent numbers on Gumroad, Etsy or Selar and wondering about their own store</li><li>Anyone paying marketplace fees and unsure whether a subscription beats them</li><li>First-time store builders who want an order of operations</li></ul>
<h3>What you get</h3>
<ul><li>Choose — six weighted questions and a verdict on whether you need a store yet</li><li>A break-even calculator for the only fee question that matters: marketplace percentage against monthly subscription</li><li>Set Up — the build in eleven ordered steps, each with what &#39;done&#39; looks like</li><li>Payments and digital delivery, including what a store does not do for you</li><li>The migration path off a marketplace without losing the reviews you earned</li><li>A launch checklist for the first week live</li></ul>
<p>Delivered as a ZIP: the app, a START-HERE page, full usage instructions, your licence, and a checksum list of every file. Free updates to the version you bought for 12 months. You keep the files forever either way.</p>
<h3>How you use it</h3>
<ol><li>Open index.html and answer the six questions honestly.</li><li>Put your real monthly sales and fee percentage into the break-even calculator.</li><li>If the verdict is &#39;not yet&#39;, close the tab and re-run it in a quarter. That is a result.</li><li>If it is yes, work the eleven steps in order.</li><li>Use the launch checklist before you announce anything.</li></ol>
<h3>What should be true when you finish</h3>
<ul><li>A yes or no on the store, with the volume figure that decided it</li><li>The break-even number of sales per month, in your currency</li><li>Eleven steps in the right order, so nothing gets built twice</li></ul>
<h3>Do not buy this if</h3>
<ul><li>Sellers with no sales yet — the honest answer will be &#39;not yet&#39; and you can have that for free</li><li>Physical-goods logistics; this is about digital delivery</li></ul>
<h3>What it cannot do</h3>
<p>The break-even is computed from the fee percentages and volume you type. It has no live pricing for any platform — check the current plans before you commit.</p>
<p><em>These are decision and drafting tools, not professional advice. They compute from figures you supply and cannot verify any of them. Nothing here is financial, legal, tax, medical or investment advice.</em></p>
<h3>Guarantee</h3>
<p>14-day refund, no questions asked. Reply to your receipt and say the word. Support: hassanmosh5@gmail.com — One reply within two working days, from the person who built it.</p>
```

## Images

Upload in this order:

1. `dist/mockups/ecommerce-setup/square.png` — main image, square, works in every grid
2. `dist/mockups/ecommerce-setup/cover.png`
3. `dist/mockups/ecommerce-setup/gallery-*.png`

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
