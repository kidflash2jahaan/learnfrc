"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Signature element for the 404 page: a charming FRC "lost robot" that has
 * drifted off the field. Its eyes gently track the cursor and it settles with a
 * soft spring; antenna light blinks. Fully decorative and reduced-motion safe.
 */
export function LostBot() {
  const reduce = useReducedMotion();
  const [gaze, setGaze] = React.useState({ x: 0, y: 0 });
  const wrapRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (reduce) return;
    function onMove(e: PointerEvent) {
      const el = wrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = (e.clientX - cx) / (r.width / 2 || 1);
      const dy = (e.clientY - cy) / (r.height / 2 || 1);
      // clamp pupil travel
      const clamp = (v: number) => Math.max(-1, Math.min(1, v));
      setGaze({ x: clamp(dx) * 3, y: clamp(dy) * 2.4 });
    }
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce]);

  return (
    <div
      ref={wrapRef}
      className="relative mx-auto aspect-square w-[220px] sm:w-[260px]"
      aria-hidden="true"
    >
      {/* soft ground shadow */}
      <motion.div
        className="absolute bottom-[6%] left-1/2 h-5 w-32 -translate-x-1/2 rounded-full bg-primary/25 blur-md"
        animate={reduce ? undefined : { scaleX: [1, 0.86, 1], opacity: [0.5, 0.35, 0.5] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute inset-0 grid place-items-center"
        animate={
          reduce
            ? undefined
            : { y: [0, -9, 0], rotate: [-2.5, 2.5, -2.5] }
        }
        transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg
          viewBox="0 0 200 200"
          className="h-full w-full drop-shadow-[0_16px_30px_rgba(37,96,230,0.22)]"
        >
          <defs>
            <linearGradient id="botBody" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="1" stopColor="#dbe7fb" />
            </linearGradient>
            <linearGradient id="botFace" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#2560e6" />
              <stop offset="1" stopColor="#1aa9d6" />
            </linearGradient>
            <linearGradient id="botTread" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#3a4a6b" />
              <stop offset="1" stopColor="#556489" />
            </linearGradient>
          </defs>

          {/* antenna */}
          <line
            x1="100"
            y1="40"
            x2="100"
            y2="18"
            stroke="#8aa0c6"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <motion.circle
            cx="100"
            cy="14"
            r="6"
            fill="#12b565"
            animate={reduce ? undefined : { opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* head / body shell */}
          <rect
            x="42"
            y="40"
            width="116"
            height="96"
            rx="26"
            fill="url(#botBody)"
            stroke="#c4d4ef"
            strokeWidth="2"
          />

          {/* ear knobs */}
          <rect x="30" y="70" width="14" height="34" rx="7" fill="#c9d7f0" />
          <rect x="156" y="70" width="14" height="34" rx="7" fill="#c9d7f0" />

          {/* face screen */}
          <rect x="58" y="58" width="84" height="60" rx="18" fill="url(#botFace)" />

          {/* eyes (whites) */}
          <circle cx="84" cy="86" r="12" fill="#ffffff" />
          <circle cx="116" cy="86" r="12" fill="#ffffff" />
          {/* pupils track the cursor */}
          <motion.g
            animate={{ x: gaze.x, y: gaze.y }}
            transition={{ type: "spring", stiffness: 140, damping: 14 }}
          >
            <circle cx="84" cy="86" r="5.5" fill="#182338" />
            <circle cx="116" cy="86" r="5.5" fill="#182338" />
          </motion.g>

          {/* puzzled little mouth */}
          <path
            d="M86 106 q14 -8 28 0"
            fill="none"
            stroke="#bfe0ff"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* treads / base */}
          <rect x="50" y="140" width="100" height="26" rx="13" fill="url(#botTread)" />
          <circle cx="70" cy="153" r="5.5" fill="#e6eefb" />
          <circle cx="100" cy="153" r="5.5" fill="#e6eefb" />
          <circle cx="130" cy="153" r="5.5" fill="#e6eefb" />
        </svg>
      </motion.div>

      {/* floating question marks */}
      {[
        { left: "6%", top: "8%", d: 0, s: "text-lg" },
        { left: "82%", top: "20%", d: 0.6, s: "text-xl" },
        { left: "88%", top: "60%", d: 1.1, s: "text-base" },
      ].map((q, i) => (
        <motion.span
          key={i}
          className={`aq-display absolute font-bold text-primary/70 ${q.s}`}
          style={{ left: q.left, top: q.top }}
          animate={
            reduce ? undefined : { y: [0, -8, 0], opacity: [0.35, 0.85, 0.35] }
          }
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: q.d,
          }}
        >
          ?
        </motion.span>
      ))}
    </div>
  );
}
