"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";

async function awardAchievements(supabase: SupabaseClient, userId: string) {
  // total completed
  const { data: progress } = await supabase
    .from("lesson_progress")
    .select("lesson_id")
    .eq("user_id", userId);
  const completedIds = new Set((progress ?? []).map((r) => r.lesson_id as string));
  const completedCount = completedIds.size;

  // lesson -> department map to compute fully-finished departments
  const { data: lessonRows } = await supabase
    .from("lessons")
    .select("id, modules(department_id)");
  const totals: Record<string, number> = {};
  const done: Record<string, number> = {};
  for (const l of lessonRows ?? []) {
    const dep = (l.modules as { department_id?: string } | null)?.department_id;
    if (!dep) continue;
    totals[dep] = (totals[dep] ?? 0) + 1;
    if (completedIds.has(l.id as string)) done[dep] = (done[dep] ?? 0) + 1;
  }
  let fullDepts = 0;
  for (const dep of Object.keys(totals)) {
    if (totals[dep] > 0 && (done[dep] ?? 0) >= totals[dep]) fullDepts++;
  }

  const { data: achievements } = await supabase
    .from("achievements")
    .select("id, criteria");
  const { data: have } = await supabase
    .from("user_achievements")
    .select("achievement_id")
    .eq("user_id", userId);
  const haveSet = new Set((have ?? []).map((h) => h.achievement_id as string));

  const toInsert: { user_id: string; achievement_id: string }[] = [];
  for (const a of achievements ?? []) {
    if (haveSet.has(a.id as string)) continue;
    const c = (a.criteria ?? {}) as { type?: string; count?: number };
    if (c.type === "lessons" && completedCount >= (c.count ?? Infinity))
      toInsert.push({ user_id: userId, achievement_id: a.id as string });
    if (c.type === "departments" && fullDepts >= (c.count ?? Infinity))
      toInsert.push({ user_id: userId, achievement_id: a.id as string });
  }
  if (toInsert.length)
    await supabase.from("user_achievements").insert(toInsert);
}

export async function setLessonComplete(
  lessonId: string,
  deptSlug: string,
  completed: boolean
): Promise<{ ok?: boolean; error?: string; completed?: boolean }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };

  if (completed) {
    const { error } = await supabase
      .from("lesson_progress")
      .upsert(
        { user_id: user.id, lesson_id: lessonId },
        { onConflict: "user_id,lesson_id", ignoreDuplicates: true }
      );
    if (error) return { error: error.message };
    await awardAchievements(supabase, user.id);
  } else {
    const { error } = await supabase
      .from("lesson_progress")
      .delete()
      .eq("user_id", user.id)
      .eq("lesson_id", lessonId);
    if (error) return { error: error.message };
  }

  revalidatePath(`/guides/${deptSlug}`);
  revalidatePath("/dashboard");
  return { ok: true, completed };
}

export async function toggleBookmark(
  lessonId: string,
  bookmarked: boolean
): Promise<{ ok?: boolean; error?: string; bookmarked?: boolean }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };

  if (bookmarked) {
    const { error } = await supabase
      .from("bookmarks")
      .upsert(
        { user_id: user.id, lesson_id: lessonId },
        { onConflict: "user_id,lesson_id", ignoreDuplicates: true }
      );
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("user_id", user.id)
      .eq("lesson_id", lessonId);
    if (error) return { error: error.message };
  }
  revalidatePath("/bookmarks");
  return { ok: true, bookmarked };
}
