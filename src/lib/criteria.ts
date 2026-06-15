// Decision factors for the weighted decision matrix. The student weights each
// 0-5; schools are later scored against this profile. (See docs/design-doc.md.)

export interface Criterion {
  id: string;
  label: string;
  weight: number; // 0-5, student-set
}

export const defaultCriteria: Criterion[] = [
  { id: "academics", label: "Academics", weight: 5 },
  { id: "major", label: "Major strength", weight: 5 },
  { id: "outcomes", label: "Career outcomes", weight: 4 },
  { id: "aid", label: "Financial aid", weight: 4 },
  { id: "affordability", label: "Affordability", weight: 4 },
  { id: "location", label: "Location", weight: 3 },
  { id: "campus", label: "Campus life", weight: 2 },
  { id: "selectivity", label: "Selectivity", weight: 3 },
];
