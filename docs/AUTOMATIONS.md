# Automations

Moving repetitive work out of the founder's hands is the last step of the M-CoS
operating cycle, and the one the system is designed to keep returning to.

## How an opportunity is scored

`scoreAutomation()` in `src/lib/cos/scoring.ts` takes five inputs and produces a
score out of 100. The score is computed by the system, never by the AI.

| Input | Meaning |
|---|---|
| `frequencyPerMonth` | How many times the process runs |
| `minutesPerRun` | What it costs today, by hand |
| `minutesAfter` | What it would cost once automated |
| `complexity` | 1 trivial → 5 hard to build |
| `businessValue` | 1 low → 5 high |

```
monthlyHoursSaved = frequency × (before − after) / 60

time      = min(1, monthlyHoursSaved / 20)     50% weight
value     = (businessValue − 1) / 4            30% weight
ease      = (5 − complexity) / 4               20% weight

score     = round((time·0.5 + value·0.3 + ease·0.2) × 100)
rating    = ≥66 HIGH · ≥36 MEDIUM · else LOW
```

Twenty saved hours a month saturates the time component — beyond that, the
constraint is build effort and value, not more hours.

Edge cases are handled rather than assumed away: `minutesAfter` is clamped to
`minutesPerRun` so a saving is never negative, and a zero-frequency process
scores without dividing by zero.

## Detection

`GET /api/cos/automations/detect` finds candidates from real history, not from a
list of guesses:

1. **Recurring tasks.** Any task with a recurrence rule is repetitive by
   definition. Frequency comes from the rule (daily → 22/month, weekly → 4, and
   so on); effort comes from the recorded actual or estimated minutes.
2. **Repeated titles.** Any task title completed three or more times in the last
   500 completions is work being redone by hand. Effort is the average of the
   recorded minutes.

Candidates already logged as automations are excluded. Each carries its evidence
("Scheduled recurrence: weekly", "7 completed instances") so the founder can
judge the claim.

## Lifecycle

```
IDENTIFIED → EVALUATING → APPROVED → BUILDING → LIVE
                              └────────────────→ REJECTED
```

Analytics reports hours saved per month from `LIVE` automations and the hours
still available from everything not `LIVE` or `REJECTED`.

## Worked example — client onboarding

Seeded as demo data, and representative of the shape:

| | |
|---|---|
| Today | 60 minutes per client, 3 clients per month |
| Automated | 10 minutes per client |
| Complexity | 3 |
| Business value | 5 |
| **Saving** | **2.5 hours/month, 30 hours/year** |

The designed flow:

```
Signed proposal
   → create CRM record
   → generate proposal + deposit invoice
   → send welcome email                 (approval-gated: client communication)
   → create project and milestones
   → create client folder
   → send onboarding checklist          (approval-gated: client communication)
```

Note what stays human: both outbound communications are sensitive actions and go
through PLAN → APPROVE → EXECUTE. Automation removes the assembly, not the
judgement.

## Where automations run

M-CoS holds the *design and the score*; execution belongs to the tool that owns
the credentials:

- **In-app** — recurring tasks materialise their next occurrence on completion;
  the notification scan and report generation are idempotent and can be run on a
  schedule (see [DEPLOYMENT.md](./DEPLOYMENT.md) → Scheduled jobs).
- **External** — Zapier, Make and n8n call the M-CoS API. Set
  `MCOS_WEBHOOK_SECRET` and mark the integration connected in Settings.

## Adding an automation to the registry

```bash
curl -X POST /api/cos/automations -H 'content-type: application/json' -d '{
  "name": "Weekly client status updates",
  "process": "Each active client gets a hand-written Friday update pulled from the project board.",
  "trigger": "Friday 15:00",
  "steps": ["Pull project progress", "Draft update per client", "Founder approves", "Send"],
  "frequencyPerMonth": 4,
  "minutesPerRun": 60,
  "minutesAfter": 15,
  "complexity": 3,
  "businessValue": 4,
  "tooling": "M-CoS report generator + Gmail"
}'
```

The response carries the computed score, rating and hours saved. Sending a score
in the request has no effect — it is always recomputed.
