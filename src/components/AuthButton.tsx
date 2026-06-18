"use client";

import Link from "next/link";
import { useAuth } from "@/lib/useAuth";
import { isSupabaseEnabled } from "@/lib/supabase";

export default function AuthButton() {
  const { user, loading, signOut } = useAuth();

  if (!isSupabaseEnabled || loading) return null;

  if (user) {
    return (
      <div className="flex items-center gap-3 text-sm">
        <Link href="/profile" className="text-ink-muted hover:text-ink">Profile</Link>
        <button onClick={signOut} className="rounded-md border border-hairline px-2.5 py-1 hover:bg-accent-tint">
          Sign out
        </button>
      </div>
    );
  }

  return (
    <Link href="/signin" className="rounded-md border border-hairline px-2.5 py-1 text-sm hover:bg-accent-tint">
      Sign in
    </Link>
  );
}
