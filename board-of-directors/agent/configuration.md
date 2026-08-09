# Agent configuration

The same board as a hosted AI agent. Everything here is copy-paste — there is
no build step and no code.

`instructions.txt` is the system prompt. It is the *same text* the app sends in
AI mode, plus an intake section for users who arrive without a structured
brief. Keep the two in sync if you edit one: the app's copy lives in the
`SYSTEM_PROMPT` constant in `../index.html`.

---

## ChatGPT — custom GPT

**Configure tab**

| Field | Value |
|---|---|
| Name | CLEAR AI Board of Directors |
| Description | Fifteen directors debate your decision, quantify the risk, and return a verdict — including "no". Not a cheerleader. |
| Instructions | paste the whole of `instructions.txt` |
| Conversation starters | see below |
| Knowledge | upload `knowledge/board-method.md` |
| Capabilities | Web browsing **on**, Code Interpreter **on** (it does the arithmetic reliably), DALL·E **off** |
| Actions | none |

**Conversation starters**

```
Convene the board on a decision I'm stuck on
Should I launch this product? Here are my numbers…
Tell me what's wrong with my business plan
I have $5,000 and 20 hours a week. What should I not do?
```

Code Interpreter matters more than it looks. Language models are unreliable at
compounding a 36-month cash simulation in their head; with the interpreter on,
the board's arithmetic is arithmetic rather than plausible-looking digits.

---

## Claude — Project

Create a Project, paste `instructions.txt` into **Project instructions**, and
add `knowledge/board-method.md` to the Project knowledge. No other setup.

## Gemini — Gem

New Gem → paste `instructions.txt` into Instructions. Gemini truncates very
long instructions on some tiers; if it does, drop the INTAKE section and keep
the seats, the arithmetic and the blocking findings.

## API — any provider

Send `instructions.txt` as the system prompt and the user's brief as the first
user message. The app's **🤖 AI mode → Build the board prompt** produces a
correctly structured user message with the figures and their evidence tags
already laid out; it is the reference format.

Recommended settings:

```
temperature   0.6      lower makes the directors converge, which defeats the point
max tokens    8000     a full fifteen-seat report does not fit in less
```

---

## Selling this as a product

Three things ship independently, and they price differently:

| What you sell | Contains | Where |
|---|---|---|
| The app | `index.html` alone — offline, no key, no account | Gumroad, Payhip, Lemon Squeezy, Etsy (digital download) |
| The agent | `instructions.txt` + `configuration.md` + knowledge file | The same stores; also list the GPT in the GPT Store |
| Both | the whole folder + `README.md` | Priced as the bundle; this is the version that converts |

The app is the part with no substitute — it runs without an API key, without an
account, and without a network, which is exactly what a buyer in a market with
metered data and unreliable power actually needs. The agent pack is the part
that is easy to demo. Sell the demo, deliver the tool.

Read the "Selling it" section of `../README.md` before listing. It covers
licensing, what you may and may not claim, and the disclaimer that has to
appear on the listing itself rather than only inside the product.
