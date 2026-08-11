# AI Appointment Booking System

A single-file, offline mini app for designing a booking system an AI agent can be
trusted to run: a timezone-correct availability engine, the agent's system prompt and
tool definitions generated from your own services and policies, a conversation
simulator that books against the real engine, message templates counted in SMS
segments, and the wiring guide.

Open `index.html` in any modern browser — no install, no build step, no accounts, no
internet connection, and no data ever leaves the device.

## Why this app exists

"An AI books your appointments" is the easiest of the local-automation income streams
to sell and the easiest to get badly wrong, because it fails quietly. A booking agent
that invents a Tuesday looks exactly like one that checked. Nobody finds out until
somebody drives to an appointment that was never in the diary.

So this app inverts the usual emphasis. The prompt is not the product — the engine
underneath it is, and most of this page is about making the engine correct and then
generating the prompt, the tools and the messages from the same configuration, so they
cannot disagree with each other.

| Income stream | What it maps to here |
|---|---|
| #4 Local business automation | The whole app — clinics, salons, trades, studios |
| #6 Coaching & consulting | The coaching preset, with customers in other time zones |
| #3 Social media management | Bookings arriving by WhatsApp and Instagram DM |

Six presets — dental practice, salon, therapy practice, mobile trade, coaching,
fitness studio — chosen for the scheduling problems they differ on: capacity above
one, travel time as a buffer, a deposit policy, a customer four time zones away, and
a clinic where the right answer is often to refuse and hand over.

## What's in it

| Tab | What it does |
|---|---|
| ⚙️ **Setup** | Time zone, channels, and the policies everything else is generated from: grid, notice, horizon, hold, cancellation window, deposit |
| 🧰 **Services** | Durations, buffers, prices, places per slot, who delivers what, and the intake questions |
| 🗓 **Availability** | Working hours per resource, the live slot grid, the diary, and the engine's self-test |
| 🤖 **The agent** | The system prompt written from your configuration, eight guardrails with the reason each exists, and the escalation matrix |
| 🔧 **Tools & data** | Seven function definitions with your services as enum values, in OpenAI / Anthropic / plain JSON Schema form; the appointment record; a worked exchange |
| 💬 **Simulator** | A deterministic booking conversation driving the real engine, showing every tool call |
| ✉️ **Messages** | Ten templates with merge fields checked against the record and SMS segments counted |
| 📉 **No-shows** | What the empty chair costs, on your figures, with every assumption shown halved |
| 🧱 **Build it** | Three routes, six non-negotiables, the PostgreSQL constraint, and an eleven-point go-live list |
| 📄 **Spec** | The lot as one Markdown document |

## The engine is the point, and it is tested

Every slot on the page comes from one function, and the agent is given no other way to
know when anything is free. A start time is offered only when it lands on the grid
measured from local midnight, its buffered interval fits a working window, that
interval overlaps nothing already held or booked, it clears the minimum notice and the
horizon — and the local time actually exists.

Those rules are checked rather than asserted. **Run tests** on the Availability tab
generates configurations, produces every slot each one allows, books them greedily
until the diary is solid, and then looks for the thing that must never be true:

- Around **14,800 slots** checked against the invariants and **10,300 appointments**
  booked and inspected for collisions, across **320 configurations** — yours plus 240
  generated ones — in about **2.6 seconds** in the browser. The exact counts move a
  little from run to run, because one of the nine cases is your own configuration
  starting from the actual time now.
- No two appointments on one resource may overlap once buffers are included, unless
  they are places in the same class.
- Everything the engine offers must be bookable, and a time one minute off the grid
  must not be.
- A cancellation must give back exactly what the booking took — checked as the shape
  of the whole diary, not a count, because a slot with two staff or eleven places left
  legitimately survives being booked.
- The same question twice must get the same answer.

Failures name the seed that produced them, so a collision can be reproduced exactly.

## Clock changes are handled, not averaged

The two daylight-saving anomalies are the ones a booking system meets first:

- **The hour that doesn't exist.** On the morning the clocks go forward, start times in
  the missing hour are not offered. A system that offers them books people into a time
  no clock will ever show.
- **The hour that happens twice.** On the morning they go back, the room genuinely is
  free for both, so both are offered — as distinct instants, labelled with the zone
  abbreviation that tells them apart.

Both are verified against six real transitions in London, New York, Sydney and
Auckland: a fifteen-minute grid over a day that lost an hour must produce exactly four
fewer starts, and a day that gained one exactly four more.

Everything is stored as an instant. Nothing in the app stores a local time as a string,
and the appointment record on the Tools tab says why.

## The simulator is not a language model, and says so

It is a deterministic slot-filling machine parsing what a customer plausibly types —
"tomorrow afternoon", "next Tuesday at 3", a name, an email, "cancel my appointment" —
and calling the same engine the grid uses. Where it can't parse something it offers
buttons, which is what a real agent should do too.

What it tests is your configuration rather than a model's fluency: whether a booking
can be reached at all, how many turns it takes, and where a policy makes it stop. It
books into the same diary, so a slot taken in conversation closes on the grid.

Two behaviours are worth finding on purpose:

- Type something matching your own escalation rules — "my tooth is bleeding" — and it
  abandons the booking mid-flow. Escalation rules interact with intake questions far
  more often than anyone expects, and it is better to discover that here.
- When the write is refused because the time has gone, nothing is confirmed and
  alternatives are offered. That case is unreachable by prompt engineering; only the
  re-check inside `book_appointment` catches it.

## One emoji doubles your SMS bill

Templates are counted properly: GSM-7 with its extension characters at 160 per single
segment and 153 per concatenated one, falling back to UCS-2 at 70 and 67 the moment a
single character forces it. An emoji does it. So does a curly quote, and so does an em
dash — which is how the default templates in this app were originally written, and the
counter is what caught it.

Merge fields are checked against the actual appointment record, including the fields
your own intake questions add. An unresolved `{time}` is flagged before it is sent
rather than after.

## The numbers are yours

The No-shows tab does arithmetic on figures you enter and supplies no benchmarks. It
does not know what a reminder does to your no-show rate, and it does not pretend to:
the reduction is an input, marked as an assumption, and every result that leans on one
is shown again with the assumption halved. If the payback works at your figure and
never at half of it, the app says so and suggests measuring for a month first.

A blank stays blank. Anything needing a figure you haven't given shows a dash.

## What this proves and what it doesn't

It proves the engine on this page is correct. It proves nothing about the system you go
on to build, which is why the same invariants are written out on the Build tab as tests
to port, and why the six non-negotiables there are all about the database rather than
the prompt. The one that matters most: the availability re-check has to happen inside
the same transaction as the insert. A model cannot enforce that, and a prompt that
claims to is the most dangerous artefact in the system.

## Notes

- **Fully offline.** No external scripts, fonts, images, analytics or network requests
  of any kind. Verified with a browser run asserting zero non-`file://` requests.
- **Everything is saved** to `localStorage` as you type. `⬇ Back up` downloads the lot
  as JSON, `⬆ Restore` reads it back, and `🗑 Clear` backs up first, then wipes.
  Storage failures (private mode, `file://` restrictions) degrade to in-memory with a
  warning rather than breaking the app.
- **Light and dark**, following your system setting, with a manual toggle.
- **Accessible.** Real form controls throughout, every input labelled, arrow-key tab
  navigation, visible focus rings, live-region toasts, and all animation disabled under
  `prefers-reduced-motion`.
- **Responsive** to 390px with no horizontal page scroll on any of the ten tabs; wide
  tables and generated JSON scroll inside their own containers, and the sticky tab bar
  measures the masthead rather than assuming its height.
- **Printable.** The spec has print styles that drop the interface.
- **Exports** the system prompt as Markdown, tool definitions as JSON, the full
  specification as Markdown, and the configuration as JSON.

## What will go stale

The product names. Cal.com, Calendly, Twilio, n8n and the rest rearrange their APIs and
their pricing constantly, so the Build tab describes what each part of the system has
to *do* and names the products only as examples.

The scheduling arithmetic will not go stale. Buffers, capacity, holds and the overlap
test are the same problem they were before any of those products existed, and the two
daylight-saving anomalies are properties of clocks rather than of software.

## Deploying

It's one HTML file. Copy `index.html` anywhere — a USB stick, any static host, or
GitHub Pages. Served from this repo's root, the app lives at `/appointment-booking/`.
