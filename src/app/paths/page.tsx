import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Route,
  Layers,
  Target,
  MapPin,
  Flag,
  Compass,
} from "lucide-react";
import { PATHS } from "@/lib/paths-data";
import { Icon } from "@/lib/icon-map";
import { deptMeta, deptInk } from "@/lib/departments";
import { AnimatedCounter } from "@/components/animated-counter";
import { FeaturedRoute } from "./_featured-route";

export const metadata: Metadata = {
  title: "Learning Paths",
  description:
    "Guided, multi-department journeys through FRC — onboarding, programming, build & design, the Impact Award, and game day.",
};

export default function PathsPage() {
  const totalSteps = PATHS.reduce((s, p) => s + p.steps.length, 0);
  const deptsTouched = new Set(
    PATHS.flatMap((p) => p.steps.map((s) => s.deptSlug)),
  ).size;

  const stats = [
    { icon: Route, v: PATHS.length, label: "curated routes" },
    { icon: Layers, v: totalSteps, label: "guided stops" },
    { icon: Target, v: deptsTouched, label: "departments" },
  ];

  const featured = PATHS[0];
  const featuredStations = featured
    ? featured.steps.map((step) => {
        const m = deptMeta(step.deptSlug);
        return {
          deptSlug: step.deptSlug,
          label: step.label,
          note: step.note,
          color: m.color,
          icon: m.icon,
          ink: deptInk(step.deptSlug),
        };
      })
    : [];

  return (
    <div className="relative mx-auto max-w-6xl px-4 pt-28 pb-24 sm:px-6 lg:px-8">
      {/* ambient glows */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="aq-float absolute -top-24 left-[8%] h-80 w-80 rounded-full opacity-60 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(37,96,230,0.22), transparent 70%)",
          }}
        />
        <div
          className="aq-float absolute top-40 right-[4%] h-96 w-96 rounded-full opacity-50 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(26,169,214,0.20), transparent 70%)",
            animationDelay: "1.6s",
          }}
        />
        <div
          className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full opacity-40 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(139,92,246,0.16), transparent 70%)",
          }}
        />
      </div>

      {/* ===== HERO ===== */}
      <section className="grid items-center gap-10 lg:grid-cols-[1.02fr_0.98fr]">
        <div>
          <p className="aq-eyebrow aq-rise aq-rise-1">
            <Compass aria-hidden className="h-3.5 w-3.5" />
            Pick a journey, not a page
          </p>
          <h1 className="aq-display aq-rise aq-rise-2 mt-4 text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Learn FRC as a{" "}
            <span
              className="aq-grad-anim"
              style={{
                background: "linear-gradient(120deg,#2560e6,#1aa9d6)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              journey
            </span>
          </h1>
          <p className="aq-rise aq-rise-3 mt-5 max-w-xl text-pretty text-lg leading-relaxed text-foreground/70">
            Not sure where to start? Each learning path is a mapped route —
            department by department — that threads the right guides together,
            from your first day in the pit to a robot-ready season.
          </p>

          <div className="aq-rise aq-rise-4 mt-8 flex flex-wrap items-center gap-3">
            <Link
              href={`/paths/${featured?.slug ?? ""}`}
              className="aq-cta min-h-[44px]"
            >
              Start the first route
              <ArrowRight aria-hidden className="h-4 w-4" />
            </Link>
            <Link
              href="/guides"
              className="aq-ghost inline-flex min-h-[44px] items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold"
            >
              Browse departments
            </Link>
          </div>

          {/* stat chips */}
          <div className="aq-rise aq-rise-5 mt-8 flex flex-wrap gap-3">
            {stats.map((s, i) => (
              <span
                key={s.label}
                className="aq-chip aq-reveal"
                style={{ animationDelay: `${i * 90}ms` }}
              >
                <s.icon
                  aria-hidden
                  className="aq-badge-bob h-3.5 w-3.5 text-primary"
                />
                <span className="font-semibold tabular-nums text-foreground">
                  <AnimatedCounter value={s.v} />
                </span>
                <span className="text-muted-foreground">{s.label}</span>
              </span>
            ))}
          </div>
        </div>

        {/* SIGNATURE: interactive journey-map of the featured route */}
        {featured && (
          <FeaturedRoute
            title={featured.title}
            description={featured.description}
            slug={featured.slug}
            color={featured.color}
            icon={featured.icon}
            stations={featuredStations}
          />
        )}
      </section>

      {/* ===== ROUTE CARDS ===== */}
      <div className="mt-24">
        <div className="aq-reveal flex items-end justify-between gap-4">
          <div>
            <p className="aq-eyebrow">
              <Route aria-hidden className="h-3.5 w-3.5" />
              Every route, mapped
            </p>
            <h2 className="aq-display mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              Choose your route
            </h2>
          </div>
          <p className="hidden max-w-xs text-sm text-muted-foreground sm:block">
            Each stop links straight into a live department guide — travel at
            your own pace.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {PATHS.map((p, idx) => (
            <article
              key={p.slug}
              className="aq-card aq-card-hover aq-reveal group relative flex h-full flex-col overflow-hidden rounded-3xl p-6 sm:p-7"
              style={{ animationDelay: `${idx * 90}ms` }}
            >
              {/* soft colored corner wash */}
              <div
                aria-hidden
                className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full opacity-25 blur-2xl transition-opacity duration-300 group-hover:opacity-45"
                style={{ background: p.color }}
              />

              {/* top row */}
              <div className="flex items-center justify-between">
                <span
                  className="aq-badge aq-badge-bob flex h-14 w-14 items-center justify-center rounded-2xl"
                  style={{ "--a": p.color } as CSSProperties}
                >
                  <Icon name={p.icon} aria-hidden className="h-7 w-7" />
                </span>
                <span
                  aria-hidden
                  className="rounded-full bg-white/55 px-2.5 py-1 text-xs font-semibold uppercase tabular-nums tracking-[0.16em] text-muted-foreground ring-1 ring-white/60"
                >
                  Route {String(idx + 1).padStart(2, "0")}
                </span>
              </div>

              <h3 className="aq-display mt-5 text-xl font-bold tracking-tight text-foreground">
                {p.title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-foreground/70">
                {p.description}
              </p>

              {/* the route: vertical spine of stops */}
              <div className="relative mt-6 flex-1">
                <span
                  aria-hidden
                  className="absolute left-[15px] top-4 bottom-8 w-0.5 rounded-full"
                  style={{
                    background:
                      "linear-gradient(to bottom, rgba(37,96,230,0.45), rgba(26,169,214,0.45))",
                  }}
                />
                <ol className="space-y-2.5">
                  <li className="flex items-center gap-3">
                    <span className="relative z-10 flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-primary/12 text-primary ring-1 ring-primary/20">
                      <MapPin aria-hidden className="h-4 w-4" />
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                      Start
                    </span>
                  </li>
                  {p.steps.map((step, i) => {
                    const m = deptMeta(step.deptSlug);
                    return (
                      <li key={i} className="flex items-center gap-3">
                        <span
                          className="relative z-10 flex h-8 w-8 flex-none items-center justify-center rounded-lg ring-1 ring-white/70 transition-transform duration-200 group-hover:scale-110"
                          style={
                            {
                              background: `color-mix(in srgb, ${m.color} 20%, #fff)`,
                              color: deptInk(step.deptSlug),
                              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.85)",
                            } as CSSProperties
                          }
                        >
                          <Icon name={m.icon} aria-hidden className="h-4 w-4" />
                        </span>
                        <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
                          {step.label}
                        </span>
                        <span
                          aria-hidden
                          className="flex-none text-xs font-semibold tabular-nums text-muted-foreground"
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </li>
                    );
                  })}
                  <li className="flex items-center gap-3">
                    <span className="relative z-10 flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-primary/12 text-primary ring-1 ring-primary/20">
                      <Flag aria-hidden className="h-4 w-4" />
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                      Season-ready
                    </span>
                  </li>
                </ol>
              </div>

              {/* meta footer */}
              <div className="mt-6 flex items-center justify-between border-t border-border/70 pt-4">
                <span className="inline-flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Layers aria-hidden className="h-3.5 w-3.5" />{" "}
                    <span className="tabular-nums">
                      <AnimatedCounter value={p.steps.length} />
                    </span>{" "}
                    stops
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Target aria-hidden className="h-3.5 w-3.5" />{" "}
                    <span className="tabular-nums">
                      <AnimatedCounter value={p.outcomes.length} />
                    </span>{" "}
                    outcomes
                  </span>
                </span>
                <Link
                  href={`/paths/${p.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-xl px-1 text-sm font-semibold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                >
                  <span
                    className="absolute inset-0"
                    aria-label={`View ${p.title} route`}
                  />
                  View route
                  <ArrowRight
                    aria-hidden
                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* closing note */}
        <div className="aq-glass aq-sheen aq-reveal mt-14 flex flex-col items-start gap-4 rounded-3xl p-7 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="aq-icon aq-badge-bob h-12 w-12 flex-none">
              <Compass aria-hidden className="h-6 w-6" />
            </span>
            <div>
              <p className="aq-display text-lg font-bold text-foreground">
                No route fits your goal?
              </p>
              <p className="mt-1 text-sm text-foreground/70">
                Every department stands on its own — dive straight into a guide
                and chart your own route through the season.
              </p>
            </div>
          </div>
          <Link href="/guides" className="aq-cta min-h-[44px] flex-none">
            Explore all guides
            <ArrowRight aria-hidden className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
