# AI Commercial Production Kits

A single-file, offline mini app that turns one brief into a complete production kit for a video
commercial — script with beat timings, shot list with risk flags, generation prompts, deliverable
specs, clearance checklist — and the arithmetic that says whether generating it with AI is worth
what it costs.

Open `index.html` in any modern browser — no install, no build step, no accounts, no internet
connection, and no data ever leaves the device.

## Why this app exists

*The AI Income Blueprint* (`books/THE_AI_INCOME_BLUEPRINT.pdf`) does not recommend AI video. It puts
it in **Tier 3 — Ignore For Now**, with a one-line verdict:

> Runway / Sora / Kling (video generation — high cost, niche application)
> HeyGen / Synthesia (AI video avatars — viable but premium-tier commitment)

Its Tier 2 stops at ElevenLabs for voice-over and Descript for editing. So this app is not a chapter
adaptation like `launch-kit` or `youtube-toolkit`. It takes a verdict the book states and never
tests, and makes it computable.

Because the verdict is about cost, not capability — and cost is arithmetic. Chapter 4 gives the rule
it comes from, as Mistake #3: *"Spending \$100–\$200/month on tool subscriptions before generating
the first dollar of AI income — treating tools as prerequisites rather than enablers."* Tier 2 is
explicitly *"Add Once Earning"*. Video generation sits a tier above that.

Meanwhile Chapter 8 is direct about the demand. Short-form video management *"commands a significant
premium — typically \$200–\$400 more per month than static content packages"*, and a video-first
package *"positions you at the premium end of the market with minimal additional AI production
complexity."*

That last clause is the one this app exists to qualify. It holds when the client is on camera and
supplies the footage, which is the case Chapter 8 is describing. It stops holding the moment you are
generating the pictures yourself. This app measures the difference, then gives you the production
kit for the jobs where the numbers clear.

## What's in it

| Tab | What it does |
|---|---|
| 🎬 **Brief** | One form — offer, audience, objection, proof, duration, placements, and which footage you can actually get. Everything else is generated from it |
| 📝 **Script** | Eight ad structures laid out against your duration, each beat given a word budget from your delivery pace, with a live count against it. Plus a CLEAR-formatted prompt that carries the budgets, so what comes back fits |
| 🎥 **Shot list** | One shot per beat, split when a beat outruns your clip length, each carrying its failure modes and the number of attempts to plan for |
| 🪄 **Prompts** | A generation prompt per shot in the order models read best, in both text-to-video and image-first form, plus voice-over direction and a music brief |
| 🧮 **Cost** | Cost per finished second, attempts, credits, top-ups, margin, effective hourly — and whether the subscription is earning its keep |
| 📦 **Deliverables** | Safe-zone frames per placement, the variant matrix, and a named export list as CSV |
| ⚖️ **Clearance** | Sixteen items that appear or disappear based on the brief, plus a claim scanner that reads what you actually wrote |
| 🩺 **Fixes** | Twenty symptoms → causes → the change that fixes it |
| 📄 **Kit** | The lot as one Markdown production bible, plus a client-facing scope note and three productised tiers priced off your own cost model |

## The one number everything obeys

**Cost per finished second** — total spend divided by the seconds that survive into the cut, not the
seconds you generated.

The gap between those two is the whole story, and it is the number nobody quotes on. A shot you
accept one time in seven costs seven times its sticker price, and a 30-second commercial routinely
requires four to eight minutes of generated footage. The app computes:

```
attempts per shot  =  ceil(1 / accept rate for its risk tier)
credits            =  attempts × credits per generation
cost per second    =  total spend ÷ master duration
```

Accept rates default to 50% / 30% / 16% / 7% across the four risk tiers at a typical hit rate, with
practised and rough settings either side. **These are the one table in the app you are meant to
overwrite** — measure your own after a project and set it, because every number downstream is only as
good as that one.

## Risk is a property of the shot, not the tool

Three things break generated commercials, and all three are ordinary requirements:

- **Hands on the product.** Fingers merge, gain a knuckle, pass through what they hold.
- **Readable text.** Packaging copy, prices, app screens and signage come back as confident nonsense.
- **The client's actual product.** The model has never seen it, so it generates a category-typical
  version — the one thing a commercial cannot use.

The app scores each shot from its demands and its source, and then does the useful thing: for
anything at high risk it names the alternative. Image-first roughly halves the attempts on a product
shot, because the product in frame is then a photograph. Better still, the cost tab has a **"cheaper
plan"** panel that reassigns every high-risk shot to footage you can actually get and shows what
stops being needed.

The most common answer this app gives is that one shot should be taken on a phone in ten minutes.
That is not a limitation of the app; it is the finding.

## The arithmetic error it was built to prevent

Credit allowances are monthly and a commercial is one of several. Charging a whole month's allowance
against one project makes a subscription look affordable right up until the second commercial of the
month, so the app divides the allowance by your stated volume and bills the project against its own
share.

The same discipline runs through the Tier 3 test: monthly stack ÷ gross margin per commercial gives
the number of commercials a month the subscription needs, held against the number you are actually
booked for. If you have not marked the work as paid, the app says so in Chapter 4's own terms rather
than showing you a margin.

## The claim scanner catches its own examples

Eight categories — earnings, health, guarantees, superlatives, comparisons, urgency, "free", and
testimonial language — matched against the promise, the proof, the call to action and every line of
script copy you write. It reads words, not meaning, so it over-reports on purpose: a false positive
costs a glance, and a missed earnings claim costs an account.

What it finds then drives the clearance list. Write a health claim and the sensitive-claims review
becomes a blocking item; pick a cloned voice and a written-consent item appears that a text-to-speech
project never sees.

The first item on every project is the one most often missed: **commercial use rights on the exact
plan you are on**. Several free and personal tiers grant none, and some paid tiers withhold them
until a higher plan.

## Notes

- **Fully offline.** No external scripts, fonts, images, analytics or network requests of any kind.
  Verified with a browser run asserting zero non-`file://` requests.
- **Everything is saved** to `localStorage` as you type. `⬇ Back up` downloads the lot as JSON;
  `🗑 Clear` backs up first, then wipes. Storage failures (private mode, `file://` restrictions)
  degrade to in-memory with a warning rather than breaking the app.
- **Light and dark**, following your system setting, with a manual toggle.
- **Accessible.** Real form controls throughout, `fieldset`/`legend` on grouped fields, arrow-key tab
  navigation, visible focus rings, live-region toasts, and all animation disabled under
  `prefers-reduced-motion`. Verified: no duplicate ids, every `label[for]` resolves, every control
  labelled.
- **Responsive** down to 390px with no horizontal page scroll; wide tables scroll inside their own
  containers.
- **Printable.** The kit document has print styles that drop the interface.
- **Verified across 4,032 combinations** of structure × duration × voice × accept rate × available
  sources, asserting that beats always sum to the master duration, that no shot is ever assigned a
  source you said you did not have, and that no generated document contains `undefined` or `NaN`.

## What will go stale

Everything platform-specific. Safe-zone margins, duration caps, aspect-ratio support and AI-labelling
requirements all move without notice, and the tools rename their units — credits, tokens, seconds,
generations — every few months.

So the app states its safe zones as conservative approximations and says to check a real export on a
real phone, takes credit costs as fields rather than constants, and asks you to convert whatever your
tool calls its units into "credits per generation" so the arithmetic survives the renaming. The
failure modes in the shot list are the slowest-moving part and will improve; hands are already better
than they were. Accept rates should be re-measured, not trusted.

## Deploying

It's one HTML file. Copy `index.html` anywhere — a USB stick, any static host, or GitHub Pages.
Served from this repo's root, the app lives at `/commercial-kits/`.
