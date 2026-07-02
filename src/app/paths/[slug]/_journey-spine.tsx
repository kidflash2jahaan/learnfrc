"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * The animated progress spine that draws down the journey rail as the reader
 * scrolls through the steps. Transform/opacity only; respects reduced motion.
 * Purely decorative — the ordered list of steps carries all real meaning.
 */
export function JourneySpine() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(reduce ? 1 : 0);

  useEffect(() => {
    if (reduce) {
      setProgress(1);
      return;
    }
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the rail top hits ~70% viewport, 1 once its bottom passes ~40%.
      const start = vh * 0.72;
      const end = vh * 0.4;
      const total = rect.height + (start - end);
      const travelled = start - rect.top;
      const p = Math.min(1, Math.max(0, travelled / total));
      setProgress(p);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduce]);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute bottom-7 left-[27px] top-7 w-[3px] overflow-hidden rounded-full"
    >
      {/* dim track */}
      <span className="absolute inset-0 rounded-full bg-border" />
      {/* lit progress */}
      <span
        className="absolute inset-x-0 top-0 origin-top rounded-full transition-transform duration-150 ease-out"
        style={{
          bottom: 0,
          transform: `scaleY(${progress})`,
          background:
            "linear-gradient(to bottom, #2560e6, #1478a6 55%, #1aa9d6)",
          boxShadow: "0 0 12px rgba(37,96,230,0.45)",
        }}
      />
    </div>
  );
}
