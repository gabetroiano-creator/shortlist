"use client";

import { useState } from "react";
import { useAuth } from "@/lib/useAuth";
import { isSupabaseEnabled } from "@/lib/supabase";

export default function AuthButton() {
  const { user, loading, signIn, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  if (!isSupabaseEnabled || loading) return null;

  if (user) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="hidden max-w-[14ch] truncate text-ink-muted sm:inline">{user.email}</span>
        <button onClick={signOut} className="rounded-md border border-hairline px-2.5 py-1 hover:bg-accent-tint">
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button onClick={() => setOpen((o) => !o)}
        className="rounded-md border border-hairline px-2.5 py-1 text-sm hover:bg-accent-tint">
        Sign in
      </button>
      {open && (
        <div className="absolute right-0 z-20 mt-1 w-64 rounded-md border border-hairline bg-surface p-3">
          {sent ? (
            <p className="text-sm text-ink-muted">Check your email for a sign-in link.</p>
          ) : (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setErr(null);
                const { error } = await signIn(email);
                if (error) setErr(error);
                else setSent(true);
              }}
            >
              <label htmlFor="auth-email" className="text-xs text-ink-faint">
                Email — we’ll send a sign-in link
              </label>
              <input id="auth-email" type="email" required value={email}
                onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
                className="mt-1 w-full rounded-md border border-hairline bg-paper px-2 py-1.5 text-sm" />
              {err && <p className="mt-1 text-xs text-verdict">{err}</p>}
              <button type="submit"
                className="mt-2 w-full rounded-md bg-accent px-3 py-1.5 text-sm text-paper hover:bg-accent-hover">
                Send link
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
