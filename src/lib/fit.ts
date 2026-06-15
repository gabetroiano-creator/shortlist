import type { Criterion } from "@/lib/criteria";

// Weighted fit: how well a school's factor scores (0-5 each) match the student's
// importance weights. Returns 0-5. den===0 (all weights zero) => 0.
export function weightedFit(
  scores: Record<string, number>,
  criteria: Criterion[]
): number {
  let num = 0;
  let den = 0;
  for (const c of criteria) {
    num += (scores[c.id] ?? 0) * c.weight;
    den += c.weight;
  }
  return den ? num / den : 0;
}
