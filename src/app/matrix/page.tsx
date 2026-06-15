"use client";

import { useEffect, useState } from "react";
import Radar from "@/components/Radar";
import { defaultCriteria, type Criterion } from "@/lib/criteria";

const KEY = "shortlist:matrix-weights";

export default function MatrixPage() {
  const [crit, setCrit] = useState<Criterion[]>(defaultCriteria);

  useEffect(() => {
    const saved = localStorage.getItem(KEY);
    if (!saved) return;
    try {
      const w = JSON.parse(saved) as Record<string, number>;
      setCrit((prev) => prev.map((c) => ({ ...c, weight: w[c.id] ?? c.weight })));
    } catch {
      /* ignore corrupt storage */
    }
  }, []);

  useEffect(() => {
    const w = Object.fromEntries(crit.map((c) => [c.id, c.weight]));
    localStorage.setItem(KEY, JSON.stringify(w));
  }, [crit]);

  const setWeight = (id: string, n: number) =>
    setCrit((prev) => prev.map((c) => (c.id === id ? { ...c, weight: n } : c)));

  return (
    <main className="mx-auto max-w-app px-6 py-10">
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-semibold tracking-tight">Weighted decision matrix</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Set how much each factor matters to you. Each school gets scored against this profile.
        </p>
      </div>

      <div className="grid items-center gap-6 rounded-lg border border-hairline bg-surface p-6 md:grid-cols-[minmax(0,1fr)_300px]">
        <Radar labels={crit.map((c) => c.label)} values={crit.map((c) => c.weight)} max={5} />

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

      <p className="mt-3 text-xs text-ink-faint">
        Your weights are saved automatically. Next: each school scored 0–5 per factor, then a
        weighted fit score, plotted against projected acceptance rate.
      </p>
    </main>
  );
}
