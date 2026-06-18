"use client";

import { useRouter } from "next/navigation";
import { useLocalStorage } from "@/lib/storage";
import { reScore, buildStarterList, type ScoredSchool } from "@/lib/data";
import { DEFAULT_PROFILE, type Profile } from "@/lib/profile";

// Recompute the stored list's odds at a new SAT (My list re-reads on next visit).
function recomputeStored(sat: number) {
  try {
    const raw = localStorage.getItem("shortlist:schools");
    if (!raw) return;
    const arr = JSON.parse(raw) as ScoredSchool[];
    localStorage.setItem("shortlist:schools", JSON.stringify(arr.map((s) => reScore(s, sat))));
  } catch {
    /* ignore */
  }
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useLocalStorage<Profile>("shortlist:profile", DEFAULT_PROFILE);

  const set = <K extends keyof Profile>(key: K, value: Profile[K]) =>
    setProfile((p) => ({ ...p, [key]: value }));

  const buildStarter = () => {
    const has = JSON.parse(localStorage.getItem("shortlist:schools") ?? "[]").length > 0;
    if (has && !window.confirm("Replace your current list with a fresh balanced starter set?")) return;
    localStorage.setItem("shortlist:schools", JSON.stringify(buildStarterList(profile.sat)));
    router.push("/list");
  };

  const setSat = (sat: number) => {
    if (Number.isNaN(sat)) return;
    set("sat", sat);
    recomputeStored(sat);
  };

  return (
    <main className="mx-auto max-w-reading px-6 py-10">
      <h1 className="font-serif text-2xl font-semibold tracking-tight">Your profile</h1>
      <p className="mt-1 text-sm text-ink-muted">
        These power your odds and fit. Saved on this device (and synced when you’re signed in).
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Field label="SAT (total)" hint="Drives your reach / target / safety odds">
          <input type="number" min={400} max={1600} step={10} value={profile.sat}
            onChange={(e) => setSat(Number(e.target.value))} className={inputCls} />
        </Field>
        <Field label="ACT (composite)" hint="Used once Common Data Set ranges land">
          <input type="number" min={1} max={36} value={profile.act ?? ""}
            onChange={(e) => set("act", e.target.value === "" ? null : Number(e.target.value))}
            placeholder="—" className={inputCls} />
        </Field>
        <Field label="GPA (unweighted, 0–4)" hint="Used once Common Data Set GPA data lands">
          <input type="number" min={0} max={4} step={0.01} value={profile.gpa ?? ""}
            onChange={(e) => set("gpa", e.target.value === "" ? null : Number(e.target.value))}
            placeholder="—" className={inputCls} />
        </Field>
        <Field label="Intended major" hint="Used to weight major-strength fit">
          <input type="text" value={profile.major} onChange={(e) => set("major", e.target.value)}
            placeholder="e.g. Computer Science" className={inputCls} />
        </Field>
      </div>

      <section className="mt-8 rounded-lg border border-hairline bg-surface p-5">
        <h2 className="font-serif text-lg font-semibold">New here?</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Build a balanced starter list from your SAT — a few reaches, targets, and safeties to react to.
        </p>
        <button onClick={buildStarter} className="mt-3 rounded-md bg-accent px-4 py-2 text-sm text-paper hover:bg-accent-hover">
          Build my starter list
        </button>
      </section>

      <p className="mt-6 text-xs text-ink-faint">
        Odds today use SAT vs. each school’s reported test range plus its admission rate. ACT and GPA
        are stored now and factor into the estimate as we add Common Data Set numbers per school.
        See <a href="/methodology" className="text-accent">how odds are calculated</a>.
      </p>
    </main>
  );
}

const inputCls = "mt-1 w-full rounded-md border border-hairline bg-surface px-3 py-2 text-sm nums";

function Field({ label, hint, children }: { label: string; hint: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      {children}
      <p className="mt-1 text-xs text-ink-faint">{hint}</p>
    </div>
  );
}
