"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/useAuth";
import { isSupabaseEnabled } from "@/lib/supabase";

export default function SignInPage() {
  const router = useRouter();
  const { user, signInPassword, signUpPassword } = useAuth();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) router.push("/profile");
  }, [user, router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    setBusy(true);
    if (mode === "in") {
      const { error } = await signInPassword(email, password);
      if (error) setErr(error);
    } else {
      const { error, needsConfirm } = await signUpPassword(email, password);
      if (error) setErr(error);
      else if (needsConfirm) setMsg("Account created. Check your email to confirm, then sign in.");
    }
    setBusy(false);
  };

  return (
    <main className="mx-auto max-w-reading px-6 py-16">
      {!isSupabaseEnabled && (
        <p className="mb-6 rounded-md border border-hairline bg-surface px-4 py-3 text-sm text-ink-muted">
          Accounts aren’t turned on yet. Your list is saved in this browser.
        </p>
      )}
      <h1 className="font-serif text-3xl font-semibold tracking-tight">
        {mode === "in" ? "Sign in" : "Create your account"}
      </h1>
      <p className="mt-1 text-sm text-ink-muted">
        {mode === "in" ? "Your list syncs across devices." : "Save your list and pick up on any device."}
      </p>

      <form onSubmit={submit} className="mt-6 max-w-sm space-y-3">
        <div>
          <label htmlFor="email" className="text-xs text-ink-faint">Email</label>
          <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-md border border-hairline bg-surface px-3 py-2 text-sm" />
        </div>
        <div>
          <label htmlFor="password" className="text-xs text-ink-faint">Password</label>
          <input id="password" type="password" required minLength={6} value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-md border border-hairline bg-surface px-3 py-2 text-sm" />
        </div>
        {err && <p className="text-sm text-verdict">{err}</p>}
        {msg && <p className="text-sm text-[#0F6E56]">{msg}</p>}
        <button type="submit" disabled={busy || !isSupabaseEnabled}
          className="w-full rounded-md bg-accent px-3 py-2 text-sm text-paper hover:bg-accent-hover disabled:opacity-40">
          {busy ? "…" : mode === "in" ? "Sign in" : "Create account"}
        </button>
      </form>

      <button onClick={() => { setMode(mode === "in" ? "up" : "in"); setErr(null); setMsg(null); }}
        className="mt-4 text-sm text-accent hover:underline">
        {mode === "in" ? "Need an account? Create one" : "Already have an account? Sign in"}
      </button>
    </main>
  );
}
