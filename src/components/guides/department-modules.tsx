"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, CheckCircle2, Circle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type Lesson = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  estimated_minutes: number;
};
type ModuleT = {
  id: string;
  slug: string;
  title: string;
  overview: string | null;
  is_prerequisite?: boolean;
  lessons: Lesson[];
};

export function DepartmentModules({
  departmentSlug,
  modules,
  completedIds,
  accent,
}: {
  departmentSlug: string;
  modules: ModuleT[];
  completedIds: string[];
  accent: string;
}) {
  const completed = React.useMemo(() => new Set(completedIds), [completedIds]);
  const [open, setOpen] = React.useState<Record<string, boolean>>(() =>
    Object.fromEntries(modules.map((m, i) => [m.id, i === 0]))
  );

  // Number regular modules 1..N; prerequisite modules show a "start here" mark.
  let regular = 0;
  const labels = modules.map((m) => (m.is_prerequisite ? "pre" : String(++regular)));

  return (
    <div className="space-y-4">
      {modules.map((m, mi) => {
        const total = m.lessons.length;
        const done = m.lessons.filter((l) => completed.has(l.id)).length;
        const pct = total ? Math.round((done / total) * 100) : 0;
        const isOpen = open[m.id];
        const isPre = !!m.is_prerequisite;
        const label = labels[mi];
        return (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: mi * 0.04 }}
            className={cn(
              "overflow-hidden rounded-2xl border bg-card shadow-[var(--shadow-sm)]",
              isPre ? "border-primary/40 bg-primary/[0.04]" : "border-border"
            )}
          >
            <button
              onClick={() => setOpen((o) => ({ ...o, [m.id]: !o[m.id] }))}
              className="flex w-full items-center gap-4 p-5 text-left cursor-pointer"
              aria-expanded={isOpen}
            >
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-mono text-sm font-semibold text-white"
                style={{ background: accent }}
              >
                {isPre ? <Sparkles className="h-5 w-5" /> : String(Number(label)).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  {isPre && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary">
                      Start here · Prerequisite
                    </span>
                  )}
                  <h3 className="truncate font-semibold">{m.title}</h3>
                  {done === total && total > 0 && (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                  )}
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {isPre ? "Recommended before you start · " : ""}
                  {done}/{total} lessons · {pct}%
                </p>
              </div>
              <div className="hidden h-1.5 w-24 overflow-hidden rounded-full bg-muted sm:block">
                <div
                  className="h-full rounded-full transition-[width] duration-500"
                  style={{ width: `${pct}%`, background: accent }}
                />
              </div>
              <ChevronDown
                className={cn(
                  "h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300",
                  isOpen && "rotate-180"
                )}
              />
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-border px-3 pb-3 pt-1">
                    {m.overview && (
                      <p className="px-2 py-3 text-sm text-muted-foreground">
                        {m.overview}
                      </p>
                    )}
                    <ul className="space-y-0.5">
                      {m.lessons.map((l, li) => {
                        const isDone = completed.has(l.id);
                        return (
                          <li key={l.id}>
                            <Link
                              href={`/guides/${departmentSlug}/${m.slug}/${l.slug}`}
                              className="group flex items-center gap-3 rounded-xl px-2.5 py-2.5 transition-colors hover:bg-muted"
                            >
                              {isDone ? (
                                <CheckCircle2
                                  className="h-5 w-5 shrink-0"
                                  style={{ color: accent }}
                                />
                              ) : (
                                <Circle className="h-5 w-5 shrink-0 text-muted-foreground/40" />
                              )}
                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-sm font-medium group-hover:text-foreground">
                                  <span className="mr-2 font-mono text-xs text-muted-foreground">
                                    {isPre ? "P" : label}.{li + 1}
                                  </span>
                                  {l.title}
                                </span>
                              </span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
