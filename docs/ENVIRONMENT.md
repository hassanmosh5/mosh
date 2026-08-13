# Environment variables

Copy `.env.example` to `.env` and fill in what you need. Every variable listed
here is read on the server only — none reaches the browser, and none is written
to the database.

## Required

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string. Use a pooled string on serverless. |
| `AUTH_SECRET` | Session signing secret for Auth.js. `openssl rand -base64 32`. |

## AI

| Variable | Default | Purpose |
|---|---|---|
| `ANTHROPIC_API_KEY` | — | Enables the Chief of Staff, agent runs and the AI narrative on reports. Everything else works without it. |
| `MCOS_MODEL` | `claude-opus-5` | Model used for chat, agents and report narration. |
| `MCOS_EFFORT` | `high` | `low` \| `medium` \| `high` \| `xhigh` \| `max`. Lower it to cut cost and latency. |

## Workspace

| Variable | Default | Purpose |
|---|---|---|
| `MCOS_BUSINESS_SLUG` | `mosh-digital-studios` | Which workspace this deployment serves. |
| `MCOS_BUSINESS_NAME` | `MOSH Digital Studios` | Name used when the workspace is first created. |
| `MCOS_SEED_DEMO` | `true` | Set to `false` to seed the workspace and agent registry without demo data. |

## Auth

| Variable | Purpose |
|---|---|
| `AUTH_URL` | Public URL. Required when it cannot be inferred (self-hosting, preview deployments). |
| `AUTH_TRUST_HOST` | Set to `true` behind a reverse proxy. |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Both required for the Google sign-in button to appear. |

## Learning platform (shared codebase)

| Variable | Purpose |
|---|---|
| `OPENAI_API_KEY` | AI Income Academy tutor. Unrelated to M-CoS. |
| `OPENAI_TUTOR_MODEL` | Defaults to `gpt-4o-mini`. |

## Integrations

An integration reads **NOT CONNECTED** until every variable it needs is present
on the server. The status is computed on each read, so removing a credential
downgrades it automatically — the UI cannot claim a connection that does not
exist.

| Integration | Required variables |
|---|---|
| Google Calendar | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALENDAR_REFRESH_TOKEN` |
| Gmail | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GMAIL_REFRESH_TOKEN` |
| Google Drive | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_DRIVE_REFRESH_TOKEN` |
| Google Sheets | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_SHEETS_REFRESH_TOKEN` |
| WhatsApp Business | `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_ACCESS_TOKEN` |
| Facebook Pages | `FACEBOOK_PAGE_ID`, `FACEBOOK_ACCESS_TOKEN` |
| Instagram | `INSTAGRAM_ACCOUNT_ID`, `FACEBOOK_ACCESS_TOKEN` |
| LinkedIn | `LINKEDIN_ORGANIZATION_ID`, `LINKEDIN_ACCESS_TOKEN` |
| YouTube | `YOUTUBE_CHANNEL_ID`, `YOUTUBE_API_KEY` |
| Shopify | `SHOPIFY_STORE_DOMAIN`, `SHOPIFY_ADMIN_TOKEN` |
| Paystack | `PAYSTACK_SECRET_KEY` |
| Selar | `SELAR_API_KEY` |
| Gumroad | `GUMROAD_ACCESS_TOKEN` |
| Zapier / Make / n8n | `MCOS_WEBHOOK_SECRET` |

> **Status quo:** the integration *interfaces, configuration surface and status
> reporting* are implemented. The provider API calls behind them are not — see
> the Known limitations section of the README. Nothing in the product pretends a
> disconnected integration succeeded.

## Handling rules

- Never commit `.env`. It is already in `.gitignore`.
- Rotate `AUTH_SECRET` only when you are willing to invalidate every session.
- Store production values in your host's secret manager, not in a file.
- `.env.example` must never contain a real value.
