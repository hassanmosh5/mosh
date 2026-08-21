# AI Website + CRM Automation — Paystack Storefront listing

> Generated from `packaging/products/05-agents.json` by `npm run pkg:listings`.
> Edit the catalogue, not this file — it is overwritten on every run.

Paste each block into the matching field. Character counts are shown so nothing
arrives truncated.

Images for this product: `dist/mockups/website-crm/` — cover, square, story and gallery shots.
Package files: `dist/packages/website-crm/` — one ZIP per licence tier.
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
| Product | AI Website + CRM Automation |
| Price (GHS) | GHS 1,850 |
| Price (NGN) | NGN 229,500 |
| Quantity | Unlimited |
| Success message | See below |

**Product name** — 27/100 characters

```
AI Website + CRM Automation
```

**Description** — 481/500 characters

```
The site page by page, the CRM pipeline stage by stage, the tool stack with its running cost — and, per automation, whether your volume pays for building it.

• Forty-automation build lists sold to businesses with thirty enquiries a month
• Tool stacks whose monthly cost nobody totalled
• Pipeline stages copied from a template and never matched to how deals actually move

Instant download after payment. 14-day refund, no questions asked. Reply to your receipt and say the word.
```


**Product image:** `dist/mockups/website-crm/square.png`

## Pricing across tiers

Paystack storefront products carry one price. Create three products — one per
licence — or sell the Studio licence here and handle upgrades by email.

| Licence | GHS | NGN |
|---|---|---|
| Solo licence | GHS 740 | NGN 91,500 |
| Studio licence | GHS 1,850 | NGN 229,500 |
| Agency licence | GHS 3,690 | NGN 457,500 |

## Metadata — this is what makes delivery work

On the payment page or product, add custom fields so the webhook knows what was
bought:

```json
{
  "product_slug": "website-crm",
  "tier": "studio"
}
```

If you cannot set metadata on a storefront product, name the Paystack product
**exactly** `AI Website + CRM Automation` or exactly `website-crm`. The webhook matches on
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
