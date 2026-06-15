import type { ScoredSchool } from "@/lib/data";

const MONTHS: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};

// Mock deadlines are "Mon D". The application cycle spans the fall into the new
// year, so Oct-Dec land in the earlier year and Jan-Sep in the next.
export function parseDeadline(s: string, baseYear = 2026): Date {
  const [mon, day] = s.split(" ");
  const m = MONTHS[mon] ?? 0;
  const year = m >= 9 ? baseYear : baseYear + 1;
  return new Date(year, m, Number(day) || 1);
}

export interface DatedSchool {
  school: ScoredSchool;
  date: Date;
  monthLabel: string;
}

export function sortByDeadline(schools: ScoredSchool[]): DatedSchool[] {
  return schools
    .map((school) => {
      const date = parseDeadline(school.deadline);
      return {
        school,
        date,
        monthLabel: date.toLocaleString("en-US", { month: "long", year: "numeric" }),
      };
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime());
}

export function groupByMonth(dated: DatedSchool[]): [string, DatedSchool[]][] {
  const groups: Record<string, DatedSchool[]> = {};
  for (const d of dated) (groups[d.monthLabel] ??= []).push(d);
  return Object.entries(groups);
}
