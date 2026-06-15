import { classifyAdmissionChance } from "@/lib/listHealth.mjs";
import type { ChanceResult } from "@/lib/listHealth.mjs";

// Phase-1 mock data. Real data comes from the College Scorecard ingest job
// (see docs/design-doc.md). The student profile would come from their account.

export const student = { sat: 1450 };

export interface School {
  id: string;
  name: string;
  admitRate: number; // percent
  satP25: number | null;
  satP75: number | null;
  netPrice: number; // $/yr after typical aid
  deadline: string;
  importance: number; // 0-5, student-set
  scores: Record<string, number>; // 0-5 per decision-factor id (see criteria.ts)
}

const raw: School[] = [
  { id: "stanford", name: "Stanford", admitRate: 4, satP25: 1500, satP75: 1570, netPrice: 19400, deadline: "Nov 1", importance: 5,
    scores: { academics: 5, major: 5, outcomes: 5, aid: 3, affordability: 2, location: 4, campus: 4, selectivity: 5 } },
  { id: "mit", name: "MIT", admitRate: 5, satP25: 1520, satP75: 1580, netPrice: 22100, deadline: "Jan 1", importance: 5,
    scores: { academics: 5, major: 5, outcomes: 5, aid: 3, affordability: 2, location: 3, campus: 3, selectivity: 5 } },
  { id: "ucb", name: "UC Berkeley", admitRate: 11, satP25: 1330, satP75: 1530, netPrice: 28600, deadline: "Nov 30", importance: 4,
    scores: { academics: 5, major: 5, outcomes: 4, aid: 3, affordability: 4, location: 4, campus: 4, selectivity: 4 } },
  { id: "bu", name: "Boston University", admitRate: 14, satP25: 1350, satP75: 1500, netPrice: 34000, deadline: "Jan 4", importance: 3,
    scores: { academics: 4, major: 4, outcomes: 4, aid: 3, affordability: 2, location: 5, campus: 4, selectivity: 3 } },
  { id: "ucd", name: "UC Davis", admitRate: 49, satP25: 1170, satP75: 1410, netPrice: 24800, deadline: "Nov 30", importance: 2,
    scores: { academics: 4, major: 4, outcomes: 3, aid: 4, affordability: 4, location: 3, campus: 3, selectivity: 2 } },
  { id: "slo", name: "Cal Poly SLO", admitRate: 67, satP25: 1240, satP75: 1440, netPrice: 25800, deadline: "Nov 30", importance: 2,
    scores: { academics: 4, major: 5, outcomes: 4, aid: 3, affordability: 4, location: 4, campus: 4, selectivity: 2 } },
];

export type ScoredSchool = School & ChanceResult;

export const initialSchools: ScoredSchool[] = raw.map((s) => ({
  ...s,
  ...classifyAdmissionChance({
    admitRate: s.admitRate,
    studentSat: student.sat,
    satP25: s.satP25,
    satP75: s.satP75,
  }),
}));
