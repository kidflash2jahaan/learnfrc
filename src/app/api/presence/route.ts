import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Presence heartbeat. Signed-in clients POST here every ~60s; we stamp the
// authenticated user's last_seen_at. Anonymous visitors are a no-op, so the
// admin "online" count only ever reflects logged-in people.
export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new Response(null, { status: 204 });

  const admin = createAdminClient();
  await admin
    .from("profiles")
    .update({ last_seen_at: new Date().toISOString() })
    .eq("id", user.id);

  return new Response(null, { status: 204 });
}
