# AI Prompt Packs for Businesses & Creators — Paystack Storefront listing

> Generated from `packaging/products/02-package.json` by `npm run pkg:listings`.
> Edit the catalogue, not this file — it is overwritten on every run.

Paste each block into the matching field. Character counts are shown so nothing
arrives truncated.

Images for this product: `dist/mockups/prompt-packs/` — cover, square, story and gallery shots.
Package files: `dist/packages/prompt-packs/` — one ZIP per licence tier.
Support address on all listings: hassanmosh5@gmail.com

---

## Why Paystack for this catalogue

Mobile money, bank transfer and cards, settled in cedis or naira into a local
account. The catch is that **Paystack takes the money but does not host files** —
delivery is this repository's webhook, which is why the setup below matters more
than the copy does.

## Product setup

| Field | Value |
|---|---|
| Product | AI Prompt Packs for Businesses & Creators |
| Price (GHS) | GHS 1,230 |
| Price (NGN) | NGN 152,000 |
| Quantity | Unlimited |
| Success message | See below |

**Product name** — 41/100 characters

```
AI Prompt Packs for Businesses & Creators
```

**Description** — 469/500 characters

```
Eight complete prompt packs — 160 role-first prompts — plus the builder that turns any one of them into a product file you can list this afternoon.

• Prompt packs that are lists of vague instructions and disappoint on first use
• Having nothing finished to sell while you decide what to make
• Prompts scattered across notes with no order matching how you work

Instant download after payment. 14-day refund, no questions asked. Reply to your receipt and say the word.
```


**Product image:** `dist/mockups/prompt-packs/square.png`

## Pricing across tiers

Paystack storefront products carry one price. Create three products — one per
licence — or sell the Studio licence here and handle upgrades by email.

| Licence | GHS | NGN |
|---|---|---|
| Solo licence | GHS 490 | NGN 60,500 |
| Studio licence | GHS 1,230 | NGN 152,000 |
| Agency licence | GHS 2,440 | NGN 302,500 |

## Metadata — this is what makes delivery work

On the payment page or product, add custom fields so the webhook knows what was
bought:

```json
{
  "product_slug": "prompt-packs",
  "tier": "studio"
}
```

If you cannot set metadata on a storefront product, name the Paystack product
**exactly** `AI Prompt Packs for Businesses & Creators` or exactly `prompt-packs`. The webhook matches on
either, exactly — it will not guess at a near match, because the products in
this catalogue differ by a word in places and sending the wrong one to a paying
customer is worse than a webhook that fails and tells you.

## Webhook

Dashboard → Settings → API Keys & Webhooks → Webhook URL:

```
https://REPLACE-ME.example.com/api/webhooks/paystack
```

The route verifies the `x-paystack-signature` HMAC-SHA512 against your secret
key on the raw body, ignores anything that is not `charge.success`, and
re-verifies the transaction against Paystack's API before issuing a link.
A duplicate delivery of the same reference does not issue a second grant.

## Success message

```
Payment received. Your download link is on its way to the email address you
paid with — check spam if it is not there in two minutes.

Link valid for 30 days, 8 downloads.
Problems: hassanmosh5@gmail.com
```

---
14-day refund, no questions asked. Reply to your receipt and say the word.

Support: hassanmosh5@gmail.com — One reply within two working days, from the person who built it.
