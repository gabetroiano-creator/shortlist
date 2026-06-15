"use client";

import { useMemo, useState } from "react";
import { gradeList } from "@/lib/listHealth.mjs";
import type { Tier, TierOrUnknown } from "@/lib/listHealth.mjs";
import { useLocalStorage } from "@/lib/storage";
import { initialSchools, type ScoredSchool } from "@/lib/data";

const TIER_CLASS: Record<Tier, string> = {
  reach: "bg-reach-fill text-reach-text",
  target: "bg-target-fill text-target-text",
  likely: "bg-likely-fill text-likely-text",
  safety: "bg-safety-fill text-safety-text",
};
const TIER_LABEL: Record<TierOrUnknown, string> = {
  reach: "Reach",
  target: "Target",
  likely: "Likely",
  safety: "Safety",
  unknown: "Unknown",
};
const DOT: Record<Tier, string> = {
  reach: "bg-reach-dot",
  target: "bg-target-dot",
  likely: "bg-likely-dot",
  safety: "bg-safety-dot",
};

function Stars({ value, onSet }: { value: number; onSet: (n: number) => void }) {
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          aria-label={`Set importance ${n}`}
          onClick={() => onSet(n)}
          className={`text-base leading-none ${n <= value ? "text-[#BA7517]" : "text-hairline"}`}
        >
          ★
        </button>
      ))}
    </span>
  );
}

export default function Home() {
  const [schools, setSchools] = useLocalStorage<ScoredSchool[]>("shortlist:schools", initialSchools);
  const [dragFrom, setDragFrom] = useState<number | null>(null);

  const grade = useMemo(() => gradeList(schools), [schools]);
  const c = grade.counts;
  const placed = c.reach + c.target + c.likely + c.safety || 1;

  const setImportance = (id: string, n: number) =>
    setSchools((prev) => prev.map((s) => (s.id === id ? { ...s, importance: n } : s)));

  const onDrop = (to: number) => {
    setSchools((prev) => {
      if (dragFrom === null || dragFrom === to) return prev;
      const next = [...prev];
      const [moved] = next.splice(dragFrom, 1);
      next.splice(to, 0, moved);
      return next;
    });
    setDragFrom(null);
  };

  return (
    <main className="mx-auto max-w-app px-6 py-10">
      <div className="mb-6 flex items-baseline justify-between">
        <h1 className="font-serif text-2xl font-semibold tracking-tight">Your list</h1>
        <span className="text-sm text-ink-muted nums">{schools.length} schools · senior year</span>
      </div>

      <section className="rounded-lg border border-hairline bg-surface p-7">
        <p className="mb-2 text-xs uppercase tracking-[0.1em] text-ink-faint">List health</p>
        <p className="verdict-rise font-serif text-[30px] font-semibold leading-tight text-verdict">
          {grade.verdict}
        </p>

        <div className="mt-5 flex h-2.5 overflow-hidden rounded-full">
          <span className="bg-reach-dot" style={{ flex: c.reach || 0.0001 }} />
          <span className="bg-target-dot" style={{ flex: c.target || 0.0001 }} />
          <span className="bg-likely-dot" style={{ flex: c.likely || 0.0001 }} />
          <span className="bg-safety-dot" style={{ flex: c.safety || 0.0001 }} />
        </div>
        <div className="mt-2 flex flex-wrap gap-4 text-sm text-ink-muted nums">
          {(["reach", "target", "likely", "safety"] as Tier[]).map((t) => (
            <span key={t} className="inline-flex items-center gap-1.5">
              <span className={`inline-block h-2 w-2 rounded-full ${DOT[t]}`} />
              {c[t]} {t}
            </span>
          ))}
        </div>

        {grade.suggestions[0] && (
          <button className="mt-5 rounded-md bg-accent px-4 py-2 text-sm text-paper hover:bg-accent-hover">
            Add a safety school
          </button>
        )}
      </section>

      <div className="mt-6 overflow-hidden rounded-lg border border-hairline bg-surface">
        <div className="grid grid-cols-[20px_minmax(0,1.6fr)_1.4fr_0.9fr_0.9fr_0.8fr] gap-2 border-b border-hairline px-5 py-2 text-xs text-ink-faint">
          <span /><span>School</span><span>Importance</span><span>Tier</span><span>Projected</span><span>Deadline</span>
        </div>

        {schools.map((s, i) => (
          <div
            key={s.id}
            draggable
            onDragStart={() => setDragFrom(i)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => onDrop(i)}
            className="grid grid-cols-[20px_minmax(0,1.6fr)_1.4fr_0.9fr_0.9fr_0.8fr] items-center gap-2 border-b border-hairline px-5 py-3 last:border-b-0"
          >
            <span className="cursor-grab select-none text-ink-faint" aria-hidden>⠿</span>
            <span className="text-sm font-medium">{s.name}</span>
            <Stars value={s.importance} onSet={(n) => setImportance(s.id, n)} />
            <span>
              {s.tier === "unknown" ? (
                <span className="text-sm text-ink-faint">—</span>
              ) : (
                <span className={`rounded-full px-2.5 py-0.5 text-xs ${TIER_CLASS[s.tier as Tier]}`}>
                  {TIER_LABEL[s.tier]}
                </span>
              )}
            </span>
            <span className="text-sm text-ink-muted nums" title={s.basis}>
              {s.projectedLabel}
              {s.projected !== null && <span className="text-ink-faint"> est</span>}
            </span>
            <span className="text-sm text-ink-muted nums">{s.deadline}</span>
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs text-ink-faint">
        Projected odds are an estimate ({Math.round((c.reach / placed) * 100)}% of your list is reaches).
        Tap stars to set importance; drag the handle to reorder.
      </p>
    </main>
  );
}
