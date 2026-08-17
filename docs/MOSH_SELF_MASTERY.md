# MOSH Self-Mastery & Wealth Alignment System

A personal operating system for aligning the **mental**, **spiritual** and
**physical** planes while building a scalable coaching business. Built for
Hassan Mohammed — Life Coach and Mindset Architect — on one idea:

> **Structure Creates Freedom.**

It lives at `/mosh` inside this repository's Next.js application, alongside the
Chief of Staff and the academy, sharing their PostgreSQL database and
authentication layer.

---

## Contents

1. [What it is](#what-it-is)
2. [The eleven modules](#the-eleven-modules)
3. [Folder structure](#folder-structure)
4. [Architecture](#architecture)
5. [The scoring engine](#the-scoring-engine)
6. [Database schema](#database-schema)
7. [API endpoints](#api-endpoints)
8. [Component architecture](#component-architecture)
9. [Wireframes](#wireframes)
10. [Design system](#design-system)
11. [Progressive Web App](#progressive-web-app)
12. [The AI layer](#the-ai-layer)
13. [Deployment](#deployment)
14. [Supabase](#supabase)
15. [Testing](#testing)
16. [Verification status](#verification-status)

---

## What it is

Not a habit tracker. The system holds ten things at once — personal
development, business growth, mindset, spiritual alignment, physical
well-being, coaching, wealth-building, offer creation, customer acquisition and
long-term life planning — and it makes them one picture.

Two rules shape every design decision in it:

**Numbers are earned, not asserted.** Every score in the app is computed by a
pure function in `src/lib/mosh/scoring.ts` from records the user actually
entered. Nothing is estimated, extrapolated or generated. The AI explains
scores; it never invents them.

**A blank is not a zero.** Composite scores drop any component with no data and
redistribute its weight across the rest, so a partly-filled day is scored on
what was recorded rather than punished for what was not.

---

## The eleven modules

| Route | Module | What it does |
|---|---|---|
| `/mosh` | **Dashboard** | Four horizontal score bars (Daily Alignment, Weekly Momentum, Monthly Growth, Wealth Flow) and four meters (Mental, Spiritual, Physical, Annual), plus the 14-day trend, today's rhythm, the streak, the current Eclipse action and derived recommendations. |
| `/mosh/daily` | **Daily rhythm** | Seven habit checkboxes, energy and mood (1–10), gratitude / wins / reflection, and a 1–10 check-in on all twenty plane attributes. Scores update live as you type. |
| `/mosh/weekly` | **Weekly momentum** | Goals across the five areas — mental, spiritual, physical, business, impact — each with progress and a completion percentage. Momentum is derived. |
| `/mosh/monthly` | **Monthly review** | Five pillars (goals / achievements / lessons / score) and the six review questions. Growth counts the reflection as well as the results. |
| `/mosh/plan` | **365-day master plan** | Four quarters — Root and Routine, Visibility and Credibility, Structure and Scale, Legacy and Leverage — each with focus areas, a goal, revenue and client targets, and three monthly milestones. Seeded on first open, fully editable. |
| `/mosh/business` | **Offer ecosystem** | Tier 1 attraction, Tier 2 core program, Tier 3 premium mentorship. Per-offer, per-month metrics and the **Wealth Flow Index**. |
| `/mosh/funnel` | **Customer funnel** | Visitor → Lead → Subscriber → Customer → Student → Mentorship client → Advocate, with conversion at every step and the weakest step called out. |
| `/mosh/eclipse` | **50-Day Eclipse** | Fifty dated actions in five phases, with notes per day and a phase-by-phase timeline. |
| `/mosh/coach` | **The Billionaire Self** | Self-coaching across seven patterns: limiting beliefs, trust issues, fear of loss, perfectionism, inferiority, procrastination, low drive. |
| `/mosh/legacy` | **My 77-year-old self** | Letters from the person you are becoming, seeded with the default message. |
| `/mosh/analytics` | **Analytics** | Streaks, habit reliability, plane radars, momentum and growth trends, the wealth model, funnel conversion, and CSV / PDF exports. |
| `/mosh/settings` | **Settings** | Name, title, philosophy, mission, currency, timezone, plan year, and PWA install. |

---

## Folder structure

```
src/
├─ app/
│  ├─ mosh/                        # the application shell and its pages
│  │  ├─ layout.tsx                # auth gate, sidebar, header, PWA, toasts
│  │  ├─ page.tsx                  # dashboard
│  │  ├─ daily/                    # page.tsx + daily-tracker.tsx (client form)
│  │  ├─ weekly/                   # page.tsx + weekly-tracker.tsx
│  │  ├─ monthly/                  # page.tsx + monthly-review.tsx
│  │  ├─ plan/                     # page.tsx + plan-board.tsx
│  │  ├─ business/                 # page.tsx + offer-ecosystem.tsx
│  │  ├─ funnel/                   # page.tsx + funnel-board.tsx
│  │  ├─ eclipse/                  # page.tsx + eclipse-timeline.tsx
│  │  ├─ coach/                    # page.tsx + coach-console.tsx
│  │  ├─ legacy/                   # page.tsx + legacy-desk.tsx
│  │  ├─ analytics/                # page.tsx + export-bar.tsx
│  │  └─ settings/                 # page.tsx + settings-form.tsx
│  ├─ api/mosh/                    # route handlers, one folder per resource
│  ├─ manifest.ts                  # PWA manifest
│  └─ offline/page.tsx             # offline fallback, cached by the worker
├─ components/mosh/
│  ├─ ui.tsx                       # Card, ScoreBar, Meter, Stat, Badge, controls
│  ├─ charts.tsx                   # Recharts primitives
│  ├─ nav.tsx                      # sidebar + portalled mobile drawer
│  ├─ toast.tsx                    # transient confirmations
│  └─ pwa.tsx                      # service worker, offline banner, install
└─ lib/mosh/
   ├─ constants.ts                 # planes, habits, quarters, eclipse plan, tiers
   ├─ dates.ts                     # UTC period anchors (day / week / month)
   ├─ scoring.ts                   # every score in the product
   ├─ coach.ts                     # The Billionaire Self playbooks + prompt
   ├─ schemas.ts                   # Zod request validation
   ├─ context.ts                   # session → MoshContext
   ├─ api.ts                       # route wrapper: auth → rate limit → run
   ├─ client.ts                    # browser API client
   ├─ store.ts                     # Zustand UI state
   ├─ pdf.ts                       # dependency-free PDF writer
   └─ services/                    # one module per domain area
prisma/
├─ schema.prisma                   # Mosh* models live at the end
├─ migrations/20260814074739_mosh_self_mastery/
└─ mosh-seed.ts                    # optional demo data
supabase/migrations/               # Supabase-native schema with RLS
public/
├─ sw.js                           # service worker
└─ icons/                          # generated PWA icons
scripts/generate-mosh-icons.mjs    # regenerates those icons
tests/
├─ unit/mosh-scoring.test.ts
└─ integration/mosh-services.test.ts
```

---

## Architecture

```
Browser
  │  React Server Components render the page with data already in it
  │  Client components (forms, charts) hydrate on top
  ▼
src/app/mosh/**            pages: server components fetch through services
src/components/mosh/**     presentation only, no data access
  │  fetch()  →  /api/mosh/*
  ▼
src/app/api/mosh/**        route handlers — thin: parse, call a service, return
  │  route() wrapper: authenticate → rate limit → run
  ▼
src/lib/mosh/services/**   all business logic; every query scoped by ctx.userId
  │
  ├─ src/lib/mosh/scoring.ts   pure functions — the only source of any number
  └─ src/lib/prisma.ts         PostgreSQL via Prisma
```

**Server components read through the services directly.** A page does not fetch
its own API; it calls `getDashboard(ctx)` on the server. The API exists for the
client forms and for anything outside the app. Both paths run the same service
code, so the page and the endpoint can never disagree.

**Authorisation is one rule.** MOSH is a personal system: there is no workspace
to join and no role to grant. `requireMoshContext()` resolves the session into a
`MoshContext` and every service query filters on `ctx.userId`. Ownership is
re-checked on the way in for any record addressed by id — updating a milestone
or reporting a metric on someone else's offer returns *not found*, never a
partial write. The integration suite asserts this for the plan, business and
dashboard paths.

---

## The scoring engine

All of this lives in `src/lib/mosh/scoring.ts` and is unit-tested.

### Composite scores

Each score is a set of weighted components. Components with no data are dropped
and their weight is redistributed:

```
score = Σ (componentᵢ.value × componentᵢ.weight) / Σ (present weights)
```

### Daily Alignment Score

| Component | Weight | Source |
|---|---|---|
| Daily rhythm | 55% | habits completed ÷ 7 |
| Plane check-in | 25% | mean of the day's 1–10 ratings × 10 |
| Energy and mood | 20% | mean of the two × 10 |

### Weekly Momentum Score

| Component | Weight | Source |
|---|---|---|
| Weekly goals | 60% | completion averaged *per area first*, so one area with six goals cannot outvote an area with one |
| Daily alignment | 40% | mean alignment of the days recorded that week |

### Monthly Growth Score

| Component | Weight | Source |
|---|---|---|
| Pillar progress | 50% | mean of the five pillar scores |
| Weekly momentum | 30% | mean momentum of the weeks inside the month |
| Reflection | 20% | review questions answered ÷ 6 |

### Annual Alignment

60% mean quarter progress, 40% milestones completed. A quarter's shown progress
is itself half self-reported and half milestone-proved, so the number cannot be
talked upward.

### Wealth Flow Index

```
Wealth Flow Index = (Attraction revenue × 1)
                  + (Core revenue      × 2)
                  + (Premium revenue   × 3)
```

The multipliers are deliberate: a cedi earned through premium mentorship
represents three times the depth — and durability — of a cedi earned at the top
of the funnel. The dashboard bar shows the index against a target taken from the
current quarter's revenue target in the master plan, falling back to 10,000.

### Plane meters

Per plane, per day: 60% the mean of that plane's attribute ratings, 40% the
habits belonging to that plane. The dashboard meters average the trailing
fourteen days. A plane with no check-ins reads "No check-ins yet" rather than
zero.

### Streaks

A day counts once the rhythm is **≥ 60%** complete. The current streak may end
today *or yesterday* — a day still in progress does not break a run.

---

## Database schema

Sixteen tables, all prefixed `Mosh`, all scoped by `userId`, all added in
`prisma/migrations/20260814074739_mosh_self_mastery/`.

| Model | Key | Holds |
|---|---|---|
| `MoshProfile` | `userId` unique | display name, title, philosophy, mission, currency, timezone, plan year, Eclipse start |
| `MoshDailyEntry` | `(userId, date)` unique | seven habit booleans, gratitude, wins, reflection, energy, mood, derived completion + alignment |
| `MoshPlaneCheckin` | `(userId, date, attribute)` unique | one 1–10 rating of one plane attribute |
| `MoshWeeklyEntry` | `(userId, weekStart)` unique | intention, review, derived momentum |
| `MoshWeeklyGoal` | → weekly | area, goal, progress, completion, position |
| `MoshMonthlyReview` | `(userId, month)` unique | the six review answers, derived growth |
| `MoshMonthlyPillar` | `(reviewId, area)` unique | goals, achievements, lessons, score |
| `MoshYearPlan` | `(userId, year)` unique | theme, vision, north star |
| `MoshQuarter` | `(yearPlanId, quarter)` unique | title, focus[], goal, progress, revenue + client targets |
| `MoshMilestone` | → quarter | month offset, title, detail, done, due date |
| `MoshOffer` | `(userId, tier, name)` unique | tier, name, promise, price, currency, active |
| `MoshOfferMetric` | `(offerId, month)` unique | revenue and the per-tier metrics |
| `MoshFunnelSnapshot` | `(userId, date)` unique | the seven stage counts |
| `MoshEclipseDay` | `(userId, day)` unique | phase, focus, action, done, note |
| `MoshCoachSession` | → user | pattern, situation, analysis, encouragement, actions, prompts, recommendations, source |
| `MoshLegacyLetter` | → user | kind, title, body, pinned |

**Period anchors.** Days, ISO week Mondays and month firsts are stored as
`@db.Date` and produced only by `src/lib/mosh/dates.ts`, which works entirely in
UTC. Combined with the unique constraints, that is what makes "today's entry" an
upsert that can never fork into duplicate rows — asserted in the integration
tests.

Run the migration with:

```bash
npx prisma migrate deploy      # production
npx prisma migrate dev         # development
```

---

## API endpoints

Every endpoint requires a session, is rate limited per user, and returns
`{ error: { code, message, details? } }` on failure.

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/api/mosh/dashboard` | Every dashboard score, meter and trend |
| `GET` | `/api/mosh/daily?date=` | One day (empty but valid when nothing was saved) |
| `POST` | `/api/mosh/daily` | Upsert a day. Fields left out keep their stored value; `""` clears |
| `GET` | `/api/mosh/daily/history?from=&to=` | Day series plus the streak |
| `GET` | `/api/mosh/weekly?weekStart=` | One week with goals and derived momentum |
| `POST` | `/api/mosh/weekly` | Save a week. The goal list is authoritative — omitted goals are deleted |
| `GET` | `/api/mosh/weekly/trend?weeks=` | Momentum per week, gaps filled at zero |
| `GET` | `/api/mosh/monthly?month=&months=` | One review plus the growth trend |
| `POST` | `/api/mosh/monthly` | Save a review and its pillars |
| `GET` | `/api/mosh/plan?year=` | The year plan, seeded on first access |
| `PUT` | `/api/mosh/plan` | Theme, vision, north star |
| `PATCH` | `/api/mosh/plan/quarters` | Title, goal, focus, progress, targets |
| `POST` `PATCH` `DELETE` | `/api/mosh/plan/milestones` | Milestone lifecycle |
| `GET` | `/api/mosh/business?months=` | Offers, metrics, tier summaries, Wealth Flow |
| `POST` `DELETE` | `/api/mosh/business/offers` | Offer lifecycle |
| `POST` | `/api/mosh/business/metrics` | Report one offer-month |
| `GET` `POST` `DELETE` | `/api/mosh/funnel` | Snapshots and conversion analysis |
| `GET` `PATCH` `POST` | `/api/mosh/eclipse` | The fifty days; `POST` sets or restarts the clock |
| `GET` `POST` `DELETE` | `/api/mosh/coach` | Sessions with The Billionaire Self (`POST` uses the AI rate-limit bucket) |
| `GET` `POST` `DELETE` | `/api/mosh/legacy` | Letters |
| `GET` | `/api/mosh/analytics?days=` | The analytics page payload |
| `GET` | `/api/mosh/export?dataset=&format=` | CSV or PDF for one dataset |
| `GET` | `/api/mosh/export/year` | The full-year PDF report |
| `GET` `PATCH` | `/api/mosh/profile` | Profile settings |

Example:

```bash
curl -s -X POST https://your-host/api/mosh/daily \
  -H 'content-type: application/json' \
  -H "cookie: $SESSION_COOKIE" \
  -d '{"date":"2026-08-16","exercise":true,"energy":8,"checkins":{"clarity":9}}'
```

---

## Component architecture

**Server components** (`page.tsx`) fetch and render. **Client components** own
interaction and are named for what they are (`daily-tracker.tsx`,
`plan-board.tsx`). Data flows down as props; changes go up through
`/api/mosh/*` and the page is refreshed with `router.refresh()`.

| Piece | Responsibility |
|---|---|
| `ui.tsx` | `PageHeader`, `Card`, `Grid`, `ScoreBar`, `Meter`, `Stat`, `Badge`, `EmptyState`, `Field`, `buttonClass`, table primitives |
| `charts.tsx` | `AlignmentTrendChart`, `ScoreBarChart`, `WealthFlowChart`, `HorizontalBarChart`, `PlaneRadarChart` |
| `nav.tsx` | The twelve-item rail, and the drawer below `lg` |
| `toast.tsx` | Save confirmations, announced politely |
| `pwa.tsx` | Service worker registration, offline banner, install button |

**State.** Zustand (`src/lib/mosh/store.ts`) holds only what the browser owns —
the drawer, the saving flag, toasts. Server data never enters it, so the two can
never disagree. Forms use React Hook Form; the live score previews call the same
pure scoring functions the server uses, so the number moves the instant a box is
ticked and is then recomputed authoritatively on save.

---

## Wireframes

**Dashboard** — the whole system in one screen.

```
┌──────────┬──────────────────────────────────────────────────────────────┐
│ MOSH     │  Sunday, 16 August 2026        Hassan Mohammed   [Sign out]  │
│ Structure├──────────────────────────────────────────────────────────────┤
│ Creates  │  HASSAN MOHAMMED · LIFE COACH AND MINDSET ARCHITECT          │
│ Freedom. │  Good to see you, Hassan.               [Open today's tracker]│
│          │                                                              │
│ ▸Dashbd  │  ┌────────────┐┌────────────┐┌────────────┐┌────────────┐    │
│  Daily   │  │Daily      %││Weekly     %││Monthly    %││Wealth     %│    │
│  Weekly  │  │▓▓▓▓▓▓░░░░░ ││▓▓▓▓▓▓▓░░░░ ││▓▓▓▓░░░░░░░ ││▓▓▓▓▓▓▓▓░░░ │    │
│  Monthly │  └────────────┘└────────────┘└────────────┘└────────────┘    │
│  Plan    │  ALIGNMENT METERS                                            │
│  Business│  ┌────────┐┌────────┐┌────────┐┌────────┐                    │
│  Funnel  │  │  ◜75◝  ││  ◜82◝  ││  ◜61◝  ││  ◜44◝  │                    │
│  Eclipse │  │ Mental ││Spiritul││Physical││ Annual │                    │
│  Coach   │  └────────┘└────────┘└────────┘└────────┘                    │
│  Legacy  │  ┌─────────────────────────────┐┌────────────────────────┐   │
│  Analytcs│  │ Fourteen days of alignment  ││ Today's rhythm  2 of 7 │   │
│  Settings│  │      ╱╲    ╱╲               ││ ✓ Morning rhythm       │   │
│          │  │  ╱╲╱  ╲╱╲╱  ╲               ││ ○ Exercise …           │   │
│          │  └─────────────────────────────┘└────────────────────────┘   │
│          │  ┌──────────────────┐┌───────────────────────────────────┐   │
│          │  │ 50-Day Eclipse   ││ What the numbers are telling you  │   │
│          │  │ Day 13 of 50     ││ ▸ The funnel leaks worst at …     │   │
│          │  └──────────────────┘└───────────────────────────────────┘   │
└──────────┴──────────────────────────────────────────────────────────────┘
```

**Daily tracker** — four minutes, and the foundation of everything else.

```
[Daily Alignment ▓▓▓▓▓▓▓░░ 73%]   [Rhythm completion ▓▓▓▓▓░░░░ 57%]

The seven non-negotiables
┌───────────────────────────┐ ┌───────────────────────────┐
│ ☑ Morning rhythm          │ │ ☐ Exercise                │
│ ☑ Creative work           │ │ ☑ Journaling              │
│ ☑ Meditation              │ │ ☐ Content creation        │
│ ☐ Trust and delegation    │ │                           │
└───────────────────────────┘ └───────────────────────────┘

┌──────────────┐ ┌──────────────────────────────────────────┐
│ Energy  ▬▬●▬ │ │ Gratitude  [                          ]  │
│ Mood    ▬▬▬● │ │ Wins       [                          ]  │
└──────────────┘ │ Reflection [                          ]  │
                 └──────────────────────────────────────────┘
Plane check-in
┌ Mental 78% ─┐ ┌ Spiritual 84% ┐ ┌ Physical 62% ┐
│ Clarity ▬●▬ │ │ Gratitude ▬●▬ │ │ Exercise ▬●▬ │
│ Focus   ▬●▬ │ │ Faith     ▬●▬ │ │ Sleep    ▬●▬ │ …
└─────────────┘ └───────────────┘ └──────────────┘
                     [ Save the day ]   ← sticky
```

**Business** — the ecosystem and the index it produces.

```
[Wealth Flow ▓▓▓▓▓▓░░ 67%]  [Revenue this month]  [Index target]

Wealth Flow, twelve months           ┌ legend ┐
   ▉▉        ▉▉▉                     │ ■ Attraction ×1
   ▉▉  ▉▉▉   ▉▉▉  stacked by tier    │ ■ Core ×2
   ▉▉  ▉▉▉   ▉▉▉                     │ ■ Premium ×3

Tier 1 — Attraction offer                        [× 1]  [Add offer]
  The Alignment Starter · GHS 0 · 620 leads · 25% conversion
  [Revenue][Leads][Conversions][Subscribers][Downloads]  [Save month]
Tier 2 — Core coaching program                   [× 2]
Tier 3 — Premium mentorship                      [× 3]
```

**50-Day Eclipse** — the timeline is a control, not a picture.

```
[Eclipse progress ▓▓▓░░░░░ 24%]   [Current day 13]  [Phase 2]

Start date [2026-08-04]  [Update]  [Restart and clear progress]
① ② ③ ④ ⑤ ⑥ ⑦ ⑧ ⑨ ⑩ ⑪ ⑫ ⓭ 14 15 … 50    ← every dot jumps to its day

Phase 2 — Core Offer Birth              [Current phase] [2/10]
  ☑ Day 11 · Interview five people        2026-08-14
        Ask five ideal clients what they have already tried…
        [note ………………………………………]
```

---

## Design system

Calm, elegant, premium, therapeutic. Emerald and cream, defined once as CSS
custom properties scoped to `.mosh-root` in `src/app/globals.css` and exposed to
Tailwind as `mosh-*` colours, so neither this palette nor the Chief of Staff's
can leak into the other.

| Token | Light | Dark |
|---|---|---|
| canvas | `#faf6ee` cream | `#08110f` |
| surface | `#ffffff` | `#0f1e1a` |
| ink | `#14312a` | `#eaf4f0` |
| brand | `#0f766e` emerald | `#34d399` |
| accent | `#a06a12` aged gold | `#e0b463` |

**Charts.** Three series colours per mode, chosen as two *selected* palettes
rather than one flipped automatically, and validated against the computable
accessibility checks — lightness band, chroma floor, CVD separation,
normal-vision floor, contrast against the surface — for all pairs in both modes:

| Slot | Light | Dark |
|---|---|---|
| 1 | `#00845c` | `#26a17a` |
| 2 | `#b05e12` | `#c47d17` |
| 3 | `#5344b0` | `#8b7fe0` |

Worst adjacent CVD ΔE 8.6 light / 10.5 dark (target ≥ 8); worst normal-vision ΔE
20.3 / 19.4 (floor ≥ 15); every slot clears 3:1 against its surface. The values
are read from CSS variables inside the SVG, so the chart follows the viewer's
theme with no JavaScript. **Re-run the validator before changing any of them.**

House rules the charts follow: one y-axis, never two; a legend whenever more
than one series is shown; thin marks with rounded data-ends; recessive grids; a
tooltip on every chart; and a data table beside anything where the number itself
is the point.

**Responsive.** A fixed rail from `lg` up, a portalled drawer below it, and
fluid grids that collapse 4 → 2 → 1. Tested at 1440 and 390 px. Wide tables
scroll inside their own container so the page never scrolls sideways.

---

## Progressive Web App

- **Manifest** — `src/app/manifest.ts`, served at `/manifest.webmanifest`.
  `start_url` is `/mosh`: someone who installs this installed the self-mastery
  system, and that is the screen they expect.
- **Icons** — generated by `node scripts/generate-mosh-icons.mjs` into
  `public/icons/` (192, 512, maskable 512, apple-touch 180). The mark is three
  concentric rings: the planes aligned. It is drawn in code rather than shipped
  as a binary blob, so it is reviewable and regenerable at any size.
- **Service worker** — `public/sw.js`. Navigations are network-first with the
  cached shell as a fallback; `/_next/static` and `/icons` are cache-first;
  **`/api` is never cached** — a journal entry read from a stale cache would be
  worse than no answer, and writes must reach the server or fail loudly.
- **Offline** — `/offline` is cached at install and rendered when a navigation
  has no network. An offline banner appears in the shell.
- **Install** — a real button where `beforeinstallprompt` exists, and the Share
  → Add to Home Screen instruction on iOS, which has no such event.
- **Push** — the worker handles `push` and `notificationclick`. Sending
  notifications additionally requires VAPID keys and a subscription store.

---

## The AI layer

The Billionaire Self has two engines behind one interface.

**The written playbook** (`src/lib/mosh/coach.ts`) always answers. Each of the
seven patterns has a full response: what the pattern actually is underneath the
story it tells about itself, what it costs, four actions doable in 48 hours, and
three reflection prompts. This is the default and it is complete on its own.

**The model** personalises that structure when `ANTHROPIC_API_KEY` is set. It is
given a grounding block containing only real numbers — streak, alignment,
momentum, weakest and strongest plane, open milestones, Eclipse day, weakest
funnel step — and is instructed to use nothing else. If the call fails for any
reason, the playbook answers instead.

Every stored session records which engine produced it, and the UI labels it.
Alignment recommendations stay derived from records either way, so any number
quoted back to the user can be traced to an entry they made.

The system prompt also carries a hard rule: if someone describes self-harm,
abuse or a mental-health crisis, the coach says plainly that this needs a real
human professional and stops coaching.

Everything else in MOSH — every score, chart, meter and export — is
deterministic and uses no AI at all.

---

## Deployment

### Requirements

- Node.js 20.9+
- PostgreSQL 14+ (Supabase, Neon, RDS or your own)
- `AUTH_SECRET` — `openssl rand -base64 32`
- `ANTHROPIC_API_KEY` — optional

### Vercel

1. Import the repository. Vercel detects Next.js; `vercel.json` sets the build
   command to `prisma generate && prisma migrate deploy && next build`, so
   migrations run on deploy.
2. Set environment variables: `DATABASE_URL` (use the **pooled** connection
   string), `AUTH_SECRET`, and optionally `ANTHROPIC_API_KEY`, `AUTH_URL`,
   `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`.
3. Deploy, then open `/register`, create the first account, and go to `/mosh`.

### Docker

```bash
cp .env.example .env          # set AUTH_SECRET at minimum
docker compose up --build
docker compose exec app npx prisma migrate deploy
docker compose exec app npm run db:seed        # optional demo data
```

`docker-compose.yml` brings up PostgreSQL and the app; the `Dockerfile` builds a
standalone Next.js bundle on `node:22-alpine`, runs as a non-root user, and
carries the Prisma migrations so `migrate deploy` can be run as a release step
against the exact image being deployed.

### Any Node host

```bash
npm ci
npx prisma generate
npx prisma migrate deploy
npm run build
npm start
```

### Demo data

Set `MOSH_SEED_DEMO=true` and run `npm run db:seed` **after** registering an
account. It attaches thirty days of rhythm, four weeks of goals, a completed
monthly review, a seeded year plan, three offers with three months of revenue,
seven funnel snapshots and twelve completed Eclipse days to the first user in
the database. It refuses to run if that account already has entries.

---

## Supabase

Supabase is PostgreSQL, so there are two ways to use it and they are different
things.

**Supabase as the database — no code changes.** Point `DATABASE_URL` at the
project's pooled connection string and run `npx prisma migrate deploy`. Every
table the app uses is created; sessions stay with Auth.js. This is the path the
shipped app runs on and the one to choose unless you have a reason not to.

**Supabase as the whole backend.** `supabase/migrations/0001_mosh_self_mastery.sql`
builds the same domain model natively: `uuid` keys referencing `auth.users`,
row-level security on all sixteen tables (`auth.uid() = user_id`, with
`with check` on writes so a row can never be inserted onto another user),
`updated_at` triggers, a `mosh_wealth_flow` view that computes the index in SQL,
and a trigger that creates a profile whenever an account is created. Apply it
with `supabase db push`. Choose this when you also want to reach the data from
supabase-js — a mobile client, an edge function — and let Postgres enforce
isolation.

The file was applied to a PostgreSQL 16 instance with a stubbed `auth` schema
and checked: the profile trigger fires, RLS hides another user's rows from a
`select`, and the wealth view returns the weighted index.

---

## Testing

```bash
npm run typecheck
npm run lint
npm test                    # unit tests always; integration when DATABASE_URL is set
```

- `tests/unit/mosh-scoring.test.ts` — 39 tests over every scoring function, the
  weight-redistribution rule, funnel division-by-zero, streak edges, the UTC
  period anchors, and the PDF writer's structure and escaping.
- `tests/integration/mosh-services.test.ts` — 21 tests against a real database:
  upsert-per-period, partial saves that must not erase adjacent prose, goal
  pruning, plan seeding, the Wealth Flow Index end to end, the fifty days, the
  exports — and, for three separate modules, that one user cannot read or write
  another's records.

---

## Verification status

Everything below was executed in this environment, not assumed.

| Check | Result |
|---|---|
| `npx tsc --noEmit` | Clean |
| `npm run lint` | Clean, no warnings |
| `npm test` | 156 tests passing (60 of them MOSH) |
| `next build` | Compiles; all twelve `/mosh` routes and twenty-three API routes build |
| Browser walkthrough | Signed in and loaded all twelve pages against PostgreSQL — no console errors, no failed requests |
| Save round-trip | Ticked habits, wrote a journal entry, saved, and confirmed the dashboard scores updated |
| Responsive | Verified at 1440 px and 390 px, light and dark |
| PDF exports | All seven datasets plus the year report generate valid PDFs (header, xref offsets, EOF verified) |
| Supabase SQL | Applied to PostgreSQL 16; RLS isolation and the wealth view confirmed |
| Chart palette | Validated in both modes, all pairs, against the six computable checks |

Two defects were found by these checks and fixed before shipping: a partial
plane check-in payload was rejected by an exhaustive Zod record, and optional
text fields collapsed "absent" into "cleared" — which would have erased a note
when a checkbox was toggled. Both now have tests.

### Known limitations

- **Rate limiting is in-process.** It protects a single Node instance, which is
  right for a personal deployment. Back it with Redis for multi-instance
  hosting; the call sites do not change.
- **Push notifications need VAPID keys** and a subscription table. The service
  worker half is done; the server half is not.
- **The PDF writer is deliberately small** — one font, no images, no embedded
  fonts. It is the right tool for these reports and the wrong one for a designed
  document.
- **Currency is a label, not a conversion.** Amounts are stored as entered;
  there is no FX.
