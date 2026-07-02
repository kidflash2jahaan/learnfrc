"use client";

import * as React from "react";
import { AnimatedCounter } from "@/components/animated-counter";

type Heading = { id: string; text: string; level: number };

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * Signature element: a live "reading rail" for the lesson.
 * - Scans the rendered article for h2/h3, assigns stable ids, and builds an
 *   "On this page" scroll-spy list that lights up the section you're reading.
 * - Tracks reading progress (0–100%) as a filling spine + percentage.
 * All decorative; the article content itself is untouched server-rendered HTML.
 */
export function ReadingRail({
  articleId,
  deptName,
  pct,
  accent,
}: {
  articleId: string;
  deptName: string;
  pct: number;
  accent: string;
}) {
  const [headings, setHeadings] = React.useState<Heading[]>([]);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [progress, setProgress] = React.useState(0);

  // Discover headings inside the article and give them anchor ids.
  React.useEffect(() => {
    const article = document.getElementById(articleId);
    if (!article) return;
    const nodes = Array.from(
      article.querySelectorAll<HTMLHeadingElement>("h2, h3")
    );
    const seen = new Map<string, number>();
    const found: Heading[] = nodes.map((node) => {
      const text = node.textContent?.trim() || "Section";
      let id = node.id || slugify(text) || "section";
      // de-dupe collisions so scroll-spy stays 1:1
      if (seen.has(id)) {
        const n = seen.get(id)! + 1;
        seen.set(id, n);
        id = `${id}-${n}`;
      } else {
        seen.set(id, 0);
      }
      node.id = id;
      node.style.scrollMarginTop = "6rem";
      return { id, text, level: node.tagName === "H2" ? 2 : 3 };
    });
    setHeadings(found);
    if (found.length) setActiveId(found[0].id);
  }, [articleId]);

  // Scroll-spy: highlight the heading nearest the top of the viewport.
  React.useEffect(() => {
    if (!headings.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-96px 0px -66% 0px", threshold: 0 }
    );
    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  // Reading progress across the article body.
  React.useEffect(() => {
    const article = document.getElementById(articleId);
    if (!article) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = article.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height - vh;
      const scrolled = -rect.top;
      const p = total > 0 ? Math.min(1, Math.max(0, scrolled / total)) : rect.top <= 0 ? 1 : 0;
      setProgress(Math.round(p * 100));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [articleId]);

  const go = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    setActiveId(id);
    history.replaceState(null, "", `#${id}`);
  };

  // Ring geometry for the progress dial.
  const R = 26;
  const C = 2 * Math.PI * R;
  const offset = C - (progress / 100) * C;

  return (
    <div className="aq-card aq-reveal overflow-hidden p-5">
      {/* reading progress dial */}
      <div className="flex items-center gap-3.5">
        <div className="relative h-16 w-16 shrink-0">
          <svg
            viewBox="0 0 64 64"
            className="h-16 w-16 -rotate-90"
            aria-hidden
          >
            <circle
              cx="32"
              cy="32"
              r={R}
              fill="none"
              stroke="rgba(120,145,190,.24)"
              strokeWidth="7"
            />
            <circle
              cx="32"
              cy="32"
              r={R}
              fill="none"
              stroke="url(#railring)"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={offset}
              style={{ transition: "stroke-dashoffset .18s linear" }}
            />
            <defs>
              <linearGradient id="railring" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="var(--primary)" />
                <stop offset="1" stopColor={accent} />
              </linearGradient>
            </defs>
          </svg>
          <span className="absolute inset-0 flex items-center justify-center font-display text-sm font-bold tabular-nums text-foreground">
            {progress}%
          </span>
        </div>
        <div className="min-w-0">
          <div className="aq-eyebrow">Reading progress</div>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {progress >= 100 ? "You reached the end" : "Scroll to read on"}
          </p>
        </div>
      </div>

      {/* on this page — scroll-spy */}
      {headings.length > 0 && (
        <>
          <div className="aq-divider my-4" />
          <div className="aq-eyebrow mb-2">On this page</div>
          <nav aria-label="On this page">
            <ul className="relative space-y-0.5 pl-3">
              {/* the spine the active dot rides */}
              <span
                aria-hidden
                className="absolute left-0 top-1 bottom-1 w-px bg-border"
              />
              {headings.map((h) => {
                const active = h.id === activeId;
                return (
                  <li key={h.id} className="relative">
                    {active && (
                      <span
                        aria-hidden
                        className="absolute -left-3 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-full"
                        style={{ backgroundImage: `linear-gradient(var(--primary), ${accent})` }}
                      />
                    )}
                    <a
                      href={`#${h.id}`}
                      onClick={(e) => go(e, h.id)}
                      aria-current={active ? "location" : undefined}
                      className={[
                        "block truncate rounded-lg py-1.5 pr-2 text-sm transition-colors",
                        h.level === 3 ? "pl-4" : "pl-1",
                        active
                          ? "font-medium text-primary"
                          : "text-muted-foreground hover:text-foreground",
                      ].join(" ")}
                    >
                      {h.text}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </>
      )}

      {/* department progress footer */}
      <div className="aq-divider my-4" />
      <div className="aq-eyebrow">{deptName}</div>
      <div className="mt-2 flex items-baseline gap-1.5">
        <span className="font-display text-2xl font-bold text-foreground">
          <AnimatedCounter value={pct} suffix="%" />
        </span>
        <span className="text-xs text-muted-foreground">of the department</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className="aq-bar-anim h-full rounded-full"
          style={{ width: `${pct}%`, backgroundImage: `linear-gradient(90deg, var(--primary), ${accent})` }}
        />
      </div>
    </div>
  );
}
