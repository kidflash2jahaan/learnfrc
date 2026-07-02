"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { MapPin, Flag, ArrowRight } from "lucide-react";
import { Icon } from "@/lib/icon-map";

type Station = {
  deptSlug: string;
  label: string;
  note: string;
  color: string;
  icon: string;
  ink: string;
};

/**
 * The signature element: an interactive "journey map" for the featured path.
 * A vertical route spine threads numbered stations (departments). Hovering /
 * focusing a station lifts it and reveals its note in the map panel — the page
 * literally reads as a route you travel, not a list you scroll.
 */
export function FeaturedRoute({
  title,
  description,
  slug,
  color,
  icon,
  stations,
}: {
  title: string;
  description: string;
  slug: string;
  color: string;
  icon: string;
  stations: Station[];
}) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const current = stations[active] ?? stations[0];

  return (
    <aside className="aq-glass aq-sheen aq-float aq-rise aq-rise-3 relative overflow-hidden rounded-3xl p-6 sm:p-7">
      {/* header */}
      <div className="flex items-center gap-3">
        <span
          className="aq-badge aq-badge-bob flex h-12 w-12 flex-none items-center justify-center rounded-2xl"
          style={{ "--a": color } as CSSProperties}
        >
          <Icon name={icon} aria-hidden className="h-6 w-6" />
        </span>
        <div className="min-w-0">
          <p className="aq-eyebrow">
            <MapPin aria-hidden className="h-3 w-3" />
            The featured route
          </p>
          <p className="aq-display truncate text-lg font-semibold leading-tight text-foreground">
            {title}
          </p>
        </div>
      </div>

      {/* live note for the hovered/focused station */}
      <div
        className="mt-4 min-h-[64px] rounded-2xl border border-white/60 bg-white/55 p-3.5 text-sm leading-relaxed text-foreground/80"
        aria-live="polite"
      >
        <span className="font-semibold text-foreground">
          Stop {active + 1}. {current?.label}
        </span>{" "}
        — {current?.note ?? description}
      </div>

      {/* the route spine */}
      <ol className="relative mt-5 space-y-1">
        {/* vertical rail */}
        <span
          aria-hidden
          className="absolute left-[19px] top-3 bottom-3 w-0.5 rounded-full"
          style={{
            background:
              "linear-gradient(to bottom, rgba(37,96,230,0.5), rgba(26,169,214,0.5))",
          }}
        />
        {stations.map((s, i) => {
          const isActive = i === active;
          return (
            <li key={i} className="relative">
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className="group flex w-full items-center gap-3 rounded-2xl px-2 py-2 text-left transition-colors duration-200 hover:bg-white/50 focus-visible:bg-white/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                aria-label={`Stop ${i + 1}: ${s.label}`}
                aria-current={isActive ? "step" : undefined}
              >
                {/* station node */}
                <motion.span
                  className="relative z-10 flex h-10 w-10 flex-none items-center justify-center rounded-xl ring-1 ring-white/70"
                  style={
                    {
                      background: `color-mix(in srgb, ${s.color} 22%, #fff)`,
                      color: s.ink,
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.85)",
                    } as CSSProperties
                  }
                  animate={
                    reduce
                      ? undefined
                      : { scale: isActive ? 1.12 : 1 }
                  }
                  transition={{ type: "spring", stiffness: 420, damping: 22 }}
                >
                  <Icon name={s.icon} aria-hidden className="h-[18px] w-[18px]" />
                </motion.span>
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
                  {s.label}
                </span>
                <span
                  aria-hidden
                  className="flex-none rounded-md bg-white/60 px-1.5 py-0.5 text-[11px] font-semibold tabular-nums text-muted-foreground ring-1 ring-white/60"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      {/* destination */}
      <div className="mt-3 flex items-center gap-3 rounded-2xl px-2 py-1 text-sm text-muted-foreground">
        <span className="relative z-10 flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-primary/12 text-primary ring-1 ring-primary/20">
          <Flag aria-hidden className="h-[18px] w-[18px]" />
        </span>
        <span className="font-medium text-foreground/70">
          Season-ready — you arrive here
        </span>
      </div>

      <Link
        href={`/paths/${slug}`}
        className="aq-cta mt-5 inline-flex min-h-[44px] w-full items-center justify-center gap-2"
      >
        Travel this route
        <ArrowRight aria-hidden className="h-4 w-4" />
      </Link>
    </aside>
  );
}
