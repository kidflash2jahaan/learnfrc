"use client";

import { useRef, type ReactNode, type CSSProperties } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";

/**
 * Signature element: a friendly "pit-crew ID card" that gently tilts toward the
 * pointer with spring physics and lifts a soft holographic sheen. Purely
 * decorative motion — the card content (identity + credentials) is passed in as
 * children so it stays server-rendered. Reduced-motion safe: when the user
 * prefers reduced motion, the tilt/sheen are disabled and the card is static.
 */
export function TiltIdCard({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  const springCfg = { stiffness: 180, damping: 18, mass: 0.6 };
  const rotX = useSpring(useTransform(my, [0, 1], [6, -6]), springCfg);
  const rotY = useSpring(useTransform(mx, [0, 1], [-8, 8]), springCfg);

  // sheen position follows the pointer
  const sheenX = useTransform(mx, [0, 1], ["18%", "82%"]);
  const sheenY = useTransform(my, [0, 1], ["12%", "78%"]);
  const sheenBg = useTransform(
    [sheenX, sheenY],
    ([x, y]: string[]) =>
      `radial-gradient(340px circle at ${x} ${y}, rgba(255,255,255,0.9), rgba(140,180,255,0.28) 34%, transparent 62%)`
  );

  function handleMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  }

  function handleLeave() {
    mx.set(0.5);
    my.set(0.5);
  }

  if (reduce) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className={className}
      style={{
        ...style,
        rotateX: rotX,
        rotateY: rotY,
        transformPerspective: 1100,
        transformStyle: "preserve-3d",
      }}
      whileHover={{ scale: 1.012 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      {/* pointer-tracking holographic sheen */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-70 mix-blend-soft-light"
        style={{ background: sheenBg }}
      />
      {children}
    </motion.div>
  );
}
