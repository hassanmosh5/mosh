# AI Customer Support Agent — Gumroad listing

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
| Type | Digital product |
| URL / permalink | `support-agent` → https://moshdigitalstudios.gumroad.com/l/support-agent |
| Category | AI agents & automation |
| Call to action | I want this! |

**Name** — 25/60 characters

```
AI Customer Support Agent
```

**Summary (shows under the title)** — 153/255 characters

```
Decides which messages an agent should answer, what it must be told, what it must never say — and how often it has to be right before it saves any money.
```

**Tags** — 10/12

```
ai customer support, support automation, chatbot planning, system prompt, containment rate, test bench, helpdesk ai, intent analysis, rollout plan, offline tool
```

## Versions — one product, three prices

Use Gumroad **Versions**, not three separate products. Three products split your
reviews and your ranking three ways.

| Version | Price | Attach this file |
|---|---|---|
| Solo licence | $49 | `support-agent-solo.zip` |
| Studio licence ← set as default | $123 | `support-agent-studio.zip` |
| Agency licence | $245 | `support-agent-agency.zip` |

Gumroad attaches different files to different versions. Use that rather than
maintaining three products by hand.

**Purchasing power parity:** turn it on. This is built for buyers on metered
data; pricing in US dollars without PPP prices most of them out of it.

## Description — paste into the description field

**Description** — 3100/12000 characters

```
Decides which messages an agent should answer, what it must be told, what it must never say — and how often it has to be right before it saves any money.

THE PROBLEM

Support agents are sold on containment: the share of conversations the bot closes. Containment counts the tickets it answers and ignores the ones it answers wrongly, which do not cost zero — the customer comes back crosser, a person untangles it, and some of them leave. Once you count that, the whole case changes, and it changes per intent rather than for 'support' as a whole.

It deals specifically with:

• Automating 'support' as one undifferentiated thing
• Business cases built on containment with no cost attached to wrong answers
• Agents with no explicit refusal list, improvising on refunds and legal questions
• Going live with no test bench, so the first regression is found by a customer

WHO IT IS FOR

• Anyone about to put an AI agent on their support inbox
• Agencies selling support automation to clients
• Support leads asked to justify a bot to a finance team

WHAT YOU GET

• Intent-by-intent analysis — which of your messages are safe to automate and which are not
• The accuracy threshold: how often it must be right before it saves money at your volumes
• A system prompt generated from your policies, not a template
• Fixed replies for the intents that must never be improvised
• A 50-case test bench, including the ones designed to make it fail
• A rollout plan with gates that refuse to open until the tests pass

Delivered as a ZIP: the app itself, a START-HERE page, full usage instructions,
your licence, and a checksum list of every file so you can verify what arrived.

Free updates to the version you bought for 12 months. You keep the files forever either way.

HOW YOU USE IT

1. Open index.html and enter your ticket volume, mix and the cost of a human reply.
2. Work through the intents. The ones it advises against automating are the point.
3. Read the accuracy threshold before committing to a build.
4. Generate the system prompt and the fixed replies; edit the policies to match yours exactly.
5. Run the 50-case bench against the built agent before any rollout gate opens.

WHAT SHOULD BE TRUE WHEN YOU FINISH

• A list of intents to automate and a list to leave alone, each with a reason
• The accuracy figure the project must hit to be worth doing
• A system prompt and a refusal list you can hand to whoever builds it

WHAT IT IS NOT

• Anyone wanting a working chatbot — nothing here talks to a model
• Teams that have already built and only need hosting

It is a planning tool. The economics are computed from your volumes and costs; the accuracy has to be measured against the bench once something exists.

These are decision and drafting tools, not professional advice. They compute from figures you supply and cannot verify any of them. Nothing here is financial, legal, tax, medical or investment advice.

14-day refund, no questions asked. Reply to your receipt and say the word.

Support: hassanmosh5@gmail.com — One reply within two working days, from the person who built it.
```


## Cover and thumbnail

Gumroad wants a 1280×720 cover and a 600×600 thumbnail.

- Cover: `dist/mockups/support-agent/cover.png` (already 1280×720)
- Thumbnail: `dist/mockups/support-agent/square.png` — crop to 600×600
- Extra gallery images: `dist/mockups/support-agent/gallery-*.png`

These are screenshots of the product running, not stock photography. That is
deliberate — the cover shows what arrives.

## Receipt / thank-you note

Paste into **Content → Receipt note**:

```
1. Open index.html and enter your ticket volume, mix and the cost of a human reply.
2. Work through the intents. The ones it advises against automating are the point.
3. Read the accuracy threshold before committing to a build.
```

The full receipt text is in `dist/packages/support-agent/receipt-<tier>.txt`.

## Delivery

Gumroad hosts the file and emails the link itself — nothing else to configure.

If you also want the sale recorded in your own database, point
**Settings → Advanced → Ping** at:

```
https://paystack.shop/mosh-digital-studios/api/webhooks/gumroad?secret=YOUR_GUMROAD_PING_SECRET
```

Gumroad does not sign its pings, so the URL secret and the seller-ID check in
that route are what authenticate it. See `docs/SELLING.md`.

---
14-day refund, no questions asked. Reply to your receipt and say the word.

Support: hassanmosh5@gmail.com — One reply within two working days, from the person who built it.
