# Database

PostgreSQL, accessed through Prisma 7 with the `@prisma/adapter-pg` driver
adapter. The schema is `prisma/schema.prisma`; the generated client lands in
`src/generated/prisma`.

The file contains two products. Everything above the
`MOSH Chief of Staff` banner belongs to the AI Income Academy learning platform
and is untouched by M-CoS beyond back-relations added to `User`.

## Scoping rule

Every operational table carries `businessId` and cascades from `Business`.
Nothing is global. This is what makes the single-business product a multi-tenant
one without a migration.

## Entities

### Workspace

| Model | Purpose |
|---|---|
| `Business` | The workspace: name, currency, timezone, settings |
| `Membership` | `User` × `Business` with a `CosRole`; the authorisation record |
| `BusinessArea` | Service lines. Data, not code — add and retire them freely |

### Delivery

| Model | Purpose |
|---|---|
| `Project` | Client or internal work with budget, deadline, computed `completion` and `health` |
| `Milestone` | Dated checkpoints within a project |
| `ProjectRisk` | Open risks with severity and mitigation; feeds the health score |
| `ProjectMember` | People *and* AI agents assigned to a project |
| `Task` | The unit of work: status, priority, effort, tags, recurrence, origin |
| `TaskDependency` | Blocking edges; cycles are rejected at write time |

### CRM

| Model | Purpose |
|---|---|
| `Client` | An account, with status and a health note |
| `Contact` | People at a client |
| `Lead` | Pipeline entry with stage, estimated value, probability, next action |
| `Opportunity` | A tracked deal with expected close and outcome |
| `Proposal` | Documents sent against an opportunity |

### Direction

| Model | Purpose |
|---|---|
| `Goal` | Self-referencing tree across annual → daily horizons, with KPI and target |

### Products & marketing

| Model | Purpose |
|---|---|
| `Product` | Digital products through the idea → scale pipeline |
| `Campaign` | Marketing campaigns, optionally tied to a product |
| `ContentItem` | The content calendar, with performance figures |

### Knowledge

| Model | Purpose |
|---|---|
| `KnowledgeDocument` | Reference material, categorised and tagged. Carries an `embedding` column reserved for semantic search |
| `Memory` | Structured facts, unique on `(scope, key)` with source, confidence and expiry |

### AI

| Model | Purpose |
|---|---|
| `AIAgent` | The registry: prompt, capabilities, tool allow-list, model |
| `AgentExecution` | One agent run: objective, status, output, duration, error |
| `Conversation` / `Message` | Chief of Staff chat history |
| `AiUsage` | Per-request tokens and estimated cost |

### Money

| Model | Purpose |
|---|---|
| `FinanceEntry` | Revenue and expenses, tagged `REPORTED` / `CALCULATED` / `AI_ESTIMATE` |
| `Invoice` / `Payment` | Billing position and collections |

### Governance

| Model | Purpose |
|---|---|
| `ApprovalRequest` | PLAN → APPROVE → EXECUTE for sensitive actions |
| `AuditLog` | Who did what, when, with what result |
| `Notification` | Derived alerts, unique on `dedupeKey` |
| `Report` | Generated briefings and reports with their metrics snapshot |
| `Automation` | Logged processes with computed opportunity score |
| `Decision` | Scored opportunities with rationale |
| `Integration` | Per-provider status and non-secret configuration |

## Indexes

Every column used for filtering or sorting is indexed. The load-bearing ones:

```
Task          (businessId, status) (businessId, dueDate)
              (businessId, priority, status) (projectId) (assigneeId, status)
Project       (businessId, status) (businessId, deadline) (clientId)
Lead          (businessId, stage) (businessId, followUpAt)
Opportunity   (businessId, status) (businessId, stage) (businessId, expectedCloseAt)
Goal          (businessId, horizon, status) (businessId, deadline)
ContentItem   (businessId, status) (businessId, publishAt) (businessId, platform)
FinanceEntry  (businessId, kind, occurredAt) (businessId, occurredAt)
AuditLog      (businessId, createdAt) (businessId, entityType, entityId)
AiUsage       (businessId, createdAt) (businessId, agentKey)
```

## Uniqueness that carries meaning

| Constraint | Why |
|---|---|
| `Memory (businessId, scope, key)` | Re-recording a fact updates it instead of accumulating near-duplicates |
| `Notification (businessId, dedupeKey)` | The alert scan is idempotent and can run on a schedule |
| `Project / Product / KnowledgeDocument (businessId, slug)` | Stable URLs; the service layer generates a unique slug on collision |
| `AIAgent (businessId, key)` | Agents are addressed by a stable key, not an id |
| `Membership (businessId, userId)` | One role per person per workspace |

## Denormalisation

Two fields are stored rather than computed on read, because both are used in
list views and dashboards where recomputation would mean N queries:

- `Project.completion` and `Project.health` — recomputed by
  `recomputeProjectHealth()` after any change to the project, its tasks or its
  risks.
- `Automation.score` — recomputed on every write from the process inputs.

Nothing else is duplicated.

## Migrations

```bash
npm run db:migrate          # create and apply a migration in development
npx prisma migrate deploy   # apply pending migrations in production
npx prisma generate         # regenerate the client after a schema change
npm run db:seed             # workspace, areas, agent registry, demo data
npm run db:studio           # browse the data
```

The M-CoS migration is `prisma/migrations/20260813201052_mosh_chief_of_staff`.
It is additive: no existing academy table or column is altered.

## Seed behaviour

`npm run db:seed` is idempotent. It upserts the workspace, business areas,
agent registry, reference knowledge and pinned memories every time. Demo data
(clients, projects, tasks, leads, products, content, finance, automations) is
inserted **only when the workspace has no clients at all**, and every demo row
carries `isDemo: true`. Set `MCOS_SEED_DEMO=false` to skip it entirely.

No user account and no password is ever seeded — the first person to sign in
claims ownership.
