import Link from "next/link";
import { Trophy, Sparkles, ArrowRight, Users, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Reveal } from "@/components/motion/reveal";
import { type PodiumEntry } from "@/components/leaderboard/podium";
import {
  LeaderboardTabs,
  type TeamRow,
} from "@/components/leaderboard/leaderboard-tabs";
import { InviteCard } from "@/components/leaderboard/invite-card";
import {
  getLeaderboard,
  getWeeklyLeaderboard,
  getTeamLeaderboard,
  getTopRecruiters,
  getReferralCount,
  type WeeklyEntry,
} from "@/lib/queries";
import { getSession } from "@/lib/auth";
import type { Profile } from "@/lib/types";

export const metadata = {
  title: "Leaderboard · LearnFRC",
  description:
    "See the top FRC learners climbing the ranks — earn XP, level up, and represent your team on the global LearnFRC leaderboard.",
};

function displayName(p: Profile): string {
  if (p.hide_name) return p.username?.trim() || "Learner";
  return p.full_name?.trim() || p.username?.trim() || "Learner";
}

function toEntry(p: Profile, rank: number, currentUserId: string | null): PodiumEntry {
  const xp = p.xp ?? 0;
  return {
    id: p.id,
    rank,
    name: displayName(p),
    username: p.username,
    avatarUrl: p.avatar_url,
    teamNumber: p.team_number,
    role: p.role || "Learner",
    xp,
    level: Math.floor(xp / 100) + 1,
    lessons: Math.floor(xp / 10),
    isYou: currentUserId != null && p.id === currentUserId,
  };
}

function toWeeklyEntry(
  p: WeeklyEntry,
  rank: number,
  currentUserId: string | null
): PodiumEntry {
  return {
    id: p.id,
    rank,
    name: displayName(p),
    username: p.username,
    avatarUrl: p.avatar_url,
    teamNumber: p.team_number,
    role: p.role || "Learner",
    xp: p.weeklyXp,
    level: Math.floor((p.xp ?? 0) / 100) + 1,
    lessons: p.weeklyLessons,
    isYou: currentUserId != null && p.id === currentUserId,
  };
}

export default async function LeaderboardPage() {
  const [profiles, weekly, teams, recruiters, { user, profile }] =
    await Promise.all([
      getLeaderboard(50),
      getWeeklyLeaderboard(50),
      getTeamLeaderboard(50),
      getTopRecruiters(10),
      getSession(),
    ]);

  const uid = user?.id ?? null;
  const referralCount = uid ? await getReferralCount(uid) : 0;
  const allTimeEntries = profiles.map((p, i) => toEntry(p, i + 1, uid));
  const weeklyEntries = weekly.map((p, i) => toWeeklyEntry(p, i + 1, uid));
  const teamRows: TeamRow[] = teams.map((t, i) => ({ rank: i + 1, ...t }));
  const totalXp = allTimeEntries.reduce((s, e) => s + e.xp, 0);

  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] aurora-bg opacity-25 mask-b-faded"
      />

      <div className="mx-auto max-w-5xl px-4 pt-28 pb-20 sm:px-6 lg:px-8">
        {/* Header */}
        <Reveal as="section" className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground glass">
            <Trophy className="h-3.5 w-3.5 text-primary" />
            Global rankings
          </span>
          <h1 className="mt-4 text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            The <span className="text-gradient">Leaderboard</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-pretty text-base text-muted-foreground sm:text-lg">
            Every lesson you complete earns XP. Climb the weekly race, chase the
            all-time greats, and put your team on the map.
          </p>

          {allTimeEntries.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/50 px-3 py-1">
                <Users className="h-3.5 w-3.5 text-primary" />
                <span className="font-semibold text-foreground">
                  {allTimeEntries.length.toLocaleString()}
                </span>{" "}
                ranked {allTimeEntries.length === 1 ? "learner" : "learners"}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/50 px-3 py-1">
                <Sparkles className="h-3.5 w-3.5 text-accent" />
                <span className="font-mono font-semibold text-foreground">
                  {totalXp.toLocaleString()}
                </span>{" "}
                XP earned
              </span>
            </div>
          )}
        </Reveal>

        {allTimeEntries.length === 0 ? (
          /* Empty state — no learners at all yet */
          <Reveal className="mt-16">
            <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-10 text-center shadow-[var(--shadow-sm)]">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand text-white shadow-[var(--shadow-md)]">
                <Trophy className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-semibold tracking-tight">
                No learners on the board yet
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Be the first — start learning, earn XP, and claim the top spot.
              </p>
              <Button asChild variant="brand" className="mt-6">
                <Link href="/guides">
                  Start learning
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Reveal>
        ) : (
          <>
            {user && profile?.username && (
              <Reveal>
                <InviteCard username={profile.username} count={referralCount} />
              </Reveal>
            )}

            <LeaderboardTabs
              weekly={weeklyEntries}
              allTime={allTimeEntries}
              teams={teamRows}
              userTeam={profile?.team_number ?? null}
            />

            {recruiters.length > 0 && (
              <Reveal className="mt-12">
                <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-sm)]">
                  <div className="flex items-center gap-2 border-b border-border px-5 py-3.5">
                    <UserPlus className="h-4 w-4 text-primary" />
                    <h2 className="text-sm font-semibold">Top Recruiters</h2>
                    <span className="ml-auto hidden text-xs text-muted-foreground sm:block">
                      Members who brought the most people to LearnFRC
                    </span>
                  </div>
                  <ul className="divide-y divide-border">
                    {recruiters.map((r, i) => (
                      <li key={r.id} className="flex items-center gap-3 px-5 py-3 sm:gap-4">
                        <span className="w-7 shrink-0 text-center font-mono text-sm font-semibold text-muted-foreground">
                          {i + 1}
                        </span>
                        <Avatar name={r.name} src={r.avatarUrl} seed={r.id} className="h-9 w-9 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="truncate font-medium">{r.name}</div>
                          {r.username && (
                            <div className="truncate text-xs text-muted-foreground">@{r.username}</div>
                          )}
                        </div>
                        <span className="shrink-0 text-right">
                          <span className="font-mono text-sm font-bold tabular-nums">{r.referrals}</span>
                          <span className="ml-1 text-[10px] font-medium uppercase text-muted-foreground">
                            referred
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            )}

            <Reveal className="mt-12 text-center">
              <p className="text-sm text-muted-foreground">
                Not on the board yet?{" "}
                <Link
                  href="/guides"
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  Start a lesson
                </Link>{" "}
                and start climbing.
              </p>
            </Reveal>
          </>
        )}
      </div>
    </div>
  );
}
