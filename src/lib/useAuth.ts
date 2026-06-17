"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (event === "SIGNED_OUT") {
        // drop per-user pull guards so the next sign-in re-pulls
        Object.keys(sessionStorage)
          .filter((k) => k.startsWith("shortlist:pulled:"))
          .forEach((k) => sessionStorage.removeItem(k));
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const signIn = async (email: string) => {
    if (!supabase) return { error: "Accounts are not configured." };
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    });
    return { error: error?.message ?? null };
  };

  const signOut = async () => {
    await supabase?.auth.signOut();
  };

  return { user, loading, signIn, signOut };
}
