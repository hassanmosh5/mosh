# Star Explorers — Interactive Workbook for Kids

A single-file, offline-friendly interactive workbook for children roughly **ages 4–8**.
Open `index.html` in any modern browser — no install, no build step, no internet connection,
no accounts, and no data ever leaves the device.

## Activities

| Activity | Skill | What happens |
|---|---|---|
| 🐥 Counting Critters | Counting to 5 / 10 / 20 | Count the animals, tap the number |
| ➕ Math Lab | Addition & subtraction | Sums shown with coloured counters as a visual aid |
| 🔤 Word Builder | Phonics & spelling | Tap letter tiles in order to spell the picture |
| 🔁 Pattern Party | Sequencing & logic | AB, AAB/ABB and ABC patterns — what comes next? |
| 🔷 Shape Safari | Shape recognition | 10 shapes drawn as crisp SVG, name the shape |
| 🧠 Memory Match | Concentration | 4, 6 or 8 pairs to find |
| 🎨 Doodle Pad | Free drawing | 10 colours, 3 brush sizes, eraser, drawing prompts, save as PNG |

## Three difficulty levels

`🐣 Easy` · `🐰 Medium` · `🦁 Challenge` — set once on the home screen, applies everywhere:
number ranges grow, subtraction unlocks at Medium, words get longer, more shapes appear,
and the memory board grows from 8 to 16 cards.

## Rewards

- ⭐ A star for every correct answer, banked per activity.
- 🏅 A sticker unlocks on the chart for every 5 stars (20 stickers to collect).
- 🎓 A printable certificate with the child's name, star count and the date.

Progress, name, level and the sound setting are saved in the browser's `localStorage`,
so a child can close the tab and pick up where they left off. **Start over** clears it.

## Notes for grown-ups

- **Fully offline.** No external scripts, fonts, images or trackers. Sound effects are
  generated with the Web Audio API, so there are no audio files to load. Sound can be
  muted from the top bar.
- **Touch-first.** Large tap targets, no drag-and-drop or double-taps, no timers or
  countdown pressure. Wrong answers never punish — the correct answer is shown and the
  next question follows.
- **Accessible.** Full keyboard navigation with visible focus rings, ARIA labels on
  interactive elements, live-region feedback for screen readers, and all animation
  (including confetti) disabled under `prefers-reduced-motion`.
- **Printing.** `🖨 Print` on the certificate screen hides the interface and prints just
  the certificate.

## Deploying

It's one HTML file. Copy `index.html` anywhere — a USB stick, a school network share,
GitHub Pages, or any static host. To publish with GitHub Pages, serve this folder and
the workbook is at `/workbook/`.
