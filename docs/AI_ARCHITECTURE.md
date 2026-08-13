# AI architecture

The AI layer is deliberately small in surface area and strict in what it may do.
Its job is to read the business accurately, reason about it, and write internal
records — never to act on the outside world.

## Components

| File | Responsibility |
|---|---|
| `src/lib/cos/ai/client.ts` | Anthropic client, model/effort resolution, usage + cost recording, error mapping |
| `src/lib/cos/ai/prompts.ts` | The Chief of Staff prompt and the 13 specialist agent definitions |
| `src/lib/cos/ai/tools.ts` | The complete set of functions the model may call |
| `src/lib/cos/ai/guard.ts` | Untrusted-content fencing and injection detection |
| `src/lib/cos/ai/orchestrator.ts` | The tool loop, chat, agent routing, agent execution, synthesis |

## Model configuration

Requests use `claude-opus-5` with adaptive thinking and an effort level of
`high`, both overridable with `MCOS_MODEL` and `MCOS_EFFORT`. Sampling
parameters are not sent — this model family rejects them, and behaviour is
steered through the prompt instead.

The loop is capped at **8 tool rounds** and **12,000 output tokens** per request.
A confused model cannot spend the founder's budget in a runaway cycle; when the
cap is reached the user is told plainly and asked to narrow the question.

## The tool layer

The model has no database access. It can only call the functions declared in
`TOOLS`, each of which passes three gates in order:

1. **Existence** — an unknown tool name returns an error result, not a crash.
2. **Permission** — the caller's role must grant the tool's permission. A denial
   is written to the audit log with `result: DENIED`.
3. **Validation** — arguments are parsed with the same zod schemas the HTTP API
   uses. A failure returns field-level detail so the model can correct itself.

Failures are returned *to the model* as tool results rather than thrown, so one
bad call does not collapse the turn.

### Read tools

`get_dashboard`, `get_tasks`, `get_projects`, `get_project`, `get_clients`,
`get_client`, `get_leads`, `get_sales_pipeline`, `get_goals`, `get_products`,
`get_content_calendar`, `get_financials`, `get_automation_opportunities`,
`get_agents`, `search_knowledge`, `get_memories`.

### Write tools

`create_task`, `update_task`, `create_project`, `create_content_item`,
`create_product`, `create_automation`, `update_lead`, `save_memory`,
`score_decision`.

All writes go through the service layer, so ownership checks, health
recomputation and audit logging happen exactly as they do for a human.

### The one sensitive tool

`request_approval` is the only route to a high-impact action, and it does not
perform one. It creates an `ApprovalRequest` and returns a result that says
explicitly that nothing was done. See [SECURITY.md](./SECURITY.md) →
PLAN → APPROVE → EXECUTE.

## Context strategy

`buildContextBlock()` assembles a compact block for every turn:

- A JSON summary of the executive snapshot: counts, health, pipeline, finance,
  content, goals. Roughly 400 tokens.
- Up to 15 high-confidence company/strategic/operational memories, fenced as
  untrusted data.

Detail is fetched on demand through tools. The entire database is never sent to
the model. Conversation history is capped at the last 30 turns.

## Prompt-injection defences

Business records contain text written by clients, contractors and imports. The
rule enforced in `guard.ts` is that retrieved content is always DATA:

- Every retrieved block is wrapped in `<untrusted_data source="…">…</untrusted_data>`.
- Closing tags inside the payload are replaced with `[removed-tag]`, so the fence
  cannot be escaped.
- Control characters are stripped.
- Seven injection patterns (instruction override, system-prompt extraction,
  persona replacement, guardrail disabling, …) are detected; a match adds an
  explicit note telling the model to treat the block as data and to say that it
  ignored the instruction.
- The system prompt states the DATA/INSTRUCTIONS distinction directly.

## Agent orchestration

```
objective ──▶ selectAgents()          keyword pre-filter over the registry
                    │                 (deterministic, explainable, small)
                    ▼
              runAgent() × n          each with its own prompt + tool allow-list
                    │                 sequential, so a burst cannot trip the
                    ▼                 provider's rate limit mid-orchestration
              synthesis turn          Chief of Staff combines the outputs,
                                      resolving contradictions explicitly
```

Every run creates an `AgentExecution` row (objective, status, output, duration,
error) so agent activity is inspectable after the fact. A single selected agent
skips the synthesis turn — there is nothing to combine.

Agent prompts live in `prompts.ts` as the versioned source of truth and are
seeded into the `AIAgent` table, where the founder can edit them at runtime. The
application always reads the database copy.

## Cost tracking

Every request writes an `AiUsage` row: model, purpose, agent, conversation,
input/output/cache tokens and an estimated cost priced from the published list
rates in `constants.ts`. This is an **estimate for the internal dashboard**, not
a billing record — Analytics labels it as such. Recording never throws; a
failure to log usage cannot break a user's request.

## Degradation

`isAiConfigured()` is checked at every entry point. Without `ANTHROPIC_API_KEY`:

- The chat console and agent runner render with a clear banner and disabled
  inputs.
- `POST /api/cos/chat` and `/api/cos/agents/run` return `503` with an actionable
  message.
- Report generation still works and produces the data-only report.

Provider failures are mapped to specific errors in `toAiError()`: rate limits to
`429`, auth failure and unreachability to `503`, other API errors to `502`. The
underlying SDK error is logged server-side and never returned to the client.
