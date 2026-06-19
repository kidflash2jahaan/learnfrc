"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Animated circular XP ring. Shows the current level in the center and fills
 * the arc to represent progress toward the next level (XP % 100).
 */
export function LevelRing({
  level,
  progressPct,
  size = 92,
  stroke = 7,
}: {
  level: number;
  progressPct: number; // 0..100 toward next level
  size?: number;
  stroke?: number;
}) {
  const reduce = useReducedMotion();
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, progressPct));
  const offset = c - (pct / 100) * c;

  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Level ${level}, ${Math.round(pct)}% to next level`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          className="stroke-muted"
        />
        <defs>
          <linearGradient id="level-ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-primary)" />
            <stop offset="100%" stopColor="var(--color-accent)" />
          </linearGradient>
        </defs>
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#level-ring-grad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: reduce ? offset : c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.1, ease: [0.21, 0.47, 0.32, 0.98], delay: 0.2 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          Lvl
        </span>
        <span className="font-display text-2xl font-bold leading-none text-gradient">
          {level}
        </span>
      </div>
    </div>
  );
}
