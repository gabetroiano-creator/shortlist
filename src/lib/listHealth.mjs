// Shortlist — list-health engine (the product spine).
//
// Pure functions, no I/O. Ported to TS in the app scaffold; kept runnable
// zero-dep here so the logic is tested before any UI exists.
//
// Honesty rule (see DESIGN.md / design-doc): projected odds are an ESTIMATE.
// We never claim precision the data can't support. College Scorecard gives
// admit rate + test ranges but NO admitted-GPA, and test-optional thins the
// score data — so when scores are missing we fall back to admit-rate-only and
// SAY SO in `basis`.
//
//   classifyAdmissionChance(input) -> { tier, projected, projectedLabel, basis }
//   gradeList(items)               -> { counts, total, balanced, verdict, suggestions }

const TIERS = ['reach', 'target', 'likely', 'safety'];

const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
const round = (n) => Math.round(n);

// Where the student's test score falls in the school's middle-50% band.
// Returns 'high' | 'mid' | 'low' | null (null = not enough data to compare).
function scorePosition(score, p25, p75) {
  if (score == null || p25 == null || p75 == null) return null;
  if (score >= p75) return 'high';
  if (score <= p25) return 'low';
  return 'mid';
}

// input: {
//   admitRate,            // percent 0-100 (school's overall admit rate)
//   studentSat, studentAct,
//   satP25, satP75, actP25, actP75   // school's reported middle 50% (may be absent)
// }
export function classifyAdmissionChance(input = {}) {
  const { admitRate } = input;

  // No admit rate => we can't honestly place this school.
  if (admitRate == null || Number.isNaN(admitRate)) {
    return { tier: 'unknown', projected: null, projectedLabel: '—', basis: 'not enough data' };
  }

  // Prefer SAT comparison; fall back to ACT; else null (test-optional / no scores).
  let pos = scorePosition(input.studentSat, input.satP25, input.satP75);
  if (pos == null) pos = scorePosition(input.studentAct, input.actP25, input.actP75);
  const basis = pos == null ? 'selectivity only' : 'scores + selectivity';

  // Start from the school's admit rate, nudge by how the student's scores sit.
  let proj = admitRate;
  if (pos === 'high') proj = admitRate * 1.6;
  else if (pos === 'low') proj = admitRate * 0.5;
  proj = clamp(proj, 1, 95);

  // Tier from the projection...
  let tier;
  if (proj < 20) tier = 'reach';
  else if (proj < 45) tier = 'target';
  else if (proj < 70) tier = 'likely';
  else tier = 'safety';

  // ...with honest hard caps on very selective schools. A 4%-admit school is a
  // reach for everyone, no matter the scores.
  if (admitRate < 10) tier = 'reach';
  else if (admitRate < 20 && (tier === 'safety' || tier === 'likely')) tier = 'target';

  return { tier, projected: round(proj), projectedLabel: `~${round(proj)}%`, basis };
}

// items: [{ tier }]  (tier in TIERS or 'unknown')
export function gradeList(items = []) {
  const counts = { reach: 0, target: 0, likely: 0, safety: 0, unknown: 0 };
  for (const it of items) {
    const t = it && it.tier;
    if (t in counts) counts[t] += 1;
  }
  const placed = counts.reach + counts.target + counts.likely + counts.safety;

  if (placed === 0) {
    return {
      counts, total: items.length, balanced: false,
      verdict: 'Add a few schools to see how your list is shaping up.',
      suggestions: ['Add at least one reach, one target, and one safety.'],
    };
  }

  const safeties = counts.safety;
  const middles = counts.target + counts.likely;
  const reachShare = counts.reach / placed;
  const balanced = safeties >= 1 && middles >= 1 && reachShare <= 0.6;

  const summary =
    `${counts.reach} ${counts.reach === 1 ? 'reach' : 'reaches'}, ` +
    `${counts.target} target, ${counts.likely} likely, ${counts.safety} safety`;

  const suggestions = [];
  if (safeties === 0) suggestions.push('You have no safety. Add at least one school you are very likely to get into.');
  if (middles === 0) suggestions.push('Your list is all-or-nothing. Add a target or likely school.');
  if (reachShare > 0.6) suggestions.push('Most of your list is reaches. Balance it with more targets and safeties.');

  let verdict;
  if (balanced) verdict = `${summary}. This is a balanced list — nice work.`;
  else if (safeties === 0) verdict = `${summary}. This is risky — add at least one safety.`;
  else if (reachShare > 0.6) verdict = `${summary}. Still top-heavy — add one more safety or target.`;
  else verdict = `${summary}. Almost there — ${suggestions[0] || 'tighten the balance'}.`;

  return { counts, total: items.length, balanced, verdict, suggestions };
}

export { scorePosition, TIERS };
