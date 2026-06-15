# Shortlist

A free web app that helps high-school students build and run their college application
list: an honest "list health" verdict, school comparison, deadline tracking, a weighted
decision matrix, and a decision-analysis view. Stack (planned): Next.js + TypeScript +
Supabase + Vercel. This is its own project, unrelated to other folders in the workspace.

Design doc: `~/.gstack/projects/CLAUDECODE/gabrieletroiano-unknown-design-20260615-130036.md`

## Design System
Always read DESIGN.md before making any visual or UI decisions.
All font choices, colors, spacing, and aesthetic direction are defined there.
Do not deviate without explicit user approval.
In QA mode, flag any code that doesn't match DESIGN.md.

## Anti-AI-look build rule (non-negotiable)
The product must NOT look AI-generated. Start the frontend from full 21st.dev page
templates (via the `magic` MCP), use Fraunces at display sizes for the verdict, paper
background, asymmetric composition. See the "ANTI-AI-SLOP BUILD RULES" section of DESIGN.md.

## Core honesty rule
Admission chances are shown as labeled estimates (`~12% est` or a range), never fake
exact percentages. College Scorecard has no GPA data and test-optional thins score data —
do not imply precision the data can't support.
