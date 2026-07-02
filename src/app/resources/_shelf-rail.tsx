"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

export type ShelfRailItem = {
  id: string;
  label: string;
  count: number;
  color: string;
};

/**
 * A sticky "toolbox index" rail beside the shelves. Tracks which shelf is in
 * view and highlights it; clicking a rung smooth-scrolls to that shelf.
 * Purely a navigation affordance — every target also has a real anchor id, so
 * the page works with JS disabled.
 */
export function ShelfRail({ items }: { items: ShelfRailItem[] }) {
  const [active, setActive] = useState<string>(items[0]?.id ?? "");
  const reduce = useReducedMotion();

  useEffect(() => {
    const sections = items
      .map((it) => document.getElementById(it.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [items]);

  function jump(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "start",
    });
  }

  return (
    <nav aria-label="Jump to a toolbox shelf" className="flex flex-col gap-1.5">
      {items.map((it) => {
        const isActive = active === it.id;
        return (
          <button
            key={it.id}
            type="button"
            onClick={() => jump(it.id)}
            aria-current={isActive ? "true" : undefined}
            className="group relative flex min-h-11 items-center gap-3 rounded-2xl px-3 py-2 text-left transition-colors hover:bg-card/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <span
              aria-hidden="true"
              className="h-6 w-1.5 shrink-0 rounded-full transition-all duration-300"
              style={{
                background: it.color,
                opacity: isActive ? 1 : 0.4,
                boxShadow: isActive
                  ? `0 0 12px color-mix(in srgb, ${it.color} 55%, transparent)`
                  : "none",
                transform: isActive ? "scaleY(1)" : "scaleY(0.72)",
              }}
            />
            <span
              className={`flex-1 truncate text-sm font-semibold transition-colors ${
                isActive ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {it.label}
            </span>
            <span className="shrink-0 font-mono text-[11px] font-semibold tabular-nums text-muted-foreground">
              {it.count}
            </span>
            {isActive && !reduce ? (
              <motion.span
                layoutId="shelf-rail-active"
                aria-hidden="true"
                className="absolute inset-0 -z-10 rounded-2xl bg-card/70 ring-1 ring-border"
                transition={{ type: "spring", stiffness: 400, damping: 34 }}
              />
            ) : null}
          </button>
        );
      })}
    </nav>
  );
}
