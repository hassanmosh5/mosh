# MOSH Product Factory — Selar listing

> Generated from `packaging/products/01-decide.json` by `npm run pkg:listings`.
> Edit the catalogue, not this file — it is overwritten on every run.

Paste each block into the matching field. Character counts are shown so nothing
arrives truncated.

Images for this product: `dist/mockups/product-factory/` — cover, square, story and gallery shots.
Package files: `dist/packages/product-factory/` — one ZIP per licence tier.
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
| Link | `product-factory` → https://selar.com/moshdigitalstudios/product-factory |
| Category | Start & decide |

**Product name** — 20/80 characters

```
MOSH Product Factory
```

**Short description** — 50/160 characters

```
How many products a month can you actually finish?
```


## Pricing

| Licence | GHS | NGN | USD |
|---|---|---|---|
| Solo licence | GHS 740 | NGN 91,500 | $59 |
| Studio licence (default) | GHS 1,850 | NGN 229,500 | $148 |
| Agency licence | GHS 3,690 | NGN 457,500 | $295 |

Rates were converted at 12.5 GHS and 1550 NGN
to the dollar, noted 2026-08-17. **Re-check before launch** —
a stale rate quietly changes your margin.

## Description

**Description** — 3028/8000 characters

```
A production console for a one-person studio: twelve products ranked by score per hour, three workflows with human gates, and the catalogue size where upkeep eats the week.

THE PROBLEM

Every product plan is a claim about time, and almost nobody checks it. Twelve products at 'a few days each' is a year, the upkeep on the first six eats the week you were going to build the seventh in, and the roadmap quietly becomes a list of things you feel guilty about. The question everything turns on is not what to build. It is how many you can finish.

It deals specifically with:

• A roadmap that assumes more building hours than the week contains
• Choosing the next product by enthusiasm instead of score per hour
• AI-assisted output shipped without the specific checks its category needs
• Unit economics discovered after launch, when the price is already public

WHO IT IS FOR

• Solo studios running more than one product at a time
• Anyone whose roadmap assumes hours they do not have
• Small teams deciding what to build next and in what order

WHAT YOU GET

• Twelve products ranked by score per hour — the ordering that survives a real calendar
• Three production workflows with their human gates marked, so nothing ships unread
• Seven agent briefs, ready to hand to a model or a person
• Eighteen category-specific accuracy checks — what actually goes wrong per product type
• Unit economics and funnel sensitivity on your figures
• A catalogue simulation that finds the size at which upkeep consumes the whole week

Delivered as a ZIP: the app itself, a START-HERE page, full usage instructions,
your licence, and a checksum list of every file so you can verify what arrived.

Free updates to the version you bought for 12 months. You keep the files forever either way.

HOW YOU USE IT

1. Open index.html — a worked example loads by default.
2. Enter your real available hours. Optimism here invalidates everything downstream.
3. Read the Ideas tab ranked by score per hour, not by score.
4. Run the catalogue simulation and note the month upkeep overtakes production.
5. Export the schedule and work from it.

WHAT SHOULD BE TRUE WHEN YOU FINISH

• A build order with a reason attached to each position
• The number of products your week can actually sustain, computed rather than hoped
• A gate list that stops AI output shipping unchecked

WHAT IT IS NOT

• Teams big enough that the constraint is coordination, not hours
• Anyone wanting it to generate the products — it prices the hours, it does not do them

It has no exchange rate and no market data. Every figure it reports is derived from inputs you supplied and rules you can read.

These are decision and drafting tools, not professional advice. They compute from figures you supply and cannot verify any of them. Nothing here is financial, legal, tax, medical or investment advice.

14-day refund, no questions asked. Reply to your receipt and say the word.

Support: hassanmosh5@gmail.com — One reply within two working days, from the person who built it.
```


## Images

- Main: `dist/mockups/product-factory/square.png`
- Additional: `dist/mockups/product-factory/cover.png`, `gallery-*.png`

## Delivery

Selar delivers the file itself. Upload `product-factory-studio.zip` as the
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
