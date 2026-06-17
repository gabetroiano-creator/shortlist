"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links: [string, string][] = [
  ["/", "My list"],
  ["/matrix", "Decision matrix"],
  ["/compare", "Compare"],
  ["/deadlines", "Deadlines"],
];

export default function Nav() {
  const path = usePathname();
  return (
    <header className="border-b border-hairline">
      <div className="mx-auto flex max-w-app flex-col gap-2 px-6 py-3 sm:h-14 sm:flex-row sm:items-center sm:justify-between sm:gap-0 sm:py-0">
        <Link href="/" className="font-serif text-xl font-semibold tracking-tight">
          Shortlist
        </Link>
        <nav className="flex flex-wrap gap-4 text-sm sm:gap-5">
          {links.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className={path === href ? "text-ink" : "text-ink-muted hover:text-ink"}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
