import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Service-role client. NEVER import this into client components.
 * Bypasses RLS — use only in trusted server code / scripts.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
