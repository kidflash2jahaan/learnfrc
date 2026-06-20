import "server-only";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

/**
 * Per-IP rate limit backed by a SECURITY DEFINER Postgres function.
 * Returns true if the request is allowed, false if the limit is exceeded.
 * Fails open on infrastructure errors so legitimate users are never blocked.
 */
export async function rateLimit(
  action: string,
  max: number,
  windowSeconds: number,
  extraKey?: string
): Promise<boolean> {
  try {
    const h = await headers();
    const ip =
      (h.get("x-forwarded-for") || "").split(",")[0].trim() ||
      h.get("x-real-ip") ||
      "unknown";
    const bucket = `${action}:${ip}${extraKey ? `:${extraKey}` : ""}`;
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("check_rate_limit", {
      p_bucket: bucket,
      p_max: max,
      p_window_seconds: windowSeconds,
    });
    if (error) return true;
    return data !== false;
  } catch {
    return true;
  }
}
