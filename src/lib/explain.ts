import type { ScoredSchool } from "@/lib/data";

const cap = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

// Plain-English "why this tier", comparing the student's stats to the school's
// reported numbers. (GPA comparison lands once CDS data is ingested.)
export function explainTier(s: ScoredSchool, sat: number): string[] {
  if (s.tier === "unknown") {
    return ["We don't have enough data to estimate your odds here yet."];
  }
  const out: string[] = [];
  out.push(`${s.name} admits about ${s.admitRate}% of applicants.`);

  if (s.satP25 != null && s.satP75 != null) {
    if (sat >= s.satP75) {
      out.push(`Your SAT (${sat}) is at or above their top quartile (${s.satP75}) — that lifts the estimate.`);
    } else if (sat <= s.satP25) {
      out.push(`Your SAT (${sat}) is below their middle 50% (${s.satP25}–${s.satP75}) — that lowers it.`);
    } else {
      out.push(`Your SAT (${sat}) sits inside their middle 50% (${s.satP25}–${s.satP75}).`);
    }
  } else {
    out.push(`This school doesn't report test scores (many are now test-blind), so the estimate uses selectivity alone.`);
  }

  if (s.admitRate < 10) {
    out.push(`At under 10% admit, it's a reach for nearly everyone — strong scores don't change that.`);
  } else {
    out.push(`Putting that together: an estimated ${s.projectedLabel} chance, which we call a ${cap(s.tier)}.`);
  }
  return out;
}
