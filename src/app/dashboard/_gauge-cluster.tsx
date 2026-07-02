"use client";

import * as React from "react";
import {
  animate,
  useMotionValue,
  useReducedMotion,
  useTransform,
  motion,
} from "framer-motion";
import { Flame, Zap, Target } from "lucide-react";

/**
 * Signature element — the "instrument cluster".
 * Three telemetry gauges read out the learner's progress like a robot's
 * dashboard: a big Level ring in the middle, a Streak flame arc on the left,
 * and an XP-to-next-level dial on the right. Arcs spring-fill on mount and are
 * fully reduced-motion safe (they snap to final value with no animation).
 */

type GaugeProps = {
  /** 0–100 fill percentage of the arc */
  pct: number;
  /** the big number shown in the gauge center */
  value: number;
  /** small caption under the number */
  caption: string;
  /** tiny label above the number */
  label: string;
  suffix?: string;
  /** arc gradient stops */
  from: string;
  to: string;
  /** center glyph */
  glyph: "level" | "streak" | "xp";
  /** ring geometry */
  size: number;
  stroke: number;
  /** stagger delay in seconds */
  delay: number;
};

const GLYPHS = {
  level: Target,
  streak: Flame,
  xp: Zap,
} as const;

function Gauge({
  pct,
  value,
  caption,
  label,
  suffix = "",
  from,
  to,
  glyph,
  size,
  stroke,
  delay,
}: GaugeProps) {
  const reduce = useReducedMotion();
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  // 270° sweep (three-quarter dial), rotated so the gap sits at the bottom.
  const sweep = 0.75;
  const arcLen = c * sweep;
  const target = Math.max(0, Math.min(100, pct)) / 100;

  const progress = useMotionValue(reduce ? target : 0);
  const dashOffset = useTransform(progress, (p) => arcLen - arcLen * p);
  const [num, setNum] = React.useState(reduce ? value : 0);
  const uid = React.useId();

  React.useEffect(() => {
    if (reduce) {
      // num already initializes to `value` when reduced-motion; just snap the arc.
      progress.set(target);
      return;
    }
    const a = animate(progress, target, {
      duration: 1.15,
      delay,
      ease: [0.34, 1.2, 0.64, 1],
    });
    const n = animate(0, value, {
      duration: 1.15,
      delay,
      ease: [0.33, 1, 0.68, 1],
      onUpdate: (v) => setNum(Math.round(v)),
    });
    return () => {
      a.stop();
      n.stop();
    };
  }, [progress, target, value, delay, reduce]);

  const Glyph = GLYPHS[glyph];

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative"
        style={{ width: size, height: size }}
        aria-hidden
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          // rotate so the 270° arc opens at the bottom
          style={{ transform: "rotate(135deg)" }}
        >
          <defs>
            <linearGradient id={`g-${uid}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor={from} />
              <stop offset="1" stopColor={to} />
            </linearGradient>
          </defs>
          {/* track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="rgba(120,145,190,0.24)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${arcLen} ${c}`}
          />
          {/* fill */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={`url(#g-${uid})`}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${arcLen} ${c}`}
            style={{ strokeDashoffset: dashOffset }}
          />
        </svg>
        {/* center readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <Glyph
            aria-hidden
            className="mb-0.5 h-4 w-4"
            style={{ color: from }}
          />
          <span className="aq-display text-2xl font-extrabold leading-none tabular-nums text-foreground sm:text-3xl">
            {num.toLocaleString()}
            {suffix}
          </span>
        </div>
      </div>
      <div className="mt-1.5 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
          {label}
        </p>
        <p className="mt-0.5 text-[13px] text-muted-foreground">{caption}</p>
      </div>
    </div>
  );
}

export function GaugeCluster({
  level,
  levelPct,
  xpToNext,
  xp,
  xpIntoLevel,
  streak,
  xpMultiplier,
  nextLevel,
}: {
  level: number;
  levelPct: number;
  xpToNext: number;
  xp: number;
  xpIntoLevel: number;
  streak: number;
  xpMultiplier: string;
  nextLevel: number;
}) {
  // streak arc: saturate the ring at a 7-day week for a satisfying full loop.
  const streakPct = Math.min(100, (streak / 7) * 100);

  return (
    <div className="grid grid-cols-3 items-start gap-2 sm:gap-4">
      <Gauge
        glyph="streak"
        label="Streak"
        value={streak}
        caption={streak > 0 ? `${xpMultiplier}× XP` : "start today"}
        pct={streakPct}
        from="#ff8a3d"
        to="#ffb020"
        size={92}
        stroke={9}
        delay={0.12}
      />
      <Gauge
        glyph="level"
        label="Level"
        value={level}
        caption={`${levelPct}% to L${nextLevel}`}
        pct={levelPct}
        from="#2560e6"
        to="#1aa9d6"
        size={132}
        stroke={12}
        delay={0}
      />
      <Gauge
        glyph="xp"
        label="To next"
        value={xpToNext}
        caption={`${xp.toLocaleString()} XP total`}
        pct={(xpIntoLevel / (xpIntoLevel + xpToNext || 1)) * 100}
        from="#8b7fff"
        to="#b16bff"
        size={92}
        stroke={9}
        delay={0.24}
      />
    </div>
  );
}
