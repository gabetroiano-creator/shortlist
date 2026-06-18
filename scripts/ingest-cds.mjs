// Common Data Set ingest. Pulls each school's latest CDS PDF (via the College
// Transitions repository's Google-Drive links), extracts the average admitted
// GPA (CDS C12) and SAT-submission rate (C9), and writes src/data/cds-stats.json.
//
// Run: npm run ingest:cds
//
// Honesty: we only write a value we could actually parse. Anything we couldn't
// read stays absent (the UI then simply doesn't show it) — never a guess.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PDFParse } from "pdf-parse";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const CT_URL = "https://www.collegetransitions.com/dataverse/common-data-set-repository/";

// our catalog id -> a distinctive substring of the school's CDS-repository name
const MATCH = {
  stanford: "Stanford University", mit: "Massachusetts Institute of Technology",
  neu: "Northeastern University", ucla: "University of California-Los Angeles",
  ucb: "University of California-Berkeley", usc: "University of Southern California",
  nyu: "New York University", bu: "Boston University", umich: "University of Michigan-Ann Arbor",
  uci: "University of California-Irvine", utaustin: "University of Texas at Austin",
  sdsu: "San Diego State University", uw: "University of Washington", ucd: "University of California-Davis",
  psu: "Pennsylvania State University", slo: "California Polytechnic State University",
  asu: "Arizona State University", ufl: "University of Florida", osu: "Ohio State University",
  wisc: "University of Wisconsin-Madison", illinois: "University of Illinois", purdue: "Purdue University",
  umd: "University of Maryland", rutgers: "Rutgers University", indiana: "Indiana University",
  msu: "Michigan State University", uga: "University of Georgia", umn: "University of Minnesota",
  cuboulder: "University of Colorado Boulder", arizona: "University of Arizona",
  vanderbilt: "Vanderbilt University", rice: "Rice University", emory: "Emory University",
  notredame: "University of Notre Dame", georgetown: "Georgetown University",
  cmu: "Carnegie Mellon University", tufts: "Tufts University", williams: "Williams College",
  amherst: "Amherst College", pomona: "Pomona College", wakeforest: "Wake Forest University",
  tulane: "Tulane University", villanova: "Villanova University", syracuse: "Syracuse University",
  clemson: "Clemson University", uconn: "University of Connecticut",
};

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

async function getDriveMap() {
  const html = await (await fetch(CT_URL)).text();
  // rows: <td>School</td><td><a href="...drive.google.com/file/d/ID/view...">
  const map = {};
  const rowRe = /<td>([^<]+)<\/td><td><a[^>]*drive\.google\.com\/file\/d\/([A-Za-z0-9_-]+)/g;
  let m;
  while ((m = rowRe.exec(html))) {
    const name = m[1].trim();
    if (!(norm(name) in map)) map[norm(name)] = { name, id: m[2] }; // first = latest year
  }
  return map;
}

async function parsePdf(buf) {
  const r = await new PDFParse({ data: buf }).getText();
  const t = (r.text || "").replace(/\s+/g, " ");
  const gpa = t.match(/Average high school GPA[^0-9]{0,40}?([0-4]\.\d{1,2})/i);
  const sat = t.match(/Percent submitting SAT[^0-9]{0,30}?(\d{1,3})\s*%/i);
  return {
    avgGpa: gpa ? Number(gpa[1]) : null,
    pctSubmitSat: sat ? Number(sat[1]) : null,
  };
}

async function main() {
  const drive = await getDriveMap();
  const driveNorm = Object.values(drive);
  const out = {};
  const report = [];

  for (const [id, name] of Object.entries(MATCH)) {
    const hit = driveNorm.find((d) => norm(d.name).includes(norm(name)));
    if (!hit) { report.push(`${id}: NO MATCH for "${name}"`); continue; }
    try {
      const res = await fetch(`https://drive.google.com/uc?export=download&id=${hit.id}`);
      const buf = Buffer.from(await res.arrayBuffer());
      const { avgGpa, pctSubmitSat } = await parsePdf(buf);
      if (avgGpa != null || pctSubmitSat != null) {
        out[id] = { avgGpa, pctSubmitSat };
        report.push(`${id}: gpa=${avgGpa ?? "—"} satSubmit=${pctSubmitSat ?? "—"}%  (${hit.name})`);
      } else {
        report.push(`${id}: parsed but no fields  (${hit.name})`);
      }
    } catch (e) {
      report.push(`${id}: ERROR ${e.message}`);
    }
  }

  const dir = join(root, "src", "data");
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "cds-stats.json"), JSON.stringify(out, null, 2) + "\n");
  console.log(report.join("\n"));
  console.log(`\nWrote ${Object.keys(out).length}/${Object.keys(MATCH).length} schools to src/data/cds-stats.json`);
}

main().catch((e) => { console.error(e); process.exit(1); });
