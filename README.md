# Shortlist

A free web app that helps high-school students build and run their college application list.

The core idea: an honest **list-health verdict** ("7 reaches, 1 target, 1 likely, 1 safety
— still top-heavy, add a safety") front and center, plus the tools to act on it.

## Features

- **My list** — colleges as reorderable rows (5-star importance, tier, honest projected
  odds, deadline). Add from a 30-school catalog, remove, set your SAT and watch every
  tier recompute.
- **List-health verdict** — blunt-but-kind grade of how balanced the list is.
- **Decision matrix** — radar of decision factors with 0–5 importance sliders, a
  school-overlay, and two live plots (weighted fit vs. importance, fit vs. odds).
- **Compare** — side-by-side on odds, admit rate, net price, deadline, and factor scores,
  with best-in-row highlights.
- **Deadlines** — cycle-aware timeline grouped by month, with source + last-verified.
- **Share** — a read-only link (no account needed) for parents/counselors.

## Honesty rule

Admission chances are shown as labeled estimates (`~12% est`), never fake exact
percentages. College Scorecard has no admitted-GPA and test-blind schools report no SAT,
so those fall back to selectivity-only — and the UI says so.

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind · Fraunces + Geist. Client-side /
local-first today (state in `localStorage`); accounts/sync (Supabase) are the next phase.

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # list-health engine tests (node --test)
npm run build      # production build
```

## Data

Real admissions data comes from the College Scorecard API.

```bash
cp .env.example .env.local        # then add your key from https://api.data.gov/signup/
npm run ingest                    # writes src/data/scorecard-stats.json
```

The catalog's curated factor scores and deadlines stay hand-authored; ingest only
refreshes the objective numbers (admit rate, SAT range, net price). The key lives in
`.env.local` (gitignored) and never ships to the client.

## Deploy

Import the repo at [vercel.com/new](https://vercel.com/new) — it's a static Next build,
no env vars needed at runtime (data is baked in at ingest time).

## Design & planning

- `DESIGN.md` — the design system (read before any UI work).
- `docs/design-doc.md` — the founding planning session (office-hours → eng → design →
  design-system).
