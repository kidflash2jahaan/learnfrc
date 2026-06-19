"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Code2, Cog, PenTool, Zap, Trophy, Cpu, CheckCircle2 } from "lucide-react";

const ROWS = [
  { label: "Programming", color: "#10b981", to: "#22d3ee", pct: 82, Icon: Code2 },
  { label: "Mechanical", color: "#f97316", to: "#f59e0b", pct: 64, Icon: Cog },
  { label: "CAD & Design", color: "#8b5cf6", to: "#d946ef", pct: 48, Icon: PenTool },
  { label: "Electrical", color: "#f59e0b", to: "#facc15", pct: 30, Icon: Zap },
];

const FLOATERS = [
  { Icon: Trophy, color: "#eab308", x: "-8%", y: "12%", d: 0 },
  { Icon: Cpu, color: "#06b6d4", x: "92%", y: "8%", d: 0.6 },
  { Icon: CheckCircle2, color: "#22c55e", x: "96%", y: "70%", d: 1.1 },
];

export function HeroVisual() {
  const reduce = useReducedMotion();
  const R = 34;
  const C = 2 * Math.PI * R;
  const overall = 56;

  return (
    <div className="relative mx-auto w-full max-w-md">
      {/* glow */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 aurora-bg opacity-60 blur-3xl animate-aurora"
      />

      <motion.div
        initial={{ opacity: 0, y: 24, rotateX: 8 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="relative"
        style={{ perspective: 1000 }}
      >
        <motion.div
          animate={reduce ? {} : { y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="glass rounded-3xl border border-border p-6 shadow-[var(--shadow-lg)]"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Your FRC Mastery
              </div>
              <div className="mt-1 font-display text-2xl font-bold">
                Build season ready
              </div>
            </div>
            {/* XP ring */}
            <div className="relative h-20 w-20">
              <svg viewBox="0 0 80 80" className="h-20 w-20 -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r={R}
                  fill="none"
                  stroke="var(--muted)"
                  strokeWidth="8"
                />
                <motion.circle
                  cx="40"
                  cy="40"
                  r={R}
                  fill="none"
                  stroke="url(#ring)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={C}
                  initial={{ strokeDashoffset: C }}
                  animate={{ strokeDashoffset: C - (C * overall) / 100 }}
                  transition={{ duration: 1.4, delay: 0.4, ease: "easeOut" }}
                />
                <defs>
                  <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#2f5fff" />
                    <stop offset="100%" stopColor="#22d3ee" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-display text-lg font-bold">
                {overall}%
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {ROWS.map((r, i) => (
              <div key={r.label}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="inline-flex items-center gap-2 font-medium">
                    <span
                      className="flex h-6 w-6 items-center justify-center rounded-md text-white"
                      style={{ background: `linear-gradient(135deg, ${r.color}, ${r.to})` }}
                    >
                      <r.Icon className="h-3.5 w-3.5" />
                    </span>
                    {r.label}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">
                    {r.pct}%
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${r.color}, ${r.to})` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${r.pct}%` }}
                    transition={{ duration: 1, delay: 0.5 + i * 0.15, ease: "easeOut" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* floating chips */}
      {FLOATERS.map((f, i) => (
        <motion.div
          key={i}
          className="absolute flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-card shadow-[var(--shadow-md)]"
          style={{ left: f.x, top: f.y, color: f.color }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={
            reduce
              ? { opacity: 1, scale: 1 }
              : { opacity: 1, scale: 1, y: [0, -12, 0] }
          }
          transition={{
            opacity: { delay: 0.8 + i * 0.2 },
            scale: { delay: 0.8 + i * 0.2, type: "spring" },
            y: { duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: f.d },
          }}
        >
          <f.Icon className="h-5 w-5" />
        </motion.div>
      ))}
    </div>
  );
}
