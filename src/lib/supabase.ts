import "server-only";
import {
  createSupabaseAdminClient,
  type DatabaseClient,
} from "@handharr-labs/forge-web-server";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client for data/storage access. MVP has no RLS (auth is
 * owned by NextAuth, no `users` table yet), so the server reads/writes with the
 * service-role key. Returns `null` when Supabase isn't configured, so callers
 * can fall back to the in-memory sample config.
 *
 * NOTE: service-role bypasses RLS — server-only, never expose to the client.
 * When Phase 6 couple self-serve lands, published reads move to an anon +
 * cookies client behind RLS.
 */
export function getSupabaseServerClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) return null;
  return createSupabaseAdminClient(url, serviceRoleKey);
}

export const supabaseConfigured = (): boolean =>
  Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY,
  );

// Re-export the kit's DB port type for datasources that want to type against it.
export type { DatabaseClient };
