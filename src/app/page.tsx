import Link from "next/link";
import HowItWorks from "@/components/HowItWorks";

export const metadata = {
  title: "Shortlist — a straight answer on your college list",
  description:
    "Build your college list, get an honest read on your odds, and never miss a deadline. Free.",
};

function Tag({ c, children }: { c: string; children: React.ReactNode }) {
  const cls: Record<string, string> = {
    reach: "bg-reach-fill text-reach-text",
    target: "bg-target-fill text-target-text",
    likely: "bg-likely-fill text-likely-text",
    safety: "bg-safety-fill text-safety-text",
  };
  return <span className={`rounded-full px-2 py-0.5 text-xs ${cls[c]}`}>{children}</span>;
}

export default function Landing() {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-app items-center justify-between px-6 py-5">
        <span className="font-serif text-xl font-semibold tracking-tight">Shortlist</span>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/signin" className="text-ink-muted hover:text-ink">Sign in</Link>
          <Link href="/list" className="rounded-md bg-accent px-3.5 py-1.5 text-paper hover:bg-accent-hover">
            Build your list
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-app px-6">
        {/* Hero — asymmetric, left-aligned copy + a real verdict card */}
        <section className="grid items-center gap-10 py-12 md:grid-cols-[1.05fr_0.95fr] md:py-20">
          <div>
            <p className="mb-4 text-sm uppercase tracking-[0.12em] text-ink-faint">
              Free · for high-school students
            </p>
            <h1 className="font-serif text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-[56px]">
              Find out which colleges are actually in reach.
            </h1>
            <p className="mt-5 max-w-reading text-lg leading-relaxed text-ink-muted">
              Most tools just store your list. Shortlist gives you the thing you really want:
              an honest read on your odds at each school, whether your list is balanced, and
              every deadline in one place.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/list" className="rounded-md bg-accent px-6 py-3 text-center text-base text-paper hover:bg-accent-hover">
                Build your list
              </Link>
              <Link href="/methodology" className="rounded-md border border-hairline px-6 py-3 text-center text-base hover:bg-accent-tint">
                See how odds are calculated
              </Link>
            </div>
            <p className="mt-4 text-sm text-ink-faint">No account needed to start. Nothing to pay, ever.</p>
          </div>

          {/* The real product, as the hero image */}
          <div className="rounded-lg border border-hairline bg-surface p-6 shadow-[0_1px_0_rgba(0,0,0,0.02)]">
            <p className="mb-2 text-xs uppercase tracking-[0.1em] text-ink-faint">List health</p>
            <p className="font-serif text-2xl font-semibold leading-tight text-verdict">
              7 reaches, 1 target, 1 likely, 1 safety. Still top-heavy — add a safety.
            </p>
            <div className="mt-4 flex h-2.5 overflow-hidden rounded-full">
              <span className="bg-reach-dot" style={{ flex: 7 }} />
              <span className="bg-target-dot" style={{ flex: 1 }} />
              <span className="bg-likely-dot" style={{ flex: 1 }} />
              <span className="bg-safety-dot" style={{ flex: 1 }} />
            </div>
            <div className="mt-5 space-y-3">
              {[
                ["Stanford", "reach", "4%", "Nov 1"],
                ["UC Davis", "target", "42%", "Nov 30"],
                ["Arizona State", "safety", "90%", "Nov 1"],
              ].map(([name, tier, odds, date]) => (
                <div key={name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{name}</span>
                    <Tag c={tier}>{tier}</Tag>
                  </div>
                  <div className="nums flex items-center gap-4 text-ink-muted">
                    <span>{odds}</span>
                    <span>{date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What you get — editorial, not icon cards */}
        <section className="border-t border-hairline py-14">
          <div className="grid gap-10 md:grid-cols-3">
            {[
              ["An honest grade", "We tell you when your list is a bad bet — 8 reaches and no safety — and what to add. The thing a spreadsheet won’t."],
              ["Odds you can trust", "Estimates built from real federal admissions data, never a fake exact number. Test-blind schools say so."],
              ["Decisions, not just storage", "A weighted matrix scores schools against what you care about, and compares them side by side."],
            ].map(([h, p]) => (
              <div key={h}>
                <h3 className="font-serif text-xl font-semibold">{h}</h3>
                <p className="mt-2 text-ink-muted">{p}</p>
              </div>
            ))}
          </div>
        </section>

        <HowItWorks />
      </main>

      <footer className="mx-auto max-w-app px-6 py-10 text-sm text-ink-faint">
        <Link href="/methodology" className="text-accent">Methodology & sources</Link>
        <span className="mx-2">·</span>
        <Link href="/privacy" className="text-accent">Privacy</Link>
        <span className="mx-2">·</span>
        Built for students, free.
      </footer>
    </div>
  );
}
