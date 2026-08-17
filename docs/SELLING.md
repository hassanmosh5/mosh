# Selling the products

Everything needed to put the 38 standalone tools in this repository on sale
across **Gumroad, Selar, Shopify, Paystack Storefront and WhatsApp Business**,
and to deliver the download once a payment is confirmed.

- [What exists](#what-exists)
- [The five-minute version](#the-five-minute-version)
- [The catalogue](#the-catalogue)
- [Building the packages](#building-the-packages)
- [Store imagery](#store-imagery)
- [Listings](#listings)
- [Delivery after payment](#delivery-after-payment)
  - [Paystack](#paystack--verified-and-delivered-here)
  - [Shopify](#shopify--verified-and-delivered-here)
  - [WhatsApp Business](#whatsapp-business--confirmed-by-you-delivered-here)
  - [Gumroad](#gumroad--delivered-by-gumroad-mirrored-here)
  - [Selar](#selar--delivered-by-selar-mirrored-here)
- [Refunds and revocation](#refunds-and-revocation)
- [Deployment](#deployment)
- [Before you publish](#before-you-publish)
- [Known limits](#known-limits)

---

## What exists

| Piece | Where | What it does |
|---|---|---|
| Catalogue | `packaging/catalog.json`, `packaging/products/*.json` | Prices, licences, and the commercial copy for all 38 products. The single source of truth. |
| Package builder | `scripts/packaging/build.mjs` | Stages and zips a customer-ready folder per product × licence, with checksums |
| Mockup generator | `scripts/packaging/mockups.mjs` | Drives headless Chromium over each product and composes real store imagery |
| Listing generator | `scripts/packaging/listings.mjs` | Paste-ready copy for all five platforms, with every character limit enforced |
| Verifier | `scripts/packaging/verify.mjs` | Refuses to call the catalogue sellable while anything is missing |
| Fulfilment | `src/lib/fulfilment/`, `src/app/api/webhooks/*` | Verifies payment webhooks and issues expiring download links |
| Storefront | `/products`, `/products/[slug]`, `/d/[token]` | Public product pages and the post-payment download page |

The commercial data is committed. The build output — ZIPs and PNGs — is not; it
is rebuilt with one command, because 20 MB of binaries in git helps nobody.

## The five-minute version

```bash
npm ci
npm run pkg:all          # build packages → mockups → listings → verify
```

`pkg:verify` will fail, listing every `REPLACE-ME` still in
`packaging/catalog.json`. Fill in your store handles, your domain and your
WhatsApp number, then run it again. Once it passes:

1. Open `packaging/listings/README.md` — every product, priced, with a link to
   each platform's listing.
2. For each product you want to sell, open `packaging/listings/<slug>/<platform>.md`
   and paste the blocks into the platform.
3. Upload the ZIPs from `dist/packages/<slug>/` and the images from
   `dist/mockups/<slug>/`.
4. Set up delivery for whichever platforms need it (below).

## The catalogue

`packaging/catalog.json` holds the money and the policy: tiers, exchange rates,
refund window, download window, per-platform character limits, and the bundles.
`packaging/products/*.json` holds one entry per product — what it solves, who it
is for, what is inside, how to use it, and what it deliberately cannot do.

Everything else is generated from those two. Change a price in one place and the
Gumroad versions, the Selar cedi price, the Shopify variants, the Paystack
storefront and the WhatsApp script all change together on the next
`npm run pkg:listings`.

**Three licences**, applied to every product:

| Tier | Multiplier | Seats | Client work | Extra files in the ZIP |
|---|---|---|---|---|
| Solo | ×1 | 1 | No | — |
| Studio *(default)* | ×2.5 | 3 | Yes | `client/CLIENT-BRIEF.md`, `client/DELIVERY-CHECKLIST.md` |
| Agency | ×5 | 10 | Yes, white-label | the above plus `white-label/WHITE-LABEL-NOTES.md` |

**On the prices themselves.** Nobody has paid for these yet, so every number in
the catalogue is a guess with a structure around it rather than a figure with
evidence behind it. Launch, watch the first twenty sales, and move them. The
exchange rates are typed in by hand and go stale; `pkg:verify` warns once they
are over sixty days old.

## Building the packages

```bash
npm run pkg:build                    # every product × every tier, plus bundles
npm run pkg:build launch-kit ebook   # just these two
```

Each ZIP contains the product plus five documents written for someone who has
just paid:

```
launch-kit-studio/
├── index.html            the product
├── START-HERE.md         what to do in the next five minutes
├── USAGE.md              the problem, the instructions, the honest limits
├── README.md             the technical detail that already shipped with it
├── LICENCE.txt           this tier's terms
├── WHATS-INCLUDED.txt    every file, its size, its SHA-256
└── client/               brief + delivery checklist (Studio and Agency only)
```

Builds are reproducible: file times are fixed, so rebuilding an unchanged
product produces a byte-identical archive and the same checksum.

`dist/packages/manifest.json` records every package with its size and checksum.
**The download endpoint reads that manifest**, so a product that has not been
built cannot be sold by accident — the webhook records the sale and logs
`PAID BUT UNDELIVERABLE` rather than quietly failing.

## Store imagery

```bash
npm run pkg:mockups
```

Drives headless Chromium over each product, clicks through to the tabs named in
the catalogue's `shots`, and composes:

| File | Size | Use |
|---|---|---|
| `cover.png` | 1280×720 | Gumroad cover, Shopify secondary, social |
| `square.png` | 1200×1200 | Selar main, Shopify main, WhatsApp catalogue |
| `story.png` | 1080×1350 | Instagram/WhatsApp status |
| `gallery-N.png` | 1600×1000 | Additional listing images, one per tab |
| `screens/` | raw | Unframed captures if you want to compose your own |

These are screenshots of the product actually running. That is a commercial
decision as much as an honest one: a marketplace cover showing the thing working
outsells a stock photo of a laptop, and it cannot be accused of
misrepresenting what arrives.

It needs a Chromium binary. One is found automatically in most environments; set
`CHROME_PATH` if yours is somewhere unusual. If a tab label in the catalogue no
longer matches the product, the run reports it by name instead of failing.

## Listings

```bash
npm run pkg:listings
```

Writes `packaging/listings/<slug>/{gumroad,selar,shopify,paystack,whatsapp}.md`
— 190 files — plus four bulk-import files:

| File | What to do with it |
|---|---|
| `_imports/shopify-products.csv` | Shopify admin → Products → Import. All 38 products with their three variants. |
| `_imports/whatsapp-catalogue.csv` | Meta Commerce Manager → Catalogue → Data sources → Upload |
| `_imports/price-list.csv` | Every product × tier × currency, for your own records |
| `_imports/sku-map.json` | Read by the Shopify webhook to match a line item to a package. Do not edit by hand. |

Every field carries its character count, and the generator **throws** rather
than truncating. A listing that arrives cut off mid-sentence on a marketplace is
worse than a build that fails on your machine.

## Delivery after payment

Three of the five platforms do not deliver files. This is the part that matters,
so here is the whole picture in one table:

| Platform | Money | Who delivers the file | What the webhook here is for |
|---|---|---|---|
| Gumroad | USD | **Gumroad** | Mirroring the sale into your records |
| Selar | NGN/GHS/USD | **Selar** | Mirroring the sale into your records |
| Shopify | Store currency | **This app** (or a downloads app) | Delivery |
| Paystack | GHS/NGN/ZAR/KES | **This app** | Delivery |
| WhatsApp | Mobile money, transfer | **This app**, after you confirm | Delivery |

A download link is a random 32-byte token. Only its SHA-256 is stored, so a
database leak yields no working links. Each grant expires after 30 days or 8
downloads, whichever comes first, and can be revoked.

### Paystack — verified and delivered here

1. **Dashboard → Settings → API Keys & Webhooks**, set the webhook URL to
   `https://yourdomain.com/api/webhooks/paystack`.
2. Set `PAYSTACK_SECRET_KEY` in the app's environment. Paystack signs webhooks
   with your secret key, so the same value does both jobs.
3. On each storefront product, add metadata so the webhook knows what was sold:
   ```json
   { "product_slug": "launch-kit", "tier": "studio" }
   ```
   If your storefront cannot carry metadata, name the product **exactly** as its
   catalogue name or its slug. Matching is exact on one of those two; it will
   not guess at a near match.

What the route does, in order: verifies the `x-paystack-signature` HMAC-SHA512
over the raw body → ignores anything that is not `charge.success` → **calls
Paystack back** to confirm the transaction really succeeded → issues a grant →
emails the link. The signature proves the message came from Paystack; the
callback proves the money did.

Replays are safe. The sale is keyed on the transaction reference, and a second
webhook for the same reference issues nothing.

### Shopify — verified and delivered here

Two options, and the honest recommendation is to start with the first:

**A. A digital-downloads app.** Simplest, costs a few dollars a month, and the
buyer's download lives inside that app. Attach the ZIP per variant and you are
done — nothing in this repository is needed.

**B. This app.** Settings → Notifications → Webhooks → create one:

| Field | Value |
|---|---|
| Event | `orders/paid` |
| Format | JSON |
| URL | `https://yourdomain.com/api/webhooks/shopify` |

Copy the signing secret Shopify shows you into `SHOPIFY_WEBHOOK_SECRET`. Import
`_imports/shopify-products.csv` so every variant carries the SKU the webhook
maps through `_imports/sku-map.json`.

An order with three products produces three sales, keyed `<order id>:<sku>`, so
each is idempotent on its own. An unmapped SKU is logged as an error and the
rest of the order still ships.

### WhatsApp Business — confirmed by you, delivered here

There is no payment API. The flow is:

1. Buyer messages you; you send the pitch from
   `packaging/listings/<slug>/whatsapp.md`.
2. They pay by mobile money or transfer and send you the transaction ID.
3. **You confirm the money has arrived**, then:

```bash
export SITE_URL=https://yourdomain.com
export FULFILMENT_ADMIN_TOKEN=…            # same value as the server

npm run pkg:grant -- --product launch-kit --tier solo \
  --email buyer@example.com --reference "MoMo 8842119"
```

It prints a link, records the sale against that transaction reference, and tells
you what to paste. The listing file has the exact message.

Never send the ZIP as a WhatsApp attachment. It leaves you no record of who has
what, no way to revoke access, and no way to answer "which version did I buy?"
in six months.

For the catalogue itself, upload `_imports/whatsapp-catalogue.csv` to Meta
Commerce Manager and connect it to the WhatsApp Business account.

### Gumroad — delivered by Gumroad, mirrored here

Gumroad hosts the file and emails the link itself. Use **Versions** for the three
licences: one product, one page, one review count. Three separate products split
your reviews and your ranking three ways.

To mirror sales into your own records, set **Settings → Advanced → Ping** to:

```
https://yourdomain.com/api/webhooks/gumroad?secret=YOUR_GUMROAD_PING_SECRET
```

and set `GUMROAD_PING_SECRET` plus `GUMROAD_SELLER_ID`.

**Gumroad does not sign its pings** — its own documentation says no signing
secret is needed. So this endpoint is authenticated by a secret in the URL and a
seller-id check, which is weaker than the HMAC the others use. That is exactly
why it issues no download link by default: a forged ping can write a row for you
to notice, and nothing else. `GUMROAD_ISSUE_DOWNLOADS=true` changes that; think
about the above before setting it.

### Selar — delivered by Selar, mirrored here

Selar settles in cedis and naira, takes mobile money and bank transfer, and pays
out locally. For West African buyers it converts better than a dollar checkout.

**Confirm the webhook signature scheme with Selar before relying on this
route.** Selar's signing format is not publicly documented at the time of
writing, so the route verifies a configurable HMAC-SHA256 and **rejects
everything until `SELAR_WEBHOOK_SECRET` is set**:

```bash
SELAR_WEBHOOK_SECRET=…
SELAR_SIGNATURE_HEADER=x-selar-signature   # override if Selar's differs
SELAR_SIGNATURE_ENCODING=hex               # or base64
```

Refusing costs a buyer nothing, because Selar delivers its own downloads. Send
yourself a test sale and read the server log before trusting it.

## Refunds and revocation

Refund on the platform, then revoke the download:

```ts
import { revokeSale } from "@/lib/fulfilment/grants";
await revokeSale(saleId, "REFUNDED");
```

Every live link for that sale stops working immediately and the page explains
why. A buyer who already downloaded still has the files — that is unavoidable
with any digital product, and the licence is what covers it.

To re-issue for a buyer who lost their link, use `reissueGrant(saleId)`, or run
`pkg:grant` again with a new reference.

## Deployment

The download route streams from `PACKAGE_DIR` (default `./dist`). Build output
is not committed, so **a fresh deploy has no packages until they are built or
copied**:

- **Build in the pipeline.** Run `npm run pkg:build` as part of the deploy.
  Note that `pkg:mockups` needs Chromium and usually should not run there —
  generate the images once and serve them from storage or commit the ones you
  need.
- **Or mount them.** Build locally, copy `dist/` to the server or a volume, and
  set `PACKAGE_DIR`.

When a package is missing, the download endpoint returns 503 with "temporarily
unavailable — your link is still valid" and logs which file was expected. The
grant is not consumed by a failed lookup beyond the one claim, and support can
re-issue.

Set the environment from `.env.example` (the storefront block at the bottom).
Without `RESEND_API_KEY` and `FULFILMENT_FROM_EMAIL` nothing is emailed: the link
is written to the server log with a `NOT EMAILED` warning so you can send it by
hand. It never claims to have sent something it did not.

## Before you publish

- **Run `npm run pkg:verify`.** It fails on placeholders, missing packages,
  checksum drift, missing imagery and listings older than the catalogue.
- **Claim a process, never an outcome.** "Find the flaw in your plan before it
  costs you" describes what a tool does. "Increase your revenue 40%" is a claim
  about a result you cannot produce. No platform will stop you; a chargeback
  and a one-star review will.
- **Do not fake social proof.** No invented testimonials, no "as featured in",
  no made-up sales counts. Add real quotes when you have them, with permission.
- **The disclaimer belongs on the listing, not only inside the product.** It is
  already in the generated copy. Leave it there.
- **Turn on purchasing power parity** where the platform supports it. These
  tools are built for buyers on metered data; dollar pricing without PPP prices
  most of them out.
- **Read one full listing before pasting 190 of them.** The copy is generated
  from your catalogue, which means an error in the catalogue is an error in
  every listing at once.

## Known limits

1. **Selar's signature scheme is unverified.** See above. The route fails closed.
2. **Gumroad pings are unsigned.** Authenticated by URL secret and seller id only.
3. **No email provider is bundled.** Delivery speaks Resend's REST API when a key
   is present, and otherwise logs the link for manual sending.
4. **Exchange rates are entered by hand.** There is no live feed; `pkg:verify`
   warns after sixty days.
5. **The download limit counts claims, not completed transfers.** An interrupted
   download still counts, which is why the limit is 8 rather than 2.
6. **Character limits are conservative.** Some platforms do not publish theirs;
   where a limit is uncertain the catalogue marks it `conservative` and the
   generator holds copy well inside it.
7. **No storefront checkout of our own.** `/products` describes and links out;
   the money is always taken by one of the five platforms.
