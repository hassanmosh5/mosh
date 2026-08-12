# Mosh Digital Studios

The studio's own site: thirteen service lines, a scoping estimator with its rate card
open on the page, a payback calculator that runs on your figures rather than ours, and a
brief builder that turns an enquiry into a Markdown document you keep.

Open `index.html` in any modern browser — no install, no build step, no accounts, no
internet connection, and no data ever leaves the device.

## Why this site exists

Every other app in this repository is a tool for doing one job. This one is the shop
front they sit behind: it explains what the studio builds, prices it, and takes the
enquiry — and it does all three without asking you to trust a single unverifiable claim.

Agency sites have three habits that make them useless as evidence. This one refuses all
three, and the refusals are the design:

| The usual thing | What this does instead |
|---|---|
| Testimonials and client logos | Links to thirteen working tools you can open, run offline, and read the source of |
| "Contact us for pricing" | A rate card on the page, editable, with every multiplier shown next to the number it changes |
| A contact form that vanishes into a CRM | A brief builder that produces Markdown you keep — nothing is posted anywhere |

## What's in it

| Section | What it does |
|---|---|
| **Services** | Thirteen service lines in three groups, filterable, each linking to the working tool that ships with it |
| **See it working** | All nineteen tools in the repository as a portfolio grid — the service-line tools plus the studio's own tooling |
| **Process** | Five steps, each stating what the studio does *and* what the client has to do, in hours |
| **Pricing** | A scoping estimator: pick lines, set size, speed, integration difficulty and care term; every step of the arithmetic is printed |
| **Payback** | Your hours, your rate, your lost enquiries — and a verdict that is allowed to be "don't do it" |
| **Start a brief** | A form that regenerates a Markdown project brief as you type; copy, download, or open in your mail client |
| **FAQ** | Seven questions answered without marketing language, including what happens to your data |
| **Contact** | Studio details, shipped as obvious placeholders so nothing real is published by accident |

## The estimator shows its working

The point of the pricing section is not the number at the bottom. It is that every step
between the rate card and that number is visible:

```
  WhatsApp AI Sales Assistant          £1,800
  AI Appointment Booking               £1,500
  SEO & Content Systems                £1,400
  Build subtotal                       £4,700
  Multi-site or 11–50 people            × 1.35
  Urgent — start immediately            × 1.50
  After multipliers                    £9,518
  Three or four lines — 7% off          − £666
  BUILD                                £8,852
```

Four multipliers are applied and each one is labelled with its own effect: business size,
how soon it starts, how awkward the existing systems are, and the care-plan term. Bundle
discounts appear as a credit line, never as a silently lower price. Elapsed time is the
longest line plus a third of each additional one — parallel work, but not free.

**Every figure on the rate card is a placeholder.** They were chosen to make the
arithmetic legible, not because they represent what this work is worth in any particular
market. The rate card is editable in a `<details>` block on the page, and there is a
warning above it saying exactly this. Replace all of them before quoting anybody.

## The payback panel is allowed to say no

It has no defaults to fall back on and no benchmarks of its own. It asks for hours spent,
what an hour costs, what proportion would realistically go away, enquiries lost, customer
value, and close rate — then does arithmetic and nothing else.

If the care plan costs more than the benefit it says *"On these figures, don't do it"* and
explains that the build never pays back. If payback runs past two years it says the
business will have changed before the system pays for itself and suggests a smaller first
scope. It also halves every assumption and prints that answer too, because the halved
version is usually the honest one.

## Nothing is fabricated, by construction

There are no testimonials, no client names, no case-study figures and no awards on this
page, because a reader has no way to verify any of them. The footer says so explicitly.

The studio contact details ship as deliberate placeholders — `hello@example.com` and a
`+00` phone number — and the page **renders a warning next to them** while they are still
placeholders. Fill them in either in the Contact section (saved to that browser) or in the
`STUDIO_DEFAULTS` block at the top of the script, before publishing.

## Privacy

The page makes no network requests at all: no fonts, no CDN, no analytics, no form
endpoint. The hero counter reading `0` network requests is a statement about the file you
are reading.

Your estimator selections, rate-card edits, payback figures, brief and studio details are
saved to that browser's `localStorage` under `mds.site.v1` so you can come back to them.
The Clear button on the brief wipes them. The only thing that ever leaves the page is what
you send yourself with "Open in email" or "Download .md".

## Editing it

Everything is driven by data structures at the top of the script:

- `STUDIO_DEFAULTS` — name, tagline, contact details
- `GROUPS` — the three service groupings
- `SERVICES` — the thirteen service lines: copy, bullets, deliverable, weeks, prices, and
  the folder of the tool that ships with each one
- `EXTRA_TOOLS` — repository tools shown in the portfolio that aren't service lines
- `SCALES`, `SPEEDS`, `STACKS`, `CARE_TERMS`, `BUNDLES` — the multipliers, each carrying
  the sentence the page prints to explain itself
- `CURRENCIES` — display only; no conversion is applied, and the page says so

Adding a service line means adding one object to `SERVICES`. The service cards, the
portfolio grid, the estimator, the rate table, the brief checkboxes and the brief document
all render from it.

## Linked tools

Each service line links to `../<folder>/index.html`. All nineteen exist in this
repository:

`whatsapp-sales` · `appointment-booking` · `website-crm` · `local-business-templates` ·
`seo-content` · `meta-ads` · `social-automation` · `email-marketing` · `ecommerce-setup` ·
`order-automation` · `invoice-automation` · `business-dashboards` · `agency-sops` ·
`automation-kits` · `client-contracts` · `board-of-directors` · `commercial-kits` ·
`prompt-packs` · `youtube-toolkit`
