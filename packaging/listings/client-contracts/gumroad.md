# The Proposal & Contract Kit — Gumroad listing

> Generated from `packaging/products/03-agency.json` by `npm run pkg:listings`.
> Edit the catalogue, not this file — it is overwritten on every run.

Paste each block into the matching field. Character counts are shown so nothing
arrives truncated.

Images for this product: `dist/mockups/client-contracts/` — cover, square, story and gallery shots.
Package files: `dist/packages/client-contracts/` — one ZIP per licence tier.
Support address on all listings: hassanmosh5@gmail.com

---

## Product setup

| Field | Value |
|---|---|
| Type | Digital product |
| URL / permalink | `client-contracts` → https://REPLACE-ME.gumroad.com/l/client-contracts |
| Category | Agency & client work |
| Call to action | I want this! |

**Name** — 27/60 characters

```
The Proposal & Contract Kit
```

**Summary (shows under the title)** — 133/255 characters

```
One form produces the proposal, the services agreement, the change order and the emails that carry them, so the figures always agree.
```

**Tags** — 10/12

```
freelance contract, client proposal, services agreement, change order, scope creep, consulting contract, proposal template, agency documents, invoice terms, offline tool
```

## Versions — one product, three prices

Use Gumroad **Versions**, not three separate products. Three products split your
reviews and your ranking three ways.

| Version | Price | Attach this file |
|---|---|---|
| Solo licence | $49 | `client-contracts-solo.zip` |
| Studio licence ← set as default | $123 | `client-contracts-studio.zip` |
| Agency licence | $245 | `client-contracts-agency.zip` |

Gumroad attaches different files to different versions. Use that rather than
maintaining three products by hand.

**Purchasing power parity:** turn it on. This is built for buyers on metered
data; pricing in US dollars without PPP prices most of them out of it.

## Description — paste into the description field

**Description** — 3055/12000 characters

```
One form produces the proposal, the services agreement, the change order and the emails that carry them, so the figures always agree.

THE PROBLEM

The gap between a good call and a signed engagement is four documents nobody enjoys writing, so they get written badly and fast: a proposal with a price, a contract from a template site with the wrong currency, no change order at all, and an email that undersells all three. Then the numbers in the contract do not match the numbers in the proposal, and the argument in month two is about which one counted.

It deals specifically with:

• Proposals and contracts that quote different prices, dates or scopes
• Scope creep with no mechanism to charge for it
• Six clauses re-typed per client and forgotten in a hurry
• The 24-hour follow-up that never goes out because writing it takes an hour

WHO IT IS FOR

• Freelancers sending proposals in a text document
• Anyone who has done unpaid extra work because scope was never written
• Agencies re-typing the same six clauses per engagement

WHAT YOU GET

• One intake form: fee, dates, client, jurisdiction, scope, revisions
• A one-page proposal with three tiers and an expiry date
• A services agreement carrying the six clauses an engagement needs — scope, revisions, payment, IP, confidentiality, termination
• A change order that prices additional work against the original agreement
• The covering emails for all three, written from the same data
• Print-ready output; nothing leaves your device

Delivered as a ZIP: the app itself, a START-HERE page, full usage instructions,
your licence, and a checksum list of every file so you can verify what arrived.

Free updates to the version you bought for 12 months. You keep the files forever either way.

HOW YOU USE IT

1. Open index.html and fill the intake once.
2. Generate the proposal and send it the same day. Speed is most of the win rate here.
3. On acceptance, generate the agreement — the numbers carry over automatically.
4. Read every clause and delete what does not apply to your engagement.
5. When scope changes, raise a change order rather than an opinion.

WHAT SHOULD BE TRUE WHEN YOU FINISH

• A proposal out within 24 hours of the call, priced in tiers
• A contract whose figures cannot disagree with the proposal
• A written route to charging for extra work instead of absorbing it

WHAT IT IS NOT

• Anything over a few thousand, unusual risk, or personal data at scale — have a lawyer read it
• Employment contracts, or jurisdictions you have not checked

Not legal advice. This is a drafting aid built from general practice; contract law varies by country, by state and by the facts of your engagement.

These are decision and drafting tools, not professional advice. They compute from figures you supply and cannot verify any of them. Nothing here is financial, legal, tax, medical or investment advice.

14-day refund, no questions asked. Reply to your receipt and say the word.

Support: hassanmosh5@gmail.com — One reply within two working days, from the person who built it.
```


## Cover and thumbnail

Gumroad wants a 1280×720 cover and a 600×600 thumbnail.

- Cover: `dist/mockups/client-contracts/cover.png` (already 1280×720)
- Thumbnail: `dist/mockups/client-contracts/square.png` — crop to 600×600
- Extra gallery images: `dist/mockups/client-contracts/gallery-*.png`

These are screenshots of the product running, not stock photography. That is
deliberate — the cover shows what arrives.

## Receipt / thank-you note

Paste into **Content → Receipt note**:

```
1. Open index.html and fill the intake once.
2. Generate the proposal and send it the same day. Speed is most of the win rate here.
3. On acceptance, generate the agreement — the numbers carry over automatically.
```

The full receipt text is in `dist/packages/client-contracts/receipt-<tier>.txt`.

## Delivery

Gumroad hosts the file and emails the link itself — nothing else to configure.

If you also want the sale recorded in your own database, point
**Settings → Advanced → Ping** at:

```
https://REPLACE-ME.example.com/api/webhooks/gumroad?secret=YOUR_GUMROAD_PING_SECRET
```

Gumroad does not sign its pings, so the URL secret and the seller-ID check in
that route are what authenticate it. See `docs/SELLING.md`.

---
14-day refund, no questions asked. Reply to your receipt and say the word.

Support: hassanmosh5@gmail.com — One reply within two working days, from the person who built it.
