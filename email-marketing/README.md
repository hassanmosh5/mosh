# Email Marketing Automation

A single-file, offline mini app for the part of an email list nobody plans: what to send, when it
goes out, what a subscriber is actually worth, and what mailing all of them does to the ones who
still read you.

Open `index.html` in any modern browser — no install, no build step, no accounts, no internet
connection, and no data ever leaves the device.

## Why this app exists

*The AI Income Blueprint* (`books/THE_AI_INCOME_BLUEPRINT.pdf`) mentions email twice. Chapter 15
lists "building an email list" among the growth levers that turn a side income into a business.
Chapter 12 treats a newsletter as one of three media properties worth owning. Chapter 8 sells email
sequences as a service to other people.

None of them says what to put in one, how often to send it, or what it earns. That is the gap here,
and it is a wide one: "build a list" is advice that stops exactly where the work starts.

| From the book | Where it lands |
|---|---|
| Ch. 5 — the CLEAR Formula and the 3-Pass Method | The drafting prompt on the Write tab, filled in from the email's own brief |
| Ch. 14 — the 30-day launch plan | The launch sequence: seven emails over ten days |
| Ch. 15 — build a list, hire a VA, productise, move to MRR | The whole app, which is the first of those four |
| Ch. 10 — prompt packs as a product | The default lead magnet, because it recruits people who intend to do the work |

Everything else — the segment model, inbox placement, the sequence library, deliverability rules,
sending-cost shapes — is email practice the book does not cover, and the app says so in its footer.

## What's in it

| Tab | What it does |
|---|---|
| 🎯 **List & offer** | The list split four ways by last engagement, because "5,000 subscribers" is not a number you can do arithmetic with |
| 🧲 **Growth** | Traffic to signups to confirmed, against the three things that leak — and the one that is invisible |
| ✉️ **Sequences** | Seven automations, 31 emails, every field editable, ranked by what each pays per hour spent writing it |
| ✍️ **Write** | One email at a time: its brief, a word-budgeted structure, a subject-line check, an inbox preview and a CLEAR prompt |
| 📈 **Projection** | Four sending policies, 24 months each, and the month where the lines cross |
| 💷 **Revenue & cost** | Revenue per subscriber-month against cost per subscriber-month, six pricing shapes, and the cold subscriber tax |
| 📬 **Deliverability** | Authentication and practice as checklists, the 2024 bulk-sender rules, and your complaint rate against the published threshold |
| 🩺 **Audit** | Twenty checks read from what you typed on the other eight tabs |
| 📄 **Brief** | The lot as one Markdown document, and every email as CSV |

## The number everybody gets wrong

Mailing your whole list looks like the obvious move. More addresses, more opens, more money. On the
app's default list — 5,000 subscribers, of whom 1,800 have not opened anything in six months — it is
the worst of the four policies within a month, and the arithmetic is not close:

| Policy | Sent per send | Placement | **Opens per send** | Reachable after 2 years |
|---|---|---|---|---|
| Everyone, every time | 4,429 | 62% | **251** | 604 |
| Engaged + semi-engaged | 1,208 | 95% | **430** | 898 |
| Engaged + semi, sunset the rest | 1,420 | 94% | **464** | 1,010 |

Sending to **27% as many people produces 71% more opens**, because inbox placement is judged on how
the people you have been mailing lately behaved, and the unengaged half of a list drags that number
down for everybody on it. The complaint rate does the rest: 0.177% mailing everybody against 0.036%
mailing the warm half, where the published threshold is 0.30% and the advisory target 0.10%.

The app does not assume this result. If your list has a small cold pile and low complaint rates,
mailing everybody wins and the projection tab says so in as many words.

## Which automation to write first

A sequence is written once and runs on everybody who arrives afterwards, for years. That makes the
only sensible build order the one the app computes: monthly revenue divided by hours of writing.

```
value per build hour  =  (entrants per month × revenue per entrant) ÷ (words ÷ words per hour + setup)
```

All seven sequences are 33.5 hours of writing on the shipped defaults. The ranking recomputes as you
edit any email, any delay, any word count, or the number of launches you run a year.

Revenue per entrant is compounded, not summed: people who buy leave the pool and people who
unsubscribe leave it too, so a sequence always converts less than the sum of its emails. It is the
reason the ninth email in a welcome sequence is worth so much less than the first.

The ranking also states what it does not measure. Re-engagement asks for no money and will always sit
at the bottom of the table; what it is worth appears on the projection tab as placement kept. The app
says this rather than letting a $0 imply "don't bother".

## The segment rates check themselves

A segment is defined by a length of silence, and that puts a ceiling on its open rate. A subscriber
who opens 1.5% of sends, receiving four a month, has a 70% chance of still being "cold" six months
later — so 1.5% cannot be what "cold" means. The model disclosure carries the check for every
segment, against your own send frequency:

| Segment | Opens a given send | Consistent with its own window |
|---|---|---|
| Engaged | 45% | 91% open at least one of 4 in a month |
| Semi-engaged | 8% | 51% open none of 8 in two months |
| Dormant | 3% | 69% open none of 12 in three months |
| Cold | 0.4% | 91% open none of 24 in six months |

Every rate is editable. Push one somewhere implausible and the column turns amber and tells you the
numbers are arguing with each other. The shipped defaults were set by this test, not by which policy
it made look good.

## Inbox placement is a stated guess

Placement is estimated from a curve through six anchors, using the trailing engagement rate of what
you have been sending, then penalised for complaints at three points per 0.1% of send. Every anchor,
the trailing weight, the penalty and the floor are editable.

The shape is well attested: engagement drives placement. The numbers are a guess, because nobody
outside the mailbox providers knows the real function. The app says exactly that on the tab that uses
it, and the disclosure is titled "The model, and where it will be wrong".

## There is no spam score

Filters run on sending reputation, on how people like the recipient treated your last few sends, on
authentication, and on content, in roughly that order. Nothing inside a browser can see the first
three. So the subject line check lists specific, nameable problems — shouting, two exclamation marks,
a faked `Re:` prefix, a merge tag with no fallback, preview text that repeats the subject, sales-flyer
language that makes a personal email look like a circular — and refuses to total them.

A number would imply it could be computed. The same argument is why the deliverability tab has a
section headed "What is not on this page".

## What the list costs

Six pricing shapes rather than six companies, because providers move their tiers constantly: free
tier, two per-subscriber tiers, pay-per-send, self-serve infrastructure, all-in-one CRM. Each has an
editable base fee, per-1,000-subscriber rate, per-1,000-email rate and free allowance, and the app
computes cost per month, cost per subscriber and which shape is cheapest at your volume.

Then it prices the thing you are actually paying for:

```
cold subscriber tax  =  (cost with them − cost without them) × 12
```

On the defaults that is $900 a year for 3,000 people who are not reading — before counting what they
do to the placement of everything sent to everyone else.

## Notes

- **Fully offline.** No external scripts, fonts, images, analytics or network requests of any kind.
  Verified with a browser run asserting zero non-`file://` requests. The charts are inline SVG
  generated in the page, and every one of them is paired with the table it was drawn from.
- **Everything is saved** to `localStorage` as you type. `⬇ Back up` downloads the lot as JSON,
  `⬆ Restore` reads it back, and `🗑 Clear` backs up first, then wipes. A restored or hand-edited file
  is repaired on load: missing sequences are restored from the library, emails get ids, invalid enums
  fall back to valid ones, non-numeric delays and word counts become numbers, and shares that do not
  add up are normalised. Storage failures (private mode, `file://` restrictions) degrade to in-memory
  with a warning rather than breaking the app.
- **Light and dark**, following your system setting, with a manual toggle.
- **Accessible.** Real form controls throughout, arrow-key tab navigation, visible focus rings,
  live-region toasts, text alternatives on every chart and stacked bar, and all animation disabled
  under `prefers-reduced-motion`.
- **Responsive** down to 390px with no horizontal page scroll; wide tables scroll inside their own
  containers.
- **Printable.** The brief has print styles that drop the interface.
- **Verified in a real browser.** 210 assertions run against the file in headless Chromium: the
  arithmetic (placement curve, growth chain, the 24-month simulation under all four policies, sequence
  compounding, build order, sending cost, lifetime value), the segment consistency check, every audit
  rule firing and clearing, the subject linter's fifteen checks, escaping of hostile text into every
  rendered surface, the save/restore round trip and its repair of deliberately damaged files, editing
  through the interface, and no horizontal overflow at 390, 768 and 1280px on all nine tabs.

## What will go stale

Provider pricing moves constantly, so every fee is an editable field with a stated default rather
than a quote. The Google and Yahoo bulk-sender requirements date from February 2024 and the
thresholds quoted — roughly 5,000 messages a day, 0.30% complaints, 0.10% advisory — are theirs, not
the app's; check them before trusting the tab.

Open, click and conversion rates vary by an order of magnitude between lists, which is why the first
tab has a box marked "I have real numbers from my own sends" and why every figure derived from a
default is labelled as one until you tick it. Nothing here forecasts sales: every number is
arithmetic on figures you supplied.

## Deploying

It's one HTML file. Copy `index.html` anywhere — a USB stick, any static host, or GitHub Pages.
Served from this repo's root, the app lives at `/email-marketing/`.
