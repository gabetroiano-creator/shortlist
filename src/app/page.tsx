"use client";

import { useMemo, useState } from "react";
import { gradeList } from "@/lib/listHealth.mjs";
import type { Tier } from "@/lib/listHealth.mjs";
import { useLocalStorage } from "@/lib/storage";
import { initialSchools, buildSchool, reScore, type ScoredSchool } from "@/lib/data";
import { catalog } from "@/lib/catalog";
import SchoolRow, { ROW_GRID } from "@/components/SchoolRow";
import { encodeList } from "@/lib/share";

const DOT: Record<Tier, string> = {
  reach: "bg-reach-dot", target: "bg-target-dot", likely: "bg-likely-dot", safety: "bg-safety-dot",
};

export default function Home() {
  const [schools, setSchools] = useLocalStorage<ScoredSchool[]>("shortlist:schools", initialSchools);
  const [dragFrom, setDragFrom] = useState<number | null>(null);
  const [addQuery, setAddQuery] = useState("");
  const [profile, setProfile] = useLocalStorage("shortlist:profile", { sat: 1450 });

  const [copied, setCopied] = useState(false);

  const setSat = (sat: number) => {
    if (Number.isNaN(sat)) return;
    setProfile({ sat });
    setSchools((prev) => prev.map((s) => reScore(s, sat)));
  };

  const share = async () => {
    const url = `${location.origin}/shared?d=${encodeList(profile.sat, schools)}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy your read-only share link:", url);
    }
  };

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
    if (cat) setSchools((prev) => [...prev, buildSchool(cat, 3, profile.sat)]);
    setAddQuery("");
  };

  const matches = useMemo(() => {
    const q = addQuery.trim().toLowerCase();
    return q ? available.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 8) : [];
  }, [addQuery, available]);
  const addSafety = () => {
    const best = [...available].sort((a, b) => b.admitRate - a.admitRate)[0];
    if (best) setSchools((prev) => [...prev, buildSchool(best, 2, profile.sat)]);
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
      <div className="mb-6 flex items-baseline justify-between gap-3">
        <h1 className="font-serif text-2xl font-semibold tracking-tight">Your list</h1>
        <div className="flex items-center gap-3">
          <span className="nums hidden text-sm text-ink-muted sm:inline">{schools.length} schools</span>
          <button onClick={share} disabled={schools.length === 0}
            className="rounded-md border border-hairline px-3 py-1.5 text-sm hover:bg-accent-tint disabled:opacity-40">
            {copied ? "Copied!" : "Share"}
          </button>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-3 text-sm">
        <label htmlFor="sat" className="text-ink-muted">Your SAT</label>
        <input id="sat" type="number" min={400} max={1600} step={10} value={profile.sat}
          onChange={(e) => setSat(Number(e.target.value))}
          className="nums w-24 rounded-md border border-hairline bg-surface px-2 py-1" />
        <span className="text-xs text-ink-faint">Tiers and odds update as you change this</span>
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

      <div className="relative mt-6 sm:w-96">
        <input
          type="text"
          value={addQuery}
          onChange={(e) => setAddQuery(e.target.value)}
          placeholder="Add a school — search by name…"
          className="w-full rounded-md border border-hairline bg-surface px-3 py-2 text-sm"
          aria-label="Search for a school to add"
        />
        {addQuery.trim() && (
          <ul className="absolute z-10 mt-1 max-h-64 w-full overflow-auto rounded-md border border-hairline bg-surface">
            {matches.length === 0 ? (
              <li className="px-3 py-2 text-sm text-ink-muted">No matches in your list’s catalog.</li>
            ) : (
              matches.map((cat) => (
                <li key={cat.id}>
                  <button onClick={() => add(cat.id)}
                    className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm hover:bg-accent-tint">
                    <span className="truncate">{cat.name}</span>
                    <span className="nums shrink-0 text-ink-faint">{cat.admitRate}% admit</span>
                  </button>
                </li>
              ))
            )}
          </ul>
        )}
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
