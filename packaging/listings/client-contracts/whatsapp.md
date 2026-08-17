# The Proposal & Contract Kit — WhatsApp Business listing

> Generated from `packaging/products/03-agency.json` by `npm run pkg:listings`.
> Edit the catalogue, not this file — it is overwritten on every run.

Paste each block into the matching field. Character counts are shown so nothing
arrives truncated.

Images for this product: `dist/mockups/client-contracts/` — cover, square, story and gallery shots.
Package files: `dist/packages/client-contracts/` — one ZIP per licence tier.
Support address on all listings: hassanmosh5@gmail.com

---

## How selling works here

There is no payment API and no automatic delivery. Money arrives by mobile money
or bank transfer, **you** confirm it, and then you issue the same signed download
link the automated platforms use:

```bash
npm run pkg:grant -- --product client-contracts --tier studio \
  --email buyer@example.com --platform whatsapp --reference "MoMo TXN ID"
```

That prints a link valid for 30 days and
8 downloads, and records the sale against the
transaction reference so you can reconcile it later. Never send the ZIP as a
WhatsApp attachment: it strips your record of who has what, and it gives you no
way to revoke access.

## Catalogue item

**Item name** — 27/60 characters

```
The Proposal & Contract Kit
```

**Description** — 424/800 characters

```
One form produces the proposal, the services agreement, the change order and the emails that carry them, so the figures always agree.

Solves:
• Proposals and contracts that quote different prices, dates or scopes
• Scope creep with no mechanism to charge for it
• Six clauses re-typed per client and forgotten in a hurry

Works offline. No account. 14-day refund, no questions asked. Reply to your receipt and say the word.
```


| Field | Value |
|---|---|
| Price | GHS 620 (Solo) |
| Image | `dist/mockups/client-contracts/square.png` |
| Link | https://REPLACE-ME.example.com/products/client-contracts |

WhatsApp shows roughly the first 200 characters before a "more" link, so the
first sentence is doing nearly all of the work.

## Messages to send

**1 — When someone asks what it is**

```
The Proposal & Contract Kit

Proposal, contract, change order — same numbers.

The gap between a good call and a signed engagement is four documents nobody enjoys writing, so they get written badly and fast: a proposal with a price, a contract from a template site with the wrong currency, no change order at all, and an email that undersells all three.

What you get:
• One intake form: fee, dates, client, jurisdiction, scope, revisions
• A one-page proposal with three tiers and an expiry date
• A services agreement carrying the six clauses an engagement needs
• A change order that prices additional work against the original agreement

GHS 620 — one payment, yours forever.
Works offline, no subscription, 14-day refund.

Want it? Send "YES" and I'll send payment details.
```

**2 — Payment details**

```
Send GHS 620 to:

MoMo: +233 REPLACE-ME (Hassan Mohammed)
Reference: CLIENT-CONTR

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
1. Open index.html and fill the intake once.
2. Generate the proposal and send it the same day. Speed is most of the win rate here.
3. On acceptance, generate the agreement — the numbers carry over automatically.

Any problem at all, message me here. One reply within two working days, from the person who built it.
```

**4 — Follow-up, three days later**

```
Did you get a chance to open it?

The part people skip is Generate the proposal and send it the same day. Speed is most of the win rate here.

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
For client work you want the Studio licence — GHS 1,540 — which
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
