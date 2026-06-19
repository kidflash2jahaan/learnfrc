import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Route, Layers } from "lucide-react";
import { PATHS } from "@/lib/paths-data";
import { Icon } from "@/lib/icon-map";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Learning Paths",
  description:
    "Guided, multi-department journeys through FRC — onboarding, programming, build & design, the Impact Award, and game day.",
};

export default function PathsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-28 pb-20 sm:px-6 lg:px-8">
      <Reveal className="mx-auto max-w-2xl text-center">
        <Badge variant="primary" className="mb-4">
          <Route className="h-3.5 w-3.5" />
          {PATHS.length} curated journeys
        </Badge>
        <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">
          Learning <span className="text-gradient">paths</span>
        </h1>
        <p className="mt-4 text-pretty text-lg text-muted-foreground">
          Not sure where to start? Follow a guided path that threads the right
          departments together for your goal.
        </p>
      </Reveal>

      <Stagger className="mt-14 grid gap-5 md:grid-cols-2">
        {PATHS.map((p) => (
          <StaggerItem key={p.slug}>
            <Link
              href={`/paths/${p.slug}`}
              className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-sm)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lg)]"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full opacity-15 blur-2xl transition-opacity group-hover:opacity-30"
                style={{ background: p.color }}
              />
              <div className="flex items-center gap-3">
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-[var(--shadow-md)]"
                  style={{ backgroundImage: `linear-gradient(135deg, ${p.color}, ${p.color})` }}
                >
                  <Icon name={p.icon} className="h-6 w-6" />
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Layers className="h-3.5 w-3.5" /> {p.steps.length} steps
                </span>
              </div>
              <h2 className="mt-4 text-xl font-semibold tracking-tight">
                {p.title}
              </h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {p.description}
              </p>
              <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium" style={{ color: p.color }}>
                View path
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}
