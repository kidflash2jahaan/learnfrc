"use client";

import * as React from "react";
import type { CSSProperties } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useStaticMotion } from "@/components/perf-mode";

export type RailItem = { id: string; title: string };

/**
 * Sticky "match plan" contents rail with scroll-spy. Highlights the section
 * currently in view and smooth-scrolls to a section on click. Purely a
 * navigation aid layered on top of the (fully static, anchor-linked) content —
 * every section also has a real id, so this degrades gracefully.
 */
export function ContentsRail({ items }: { items: RailItem[] }) {
  const [active, setActive] = React.useState(items[0]?.id ?? "");
  const reduce = useReducedMotion();
  const stat = useStaticMotion();

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 },
    );
    for (const it of items) {
      const el = document.getElementById(it.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [items]);

  const jump = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    setActive(id);
    el.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "start",
    });
  };

  const doneIndex = items.findIndex((it) => it.id === active);
  const progress = items.length > 1 ? doneIndex / (items.length - 1) : 0;

  return (
    <nav aria-label="Terms sections" className="text-sm">
      <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
        <span className="aq-pulse inline-block h-2 w-2 rounded-full bg-primary" />
        Match plan
      </div>

      {/* progress track */}
      <div
        className="mb-5 h-1.5 w-full overflow-hidden rounded-full bg-primary/15"
        role="presentation"
      >
        <div
          className="h-full rounded-full transition-[width] duration-500 ease-out"
          style={{
            width: `${Math.max(6, progress * 100)}%`,
            background: "linear-gradient(90deg,#2560e6,#1aa9d6)",
          }}
        />
      </div>

      <ol className="space-y-1">
        {items.map((it, i) => {
          const isActive = it.id === active;
          return (
            <li key={it.id}>
              <button
                type="button"
                onClick={() => jump(it.id)}
                aria-current={isActive ? "true" : undefined}
                className="group flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-colors hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                <span
                  className="grid h-6 w-6 shrink-0 place-items-center rounded-lg text-[11px] font-bold tabular-nums transition-colors"
                  style={
                    {
                      background: isActive ? "#2560e6" : "rgba(37,96,230,0.10)",
                      color: isActive ? "#fff" : "#2560e6",
                    } as CSSProperties
                  }
                >
                  {i + 1}
                </span>
                <span
                  className={`flex-1 leading-snug transition-colors ${
                    isActive
                      ? "font-semibold text-foreground"
                      : "text-foreground/65 group-hover:text-foreground"
                  }`}
                >
                  {it.title}
                </span>
                {isActive &&
                  (stat ? (
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  ) : (
                    <motion.span
                      layoutId="rail-dot"
                      className="h-1.5 w-1.5 rounded-full bg-primary"
                      transition={{ type: "spring", stiffness: 500, damping: 32 }}
                    />
                  ))}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
