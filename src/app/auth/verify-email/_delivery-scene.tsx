"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { MailCheck, Rocket, Inbox } from "lucide-react";

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

/**
 * Signature element for the verify-email interstitial: a glass "delivery scene"
 * showing the confirmation link traveling from LearnFRC (the pit) to the
 * learner's inbox along an animated arc, landing on a pulsing, ready-to-open
 * envelope. Purely decorative — reassurance, not interaction.
 */
export function DeliveryScene() {
  const reduce = useReducedMotion();

  // Arc path across the 320x150 viewBox: launch pad -> apex -> inbox.
  const arc = "M 46 108 C 120 6, 200 6, 274 108";

  return (
    <div className="relative mx-auto w-full max-w-[320px]" aria-hidden>
      <svg
        viewBox="0 0 320 150"
        className="h-auto w-full overflow-visible"
        role="presentation"
      >
        <defs>
          <linearGradient id="vfx-arc" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#2560e6" />
            <stop offset="1" stopColor="#1aa9d6" />
          </linearGradient>
          <radialGradient id="vfx-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="rgba(37,96,230,0.28)" />
            <stop offset="1" stopColor="rgba(37,96,230,0)" />
          </radialGradient>
        </defs>

        {/* soft landing halo under the inbox */}
        <circle cx="274" cy="108" r="40" fill="url(#vfx-halo)" />

        {/* the dashed flight arc */}
        <motion.path
          d={arc}
          fill="none"
          stroke="url(#vfx-arc)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="6 9"
          initial={reduce ? false : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.9 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.35 }}
        />

        {/* the flying packet riding the arc */}
        {!reduce && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{
              duration: 2.6,
              times: [0, 0.12, 0.82, 1],
              ease: "easeInOut",
              delay: 0.4,
              repeat: Infinity,
              repeatDelay: 1.4,
            }}
          >
            <motion.g
              initial={{ offsetDistance: "0%" }}
              animate={{ offsetDistance: "100%" }}
              transition={{
                duration: 1.9,
                ease: EASE,
                delay: 0.4,
                repeat: Infinity,
                repeatDelay: 2.1,
              }}
              style={{ offsetPath: `path("${arc}")`, offsetRotate: "auto" }}
            >
              <circle r="9" fill="#fff" stroke="#2560e6" strokeWidth="1.5" />
            </motion.g>
          </motion.g>
        )}
      </svg>

      {/* launch pad — the pit */}
      <div className="absolute bottom-[6%] left-[6%] flex flex-col items-center gap-1">
        <motion.span
          className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-card/80 text-primary shadow-sm backdrop-blur"
          initial={reduce ? false : { scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.15 }}
        >
          <Rocket className="h-5 w-5" />
        </motion.span>
        <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          The pit
        </span>
      </div>

      {/* inbox — the destination, waiting to open */}
      <div className="absolute bottom-[6%] right-[4%] flex flex-col items-center gap-1">
        <motion.span
          className="relative flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-md"
          style={{ background: "linear-gradient(135deg,#2560e6,#1aa9d6)" }}
          initial={reduce ? false : { scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 240, damping: 16, delay: 1.5 }}
        >
          <MailCheck className="h-6 w-6" />
          {!reduce && (
            <motion.span
              className="absolute inset-0 rounded-2xl"
              style={{ boxShadow: "0 0 0 0 rgba(37,96,230,0.45)" }}
              animate={{ boxShadow: ["0 0 0 0 rgba(37,96,230,0.45)", "0 0 0 12px rgba(37,96,230,0)"] }}
              transition={{ duration: 2.2, ease: "easeOut", repeat: Infinity, delay: 1.8 }}
            />
          )}
        </motion.span>
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          <Inbox className="h-3 w-3" /> Your inbox
        </span>
      </div>
    </div>
  );
}
