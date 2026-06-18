"use client";

import { use, useState } from "react";
import Link from "next/link";
import type { Tier } from "@/lib/listHealth.mjs";
import { useLocalStorage } from "@/lib/storage";
import { initialSchools, buildSchool, type ScoredSchool } from "@/lib/data";
import { catalog } from "@/lib/catalog";
import { DEFAULT_PROFILE, type Profile } from "@/lib/profile";
import { explainTier } from "@/lib/explain";

const TIER_CLASS: Record<Tier, string> = {
  reach: "bg-reach-fill text-reach-text",
  target: "bg-target-fill text-target-text",
  likely: "bg-likely-fill text-likely-text",
  safety: "bg-safety-fill text-safety-text",
};
const STATUSES = ["Not started", "In progress", "Submitted"];

interface AppData {
  status: string;
  essays: { text: string; done: boolean }[];
}

export default function SchoolPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [profile] = useLocalStorage<Profile>("shortlist:profile", DEFAULT_PROFILE);
  const [schools] = useLocalStorage<ScoredSchool[]>("shortlist:schools", initialSchools);
  const [apps, setApps] = useLocalStorage<Record<string, AppData>>("shortlist:apps", {});
  const [essay, setEssay] = useState("");

  const cat = catalog.find((c) => c.id === id);
  const school = schools.find((s) => s.id === id) ?? (cat ? buildSchool(cat, 3, profile.sat) : null);

  if (!school) {
    return (
      <main className="mx-auto max-w-reading px-6 py-16 text-center">
        <h1 className="font-serif text-3xl font-semibold">School not found</h1>
        <Link href="/list" className="mt-3 inline-block text-accent">← Back to your list</Link>
      </main>
    );
  }

  const app: AppData = apps[id] ?? { status: "Not started", essays: [] };
  const update = (next: AppData) => setApps((prev) => ({ ...prev, [id]: next }));
  const why = explainTier(school, profile.sat);

  return (
    <main className="mx-auto max-w-reading px-6 py-10">
      <Link href="/list" className="text-sm text-ink-muted hover:text-ink">← Your list</Link>

      <div className="mt-3 flex flex-wrap items-baseline gap-3">
        <h1 className="font-serif text-3xl font-semibold tracking-tight">{school.name}</h1>
        {school.tier !== "unknown" && (
          <span className={`rounded-full px-2.5 py-0.5 text-xs ${TIER_CLASS[school.tier as Tier]}`}>{school.tier}</span>
        )}
        <span className="nums text-sm text-ink-muted">{school.projectedLabel} estimated chance</span>
      </div>

      {/* Why this verdict */}
      <section className="mt-6">
        <h2 className="font-serif text-lg font-semibold">Why this tier</h2>
        <ul className="mt-2 space-y-1.5 text-ink">
          {why.map((line, i) => (
            <li key={i} className="leading-relaxed">{line}</li>
          ))}
        </ul>
      </section>

      {/* The numbers + sources */}
      <section className="mt-8">
        <h2 className="font-serif text-lg font-semibold">The numbers</h2>
        <dl className="mt-2 divide-y divide-hairline border-y border-hairline">
          <Row label="Admission rate" value={`${school.admitRate}%`} />
          <Row label="SAT middle 50%" value={school.satP25 && school.satP75 ? `${school.satP25}–${school.satP75}` : "Not reported (test-blind)"} />
          <Row label="Net price / yr" value={`$${school.netPrice.toLocaleString()}`} />
          <Row label="Application deadline" value={school.deadline} />
        </dl>
        <p className="mt-2 text-xs text-ink-faint">
          Source: U.S. Dept. of Education College Scorecard. <Link href="/methodology" className="text-accent">Methodology</Link>
        </p>
      </section>

      {/* Application tracker */}
      <section className="mt-8">
        <h2 className="font-serif text-lg font-semibold">Application</h2>
        <div className="mt-2 flex items-center gap-2 text-sm">
          <span className="text-ink-muted">Status</span>
          <select value={app.status} onChange={(e) => update({ ...app, status: e.target.value })}
            className="rounded-md border border-hairline bg-surface px-3 py-1.5">
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>

        <h3 className="mt-5 text-sm font-medium">Supplemental essays</h3>
        <ul className="mt-2 space-y-2">
          {app.essays.map((es, i) => (
            <li key={i} className="flex items-center gap-2">
              <input type="checkbox" checked={es.done}
                onChange={(e) => update({ ...app, essays: app.essays.map((x, j) => j === i ? { ...x, done: e.target.checked } : x) })} />
              <span className={`flex-1 text-sm ${es.done ? "text-ink-faint line-through" : ""}`}>{es.text}</span>
              <button aria-label="Remove essay" onClick={() => update({ ...app, essays: app.essays.filter((_, j) => j !== i) })}
                className="text-ink-faint hover:text-verdict">×</button>
            </li>
          ))}
          {app.essays.length === 0 && <li className="text-sm text-ink-faint">No essays added yet.</li>}
        </ul>
        <form onSubmit={(e) => { e.preventDefault(); if (essay.trim()) { update({ ...app, essays: [...app.essays, { text: essay.trim(), done: false }] }); setEssay(""); } }}
          className="mt-3 flex gap-2">
          <input value={essay} onChange={(e) => setEssay(e.target.value)} placeholder="e.g. Why us? (250 words)"
            className="flex-1 rounded-md border border-hairline bg-surface px-3 py-2 text-sm" />
          <button type="submit" className="rounded-md border border-hairline px-3 py-2 text-sm hover:bg-accent-tint">Add</button>
        </form>
      </section>
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 text-sm">
      <dt className="text-ink-muted">{label}</dt>
      <dd className="nums">{value}</dd>
    </div>
  );
}
