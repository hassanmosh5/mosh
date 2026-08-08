# Meta Ads & Pixel Blueprints

A single-file, offline mini app that turns a Meta advertising setup into a specification:
the tracking code, the event map, the campaign structure, and the arithmetic that decides
whether any of it can work at your budget.

Open `index.html` in any modern browser — no install, no build step, no accounts, no
internet connection, and no data ever leaves the device.

## Why this app exists

*The AI Income Blueprint* (`books/THE_AI_INCOME_BLUEPRINT.pdf`) is an organic-first book.
Its case studies sell without ad spend, and it says so plainly — Denise "never spent money
on advertising." So this app is not a chapter adaptation like `launch-kit` or
`prompt-generator`. It fills a gap the book names and then leaves open.

The book's social media chapter (Ch. 8) says Meta's ad platform "remains one of the most
powerful local targeting tools available — relevant if your clients want to combine organic
management with paid amplification," and stops there. It never mentions the Pixel, the
Conversions API, or campaign structure. This app is that missing piece, for the streams
where paid traffic is the obvious next lever:

| Income stream | What paid traffic does for it |
|---|---|
| #2 Digital products, #5 Prompt packs | Buys checkouts directly — `Purchase` optimisation |
| #3 Social media management, #4 Local automation | Runs the client's ads, not just their posts |
| #6 Coaching & consulting | Fills a booking calendar — `Lead` optimisation |
| #7 Content at scale | Buys subscribers ahead of monetisation |

Everything in it is platform mechanics, not book content, and the app says so in its own
footer.

## What's in it

| Tab | What it does |
|---|---|
| 🧭 **Profile** | One form — business model, funnel, unit economics. Every other tab is generated from it |
| 🚀 **Setup path** | 15 steps in dependency order, three of them marked as gates, each with what it blocks |
| 🎯 **Event map** | Your events with required vs recommended parameters, the 8-slot AEM ranking, and the full standard-event vocabulary |
| 🧩 **Pixel code** | Base code, consent handling, click-ID capture, SPA route tracking, and a snippet per event — all carrying `eventID` |
| 🔐 **Conversions API** | Server code in Node, PHP, Python and cURL; the user-data table ranked by match weight; a working SHA-256 hasher |
| 📐 **Campaigns** | Seven campaign structures, filtered against what your budget can actually feed |
| 🧮 **Numbers** | Break-even, budget floor, a back-solving funnel model, and a creative-test calculator |
| 🩺 **Diagnostics** | 20 symptoms → ranked causes → fix |
| 📄 **Brief** | The lot, as one Markdown document you can hand to a developer |

## The one number everything obeys

An ad set needs roughly **50 optimisation events per rolling 7 days** to leave the learning
phase. That converts straight into a budget floor:

```
daily budget per ad set  =  50 × target cost per conversion ÷ 7
```

The app computes this from your own economics and then uses it as a filter. A structure
needing four ad sets is hidden unless your budget can feed four ad sets, because the usual
way campaigns fail is not a bad structure — it's a good structure split across more ad sets
than the budget could ever feed.

This produces uncomfortable results on purpose. A £47 product at 90% margin implies a
break-even of £42, a target of £25, and a floor of **£181/day for one ad set**. If your
budget is £30, the app says so rather than suggesting a cleverer layout. When nothing fits
it shows every blueprint anyway, with what each would need — an empty screen would be
honest and useless.

## Deduplication, which is where most setups break

Browser and server both send the same events; they collapse into one only when
`event_name` **and** `event_id` match exactly. The failure mode is generating the ID
separately on each side — `Date.now()` in the browser, a UUID on the server — which never
matches, so every purchase counts twice and every reported cost per acquisition is half of
what you are really paying.

The generated code derives the ID from the order or lead ID on both sides, which is
unique by construction, identical by construction, and idempotent when a page reloads or a
webhook retries.

## The hasher is real

The Conversions API tab normalises and hashes user data in the page, using a SHA-256
implementation written into the file rather than `crypto.subtle` — which is unavailable on
some `file://` origins, and opening the file directly is how this app is meant to be used.
It is checked against Node's `crypto` on ten vectors including the empty string, multi-byte
UTF-8, and the 55/56/64-byte block boundaries.

Type an email with a capital letter and a trailing space and it shows you both hashes: the
correct one, and the one you get by skipping normalisation. The second is accepted by the
API without complaint and matches nobody, which is why match quality quietly rots.

It also catches the trunk-zero trap. Meta's documented rule strips *leading* zeros, so a
number written `+44 (0)7700 900123` keeps a zero in the middle and hashes to something
that matches nobody. The app flags it instead of silently guessing at E.164.

## Generated code is checked, not just printed

Every snippet the app produces is parsed by the real toolchain as part of verification:
`node --check` for the browser and Node output, `python3 -m py_compile` for Python,
`php -l` for PHP, and `bash -n` for the cURL script. Sixteen snippets across the four
languages, re-checked whenever the generator changes.

The server code drops empty fields rather than sending `em: [null]` or the hash of an
empty string — both look valid in the API response, match nobody, and pull Event Match
Quality down. The app tells you to do that, so its own output does it.

## Notes

- **Fully offline.** No external scripts, fonts, images, analytics or network requests of
  any kind. Verified with a browser run asserting zero non-`file://` requests.
- **Everything is saved** to `localStorage` as you type. `⬇ Back up` downloads the lot as
  JSON; `🗑 Clear` backs up first, then wipes. Storage failures (private mode, `file://`
  restrictions) degrade to in-memory with a warning rather than breaking the app.
- **Light and dark**, following your system setting, with a manual toggle.
- **Accessible.** Real form controls throughout, `fieldset`/`legend` on grouped fields,
  arrow-key tab navigation, visible focus rings, live-region toasts, and all animation
  disabled under `prefers-reduced-motion`.
- **Responsive** down to 390px with no horizontal page scroll; wide tables scroll inside
  their own containers.
- **Printable.** The brief has print styles that drop the interface.
- **No access token is ever requested.** The app has no field for one, and the generated
  server code reads it from an environment variable.

## What will go stale

Meta renames things constantly — Business Manager became Business portfolio, pixels became
datasets, campaign budget optimisation became Advantage campaign budget. The mechanics in
this app are stable; the labels and menu paths drift.

So: the Graph API version is an editable field rather than a hard-coded string, navigation
paths are written as "roughly here", and the app's footer says to confirm behaviour in
Events Manager rather than trusting any document — including itself. Benchmark figures are
stated as ranges. Every other number is arithmetic on what you typed, and nothing in it
forecasts your results.

## Deploying

It's one HTML file. Copy `index.html` anywhere — a USB stick, any static host, or GitHub
Pages. Served from this repo's root, the app lives at `/meta-ads/`.
