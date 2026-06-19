"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Layers } from "lucide-react";
import { Icon } from "@/lib/icon-map";
import { deptMeta } from "@/lib/departments";
import { Progress } from "@/components/ui/progress";
import { itemVariants } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

export function DepartmentCard({
  slug,
  name,
  tagline,
  moduleCount,
  lessonCount,
  progressPct,
  inStagger = true,
}: {
  slug: string;
  name: string;
  tagline: string | null;
  moduleCount?: number;
  lessonCount?: number;
  progressPct?: number;
  inStagger?: boolean;
}) {
  const m = deptMeta(slug);
  return (
    <motion.div
      variants={inStagger ? itemVariants : undefined}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="group relative h-full"
    >
      <Link
        href={`/guides/${slug}`}
        className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-sm)] transition-shadow duration-300 hover:shadow-[var(--shadow-lg)]"
      >
        {/* accent glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-15 blur-2xl transition-opacity duration-300 group-hover:opacity-30"
          style={{ background: m.color }}
        />
        {/* top accent line */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
          style={{ background: `linear-gradient(90deg, ${m.color}, ${m.to})` }}
        />

        <div className="mb-4 flex items-center">
          <motion.span
            whileHover={{ rotate: -6, scale: 1.06 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-[var(--shadow-md)]"
            style={{ backgroundImage: `linear-gradient(135deg, ${m.color}, ${m.to})` }}
          >
            <Icon name={m.icon} className="h-6 w-6" />
          </motion.span>
        </div>

        <h3 className="text-lg font-semibold leading-snug tracking-tight">
          {name}
        </h3>
        <p className="mt-1.5 line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">
          {tagline}
        </p>

        {typeof progressPct === "number" && (
          <div className="mt-4">
            <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span className="font-medium text-foreground">{progressPct}%</span>
            </div>
            <Progress
              value={progressPct}
              barClassName=""
              style={{ background: `linear-gradient(90deg, ${m.color}, ${m.to})` }}
            />
          </div>
        )}

        <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            {typeof moduleCount === "number" && (
              <span className="inline-flex items-center gap-1">
                <Layers className="h-3.5 w-3.5" /> {moduleCount} modules
              </span>
            )}
            {typeof lessonCount === "number" && (
              <span className="inline-flex items-center gap-1">
                <BookOpen className="h-3.5 w-3.5" /> {lessonCount} lessons
              </span>
            )}
          </div>
          <ArrowRight
            className={cn(
              "h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            )}
            style={{ color: m.color }}
          />
        </div>
      </Link>
    </motion.div>
  );
}
