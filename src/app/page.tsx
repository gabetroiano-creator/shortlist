"use client";

import { useMemo, useState } from "react";
import { gradeList } from "@/lib/listHealth.mjs";
import type { Tier } from "@/lib/listHealth.mjs";
import { useLocalStorage } from "@/lib/storage";
import { initialSchools, buildSchool, type ScoredSchool } from "@/lib/data";
import { catalog } from "@/lib/catalog";
import SchoolRow, { ROW_GRID } from "@/components/SchoolRow";

const DOT: Record<Tier, string> = {
  reach: "bg-reach-dot", target: "bg-target-dot", likely: "bg-likely-dot", safety: "bg-safety-dot",
};

export default function Home() {
  const [schools, setSchools] = useLocalStorage<ScoredSchool[]>("shortlist:schools", initialSchools);
  const [dragFrom, setDragFrom] = useState<number | null>(null);
  const [addId, setAddId] = useState("");

  const grade = useMemo(() => gradeList(schools), [schools]);
  const c = grade.counts;
  const placed = c.reach + c.target + c.likely + c.safety || 1;
  const available = useMemo(
    () => catalog.filter((cat) => !schools.some((s) => s.id === cat.id)),
    [schools]
  );

  const setImportance = (id: string, n: number) =>
    setSchools((prev) => prev.map((s) => (s.id === id ? { ...s, importance: n } : s)));
  const remove = (id: string) => setSchools((prev) => prev.filter((s) => s.id !== id));
  const add = (id: string) => {
    const cat = catalog.find((x) => x.id === id);
    if (cat) setSchools((prev) => [...prev, buildSchool(cat, 3)]);
    setAddId("");
  };
  const addSafety = () => {
    const best = [...available].sort((a, b) => b.admitRate - a.admitRate)[0];
    if (best) setSchools((prev) => [...prev, buildSchool(best, 2)]);
  };
  const onDrop = (to: number) =>
    setSchools((prev) => {
      if (dragFrom === null || dragFrom === to) return prev;
      const next = [...prev];
      const [moved] = next.splice(dragFrom, 1);
      next.splice(to, 0, moved);
      return next;
    });

  return (
    <main className="mx-auto max-w-app px-6 py-10">
      <div className="mb-6 flex items-baseline justify-between">
        <h1 className="font-serif text-2xl font-semibold tracking-tight">Your list</h1>
        <span className="nums text-sm text-ink-muted">{schools.length} schools · senior year</span>
      </div>

      <section className="rounded-lg border border-hairline bg-surface p-6 sm:p-7">
        <p className="mb-2 text-xs uppercase tracking-[0.1em] text-ink-faint">List health</p>
        <p className="verdict-rise font-serif text-2xl font-semibold leading-tight text-verdict sm:text-[30px]">
          {grade.verdict}
        </p>

        <div className="mt-5 flex h-2.5 overflow-hidden rounded-full">
          <span className="bg-reach-dot" style={{ flex: c.reach || 0.0001 }} />
          <span className="bg-target-dot" style={{ flex: c.target || 0.0001 }} />
          <span className="bg-likely-dot" style={{ flex: c.likely || 0.0001 }} />
          <span className="bg-safety-dot" style={{ flex: c.safety || 0.0001 }} />
        </div>
        <div className="nums mt-2 flex flex-wrap gap-4 text-sm text-ink-muted">
          {(["reach", "target", "likely", "safety"] as Tier[]).map((t) => (
            <span key={t} className="inline-flex items-center gap-1.5">
              <span className={`inline-block h-2 w-2 rounded-full ${DOT[t]}`} />{c[t]} {t}
            </span>
          ))}
        </div>

        {c.safety === 0 && available.length > 0 && (
          <button onClick={addSafety} className="mt-5 rounded-md bg-accent px-4 py-2 text-sm text-paper hover:bg-accent-hover">
            Add a safety school
          </button>
        )}
      </section>

      <div className="mt-6 flex items-center gap-2">
        <select value={addId} onChange={(e) => setAddId(e.target.value)}
          className="min-w-0 flex-1 rounded-md border border-hairline bg-surface px-3 py-2 text-sm sm:flex-none">
          <option value="">Add a school…</option>
          {available.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name} · {cat.admitRate}% admit</option>
          ))}
        </select>
        <button onClick={() => addId && add(addId)} disabled={!addId}
          className="rounded-md border border-hairline px-3 py-2 text-sm hover:bg-accent-tint disabled:opacity-40">
          Add
        </button>
      </div>

      <div className="mt-3 overflow-hidden rounded-lg border border-hairline bg-surface">
        <div className={`hidden gap-2 border-b border-hairline px-5 py-2 text-xs text-ink-faint sm:grid ${ROW_GRID}`}>
          <span /><span>School</span><span>Importance</span><span>Tier</span><span>Projected</span><span>Deadline</span><span />
        </div>

        {schools.map((s, i) => (
          <SchoolRow key={s.id} s={s} index={i}
            onImportance={setImportance} onRemove={remove}
            onDragStart={setDragFrom} onDragOver={(e) => e.preventDefault()} onDrop={onDrop} />
        ))}

        {schools.length === 0 && (
          <div className="px-5 py-10 text-center text-sm text-ink-muted">
            Your list is empty. Add a school above to get started.
          </div>
        )}
      </div>

      <p className="mt-3 text-xs text-ink-faint">
        Projected odds are an estimate ({Math.round((c.reach / placed) * 100)}% of your list is reaches).
        Tap stars to set importance; drag to reorder; × to remove.
      </p>
    </main>
  );
}
