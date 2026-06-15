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
      <div className="mx-auto flex h-14 max-w-app items-center justify-between px-6">
        <Link href="/" className="font-serif text-xl font-semibold tracking-tight">
          Shortlist
        </Link>
        <nav className="flex gap-5 text-sm">
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
