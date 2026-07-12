import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

// Lazy-initialize so the module can be imported during SSR/build even when
// env vars are absent; the throw only happens on actual use in the browser.
export function getSupabase(): SupabaseClient {
  if (client) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error(
      "Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local",
    );
  }
  client = createClient(url, anonKey);
  return client;
}

export type Rsvp = {
  name: string;
  attending: "yes" | "no";
  guests: number | null;
  appetizer: string | null;
  main: string | null;
  carbs: string | null;
  dessert: string | null;
  dietary: string | null;
  song: string | null;
};