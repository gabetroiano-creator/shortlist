"use client";

import { useMemo, useState } from "react";
import Radar from "@/components/Radar";
import Scatter, { type Point } from "@/components/Scatter";
import { useLocalStorage } from "@/lib/storage";
import { weightedFit } from "@/lib/fit";
import { defaultCriteria, type Criterion } from "@/lib/criteria";
import { initialSchools, type ScoredSchool } from "@/lib/data";

const TIER_DOT: Record<string, string> = {
  reach: "#F0997B",
  target: "#EF9F27",
  likely: "#85B7EB",
  safety: "#5DCAA5",
  unknown: "#908A7E",
};

export default function MatrixPage() {
  const [crit, setCrit] = useLocalStorage<Criterion[]>("shortlist:criteria", defaultCriteria);
  const [schools] = useLocalStorage<ScoredSchool[]>("shortlist:schools", initialSchools);

  const [compareId, setCompareId] = useState("");
  const compareSchool = schools.find((s) => s.id === compareId);
  const overlay = compareSchool ? crit.map((c) => compareSchool.scores[c.id] ?? 0) : undefined;

  const setWeight = (id: string, n: number) =>
    setCrit((prev) => prev.map((c) => (c.id === id ? { ...c, weight: n } : c)));

  // Weighted fit recomputes live as the sliders move.
  const fits = useMemo(
    () => schools.map((s) => ({ s, fit: weightedFit(s.scores, crit) })),
    [schools, crit]
  );

  const vsImportance: Point[] = fits.map(({ s, fit }) => ({
    x: s.importance,
    y: fit,
    label: s.name,
    color: TIER_DOT[s.tier] ?? TIER_DOT.unknown,
  }));

  const vsAcceptance: Point[] = fits
    .filter(({ s }) => s.projected !== null)
    .map(({ s, fit }) => ({
      x: s.projected as number,
      y: fit,
      label: s.name,
      color: TIER_DOT[s.tier] ?? TIER_DOT.unknown,
    }));

  return (
    <main className="mx-auto max-w-app px-6 py-10">
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-semibold tracking-tight">Weighted decision matrix</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Set how much each factor matters to you. Each school is scored against this profile, then
          plotted below — drag a slider and watch the schools move.
        </p>
      </div>

      <div className="grid items-center gap-6 rounded-lg border border-hairline bg-surface p-6 md:grid-cols-[minmax(0,1fr)_300px]">
        <div>
          <Radar labels={crit.map((c) => c.label)} values={crit.map((c) => c.weight)} max={5} overlay={overlay} />
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <span className="inline-flex items-center gap-1.5 text-ink-muted">
              <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: "#C0452B" }} /> Your priorities
            </span>
            {compareSchool && (
              <span className="inline-flex items-center gap-1.5 text-ink-muted">
                <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: "#2B3A67" }} /> {compareSchool.name}
              </span>
            )}
            <select value={compareId} onChange={(e) => setCompareId(e.target.value)}
              className="ml-auto rounded-md border border-hairline bg-surface px-2 py-1 text-sm">
              <option value="">Overlay a school…</option>
              {schools.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="space-y-3">
          {crit.map((c) => (
            <div key={c.id} className="flex items-center gap-3">
              <label htmlFor={c.id} className="w-28 shrink-0 text-sm text-ink-muted">
                {c.label}
              </label>
              <input
                id={c.id}
                type="range"
                min={0}
                max={5}
                step={1}
                value={c.weight}
                onChange={(e) => setWeight(c.id, Number(e.target.value))}
                className="flex-1 accent-accent"
              />
              <span className="nums w-3 text-right text-sm font-medium text-accent">{c.weight}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <section className="rounded-lg border border-hairline bg-surface p-5">
          <h2 className="font-serif text-lg font-semibold">Fit vs. how much you want it</h2>
          <p className="mb-2 text-sm text-ink-muted">Top-right = you want it and it fits you.</p>
          <Scatter points={vsImportance} xLabel="Importance to you" yLabel="Weighted fit" xDomain={[0, 5]} yDomain={[0, 5]} />
        </section>
        <section className="rounded-lg border border-hairline bg-surface p-5">
          <h2 className="font-serif text-lg font-semibold">Fit vs. your odds</h2>
          <p className="mb-2 text-sm text-ink-muted">Top-right = good fit and reachable.</p>
          <Scatter points={vsAcceptance} xLabel="Projected acceptance rate" yLabel="Weighted fit" xDomain={[0, 100]} yDomain={[0, 5]} />
        </section>
      </div>

      <p className="mt-3 text-xs text-ink-faint">
        Weights and your list are saved automatically. Projected acceptance is an honest estimate.
      </p>
    </main>
  );
}
