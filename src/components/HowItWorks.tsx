"use client";

import { motion } from "framer-motion";

const STEPS: [string, string, string][] = [
  ["1", "Add your schools", "Search 46 colleges and build your list in seconds — no account needed."],
  ["2", "Get an honest read", "See your real odds at each school, built from federal data, never a fake number."],
  ["3", "Balance your list", "An honest grade tells you when you're top-heavy and exactly what to add."],
];

export default function HowItWorks() {
  return (
    <section className="border-t border-hairline py-16">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="font-serif text-3xl font-semibold tracking-tight"
      >
        How it works
      </motion.h2>
      <div className="mt-8 grid gap-8 md:grid-cols-3">
        {STEPS.map(([n, title, desc], i) => (
          <motion.div
            key={n}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.12, ease: "easeOut" }}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent font-serif text-lg font-semibold text-paper">
              {n}
            </div>
            <h3 className="mt-4 font-serif text-xl font-semibold">{title}</h3>
            <p className="mt-2 text-ink-muted">{desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
