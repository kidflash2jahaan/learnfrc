"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Crown, Flame, GraduationCap } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { AnimatedCounter } from "@/components/animated-counter";
import { inkFor } from "@/lib/departments";

const GOLD = "#ffd23d";

export type ChampionData = {
  id: string;
  name: string;
  username: string | null;
  avatarUrl: string | null;
  teamNumber: number | null;
  role: string;
  xp: number;
  level: number;
  lessons: number;
  isYou: boolean;
};

/**
 * Signature element: the champion spotlight. A floating clay-glass podium
 * plinth crowning the current all-time #1, with a spring crown drop and a
 * warm gold light beam — the "podium moment" made the hero of the page.
 */
export function ChampionSpotlight({ champion }: { champion: ChampionData }) {
  const reduce = useReducedMotion();
  const ink = inkFor(GOLD);

  const NameTag = (
    <span className="block max-w-full truncate font-display text-xl font-bold tracking-tight text-foreground">
      {champion.name}
    </span>
  );

  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.15, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="relative lg:justify-self-end"
    >
      {/* warm gold spotlight beam behind the plinth */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-8%] -z-10 h-[130%] w-[78%] -translate-x-1/2 opacity-70 blur-2xl"
        style={{
          background:
            "radial-gradient(60% 45% at 50% 0%, color-mix(in srgb, #ffd23d 55%, transparent), transparent 72%)",
        }}
      />

      <div className="aq-glass aq-sheen aq-float relative overflow-hidden rounded-[28px] px-6 pb-7 pt-8 text-center">
        {/* header row */}
        <div className="mb-5 flex items-center justify-center gap-2">
          <span
            className="aq-eyebrow"
            style={{ color: ink }}
          >
            Reigning champion
          </span>
        </div>

        {/* crown drop */}
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10, rotate: -14 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{
            delay: 0.55,
            type: "spring",
            stiffness: 240,
            damping: 15,
          }}
          className="mb-3 flex justify-center"
          aria-hidden
        >
          <Crown className="h-8 w-8" style={{ color: ink }} />
        </motion.div>

        {/* avatar in gold ring */}
        <div className="relative mx-auto w-fit">
          <div
            className="relative rounded-[1.35rem] p-[3px]"
            style={{
              backgroundImage: `linear-gradient(135deg, ${GOLD}, color-mix(in srgb, ${GOLD} 28%, transparent))`,
            }}
          >
            <Avatar
              name={champion.name}
              src={champion.avatarUrl}
              seed={champion.username ?? champion.id}
              className="h-24 w-24 rounded-[1.15rem] border-2 border-background sm:h-28 sm:w-28"
            />
          </div>
          <span
            aria-hidden
            className="absolute -bottom-3 left-1/2 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border-2 border-background font-display text-sm font-bold shadow-sm"
            style={{ background: GOLD, color: "var(--foreground)" }}
          >
            1
          </span>
        </div>

        {/* name + team */}
        <div className="mt-7">
          {champion.username ? (
            <Link
              href={`/u/${champion.username}`}
              className="-my-2 inline-flex min-h-[44px] max-w-full items-center justify-center rounded-md px-2 py-2 outline-none transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
            >
              {NameTag}
            </Link>
          ) : (
            NameTag
          )}
          <div className="mt-1.5 flex flex-wrap items-center justify-center gap-1.5 text-sm text-muted-foreground">
            {champion.isYou && (
              <span className="aq-chip px-1.5 py-0.5 font-semibold text-primary">
                You
              </span>
            )}
            {champion.teamNumber != null && (
              <span>Team {champion.teamNumber}</span>
            )}
            <span className="capitalize">· {champion.role}</span>
          </div>
        </div>

        {/* XP hero number */}
        <div className="mt-5">
          <span
            className="font-display text-4xl font-extrabold tabular-nums tracking-tight"
            style={{ color: ink }}
          >
            <AnimatedCounter value={champion.xp} />
          </span>
          <span className="ml-1.5 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            XP
          </span>
        </div>

        {/* plinth stats */}
        <div className="mt-6 grid grid-cols-2 gap-2.5 border-t border-border pt-4">
          <div
            className="aq-tile flex items-center justify-center gap-2 rounded-2xl px-3 py-2.5"
            style={{ "--a": GOLD } as CSSProperties}
          >
            <Flame className="h-4 w-4 text-foreground/80" aria-hidden />
            <span className="text-sm font-semibold text-foreground">
              Level{" "}
              <span className="tabular-nums">
                <AnimatedCounter value={champion.level} />
              </span>
            </span>
          </div>
          <div
            className="aq-tile flex items-center justify-center gap-2 rounded-2xl px-3 py-2.5"
            style={{ "--a": "var(--primary)" } as CSSProperties}
          >
            <GraduationCap className="h-4 w-4 text-foreground/80" aria-hidden />
            <span className="text-sm font-semibold text-foreground">
              <span className="tabular-nums">
                <AnimatedCounter value={champion.lessons} />
              </span>{" "}
              lessons
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
