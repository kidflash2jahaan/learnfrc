"use client";

import * as React from "react";
import type { CSSProperties } from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { Search, Sparkles, X } from "lucide-react";
import type { GlossaryTerm } from "@/lib/glossary-data";
import { GlossaryBrowser } from "@/components/glossary/glossary-browser";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

/**
 * Signature element: a big, interactive A–Z alphabet arc that sits above the
 * search browser. Each letter that has terms is a live clay chip; tapping one
 * scrolls to the search panel and pre-fills the real GlossaryBrowser input by
 * writing to its native value setter (so the existing client component stays
 * fully wired and untouched). Letters with no terms are dimmed and inert.
 */
export function AlphabetSearch({
  terms,
  categories,
}: {
  terms: GlossaryTerm[];
  categories: readonly string[];
}) {
  const reduce = useReducedMotion();
  const [active, setActive] = React.useState<string | null>(null);
  const browserRef = React.useRef<HTMLDivElement>(null);

  // Map each starting letter -> count of terms, for the rail.
  const counts = React.useMemo(() => {
    const map = new Map<string, number>();
    for (const t of terms) {
      const first = (t.term[0] ?? "").toUpperCase();
      if (first) map.set(first, (map.get(first) ?? 0) + 1);
    }
    return map;
  }, [terms]);

  const withTerms = React.useMemo(
    () => LETTERS.filter((l) => (counts.get(l) ?? 0) > 0).length,
    [counts]
  );

  /** Write into the real GlossaryBrowser <input> without editing that file. */
  const driveSearch = React.useCallback((value: string) => {
    const input = browserRef.current?.querySelector<HTMLInputElement>(
      'input[aria-label="Search glossary"]'
    );
    if (!input) return;
    const setter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value"
    )?.set;
    setter?.call(input, value);
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.focus();
  }, []);

  const pickLetter = React.useCallback(
    (letter: string) => {
      const next = active === letter ? null : letter;
      setActive(next);
      driveSearch(next ?? "");
      browserRef.current?.scrollIntoView({
        behavior: reduce ? "auto" : "smooth",
        block: "start",
      });
    },
    [active, driveSearch, reduce]
  );

  const clear = React.useCallback(() => {
    setActive(null);
    driveSearch("");
  }, [driveSearch]);

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.018, delayChildren: 0.1 } },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: 10, scale: 0.8 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 480, damping: 26 },
    },
  };

  return (
    <div>
      {/* ============ SIGNATURE: the A–Z alphabet arc ============ */}
      <div className="aq-glass aq-sheen rounded-[28px] p-5 sm:p-7">
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <span
            className="aq-badge aq-badge-bob flex h-11 w-11 shrink-0 items-center justify-center"
            style={{ "--a": "var(--primary)" } as CSSProperties}
          >
            <Sparkles className="h-5 w-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <h2 className="aq-display text-xl font-bold leading-tight text-foreground">
              Jump to a letter
            </h2>
            <p className="text-sm text-muted-foreground">
              {withTerms} letters of the FRC alphabet, decoded — tap one to
              filter the whole glossary.
            </p>
          </div>
          <AnimatePresence>
            {active && (
              <motion.button
                type="button"
                onClick={clear}
                initial={reduce ? undefined : { opacity: 0, scale: 0.8 }}
                animate={reduce ? undefined : { opacity: 1, scale: 1 }}
                exit={reduce ? undefined : { opacity: 0, scale: 0.8 }}
                className="aq-ghost ml-auto inline-flex h-10 items-center gap-1.5 rounded-2xl px-4 text-sm font-semibold"
              >
                <X className="h-4 w-4" aria-hidden />
                Clear {active}
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          className="grid grid-cols-6 gap-2 sm:grid-cols-9 lg:[grid-template-columns:repeat(13,minmax(0,1fr))]"
          variants={container}
          initial={reduce ? undefined : "hidden"}
          whileInView={reduce ? undefined : "show"}
          viewport={{ once: true, margin: "-40px" }}
        >
          {LETTERS.map((letter) => {
            const n = counts.get(letter) ?? 0;
            const has = n > 0;
            const isActive = active === letter;
            return (
              <motion.button
                key={letter}
                type="button"
                variants={item}
                onClick={() => has && pickLetter(letter)}
                disabled={!has}
                aria-pressed={isActive}
                aria-label={
                  has
                    ? `Filter to terms starting with ${letter} (${n})`
                    : `No terms starting with ${letter}`
                }
                whileHover={reduce || !has ? undefined : { y: -4, scale: 1.06 }}
                whileTap={reduce || !has ? undefined : { scale: 0.94 }}
                className={[
                  "group relative flex aspect-square min-h-[44px] flex-col items-center justify-center rounded-2xl transition-colors",
                  has
                    ? isActive
                      ? "aq-cta text-white"
                      : "aq-card aq-card-hover text-foreground"
                    : "cursor-default border border-border/60 text-muted-foreground/40",
                ].join(" ")}
              >
                <span className="aq-display text-lg font-bold leading-none sm:text-xl">
                  {letter}
                </span>
                {has && (
                  <span
                    className={[
                      "mt-0.5 font-mono text-[10px] leading-none tabular-nums",
                      isActive ? "text-white/85" : "text-muted-foreground",
                    ].join(" ")}
                  >
                    {n}
                  </span>
                )}
              </motion.button>
            );
          })}
        </motion.div>
      </div>

      {/* ============ the real, wired search browser ============ */}
      <div
        ref={browserRef}
        className="aq-glass aq-sheen mt-6 scroll-mt-24 rounded-[28px] p-5 sm:p-8"
      >
        <div className="mb-6 flex items-center gap-3">
          <span
            className="aq-badge aq-badge-bob flex h-11 w-11 items-center justify-center"
            style={{ "--a": "var(--accent)" } as CSSProperties}
          >
            <Search className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <h2 className="aq-display text-xl font-bold leading-tight text-foreground">
              Search the language of FRC
            </h2>
            <p className="text-sm text-muted-foreground">
              Type a term, an acronym, or a phrase — then narrow it down by
              category.
            </p>
          </div>
        </div>

        <div className="aq-divider mb-6" />

        <GlossaryBrowser terms={terms} categories={categories} />
      </div>
    </div>
  );
}
