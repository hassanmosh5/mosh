# Invoice & Payment Automation — WhatsApp Business listing

> Generated from `packaging/products/03-agency.json` by `npm run pkg:listings`.
> Edit the catalogue, not this file — it is overwritten on every run.

Paste each block into the matching field. Character counts are shown so nothing
arrives truncated.

Images for this product: `dist/mockups/invoice-automation/` — cover, square, story and gallery shots.
Package files: `dist/packages/invoice-automation/` — one ZIP per licence tier.
Support address on all listings: hassanmosh5@gmail.com

---

## How selling works here

There is no payment API and no automatic delivery. Money arrives by mobile money
or bank transfer, **you** confirm it, and then you issue the same signed download
link the automated platforms use:

```bash
npm run pkg:grant -- --product invoice-automation --tier studio \
  --email buyer@example.com --platform whatsapp --reference "MoMo TXN ID"
```

That prints a link valid for 30 days and
8 downloads, and records the sale against the
transaction reference so you can reconcile it later. Never send the ZIP as a
WhatsApp attachment: it strips your record of who has what, and it gives you no
way to revoke access.

## Catalogue item

**Item name** — 28/60 characters

```
Invoice & Payment Automation
```

**Description** — 487/800 characters

```
An invoice that adds up to the cent, due dates derived from your stated terms, a chase sequence that writes its own emails, and a live picture of what you are owed.

Solves:
• Invoices that do not quite add up, or use last quarter's tax rate
• Due dates invented per invoice instead of derived from a payment term
• Reminders never sent because each one has to be written from scratch

Works offline. No account. 14-day refund, no questions asked. Reply to your receipt and say the word.
```


| Field | Value |
|---|---|
| Price | GHS 490 (Solo) |
| Image | `dist/mockups/invoice-automation/square.png` |
| Link | https://paystack.shop/mosh-digital-studios/products/invoice-automation |

WhatsApp shows roughly the first 200 characters before a "more" link, so the
first sentence is doing nearly all of the work.

## Messages to send

**1 — When someone asks what it is**

```
Invoice & Payment Automation

Get it out right, then get it paid.

Almost none of the gap between finishing work and being paid is a collections problem. It is a decisions problem: what to number the invoice, when it falls due, when to chase, what to say, what to charge for being late.

What you get:
• An invoice builder that reconciles to the cent, with tax and discounts handled explicitly
• Payment terms set once — deposits, Net 7/14/30 — with every date derived from them
• A chase sequence that writes each reminder, escalating in tone on a schedule you set
• Late fees calculated rather than threatened

GHS 490 — one payment, yours forever.
Works offline, no subscription, 14-day refund.

Want it? Send "YES" and I'll send payment details.
```

**2 — Payment details**

```
Send GHS 490 to:

MoMo: +233504875992 (Hassan Mohammed)
Reference: INVOICE-AUTO

Send me the transaction ID when it's done and your email address.
Your download link comes back within the hour.
```

**3 — After you have confirmed the payment**

```
Payment confirmed — thank you.

Your download: [LINK]

Valid 30 days, 8 downloads.
Unzip it and open START-HERE.md first.

First three things to do:
1. Open index.html and set your payment terms once, in Settings.
2. Build the invoice; check the total reconciles before you send.
3. Let the chase sequence generate reminder one — send it on the day it says.

Any problem at all, message me here. One reply within two working days, from the person who built it.
```

**4 — Follow-up, three days later**

```
Did you get a chance to open it?

The part people skip is Build the invoice; check the total reconciles before you send.

If something didn't work, tell me and I'll fix it or refund you — either is fine.
```

## Objection replies

**"Is it a subscription?"**
```
No. One payment, the files are yours permanently. Free updates to the version you bought for 12 months. You keep the files forever either way.
```

**"Can I use it for client work?"**
```
The Solo licence is for your own business only.
For client work you want the Studio licence — GHS 1,230 — which
also includes the client brief and delivery checklist.
```

**"Does it need internet?"**
```
No. Download it once and it runs offline forever. Nothing you type is uploaded
anywhere — it stays on your own device.
```

**"What if it's not what I expected?"**
```
14-day refund, no questions asked. Reply to your receipt and say the word. No argument, no form to fill in.
```

## Rules worth keeping

- Only message people who messaged you first, or who agreed to hear from you.
- Broadcast lists rather than groups. A group of strangers discussing your product is not a sales channel.
- One follow-up, then stop. Two is a nuisance and gets you blocked, which costs the number.

---
14-day refund, no questions asked. Reply to your receipt and say the word.

Support: hassanmosh5@gmail.com — One reply within two working days, from the person who built it.
