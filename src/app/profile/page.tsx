import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Pencil,
  ExternalLink,
  CalendarDays,
  Users2,
  Trophy,
  BookOpenCheck,
  Zap,
  Lock,
} from "lucide-react";
import { getSession } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getCompletedLessonIds } from "@/lib/queries";
import type { Achievement } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { AnimatedCounter } from "@/components/animated-counter";
import { Icon } from "@/lib/icon-map";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Your profile · LearnFRC",
  description: "Your XP, level, completed lessons, and achievements on LearnFRC.",
};

const ROLE_LABEL: Record<string, string> = {
  student: "Student",
  mentor: "Mentor",
  alum: "Alum",
  coach: "Coach",
  other: "Member",
};

function formatJoined(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export default async function ProfilePage() {
  const { user, profile } = await getSession();
  if (!user) redirect("/login?next=/profile");

  const supabase = await createClient();

  // Own data: real completed-lesson count + earned achievements joined to catalog.
  const [completedIds, earnedRes, catalogRes] = await Promise.all([
    getCompletedLessonIds(user.id),
    supabase
      .from("user_achievements")
      .select("achievement_id, earned_at")
      .eq("user_id", user.id),
    supabase
      .from("achievements")
      .select("*")
      .order("sort_order"),
  ]);

  const lessonsCompleted = completedIds.size;
  const xp = profile?.xp ?? 0;
  const level = Math.floor(xp / 100) + 1;
  const intoLevel = xp % 100; // 0..99 XP toward next level
  const toNext = 100 - intoLevel;

  const catalog = (catalogRes.data as Achievement[] | null) ?? [];
  const earnedAtById = new Map<string, string>(
    (earnedRes.data ?? []).map((r) => [
      r.achievement_id as string,
      r.earned_at as string,
    ])
  );
  const achievements = catalog.map((a) => ({
    ...a,
    earned: earnedAtById.has(a.id),
    earnedAt: earnedAtById.get(a.id) ?? null,
  }));
  const earnedCount = achievements.filter((a) => a.earned).length;

  const displayName =
    profile?.full_name || profile?.username || user.email?.split("@")[0] || "You";
  const roleLabel = ROLE_LABEL[profile?.role ?? "student"] ?? "Member";

  const stats = [
    {
      icon: Zap,
      label: "Total XP",
      value: xp,
      accent: "text-primary",
    },
    {
      icon: Trophy,
      label: "Level",
      value: level,
      accent: "text-accent",
    },
    {
      icon: BookOpenCheck,
      label: "Lessons done",
      value: lessonsCompleted,
      accent: "text-success",
    },
    {
      icon: Trophy,
      label: "Badges earned",
      value: earnedCount,
      accent: "text-warning",
    },
  ];

  return (
    <main className="relative overflow-hidden">
      {/* Ambient background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid opacity-40 mask-b-faded" />
        <div className="absolute left-1/2 top-[-10%] h-[460px] w-[680px] -translate-x-1/2 rounded-full opacity-20 blur-3xl aurora-bg animate-aurora" />
      </div>

      <div className="mx-auto max-w-4xl px-4 pt-28 pb-24 sm:px-6 lg:px-8">
        {/* ===================== HERO ===================== */}
        <Reveal>
          <Card className="relative overflow-hidden border-border/80 shadow-[var(--shadow-lg)]">
            {/* Banner */}
            <div aria-hidden className="absolute inset-x-0 top-0 h-28 bg-brand opacity-90">
              <div className="absolute inset-0 bg-grid opacity-20" />
            </div>
            <CardContent className="relative pt-16">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                  <Avatar
                    name={displayName}
                    src={profile?.avatar_url}
                    seed={profile?.username || user.email || undefined}
                    className="h-24 w-24 ring-4 ring-card shadow-[var(--shadow-lg)] sm:h-28 sm:w-28"
                  />
                  <div className="pb-1">
                    <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                      {displayName}
                    </h1>
                    {profile?.username && (
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        @{profile.username}
                      </p>
                    )}
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <Badge variant="primary">{roleLabel}</Badge>
                      {profile?.team_number != null && (
                        <Badge variant="accent">
                          <Users2 className="h-3.5 w-3.5" />
                          Team {profile.team_number}
                        </Badge>
                      )}
                      <Badge variant="outline">
                        <CalendarDays className="h-3.5 w-3.5" />
                        Joined {formatJoined(profile?.created_at ?? null)}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  <Button asChild variant="brand" size="md">
                    <Link href="/settings">
                      <Pencil className="h-4 w-4" />
                      Edit profile
                    </Link>
                  </Button>
                  {profile?.username && (
                    <Button asChild variant="outline" size="md">
                      <Link href={`/u/${profile.username}`}>
                        View public profile
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>

              {profile?.bio && (
                <p className="mt-6 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
                  {profile.bio}
                </p>
              )}
            </CardContent>
          </Card>
        </Reveal>

        {/* ===================== STAT TILES ===================== */}
        <Stagger className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4" stagger={0.07}>
          {stats.map((s) => (
            <StaggerItem key={s.label}>
              <Card className="group h-full p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]">
                <s.icon className={cn("h-5 w-5", s.accent)} />
                <div className="mt-3 font-mono text-2xl font-bold tracking-tight">
                  <AnimatedCounter value={s.value} />
                </div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {s.label}
                </div>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>

        {/* ===================== XP / LEVEL ===================== */}
        <Reveal delay={0.04} className="mt-6">
          <Card className="overflow-hidden p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-primary">
                  <Zap className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-sm text-muted-foreground">
                    Level{" "}
                    <span className="font-semibold text-foreground">{level}</span>
                  </div>
                  <div className="font-mono text-xl font-bold">
                    <AnimatedCounter value={xp} suffix=" XP" />
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">
                  {toNext} XP to level {level + 1}
                </div>
                <div className="text-xs text-muted-foreground">
                  {intoLevel} / 100 this level
                </div>
              </div>
            </div>
            <Progress
              value={intoLevel}
              className="mt-4 h-2.5"
              aria-label={`${intoLevel} of 100 XP toward level ${level + 1}`}
            />
          </Card>
        </Reveal>

        {/* ===================== ACHIEVEMENTS ===================== */}
        <Reveal delay={0.06} className="mt-10">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xl font-bold tracking-tight">Achievements</h2>
            <span className="text-sm text-muted-foreground">
              {earnedCount} of {achievements.length} earned
            </span>
          </div>
        </Reveal>

        {achievements.length === 0 ? (
          <Reveal delay={0.08} className="mt-4">
            <Card className="p-10 text-center">
              <Trophy className="mx-auto h-8 w-8 text-muted-foreground/60" />
              <p className="mt-3 text-sm text-muted-foreground">
                No achievements available yet. Check back soon.
              </p>
            </Card>
          </Reveal>
        ) : (
          <Stagger
            className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3"
            stagger={0.05}
          >
            {achievements.map((a) => (
              <StaggerItem key={a.id}>
                <Card
                  className={cn(
                    "group relative h-full overflow-hidden p-5 transition-all duration-300",
                    a.earned
                      ? "border-primary/30 hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]"
                      : "opacity-60"
                  )}
                >
                  {a.earned && (
                    <div
                      aria-hidden
                      className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-primary/10 blur-2xl transition-opacity duration-300 group-hover:opacity-80"
                    />
                  )}
                  <div className="flex items-start gap-3">
                    <span
                      className={cn(
                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                        a.earned
                          ? "bg-brand text-white shadow-[var(--shadow-sm)]"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {a.earned ? (
                        <Icon name={a.icon} className="h-5 w-5" />
                      ) : (
                        <Lock className="h-4.5 w-4.5" />
                      )}
                    </span>
                    <div className="min-w-0">
                      <div className="truncate font-semibold leading-tight">
                        {a.name}
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {a.description}
                      </p>
                    </div>
                  </div>
                  {a.earned && (
                    <div className="mt-3">
                      <Badge variant="success">Earned</Badge>
                    </div>
                  )}
                </Card>
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </div>
    </main>
  );
}
