# AI Website Prompt Kit — Shopify listing

> Generated from `packaging/products/04-growth.json` by `npm run pkg:listings`.
> Edit the catalogue, not this file — it is overwritten on every run.

Paste each block into the matching field. Character counts are shown so nothing
arrives truncated.

Images for this product: `dist/mockups/website-prompts/` — cover, square, story and gallery shots.
Package files: `dist/packages/website-prompts/` — one ZIP per licence tier.
Support address on all listings: hassanmosh5@gmail.com

---

## Product setup

| Field | Value |
|---|---|
| Handle | `website-prompts` |
| Product type | Digital download |
| Vendor | MOSH Digital Studios |
| Collection | 📈 Marketing & growth |
| Charge tax | Your call — digital goods are taxed differently by market |
| **This is a physical product** | **Untick.** Nothing here ships. |
| Inventory tracking | Off |

**Title** — 21/70 characters

```
AI Website Prompt Kit
```

**SEO title** — 68/70 characters

```
AI Website Prompt Kit — Decide it, or the builder decides it for you
```

**Meta description** — 155/155 characters

```
Works out what an AI site builder must be told before the first message, writes the prompts from your answers, and prices what the missing answers cost in…
```


**Tags**

```
ai website builder, website prompts, web design brief, lovable prompts, v0 prompts, site copy, client website, prompt kit, web project brief, offline
```

## Variants — one per licence

| Option: Licence | Price | SKU | File |
|---|---|---|---|
| Solo licence | $29 | `WEBSITEPROMPTS-SOLO` | `website-prompts-solo.zip` |
| Studio licence | $73 | `WEBSITEPROMPTS-STUDIO` | `website-prompts-studio.zip` |
| Agency licence | $145 | `WEBSITEPROMPTS-AGENCY` | `website-prompts-agency.zip` |

## Description (HTML) — paste into the code view of the description box

```html
<p><strong>Works out what an AI site builder must be told before the first message, writes the prompts from your answers, and prices what the missing answers cost in redos.</strong></p>
<h3>The problem</h3>
<p>An AI website builder never asks for what it was not given. Say &#39;build me a site for my roofing business&#39; and it does not stop — it produces one, with an invented brand, invented services, invented testimonials, a stack it chose silently, and a purple gradient hero. None of those were rejected; they were never considered. And every later prompt inherits them, so messages two through ten are spent undoing defaults you never picked.</p>
<p>It deals specifically with:</p>
<ul><li>Vague prompts whose real cost is the redo, not a slightly worse site</li><li>Invented content — fake testimonials and services — appearing in a client demo</li><li>A tech stack chosen silently by the model</li><li>Ten follow-up prompts fighting decisions made in prompt one</li></ul>
<h3>Who it is for</h3>
<ul><li>Anyone building a site with an AI builder or a chat model</li><li>Freelancers producing client sites and re-prompting for hours</li><li>People on their third purple-gradient hero</li></ul>
<h3>What you get</h3>
<ul><li>The decision list — everything a builder will otherwise decide for you, in order</li><li>Prompts written from your answers, per page and per section</li><li>A content inventory that separates what you have from what must be written</li><li>Redo arithmetic: what each unanswered question costs in credits and hours</li><li>Guardrails against invented facts, testimonials and statistics</li><li>A handover-ready brief for a client or a contractor</li></ul>
<p>Delivered as a ZIP: the app, a START-HERE page, full usage instructions, your licence, and a checksum list of every file. Free updates to the version you bought for 12 months. You keep the files forever either way.</p>
<h3>How you use it</h3>
<ol><li>Open index.html and work down the decision list before opening any builder.</li><li>Fill in the content inventory honestly — what does not exist has to be written by someone.</li><li>Generate the prompts and paste the first one whole.</li><li>Keep the guardrail lines in every prompt; they are what stop invention.</li><li>Save the brief; the next site starts from it.</li></ol>
<h3>What should be true when you finish</h3>
<ul><li>A first prompt that produces a site worth iterating on</li><li>No invented testimonials in anything you show a client</li><li>A written brief you can reuse for the next site in ten minutes</li></ul>
<h3>Do not buy this if</h3>
<ul><li>Anyone wanting the site built here — it writes the prompts, not the HTML</li><li>Bespoke application development</li></ul>
<h3>What it cannot do</h3>
<p>Nothing here talks to a model. It works out what the model should be told, and prices what leaving it unsaid costs.</p>
<p><em>These are decision and drafting tools, not professional advice. They compute from figures you supply and cannot verify any of them. Nothing here is financial, legal, tax, medical or investment advice.</em></p>
<h3>Guarantee</h3>
<p>14-day refund, no questions asked. Reply to your receipt and say the word. Support: hassanmosh5@gmail.com — One reply within two working days, from the person who built it.</p>
```

## Images

Upload in this order:

1. `dist/mockups/website-prompts/square.png` — main image, square, works in every grid
2. `dist/mockups/website-prompts/cover.png`
3. `dist/mockups/website-prompts/gallery-*.png`

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
