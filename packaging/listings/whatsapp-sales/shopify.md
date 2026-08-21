# WhatsApp AI Sales Assistant — Shopify listing

> Generated from `packaging/products/05-agents.json` by `npm run pkg:listings`.
> Edit the catalogue, not this file — it is overwritten on every run.

Paste each block into the matching field. Character counts are shown so nothing
arrives truncated.

Images for this product: `dist/mockups/whatsapp-sales/` — cover, square, story and gallery shots.
Package files: `dist/packages/whatsapp-sales/` — one ZIP per licence tier.
Support address on all listings: hassanmosh5@gmail.com

---

## Product setup

| Field | Value |
|---|---|
| Handle | `whatsapp-sales` |
| Product type | Digital download |
| Vendor | MOSH Digital Studios |
| Collection | ðŸ¤– AI agents & automation |
| Charge tax | Your call — digital goods are taxed differently by market |
| **This is a physical product** | **Untick.** Nothing here ships. |
| Inventory tracking | Off |

**Title** — 27/70 characters

```
WhatsApp AI Sales Assistant
```

**SEO title** — 70/70 characters

```
WhatsApp AI Sales Assistant — The 24-hour window decides what you may…
```

**Meta description** — 153/155 characters

```
Turns 'we should put AI on our WhatsApp' into a build spec: qualification playbook, prompt, templates checked against platform rules, and the cost model.
```


**Tags**

```
whatsapp business api, whatsapp ai, chat sales, message templates, 24 hour window, conversation pricing, lead qualification, chat commerce, sales assistant, offline
```

## Variants — one per licence

| Option: Licence | Price | SKU | File |
|---|---|---|---|
| Solo licence | $49 | `WHATSAPPSALES-SOLO` | `whatsapp-sales-solo.zip` |
| Studio licence | $123 | `WHATSAPPSALES-STUDIO` | `whatsapp-sales-studio.zip` |
| Agency licence | $245 | `WHATSAPPSALES-AGENCY` | `whatsapp-sales-agency.zip` |

## Description (HTML) — paste into the code view of the description box

```html
<p><strong>Turns &#39;we should put AI on our WhatsApp&#39; into a build spec: qualification playbook, prompt, templates checked against platform rules, and the cost model.</strong></p>
<h3>The problem</h3>
<p>On WhatsApp the selling is the easy half. The half that sinks these builds is a set of platform rules: what a template may say, when a session is open, what a follow-up is allowed to be once the 24-hour window closes, and what each conversation category costs. Get those wrong and your templates are rejected, your follow-ups never arrive, and the per-conversation bill arrives anyway.</p>
<p>It deals specifically with:</p>
<ul><li>Template messages rejected for reasons nobody explains</li><li>Follow-ups sent outside the 24-hour window that silently do nothing</li><li>Conversation costs discovered on the first invoice</li><li>Assistants that qualify nobody and hand every chat to a human anyway</li></ul>
<h3>Who it is for</h3>
<ul><li>Businesses selling in a chat window rather than on a website</li><li>Agencies building WhatsApp automations for clients</li><li>Anyone whose template messages keep getting rejected</li></ul>
<h3>What you get</h3>
<ul><li>A qualification playbook — what to ask, in what order, and when to hand over</li><li>A system prompt and a knowledge file generated from your own offer and policies</li><li>Message templates checked against the platform&#39;s content rules before you submit them</li><li>The 24-hour window arithmetic that decides what each follow-up may legally be</li><li>A cost model per conversation category, at your volume</li><li>The conversion lift the whole build must earn to be worth doing</li></ul>
<p>Delivered as a ZIP: the app, a START-HERE page, full usage instructions, your licence, and a checksum list of every file. Free updates to the version you bought for 12 months. You keep the files forever either way.</p>
<h3>How you use it</h3>
<ol><li>Open index.html and describe your offer and qualification criteria.</li><li>Draft templates in the checker; fix what it flags before submitting to Meta.</li><li>Model your conversation volume and read the monthly cost.</li><li>Compare that against the required conversion lift. If the lift is implausible, stop here.</li><li>Hand the prompt, knowledge file and templates to whoever builds it.</li></ol>
<h3>What should be true when you finish</h3>
<ul><li>Templates that pass review the first time</li><li>A follow-up schedule that respects the window instead of hoping</li><li>A number for the conversion lift required before you commit</li></ul>
<h3>Do not buy this if</h3>
<ul><li>Anyone wanting the bot itself — this is the specification</li><li>Bulk messaging or anything resembling unsolicited broadcast</li></ul>
<h3>What it cannot do</h3>
<p>Platform rules and pricing change without notice. The checker encodes them as of writing; re-read Meta&#39;s current policy before you submit templates.</p>
<p><em>These are decision and drafting tools, not professional advice. They compute from figures you supply and cannot verify any of them. Nothing here is financial, legal, tax, medical or investment advice.</em></p>
<h3>Guarantee</h3>
<p>14-day refund, no questions asked. Reply to your receipt and say the word. Support: hassanmosh5@gmail.com — One reply within two working days, from the person who built it.</p>
```

## Images

Upload in this order:

1. `dist/mockups/whatsapp-sales/square.png` — main image, square, works in every grid
2. `dist/mockups/whatsapp-sales/cover.png`
3. `dist/mockups/whatsapp-sales/gallery-*.png`

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
