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
| [`launch-kit/`](launch-kit/) | Part Four's decision tools as working tools: Fit Matrix, 7-Day Validation Sprint, 30-Day Launch Plan, CLEAR builder, pricing sheet. |
| [`prompt-generator/`](prompt-generator/) | The Wealth Ideas Matrix wired into the CLEAR Formula, plus a prompt-pack builder and listing-copy generator. |
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
