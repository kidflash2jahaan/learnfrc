import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type {
  Department,
  Module,
  Lesson,
  Profile,
  FlatLesson,
} from "@/lib/types";

type DeptWithModules = Department & { modules: Module[] };

function sortModules(modules: Module[]): Module[] {
  return [...(modules ?? [])]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((m) => ({
      ...m,
      lessons: [...(m.lessons ?? [])].sort((a, b) => a.sort_order - b.sort_order),
    }));
}

export function flattenLessons(dept: DeptWithModules): FlatLesson[] {
  const out: FlatLesson[] = [];
  for (const m of dept.modules) {
    for (const l of m.lessons) {
      out.push({
        ...l,
        moduleTitle: m.title,
        moduleSlug: m.slug,
        departmentSlug: dept.slug,
        departmentName: dept.name,
      });
    }
  }
  return out;
}

export type DepartmentSummary = Department & {
  moduleCount: number;
  lessonCount: number;
};

export async function getDepartments(): Promise<DepartmentSummary[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("departments")
    .select("*, modules(id, lessons(id))")
    .order("sort_order");
  if (error) throw error;
  return (data ?? []).map((d: Record<string, unknown>) => {
    const modules = (d.modules as { lessons?: unknown[] }[]) ?? [];
    const moduleCount = modules.length;
    const lessonCount = modules.reduce(
      (s, m) => s + (m.lessons?.length ?? 0),
      0
    );
    const rest = { ...d };
    delete rest.modules;
    return { ...(rest as unknown as Department), moduleCount, lessonCount };
  });
}

export const getDepartmentBySlug = cache(async (
  slug: string
): Promise<DeptWithModules | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("departments")
    .select("*, modules(*, lessons(*))")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    ...(data as unknown as Department),
    modules: sortModules((data as { modules: Module[] }).modules ?? []),
  };
});

export async function getAllDepartmentSlugs(): Promise<string[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("departments").select("slug");
  return (data ?? []).map((d) => d.slug as string);
}

export async function getCompletedLessonIds(
  userId: string
): Promise<Set<string>> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("lesson_progress")
    .select("lesson_id")
    .eq("user_id", userId);
  return new Set((data ?? []).map((r) => r.lesson_id as string));
}

export async function getBookmarkedLessonIds(
  userId: string
): Promise<Set<string>> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("bookmarks")
    .select("lesson_id")
    .eq("user_id", userId);
  return new Set((data ?? []).map((r) => r.lesson_id as string));
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  return (data as Profile) ?? null;
}

export async function getOverviewStats() {
  const supabase = await createClient();
  const [depts, modules, lessons, learners] = await Promise.all([
    supabase.from("departments").select("*", { count: "exact", head: true }),
    supabase.from("modules").select("*", { count: "exact", head: true }),
    supabase.from("lessons").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
  ]);
  return {
    deptCount: depts.count ?? 0,
    moduleCount: modules.count ?? 0,
    lessonCount: lessons.count ?? 0,
    learners: learners.count ?? 0,
  };
}

export async function getLeaderboard(limit = 25): Promise<Profile[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .order("xp", { ascending: false })
    .order("created_at", { ascending: true })
    .limit(limit);
  return (data as Profile[]) ?? [];
}
