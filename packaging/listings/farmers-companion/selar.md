# Farmer's Companion — Selar listing

> Generated from `packaging/products/06-life.json` by `npm run pkg:listings`.
> Edit the catalogue, not this file — it is overwritten on every run.

Paste each block into the matching field. Character counts are shown so nothing
arrives truncated.

Images for this product: `dist/mockups/farmers-companion/` — cover, square, story and gallery shots.
Package files: `dist/packages/farmers-companion/` — one ZIP per licence tier.
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
| Link | `farmers-companion` → https://selar.com/REPLACE-ME/farmers-companion |
| Category | Money, property & life |

**Product name** — 18/80 characters

```
Farmer's Companion
```

**Short description** — 35/160 characters

```
It will not let you type in a yield
```


## Pricing

| Licence | GHS | NGN | USD |
|---|---|---|---|
| Solo licence | GHS 490 | NGN 60,500 | $39 |
| Studio licence (default) | GHS 1,230 | NGN 152,000 | $98 |
| Agency licence | GHS 2,440 | NGN 302,500 | $195 |

Rates were converted at 12.5 GHS and 1550 NGN
to the dollar, noted 2026-08-17. **Re-check before launch** —
a stale rate quietly changes your margin.

## Description

**Description** — 2994/8000 characters

```
Which crop on which plot, planted when, watered and fed with what — ranked against whatever actually runs out first: labour, water or cash.

THE PROBLEM

Every farm-planning spreadsheet asks for a yield, and nobody can honestly supply one. Worse, most of them rank crops by margin per hectare — which is the right ranking only if land is what you run out of, and land almost never is. What runs out first is the week three crops all need weeding, the water in the driest month, or the cash between the fertiliser and the first sale.

It deals specifically with:

• Yield figures typed in as wishes and then treated as facts
• Ranking by margin per hectare when land is not the binding constraint
• Planting calendars that collide in the peak labour week
• Cash-flow gaps between input costs and first sale

WHO IT IS FOR

• Smallholders planning a season across several plots
• Agricultural extension workers and cooperatives
• Anyone whose farm plan is a spreadsheet with an optimistic yield in it

WHAT YOU GET

• Yield derived from six checkable things, with the whole multiplication shown
• Constraint detection: peak-week labour, water in the dry month, or working capital
• Ranking by margin per unit of the binding constraint, with a warning when it disagrees with per-hectare
• Plot-by-plot planting calendar with the collisions flagged
• Irrigation and fertiliser plans per planting
• Season cash flow, including the gap before the first sale

Delivered as a ZIP: the app itself, a START-HERE page, full usage instructions,
your licence, and a checksum list of every file so you can verify what arrived.

Free updates to the version you bought for 12 months. You keep the files forever either way.

HOW YOU USE IT

1. Open index.html and enter your plots, labour hours and water availability honestly.
2. Let it derive the yield. It starts at the crop ceiling and works down from what it can check.
3. Read which constraint it found binding — that is the whole ranking.
4. Fix the calendar collisions before planting, not during weeding.
5. Check the cash-flow gap and plan for it.

WHAT SHOULD BE TRUE WHEN YOU FINISH

• A crop plan ranked against what actually limits your farm
• A yield estimate you can defend, with every factor visible
• The week the labour plan breaks, before the season starts

WHAT IT IS NOT

• Anyone wanting local variety data or live prices — you supply those
• Large mechanised operations with farm-management software

It derives rather than accepts yields, which makes it conservative. Local conditions, varieties and prices are yours to enter, and it cannot check any of them.

These are decision and drafting tools, not professional advice. They compute from figures you supply and cannot verify any of them. Nothing here is financial, legal, tax, medical or investment advice.

14-day refund, no questions asked. Reply to your receipt and say the word.

Support: hassanmosh5@gmail.com — One reply within two working days, from the person who built it.
```


## Images

- Main: `dist/mockups/farmers-companion/square.png`
- Additional: `dist/mockups/farmers-companion/cover.png`, `gallery-*.png`

## Delivery

Selar delivers the file itself. Upload `farmers-companion-studio.zip` as the
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
