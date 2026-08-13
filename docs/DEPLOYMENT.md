# Deployment

M-CoS is a standard Next.js 16 application with a PostgreSQL database. It
deploys to Vercel without modification, and to any Node host that can run
`next start`.

## Prerequisites

- Node.js 20+ (built and tested on 22)
- PostgreSQL 14+
- An Anthropic API key (optional — see [Degradation](#running-without-an-ai-key))

## Vercel

1. **Provision a database.** Vercel Postgres, Neon or Supabase all work. Copy
   the pooled connection string.
2. **Set environment variables** in the project settings. At minimum:

   ```
   DATABASE_URL      postgresql://…
   AUTH_SECRET       openssl rand -base64 32
   ANTHROPIC_API_KEY sk-ant-…
   ```

   Add integration credentials as you connect them — see
   [ENVIRONMENT.md](./ENVIRONMENT.md).
3. **Run the migration** against the production database:

   ```bash
   DATABASE_URL="postgresql://…" npx prisma migrate deploy
   ```
4. **Seed the workspace.** This installs business areas, the agent registry and
   reference knowledge. Skip the demo data in production:

   ```bash
   DATABASE_URL="postgresql://…" MCOS_SEED_DEMO=false npm run db:seed
   ```
5. **Deploy.** `next build` runs `prisma generate` through the normal build
   pipeline; no custom build command is needed.
6. **Claim the workspace.** Register at `/register`, then open `/cos`. The first
   account to arrive becomes `OWNER`; everyone after joins as `VIEWER` and must
   be promoted in Settings → People.

### Auth.js host configuration

Vercel provides the deployment URL automatically. On other hosts, or behind a
proxy, set:

```
AUTH_URL=https://cos.example.com
AUTH_TRUST_HOST=true
```

## Self-hosting

```bash
npm ci
npx prisma migrate deploy
npx prisma generate
MCOS_SEED_DEMO=false npm run db:seed
npm run build
npm run start           # defaults to port 3000
```

Put a TLS-terminating reverse proxy in front of it. The session cookie is
`Secure` in production, so the app must be served over HTTPS.

## Scheduled jobs

Two operations are idempotent and worth running on a schedule. Both are ordinary
authenticated API calls, so any scheduler works — Vercel Cron, a GitHub Action,
or `cron` on the host.

| Job | Endpoint | Suggested cadence |
|---|---|---|
| Rescan for alerts | `POST /api/cos/notifications/refresh` | hourly |
| Morning briefing | `POST /api/cos/reports` with `{"kind":"DAILY_BRIEFING"}` | weekdays, early |
| Weekly executive report | `POST /api/cos/reports` with `{"kind":"WEEKLY_EXECUTIVE"}` | Monday morning |

Neither is required — the dashboard recomputes on every load and reports can be
generated on demand.

## Running without an AI key

M-CoS is fully usable without `ANTHROPIC_API_KEY`. The dashboard, morning
briefing data, tasks, projects, CRM, goals, knowledge, memory, content,
products, analytics, automation scoring and detection, notifications, search,
approvals and audit all work — they are computed from the database.

Disabled without a key, with a clear message in each place:

- Chief of Staff chat (`503` from the API, banner in the UI)
- Agent runs (same)
- The AI narrative layer on reports — reports still generate from data

## Scaling notes

- **Rate limiting is per-process.** On more than one instance, back
  `consumeRateLimit()` with Redis. No call site changes.
- **Prisma connection pooling.** Use a pooled connection string
  (PgBouncer/Neon/Supabase pooler) on serverless, or connections will exhaust
  under load.
- **AI endpoints are long-running.** `/api/cos/chat`, `/api/cos/agents/run` and
  `/api/cos/reports` declare `maxDuration = 300`. On Vercel this needs a plan
  that permits 300-second functions; lower it if your plan does not.

## Backups

Back up PostgreSQL — it holds everything, including conversations, memory,
audit trail and generated reports. No state lives outside the database except
the environment configuration itself.

## Post-deploy checklist

- [ ] `/login` renders and a new account can register
- [ ] The first account lands on `/cos` as `OWNER`
- [ ] Settings → Business shows the right name and currency
- [ ] Settings → Integrations shows real statuses (unconfigured ones read NOT CONNECTED)
- [ ] `POST /api/cos/notifications/refresh` returns a count
- [ ] A daily briefing generates
- [ ] With a key set: the Chief of Staff answers and its tool calls appear in the audit log
