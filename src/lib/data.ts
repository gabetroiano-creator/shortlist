import { classifyAdmissionChance } from "@/lib/listHealth.mjs";
import type { ChanceResult } from "@/lib/listHealth.mjs";
import { catalog, type CatalogSchool } from "@/lib/catalog";

// The student profile would come from their account; mocked for Phase 1.
export const student = { sat: 1450 };

export type ScoredSchool = CatalogSchool & { importance: number } & ChanceResult;

// Build a school for the student: attach importance + an honest chance at their SAT.
export function buildSchool(c: CatalogSchool, importance: number, sat: number = student.sat): ScoredSchool {
  return {
    ...c,
    importance,
    ...classifyAdmissionChance({
      admitRate: c.admitRate,
      studentSat: sat,
      satP25: c.satP25,
      satP75: c.satP75,
    }),
  };
}

// Re-run the chance estimate for an existing school at a new SAT (keeps everything
// else). Used when the student updates their scores.
export function reScore(s: ScoredSchool, sat: number): ScoredSchool {
  return {
    ...s,
    ...classifyAdmissionChance({
      admitRate: s.admitRate,
      studentSat: sat,
      satP25: s.satP25,
      satP75: s.satP75,
    }),
  };
}

// Onboarding: turn a SAT into a balanced starter list (a couple from each tier).
export function buildStarterList(sat: number): ScoredSchool[] {
  const scored = catalog.map((c) => buildSchool(c, 3, sat));
  const ofTier = (t: string, n: number) => scored.filter((s) => s.tier === t).slice(0, n);
  return [
    ...ofTier("reach", 2),
    ...ofTier("target", 2),
    ...ofTier("likely", 1),
    ...ofTier("safety", 2),
  ];
}

const DEFAULT: [string, number][] = [
  ["stanford", 5],
  ["mit", 5],
  ["ucb", 4],
  ["bu", 3],
  ["ucd", 2],
  ["slo", 2],
];

export const initialSchools: ScoredSchool[] = DEFAULT.map(([id, imp]) =>
  buildSchool(catalog.find((c) => c.id === id)!, imp)
);
