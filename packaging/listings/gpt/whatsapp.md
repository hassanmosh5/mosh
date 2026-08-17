# Digital Product Studio — custom GPT — WhatsApp Business listing

> Generated from `packaging/products/01-decide.json` by `npm run pkg:listings`.
> Edit the catalogue, not this file — it is overwritten on every run.

Paste each block into the matching field. Character counts are shown so nothing
arrives truncated.

Images for this product: `dist/mockups/gpt/` — cover, square, story and gallery shots.
Package files: `dist/packages/gpt/` — one ZIP per licence tier.
Support address on all listings: hassanmosh5@gmail.com

---

## How selling works here

There is no payment API and no automatic delivery. Money arrives by mobile money
or bank transfer, **you** confirm it, and then you issue the same signed download
link the automated platforms use:

```bash
npm run pkg:grant -- --product gpt --tier studio \
  --email buyer@example.com --platform whatsapp --reference "MoMo TXN ID"
```

That prints a link valid for 30 days and
8 downloads, and records the sale against the
transaction reference so you can reconcile it later. Never send the ZIP as a
WhatsApp attachment: it strips your record of who has what, and it gives you no
way to revoke access.

## Catalogue item

**Item name** — 35/60 characters

```
Digital Product Studio — custom GPT
```

**Description** — 435/800 characters

```
Paste-ready instructions, configuration and knowledge file for a ChatGPT custom GPT that takes you from 'I don't know what to sell' to a listed product.

Solves:
• Generic AI business advice with no validation step in it
• Re-pasting your context at the start of every conversation
• An assistant that cannot say 'do not build this'

Works offline. No account. 14-day refund, no questions asked. Reply to your receipt and say the word.
```


| Field | Value |
|---|---|
| Price | GHS 300 (Solo) |
| Image | `dist/mockups/gpt/square.png` |
| Link | https://REPLACE-ME.example.com/products/gpt |

WhatsApp shows roughly the first 200 characters before a "more" link, so the
first sentence is doing nearly all of the work.

## Messages to send

**1 — When someone asks what it is**

```
Digital Product Studio — custom GPT

A GPT that argues with your product idea.

Ask a general chat model about digital products and you get the same eight bullet points everyone else gets, with a confident tone and no method underneath. It will never tell you the idea is bad, because nothing in its instructions permits that.

What you get:
• instructions.txt — the system instructions, written to sit just under the 8,000-character field…
• configuration.md — every other field: name, description, conversation starters, capabilities,…
• knowledge/digital-product-playbook.md
• A ten-minute setup guide with the exact clicks

GHS 300 — one payment, yours forever.
Works offline, no subscription, 14-day refund.

Want it? Send "YES" and I'll send payment details.
```

**2 — Payment details**

```
Send GHS 300 to:

MoMo: +233 REPLACE-ME (Hassan Mohammed)
Reference: GPT

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
1. Open README.md and follow the ten-minute setup.
2. Create a GPT at chatgpt.com/gpts/editor and switch straight to the Configure tab.
3. Paste instructions.txt into Instructions and the fields from configuration.md into their…

Any problem at all, message me here. One reply within two working days, from the person who built it.
```

**4 — Follow-up, three days later**

```
Did you get a chance to open it?

The part people skip is Create a GPT at chatgpt.com/gpts/editor and switch straight to the Configure tab.

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
For client work you want the Studio licence — GHS 750 — which
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
