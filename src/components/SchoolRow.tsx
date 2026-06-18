"use client";

import Link from "next/link";
import type { Tier, TierOrUnknown } from "@/lib/listHealth.mjs";
import type { ScoredSchool } from "@/lib/data";

const TIER_CLASS: Record<Tier, string> = {
  reach: "bg-reach-fill text-reach-text",
  target: "bg-target-fill text-target-text",
  likely: "bg-likely-fill text-likely-text",
  safety: "bg-safety-fill text-safety-text",
};
const TIER_LABEL: Record<TierOrUnknown, string> = {
  reach: "Reach", target: "Target", likely: "Likely", safety: "Safety", unknown: "Unknown",
};

// Shared grid template so the header and desktop rows line up.
export const ROW_GRID = "grid-cols-[20px_minmax(0,1.6fr)_1.4fr_0.9fr_0.9fr_0.8fr_28px]";

function Stars({ value, onSet }: { value: number; onSet: (n: number) => void }) {
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} aria-label={`Set importance ${n}`} onClick={() => onSet(n)}
          className={`text-base leading-none ${n <= value ? "text-[#BA7517]" : "text-hairline"}`}>★</button>
      ))}
    </span>
  );
}

function TierTag({ tier }: { tier: TierOrUnknown }) {
  if (tier === "unknown") return <span className="text-sm text-ink-faint">—</span>;
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs ${TIER_CLASS[tier as Tier]}`}>{TIER_LABEL[tier]}</span>
  );
}

function Projected({ s }: { s: ScoredSchool }) {
  return (
    <span className="nums text-sm text-ink-muted" title={`Estimated · ${s.basis}`}>
      {s.projectedLabel}
    </span>
  );
}

export default function SchoolRow({
  s, index, onImportance, onRemove, onDragStart, onDragOver, onDrop,
}: {
  s: ScoredSchool;
  index: number;
  onImportance: (id: string, n: number) => void;
  onRemove: (id: string) => void;
  onDragStart: (i: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (i: number) => void;
}) {
  const handle = <span className="cursor-grab select-none text-ink-faint" aria-hidden>⠿</span>;
  const removeBtn = (
    <button onClick={() => onRemove(s.id)} aria-label={`Remove ${s.name}`}
      className="text-ink-faint hover:text-verdict">×</button>
  );

  return (
    <div draggable onDragStart={() => onDragStart(index)} onDragOver={onDragOver} onDrop={() => onDrop(index)}
      className="border-b border-hairline px-5 py-3 last:border-b-0">
      {/* Mobile: stacked card */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            {handle}
            <Link href={`/school/${s.id}`} className="truncate text-sm font-medium hover:text-accent">{s.name}</Link>
            <TierTag tier={s.tier} />
          </div>
          {removeBtn}
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 pl-7">
          <Stars value={s.importance} onSet={(n) => onImportance(s.id, n)} />
          <Projected s={s} />
          <span className="nums text-sm text-ink-muted">{s.deadline}</span>
        </div>
      </div>

      {/* Desktop: table row */}
      <div className={`hidden gap-2 sm:grid sm:items-center ${ROW_GRID}`}>
        {handle}
        <Link href={`/school/${s.id}`} className="text-sm font-medium hover:text-accent">{s.name}</Link>
        <Stars value={s.importance} onSet={(n) => onImportance(s.id, n)} />
        <TierTag tier={s.tier} />
        <Projected s={s} />
        <span className="nums text-sm text-ink-muted">{s.deadline}</span>
        {removeBtn}
      </div>
    </div>
  );
}
