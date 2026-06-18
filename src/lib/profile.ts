export interface Profile {
  sat: number;
  act: number | null;
  gpa: number | null; // unweighted, 0-4
  major: string;
}

export const DEFAULT_PROFILE: Profile = { sat: 1450, act: null, gpa: null, major: "" };
