# Security

## Authentication

Auth.js (NextAuth v5) with a JWT session strategy, backed by the Prisma adapter.
Credentials are bcrypt-hashed; Google sign-in is enabled only when both
`GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are present.

`src/proxy.ts` gates `/cos/**` and `/api/cos/**` at the edge. That is a
convenience, not the security boundary: `src/app/cos/layout.tsx` re-checks the
session, and every route handler resolves the context server-side. A
misconfigured matcher cannot expose business data.

## Authorisation

Roles are M-CoS-specific and stored on `Membership`, separate from the learning
platform's `User.role`.

| Role | Intent |
|---|---|
| `OWNER` | The founder. Full access including settings, finance writes, the audit log and approvals. |
| `MANAGER` | Runs operations. Cannot change settings, write finance, or read the audit log. |
| `MEMBER` | Employee or contractor. Reads most things; writes tasks, content and knowledge. |
| `VIEWER` | Read-only. |
| `CLIENT` | Reserved for a future client portal: reads only projects, tasks and reports. |

Permissions are `<resource>:<action>` strings resolved in
`src/lib/cos/access.ts`. **The same check governs a human and the AI acting on
that human's behalf** — `toolsForContext()` filters the tool list by role, and
`executeTool()` re-checks before running, so an AI request can never exceed the
authority of the person who made it.

**The first user to reach M-CoS becomes OWNER; every subsequent account joins as
VIEWER** and must be promoted deliberately. New sign-ups never gain write access
silently. The last active owner cannot be demoted.

## Tenancy

Every operational table carries `businessId`. Single-record access goes through
`assertOwned()`, which treats a record from another workspace as a 404 — the
same response as a record that does not exist, so ids cannot be probed.
Foreign keys supplied by a caller (`projectId`, `clientId`, `goalId`, …) are
validated against the caller's workspace before any write.

Covered by tests: cross-workspace read, update and foreign-key linking all fail.

## Input validation

Every request body is parsed with a zod schema before it reaches the database
(`src/lib/cos/schemas.ts`). Client-side validation is a UX convenience only.
Query strings are parsed the same way. Free text is length-capped at the schema
level; oversized input is rejected, never truncated silently.

## Rate limiting

A token-bucket limiter (`src/lib/cos/rate-limit.ts`) is applied per user per
surface: 20/min for AI chat, 10/min for agent runs, 120/min for writes, 600/min
for reads.

**Scope:** this protects a single Node process, which is the right level for a
single-tenant deployment. For a multi-instance deployment, back the bucket with
Redis — only `consumeRateLimit()` changes; no call site does.

## Secrets

- API keys, database credentials and integration tokens are read from the server
  environment only. None is exposed to the browser, and none is written to the
  database — `Integration.config` stores non-secret configuration only.
- System prompts are server-side; the agent detail screen shows them to the
  owner as an editable configuration surface, not to unauthenticated users.
- An integration cannot be marked `CONNECTED` unless its required environment
  variables are actually present. Status is computed from credentials on every
  read, so a stale `CONNECTED` row is downgraded automatically.

## Error handling

`toErrorResponse()` is the single exit path for errors. Known `AppError`s carry
a safe message and status. Anything else is logged server-side and replaced with
a generic 500 body — stack traces, driver errors and connection strings never
reach the client. Zod failures become a 422 with field-level detail.
The `/cos` error boundary shows an actionable message and a digest reference.

Covered by tests: an error whose message contains a connection string produces a
body that does not.

## PLAN → APPROVE → EXECUTE

The AI must not take irreversible external action. These are the gated actions:

- sending client communications
- publishing content
- changing pricing
- making financial commitments
- deleting important data
- changing critical business settings

The only path to any of them is `request_approval`, which creates an
`ApprovalRequest` in `PENDING` and returns a result stating explicitly that
nothing was performed. The founder approves or rejects in Settings → Approvals,
carries the action out, and marks it executed — which records a named person
against every irreversible step. Requests expire after 7 days.

## Prompt injection

Retrieved content is always DATA, never INSTRUCTIONS. See
[AI_ARCHITECTURE.md](./AI_ARCHITECTURE.md) → Prompt-injection defences for the
mechanism, and `tests/unit/security.test.ts` for the coverage.

## Audit logging

Every mutation, agent run, tool call, approval decision and integration change
writes an `AuditLog` row: timestamp, actor kind (`USER` / `AI` / `AGENT` /
`SYSTEM`), actor, action, object, result and detail. Denied AI tool calls are
logged as `DENIED`. Owners read the trail in Settings. Audit writes never throw —
a logging failure cannot break the operation it records.

## Known limitations

- Rate limiting is per-process (see above).
- There is no CSRF token on the JSON API beyond Auth.js's own protection of the
  session cookie; the API is same-origin and `SameSite` cookies carry the
  session. Add a token if you expose the API cross-origin.
- Approval execution is recorded, not performed — M-CoS deliberately does not
  hold the credentials needed to send on the founder's behalf.
- No field-level encryption at rest; rely on the database's encryption.
