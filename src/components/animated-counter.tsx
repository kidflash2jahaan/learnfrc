"use client";

import * as React from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";
import { useStaticMotion } from "@/components/perf-mode";

/**
 * Count-up stat. Hydration-safe: SSR and the first client render both show
 * the FINAL value (so server/client text always matches and the real number
 * is visible without JS); the 0 -> value spring only starts after mount,
 * and only when motion is allowed.
 */
export function AnimatedCounter({
  value,
  suffix = "",
  className,
}: {
  value: number;
  suffix?: string;
  className?: string;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useStaticMotion();
  const mv = useMotionValue(value);
  const spring = useSpring(mv, { stiffness: 60, damping: 18 });
  const [display, setDisplay] = React.useState(value);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    if (!mounted || reduce) {
      setDisplay(value);
      return;
    }
    const unsub = spring.on("change", (v) => setDisplay(Math.max(0, Math.round(v))));
    if (inView) {
      mv.jump(0);
      mv.set(value);
    }
    return unsub;
  }, [mounted, reduce, inView, value, mv, spring]);

  return (
    <span ref={ref} className={className}>
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}
