# CLEAR AI Digital Product Venture Studio — Paystack Storefront listing

> Generated from `packaging/products/01-decide.json` by `npm run pkg:listings`.
> Edit the catalogue, not this file — it is overwritten on every run.

Paste each block into the matching field. Character counts are shown so nothing
arrives truncated.

Images for this product: `dist/mockups/venture-studio/` — cover, square, story and gallery shots.
Package files: `dist/packages/venture-studio/` — one ZIP per licence tier.
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
| Product | CLEAR AI Digital Product Venture Studio |
| Price (GHS) | GHS 2,480 |
| Price (NGN) | NGN 307,000 |
| Quantity | Unlimited |
| Success message | See below |

**Product name** — 39/100 characters

```
CLEAR AI Digital Product Venture Studio
```

**Description** — 465/500 characters

```
Crosses what you already know with 33 product types into a ranked catalogue — then locks nine of thirteen tabs until you have checked six real listings by hand.

• Staring at a blank page trying to think of 'a good digital product idea'
• Validation theatre — asking friends, reading a trend article, calling it research
• Building one product at a time when the economics only work as a catalogue

Instant download after payment. 14-day refund, no questions asked.
```


**Product image:** `dist/mockups/venture-studio/square.png`

## Pricing across tiers

Paystack storefront products carry one price. Create three products — one per
licence — or sell the Studio licence here and handle upgrades by email.

| Licence | GHS | NGN |
|---|---|---|
| Solo licence | GHS 990 | NGN 122,500 |
| Studio licence | GHS 2,480 | NGN 307,000 |
| Agency licence | GHS 4,940 | NGN 612,500 |

## Metadata — this is what makes delivery work

On the payment page or product, add custom fields so the webhook knows what was
bought:

```json
{
  "product_slug": "venture-studio",
  "tier": "studio"
}
```

If you cannot set metadata on a storefront product, name the Paystack product
**exactly** `CLEAR AI Digital Product Venture Studio` or exactly `venture-studio`. The webhook matches on
either, exactly — it will not guess at a near match, because the products in
this catalogue differ by a word in places and sending the wrong one to a paying
customer is worse than a webhook that fails and tells you.

## Webhook

Dashboard → Settings → API Keys & Webhooks → Webhook URL:

```
https://paystack.shop/mosh-digital-studios/api/webhooks/paystack
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
