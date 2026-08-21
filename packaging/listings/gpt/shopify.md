# Digital Product Studio — custom GPT — Shopify listing

> Generated from `packaging/products/01-decide.json` by `npm run pkg:listings`.
> Edit the catalogue, not this file — it is overwritten on every run.

Paste each block into the matching field. Character counts are shown so nothing
arrives truncated.

Images for this product: `dist/mockups/gpt/` — cover, square, story and gallery shots.
Package files: `dist/packages/gpt/` — one ZIP per licence tier.
Support address on all listings: hassanmosh5@gmail.com

---

## Product setup

| Field | Value |
|---|---|
| Handle | `gpt` |
| Product type | Digital download |
| Vendor | MOSH Digital Studios |
| Collection | ðŸ§­ Start & decide |
| Charge tax | Your call — digital goods are taxed differently by market |
| **This is a physical product** | **Untick.** Nothing here ships. |
| Inventory tracking | Off |

**Title** — 35/70 characters

```
Digital Product Studio — custom GPT
```

**SEO title** — 66/70 characters

```
Digital Product Studio — custom GPT — A GPT that argues with your…
```

**Meta description** — 152/155 characters

```
Paste-ready instructions, configuration and knowledge file for a ChatGPT custom GPT that takes you from 'I don't know what to sell' to a listed product.
```


**Tags**

```
custom gpt, chatgpt, digital product, gpt instructions, ai assistant setup, knowledge file, product validation, prompt engineering, gpt configuration, no code
```

## Variants — one per licence

| Option: Licence | Price | SKU | File |
|---|---|---|---|
| Solo licence | $24 | `GPT-SOLO` | `gpt-solo.zip` |
| Studio licence | $60 | `GPT-STUDIO` | `gpt-studio.zip` |
| Agency licence | $120 | `GPT-AGENCY` | `gpt-agency.zip` |

## Description (HTML) — paste into the code view of the description box

```html
<p><strong>Paste-ready instructions, configuration and knowledge file for a ChatGPT custom GPT that takes you from &#39;I don&#39;t know what to sell&#39; to a listed product.</strong></p>
<h3>The problem</h3>
<p>Ask a general chat model about digital products and you get the same eight bullet points everyone else gets, with a confident tone and no method underneath. It will never tell you the idea is bad, because nothing in its instructions permits that. A custom GPT with a real method, hard floors and a knowledge file behaves differently — but writing those three files is a day&#39;s work most people never do.</p>
<p>It deals specifically with:</p>
<ul><li>Generic AI business advice with no validation step in it</li><li>Re-pasting your context at the start of every conversation</li><li>An assistant that cannot say &#39;do not build this&#39;</li><li>Pricing suggestions pulled from nowhere</li></ul>
<h3>Who it is for</h3>
<ul><li>ChatGPT Plus users who want one assistant that knows a method rather than generic advice</li><li>Anyone who keeps re-explaining their business at the start of every chat</li><li>People who want the validation gate available in conversation</li></ul>
<h3>What you get</h3>
<ul><li>instructions.txt — the system instructions, written to sit just under the 8,000-character field limit</li><li>configuration.md — every other field: name, description, conversation starters, capabilities, publishing settings</li><li>knowledge/digital-product-playbook.md — the reference file: pricing tables, platform comparison, validation methods, income projections</li><li>A ten-minute setup guide with the exact clicks</li></ul>
<p>Delivered as a ZIP: the app, a START-HERE page, full usage instructions, your licence, and a checksum list of every file. Free updates to the version you bought for 12 months. You keep the files forever either way.</p>
<h3>How you use it</h3>
<ol><li>Open README.md and follow the ten-minute setup.</li><li>Create a GPT at chatgpt.com/gpts/editor and switch straight to the Configure tab.</li><li>Paste instructions.txt into Instructions and the fields from configuration.md into their boxes.</li><li>Upload knowledge/digital-product-playbook.md as a knowledge file.</li><li>Test it with an idea you already know is bad and check that it says so.</li></ol>
<h3>What should be true when you finish</h3>
<ul><li>A working custom GPT in about ten minutes</li><li>An assistant that runs the 3 Criteria and the 30-Minute Validation Method rather than improvising</li><li>Advice that matches one documented method instead of the average of the internet</li></ul>
<h3>Do not buy this if</h3>
<ul><li>Anyone without ChatGPT Plus, Pro, Team or Enterprise — custom GPTs require a paid plan</li><li>People expecting the GPT to build the product for them</li></ul>
<h3>What it cannot do</h3>
<p>These are configuration files, not software. What the model does with them depends on the model, and OpenAI changes it without asking either of us.</p>
<p><em>These are decision and drafting tools, not professional advice. They compute from figures you supply and cannot verify any of them. Nothing here is financial, legal, tax, medical or investment advice.</em></p>
<h3>Guarantee</h3>
<p>14-day refund, no questions asked. Reply to your receipt and say the word. Support: hassanmosh5@gmail.com — One reply within two working days, from the person who built it.</p>
```

## Images

Upload in this order:

1. `dist/mockups/gpt/square.png` — main image, square, works in every grid
2. `dist/mockups/gpt/cover.png`
3. `dist/mockups/gpt/gallery-*.png`

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
