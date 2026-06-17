// Phase-1 school catalog (mock). Real data comes from the College Scorecard
// ingest job (see docs/design-doc.md). `scores` are 0-5 per decision factor.

import stats from "@/data/scorecard-stats.json";

export interface CatalogSchool {
  id: string;
  name: string;
  admitRate: number; // percent
  satP25: number | null;
  satP75: number | null;
  netPrice: number; // $/yr after typical aid
  deadline: string;
  scores: Record<string, number>;
}

// scores keys: academics, major, outcomes, aid, affordability, location, campus, selectivity
const base: CatalogSchool[] = [
  { id: "stanford", name: "Stanford", admitRate: 4, satP25: 1500, satP75: 1570, netPrice: 19400, deadline: "Nov 1",
    scores: { academics: 5, major: 5, outcomes: 5, aid: 3, affordability: 2, location: 4, campus: 4, selectivity: 5 } },
  { id: "mit", name: "MIT", admitRate: 5, satP25: 1520, satP75: 1580, netPrice: 22100, deadline: "Jan 1",
    scores: { academics: 5, major: 5, outcomes: 5, aid: 3, affordability: 2, location: 3, campus: 3, selectivity: 5 } },
  { id: "neu", name: "Northeastern", admitRate: 7, satP25: 1420, satP75: 1540, netPrice: 39200, deadline: "Jan 1",
    scores: { academics: 4, major: 4, outcomes: 5, aid: 2, affordability: 1, location: 5, campus: 4, selectivity: 5 } },
  { id: "ucla", name: "UCLA", admitRate: 9, satP25: 1290, satP75: 1520, netPrice: 27000, deadline: "Nov 30",
    scores: { academics: 5, major: 5, outcomes: 4, aid: 3, affordability: 3, location: 5, campus: 5, selectivity: 5 } },
  { id: "ucb", name: "UC Berkeley", admitRate: 11, satP25: 1330, satP75: 1530, netPrice: 28600, deadline: "Nov 30",
    scores: { academics: 5, major: 5, outcomes: 4, aid: 3, affordability: 4, location: 4, campus: 4, selectivity: 4 } },
  { id: "usc", name: "USC", admitRate: 12, satP25: 1360, satP75: 1530, netPrice: 38000, deadline: "Jan 15",
    scores: { academics: 4, major: 4, outcomes: 5, aid: 3, affordability: 1, location: 5, campus: 5, selectivity: 4 } },
  { id: "nyu", name: "NYU", admitRate: 12, satP25: 1370, satP75: 1540, netPrice: 41000, deadline: "Jan 5",
    scores: { academics: 4, major: 4, outcomes: 4, aid: 2, affordability: 1, location: 5, campus: 3, selectivity: 4 } },
  { id: "bu", name: "Boston University", admitRate: 14, satP25: 1350, satP75: 1500, netPrice: 34000, deadline: "Jan 4",
    scores: { academics: 4, major: 4, outcomes: 4, aid: 3, affordability: 2, location: 5, campus: 4, selectivity: 3 } },
  { id: "umich", name: "U Michigan", admitRate: 18, satP25: 1350, satP75: 1530, netPrice: 29000, deadline: "Feb 1",
    scores: { academics: 5, major: 5, outcomes: 4, aid: 3, affordability: 3, location: 3, campus: 5, selectivity: 4 } },
  { id: "uci", name: "UC Irvine", admitRate: 21, satP25: 1170, satP75: 1420, netPrice: 24000, deadline: "Nov 30",
    scores: { academics: 4, major: 4, outcomes: 3, aid: 4, affordability: 4, location: 4, campus: 3, selectivity: 3 } },
  { id: "utaustin", name: "UT Austin", admitRate: 31, satP25: 1230, satP75: 1480, netPrice: 20000, deadline: "Dec 1",
    scores: { academics: 4, major: 5, outcomes: 4, aid: 4, affordability: 4, location: 4, campus: 5, selectivity: 3 } },
  { id: "sdsu", name: "San Diego State", admitRate: 39, satP25: 1080, satP75: 1300, netPrice: 19000, deadline: "Dec 1",
    scores: { academics: 3, major: 3, outcomes: 3, aid: 4, affordability: 4, location: 5, campus: 4, selectivity: 2 } },
  { id: "uw", name: "U Washington", admitRate: 48, satP25: 1220, satP75: 1460, netPrice: 18000, deadline: "Nov 15",
    scores: { academics: 4, major: 5, outcomes: 4, aid: 4, affordability: 5, location: 4, campus: 4, selectivity: 3 } },
  { id: "ucd", name: "UC Davis", admitRate: 49, satP25: 1170, satP75: 1410, netPrice: 24800, deadline: "Nov 30",
    scores: { academics: 4, major: 4, outcomes: 3, aid: 4, affordability: 4, location: 3, campus: 3, selectivity: 2 } },
  { id: "psu", name: "Penn State", admitRate: 55, satP25: 1160, satP75: 1370, netPrice: 28000, deadline: "Nov 30",
    scores: { academics: 4, major: 4, outcomes: 4, aid: 3, affordability: 3, location: 3, campus: 5, selectivity: 2 } },
  { id: "slo", name: "Cal Poly SLO", admitRate: 67, satP25: 1240, satP75: 1440, netPrice: 25800, deadline: "Nov 30",
    scores: { academics: 4, major: 5, outcomes: 4, aid: 3, affordability: 4, location: 4, campus: 4, selectivity: 2 } },
  { id: "asu", name: "Arizona State", admitRate: 88, satP25: 1120, satP75: 1380, netPrice: 15000, deadline: "Nov 1",
    scores: { academics: 3, major: 4, outcomes: 3, aid: 5, affordability: 5, location: 3, campus: 4, selectivity: 1 } },
  { id: "ufl", name: "University of Florida", admitRate: 23, satP25: 1300, satP75: 1470, netPrice: 11000, deadline: "Nov 1",
    scores: { academics: 4, major: 4, outcomes: 4, aid: 4, affordability: 5, location: 3, campus: 4, selectivity: 3 } },
  { id: "osu", name: "Ohio State", admitRate: 53, satP25: 1240, satP75: 1430, netPrice: 19000, deadline: "Nov 1",
    scores: { academics: 4, major: 4, outcomes: 4, aid: 3, affordability: 3, location: 3, campus: 5, selectivity: 2 } },
  { id: "wisc", name: "U Wisconsin–Madison", admitRate: 49, satP25: 1330, satP75: 1480, netPrice: 18000, deadline: "Feb 1",
    scores: { academics: 5, major: 4, outcomes: 4, aid: 3, affordability: 4, location: 3, campus: 5, selectivity: 3 } },
  { id: "illinois", name: "U Illinois Urbana-Champaign", admitRate: 45, satP25: 1290, satP75: 1490, netPrice: 17000, deadline: "Jan 5",
    scores: { academics: 5, major: 5, outcomes: 4, aid: 3, affordability: 4, location: 3, campus: 4, selectivity: 3 } },
  { id: "purdue", name: "Purdue", admitRate: 53, satP25: 1190, satP75: 1440, netPrice: 14000, deadline: "Jan 15",
    scores: { academics: 4, major: 5, outcomes: 4, aid: 4, affordability: 4, location: 3, campus: 4, selectivity: 2 } },
  { id: "umd", name: "U Maryland", admitRate: 45, satP25: 1320, satP75: 1500, netPrice: 16000, deadline: "Nov 1",
    scores: { academics: 4, major: 4, outcomes: 4, aid: 3, affordability: 4, location: 4, campus: 4, selectivity: 3 } },
  { id: "rutgers", name: "Rutgers", admitRate: 66, satP25: 1210, satP75: 1430, netPrice: 20000, deadline: "Dec 1",
    scores: { academics: 4, major: 4, outcomes: 4, aid: 3, affordability: 3, location: 4, campus: 3, selectivity: 2 } },
  { id: "indiana", name: "Indiana University", admitRate: 80, satP25: 1130, satP75: 1350, netPrice: 18000, deadline: "Nov 1",
    scores: { academics: 3, major: 4, outcomes: 3, aid: 3, affordability: 4, location: 3, campus: 4, selectivity: 1 } },
  { id: "msu", name: "Michigan State", admitRate: 83, satP25: 1100, satP75: 1320, netPrice: 17000, deadline: "Nov 1",
    scores: { academics: 3, major: 4, outcomes: 3, aid: 4, affordability: 4, location: 3, campus: 4, selectivity: 1 } },
  { id: "uga", name: "University of Georgia", admitRate: 40, satP25: 1240, satP75: 1420, netPrice: 14000, deadline: "Jan 1",
    scores: { academics: 4, major: 4, outcomes: 4, aid: 4, affordability: 4, location: 3, campus: 4, selectivity: 2 } },
  { id: "umn", name: "U Minnesota", admitRate: 75, satP25: 1250, satP75: 1480, netPrice: 16000, deadline: "Jan 1",
    scores: { academics: 4, major: 4, outcomes: 4, aid: 3, affordability: 4, location: 3, campus: 4, selectivity: 2 } },
  { id: "cuboulder", name: "CU Boulder", admitRate: 80, satP25: 1130, satP75: 1360, netPrice: 22000, deadline: "Jan 15",
    scores: { academics: 3, major: 4, outcomes: 3, aid: 3, affordability: 3, location: 5, campus: 4, selectivity: 1 } },
  { id: "arizona", name: "University of Arizona", admitRate: 87, satP25: 1110, satP75: 1350, netPrice: 14000, deadline: "Dec 1",
    scores: { academics: 3, major: 4, outcomes: 3, aid: 4, affordability: 4, location: 4, campus: 4, selectivity: 1 } },
];

// Merge real College Scorecard stats over the curated base (numbers only; curated
// names, deadlines, and factor scores are kept). Regenerate with `npm run ingest`.
// Test-blind schools (UC/CSU) keep null SAT ranges, which the engine treats as
// "selectivity only" — an honest fallback, not a guess.
type Stat = { admitRate: number | null; satP25: number | null; satP75: number | null; netPrice: number | null };
const STATS = stats as Record<string, Stat>;

export const catalog: CatalogSchool[] = base.map((s) => {
  const r = STATS[s.id];
  if (!r) return s;
  return {
    ...s,
    admitRate: r.admitRate ?? s.admitRate,
    satP25: r.satP25,
    satP75: r.satP75,
    netPrice: r.netPrice ?? s.netPrice,
  };
});
