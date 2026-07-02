"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Arena Clay route transition — a soft rise + fade with a whisper of scale,
 * fired on every navigation (mounted from app/template.tsx).
 * Fully disabled under prefers-reduced-motion.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.992 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  );
}
