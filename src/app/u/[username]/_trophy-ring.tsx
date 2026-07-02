"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { useStaticMotion } from "@/components/perf-mode";

/**
 * Animated level medallion for the trophy card. The outer ring sweeps to the
 * fraction of XP earned toward the next level; the level number springs in.
 * Reduced-motion / perf-mode renders the final state statically.
 */
export function TrophyRing({
  level,
  fraction,
}: {
  /** Current learner level (>= 1). */
  level: number;
  /** Progress toward next level, 0..1. */
  fraction: number;
}) {
  const ref = React.useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useStaticMotion();

  const R = 62;
  const C = 2 * Math.PI * R;
  const clamped = Math.max(0, Math.min(1, fraction));
  const targetOffset = C * (1 - clamped);

  const animate =
    reduce || !inView ? undefined : { strokeDashoffset: targetOffset };

  return (
    <div className="relative flex h-[168px] w-[168px] items-center justify-center">
      <svg
        ref={ref}
        width="168"
        height="168"
        viewBox="0 0 168 168"
        aria-hidden="true"
        className="absolute inset-0"
      >
        <circle
          cx="84"
          cy="84"
          r={R}
          fill="none"
          stroke="rgba(120,145,190,.24)"
          strokeWidth="11"
        />
        <motion.circle
          cx="84"
          cy="84"
          r={R}
          fill="none"
          stroke="url(#trophyRing)"
          strokeWidth="11"
          strokeLinecap="round"
          strokeDasharray={C}
          initial={{ strokeDashoffset: reduce ? targetOffset : C }}
          animate={animate}
          transition={{ duration: 1.4, ease: [0.35, 0, 0.15, 1] }}
          transform="rotate(-90 84 84)"
        />
        <defs>
          <linearGradient id="trophyRing" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#2560e6" />
            <stop offset="0.55" stopColor="#1aa9d6" />
            <stop offset="1" stopColor="#e0a415" />
          </linearGradient>
        </defs>
      </svg>

      <motion.div
        className="relative flex flex-col items-center justify-center"
        initial={reduce ? false : { scale: 0.5, opacity: 0 }}
        animate={
          reduce || !inView ? undefined : { scale: 1, opacity: 1 }
        }
        transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.15 }}
      >
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
          Level
        </span>
        <span className="aq-display text-5xl font-extrabold leading-none tabular-nums text-foreground">
          {level}
        </span>
      </motion.div>
    </div>
  );
}
