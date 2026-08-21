# Invoice & Payment Automation — Gumroad listing

> Generated from `packaging/products/03-agency.json` by `npm run pkg:listings`.
> Edit the catalogue, not this file — it is overwritten on every run.

Paste each block into the matching field. Character counts are shown so nothing
arrives truncated.

Images for this product: `dist/mockups/invoice-automation/` — cover, square, story and gallery shots.
Package files: `dist/packages/invoice-automation/` — one ZIP per licence tier.
Support address on all listings: hassanmosh5@gmail.com

---

## Product setup

| Field | Value |
|---|---|
| Type | Digital product |
| URL / permalink | `invoice-automation` → https://moshdigitalstudios.gumroad.com/l/invoice-automation |
| Category | Agency & client work |
| Call to action | I want this! |

**Name** — 28/60 characters

```
Invoice & Payment Automation
```

**Summary (shows under the title)** — 164/255 characters

```
An invoice that adds up to the cent, due dates derived from your stated terms, a chase sequence that writes its own emails, and a live picture of what you are owed.
```

**Tags** — 10/12

```
invoice template, freelance invoicing, payment reminders, late payment, net 30, chase sequence, accounts receivable, small business cash flow, invoice generator, offline
```

## Versions — one product, three prices

Use Gumroad **Versions**, not three separate products. Three products split your
reviews and your ranking three ways.

| Version | Price | Attach this file |
|---|---|---|
| Solo licence | $39 | `invoice-automation-solo.zip` |
| Studio licence ← set as default | $98 | `invoice-automation-studio.zip` |
| Agency licence | $195 | `invoice-automation-agency.zip` |

Gumroad attaches different files to different versions. Use that rather than
maintaining three products by hand.

**Purchasing power parity:** turn it on. This is built for buyers on metered
data; pricing in US dollars without PPP prices most of them out of it.

## Description — paste into the description field

**Description** — 3041/12000 characters

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


## Cover and thumbnail

Gumroad wants a 1280×720 cover and a 600×600 thumbnail.

- Cover: `dist/mockups/invoice-automation/cover.png` (already 1280×720)
- Thumbnail: `dist/mockups/invoice-automation/square.png` — crop to 600×600
- Extra gallery images: `dist/mockups/invoice-automation/gallery-*.png`

These are screenshots of the product running, not stock photography. That is
deliberate — the cover shows what arrives.

## Receipt / thank-you note

Paste into **Content → Receipt note**:

```
1. Open index.html and set your payment terms once, in Settings.
2. Build the invoice; check the total reconciles before you send.
3. Let the chase sequence generate reminder one — send it on the day it says.
```

The full receipt text is in `dist/packages/invoice-automation/receipt-<tier>.txt`.

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
