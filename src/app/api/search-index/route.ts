import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createClient();

  const [{ data: departments }, { data: lessons }] = await Promise.all([
    supabase
      .from("departments")
      .select("slug,name,tagline,icon,accent,difficulty")
      .order("sort_order"),
    supabase
      .from("lessons")
      .select("slug,title,summary, modules(slug, departments(slug,name))"),
  ]);

  const flatLessons = (lessons ?? [])
    .map((l: Record<string, unknown>) => {
      const m = l.modules as { slug?: string; departments?: { slug?: string; name?: string } } | null;
      return {
        slug: l.slug as string,
        title: l.title as string,
        summary: (l.summary as string) ?? "",
        moduleSlug: m?.slug ?? "",
        deptSlug: m?.departments?.slug ?? "",
        deptName: m?.departments?.name ?? "",
      };
    })
    .filter((l) => l.deptSlug && l.moduleSlug);

  return NextResponse.json({
    departments: departments ?? [],
    lessons: flatLessons,
  });
}
