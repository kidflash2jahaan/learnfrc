import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail, streakReminderEmailHtml } from "@/lib/email";

export const dynamic = "force-dynamic";

// Daily cron (configured in vercel.json). Emails learners who were active
// yesterday but not yet today, so they can keep their streak alive.
// Vercel automatically sends `Authorization: Bearer ${CRON_SECRET}` when the
// CRON_SECRET env var is set, so unauthorized calls are rejected.
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return new NextResponse("unauthorized", { status: 401 });
  }

  // Kill-switch: disabled until these emails are strictly opt-in with a
  // working one-click unsubscribe (they were going out without consent).
  if (process.env.STREAK_EMAILS_ENABLED !== "true") {
    return NextResponse.json({ disabled: true, sent: 0 });
  }

  const now = new Date();
  const startToday = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );
  const startYesterday = new Date(startToday.getTime() - 86_400_000);

  const admin = createAdminClient();

  const [{ data: yest }, { data: today }] = await Promise.all([
    admin
      .from("lesson_progress")
      .select("user_id")
      .gte("completed_at", startYesterday.toISOString())
      .lt("completed_at", startToday.toISOString()),
    admin
      .from("lesson_progress")
      .select("user_id")
      .gte("completed_at", startToday.toISOString()),
  ]);

  const activeToday = new Set((today ?? []).map((r) => r.user_id as string));
  const atRisk = [...new Set((yest ?? []).map((r) => r.user_id as string))].filter(
    (id) => !activeToday.has(id)
  );

  // Stay well under Resend's free daily cap.
  const batch = atRisk.slice(0, 80);
  let sent = 0;
  for (const id of batch) {
    const { data: u } = await admin.auth.admin.getUserById(id);
    const email = u?.user?.email;
    if (!email) continue;
    const { data: p } = await admin
      .from("profiles")
      .select("full_name, username")
      .eq("id", id)
      .maybeSingle();
    const r = await sendEmail({
      to: email,
      subject: "Keep your LearnFRC streak alive 🔥",
      html: streakReminderEmailHtml(
        (p?.full_name as string) || (p?.username as string) || null
      ),
    });
    if (r.ok) sent++;
  }

  return NextResponse.json({
    atRisk: atRisk.length,
    sent,
    capped: atRisk.length > batch.length,
  });
}
