# Shortlist

A free web app that helps high-school students build and run their college application list.

The core idea: an honest **list-health verdict** ("7 reaches, 1 target, 1 likely, 1 safety
— still top-heavy, add a safety") shown front and center, plus the tools to act on it.

## Features (planned)
- **My list** — colleges as reorderable rows: 5-star importance, tier (Reach / Target /
  Likely / Safety), projected odds (honest estimate), next deadline.
- **List-health verdict** — blunt-but-kind grade of how balanced the list is.
- **Comparison** — side-by-side on net price by income, outcomes, fit.
- **Deadlines** — "due this week," with source + last-verified date.
- **Weighted decision matrix** — radar chart with 0–5 importance sliders per factor.
- **Decision-analysis plots** — schools plotted vs importance and vs projected acceptance rate.

## Honesty rule
Admission chances are shown as labeled estimates (`~12% est`), never fake exact
percentages. College Scorecard has no GPA data and test-optional thins score data.

## Design & planning
- `DESIGN.md` — the design system (read before any UI work).
- `docs/design-doc.md` — full product + engineering + design planning (office-hours →
  eng review → design review → design system) from the founding session.

## Status
Planning complete; implementation not started. First build step: Scorecard data ingest +
the list-health scoring engine (pure, tested) before any UI. Frontend must start from
21st.dev templates — see the anti-AI-slop rules in `DESIGN.md`.
