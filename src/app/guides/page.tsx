import type { Metadata } from "next";
import { BookOpen, Layers, GraduationCap } from "lucide-react";
import { getDepartments, getCompletedLessonIds } from "@/lib/queries";
import { getSession } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { DepartmentCard } from "@/components/department-card";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Guides",
  description:
    "Explore every FRC department — mechanical, CAD, programming, electrical, business, outreach, scouting, drive team and more. Structured guides from fundamentals to advanced.",
};

export default async function GuidesPage() {
  const [departments, { user }] = await Promise.all([
    getDepartments(),
    getSession(),
  ]);

  const progress: Record<string, number> = {};
  if (user) {
    const supabase = await createClient();
    const [{ data: lessons }, completed] = await Promise.all([
      supabase.from("lessons").select("id, modules(department_id)"),
      getCompletedLessonIds(user.id),
    ]);
    const totals: Record<string, number> = {};
    const done: Record<string, number> = {};
    for (const l of lessons ?? []) {
      const dep = (l.modules as { department_id?: string } | null)?.department_id;
      if (!dep) continue;
      totals[dep] = (totals[dep] ?? 0) + 1;
      if (completed.has(l.id as string)) done[dep] = (done[dep] ?? 0) + 1;
    }
    for (const d of departments)
      progress[d.id] = totals[d.id]
        ? Math.round(((done[d.id] ?? 0) / totals[d.id]) * 100)
        : 0;
  }

  const totalModules = departments.reduce((s, d) => s + d.moduleCount, 0);
  const totalLessons = departments.reduce((s, d) => s + d.lessonCount, 0);

  return (
    <div className="relative">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-80 bg-grid mask-b-faded opacity-60" />
      <div className="mx-auto max-w-7xl px-4 pt-28 pb-20 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Badge variant="primary" className="mb-4">
            <GraduationCap className="h-3.5 w-3.5" />
            {departments.length} departments
          </Badge>
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Master FRC, <span className="text-gradient">department by department</span>
          </h1>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Every track is a complete curriculum — structured modules and
            example-rich lessons that build from the fundamentals to advanced.
          </p>
          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-primary" /> {totalModules} modules
            </span>
            <span className="inline-flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-accent" /> {totalLessons} lessons
            </span>
          </div>
        </Reveal>

        <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {departments.map((d) => (
            <StaggerItem key={d.slug}>
              <DepartmentCard
                slug={d.slug}
                name={d.name}
                tagline={d.tagline}
                moduleCount={d.moduleCount}
                lessonCount={d.lessonCount}
                progressPct={user ? progress[d.id] : undefined}
              />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </div>
  );
}
