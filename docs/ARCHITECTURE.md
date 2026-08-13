# Architecture

MOSH Chief of Staff (M-CoS) is an executive operating system for MOSH Digital
Studios. It is built as a new surface inside an existing Next.js application —
it shares the database, authentication and build with the AI Income Academy
learning platform, and adds its own routes, data model and UI shell.

## Layers

```
┌──────────────────────────────────────────────────────────────────┐
│ UI            src/app/cos/**            React Server Components  │
│               src/components/cos/**     shared primitives        │
├──────────────────────────────────────────────────────────────────┤
│ HTTP API      src/app/api/cos/**        thin route handlers      │
│               src/lib/cos/api.ts        auth → limit → authorise │
├──────────────────────────────────────────────────────────────────┤
│ AI            src/lib/cos/ai/**         orchestrator, tools,     │
│                                         prompts, guard, client   │
├──────────────────────────────────────────────────────────────────┤
│ Business      src/lib/cos/services/**   all reads and writes     │
│ logic         src/lib/cos/scoring.ts    deterministic scoring    │
│               src/lib/cos/dashboard.ts  snapshot & briefing      │
├──────────────────────────────────────────────────────────────────┤
│ Data          prisma/schema.prisma      PostgreSQL via Prisma    │
└──────────────────────────────────────────────────────────────────┘
```

The dependency direction is strictly downward. In particular:

- **UI never touches Prisma for writes.** Server components read through the
  service layer; every mutation goes through the HTTP API.
- **The AI never touches Prisma.** It calls the same service functions the API
  calls, through the controlled tool layer (`src/lib/cos/ai/tools.ts`).
- **Services never read the session.** They take a `CosContext` and enforce
  ownership with it, which is why the same function is safe from a route
  handler, an AI tool call, a seed script or a test.

### Why the tenancy split

`src/lib/cos/tenancy.ts` holds `CosContext`, `assertOwned`, `assertPermission`
and `can` and imports nothing from Auth.js or Next.js. `src/lib/cos/context.ts`
builds a `CosContext` from a real session and re-exports the primitives. Services
depend on `tenancy`, route handlers depend on `context`. That keeps the session
machinery out of the business layer and lets the integration tests construct a
context directly.

## Request lifecycle

A write from the UI:

```
Browser  ──POST /api/cos/tasks──▶  proxy.ts (edge session gate)
                                    │
                                    ▼
                        route() in src/lib/cos/api.ts
                          1. requireCosContext()   ← 401 without a session
                          2. consumeRateLimit()    ← 429 when exceeded
                          3. assertPermission()    ← 403 for the wrong role
                                    │
                                    ▼
                        readJson(request, zodSchema)  ← 422 on bad input
                                    │
                                    ▼
                        services/tasks.ts createTask()
                          • assertOwned() on every foreign key
                          • write
                          • recomputeProjectHealth()
                          • recordAudit()
                                    │
                                    ▼
                              JSON response
```

An AI turn:

```
POST /api/cos/chat  ──▶  orchestrator.sendChatMessage()
                           │
                           ├─ buildContextBlock()  small snapshot + memory,
                           │                       memory wrapped as untrusted
                           ├─ toolsForContext()    tools filtered by role
                           └─ runLoop()            manual tool loop, max 8 rounds
                                 │
                                 └─ executeTool()  exists? permitted? valid?
                                       └─ services/*  ← the same code path as HTTP
```

## Key design decisions

**Scores are computed, not generated.** `src/lib/cos/scoring.ts` contains pure
functions for project health, task prioritisation, decision scoring, automation
scoring, weighted pipeline and goal pace. The AI quotes these numbers; it never
invents them. That is what makes the output auditable and what makes the whole
system testable without an API key.

**Reports work without AI.** `services/reports.ts` assembles a complete Markdown
report from database records first, then optionally asks the model to rewrite it
as an executive narrative. If the AI call fails, the data report is still stored
and the failure is noted in the body.

**Health is recomputed, never asserted.** `recomputeProjectHealth()` runs after
any change to a project, its tasks or its risks, so the dashboard cannot show a
stale indicator.

**Notifications are derived.** `src/lib/cos/notifications.ts` scans live state
and inserts alerts with a stable `dedupeKey` under a unique constraint, so the
scan is idempotent and can be run on a schedule or on demand.

**Integration status is computed from credentials.** An integration is only
`CONNECTED` when its required environment variables are actually present; the
server refuses to mark it connected otherwise. Nothing in the product can fake a
working integration.

## Performance

- The dashboard issues one batch of counts and small top-N slices
  (`getExecutiveSnapshot`), not table scans.
- List endpoints take and skip; the task list is paginated at the query layer.
- The AI context block carries counts and headline figures only — detail is
  fetched on demand through tools, so the context window never carries the whole
  database.
- Indexes cover every column used for filtering and sorting: see
  [DATABASE.md](./DATABASE.md).
- `/cos` routes are `force-dynamic` because every screen is per-user live data;
  static generation would be wrong here, not faster.

## Extension points

The following are deliberate seams, each isolated to one file:

| Extension | Where |
|---|---|
| Multi-tenant workspaces | `getActiveBusiness()` in `context.ts` — every table is already scoped by `businessId` |
| Semantic knowledge search | `searchKnowledge()` in `services/knowledge.ts` + the `embedding` column |
| New AI capability | one entry in `TOOLS` in `ai/tools.ts` |
| New specialist agent | one entry in `AGENT_SEEDS` in `ai/prompts.ts`, or created at runtime in the UI |
| New integration | one entry in `INTEGRATION_REGISTRY` in `services/integrations.ts` |
| New business area | database rows, no code change |
| Distributed rate limiting | `consumeRateLimit()` in `rate-limit.ts` |
