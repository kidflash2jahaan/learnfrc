import type { Metadata } from "next";
import { ExternalLink, MessageSquarePlus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { deptMeta } from "@/lib/departments";
import { Icon } from "@/lib/icon-map";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { FeedbackForm } from "@/components/feedback-form";
import type { Resource } from "@/lib/types";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "The essential FRC links — official docs, software, vendors, community, and learning resources, plus the sources behind every LearnFRC guide.",
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

export default async function ResourcesPage() {
  const supabase = await createClient();
  const { data: departments } = await supabase
    .from("departments")
    .select("name, slug, sources")
    .order("sort_order");

  return (
    <div className="mx-auto max-w-5xl px-4 pt-28 pb-20 sm:px-6 lg:px-8">
      <Reveal className="max-w-2xl">
        <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">
          FRC <span className="text-gradient">resources</span>
        </h1>
        <p className="mt-4 text-pretty text-lg text-muted-foreground">
          The links every team should bookmark — official docs, software,
          vendors, and community — plus the sources behind our guides.
        </p>
      </Reveal>

      <div className="mt-12 space-y-10">
        {CURATED.map((group) => (
          <Reveal key={group.category}>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {group.category}
            </h2>
            <Stagger className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {group.links.map((l) => (
                <StaggerItem key={l.url}>
                  <a
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]"
                  >
                    <span className="font-medium">{l.title}</span>
                    <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                  </a>
                </StaggerItem>
              ))}
            </Stagger>
          </Reveal>
        ))}
      </div>

      {/* Sources by department */}
      <Reveal className="mt-16">
        <h2 className="mb-2 text-2xl font-bold tracking-tight">
          Sources behind the guides
        </h2>
        <p className="mb-6 text-muted-foreground">
          Every LearnFRC guide is grounded in authoritative sources. Here they
          are, by department.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {(departments ?? []).map((d) => {
            const m = deptMeta(d.slug as string);
            const sources = (d.sources as Resource[]) ?? [];
            if (sources.length === 0) return null;
            return (
              <div
                key={d.slug as string}
                className="rounded-2xl border border-border bg-card p-5"
              >
                <div className="mb-3 flex items-center gap-2">
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-white"
                    style={{ backgroundImage: `linear-gradient(135deg, ${m.color}, ${m.to})` }}
                  >
                    <Icon name={m.icon} className="h-4 w-4" />
                  </span>
                  <h3 className="text-sm font-semibold">{d.name as string}</h3>
                </div>
                <ul className="space-y-1.5">
                  {sources.slice(0, 6).map((s, i) => (
                    <li key={i}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-start gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        <span>{s.title}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </Reveal>

      {/* Suggest */}
      <Reveal className="mt-16">
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <div className="mb-4 flex items-center gap-2">
            <MessageSquarePlus className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold">Suggest a topic or resource</h2>
          </div>
          <p className="mb-5 max-w-xl text-sm text-muted-foreground">
            Missing something you'd find useful? Tell us what to add — your
            suggestion goes straight to the team.
          </p>
          <div className="max-w-xl">
            <FeedbackForm page="/resources" />
          </div>
        </div>
      </Reveal>
    </div>
  );
}
