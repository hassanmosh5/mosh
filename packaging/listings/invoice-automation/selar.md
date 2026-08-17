# Invoice & Payment Automation — Selar listing

> Generated from `packaging/products/03-agency.json` by `npm run pkg:listings`.
> Edit the catalogue, not this file — it is overwritten on every run.

Paste each block into the matching field. Character counts are shown so nothing
arrives truncated.

Images for this product: `dist/mockups/invoice-automation/` — cover, square, story and gallery shots.
Package files: `dist/packages/invoice-automation/` — one ZIP per licence tier.
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
| Link | `invoice-automation` → https://selar.com/REPLACE-ME/invoice-automation |
| Category | Agency & client work |

**Product name** — 28/80 characters

```
Invoice & Payment Automation
```

**Short description** — 34/160 characters

```
Get it out right, then get it paid
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

**Description** — 3041/8000 characters

```
An invoice that adds up to the cent, due dates derived from your stated terms, a chase sequence that writes its own emails, and a live picture of what you are owed.

THE PROBLEM

Almost none of the gap between finishing work and being paid is a collections problem. It is a decisions problem: what to number the invoice, when it falls due, when to chase, what to say, what to charge for being late. Those get re-decided on every invoice, badly, under time pressure — which is why the invoice goes out late, the terms drift, the reminder never gets sent, and the money arrives whenever the client feels like it.

It deals specifically with:

• Invoices that do not quite add up, or use last quarter's tax rate
• Due dates invented per invoice instead of derived from a payment term
• Reminders never sent because each one has to be written from scratch
• No idea what is actually outstanding this week

WHO IT IS FOR

• Freelancers whose invoices go out late and get paid later
• Anyone who has never sent a payment reminder because writing it feels rude
• Small studios with money owed across several clients and no single view of it

WHAT YOU GET

• An invoice builder that reconciles to the cent, with tax and discounts handled explicitly
• Payment terms set once — deposits, Net 7/14/30 — with every date derived from them
• A chase sequence that writes each reminder, escalating in tone on a schedule you set
• Late fees calculated rather than threatened
• An ageing view: what is owed, by whom, and when it fell due
• Print and export, with your own branding

Delivered as a ZIP: the app itself, a START-HERE page, full usage instructions,
your licence, and a checksum list of every file so you can verify what arrived.

Free updates to the version you bought for 12 months. You keep the files forever either way.

HOW YOU USE IT

1. Open index.html and set your payment terms once, in Settings.
2. Build the invoice; check the total reconciles before you send.
3. Let the chase sequence generate reminder one — send it on the day it says.
4. Escalate on the schedule rather than on your mood.
5. Check the ageing view every Monday. It takes ninety seconds.

WHAT SHOULD BE TRUE WHEN YOU FINISH

• Invoices out the same day the work finishes
• Reminders that send themselves out of a queue instead of your conscience
• One number for what you are owed, and one for what is overdue

WHAT IT IS NOT

• Accounting or bookkeeping — this does not do your books
• Businesses needing e-invoicing compliance in regulated jurisdictions

The arithmetic is exact and the dates are derived from your terms. It does not connect to your bank, so payments are marked by you.

These are decision and drafting tools, not professional advice. They compute from figures you supply and cannot verify any of them. Nothing here is financial, legal, tax, medical or investment advice.

14-day refund, no questions asked. Reply to your receipt and say the word.

Support: hassanmosh5@gmail.com — One reply within two working days, from the person who built it.
```


## Images

- Main: `dist/mockups/invoice-automation/square.png`
- Additional: `dist/mockups/invoice-automation/cover.png`, `gallery-*.png`

## Delivery

Selar delivers the file itself. Upload `invoice-automation-studio.zip` as the
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
