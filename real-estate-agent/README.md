# AI Real Estate Agent

A single-file, offline planning tool for the decision that comes before you switch an
assistant on in a property business: which enquiries it answers first, what it asks them,
what it must never say, and whether the arithmetic works at your lead volume.

Open `index.html` in any modern browser — no install, no build step, no accounts, no
internet connection, and no data ever leaves the device.

**It is not a chatbot.** Nothing here talks to a model. It decides what the model should be
told, what it must refuse, and what a lost lead actually costs — and then hands you the
system prompt, the scripts, a 46-case test bench, a fair-housing copy checker and a rollout
plan with gates that refuse to open.

## The argument the app makes

Agents buy leads and then lose them to the clock. Not to a competitor with a better CRM —
to a Tuesday evening, a valuation appointment that overran, and a portal enquiry that sat
unanswered until Thursday. Three things follow, and the app is built around them:

1. **The unit of decision is the source, not "leads".** A portal enquiry and a past-client
   referral share a name and nothing else: on the app's default figures they differ by more
   than thirty times in what one closing costs. Blend them and every decision afterwards is
   wrong. Sixteen sources, each with its own funnel, its own cost per deal in money *and*
   hours, and its own verdict — scale, keep, fix or cut.
2. **Speed is the only lever most agents have not already pulled.** The two figures on the
   Speed tab — how long an enquiry waits, and how many times you try before stopping —
   move the deal count more than anything else in the app, and both are usually worse than
   the agent believes. The tab prices the gap.
3. **The friendly answer is the unlawful one.** An assistant that answers property questions
   breaks housing discrimination law in exactly the register a well-meaning agent does: by
   being helpful about which sort of person lives where. That is why the Fair housing tab is
   the only one where nothing is a preference.

## The tabs

| Tab | What it does |
|---|---|
| 🏠 **Practice** | Price, commission, split, volume, hours, reply time. Everything else is computed from here |
| 📡 **Lead sources** | 16 sources with editable funnels, cost per deal in money and hours, and a verdict each |
| ⏱ **Speed** | The response-time and follow-up curves, what the current wait costs in deals, and what an assistant recovers |
| 🎯 **Qualifying** | Buyer, seller and renter tracks with weighted questions, two routing thresholds, and a live scorer you can try a lead against |
| ⚖ **Fair housing** | Jurisdiction, 14 absolutes (10 locked), the questions never to ask, and a listing-copy checker that scans against 46 phrases |
| 🧠 **Agent brief** | The full system prompt assembled from every other tab, with a token estimate and the cost of re-sending it every turn |
| 💬 **Scripts** | 25 replies generated from your own settings, plus a 12-step follow-up cadence, editable and quoted into the brief |
| 🧪 **Test bench** | 46 messages across 9 categories — half ordinary, half the ones that arrive at 11pm — with pass criteria and blockers |
| 💰 **Economics** | Extra commission, hours saved, model spend, review time and the cost of the conversations it gets wrong |
| 🚀 **Rollout** | Five phases whose gates read the rest of the app and stay shut when unmet |
| 📄 **Spec** | The lot as one Markdown document |

## How the contact rate is derived rather than typed

Nobody can honestly type a contact rate for a follow-up process they have not run, so the
app computes one and shows its working:

```
contact = ceiling × speed penalty × attempts reached
```

The **ceiling** is the share of a source you could ever reach with a perfect reply time and
unlimited attempts — 95% for a past-client referral, 35% for cold circle prospecting. The
**speed penalty** comes from a stated curve (a reply inside a minute is the baseline; an hour
is 60% of it; a day is 19%), scaled by each source's **sensitivity**: a portal enquiry sent to
four agents at once takes the full penalty, a referral from a client you sold for in 2019
barely notices. The **attempts** curve says what share of the reachable ceiling a given number
of follow-ups actually reaches — 45% at one attempt, 76% at three, 93% at six.

None of those numbers is a benchmark. They are the figures this app applies, printed on the
tab that applies them, and every one is editable.

**The weakest assumption is that the two curves multiply**, which treats speed and
persistence as independent when some of the people you reach on the sixth attempt are the
same ones a two-minute reply would have caught first time. The app says so on the tab rather
than in the small print. For the cautious version, hold the assistant's attempt count at the
number you already manage and let it improve only the reply time.

## The out-of-hours arithmetic

Your median reply time is not the one your leads experience. The app works out the share of
the 168-hour week nobody is at the phone, how long an enquiry that lands in that gap waits
before your clock even starts, and blends the two:

```
effective wait = in-hours share × your reply time
               + out-of-hours share × (your reply time + half the average gap)
```

On the default figures — six days, nine hours — that turns a 90-minute reply time into a
7.9-hour one, and about 12 deals a year.

## Fair housing

The section that is not a preference, and the reason this app exists rather than a generic
lead-response calculator.

- **Five jurisdictions** — US, UK, Canada, Australia/NZ, and a common-core fallback — each
  with its statute and its list of protected characteristics.
- **Fourteen absolutes**, ten of which cannot be switched off: never describe an area by who
  lives there, never filter by a characteristic even when asked to, never qualify one person
  differently, never publish a preference, never refuse an assistance animal as a pet, never
  value or guarantee, never claim to be the licensed human, never disclose one client's
  business to another, never touch funds.
- **Eight questions never to ask**, each with the lawful question that gets you the same
  information — "how many bedrooms do you need?" rather than "do you have children?"
- **The scripted answer to "is it a nice area?"**, which arrives in nearly every buyer
  conversation and has no safe improvised answer.
- **A listing-copy checker.** Paste an advert, a reply or a postcard and it is scanned on
  your device against 46 phrases, each flagged as unlawful in most systems, a risky proxy, or
  lawful-but-a-breach-of-your-own-duty. That last category is the interesting one: "motivated
  seller — divorce" is not a discrimination problem, it is you announcing your client's floor
  to every buyer who reads it.

The checker knows 46 phrases and English knows rather more. It is a checklist to argue with,
not a compliance product, and the app says so in three separate places.

## The economics

Four terms, all of them in the same sum:

| Term | Where it comes from |
|---|---|
| Extra commission | The deals the faster reply wins, from the Speed tab |
| Hours saved | The share of per-lead minutes that is chasing and diary admin rather than advising |
| Cost to run | Model spend (priced from the actual brief length × turns), software, and the minutes a day somebody spends reading it — forever |
| Cost of failure | Conversations handled badly enough to lose the lead, priced at what that lead was worth *plus* the referrals a looked-after client would have sent |

Then two break-evens: the lead volume below which fixed costs eat the gain, and the failure
rate above which it stops paying. If the answer comes out negative for your practice, that is
a finding — it usually means the volume is too low for automation to matter yet, and the
setup money buys more leads instead.

## What is stored, and where

Everything you type is kept in this browser's local storage under one key and nowhere else.
There is no account, no sync, no analytics, no network request of any kind — the file loads
no fonts, scripts, images or stylesheets from outside itself. **Back up** writes a JSON file
you can keep or move to another machine; **Restore** reads one back; **Clear** downloads a
backup first, then erases.

## What this is not

- **Not legal advice.** Housing discrimination law, agency law, consumer-protection rules and
  marketing-consent rules differ by country, state and city, and they change. Have the
  fair-housing output read by somebody qualified where you practise.
- **Not a valuation tool.** The app refuses to produce a property valuation, in the same way
  it instructs the assistant to.
- **Not a CRM.** It plans one conversation type extremely carefully; it does not store leads.
- **Not a benchmark source.** Every rate in it is the app's own stated figure, editable, and
  wrong for somebody's market by construction.

## File facts

One file, `index.html`, about 5,200 lines, no dependencies and no build step. Everything —
the 16 source funnels, the 46 phrase rules, the 46 test cases, the 25 scripts, the prompt
builder and the Markdown exporter — is inline.
