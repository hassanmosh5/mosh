# ExamAce Ghana

A mobile-first marketing site and student-dashboard prototype for a subscription
BECE/WASSCE prep platform. Five pages, no build step, no dependencies, no network
requests except the WhatsApp links you choose to click.

Open `index.html` in any browser.

```
examace-ghana/
├── index.html        single-page-scroll homepage
├── maths.html        subject page — Mathematics
├── science.html      subject page — Integrated Science
├── english.html      subject page — English Language
├── dashboard.html    student dashboard prototype (sign-in → LMS view)
└── assets/
    ├── examace.css   42 KB raw / 8.8 KB gzipped — the whole design system
    └── examace.js    5.5 KB raw / 1.8 KB gzipped — nav, pricing tabs, reveal, demo sign-in
```

## The constraint that shaped everything

The brief said low-bandwidth Ghanaian mobile. That is not a garnish on the design —
it is the design. So:

- **No images. None.** Every icon is an inline SVG symbol; the hero "screenshot" is a
  CSS phone mock; the favicon is a data URI. There is not a single `<img>` tag in the
  project.
- **No web fonts.** System font stack. A typical web font pair is 60–120 KB and blocks
  text from painting; the system stack is 0 KB and paints immediately.
- **No CDN, no framework, no analytics.** Nothing to resolve, nothing to block on.
- **CSS and JS are shared files, not inlined per page.** One stylesheet fetched once
  and cached covers all five pages. Inlining it would have put another 8.8 KB on the
  wire for every page after the first.

Measured, gzipped: the homepage is **23.5 KB on a cold cache** (12.9 HTML + 8.8 CSS +
1.8 JS). Every page after that is **~7 KB**, because the CSS and JS are already there.
Uncompressed the homepage is 98 KB — serve these with gzip or brotli on.

Everything also degrades: with JavaScript disabled or still in flight, the nav links
are in the drawer markup, **both** pricing tables are in the DOM (the JS only hides
one), and the FAQ is native `<details>`. Nothing on the conversion path needs script.

## Design decisions

**Colour.** Deep WAEC-blue (`#062b4f`) carries the authority the brand needs, green
(`#0b6e4f`) means pass, and gold (`#ffc220`) is reserved *exclusively* for the primary
CTA. Gold-on-navy is the highest-contrast pair in the palette, so nothing else is
allowed to use it — the eye learns in one screen that gold means "the button". Every
CTA and body-text pairing clears WCAG AA.

**Mobile-first, literally.** Every rule in the stylesheet is the phone rule; wider
breakpoints only add. Tap targets are ≥44 px, the sign-in inputs are 16 px so iOS
doesn't zoom on focus, and the whole homepage is readable at 320 px.

**Dark mode** is supported through system preference (`prefers-color-scheme`) with a
`data-theme` override available, but there is deliberately no toggle in the header — a
theme switcher is clutter on a conversion page.

## The trust problem, and how the pages answer it

Low trust is the real risk for a Ghanaian EdTech subscription, so it is handled
structurally rather than with a badge:

- **"Founded by examiners"** gets its own band directly under the hero — the first
  thing after the headline, not a footnote.
- **The step-by-step worked solution is a section, not a claim.** The homepage shows a
  full A.P. question solved line by line, with the examiner's note about where
  candidates throw marks away. Each subject page has its own (bearings for Maths,
  density for Science, summary method for English). This is the hook: students don't
  need the answer, they need the route to it.
- **The guarantee is spelled out with its conditions** — 50 of 60 sessions, all mocks
  sat, result slip within 30 days — right next to the price, before payment. A
  guarantee whose terms are hidden reads as a trick.
- **Non-affiliation with WAEC is stated plainly** in the FAQ and in every footer.
  Claiming or implying endorsement would be the fastest way to destroy the trust the
  rest of the site is building.

## What is real and what is placeholder

Everything here is front-end. Before this goes live you must replace:

| Thing | Where | Note |
|---|---|---|
| Testimonials and grade movements | `index.html` → `#proof` | **Illustrative copy.** Replace with verified results and written consent. The disclaimer under the section stays. |
| Headline statistics (12,000 scripts, 4,800 questions, 20,000 group members) | hero, WhatsApp band | Placeholders. Use real numbers or delete them. |
| WhatsApp links | `https://wa.me/233000000000` | Deliberately non-routable. Swap for the real business number or group invite. |
| Question counts per subject | subject page chips | Placeholders. |
| Payment flow | pricing CTAs → `dashboard.html` | No payment integration. Wire to a Ghanaian PSP (Paystack, Hubtel, Flutterwave) for MTN MoMo, Telecel Cash and AirtelTigo Money. |
| Sign-in | `dashboard.html` | **Checks nothing.** It swaps two DOM sections so the dashboard layout can be reviewed. Real auth belongs on a server: HTTPS POST, server-side session, rate limiting, SMS recovery. |
| Refund / Terms / Privacy links | footers | Point at `#pricing`. Write the real pages. |

The maths in the worked examples is correct and the examiner guidance is generic exam
technique, but the syllabus topic frequencies ("every year", "most years") are
editorial judgements, not audited statistics — have a real examiner confirm them
before publishing.

## Page-by-page

**`index.html`** — single scroll: hero → examiner trust band → the problem (random
study vs. structured plan, side by side) → how it works in 3 steps → feature grid
(Smart Question Bank, Mock Exam Engine, Weakness Detection, Data-Friendly Video
Lessons) → worked solution → subject cards → AI Scan & Solve and AI Tutor placeholders
→ testimonials → pricing (monthly GHS 30/60/100, bundles GHS 150/220/300, MoMo band,
guarantee terms) → WhatsApp lead capture → free resources → FAQ → final CTA → footer.
A floating WhatsApp button sits above everything.

**Subject pages** share a shell: what the paper actually asks (with frequency), a note
from the marking room, a full worked solution, the 60-day plan broken into stretches,
what's included, and a pricing CTA.

**`dashboard.html`** — sign-in card, then the LMS view: today's four tasks, mock
results with predicted grades, weakness detection (including the distinction between
"doesn't know it" and "too slow", which are different problems with different fixes),
a 60-day progress ring with guarantee eligibility, AI tutor entry points, what's
coming up, and the parent summary.

## The footer links the brief asked for

`Examiner's Reports`, `Syllabus Guides` and `Mock Exam Center` are live anchors into a
real Free Resources section on the homepage (`#examiners-reports`, `#syllabus-guides`,
`#mock-exam-center`) rather than dead `#` links. When those become full pages, change
four hrefs.
