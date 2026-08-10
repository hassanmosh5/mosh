# AI Website + CRM Automation

A single-file, offline mini app that turns one business into a buildable plan: the site
page by page, the CRM pipeline stage by stage, the fields, the automations, the tool stack
with its running cost, the message templates — and, for every automation, whether your
actual volume pays for building it.

Open `index.html` in any modern browser — no install, no build step, no accounts, no
internet connection, and no data ever leaves the device.

## Why this app exists

"Website and CRM automation" is the most saleable service in this repo — income stream #4,
local automation, plus most of what an agency actually delivers. It's also where the
largest amount of confident nonsense lives: build lists of forty automations, tool stacks
priced like an enterprise, and payback claims nobody has ever checked.

So this app inverts the usual order. It picks the recipes for a business model, then
prices each one against your volume and your hourly rate, and tells you which ones you
should not build yet. At thirty enquiries a month most of a forty-automation build list is
a hobby.

| Business model | What its funnel is |
|---|---|
| 📍 Local service business | Enquiry → quote → job → invoice → review |
| 🧩 Agency / done-for-you | Enquiry → call → proposal → retainer |
| 🎯 Coaching & consulting | Lead magnet → call → package |
| 🛒 E-commerce shop | Cart → order → delivery → repeat |
| 💾 Digital products & prompt packs | List → launch → buy → buy again |
| 🔁 Membership / subscription | Trial → active → at risk → renewed |
| ⚖️ Professional services | Enquiry → consultation → engagement |

Seven models across **23 pipeline stages, 15 page types, 52 CRM fields, 36 automation
recipes, 11 message sequences (27 messages), 12 stack layers with 44 tools and 35 launch
checks**. Each model gets its own slice — a local business sees 13 stages, 26 automations
and 6 sequences; a digital-products business sees 5 stages, 15 automations and 4.

## What's in it

| Tab | What it does |
|---|---|
| ⚙️ **Setup** | Business model, volume, conversion rate, average value, your hourly rate. Everything else is computed from these five |
| 🗺 **Site plan** | Each page: its one job, its one action, sections in order, what to track, the usual mistake, and a CLEAR-structured copy brief with your details already in it |
| 🧭 **Pipeline** | Each stage: what it means, entry and exit rules, the clock, the owner, required fields, and where it goes wrong |
| 🗃 **CRM fields** | The schema, with what fills each field, which automations and messages depend on it, and a CSV to import |
| 🤖 **Automations** | 36 recipes — trigger, conditions, actions, failure mode, guard — each with its own payback arithmetic and an editable minutes-saved figure |
| 🔌 **Stack & cost** | 12 layers, a default per tier, every price editable, usage-priced lines computed from your own selection, and the integration map |
| ✉️ **Messages** | The sequences the automations send, with every merge field checked against the fields you actually collect |
| 🧱 **Build order** | Dependency-first, payback-second, in four phases, with a running time total |
| ✅ **Launch checks** | 35 tests filtered to what you're building, grouped by the kind of failure they catch |
| 📄 **Spec** | The lot as Markdown, JSON, or CSV, plus a system build prompt |

## The rule the whole thing rests on

**An automation is only worth building above a certain volume, and the app computes
yours.** Every recipe carries an estimate of the minutes of human work one run replaces,
how often it runs (per enquiry, per customer, per week, per month) and what fraction of
those it applies to. Multiply by your volume and your hourly rate and you get hours back,
what they're worth, and how many weeks the build takes to earn itself back.

Recipes that don't pay at your volume are hidden by default, and shown on request with the
volume each would need — which is the more useful number when you're deciding what to grow
into. The whole selection has a break-even volume too: the point where the time saved
covers the monthly stack.

The minutes-per-run figures are ours, and they are all editable inside each recipe. Change
the ones you disagree with; the payback, the ordering and the break-even volume all follow.

## What it refuses to compute

Roughly a quarter of the recipes — abandoned checkout, reactivation, referrals, welcome
sequences, repeat-purchase reminders — don't save time. Nobody was doing them by hand; the
alternative was not doing them at all. Their return is recovered revenue, which depends on
your offer, your list and your luck.

The app will not guess at that. Those recipes are marked **"pays in revenue — measure
it"** and carry a specific measurement instruction instead of a fabricated figure. For
abandoned checkout: *tag the orders that arrive from a recovery link; recovered revenue
minus the discount you gave away is the whole number — and the discount line is the one
people forget to subtract.*

The same restraint applies to the one revenue figure on the Setup tab. "Enquiries lost to
slow replies" is an assumption you type, multiplied by your own conversion rate and job
value, and it is labelled as arithmetic on a guess everywhere it appears — with the
instruction to go and count for a month if you want to know.

## The plan checks itself

The content is hand-written, and hand-written data drifts: a stage that requires a field
its model doesn't keep, an automation that references a stage that doesn't exist in a
funnel, a message merging `{{plan}}` into an email for a business that has no plans.

So the app asserts its own consistency at load, across all seven models, and prints the
result on the Spec tab. **1,933 assertions**, checking that every stage's required fields
exist for that model, every automation lands on a stage that model has, every field it
touches is one that model keeps, every dependency is available, every revenue-side recipe
carries a measurement instruction, and every merge token in every message resolves to a
real field.

That check found **46 genuine defects** on its first run — `{{plan}}` and `{{mrr}}` in a
failed-payment recipe aimed at shops as well as subscriptions, a referral automation
depending on a review stage that digital products didn't have, a weekly report reading
invoice dates for a business that doesn't invoice. Fixing them properly, rather than by
deleting the check, is what produced the two mechanisms behind it: fields marked `?optional`
are touched only on models that keep them, and a dependency on a recipe a model doesn't
have is treated as an absence rather than an error.

## Prices are a starting point with a date on them

The 44 tools carry list prices noted in **August 2026**, in whole units of your currency.
They will be wrong — vendors reprice, split tiers and rename plans constantly — so every
price is an editable field, and the total uses your number the moment you type one. Email
tools are priced from your list size rather than a flat figure, because that's how they
actually charge, and above the top published tier the app extrapolates rather than
pretending the price stops rising.

Usage-priced lines are computed rather than assumed: SMS volume comes from the automations
you selected that send texts, AI runs from the ones that call a model, and both unit prices
are editable because they vary enormously by country. Payment fees are shown separately and
excluded from the total — you'd pay them whether or not you automated anything.

## Notes

- **Fully offline.** No external scripts, fonts, images, analytics or network requests of
  any kind. Verified with a browser run asserting zero non-`file://` requests.
- **Everything is saved** to `localStorage` as you type. `⬇ Back up` downloads the lot as
  JSON, `⬆ Restore` reads it back, and `🗑 Clear` backs up first, then wipes. Storage
  failures (private mode, `file://` restrictions) degrade to in-memory with a warning
  rather than breaking the app.
- **Light and dark**, following your system setting, with a manual toggle.
- **Accessible.** Real form controls throughout, every input labelled, arrow-key tab
  navigation, visible focus rings, live-region toasts, and all animation disabled under
  `prefers-reduced-motion`.
- **Responsive** to 390px with no horizontal page scroll on any tab; wide tables scroll
  inside their own containers, and the sticky tab bar measures the masthead rather than
  assuming its height.
- **Printable.** Print styles drop the interface and keep the panel you're on.
- **Exports:** whole plan as Markdown, plan as JSON, automations and CRM fields as CSV,
  copy briefs and message sequences as Markdown, plus per-recipe build prompts and one
  system prompt describing the entire build.
- **Tested** with a headless browser across all seven models and all ten tabs, with every
  automation selected and with zero, blank and absurd inputs: no console errors, no
  network requests, no horizontal overflow.

## What will go stale

The prices, and the tool names. Both are dated in the app and both are editable, and the
integration map is written in terms of layers — *forms into CRM*, *payment webhook into
CRM* — so it survives swapping any single tool out.

The arithmetic won't go stale, and neither will the failure modes. Duplicate records from
a double submission, a follow-up sequence that doesn't stop on a reply, a chase email to
someone who already paid, an automation that triggers itself at three in the morning —
those have been the same failures for as long as this kind of system has existed, and each
recipe names its own.

## Deploying

It's one HTML file. Copy `index.html` anywhere — a USB stick, any static host, or GitHub
Pages. Served from this repo's root, the app lives at `/website-crm/`.
