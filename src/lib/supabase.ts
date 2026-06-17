import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Accounts are optional. Without env vars the app runs local-first.
export const isSupabaseEnabled = Boolean(url && anon);
export const supabase: SupabaseClient | null = isSupabaseEnabled
  ? createClient(url as string, anon as string)
  : null;
