# Testing

```bash
npm test              # unit + integration (integration skips without DATABASE_URL)
npm run test:watch
npm run test:unit     # unit only, no database needed
npm run lint
npm run typecheck
npm run build
```

## Layout

| Path | Needs a database | Covers |
|---|---|---|
| `tests/unit/scoring.test.ts` | no | Project health, task prioritisation, decision scoring, automation scoring, weighted pipeline, goal pace |
| `tests/unit/security.test.ts` | no | Role permissions, prompt-injection guard, rate limiting, error redaction, input validation |
| `tests/integration/services.test.ts` | yes | Task/project/CRM/knowledge/memory/automation services, tenancy isolation, notifications, dashboard, briefing |
| `tests/integration/ai-tools.test.ts` | yes | Tool exposure by role, tool execution, permission denial, approval gating, agent routing |

Integration tests connect to a real PostgreSQL database so constraints,
cascades and the query layer are genuinely exercised. They call
`describe.skip` when `DATABASE_URL` is unset, so `npm test` always runs.

Each integration test creates its own `Business` + owner via
`createWorkspace()` and deletes it afterwards, so tests never see each other's
data and the suite is safe to re-run against a database that already has records.

## Running the integration suite locally

```bash
# Any PostgreSQL will do. Example with Docker:
docker run -d --name mcos-test -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres:16
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres"
npx prisma migrate deploy
npm test
```

## What is deliberately covered

Failure paths are tested, not just happy paths:

- **Tenancy** — reading, updating and foreign-key-linking another workspace's
  records all fail with 404 rather than leaking existence.
- **Dependency cycles** — a task cannot depend on itself, and a cycle across two
  tasks is rejected before it is written.
- **Authorisation** — a `VIEWER` cannot see write tools, and a write tool called
  with a viewer context is refused *and* the denial is written to the audit log,
  with the record confirmed absent afterwards.
- **AI input handling** — unknown tool names, invalid arguments and service
  errors all return error results rather than throwing.
- **Approval gating** — the sensitive-action tool creates a `PENDING` request and
  reports that nothing was performed.
- **Computed-not-asserted** — the decision tool's score comes from the scorer, not
  from the caller; the automation score is recomputed on every write.
- **Error redaction** — an error whose message contains a connection string
  produces a response body that does not.
- **Edge cases in scoring** — zero frequency, negative saving, out-of-range
  probabilities and factor values, missing targets and deadlines.

## What is not covered

- **Live Anthropic round-trips.** The tool layer, routing, permissions and
  degradation are tested; the model call itself is not, because it needs a real
  API key and would make the suite non-deterministic and costly. Verify it by
  hand after deploying (DEPLOYMENT.md → post-deploy checklist).
- **Browser interaction.** There is no Playwright suite. Screens were verified
  by rendering every authenticated route against a seeded database in a
  production build.
- **Provider API calls for integrations**, which are not implemented — only the
  registry, status computation and configuration surface are.

## Adding tests

Unit tests belong next to the pure logic they exercise; anything that touches
Prisma belongs in `tests/integration` and must create its own workspace:

```ts
const workspace = await createWorkspace("My Case");
try {
  // …
} finally {
  await destroyWorkspace(workspace);
}
```

Use `withRole(workspace, "VIEWER")` to test an authorisation boundary without
creating a second user.
