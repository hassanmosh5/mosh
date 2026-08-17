# MOSH Digital Studios — monorepo

This repository holds two products that share one Next.js application, one
PostgreSQL database and one authentication layer:

| Product | Where | What it is |
|---|---|---|
| **MOSH Chief of Staff (M-CoS)** | [`/cos`](#mosh-chief-of-staff-m-cos) | The AI executive operating system for MOSH Digital Studios |
| **AI Income Academy** | [`/`, `/courses`, `/learn`](#ai-income-academy) | The interactive learning platform built from *The AI Income Blueprint* |

Plus a set of standalone single-file apps that need no server — see
[Also in this repo](#also-in-this-repo-standalone-apps).

---

# MOSH Chief of Staff (M-CoS)

An AI-powered executive operating system: priorities, projects, clients, goals,
knowledge, agents, automation and reporting in one place, with an AI Chief of
Staff that reads the live business before it answers.

**It is not a chatbot with a dashboard bolted on.** The intelligence is
deterministic where it should be — project health, task prioritisation,
opportunity scores and automation scores are computed from records by pure
functions in `src/lib/cos/scoring.ts` — and generative where that adds value.
The AI quotes those numbers, explains them and acts through a controlled tool
layer. It never invents them, and it never touches the database directly.

## What it does

| Module | Route | Summary |
|---|---|---|
| Executive dashboard | `/cos` | Ranked priorities, overdue work, project health, weighted pipeline, month-to-date profit, alerts, goals, automation candidates |
| AI Chief of Staff | `/cos/chat` | Grounded conversation with tool access to the live business |
| Tasks | `/cos/tasks` | Full CRUD, 7 statuses, 4 priorities, dependencies with cycle detection, recurrence, AI-generated tasks |
| Projects | `/cos/projects` | Milestones, risks, budget, computed GREEN/YELLOW/RED health |
| CRM | `/cos/crm` | Leads, contacts, clients, opportunities, proposals, 7-stage weighted pipeline |
| Goals | `/cos/goals` | Annual → daily tree with KPI, target, computed progress and pace risk |
| Content | `/cos/content` | Calendar across 8 channels, idea → repurpose |
| Products | `/cos/products` | Digital products, idea → scale |
| Knowledge & memory | `/cos/knowledge` | Reference documents with keyword retrieval; scoped memory with confidence and expiry |
| AI agents | `/cos/agents` | 13 specialists with their own prompts and tool allow-lists, plus routing and synthesis |
| Automations | `/cos/automations` | Scored opportunities, candidates detected from your own task history, decision log |
| Analytics | `/cos/analytics` | Revenue/profit, pipeline, products, delivery, AI cost |
| Reports | `/cos/reports` | Daily briefing, weekly executive, monthly business, quarterly strategy |
| Settings | `/cos/settings` | Business, areas, people and roles, approvals, integrations, audit log |

Everywhere: ⌘K command centre, global search, derived notifications, full audit
trail, and PLAN → APPROVE → EXECUTE for anything irreversible.

## Quick start

```bash
npm install
cp .env.example .env          # set DATABASE_URL and AUTH_SECRET at minimum
npx prisma migrate deploy
npx prisma generate
npm run db:seed               # workspace, business areas, 13 agents, demo data
npm run dev                   # http://localhost:3000/cos
```

Register at `/register`, then open `/cos`. **The first account becomes the
workspace owner**; every account after joins as a viewer and must be promoted in
Settings → People.

To seed without demo data: `MCOS_SEED_DEMO=false npm run db:seed`.

## Running without an AI key

M-CoS is fully usable without `ANTHROPIC_API_KEY`. The dashboard, briefing data,
tasks, projects, CRM, goals, knowledge, memory, content, products, analytics,
automation scoring and detection, notifications, search, approvals, audit and
**data-only reports** all work — they are computed from the database. The chat,
agent runs and the AI narrative layer on reports are disabled and say so in the
UI rather than failing quietly.

## Verification status

Everything below was run against a real PostgreSQL database in a production
build of this repository:

- `npm run typecheck` — clean
- `npm run lint` — clean
- `npm run build` — succeeds
- `npm test` — **97 tests passing** (56 unit, 41 integration against Postgres)
- Every authenticated `/cos` screen rendered with seeded data
- Writes, validation failures, malformed JSON, cross-tenant access, rate limits,
  notification scanning and data-only report generation exercised over HTTP

**Not verified here:** a live Anthropic round-trip. No API key was available in
the build environment, so the chat and agent loops were exercised through their
tool layer, routing and permission tests, and their no-key degradation path —
but not against the real model. Confirm it with the post-deploy checklist in
[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Known limitations

1. **Integrations are interfaces, not connections.** The registry, credential
   detection, status computation and configuration UI are real; the provider API
   calls behind them are not implemented. Nothing pretends to succeed — an
   integration reads NOT CONNECTED until its credentials exist, and the server
   refuses to mark it connected otherwise.
2. **Approval execution is recorded, not performed.** M-CoS deliberately does
   not hold the credentials to send on the founder's behalf; approving records
   authorisation, and marking executed closes the audit loop.
3. **Knowledge search is lexical.** The `embedding` column and the single
   `searchKnowledge()` function are the seam for semantic search; no embedding
   provider is wired in.
4. **Rate limiting is per-process.** Correct for a single-instance deployment;
   back it with Redis for more.
5. **No browser test suite.** Screens were verified by rendering every route
   against a seeded database, not by Playwright.
6. **Client portal is scaffolded only.** The `CLIENT` role and its permissions
   exist; no client-facing screens do.

## Documentation

| Document | Covers |
|---|---|
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Layers, request lifecycle, design decisions, extension points |
| [docs/DATABASE.md](docs/DATABASE.md) | Every entity, indexes, constraints, migrations, seed behaviour |
| [docs/AI_ARCHITECTURE.md](docs/AI_ARCHITECTURE.md) | Tool layer, context strategy, injection defences, orchestration, cost |
| [docs/AGENTS.md](docs/AGENTS.md) | The 13 agents, routing, execution, boundaries, adding your own |
| [docs/API.md](docs/API.md) | Every endpoint, permissions, error shapes, rate limits |
| [docs/SECURITY.md](docs/SECURITY.md) | Auth, roles, tenancy, validation, secrets, approvals, audit |
| [docs/AUTOMATIONS.md](docs/AUTOMATIONS.md) | Scoring formula, detection, lifecycle, worked example |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Vercel and self-hosting, scheduled jobs, scaling, checklist |
| [docs/ENVIRONMENT.md](docs/ENVIRONMENT.md) | Every environment variable |
| [docs/TESTING.md](docs/TESTING.md) | Suite layout, what is and is not covered |
| [docs/USER_GUIDE.md](docs/USER_GUIDE.md) | The daily loop, every section, how to read the numbers |

## Next recommended features

1. **Wire the first integration end to end** — Gmail draft creation behind the
   approval flow is the highest-leverage one, because it closes the loop on
   client follow-up.
2. **Semantic knowledge search** — swap the lexical ranker for embeddings; the
   column and the seam already exist.
3. **Scheduled briefings** — a cron that posts the morning briefing to WhatsApp
   or email turns M-CoS from a place you visit into a system that reaches you.
4. **Client portal** — the `CLIENT` role and permissions are already defined.
5. **Streaming chat responses** — the loop is synchronous today; streaming would
   make long analyses feel immediate.
6. **Redis-backed rate limiting** before scaling past one instance.

---

# AI Income Academy

An interactive learning platform built from *The AI Income Blueprint* by
Hassan Mohammed. The book's 5 parts and 17 chapters are converted into a
real course: a landing page, auth, a course library, a lesson viewer with
progress tracking and knowledge-check quizzes, a student dashboard, and an
AI tutor grounded in the book's actual content.

This is a scoped **MVP foundation**, not the full 19-phase platform some
briefs describe. Everything below is real and working. Anything bigger
(payments, extra OAuth providers, admin/instructor panels, community,
certificates, gamification) is deliberately deferred — see
[Roadmap](#roadmap) for how to build each one on top of this foundation.

## Also in this repo: standalone apps

The academy needs a database and a server. Alongside it are single-file apps that need
neither — open the HTML file and they run, offline, with everything stored locally.
**[`hub/index.html`](hub/index.html) links to all of them** with descriptions.

| App | What it is |
|---|---|
| [`ebook/`](ebook/) | **The book as an interactive reader** — all 17 chapters with highlighting, notes, inline quizzes, action-step tracking, search, three themes and Markdown export. Generated from `prisma/seed-data.ts`; rebuild with `npm run ebook:build`. |
| [`billionaire-structures/`](billionaire-structures/) | **How large fortunes are actually held** — 33 structures with who owns them, who controls them, who pays the tax and what happens at death, each priced and given a verdict against your own numbers; 15 editable death-tax regimes; the freeze, liquidity, control and giving arithmetic; and a red-lines audit that can fail a plan. Tells most readers they need almost none of it. |
| [`product-factory/`](product-factory/) | **The studio's production console** — twelve products ranked by score per hour, three workflows with their human gates, seven agent briefs, eighteen category-specific accuracy checks, unit economics, funnel sensitivity, and a catalogue simulation that finds the size at which upkeep eats the whole week. |
| [`packaging-agent/`](packaging-agent/) | **The other half of the factory** — ten fields about one finished asset become the whole commercial package: a monetisation score, descriptions written to exact word counts, four tiers priced in dollars and cedis, ~50 files across the ten-folder structure (five of them as real PDFs typeset in the browser), listings for Gumroad, Selar, Paystack and Shopify with every character limit enforced, 120 keywords, 50 social posts, a funnel and a launch plan — downloadable as a ZIP, plus a separate customer ZIP per tier. |
| [`launch-kit/`](launch-kit/) | Part Four's decision tools as working tools: Fit Matrix, 7-Day Validation Sprint, 30-Day Launch Plan, CLEAR builder, pricing sheet. |
| [`prompt-generator/`](prompt-generator/) | The Wealth Ideas Matrix wired into the CLEAR Formula, plus a prompt-pack builder and listing-copy generator. |
| [`digital-products/`](digital-products/) | **Chapter 7 as a working tool** — eight formats compared on how much AI really carries, the 3 criteria scored with hard floors, the 30-Minute Validation Method on a clock, the 8-step build workflow with prompts written from your answers, and the fee/refund/traffic arithmetic. Both gates can return a kill. |
| [`workbook/`](workbook/) | Star Explorers — an interactive workbook for children aged 4–8. |
| [`gpt/`](gpt/) | Digital Product Studio — a ChatGPT custom GPT built on Chapter 7 (instructions, config and knowledge file). |

## Stack

- **Next.js 16** (App Router) + TypeScript + Tailwind CSS 4
- **PostgreSQL** + **Prisma 7** (driver adapter: `@prisma/adapter-pg`)
- **NextAuth v5** (Auth.js) — credentials (bcrypt) + optional Google OAuth
- **OpenAI** — AI tutor, grounded in course content via system-prompt context injection
- `react-markdown` for lesson content, Tailwind Typography for prose styling

## What's real and working

- **Landing page** (`/`) — pulls live course/module data from the database.
- **Auth** (`/login`, `/register`) — email+password (bcrypt-hashed), plus a
  "Continue with Google" button that appears automatically once
  `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` are set. Sessions are JWT-based.
  `middleware.ts` protects `/dashboard`, `/tutor`, and `/learn/*`.
- **Course library** (`/courses`, `/courses/[slug]`) — lists modules and
  lessons in order, with a per-lesson completion checkmark and progress bar
  for signed-in users.
- **Lesson viewer** (`/learn/[lessonSlug]`) — renders real lesson content
  (markdown), key takeaways, case study, and action step; has prev/next
  navigation across the whole course; a "Mark as complete" button backed by
  `POST /api/progress`; and an inline knowledge-check quiz backed by
  `POST /api/quiz/[quizId]/attempt`.
- **Dashboard** (`/dashboard`) — per-course progress, recent quiz scores, and
  quick links back into the course and the AI tutor.
- **AI tutor** (`/tutor`) — a chat UI backed by `POST /api/tutor`. The system
  prompt is built from the course's table of contents plus (when linked from
  a lesson via "Ask the AI tutor about this lesson") that lesson's full
  content, so answers are grounded in the book rather than generic. Returns
  a clear, actionable error instead of crashing when `OPENAI_API_KEY` isn't set.
- **Progress tracking & quizzes** are backed by real Prisma models
  (`LessonProgress`, `Quiz`, `Question`, `QuizAttempt`), not mocked data.

## Curriculum source

The course content in `prisma/seed-data.ts` is derived directly from
`books/THE_AI_INCOME_BLUEPRINT.pdf`. It mirrors the book's real structure:

- 5 modules = the book's 5 parts (Mindset, The Toolkit, The Income Streams,
  The Launch Plan, Scaling & Sustainability)
- 17 lessons = the book's 17 chapters, each with real summaries, key
  takeaways, action steps, and case studies pulled from the actual text
  (frameworks like the 3P Framework, the CLEAR Formula, the 3-Pass Method,
  the 30-Day Launch Plan, etc.)
- 28 knowledge-check quiz questions testing real facts from each chapter

Re-run the seed any time with `npm run db:seed` (it upserts, so it's safe to
re-run after editing `prisma/seed-data.ts`).

## Getting started

```bash
npm install
cp .env.example .env   # then fill in DATABASE_URL at minimum
npm run db:migrate     # creates the schema
npm run db:seed        # loads the curriculum
npm run dev
```

Open http://localhost:3000.

### Environment variables

See `.env.example`. Only `DATABASE_URL`, `NEXTAUTH_URL`, and
`NEXTAUTH_SECRET` are required to run the app with email/password auth.
`GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` and `OPENAI_API_KEY` are optional —
the app degrades gracefully (hides the Google button; the tutor returns a
clear "not configured" message) when they're unset.

## Architecture notes

- **Prisma 7 driver adapters**: this project uses Prisma 7, which requires a
  driver adapter (`@prisma/adapter-pg` + `pg`) rather than the classic
  bundled query engine. See `src/lib/prisma.ts`.
- **Edge-safe middleware**: `src/lib/auth.config.ts` holds the
  Node-runtime-agnostic parts of the NextAuth config (pages, `authorized`
  callback) used by `middleware.ts`. `src/lib/auth.ts` holds the full config
  (Prisma adapter, providers, bcrypt) used everywhere else. This split is
  required because the Prisma Postgres adapter is not edge-compatible.
- **Data model** (`prisma/schema.prisma`): `User`/`Account`/`Session` for
  auth; `Course` → `Module` → `Lesson` for curriculum; `Quiz` → `Question` →
  `QuizAttempt` for knowledge checks; `LessonProgress` for completion state;
  `Note` and `Bookmark` models exist in the schema for a future notes/
  bookmarks feature but have no UI yet.

## Roadmap: deferred features

These are intentionally **not** built in this MVP. Each has a real,
concrete starting point in the existing schema/architecture:

- **Payments** (Stripe/PayPal/Google Pay/Apple Pay/Mobile Money): add a
  `Plan`/`Subscription` model, a Stripe Checkout session route, and a
  webhook handler that flips `Course.published`-style access or a new
  `Enrollment` model. Gate `/learn/*` in `middleware.ts` on entitlement.
- **Additional OAuth providers** (Facebook, Apple, GitHub, Microsoft):
  NextAuth v5 supports these as drop-in providers — add them to the
  `providers` array in `src/lib/auth.ts` the same way Google was added,
  each gated behind its own env-var presence check.
- **Admin / instructor panels**: `User.role` (`STUDENT` / `INSTRUCTOR` /
  `ADMIN`) already exists on the schema and is present on the session
  (`session.user.role`). Add a `/admin` route group gated by role in
  `middleware.ts`, with CRUD screens over `Course`/`Module`/`Lesson`.
- **Community features** (discussion, cohorts, comments): add a `Comment`
  or `Thread` model scoped to `Lesson` or `Course`, and a moderation flag on
  `User`.
- **Certificates**: add a `Certificate` model (course, user, issuedAt), a
  completion check (`LessonProgress` coverage = 100%), and a PDF/QR
  generation route.
- **Gamification** (points, streaks, badges): add `Achievement` and
  `UserAchievement` models, and award logic in the `/api/progress` and
  `/api/quiz/[quizId]/attempt` handlers where progress/attempts are already
  recorded.
- **Notes & bookmarks**: the `Note` and `Bookmark` Prisma models already
  exist — only UI and API routes (mirroring `/api/progress`) are missing.
