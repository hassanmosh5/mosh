# AI Appointment Booking System — Selar listing

> Generated from `packaging/products/05-agents.json` by `npm run pkg:listings`.
> Edit the catalogue, not this file — it is overwritten on every run.

Paste each block into the matching field. Character counts are shown so nothing
arrives truncated.

Images for this product: `dist/mockups/appointment-booking/` — cover, square, story and gallery shots.
Package files: `dist/packages/appointment-booking/` — one ZIP per licence tier.
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
| Link | `appointment-booking` → https://selar.com/moshdigitalstudios/appointment-booking |
| Category | AI agents & automation |

**Product name** — 29/80 characters

```
AI Appointment Booking System
```

**Short description** — 49/160 characters

```
A booking agent that invents a Tuesday looks fine
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

**Description** — 3070/8000 characters

```
A timezone-correct availability engine, the agent's prompt and tools generated from your own services and policies, and a simulator that books against the real engine.

THE PROBLEM

'An AI books your appointments' is the easiest local automation to sell and the easiest to get badly wrong, because it fails quietly. A booking agent that invents a Tuesday looks exactly like one that checked. Nobody finds out until somebody drives to an appointment that was never in the diary — and by then the client has lost trust in the whole idea.

It deals specifically with:

• Agents that hallucinate availability because nothing constrains them
• Timezone arithmetic done in the prompt, which is where it goes wrong
• Prompts, tool definitions and customer messages drifting out of agreement
• Message templates that exceed an SMS segment and cost triple

WHO IT IS FOR

• Clinics, salons, garages and studios automating their diary
• Coaches with clients in other time zones
• Agencies selling booking automation to local businesses

WHAT YOU GET

• A timezone-correct availability engine: opening hours, breaks, buffers, lead times, holidays
• The system prompt and tool definitions generated from the same configuration, so they cannot disagree
• A conversation simulator that books against the real engine, not a mock
• Message templates counted in SMS segments
• Policies — cancellation, no-show, deposits — expressed once and reflected everywhere
• The wiring guide for connecting it to a real calendar

Delivered as a ZIP: the app itself, a START-HERE page, full usage instructions,
your licence, and a checksum list of every file so you can verify what arrived.

Free updates to the version you bought for 12 months. You keep the files forever either way.

HOW YOU USE IT

1. Open index.html and configure services, hours, buffers and time zone.
2. Use the simulator to book across a timezone boundary and a holiday — that is where these break.
3. Generate the prompt and tool definitions together; never edit one alone.
4. Check every message template's segment count before you approve it.
5. Follow the wiring guide to connect a real calendar.

WHAT SHOULD BE TRUE WHEN YOU FINISH

• An availability engine you can test before anything is built
• A prompt and tool schema that match the engine exactly
• Messages that fit one SMS segment and say what the policy actually is

WHAT IT IS NOT

• Anyone wanting a running booking bot — this is the specification for one
• Complex resource scheduling across many rooms and staff constraints

The engine is real and testable in the simulator. Whether the model you eventually connect obeys the tools is a property of that model, not of this file.

These are decision and drafting tools, not professional advice. They compute from figures you supply and cannot verify any of them. Nothing here is financial, legal, tax, medical or investment advice.

14-day refund, no questions asked. Reply to your receipt and say the word.

Support: hassanmosh5@gmail.com — One reply within two working days, from the person who built it.
```


## Images

- Main: `dist/mockups/appointment-booking/square.png`
- Additional: `dist/mockups/appointment-booking/cover.png`, `gallery-*.png`

## Delivery

Selar delivers the file itself. Upload `appointment-booking-studio.zip` as the
product file, and the other two tiers as separate products or variants depending
on what your Selar plan supports.

To mirror sales into your own records, set the webhook to:

```
https://paystack.shop/mosh-digital-studios/api/webhooks/selar
```

**Before you rely on that webhook:** confirm the signature header and algorithm
with Selar's current documentation and set `SELAR_WEBHOOK_SECRET` (and
`SELAR_SIGNATURE_HEADER` if it differs from the default). The route refuses
unverified requests rather than guessing — see `docs/SELLING.md`.

---
14-day refund, no questions asked. Reply to your receipt and say the word.

Support: hassanmosh5@gmail.com — One reply within two working days, from the person who built it.
