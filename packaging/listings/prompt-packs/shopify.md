# AI Prompt Packs for Businesses & Creators — Shopify listing

> Generated from `packaging/products/02-package.json` by `npm run pkg:listings`.
> Edit the catalogue, not this file — it is overwritten on every run.

Paste each block into the matching field. Character counts are shown so nothing
arrives truncated.

Images for this product: `dist/mockups/prompt-packs/` — cover, square, story and gallery shots.
Package files: `dist/packages/prompt-packs/` — one ZIP per licence tier.
Support address on all listings: hassanmosh5@gmail.com

---

## Product setup

| Field | Value |
|---|---|
| Handle | `prompt-packs` |
| Product type | Digital download |
| Vendor | MOSH Digital Studios |
| Collection | ðŸ“¦ Package & sell |
| Charge tax | Your call — digital goods are taxed differently by market |
| **This is a physical product** | **Untick.** Nothing here ships. |
| Inventory tracking | Off |

**Title** — 41/70 characters

```
AI Prompt Packs for Businesses & Creators
```

**SEO title** — 70/70 characters

```
AI Prompt Packs for Businesses & Creators — 160 finished prompts, and…
```

**Meta description** — 147/155 characters

```
Eight complete prompt packs — 160 role-first prompts — plus the builder that turns any one of them into a product file you can list this afternoon.
```


**Tags**

```
prompt pack, chatgpt prompts, ai prompts for business, prompt library, sellable prompts, content prompts, marketing prompts, prompt engineering, digital product, offline
```

## Variants — one per licence

| Option: Licence | Price | SKU | File |
|---|---|---|---|
| Solo licence | $39 | `PROMPTPACKS-SOLO` | `prompt-packs-solo.zip` |
| Studio licence | $98 | `PROMPTPACKS-STUDIO` | `prompt-packs-studio.zip` |
| Agency licence | $195 | `PROMPTPACKS-AGENCY` | `prompt-packs-agency.zip` |

## Description (HTML) — paste into the code view of the description box

```html
<p><strong>Eight complete prompt packs — 160 role-first prompts — plus the builder that turns any one of them into a product file you can list this afternoon.</strong></p>
<h3>The problem</h3>
<p>Most prompt packs on sale are a list of one-line instructions with no role, no context and no output specification — which is why they earn refund requests. The difference between a pack that gets five stars and one that gets returned is five specific characteristics, and almost nobody applies them, because writing twenty good prompts for a niche you do not work in is real labour.</p>
<p>It deals specifically with:</p>
<ul><li>Prompt packs that are lists of vague instructions and disappoint on first use</li><li>Having nothing finished to sell while you decide what to make</li><li>Prompts scattered across notes with no order matching how you work</li><li>Turning a prompt collection into an actual product file with a licence and a listing</li></ul>
<h3>Who it is for</h3>
<ul><li>Sellers who want a product to list today rather than an idea to develop</li><li>Business owners who want prompts organised the way their working day is</li><li>Anyone whose prompt library is a note file with 200 lines in it</li></ul>
<h3>What you get</h3>
<ul><li>Eight finished packs, 20 prompts each — 160 role-first prompts written to be used as they stand</li><li>Each prompt carries its role, context, output format and the variables you swap</li><li>Organised by the buyer&#39;s working day rather than by prompt category</li><li>A pack builder that emits a complete product file, not an outline</li><li>The five characteristics that separate a reviewed pack from a returned one, applied throughout</li><li>Pricing model and the four channels the packs actually sell through</li></ul>
<p>Delivered as a ZIP: the app, a START-HERE page, full usage instructions, your licence, and a checksum list of every file. Free updates to the version you bought for 12 months. You keep the files forever either way.</p>
<h3>How you use it</h3>
<ol><li>Open index.html and browse the eight packs — they are finished, not samples.</li><li>Use them yourself first. A pack you have never run is a pack you cannot support.</li><li>Swap the variables for your own business or your client&#39;s.</li><li>Open the builder to assemble a pack for your niche, then export the product file.</li><li>List it with the licence included; price it against the bands in the pricing section.</li></ol>
<h3>What should be true when you finish</h3>
<ul><li>A sellable prompt pack exported today</li><li>Prompts that produce usable first drafts rather than another round of prompting</li><li>A pack structure you can refill for any niche you know</li></ul>
<h3>Do not buy this if</h3>
<ul><li>Anyone hoping to resell the 160 prompts verbatim — the licence covers use, not resale, unless you buy the Agency tier</li><li>People wanting prompts for a niche nobody has described to it</li></ul>
<h3>What it cannot do</h3>
<p>The prompts are curated and fixed, not generated — you can read every one before you buy the idea that they work.</p>
<p><em>These are decision and drafting tools, not professional advice. They compute from figures you supply and cannot verify any of them. Nothing here is financial, legal, tax, medical or investment advice.</em></p>
<h3>Guarantee</h3>
<p>14-day refund, no questions asked. Reply to your receipt and say the word. Support: hassanmosh5@gmail.com — One reply within two working days, from the person who built it.</p>
```

## Images

Upload in this order:

1. `dist/mockups/prompt-packs/square.png` — main image, square, works in every grid
2. `dist/mockups/prompt-packs/cover.png`
3. `dist/mockups/prompt-packs/gallery-*.png`

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
