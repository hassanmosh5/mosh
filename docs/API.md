# API reference

All endpoints live under `/api/cos` and require an authenticated session. Every
handler is built with `route()` from `src/lib/cos/api.ts`, which enforces
authentication → rate limiting → authorisation in that order before any work
happens.

## Conventions

**Request** — JSON bodies only. Collections return `{ "items": [...] }`; single
resources return the object.

**Errors** — one shape everywhere:

```json
{
  "error": {
    "code": "validation_failed",
    "message": "Some of the information you sent is not valid.",
    "details": [{ "path": "title", "message": "Too small: expected string to have >=1 characters" }]
  }
}
```

| Status | Code | Meaning |
|---|---|---|
| 400 | `invalid_json`, `bad_request` | Malformed body |
| 401 | `unauthorized` | No session |
| 403 | `forbidden` | Role lacks the permission |
| 404 | `not_found` | Missing, or belongs to another workspace |
| 409 | `conflict`, `missing_credentials`, `already_decided`, `last_owner` | State conflict |
| 422 | `validation_failed` | Schema failure, with `details` |
| 429 | `rate_limited` | Bucket exhausted |
| 502/503 | `ai_provider_error`, `service_unavailable` | AI provider unavailable or unconfigured |
| 500 | `internal_error` | Logged server-side; body carries no detail |

**Rate limits** — per user: AI chat 20/min, agent runs 10/min, writes 120/min,
reads 600/min.

## Endpoints

### Tasks — `task:read` / `task:write` / `task:delete`

| Method | Path | Notes |
|---|---|---|
| GET | `/api/cos/tasks` | Query: `status`, `priority`, `projectId`, `clientId`, `assigneeId`, `search`, `overdue`, `dueBefore`, `take`, `skip`. Returns `{items, total}` |
| POST | `/api/cos/tasks` | `title` required; optional project/client/goal links, `dependsOnIds` |
| GET | `/api/cos/tasks/{id}` | |
| PATCH | `/api/cos/tasks/{id}` | Completing a recurring task spawns the next occurrence |
| DELETE | `/api/cos/tasks/{id}` | |

### Projects — `project:*`

| Method | Path | Notes |
|---|---|---|
| GET | `/api/cos/projects` | |
| POST | `/api/cos/projects` | Slug generated; health computed |
| GET/PATCH/DELETE | `/api/cos/projects/{id}` | |
| POST | `/api/cos/projects/{id}/milestones` | |
| POST | `/api/cos/projects/{id}/risks` | Recomputes project health |

### CRM — `crm:*`

| Method | Path |
|---|---|
| GET/POST | `/api/cos/clients`, `/api/cos/contacts`, `/api/cos/leads`, `/api/cos/opportunities` |
| GET | `/api/cos/clients/{id}` |
| PATCH/DELETE | `/api/cos/{clients,contacts,leads,opportunities}/{id}` |

### Goals — `goal:*`

`GET/POST /api/cos/goals`, `GET/PATCH/DELETE /api/cos/goals/{id}`.
The list response carries computed `progress`, `atRisk` and `expectedPct`.

### Content & products — `content:*` / `product:*`

`GET/POST /api/cos/content`, `GET/PATCH/DELETE /api/cos/content/{id}`,
`GET/POST /api/cos/products`, `GET/PATCH/DELETE /api/cos/products/{id}`.

### Knowledge & memory — `knowledge:*` / `memory:*`

`GET/POST /api/cos/knowledge`, `GET/PATCH/DELETE /api/cos/knowledge/{id}`,
`GET/POST /api/cos/memory` (POST upserts on `scope`+`key`),
`PATCH/DELETE /api/cos/memory/{id}`.

### Automations & decisions — `automation:*`

| Method | Path | Notes |
|---|---|---|
| GET/POST | `/api/cos/automations` | Score is computed server-side from the inputs |
| GET/PATCH/DELETE | `/api/cos/automations/{id}` | |
| GET | `/api/cos/automations/detect` | Candidates detected from recurring and repeated task history |
| GET/POST | `/api/cos/decisions` | POST returns the computed score and verdict |
| DELETE | `/api/cos/decisions/{id}` | |

### Finance — `finance:read` / `finance:write`

`GET/POST /api/cos/finance/entries`, `DELETE /api/cos/finance/entries/{id}`,
`GET/POST /api/cos/finance/invoices`.

### Analytics & reports

| Method | Path | Permission |
|---|---|---|
| GET | `/api/cos/analytics` | `analytics:read` |
| GET | `/api/cos/reports` | `report:read` |
| POST | `/api/cos/reports` | `report:write` — body `{kind, periodStart?, periodEnd?}`. Works without an AI key (data-only) |

### AI

| Method | Path | Permission | Notes |
|---|---|---|---|
| POST | `/api/cos/chat` | `agent:run` | `{message, conversationId?}` → `{conversationId, reply, toolCalls}` |
| GET | `/api/cos/chat/conversations` | `agent:read` | |
| GET/POST | `/api/cos/agents` | `agent:read` / `agent:write` | POST upserts by key |
| GET/PATCH | `/api/cos/agents/{key}` | | |
| POST | `/api/cos/agents/run` | `agent:run` | `{objective, agentKey?}` → `{agents, synthesis}` |

Both AI endpoints return `503` with an actionable message when
`ANTHROPIC_API_KEY` is not set.

### Governance

| Method | Path | Permission | Notes |
|---|---|---|---|
| GET | `/api/cos/approvals` | `approval:read` | |
| PATCH | `/api/cos/approvals/{id}` | `approval:decide` | `{decision: "APPROVED"\|"REJECTED", note?}` |
| POST | `/api/cos/approvals/{id}` | `approval:decide` | Mark an approved request executed |
| GET | `/api/cos/notifications` | `notification:read` | |
| POST | `/api/cos/notifications/refresh` | `notification:write` | Idempotent rescan |
| PATCH | `/api/cos/notifications/{id}` | `notification:write` | Mark read |
| GET | `/api/cos/search?q=` | `task:read` | Global search across nine entity types |

### Settings

| Method | Path | Permission |
|---|---|---|
| PATCH | `/api/cos/settings/business` | `settings:write` |
| GET/POST | `/api/cos/settings/areas` | `settings:read` / `settings:write` |
| PATCH | `/api/cos/settings/members/{id}` | `settings:write` — refuses to demote the last owner |
| GET | `/api/cos/integrations` | `integration:read` |
| PATCH | `/api/cos/integrations/{provider}` | `integration:write` — refuses `CONNECTED` without credentials |

## Example

```bash
curl -X POST https://your-host/api/cos/tasks \
  -H 'content-type: application/json' \
  -b 'authjs.session-token=…' \
  -d '{
        "title": "Chase Adom Fashion for product photography",
        "priority": "CRITICAL",
        "dueDate": "2026-08-20",
        "clientId": "clx…"
      }'
```
