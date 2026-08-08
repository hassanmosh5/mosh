# Local Business Website Studio

A single-file, offline studio that builds a complete one-page website for a local
business — plumber, electrician, garage, cleaner, landscaper, salon, restaurant,
bakery, dental practice, gym, accountant or estate agent — and exports it as one
self-contained HTML file you can hand over or host anywhere.

Open `index.html` in any modern browser. No install, no build step, no accounts,
no internet connection, and no data ever leaves the device.

## Why this app

Chapter 9 of *The AI Income Blueprint* (`books/THE_AI_INCOME_BLUEPRINT.pdf`) sells
services to local businesses off the back of a free audit rather than a pitch —
you show the owner something concrete before you ask for money. That works far
better for websites than for automations, because the concrete thing can be the
finished site.

The bottleneck is build time. This studio removes it: pick the trade, paste in the
client's real name, phone number, services and areas, and you have a demo in about
ten minutes. Ten demos is an afternoon.

## What's in it

| Tab | What it does |
|---|---|
| 🏗 **Builder** | Every field of the site as a form, with a live preview at three widths. Repeaters for services, jobs, testimonials, packages and FAQ; per-section on/off switches |
| 🎨 **Templates** | 12 trades, each with demo copy written for that trade, plus the layout and palette that suits it |
| 📦 **Client Pack** | Export `index.html` alone, or the whole handover pack as a `.zip`. Hosting comparison, weight check, and a 15-point handover checklist |
| 💰 **Sell It** | Three price tiers with care plans, six outreach scripts, a one-page proposal generator, and the five objections with what actually answers them |
| 📖 **Playbook** | What every exported site does, how to rank in one town, the copy rules baked into the templates, and what this deliberately does not do |

## The numbers

**12 trades × 4 layouts × 5 type pairings × 12 palette presets = 2,880 starting
points** before you change a word — and the accent colour is a free-form picker,
so that is a floor rather than a ceiling. Every count shown in the app is computed
from the real arrays at runtime rather than written into the copy.

Each trade template carries 6 services with real from-prices, 4 trust badges,
3 recent jobs, 3 testimonials, 3 packages, 4–5 FAQ entries, an about section with
a numbers strip, 4 lines of opening hours and 4–8 service areas.

## The four layouts

| Layout | Built for | What changes |
|---|---|---|
| **Bold Trades** | Plumbers, electricians, garages, gyms — urgent jobs | Dark header, oversized phone number, split hero with a call-back card, high-contrast blocks |
| **Warm Hospitality** | Restaurants, cafés, bakeries, salons | Serif headings, warm paper background, menu-style service list with prices set right |
| **Clinical Clean** | Dentists, clinics, cleaners, childcare | Rounded hero panel, soft tints, trust strip under the fold, booking-first buttons |
| **Modern Professional** | Accountants, agents, consultants | Hairline rules instead of shadows, credentials before benefits, tabular service rows |

The layout is independent of the content — a dentist can run the bold layout and a
plumber the clinical one. The pairing shown in the gallery is only the default.

## What the exported site is

One HTML file, around **44 KB**, with **zero external requests**. No fonts, no icon
packs, no analytics, no frameworks, no images — the artwork is CSS gradients and an
inline SVG sprite of the six icons the page actually uses.

That constraint is the point. There is no font flash, no CDN to go down, no cookie
banner to argue about, and nothing to keep paying for. On a phone with one bar of
signal — which is where most local-service visitors are standing — it loads in about
a second.

Every exported site also has:

- **Phone-first layout.** Single column under 700px, tap targets over 44px, a sticky
  call bar on mobile, and the number in the header at every width.
- **Search-engine basics.** Title and meta description with live length checks, Open
  Graph and Twitter cards, canonical link, and `LocalBusiness` JSON-LD carrying the
  address, phone, opening hours (parsed into real `OpeningHoursSpecification` days
  and 24-hour times), service area and price bracket. The schema type follows the
  trade — `Plumber`, `Dentist`, `HairSalon`, `Restaurant`, `AutoRepair` and so on.
- **Accessibility.** Skip link, landmarks, real labels on every field, visible focus
  rings, and an accent colour that is automatically darkened if neither white nor
  dark text would clear WCAG AA against it. The contrast ratio is shown in the
  Builder as you pick.
- **A print stylesheet**, optional dark mode following the visitor's system setting,
  and all animation disabled under `prefers-reduced-motion`.

## The enquiry form

Three options, because the right one depends on the client:

- **Opens their email app** (default) — the form composes a `mailto:` with the
  details filled in. No server, nothing stored, nothing that can break.
- **POSTs to a form service** — Formspree, Basin, Netlify Forms, Web3Forms or your
  own endpoint. Any service that accepts a plain HTML `POST`.
- **No form** — phone, email and address only. Which is honestly what a lot of
  trades want.

## The client pack

`⬇ Full client pack (.zip)` writes a real ZIP (store-only, built in about forty
lines of JavaScript — no library) containing:

- `index.html` — the website
- `README.md` — how to host it, how to edit the text, the first-week checklist,
  and what the site deliberately does not do, written for the client rather than
  for you
- `handover-checklist.md` — your ticked state from the Client Pack tab
- `robots.txt`
- `sitemap.xml` — added once you fill in the client's domain

## Notes

- **Fully offline.** No external scripts, fonts, images, analytics or network
  requests of any kind, in the studio or in what it exports. Verified with a
  browser run asserting zero non-`file://` requests.
- **Everything is saved** to `localStorage` as you type — the whole build in
  progress, the handover ticks, the theme. Storage failures (private mode,
  `file://` restrictions) degrade to in-memory rather than breaking the app.
- **Light and dark**, following your system setting, with a manual toggle.
- **Accessible.** Real form controls throughout, arrow-key tab navigation, visible
  focus rings, live-region toasts, and animation disabled under
  `prefers-reduced-motion`.
- **Tested.** All 48 template × layout combinations render with no horizontal
  overflow from 320px to 1440px, the generated JSON-LD parses, and the exported
  ZIP passes `unzip -t`.

## About the demo content

Every business, phone number and address in the templates is fictional — `555-01xx`
numbers and `example.com` addresses are reserved for exactly this — so nothing can
be mistaken for a real business and nothing ships by accident.

The testimonials in particular are written examples, not real reviews. The app says
so where you edit them and the handover checklist makes replacing them the first
item. Invented reviews are a legal problem in most markets, not just a credibility
one.

## Pricing and selling

The Sell It tab carries three tiers — roughly $450–700, $900–1,500 and
$1,800–3,000 for the build, with $40, $80 and $150 monthly care plans. Those are
ranges for a one-page local site, applying the book's price-the-outcome rule from
Chapter 14 rather than an hourly rate; they are not promises about what any
particular market will pay.

Two things in that tab matter more than the numbers:

- **The care plan is the business.** One-off builds make a month; retainers make a
  year. Hosting renewals plus "text me changes and I'll do them" is a service most
  trades will happily pay for, because the alternative is a site that still shows
  2023 prices in 2026.
- **Register the domain in the client's own account, on their card.** Holding a
  client's domain is the fastest way to turn a happy customer into a chargeback,
  and the proposal generator says so in writing.

## Deploying

It's one HTML file. Copy `index.html` anywhere — a USB stick, any static host, or
GitHub Pages. Served from this repo's root, the studio lives at
`/local-business-templates/`.

The sites it exports deploy the same way, which is the entire reason they are built
like this: Netlify Drop, Cloudflare Pages, GitHub Pages, or whatever hosting the
client is already paying for.
