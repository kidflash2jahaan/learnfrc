import type { Metadata } from "next";
import type { CSSProperties } from "react";
import {
  ArrowUpRight,
  MessageSquarePlus,
  Library,
  Bookmark,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { deptMeta, inkFor } from "@/lib/departments";
import { Icon } from "@/lib/icon-map";
import { Reveal } from "@/components/motion/reveal";
import { FeedbackForm } from "@/components/feedback-form";
import { AnimatedCounter } from "@/components/animated-counter";
import type { Resource } from "@/lib/types";
import { ShelfRail } from "./_shelf-rail";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "The essential FRC links — official docs, software, vendors, community, and learning resources, plus the sources behind every LearnFRC guide.",
};

const CATEGORY_META: Record<
  string,
  { icon: string; a: string; blurb: string }
> = {
  "Official FIRST": {
    icon: "Trophy",
    a: "#2560e6",
    blurb: "The manual, season materials, and game tools straight from FIRST.",
  },
  "Software & Programming": {
    icon: "Code2",
    a: "#1aa9d6",
    blurb: "WPILib and the vision, path, and trajectory tools your code leans on.",
  },
  "CAD & Design": {
    icon: "PenTool",
    a: "#7c5cff",
    blurb: "Model the robot before you cut metal — free CAD built for FRC.",
  },
  "Hardware & Vendors": {
    icon: "Cog",
    a: "#0f9d8f",
    blurb: "Where the motors, gearboxes, and structure come from.",
  },
  "Community & Data": {
    icon: "LineChart",
    a: "#2560e6",
    blurb: "Forums and match data — the collective brain of the FRC world.",
  },
};

const CURATED: { category: string; links: Resource[] }[] = [
  {
    category: "Official FIRST",
    links: [
      { title: "FIRST Robotics Competition", url: "https://www.firstinspires.org/robotics/frc" },
      { title: "FRC Game & Season Materials", url: "https://www.firstinspires.org/resource-library/frc/competition-manual-qa-system" },
      { title: "FRC Driver Station & Game Tools", url: "https://docs.wpilib.org/en/stable/docs/zero-to-robot/step-2/frc-game-tools.html" },
    ],
  },
  {
    category: "Software & Programming",
    links: [
      { title: "WPILib Documentation", url: "https://docs.wpilib.org" },
      { title: "PathPlanner", url: "https://pathplanner.dev" },
      { title: "Choreo (trajectory tool)", url: "https://choreo.autos" },
      { title: "PhotonVision", url: "https://docs.photonvision.org" },
      { title: "Limelight Documentation", url: "https://docs.limelightvision.io" },
    ],
  },
  {
    category: "CAD & Design",
    links: [
      { title: "Onshape", url: "https://www.onshape.com" },
      { title: "Onshape for FRC (FeatureScript/MKCad)", url: "https://www.mkcad.com" },
    ],
  },
  {
    category: "Hardware & Vendors",
    links: [
      { title: "REV Robotics", url: "https://www.revrobotics.com" },
      { title: "CTR Electronics (Phoenix)", url: "https://store.ctr-electronics.com" },
      { title: "AndyMark", url: "https://www.andymark.com" },
      { title: "WestCoast Products (WCP)", url: "https://wcproducts.com" },
    ],
  },
  {
    category: "Community & Data",
    links: [
      { title: "Chief Delphi (forums)", url: "https://www.chiefdelphi.com" },
      { title: "The Blue Alliance", url: "https://www.thebluealliance.com" },
      { title: "Statbotics", url: "https://www.statbotics.io" },
    ],
  },
];

/** Slug-safe anchor id for a category name. */
function shelfId(category: string): string {
  return "shelf-" + category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

/** Strip protocol/www for a compact host label under each link. */
function hostLabel(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export default async function ResourcesPage() {
  const supabase = await createClient();
  const { data: departments } = await supabase
    .from("departments")
    .select("name, slug, sources")
    .order("sort_order");

  const totalLinks = CURATED.reduce((s, g) => s + g.links.length, 0);
  const withSources = (departments ?? []).filter(
    (d) => ((d.sources as Resource[]) ?? []).length > 0,
  );
  const totalSources = withSources.reduce(
    (s, d) => s + ((d.sources as Resource[]) ?? []).length,
    0,
  );

  const railItems = CURATED.map((g) => ({
    id: shelfId(g.category),
    label: g.category,
    count: g.links.length,
    color: (CATEGORY_META[g.category] ?? { a: "#2560e6" }).a,
  }));

  return (
    <div className="relative overflow-x-clip">
      {/* Ambient glows — owned by the full-width wrapper so any clip lands at the
          viewport edge (invisible), not the container edge (visible seam). */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-10 -z-10 h-72 w-72 rounded-full opacity-60 blur-3xl aq-float"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--primary) 22%, transparent), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-52 -z-10 h-80 w-80 rounded-full opacity-50 blur-3xl aq-float"
        style={{
          animationDelay: "1.4s",
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--accent) 20%, transparent), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/3 top-[820px] -z-10 h-72 w-72 rounded-full opacity-40 blur-3xl aq-float"
        style={{
          animationDelay: "0.7s",
          background:
            "radial-gradient(circle, color-mix(in srgb, #7c5cff 22%, transparent), transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 pt-28 pb-24 sm:px-6 lg:px-8">
        {/* ============================ HERO ============================ */}
        <section className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="aq-eyebrow aq-rise aq-rise-1">The FRC toolbox</p>
            <h1 className="aq-display aq-rise aq-rise-2 mt-3 text-balance text-4xl font-bold tracking-tight sm:text-5xl">
              Every FRC{" "}
              <span
                className="aq-grad-anim"
                style={{
                  background:
                    "linear-gradient(120deg,#2560e6,#1aa9d6,#7c5cff,#2560e6)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                resource
              </span>{" "}
              worth keeping
            </h1>
            <p className="aq-rise aq-rise-3 mt-4 max-w-xl text-pretty text-lg leading-relaxed text-foreground/70">
              A curated toolbox for build season — the docs, software, vendors,
              and community hubs every team reaches for, organized on shelves so
              you always know where to look. Plus the authoritative sources
              behind every LearnFRC guide.
            </p>
            <div className="aq-rise aq-rise-4 mt-7 flex flex-wrap items-center gap-3">
              <a
                href="#toolbox"
                className="aq-cta inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold"
              >
                <Library className="h-4 w-4" aria-hidden="true" focusable="false" />
                Open the toolbox
              </a>
              <a
                href="#suggest"
                className="aq-ghost inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold"
              >
                <MessageSquarePlus
                  className="h-4 w-4"
                  aria-hidden="true"
                  focusable="false"
                />
                Suggest a resource
              </a>
            </div>
          </div>

          {/* Signature preview: a miniature "toolbox lid" of labeled shelves */}
          <div className="aq-glass aq-sheen aq-float aq-rise aq-rise-3 rounded-3xl p-6 sm:p-7">
            <div className="mb-5 flex items-center gap-2">
              <span className="aq-icon flex h-9 w-9 items-center justify-center rounded-xl">
                <Bookmark
                  className="h-[18px] w-[18px] text-primary"
                  aria-hidden="true"
                  focusable="false"
                />
              </span>
              <span className="aq-display text-[17px] font-bold text-foreground">
                Five tidy shelves
              </span>
            </div>
            <div className="space-y-2.5">
              {CURATED.map((g, i) => {
                const cm =
                  CATEGORY_META[g.category] ?? { icon: "BookOpen", a: "#2560e6" };
                return (
                  <a
                    key={g.category}
                    href={`#${shelfId(g.category)}`}
                    className="aq-card aq-card-hover aq-reveal group flex items-center gap-3 rounded-2xl px-3.5 py-3"
                    style={{ animationDelay: `${0.15 + i * 0.09}s` }}
                  >
                    <span
                      className="aq-badge aq-badge-bob flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                      style={{ "--a": cm.a } as CSSProperties}
                      aria-hidden="true"
                    >
                      <Icon name={cm.icon} className="h-[18px] w-[18px]" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-foreground">
                        {g.category}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {g.links.length} link{g.links.length === 1 ? "" : "s"}
                      </span>
                    </span>
                    <ArrowUpRight
                      className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                  </a>
                );
              })}
            </div>
            <div className="aq-divider my-5" />
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <div className="aq-display text-2xl font-bold text-foreground">
                  <AnimatedCounter value={totalLinks} />
                </div>
                <div className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  Links
                </div>
              </div>
              <div>
                <div className="aq-display text-2xl font-bold text-foreground">
                  <AnimatedCounter value={CURATED.length} />
                </div>
                <div className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  Shelves
                </div>
              </div>
              <div>
                <div className="aq-display text-2xl font-bold text-foreground">
                  <AnimatedCounter value={totalSources} suffix="+" />
                </div>
                <div className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  Sources
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================ TOOLBOX ========================= */}
        <section id="toolbox" className="mt-24 scroll-mt-28">
          <Reveal className="aq-reveal">
            <p className="aq-eyebrow">Everything on a shelf</p>
            <h2 className="aq-display mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              The curated toolbox
            </h2>
            <p className="mt-3 max-w-2xl text-foreground/70">
              Grouped the way a well-run pit is — each shelf holds the tools for
              one job, so the link you need is always where you expect it.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-8 lg:grid-cols-[220px_1fr]">
            {/* Sticky index rail (desktop) */}
            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Shelves
                </p>
                <ShelfRail items={railItems} />
              </div>
            </aside>

            {/* The shelves */}
            <div className="space-y-6">
              {CURATED.map((group, gi) => {
                const cm =
                  CATEGORY_META[group.category] ?? {
                    icon: "BookOpen",
                    a: "#2560e6",
                    blurb: "",
                  };
                const ink = inkFor(cm.a);
                return (
                  <Reveal
                    key={group.category}
                    className="aq-reveal"
                    delay={gi * 0.05}
                  >
                    <section
                      id={shelfId(group.category)}
                      className="aq-card scroll-mt-28 overflow-hidden rounded-3xl p-0"
                    >
                      {/* Shelf header — the labeled edge of the shelf */}
                      <div
                        className="flex items-center gap-3 border-b border-border px-5 py-4"
                        style={{
                          background: `linear-gradient(180deg, color-mix(in srgb, ${cm.a} 10%, transparent), transparent)`,
                        }}
                      >
                        <span
                          className="aq-badge aq-badge-bob flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                          style={{ "--a": cm.a } as CSSProperties}
                          aria-hidden="true"
                        >
                          <Icon name={cm.icon} className="h-5 w-5" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <h3 className="aq-display text-lg font-bold leading-tight text-foreground">
                            {group.category}
                          </h3>
                          {cm.blurb ? (
                            <p className="mt-0.5 truncate text-sm text-muted-foreground">
                              {cm.blurb}
                            </p>
                          ) : null}
                        </div>
                        <span
                          className="shrink-0 rounded-full px-2.5 py-1 font-mono text-[11px] font-semibold tabular-nums"
                          style={{
                            color: ink,
                            background: `color-mix(in srgb, ${cm.a} 14%, transparent)`,
                          }}
                        >
                          {group.links.length}
                        </span>
                      </div>

                      {/* Shelf contents — the tools lined up */}
                      <ul className="divide-y divide-border">
                        {group.links.map((l, li) => (
                          <li
                            key={l.url}
                            className="aq-reveal"
                            style={{ animationDelay: `${li * 55}ms` }}
                          >
                            <a
                              href={l.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-card"
                            >
                              <span
                                aria-hidden="true"
                                className="h-9 w-1 shrink-0 rounded-full transition-all duration-300 group-hover:h-10"
                                style={{ background: cm.a }}
                              />
                              <span className="min-w-0 flex-1">
                                <span className="block truncate font-medium text-foreground transition-colors group-hover:text-primary">
                                  {l.title}
                                  <span className="sr-only">
                                    {" "}
                                    (opens in a new tab)
                                  </span>
                                </span>
                                <span className="truncate font-mono text-xs text-muted-foreground">
                                  {hostLabel(l.url)}
                                </span>
                              </span>
                              <span className="aq-icon flex h-8 w-8 shrink-0 items-center justify-center rounded-xl">
                                <ArrowUpRight
                                  className="h-4 w-4 text-primary transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                  aria-hidden="true"
                                  focusable="false"
                                />
                              </span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </section>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ====================== SOURCES BY DEPARTMENT ================= */}
        <Reveal className="aq-reveal mt-24">
          <p className="aq-eyebrow">Grounded in real sources</p>
          <h2 className="aq-display mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Sources behind the guides
          </h2>
          <p className="mb-6 mt-3 max-w-2xl text-foreground/70">
            Every LearnFRC guide is built on authoritative references — the same
            docs and manuals mentors point rookies to. Here they are, department
            by department.
          </p>
          <div className="mb-8 flex flex-wrap gap-3">
            <div className="aq-card aq-card-hover rounded-2xl px-5 py-3">
              <span className="aq-display text-2xl font-bold text-foreground">
                <AnimatedCounter value={totalSources} suffix="+" />
              </span>{" "}
              <span className="text-sm font-semibold text-muted-foreground">
                cited sources
              </span>
            </div>
            <div className="aq-card aq-card-hover rounded-2xl px-5 py-3">
              <span className="aq-display text-2xl font-bold text-foreground">
                <AnimatedCounter value={withSources.length} />
              </span>{" "}
              <span className="text-sm font-semibold text-muted-foreground">
                departments
              </span>
            </div>
          </div>
          {withSources.length === 0 ? (
            <div className="aq-card rounded-2xl p-6 text-foreground/70">
              Sources are being compiled — check back soon as each department&apos;s
              guides are published.
            </div>
          ) : null}
          <div className="grid gap-4 sm:grid-cols-2">
            {withSources.map((d, di) => {
              const m = deptMeta(d.slug as string);
              const ink = inkFor(m.color);
              const sources = ((d.sources as Resource[]) ?? []).slice(0, 6);
              return (
                <div
                  key={d.slug as string}
                  className="aq-tile aq-card-hover aq-reveal rounded-2xl p-5"
                  style={
                    {
                      "--a": m.color,
                      animationDelay: `${di * 80}ms`,
                    } as CSSProperties
                  }
                >
                  <div className="mb-4 flex items-center gap-3">
                    <span
                      className="aq-badge aq-badge-bob h-10 w-10"
                      style={{ "--a": m.color } as CSSProperties}
                      aria-hidden="true"
                    >
                      <Icon name={m.icon} className="h-5 w-5" />
                    </span>
                    <h3 className="aq-display text-base font-bold text-foreground">
                      {d.name as string}
                    </h3>
                  </div>
                  <ul className="space-y-2">
                    {sources.map((s, i) => (
                      <li
                        key={i}
                        className="aq-reveal"
                        style={{ animationDelay: `${i * 50}ms` }}
                      >
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group inline-flex items-start gap-2 text-sm text-foreground/80 transition-colors hover:text-[var(--ink)]"
                          style={{ "--ink": ink } as CSSProperties}
                        >
                          <ArrowUpRight
                            className="mt-0.5 h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            style={{ color: ink }}
                            aria-hidden="true"
                            focusable="false"
                          />
                          <span>
                            {s.title}
                            <span className="sr-only"> (opens in a new tab)</span>
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </Reveal>

        {/* ============================ SUGGEST ========================= */}
        <Reveal className="aq-reveal mt-24">
          <div
            id="suggest"
            className="aq-glass aq-sheen scroll-mt-28 rounded-3xl p-6 sm:p-8"
          >
            <div className="mb-4 flex items-center gap-3">
              <span className="aq-icon aq-badge-bob flex h-11 w-11 items-center justify-center rounded-2xl">
                <MessageSquarePlus
                  className="h-5 w-5 text-primary"
                  aria-hidden="true"
                  focusable="false"
                />
              </span>
              <h2 className="aq-display text-xl font-bold sm:text-2xl">
                Suggest a topic or resource
              </h2>
            </div>
            <p className="mb-6 max-w-xl text-foreground/70">
              Missing something you&apos;d find useful? Tell us what to add — in
              the spirit of gracious professionalism, your suggestion goes
              straight to the team.
            </p>
            <div className="max-w-xl">
              <FeedbackForm page="/resources" />
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
