# MOSH Product Factory — Shopify listing

> Generated from `packaging/products/01-decide.json` by `npm run pkg:listings`.
> Edit the catalogue, not this file — it is overwritten on every run.

Paste each block into the matching field. Character counts are shown so nothing
arrives truncated.

Images for this product: `dist/mockups/product-factory/` — cover, square, story and gallery shots.
Package files: `dist/packages/product-factory/` — one ZIP per licence tier.
Support address on all listings: hassanmosh5@gmail.com

---

## Product setup

| Field | Value |
|---|---|
| Handle | `product-factory` |
| Product type | Digital download |
| Vendor | MOSH Digital Studios |
| Collection | 🧭 Start & decide |
| Charge tax | Your call — digital goods are taxed differently by market |
| **This is a physical product** | **Untick.** Nothing here ships. |
| Inventory tracking | Off |

**Title** — 20/70 characters

```
MOSH Product Factory
```

**SEO title** — 66/70 characters

```
MOSH Product Factory — How many products a month can you actually…
```

**Meta description** — 151/155 characters

```
A production console for a one-person studio: twelve products ranked by score per hour, three workflows with human gates, and the catalogue size where…
```


**Tags**

```
product roadmap, solo founder capacity, digital product studio, unit economics, production workflow, ai quality checks, score per hour, catalogue planning, operations, offline tool
```

## Variants — one per licence

| Option: Licence | Price | SKU | File |
|---|---|---|---|
| Solo licence | $59 | `PRODUCTFACTORY-SOLO` | `product-factory-solo.zip` |
| Studio licence | $148 | `PRODUCTFACTORY-STUDIO` | `product-factory-studio.zip` |
| Agency licence | $295 | `PRODUCTFACTORY-AGENCY` | `product-factory-agency.zip` |

## Description (HTML) — paste into the code view of the description box

```html
<p><strong>A production console for a one-person studio: twelve products ranked by score per hour, three workflows with human gates, and the catalogue size where upkeep eats the week.</strong></p>
<h3>The problem</h3>
<p>Every product plan is a claim about time, and almost nobody checks it. Twelve products at &#39;a few days each&#39; is a year, the upkeep on the first six eats the week you were going to build the seventh in, and the roadmap quietly becomes a list of things you feel guilty about. The question everything turns on is not what to build. It is how many you can finish.</p>
<p>It deals specifically with:</p>
<ul><li>A roadmap that assumes more building hours than the week contains</li><li>Choosing the next product by enthusiasm instead of score per hour</li><li>AI-assisted output shipped without the specific checks its category needs</li><li>Unit economics discovered after launch, when the price is already public</li></ul>
<h3>Who it is for</h3>
<ul><li>Solo studios running more than one product at a time</li><li>Anyone whose roadmap assumes hours they do not have</li><li>Small teams deciding what to build next and in what order</li></ul>
<h3>What you get</h3>
<ul><li>Twelve products ranked by score per hour — the ordering that survives a real calendar</li><li>Three production workflows with their human gates marked, so nothing ships unread</li><li>Seven agent briefs, ready to hand to a model or a person</li><li>Eighteen category-specific accuracy checks — what actually goes wrong per product type</li><li>Unit economics and funnel sensitivity on your figures</li><li>A catalogue simulation that finds the size at which upkeep consumes the whole week</li></ul>
<p>Delivered as a ZIP: the app, a START-HERE page, full usage instructions, your licence, and a checksum list of every file. Free updates to the version you bought for 12 months. You keep the files forever either way.</p>
<h3>How you use it</h3>
<ol><li>Open index.html — a worked example loads by default.</li><li>Enter your real available hours. Optimism here invalidates everything downstream.</li><li>Read the Ideas tab ranked by score per hour, not by score.</li><li>Run the catalogue simulation and note the month upkeep overtakes production.</li><li>Export the schedule and work from it.</li></ol>
<h3>What should be true when you finish</h3>
<ul><li>A build order with a reason attached to each position</li><li>The number of products your week can actually sustain, computed rather than hoped</li><li>A gate list that stops AI output shipping unchecked</li></ul>
<h3>Do not buy this if</h3>
<ul><li>Teams big enough that the constraint is coordination, not hours</li><li>Anyone wanting it to generate the products — it prices the hours, it does not do them</li></ul>
<h3>What it cannot do</h3>
<p>It has no exchange rate and no market data. Every figure it reports is derived from inputs you supplied and rules you can read.</p>
<p><em>These are decision and drafting tools, not professional advice. They compute from figures you supply and cannot verify any of them. Nothing here is financial, legal, tax, medical or investment advice.</em></p>
<h3>Guarantee</h3>
<p>14-day refund, no questions asked. Reply to your receipt and say the word. Support: hassanmosh5@gmail.com — One reply within two working days, from the person who built it.</p>
```

## Images

Upload in this order:

1. `dist/mockups/product-factory/square.png` — main image, square, works in every grid
2. `dist/mockups/product-factory/cover.png`
3. `dist/mockups/product-factory/gallery-*.png`

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
