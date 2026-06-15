# Design System — Shortlist

## Product Context
- **What this is:** A free web app that helps high-school students build and run their
  college application list — an honest "list health" verdict, comparison, deadlines.
- **Who it's for:** Stressed high-school juniors and seniors (and the parents/counselors
  they share with).
- **Space/industry:** College admissions / edtech. Peers: Common App, Naviance/SCOIR,
  Niche, BigFuture, CollegeVine.
- **Project type:** Web app (data-dense) with a light editorial marketing surface.

## Memorable thing
"It tells me the truth, calmly, and I trust it." Every design decision serves this.

## Aesthetic Direction
- **Direction:** Calm editorial. A well-made independent publication crossed with a
  precise tool — the opposite of the anxious clutter of college admissions.
- **Decoration level:** Minimal to intentional. Typography and whitespace do the work.
- **Mood:** Steady, honest, human, on the student's side. Never corporate, never childish,
  never loud.

## Typography
- **Display/Hero (the verdict + headings):** Fraunces (opsz/wght variable) — warm,
  characterful serif. It carries the voice so the honest verdict feels like a person, not
  a dashboard metric. Use ONLY at display sizes (24px+), never for body.
- **Body / UI / labels:** Geist — clean, distinctive, readable, free. Deliberately not
  Inter / Roboto / Space Grotesk (the AI-default trap).
- **Data / tables / numbers:** Geist with `font-variant-numeric: tabular-nums` for admit
  rates, deadlines, prices. Optional: Geist Mono for the projected-odds estimate figures
  to make them feel precise.
- **Loading:** Google Fonts — `Fraunces:opsz,wght@9..144,400;9..144,600` + `Geist:wght@400;500`
  (+ `Geist Mono` if used). Self-host later for performance if needed.
- **Scale (px):** display-xl 40 · display 32 · h1 26 · h2 20 · h3 16 · body 15/16
  (line-height 1.7) · small 13 · micro 12. Two weights only per family (400/500–600).

## Color
- **Approach:** Restrained. One accent + warm neutrals. Color is rare and meaningful —
  the only saturated color on a screen is the tier color, so it reads instantly.
- **Background (Paper):** #FAF8F3 (warm off-white — NOT white-on-gray SaaS).
- **Surface:** #FFFDFA / #FFFFFF for raised cards.
- **Ink (text):** #211E1A primary · #5C574E muted · #908A7E faint.
- **Hairline/border:** #E7E2D8 (≈ rgba(0,0,0,0.10)).
- **Primary (Indigo accent):** #2B3A67 — actions, links, focus. Hover #3A4C82, tint bg #ECEFF6.
- **Semantic tiers (the bucket system — color AND label, colorblind-safe):**
  - Reach — fill #FAECE7, text #712B13, dot #F0997B
  - Target — fill #FAEEDA, text #633806, dot #EF9F27
  - Likely — fill #E6F1FB, text #0C447C, dot #85B7EB
  - Safety — fill #E1F5EE, text #085041, dot #5DCAA5
- **Semantic UI:** success #0F6E56 · warning #854F0B · error #A32D2D · info #2B3A67.
- **Dark mode:** deferred to Phase 4+. When added, redesign surfaces (don't invert),
  drop saturation ~15%, keep the paper warmth as a near-black warm charcoal.

## Spacing
- **Base unit:** 4px.
- **Density:** Comfortable. Generous around the verdict; tighter within data rows.
- **Scale:** 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64.

## Layout
- **Approach:** Hybrid — editorial (asymmetric, generous) for the verdict and marketing;
  grid-disciplined for the list, comparison, and matrix.
- **Max content width:** app 1080px · reading 720px.
- **Border radius:** sm 4px · md 6px · lg 10px · pill 999px (tags only). No bubble-radius
  on everything — editorial means squarer.

## Motion
- **Approach:** Minimal-functional + one intentional moment.
- **Easing:** enter ease-out · exit ease-in · move ease-in-out.
- **Duration:** micro 80ms · short 160ms · the verdict gets a 250ms fade+rise on load.
- Respect `prefers-reduced-motion`.

## ANTI-AI-SLOP BUILD RULES (hard requirements — the renderer preview can't show these)
The inline mockups read flat/minimal because the preview tool enforces that. The real
product must NOT. When building:
- **Start from full 21st.dev page templates** (via the `magic` MCP:
  `mcp__magic__21st_magic_component_builder` / `21st_magic_component_inspiration`). Adapt
  real templates; do not hand-roll generic layouts. Pull interaction inspiration from the
  "UI/UX pro max" skill (install it or substitute `frontend-design`).
- **Use Fraunces at genuine display sizes** (32–40px+) for the verdict — this is the
  single biggest anti-AI lever. A small neutral sans header is the AI tell.
- **Asymmetric, composition-first layouts.** No centered-everything, no uniform 3-column
  card grid, no hero-with-gradient.
- **Paper background, never gray-on-white SaaS.** Warmth is the differentiator.
- **Theme shadcn/ui primitives** so they don't read as default shadcn.
- BANNED: purple/violet gradients, gradient CTA buttons, icon-in-colored-circle grids,
  bubble-radius on all elements, system-ui as display/body font, emoji as icons,
  stock-photo hero sections.

## Screens
1. **My list** — verdict centerpiece + reorderable rows (importance stars · tier · projected
   odds est. · deadline). See main design doc.
2. **Comparison** — side-by-side; net price by income lives here.
3. **Deadlines** — "due this week," source + last-verified per item.
4. **Decision matrix** — scatter/quadrant plot: x = projected acceptance rate, y = the
   student's personal grade/importance. Reveals dream-reaches vs strong-bets vs cut
   candidates. See main design doc for the full spec.

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-06-15 | Initial design system created | /design-consultation — calm editorial, Fraunces + Geist, paper + indigo, restrained color |
| 2026-06-15 | Serif (Fraunces) for the verdict voice | Warmth + memorability + trust where peers use cold sans |
| 2026-06-15 | 21st.dev templates required for build | User directive: product must not look AI-generated |
