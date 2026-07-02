"use client";

import * as React from "react";
import { List } from "lucide-react";

export interface TocItem {
  id: string;
  text: string;
}

/**
 * Reading rail — the article page's signature device.
 *
 * 1. A thin top reading-progress bar tracking scroll through the <article>.
 * 2. A sticky table of contents (desktop) built from the article's H2s, with
 *    scroll-spy highlighting the section you're currently reading.
 *
 * The TOC is derived server-side from the markdown; on mount we tag the
 * rendered <h2> headings (in order) with the matching ids so the anchors and
 * IntersectionObserver work without touching the Markdown renderer.
 * Fully reduced-motion safe (smooth scroll is opt-out via media query below).
 */
export function ReadingRail({ items }: { items: TocItem[] }) {
  const [progress, setProgress] = React.useState(0);
  const [activeId, setActiveId] = React.useState<string>(items[0]?.id ?? "");

  // Tag the rendered headings with stable ids (once, on mount).
  React.useEffect(() => {
    if (items.length === 0) return;
    const article = document.querySelector("article");
    if (!article) return;
    const headings = Array.from(article.querySelectorAll("h2")).filter((h) =>
      h.closest("[data-article-body]"),
    );
    items.forEach((it, i) => {
      const el = headings[i];
      if (el && !el.id) el.id = it.id;
    });
  }, [items]);

  // Reading progress + scroll-spy.
  React.useEffect(() => {
    if (items.length === 0) return;

    const onScroll = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      const pct = scrollable > 0 ? (doc.scrollTop / scrollable) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, pct)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-96px 0px -66% 0px", threshold: 0 },
    );
    items.forEach((it) => {
      const el = document.getElementById(it.id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, [items]);

  const onJump = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const top = el.getBoundingClientRect().top + window.scrollY - 88;
    window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
    setActiveId(id);
    el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
  };

  return (
    <>
      {/* Top reading-progress bar */}
      <div
        className="fixed inset-x-0 top-0 z-40 h-1 bg-transparent"
        aria-hidden
      >
        <div
          className="h-full origin-left rounded-r-full transition-[width] duration-150 ease-out"
          style={{
            width: `${progress}%`,
            background: "linear-gradient(90deg,#2560e6,#1aa9d6)",
          }}
        />
      </div>

      {/* Sticky table of contents (desktop only) */}
      {items.length > 1 && (
        <nav
          aria-label="On this page"
          className="hidden xl:block"
        >
          <div className="sticky top-28">
            <div className="aq-card rounded-2xl p-4">
              <p className="aq-eyebrow mb-3 flex items-center gap-1.5">
                <List aria-hidden className="h-3.5 w-3.5" /> On this page
              </p>
              <ul className="space-y-0.5">
                {items.map((it) => {
                  const active = it.id === activeId;
                  return (
                    <li key={it.id}>
                      <a
                        href={`#${it.id}`}
                        onClick={(e) => onJump(e, it.id)}
                        aria-current={active ? "location" : undefined}
                        className={[
                          "group flex items-start gap-2.5 rounded-lg py-1.5 pl-2.5 pr-2 text-sm leading-snug transition-colors",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                          active
                            ? "font-semibold text-primary"
                            : "text-muted-foreground hover:text-foreground",
                        ].join(" ")}
                      >
                        <span
                          aria-hidden
                          className={[
                            "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full transition-all duration-200",
                            active
                              ? "scale-125 bg-primary"
                              : "bg-border group-hover:bg-primary/60",
                          ].join(" ")}
                        />
                        {it.text}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </nav>
      )}
    </>
  );
}
