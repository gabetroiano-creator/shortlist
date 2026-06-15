import { classifyAdmissionChance } from "@/lib/listHealth.mjs";
import type { ChanceResult } from "@/lib/listHealth.mjs";
import { catalog, type CatalogSchool } from "@/lib/catalog";

// The student profile would come from their account; mocked for Phase 1.
export const student = { sat: 1450 };

export type ScoredSchool = CatalogSchool & { importance: number } & ChanceResult;

// Build a school for the current student: attach importance + an honest chance.
export function buildSchool(c: CatalogSchool, importance: number): ScoredSchool {
  return {
    ...c,
    importance,
    ...classifyAdmissionChance({
      admitRate: c.admitRate,
      studentSat: student.sat,
      satP25: c.satP25,
      satP75: c.satP75,
    }),
  };
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
