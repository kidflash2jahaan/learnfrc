"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

const COLORS = ["#2f5fff", "#22d3ee", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

/** A lightweight one-shot confetti burst. Re-fires whenever `trigger` changes. */
export function Confetti({
  trigger,
  count = 22,
}: {
  trigger: number;
  count?: number;
}) {
  const reduce = useReducedMotion();
  const [pieces, setPieces] = React.useState<
    { id: string; x: number; y: number; r: number; c: string }[]
  >([]);

  React.useEffect(() => {
    if (trigger === 0 || reduce) return;
    const ps = Array.from({ length: count }, (_, i) => ({
      id: `${trigger}-${i}`,
      x: (Math.random() - 0.5) * 280,
      y: -(Math.random() * 200 + 60),
      r: Math.random() * 360,
      c: COLORS[i % COLORS.length],
    }));
    setPieces(ps);
    const t = setTimeout(() => setPieces([]), 1000);
    return () => clearTimeout(t);
  }, [trigger, reduce, count]);

  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 z-20">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          initial={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
          animate={{ opacity: 0, x: p.x, y: p.y, rotate: p.r }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute h-2 w-2 rounded-[2px]"
          style={{ background: p.c }}
        />
      ))}
    </div>
  );
}
