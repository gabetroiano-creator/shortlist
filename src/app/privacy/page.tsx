export const metadata = { title: "Privacy — Shortlist" };

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-reading px-6 py-12">
      <h1 className="font-serif text-3xl font-semibold tracking-tight">Privacy, plainly</h1>
      <p className="mt-2 text-ink-muted">
        Shortlist is built for high-school students. Here’s exactly what we store and why — no fine print.
      </p>

      <Section title="What we store">
        <p>
          Your college list, your stats (SAT, ACT, GPA, intended major), and any application status or
          essay notes you add. By default this lives <strong>only in your browser</strong> — we don’t
          see it.
        </p>
        <p className="mt-2">
          If you create an account, that same data is also saved to our database so your list follows you
          across devices. Your account data is protected by row-level security: only you can read or
          change your own list, enforced at the database.
        </p>
      </Section>

      <Section title="What we don’t do">
        <p>We don’t sell your data, show ads, or share it with colleges. There’s nothing to pay, ever.</p>
      </Section>

      <Section title="Where school data comes from">
        <p>
          Admissions numbers come from the public U.S. Department of Education{" "}
          <a className="text-accent" href="https://collegescorecard.ed.gov/data/" target="_blank" rel="noreferrer">College Scorecard</a>.
          See the <a className="text-accent" href="/methodology">methodology</a> for how odds are calculated.
        </p>
      </Section>

      <Section title="Your control">
        <p>
          Clear your list anytime — it’s in your browser. If you have an account and want everything
          deleted, email us and we’ll remove it. We only ask for what the tool needs to work; please
          don’t enter more than you’re comfortable sharing.
        </p>
      </Section>

      <p className="mt-10 text-sm text-ink-faint">Questions? This is a work in progress — tell us what you’d want to know.</p>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8 leading-relaxed text-ink">
      <h2 className="font-serif text-xl font-semibold">{title}</h2>
      <div className="mt-2">{children}</div>
    </section>
  );
}
