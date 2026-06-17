// Ingest real admissions data from the College Scorecard API and write it to
// src/data/scorecard-stats.json (committed; contains only public stats, no key).
//
// Run: npm run ingest   (reads SCORECARD_API_KEY from env or .env.local)
//
// The catalog's curated factor scores + deadlines stay hand-authored; this only
// refreshes the objective numbers (admit rate, SAT range, net price, name).

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function loadKey() {
  if (process.env.SCORECARD_API_KEY) return process.env.SCORECARD_API_KEY;
  const envPath = join(root, ".env.local");
  if (existsSync(envPath)) {
    const m = readFileSync(envPath, "utf8").match(/^SCORECARD_API_KEY=(.+)$/m);
    if (m) return m[1].trim();
  }
  return null;
}

// our catalog id -> IPEDS unit id (Scorecard `id`)
const IPEDS = {
  stanford: 243744, mit: 166683, neu: 167358, ucla: 110662, ucb: 110635,
  usc: 123961, nyu: 193900, bu: 164988, umich: 170976, uci: 110653,
  utaustin: 228778, sdsu: 122409, uw: 236948, ucd: 110644, psu: 214777,
  slo: 110422, asu: 104151,
  ufl: 134130, osu: 204796, wisc: 240444, illinois: 145637, purdue: 243780,
  umd: 163286, rutgers: 186380, indiana: 151351, msu: 171100, uga: 139959,
  umn: 174066, cuboulder: 126614, arizona: 104179,
};

const FIELDS = [
  "id",
  "school.name",
  "latest.admissions.admission_rate.overall",
  "latest.admissions.sat_scores.25th_percentile.critical_reading",
  "latest.admissions.sat_scores.25th_percentile.math",
  "latest.admissions.sat_scores.75th_percentile.critical_reading",
  "latest.admissions.sat_scores.75th_percentile.math",
  "latest.cost.avg_net_price.overall",
].join(",");

async function main() {
  const key = loadKey();
  if (!key) {
    console.error("No SCORECARD_API_KEY found (env or .env.local). Aborting.");
    process.exit(1);
  }

  const ids = Object.values(IPEDS).join(",");
  const url =
    `https://api.data.gov/ed/collegescorecard/v1/schools?api_key=${key}` +
    `&id=${ids}&fields=${FIELDS}&per_page=100`;

  const res = await fetch(url);
  if (!res.ok) {
    console.error(`Scorecard API error ${res.status}: ${await res.text()}`);
    process.exit(1);
  }
  const json = await res.json();
  const byIpeds = new Map(Object.entries(IPEDS).map(([id, ip]) => [ip, id]));

  const stats = {};
  for (const r of json.results ?? []) {
    const ourId = byIpeds.get(r.id);
    if (!ourId) continue;
    const cr25 = r["latest.admissions.sat_scores.25th_percentile.critical_reading"];
    const m25 = r["latest.admissions.sat_scores.25th_percentile.math"];
    const cr75 = r["latest.admissions.sat_scores.75th_percentile.critical_reading"];
    const m75 = r["latest.admissions.sat_scores.75th_percentile.math"];
    const rate = r["latest.admissions.admission_rate.overall"];
    const net = r["latest.cost.avg_net_price.overall"];

    stats[ourId] = {
      name: r["school.name"],
      admitRate: rate != null ? Math.round(rate * 1000) / 10 : null,
      satP25: cr25 != null && m25 != null ? cr25 + m25 : null,
      satP75: cr75 != null && m75 != null ? cr75 + m75 : null,
      netPrice: net != null ? Math.round(net) : null,
    };
  }

  const found = Object.keys(stats).length;
  const missing = Object.keys(IPEDS).filter((id) => !stats[id]);
  const outDir = join(root, "src", "data");
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "scorecard-stats.json"), JSON.stringify(stats, null, 2) + "\n");

  console.log(`Wrote ${found}/${Object.keys(IPEDS).length} schools to src/data/scorecard-stats.json`);
  if (missing.length) console.log(`No data for: ${missing.join(", ")}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
