"use client";

import * as React from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useInView,
  useReducedMotion,
} from "framer-motion";

/**
 * Signature mission-dial: a spring-animated concentric progress ring that
 * fills to the department completion percentage when it scrolls into view.
 * The numeric readout counts up in lockstep with the arc. Reduced-motion
 * users get the final state immediately with no animation.
 */
export function ProgressDial({
  pct,
  doneCount,
  totalLessons,
  accent,
  ink,
}: {
  pct: number;
  doneCount: number;
  totalLessons: number;
  accent: string;
  ink: string;
}) {
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  const R = 78;
  const CIRC = 2 * Math.PI * R;

  const progress = useMotionValue(0);
  const spring = useSpring(progress, { stiffness: 60, damping: 18, mass: 1 });

  // dashoffset: full circle at 0%, empty at 100%
  const dashoffset = useTransform(spring, (v) => CIRC * (1 - v / 100));
  const [readout, setReadout] = React.useState(0);

  React.useEffect(() => {
    if (reduce) {
      progress.set(pct);
      setReadout(pct);
      return;
    }
    if (inView) progress.set(pct);
  }, [inView, pct, reduce, progress]);

  React.useEffect(() => {
    const unsub = spring.on("change", (v) => setReadout(Math.round(v)));
    return () => unsub();
  }, [spring]);

  return (
    <div ref={ref} className="relative flex items-center justify-center">
      {/* soft accent halo behind the dial */}
      <span
        aria-hidden
        className="pointer-events-none absolute h-40 w-40 rounded-full opacity-60 blur-2xl"
        style={{ background: `radial-gradient(circle, ${accent}, transparent 70%)` }}
      />
      <svg
        width="204"
        height="204"
        viewBox="0 0 204 204"
        className="relative -rotate-90"
        aria-hidden="true"
      >
        <circle
          cx="102"
          cy="102"
          r={R}
          fill="none"
          strokeWidth="14"
          className="stroke-primary/10"
        />
        <motion.circle
          cx="102"
          cy="102"
          r={R}
          fill="none"
          strokeWidth="14"
          strokeLinecap="round"
          stroke={accent}
          strokeDasharray={CIRC}
          style={{ strokeDashoffset: reduce ? CIRC * (1 - pct / 100) : dashoffset }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="aq-display text-5xl font-extrabold leading-none tabular-nums"
          style={{ color: ink }}
        >
          {readout}
          <span className="text-2xl">%</span>
        </span>
        <span className="mt-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          mastered
        </span>
        <span className="mt-2 text-sm font-medium text-foreground/70">
          <span className="font-semibold text-foreground" style={{ color: ink }}>
            {doneCount}
          </span>{" "}
          / {totalLessons} lessons
        </span>
      </div>
    </div>
  );
}
