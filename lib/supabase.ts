import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client, created on first use.
 *
 * Lazy on purpose: a module-level client would throw during `next build`,
 * where these secrets aren't present, and take the whole build down with it.
 * A missing key should fail the request that needs the database, not the
 * deploy of pages that don't.
 *
 * Uses the service role key, which bypasses row-level security — both tables
 * have RLS on with no policies, so this is the only way in. That key must
 * never reach the browser, which is what the `server-only` import enforces:
 * importing this from a Client Component fails the build rather than shipping
 * the key to users.
 */
let client: SupabaseClient | null = null;

export function getSupabase() {
  if (client) return client;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Bids can't be read or recorded without them.",
    );
  }

  client = createClient(url, key, { auth: { persistSession: false } });
  return client;
}
