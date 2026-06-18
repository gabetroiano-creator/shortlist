"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { gradeList } from "@/lib/listHealth.mjs";
import type { Tier } from "@/lib/listHealth.mjs";
import { decodeList } from "@/lib/share";

const TIER_CLASS: Record<Tier, string> = {
  reach: "bg-reach-fill text-reach-text",
  target: "bg-target-fill text-target-text",
  likely: "bg-likely-fill text-likely-text",
  safety: "bg-safety-fill text-safety-text",
};
const DOT: Record<Tier, string> = {
  reach: "bg-reach-dot", target: "bg-target-dot", likely: "bg-likely-dot", safety: "bg-safety-dot",
};

function SharedView() {
  const params = useSearchParams();
  const data = useMemo(() => decodeList(params.get("d") ?? ""), [params]);

  if (!data || data.schools.length === 0) {
    return (
      <main className="mx-auto max-w-reading px-6 py-16 text-center">
        <h1 className="font-serif text-2xl font-semibold">Nothing to show</h1>
        <p className="mt-2 text-sm text-ink-muted">This share link is empty or invalid.</p>
      </main>
    );
  }

  const grade = gradeList(data.schools);
  const c = grade.counts;

  return (
    <main className="mx-auto max-w-app px-6 py-10">
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-semibold tracking-tight">A shared college list</h1>
        <p className="mt-1 text-sm text-ink-muted">Read-only · odds estimated at SAT {data.sat}</p>
      </div>

      <section className="rounded-lg border border-hairline bg-surface p-6 sm:p-7">
        <p className="mb-2 text-xs uppercase tracking-[0.1em] text-ink-faint">List health</p>
        <p className="font-serif text-2xl font-semibold leading-tight text-verdict sm:text-[30px]">{grade.verdict}</p>
        <div className="nums mt-4 flex flex-wrap gap-4 text-sm text-ink-muted">
          {(["reach", "target", "likely", "safety"] as Tier[]).map((t) => (
            <span key={t} className="inline-flex items-center gap-1.5">
              <span className={`inline-block h-2 w-2 rounded-full ${DOT[t]}`} />{c[t]} {t}
            </span>
          ))}
        </div>
      </section>

      <div className="mt-6 overflow-hidden rounded-lg border border-hairline bg-surface">
        {data.schools.map((s) => (
          <div key={s.id} className="flex items-center justify-between gap-4 border-b border-hairline px-5 py-3 last:border-b-0">
            <div className="flex min-w-0 items-center gap-2">
              <span className="truncate text-sm font-medium">{s.name}</span>
              {s.tier !== "unknown" && (
                <span className={`rounded-full px-2.5 py-0.5 text-xs ${TIER_CLASS[s.tier as Tier]}`}>{s.tier}</span>
              )}
            </div>
            <div className="nums flex shrink-0 items-center gap-4 text-sm text-ink-muted">
              <span>{s.projectedLabel}</span>
              <span>{s.deadline}</span>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-ink-faint">
        Made with Shortlist. <a href="/" className="text-accent">Build your own list →</a>
      </p>
    </main>
  );
}

export default function SharedPage() {
  return (
    <Suspense fallback={<main className="mx-auto max-w-app px-6 py-10 text-sm text-ink-muted">Loading…</main>}>
      <SharedView />
    </Suspense>
  );
}
