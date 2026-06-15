"use client";

import { useMemo } from "react";
import type { Tier } from "@/lib/listHealth.mjs";
import { useLocalStorage } from "@/lib/storage";
import { initialSchools, type ScoredSchool } from "@/lib/data";
import { defaultCriteria } from "@/lib/criteria";

const TIER_CLASS: Record<Tier, string> = {
  reach: "bg-reach-fill text-reach-text",
  target: "bg-target-fill text-target-text",
  likely: "bg-likely-fill text-likely-text",
  safety: "bg-safety-fill text-safety-text",
};

type Better = "high" | "low" | null;
const num = (s: ScoredSchool, key: string) =>
  key === "admitRate" ? s.admitRate
  : key === "netPrice" ? s.netPrice
  : key === "projected" ? (s.projected ?? -1)
  : s.scores[key] ?? 0;

export default function ComparePage() {
  const [schools] = useLocalStorage<ScoredSchool[]>("shortlist:schools", initialSchools);
  const [selected, setSelected] = useLocalStorage<string[]>(
    "shortlist:compare",
    initialSchools.slice(0, 3).map((s) => s.id)
  );

  const chosen = useMemo(
    () => schools.filter((s) => selected.includes(s.id)).slice(0, 3),
    [schools, selected]
  );

  const toggle = (id: string) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length >= 3 ? prev : [...prev, id]
    );

  const rows: { label: string; key: string; better: Better; fmt: (s: ScoredSchool) => string }[] = [
    { label: "Projected odds", key: "projected", better: "high", fmt: (s) => s.projectedLabel + (s.projected !== null ? " est" : "") },
    { label: "Admit rate", key: "admitRate", better: "high", fmt: (s) => `${s.admitRate}%` },
    { label: "Net price / yr", key: "netPrice", better: "low", fmt: (s) => `$${s.netPrice.toLocaleString()}` },
    { label: "Deadline", key: "deadline", better: null, fmt: (s) => s.deadline },
    ...defaultCriteria.map((c) => ({
      label: c.label, key: c.id, better: "high" as Better, fmt: (s: ScoredSchool) => `${s.scores[c.id] ?? 0}/5`,
    })),
  ];

  const bestId = (key: string, better: Better) => {
    if (!better || chosen.length < 2) return null;
    let best = chosen[0];
    for (const s of chosen) {
      const v = num(s, key);
      const bv = num(best, key);
      if (better === "high" ? v > bv : v < bv) best = s;
    }
    // no winner if all equal
    return chosen.every((s) => num(s, key) === num(best, key)) ? null : best.id;
  };

  return (
    <main className="mx-auto max-w-app px-6 py-10">
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-semibold tracking-tight">Compare</h1>
        <p className="mt-1 text-sm text-ink-muted">Pick up to three schools to weigh side by side. Best in each row is highlighted.</p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {schools.map((s) => {
          const on = selected.includes(s.id);
          const disabled = !on && selected.length >= 3;
          return (
            <button key={s.id} onClick={() => toggle(s.id)} disabled={disabled}
              className={`rounded-full border px-3 py-1 text-sm ${
                on ? "border-accent bg-accent-tint text-accent" : "border-hairline text-ink-muted hover:border-accent"
              } ${disabled ? "opacity-40" : ""}`}>
              {s.name}
            </button>
          );
        })}
      </div>

      {chosen.length === 0 ? (
        <div className="rounded-lg border border-hairline bg-surface px-5 py-10 text-center text-sm text-ink-muted">
          Select at least one school above to compare.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-hairline bg-surface">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-hairline">
                <th className="px-5 py-3 text-left font-medium text-ink-faint">Metric</th>
                {chosen.map((s) => (
                  <th key={s.id} className="px-5 py-3 text-left font-serif text-base font-semibold">
                    {s.name}
                    {s.tier !== "unknown" && (
                      <span className={`ml-2 rounded-full px-2 py-0.5 align-middle text-xs ${TIER_CLASS[s.tier as Tier]}`}>{s.tier}</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const winner = bestId(r.key, r.better);
                return (
                  <tr key={r.key} className="border-b border-hairline last:border-b-0">
                    <td className="px-5 py-2.5 text-ink-muted">{r.label}</td>
                    {chosen.map((s) => (
                      <td key={s.id}
                        className={`nums px-5 py-2.5 ${winner === s.id ? "font-medium text-accent" : "text-ink"}`}>
                        {r.fmt(s)}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-3 text-xs text-ink-faint">
        Net price is a single figure in this mock; the real version shows net price by family income band.
      </p>
    </main>
  );
}
