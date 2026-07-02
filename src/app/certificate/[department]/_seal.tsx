"use client";

import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import { Icon } from "@/lib/icon-map";
import { useStaticMotion } from "@/components/perf-mode";

/**
 * The signature element: a proud, embossed award medallion.
 * The department icon sits at the center, ringed by engraved micro-text.
 * Springs in on mount; falls back to a static seal under reduced motion / print.
 */
export function CertificateSeal({
  icon,
  color,
  to,
  ringText,
}: {
  icon: string;
  color: string;
  to: string;
  ringText: string;
}) {
  const staticMode = useStaticMotion();
  const id = "seal-arc";

  const seal = (
    <div className="relative h-28 w-28 sm:h-32 sm:w-32">
      {/* soft halo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full blur-xl print:hidden"
        style={{ background: `radial-gradient(circle, ${color}, transparent 68%)`, opacity: 0.4 }}
      />
      {/* engraved rotating ring text */}
      <svg
        viewBox="0 0 120 120"
        className="absolute inset-0 h-full w-full print:!animate-none"
        style={
          staticMode
            ? undefined
            : ({ animation: "aq-spin 26s linear infinite", transformOrigin: "center" } as CSSProperties)
        }
        aria-hidden
      >
        <defs>
          <path id={id} d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" fill="none" />
        </defs>
        <text
          className="fill-muted-foreground font-mono uppercase"
          style={{ fontSize: "8.4px", letterSpacing: "2.6px" }}
        >
          <textPath href={`#${id}`} startOffset="0">
            {ringText}
          </textPath>
        </text>
      </svg>
      {/* medallion body */}
      <div
        className="absolute inset-[18px] flex items-center justify-center rounded-full border shadow-[inset_0_2px_6px_rgba(255,255,255,0.7),0_10px_26px_-8px_rgba(37,96,230,0.45)] print:shadow-none"
        style={{
          background: `radial-gradient(120% 120% at 30% 22%, #ffffff, color-mix(in srgb, ${color} 16%, #ffffff))`,
          borderColor: `color-mix(in srgb, ${color} 50%, transparent)`,
        }}
      >
        {/* fluted inner ring */}
        <div
          aria-hidden
          className="absolute inset-1.5 rounded-full"
          style={{ border: `1.5px dashed color-mix(in srgb, ${color} 45%, transparent)` }}
        />
        <span
          className="flex h-11 w-11 items-center justify-center rounded-full text-white shadow-[0_6px_14px_rgba(37,96,230,0.3)] print:shadow-none"
          style={{ backgroundImage: `linear-gradient(135deg, ${color}, ${to})` }}
        >
          <Icon name={icon} className="h-6 w-6 text-white" />
        </span>
      </div>
    </div>
  );

  if (staticMode) {
    return <div className="flex justify-center print:animate-none">{seal}</div>;
  }

  return (
    <div className="flex justify-center">
      <motion.div
        initial={{ scale: 0.4, opacity: 0, rotate: -14 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 180, damping: 14, delay: 0.25 }}
      >
        {seal}
      </motion.div>
    </div>
  );
}
