export const metadata = { title: "How Shortlist works — methodology & sources" };

export default function MethodologyPage() {
  return (
    <main className="mx-auto max-w-reading px-6 py-12">
      <h1 className="font-serif text-3xl font-semibold tracking-tight">How this works</h1>
      <p className="mt-2 text-ink-muted">
        No black box. Here’s exactly how every number and tier is produced, and where the data comes from.
      </p>

      <Section title="Your odds are an estimate, not a prediction">
        <p>
          For each school we start from its <strong>overall admission rate</strong> and adjust it by where
          your test score falls in the school’s reported middle-50% range. Score above the 75th percentile
          and the estimate goes up; below the 25th and it goes down. We then bucket the result:
        </p>
        <ul className="mt-3 space-y-1">
          <li><Tag c="reach">Reach</Tag> roughly under 20%</li>
          <li><Tag c="target">Target</Tag> 20–45%</li>
          <li><Tag c="likely">Likely</Tag> 45–70%</li>
          <li><Tag c="safety">Safety</Tag> 70%+</li>
        </ul>
        <p className="mt-3">
          Two honesty rules are hard-coded: a school admitting under 10% is a <strong>reach for everyone</strong>,
          no matter the scores; and a school that no longer reports test scores (many public universities are
          now test-blind) is estimated from <strong>selectivity alone</strong> — and the row says so on hover.
          We never show false precision.
        </p>
      </Section>

      <Section title="What we don’t do">
        <p>
          We don’t copy US News or any magazine ranking. You decide what matters in the Decision matrix, and
          schools are scored against <em>your</em> priorities — not one publication’s formula.
        </p>
      </Section>

      <Section title="Where the data comes from">
        <ul className="space-y-2">
          <li>
            <strong>Admission rate, SAT range, net price</strong> — U.S. Department of Education,{" "}
            <a className="text-accent" href="https://collegescorecard.ed.gov/data/" target="_blank" rel="noreferrer">College Scorecard</a>{" "}
            (latest available year). Refreshed by our ingest job.
          </li>
          <li>
            <strong>Application deadlines</strong> — each school’s admissions page and Common App listing,
            human-verified before publishing. Every deadline shows its source and last-verified date.
          </li>
          <li>
            <strong>Factor scores</strong> (academics, campus life, etc.) — currently editorial starting points
            you can override per school. As we add per-school <em>Common Data Set</em> figures, these and the
            odds get more precise (including GPA, which the free federal data doesn’t include).
          </li>
        </ul>
      </Section>

      <p className="mt-10 text-sm text-ink-faint">
        Spotted a number that looks off? That’s exactly the kind of thing we want to fix — transparency is the point.
      </p>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8 leading-relaxed text-ink">
      <h2 className="font-serif text-xl font-semibold">{title}</h2>
      <div className="mt-2 space-y-2">{children}</div>
    </section>
  );
}

function Tag({ c, children }: { c: string; children: React.ReactNode }) {
  const cls: Record<string, string> = {
    reach: "bg-reach-fill text-reach-text",
    target: "bg-target-fill text-target-text",
    likely: "bg-likely-fill text-likely-text",
    safety: "bg-safety-fill text-safety-text",
  };
  return <span className={`mr-1 rounded-full px-2 py-0.5 text-xs ${cls[c]}`}>{children}</span>;
}
