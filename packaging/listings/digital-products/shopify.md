# Digital Products Maker — Shopify listing

> Generated from `packaging/products/01-decide.json` by `npm run pkg:listings`.
> Edit the catalogue, not this file — it is overwritten on every run.

Paste each block into the matching field. Character counts are shown so nothing
arrives truncated.

Images for this product: `dist/mockups/digital-products/` — cover, square, story and gallery shots.
Package files: `dist/packages/digital-products/` — one ZIP per licence tier.
Support address on all listings: hassanmosh5@gmail.com

---

## Product setup

| Field | Value |
|---|---|
| Handle | `digital-products` |
| Product type | Digital download |
| Vendor | MOSH Digital Studios |
| Collection | 🧭 Start & decide |
| Charge tax | Your call — digital goods are taxed differently by market |
| **This is a physical product** | **Untick.** Nothing here ships. |
| Inventory tracking | Off |

**Title** — 22/70 characters

```
Digital Products Maker
```

**SEO title** — 65/70 characters

```
Digital Products Maker — The hour before you build, done properly
```

**Meta description** — 144/155 characters

```
Eight product formats compared on how much AI really carries, a validation gate with hard floors that can return a kill, and the fee arithmetic.
```


**Tags**

```
digital product validation, product idea checker, ebook vs course, template pack, pricing calculator, gumroad seller tools, product market fit, ai product workflow, offline tool, etsy digital
```

## Variants — one per licence

| Option: Licence | Price | SKU | File |
|---|---|---|---|
| Solo licence | $39 | `DIGITALPRODUCTS-SOLO` | `digital-products-solo.zip` |
| Studio licence | $98 | `DIGITALPRODUCTS-STUDIO` | `digital-products-studio.zip` |
| Agency licence | $195 | `DIGITALPRODUCTS-AGENCY` | `digital-products-agency.zip` |

## Description (HTML) — paste into the code view of the description box

```html
<p><strong>Eight product formats compared on how much AI really carries, a validation gate with hard floors that can return a kill, and the fee arithmetic.</strong></p>
<h3>The problem</h3>
<p>A digital product has no marginal cost, which is the whole appeal and also the trap: the entire cost is paid up front, before one person has said they want it. Eleven hours in a document is eleven hours whether it sells four hundred copies or none — and by the time you find out, the money is already spent. The only decision that changes the outcome is made before you build.</p>
<p>It deals specifically with:</p>
<ul><li>Picking a format because it sounds fun rather than because AI actually carries most of the work</li><li>Building for weeks with no evidence anyone will pay, then calling it a marketing problem</li><li>Pricing at $19 without knowing what the platform fee, the refund rate and the traffic leave you</li><li>Prompts that produce a generic first draft because they were written from nothing</li></ul>
<h3>Who it is for</h3>
<ul><li>Anyone about to spend a weekend building something nobody asked for</li><li>Creators choosing between an ebook, a template pack, a course and a notion of a course</li><li>Sellers who cannot work out why a $19 product earns $6</li></ul>
<h3>What you get</h3>
<ul><li>Formats — eight product types scored on how much of the work AI genuinely does, with build hours attached</li><li>The gate — three criteria with hard floors; miss one and the app says kill, not &#39;consider adjusting&#39;</li><li>30-Minute Validation — the method on a clock, with what to search and what counts as evidence</li><li>Build — the eight-step workflow with the prompts written from your own answers, not templates</li><li>Numbers — fee, refund and traffic arithmetic that says how many visitors the price actually needs</li><li>Launch and Kit — the listing structure and a one-page export of the whole decision</li></ul>
<p>Delivered as a ZIP: the app, a START-HERE page, full usage instructions, your licence, and a checksum list of every file. Free updates to the version you bought for 12 months. You keep the files forever either way.</p>
<h3>How you use it</h3>
<ol><li>Open index.html and describe the product in the Product tab — one honest paragraph.</li><li>Compare Formats before you commit. The build-hours column is the one people skip and regret.</li><li>Run the gate. If it kills the idea, that is the product working; change an input or change the idea.</li><li>Do the 30-minute validation with real marketplace tabs open. The app has no network access — the evidence has to be yours.</li><li>Take the Build prompts into any chat model, then run the Numbers tab before you set a price.</li></ol>
<h3>What should be true when you finish</h3>
<ul><li>A yes or a no on this specific product, with the number that decided it</li><li>If yes: the eight prompts that build it, already carrying your context</li><li>The visitor count your price and conversion rate really require, before you promise yourself anything</li></ul>
<h3>Do not buy this if</h3>
<ul><li>People who want the product written for them — nothing here talks to a model</li><li>Anyone unwilling to have an idea killed by their own numbers</li></ul>
<h3>What it cannot do</h3>
<p>Both gates can return a kill. The arithmetic quotes figures, never percentages of success it cannot know.</p>
<p><em>These are decision and drafting tools, not professional advice. They compute from figures you supply and cannot verify any of them. Nothing here is financial, legal, tax, medical or investment advice.</em></p>
<h3>Guarantee</h3>
<p>14-day refund, no questions asked. Reply to your receipt and say the word. Support: hassanmosh5@gmail.com — One reply within two working days, from the person who built it.</p>
```

## Images

Upload in this order:

1. `dist/mockups/digital-products/square.png` — main image, square, works in every grid
2. `dist/mockups/digital-products/cover.png`
3. `dist/mockups/digital-products/gallery-*.png`

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
