"use client";

import { useMemo } from "react";
import Link from "next/link";
import type { Tier } from "@/lib/listHealth.mjs";
import { useLocalStorage } from "@/lib/storage";
import { initialSchools, type ScoredSchool } from "@/lib/data";
import { defaultCriteria, type Criterion } from "@/lib/criteria";
import { weightedFit } from "@/lib/fit";
import { DEFAULT_PROFILE, type Profile } from "@/lib/profile";

const TIER_CLASS: Record<Tier, string> = {
  reach: "bg-reach-fill text-reach-text",
  target: "bg-target-fill text-target-text",
  likely: "bg-likely-fill text-likely-text",
  safety: "bg-safety-fill text-safety-text",
};

type Better = "high" | "low" | null;

export default function ComparePage() {
  const [schools] = useLocalStorage<ScoredSchool[]>("shortlist:schools", initialSchools);
  const [crit] = useLocalStorage<Criterion[]>("shortlist:criteria", defaultCriteria);
  const [overrides] = useLocalStorage<Record<string, Record<string, number>>>("shortlist:scoreOverrides", {});
  const [profile] = useLocalStorage<Profile>("shortlist:profile", DEFAULT_PROFILE);
  const [selected, setSelected] = useLocalStorage<string[]>(
    "shortlist:compare",
    initialSchools.slice(0, 3).map((s) => s.id)
  );

  const effective = (s: ScoredSchool): Record<string, number> => ({ ...s.scores, ...(overrides[s.id] ?? {}) });
  const fitOf = (s: ScoredSchool) => weightedFit(effective(s), crit);

  const chosen = useMemo(
    () => schools.filter((s) => selected.includes(s.id)).slice(0, 3),
    [schools, selected]
  );

  const toggle = (id: string) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length >= 3 ? prev : [...prev, id]
    );

  const num = (s: ScoredSchool, key: string): number =>
    key === "fit" ? fitOf(s)
    : key === "admitRate" ? s.admitRate
    : key === "netPrice" ? s.netPrice
    : key === "projected" ? (s.projected ?? -1)
    : effective(s)[key] ?? 0;

  const satVsRange = (s: ScoredSchool) =>
    s.satP25 != null && s.satP75 != null
      ? `${profile.sat} vs ${s.satP25}–${s.satP75}`
      : `${profile.sat} · test-blind`;

  const rows: { label: string; key: string; better: Better; fmt: (s: ScoredSchool) => string }[] = [
    { label: "Fit for you", key: "fit", better: "high", fmt: (s) => `${Math.round((fitOf(s) / 5) * 100)}%` },
    { label: "Projected odds", key: "projected", better: "high", fmt: (s) => s.projectedLabel },
    { label: "Admit rate", key: "admitRate", better: "high", fmt: (s) => `${s.admitRate}%` },
    { label: "Net price / yr", key: "netPrice", better: "low", fmt: (s) => `$${s.netPrice.toLocaleString()}` },
    { label: "Your SAT vs range", key: "sat", better: null, fmt: satVsRange },
    { label: "Deadline", key: "deadline", better: null, fmt: (s) => s.deadline },
    ...defaultCriteria.map((c) => ({
      label: c.label, key: c.id, better: "high" as Better, fmt: (s: ScoredSchool) => `${effective(s)[c.id] ?? 0}/5`,
    })),
  ];

  const bestId = (key: string, better: Better) => {
    if (!better || chosen.length < 2) return null;
    let best = chosen[0];
    for (const s of chosen) {
      if (better === "high" ? num(s, key) > num(best, key) : num(s, key) < num(best, key)) best = s;
    }
    return chosen.every((s) => num(s, key) === num(best, key)) ? null : best.id;
  };

  const winnerName = (key: string, better: Better) => {
    const id = bestId(key, better);
    return id ? chosen.find((s) => s.id === id)?.name : null;
  };

  return (
    <main className="mx-auto max-w-app px-6 py-10">
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-semibold tracking-tight">Compare</h1>
        <p className="mt-1 text-sm text-ink-muted">Pick up to three schools. Best in each row is highlighted.</p>
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
        <>
          {chosen.length >= 2 && (
            <div className="mb-5 grid gap-3 sm:grid-cols-3">
              <Takeaway label="Best fit" name={winnerName("fit", "high")} />
              <Takeaway label="Best odds" name={winnerName("projected", "high")} />
              <Takeaway label="Lowest net price" name={winnerName("netPrice", "low")} />
            </div>
          )}

          <div className="overflow-x-auto rounded-lg border border-hairline bg-surface">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-hairline">
                  <th className="px-5 py-3 text-left font-medium text-ink-faint">Metric</th>
                  {chosen.map((s) => (
                    <th key={s.id} className="px-5 py-3 text-left">
                      <Link href={`/school/${s.id}`} className="font-serif text-base font-semibold hover:text-accent">{s.name}</Link>
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
                  const emphasize = r.key === "fit";
                  return (
                    <tr key={r.key} className={`border-b border-hairline last:border-b-0 ${emphasize ? "bg-accent-tint/40" : ""}`}>
                      <td className={`px-5 py-2.5 ${emphasize ? "font-medium text-ink" : "text-ink-muted"}`}>{r.label}</td>
                      {chosen.map((s) => (
                        <td key={s.id} className={`nums px-5 py-2.5 ${winner === s.id ? "font-medium text-accent" : "text-ink"}`}>
                          {r.fmt(s)}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      <p className="mt-3 text-xs text-ink-faint">
        “Fit for you” weights each factor by your Decision-matrix sliders. Net price is a single figure for now;
        net price by family income lands with Common Data Set numbers.
      </p>
    </main>
  );
}

function Takeaway({ label, name }: { label: string; name: string | null | undefined }) {
  return (
    <div className="rounded-lg border border-hairline bg-surface px-4 py-3">
      <div className="text-xs uppercase tracking-[0.08em] text-ink-faint">{label}</div>
      <div className="mt-0.5 font-serif text-lg font-semibold">{name ?? "Tie"}</div>
    </div>
  );
}
