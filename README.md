# AI Income Academy

An interactive learning platform built from *The AI Income Blueprint* by
Hassan Mohammed. The book's 5 parts and 17 chapters are converted into a
real course: a landing page, auth, a course library, a lesson viewer with
progress tracking and knowledge-check quizzes, a student dashboard, and an
AI tutor grounded in the book's actual content.

This is a scoped **MVP foundation**, not the full 19-phase platform some
briefs describe. Everything below is real and working. Anything bigger
(extra OAuth providers, admin/instructor panels, community, certificates,
gamification) is deliberately deferred — see [Roadmap](#roadmap) for how to
build each one on top of this foundation.

## Stack

- **Next.js 16** (App Router) + TypeScript + Tailwind CSS 4
- **PostgreSQL** + **Prisma 7** (driver adapter: `@prisma/adapter-pg`)
- **NextAuth v5** (Auth.js) — credentials (bcrypt) + optional Google OAuth
- **Stripe** — one-time course checkout, with a webhook + synchronous fallback
  for fulfillment
- **OpenAI** — AI tutor, grounded in course content via system-prompt context injection
- `react-markdown` for lesson content, Tailwind Typography for prose styling

## What's real and working

- **Landing page** (`/`) — pulls live course/module data from the database.
- **Auth** (`/login`, `/register`) — email+password (bcrypt-hashed), plus a
  "Continue with Google" button that appears automatically once
  `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` are set. Sessions are JWT-based.
  `src/proxy.ts` protects `/dashboard`, `/tutor`, and `/learn/*`.
- **Course library** (`/courses`, `/courses/[slug]`) — lists modules and
  lessons in order, with a per-lesson completion checkmark and progress bar
  for signed-in users, and (for paid courses) a Buy button or price.
- **Payments** (`Course.priceCents`) — a course with `priceCents > 0`
  requires purchase. Every course's *first lesson* is always a free preview;
  the rest are locked behind a paywall until the user buys access via Stripe
  Checkout (`POST /api/checkout`). Fulfillment happens two ways for
  reliability: a webhook (`POST /api/webhooks/stripe`) marks the purchase
  complete asynchronously, and the success-redirect page does a synchronous
  fallback check (`fulfillCheckoutSession`) in case the webhook hasn't
  landed yet. Access is enforced server-side — the lesson viewer, the
  progress API, the quiz-attempt API, and the AI tutor's lesson-grounding
  all check `isLessonAccessible`/`hasCourseAccess` (`src/lib/entitlement.ts`)
  before returning gated content. A free course (`priceCents = 0`, the seed
  default) behaves exactly as before — fully open, no checkout involved.
- **Lesson viewer** (`/learn/[lessonSlug]`) — renders real lesson content
  (markdown), key takeaways, case study, and action step; has prev/next
  navigation across the whole course; a "Mark as complete" button backed by
  `POST /api/progress`; and an inline knowledge-check quiz backed by
  `POST /api/quiz/[quizId]/attempt`. Locked lessons render a paywall instead
  of content.
- **Dashboard** (`/dashboard`) — per-course progress, recent quiz scores, and
  quick links back into the course and the AI tutor.
- **AI tutor** (`/tutor`) — a chat UI backed by `POST /api/tutor`. The system
  prompt is built from the course's table of contents plus (when linked from
  a lesson via "Ask the AI tutor about this lesson") that lesson's full
  content, so answers are grounded in the book rather than generic. Returns
  a clear, actionable error instead of crashing when `OPENAI_API_KEY` isn't set.
- **Progress tracking & quizzes** are backed by real Prisma models
  (`LessonProgress`, `Quiz`, `Question`, `QuizAttempt`), not mocked data.
- **Notes & bookmarks** — a "★ Bookmark this lesson" toggle
  (`POST /api/bookmarks`) and a per-lesson notes panel (add/edit/delete,
  `POST`/`PATCH`/`DELETE /api/notes*`) on every lesson page. Bookmarked
  lessons surface as a quick-access list on the dashboard. Both are gated by
  the same lesson entitlement check as progress/quizzes, so they can't be
  used to probe locked content on paid courses.

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
`GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET`, `OPENAI_API_KEY`, and
`STRIPE_SECRET_KEY`/`STRIPE_WEBHOOK_SECRET` are all optional — the app
degrades gracefully (hides the Google button; the tutor returns a clear
"not configured" message; `/api/checkout` returns a clear 503) when they're
unset.

### Enabling paid access for a course

By default the seeded course is free (`priceCents = 0`) so the app is fully
usable out of the box. To sell it:

1. Set `STRIPE_SECRET_KEY` (from the [Stripe dashboard](https://dashboard.stripe.com/test/apikeys)).
2. For local webhook testing, run `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
   and put the printed secret in `STRIPE_WEBHOOK_SECRET`. In production, add
   a webhook endpoint pointed at `/api/webhooks/stripe` for the
   `checkout.session.completed` event in the Stripe dashboard instead.
3. Set a price: `UPDATE "Course" SET "priceCents" = 4900 WHERE slug = 'ai-income-blueprint';`
   (or add `priceCents`/`currency` to `prisma/seed-data.ts` and re-seed).
4. Test with Stripe's test card `4242 4242 4242 4242`, any future expiry, any CVC.

## Architecture notes

- **Prisma 7 driver adapters**: this project uses Prisma 7, which requires a
  driver adapter (`@prisma/adapter-pg` + `pg`) rather than the classic
  bundled query engine. See `src/lib/prisma.ts`.
- **Edge-safe middleware**: `src/lib/auth.config.ts` holds the
  Node-runtime-agnostic parts of the NextAuth config (pages, `authorized`
  callback) used by `src/proxy.ts` (Next.js 16's replacement for
  `middleware.ts`). `src/lib/auth.ts` holds the full config (Prisma adapter,
  providers, bcrypt) used everywhere else. This split is required because
  the Prisma Postgres adapter is not edge-compatible.
- **Data model** (`prisma/schema.prisma`): `User`/`Account`/`Session` for
  auth; `Course` → `Module` → `Lesson` for curriculum; `Quiz` → `Question` →
  `QuizAttempt` for knowledge checks; `LessonProgress` for completion state;
  `Enrollment` for course purchases (`PENDING`/`COMPLETED`/`REFUNDED`,
  linked to a Stripe Checkout Session); `Note` (many per user per lesson,
  a running journal) and `Bookmark` (one toggle per user per lesson) for
  personal annotations.
- **Payment fulfillment is belt-and-suspenders**: Stripe recommends not
  relying solely on the success-page redirect (a closed tab loses it) or
  solely on webhooks (delivery can lag or be missed in dev without
  `stripe listen`). `fulfillCheckoutSession` in `src/lib/entitlement.ts` is
  idempotent and is called from both `POST /api/webhooks/stripe` and the
  course page's `session_id` success-redirect handler.

## Roadmap: deferred features

These are intentionally **not** built in this MVP. Each has a real,
concrete starting point in the existing schema/architecture:

- **Additional payment methods** (PayPal, Google Pay, Apple Pay, Mobile
  Money) and **subscriptions**: Stripe Checkout already supports Google
  Pay/Apple Pay as wallet options with no extra integration work — enable
  them in the Stripe Dashboard's payment methods settings. A recurring
  model would add a `Plan` model and switch `mode: "payment"` to
  `mode: "subscription"` in `POST /api/checkout`, plus handle
  `customer.subscription.deleted` in the webhook.
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
