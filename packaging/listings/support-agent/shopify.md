# AI Customer Support Agent — Shopify listing

> Generated from `packaging/products/05-agents.json` by `npm run pkg:listings`.
> Edit the catalogue, not this file — it is overwritten on every run.

Paste each block into the matching field. Character counts are shown so nothing
arrives truncated.

Images for this product: `dist/mockups/support-agent/` — cover, square, story and gallery shots.
Package files: `dist/packages/support-agent/` — one ZIP per licence tier.
Support address on all listings: hassanmosh5@gmail.com

---

## Product setup

| Field | Value |
|---|---|
| Handle | `support-agent` |
| Product type | Digital download |
| Vendor | MOSH Digital Studios |
| Collection | ðŸ¤– AI agents & automation |
| Charge tax | Your call — digital goods are taxed differently by market |
| **This is a physical product** | **Untick.** Nothing here ships. |
| Inventory tracking | Off |

**Title** — 25/70 characters

```
AI Customer Support Agent
```

**SEO title** — 64/70 characters

```
AI Customer Support Agent — Containment counts the wrong tickets
```

**Meta description** — 153/155 characters

```
Decides which messages an agent should answer, what it must be told, what it must never say — and how often it has to be right before it saves any money.
```


**Tags**

```
ai customer support, support automation, chatbot planning, system prompt, containment rate, test bench, helpdesk ai, intent analysis, rollout plan, offline tool
```

## Variants — one per licence

| Option: Licence | Price | SKU | File |
|---|---|---|---|
| Solo licence | $49 | `SUPPORTAGENT-SOLO` | `support-agent-solo.zip` |
| Studio licence | $123 | `SUPPORTAGENT-STUDIO` | `support-agent-studio.zip` |
| Agency licence | $245 | `SUPPORTAGENT-AGENCY` | `support-agent-agency.zip` |

## Description (HTML) — paste into the code view of the description box

```html
<p><strong>Decides which messages an agent should answer, what it must be told, what it must never say — and how often it has to be right before it saves any money.</strong></p>
<h3>The problem</h3>
<p>Support agents are sold on containment: the share of conversations the bot closes. Containment counts the tickets it answers and ignores the ones it answers wrongly, which do not cost zero — the customer comes back crosser, a person untangles it, and some of them leave. Once you count that, the whole case changes, and it changes per intent rather than for &#39;support&#39; as a whole.</p>
<p>It deals specifically with:</p>
<ul><li>Automating &#39;support&#39; as one undifferentiated thing</li><li>Business cases built on containment with no cost attached to wrong answers</li><li>Agents with no explicit refusal list, improvising on refunds and legal questions</li><li>Going live with no test bench, so the first regression is found by a customer</li></ul>
<h3>Who it is for</h3>
<ul><li>Anyone about to put an AI agent on their support inbox</li><li>Agencies selling support automation to clients</li><li>Support leads asked to justify a bot to a finance team</li></ul>
<h3>What you get</h3>
<ul><li>Intent-by-intent analysis — which of your messages are safe to automate and which are not</li><li>The accuracy threshold: how often it must be right before it saves money at your volumes</li><li>A system prompt generated from your policies, not a template</li><li>Fixed replies for the intents that must never be improvised</li><li>A 50-case test bench, including the ones designed to make it fail</li><li>A rollout plan with gates that refuse to open until the tests pass</li></ul>
<p>Delivered as a ZIP: the app, a START-HERE page, full usage instructions, your licence, and a checksum list of every file. Free updates to the version you bought for 12 months. You keep the files forever either way.</p>
<h3>How you use it</h3>
<ol><li>Open index.html and enter your ticket volume, mix and the cost of a human reply.</li><li>Work through the intents. The ones it advises against automating are the point.</li><li>Read the accuracy threshold before committing to a build.</li><li>Generate the system prompt and the fixed replies; edit the policies to match yours exactly.</li><li>Run the 50-case bench against the built agent before any rollout gate opens.</li></ol>
<h3>What should be true when you finish</h3>
<ul><li>A list of intents to automate and a list to leave alone, each with a reason</li><li>The accuracy figure the project must hit to be worth doing</li><li>A system prompt and a refusal list you can hand to whoever builds it</li></ul>
<h3>Do not buy this if</h3>
<ul><li>Anyone wanting a working chatbot — nothing here talks to a model</li><li>Teams that have already built and only need hosting</li></ul>
<h3>What it cannot do</h3>
<p>It is a planning tool. The economics are computed from your volumes and costs; the accuracy has to be measured against the bench once something exists.</p>
<p><em>These are decision and drafting tools, not professional advice. They compute from figures you supply and cannot verify any of them. Nothing here is financial, legal, tax, medical or investment advice.</em></p>
<h3>Guarantee</h3>
<p>14-day refund, no questions asked. Reply to your receipt and say the word. Support: hassanmosh5@gmail.com — One reply within two working days, from the person who built it.</p>
```

## Images

Upload in this order:

1. `dist/mockups/support-agent/square.png` — main image, square, works in every grid
2. `dist/mockups/support-agent/cover.png`
3. `dist/mockups/support-agent/gallery-*.png`

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
