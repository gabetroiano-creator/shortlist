import { supabase } from "@/lib/supabase";

// The localStorage keys that make up a user's data.
const KEYS = ["shortlist:schools", "shortlist:profile", "shortlist:criteria", "shortlist:compare"];

export type SyncBlob = Record<string, string>;

export function snapshotLocal(): SyncBlob {
  const out: SyncBlob = {};
  for (const k of KEYS) {
    const v = localStorage.getItem(k);
    if (v != null) out[k] = v; // raw JSON strings, exactly as stored
  }
  return out;
}

export function applyLocal(blob: SyncBlob) {
  for (const k of KEYS) {
    if (typeof blob[k] === "string") localStorage.setItem(k, blob[k]);
  }
}

export async function loadRemote(userId: string): Promise<SyncBlob | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("lists")
    .select("data")
    .eq("user_id", userId)
    .maybeSingle();
  if (error || !data) return null;
  return (data.data as SyncBlob) ?? null;
}

export async function saveRemote(userId: string, blob: SyncBlob) {
  if (!supabase) return;
  await supabase
    .from("lists")
    .upsert({ user_id: userId, data: blob, updated_at: new Date().toISOString() });
}
