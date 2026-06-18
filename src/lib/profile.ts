export interface Profile {
  sat: number;
  act: number | null;
  gpa: number | null; // unweighted, 0-4
  weightedGpa: number | null; // weighted (often 0-5)
  classRankPct: number | null; // top N% of class
  major: string;
  homeState: string; // for in-state public context (e.g. "CA")
  budget: number | null; // max net price you can pay /yr
}

export const DEFAULT_PROFILE: Profile = {
  sat: 1450,
  act: null,
  gpa: null,
  weightedGpa: null,
  classRankPct: null,
  major: "",
  homeState: "",
  budget: null,
};
