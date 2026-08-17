# AI Customer Support Agent — Selar listing

> Generated from `packaging/products/05-agents.json` by `npm run pkg:listings`.
> Edit the catalogue, not this file — it is overwritten on every run.

Paste each block into the matching field. Character counts are shown so nothing
arrives truncated.

Images for this product: `dist/mockups/support-agent/` — cover, square, story and gallery shots.
Package files: `dist/packages/support-agent/` — one ZIP per licence tier.
Support address on all listings: hassanmosh5@gmail.com

---

## Why Selar for this catalogue

It settles in cedis and naira, accepts mobile money and bank transfer as well as
cards, and pays out locally. For West African buyers it converts better than a
dollar checkout, and the buyer is not paying a card's FX spread on top of your price.

## Product setup

| Field | Value |
|---|---|
| Product type | Digital product / downloadable |
| Link | `support-agent` → https://selar.com/REPLACE-ME/support-agent |
| Category | AI agents & automation |

**Product name** — 25/80 characters

```
AI Customer Support Agent
```

**Short description** — 36/160 characters

```
Containment counts the wrong tickets
```


## Pricing

| Licence | GHS | NGN | USD |
|---|---|---|---|
| Solo licence | GHS 620 | NGN 76,000 | $49 |
| Studio licence (default) | GHS 1,540 | NGN 191,000 | $123 |
| Agency licence | GHS 3,070 | NGN 380,000 | $245 |

Rates were converted at 12.5 GHS and 1550 NGN
to the dollar, noted 2026-08-17. **Re-check before launch** —
a stale rate quietly changes your margin.

## Description

**Description** — 3100/8000 characters

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


## Images

- Main: `dist/mockups/support-agent/square.png`
- Additional: `dist/mockups/support-agent/cover.png`, `gallery-*.png`

## Delivery

Selar delivers the file itself. Upload `support-agent-studio.zip` as the
product file, and the other two tiers as separate products or variants depending
on what your Selar plan supports.

To mirror sales into your own records, set the webhook to:

```
https://REPLACE-ME.example.com/api/webhooks/selar
```

**Before you rely on that webhook:** confirm the signature header and algorithm
with Selar's current documentation and set `SELAR_WEBHOOK_SECRET` (and
`SELAR_SIGNATURE_HEADER` if it differs from the default). The route refuses
unverified requests rather than guessing — see `docs/SELLING.md`.

---
14-day refund, no questions asked. Reply to your receipt and say the word.

Support: hassanmosh5@gmail.com — One reply within two working days, from the person who built it.
