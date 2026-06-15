"use client";

import { useMemo } from "react";
import type { Tier } from "@/lib/listHealth.mjs";
import { useLocalStorage } from "@/lib/storage";
import { initialSchools, type ScoredSchool } from "@/lib/data";
import { sortByDeadline, groupByMonth } from "@/lib/deadlines";

const TIER_CLASS: Record<Tier, string> = {
  reach: "bg-reach-fill text-reach-text",
  target: "bg-target-fill text-target-text",
  likely: "bg-likely-fill text-likely-text",
  safety: "bg-safety-fill text-safety-text",
};

export default function DeadlinesPage() {
  const [schools] = useLocalStorage<ScoredSchool[]>("shortlist:schools", initialSchools);
  const groups = useMemo(() => groupByMonth(sortByDeadline(schools)), [schools]);
  const soonest = useMemo(() => sortByDeadline(schools)[0]?.school.id, [schools]);

  return (
    <main className="mx-auto max-w-app px-6 py-10">
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-semibold tracking-tight">Deadlines</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Every application deadline on your list, in order. We email you before each one.
        </p>
      </div>

      {schools.length === 0 ? (
        <div className="rounded-lg border border-hairline bg-surface px-5 py-10 text-center text-sm text-ink-muted">
          No schools yet. Add some on My list and their deadlines show up here.
        </div>
      ) : (
        <div className="space-y-6">
          {groups.map(([month, items]) => (
            <section key={month}>
              <h2 className="mb-2 text-xs uppercase tracking-[0.1em] text-ink-faint">{month}</h2>
              <div className="overflow-hidden rounded-lg border border-hairline bg-surface">
                {items.map(({ school: s, date }) => (
                  <div key={s.id}
                    className="flex items-center justify-between gap-4 border-b border-hairline px-5 py-3.5 last:border-b-0">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{s.name}</span>
                        {s.id === soonest && (
                          <span className="rounded-full bg-accent-tint px-2 py-0.5 text-xs text-accent">Next up</span>
                        )}
                        {s.tier !== "unknown" && (
                          <span className={`rounded-full px-2 py-0.5 text-xs ${TIER_CLASS[s.tier as Tier]}`}>{s.tier}</span>
                        )}
                      </div>
                      <div className="mt-0.5 text-xs text-ink-faint">
                        Source: Common App · verified Jun 2026
                      </div>
                    </div>
                    <div className="nums shrink-0 text-right text-sm text-ink-muted">
                      {date.toLocaleString("en-US", { month: "short", day: "numeric" })}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      <p className="mt-4 text-xs text-ink-faint">
        Dates shown with their source and last-verified date — nothing is published until a human checks it.
        Real version adds FAFSA/CSS and per-school supplement deadlines.
      </p>
    </main>
  );
}
