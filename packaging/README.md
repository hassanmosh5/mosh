# packaging/ — the commercial layer

Everything in this folder describes the 38 standalone products **as things for
sale**: what they cost, who they are for, what problem each one solves, and what
a buyer receives. The products themselves live in their own folders at the
repository root; nothing here changes them.

```
packaging/
├── catalog.json          prices, licences, policies, platform limits, bundles
├── products/*.json       one entry per product — the commercial copy
└── listings/             GENERATED — paste-ready copy for five platforms
```

## Editing

Edit `catalog.json` and `products/*.json`. Never edit anything under
`listings/`: it is overwritten by `npm run pkg:listings` on every run.

After any change:

```bash
npm run pkg:listings     # regenerate the 190 listings
npm run pkg:build        # rebuild the ZIPs if prices or files changed
npm run pkg:verify       # check the whole catalogue is sellable
```

## What the catalogue enforces

The loader validates rather than trusts, because a catalogue error becomes 190
listing errors at once:

- Every product needs a problem, at least three things it solves, at least four
  usage steps, two "do not buy this if" lines, and a statement of what it cannot
  do. Thin copy fails the build.
- Taglines are capped at 62 characters and one-liners at 175, so they survive
  every platform's tightest field.
- Every `dir` and entry file must exist on disk.
- Every bundle must save the buyer money against the sum of its parts.
- Character limits are enforced by throwing, never by truncating.

## Adding a product

1. Add an entry to the right file in `products/` — the categories are
   `decide`, `package`, `agency`, `growth`, `agents` and `life`.
2. Set `shots` to tab labels that actually exist in the product; the mockup
   generator clicks them by name and reports any that do not match.
3. Run `npm run pkg:all`.

## Where the money settings live

`catalog.json` → `currency` holds the GHS and NGN rates and the date they were
noted. They are typed in by hand and go stale; `pkg:verify` warns after sixty
days. `tiers` holds the three licences and their multipliers. `policies` holds
the refund window, the download window and the disclaimer that appears on every
listing.

See [`docs/SELLING.md`](../docs/SELLING.md) for the full runbook.
