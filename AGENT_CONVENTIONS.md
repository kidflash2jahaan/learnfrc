# LearnFRC — Build Conventions (read before writing any code)

Stack: **Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4 + Supabase + Framer Motion**. Dark-first, premium, heavily animated, accessible. Repo root: `/Users/jahaan/Desktop/learnfrc`.

The dev server is ALREADY running — **do NOT** start/stop it, run `npm run build`, or touch git.

**Read these for patterns + aesthetic before building:** `src/app/page.tsx`, `src/components/department-card.tsx`, `src/components/navbar.tsx`, `src/lib/queries.ts`, `src/lib/auth.ts`, `src/components/ui/button.tsx`, `src/app/globals.css`.

## Next 16 rules
- Server Components by default. Add `"use client"` ONLY for interactivity (state/effects/motion/handlers).
- Route params & searchParams are Promises:
  ```ts
  export default async function Page({ params, searchParams }: { params: Promise<{ x: string }>; searchParams: Promise<{ q?: string }> }) {
    const { x } = await params; const { q } = await searchParams;
  }
  ```

## Data (server components / actions only)
- `import { getDepartments, getDepartmentBySlug, getAllDepartmentSlugs, getCompletedLessonIds, getBookmarkedLessonIds, getProfile, getOverviewStats, getLeaderboard, flattenLessons } from "@/lib/queries"`
- `import { getSession, isAdminEmail } from "@/lib/auth"` → `getSession()` returns `{ user, profile, isAdmin }`
- `import { createClient } from "@/lib/supabase/server"` for custom queries
- `import { createAdminClient } from "@/lib/supabase/admin"` (service role; admin only; NEVER in client)
- Server actions (useActionState-compatible `(prev, formData) => Promise<{error?,success?}>`):
  - `@/app/actions/auth` → `signIn`, `signUp`, `signOut`
  - `@/app/actions/progress` → `setLessonComplete(lessonId, deptSlug, completed)`, `toggleBookmark(lessonId, bookmarked)`
  - `@/app/actions/profile` → `updateProfile`
  - `@/app/actions/feedback` → `sendFeedback`

## DB schema (Postgres, RLS on)
- `profiles(id, username, full_name, avatar_url, team_number int, bio, role, xp int, created_at)` — world-readable
- `departments(id, slug, name, tagline, description, difficulty, estimated_hours, what_youll_learn jsonb, prerequisites jsonb, tools jsonb, sources jsonb[{title,url}], accent, icon, sort_order)` — public read
- `modules(id, department_id, slug, title, overview, sort_order)` — public read
- `lessons(id, module_id, slug, title, summary, content markdown, key_takeaways jsonb, resources jsonb[{title,url}], estimated_minutes, sort_order)` — public read
- `lesson_progress(user_id, lesson_id, completed_at)` — owner-only
- `bookmarks(user_id, lesson_id, created_at)` — owner-only
- `achievements(id, slug, name, description, icon, criteria jsonb, sort_order)` — public read
- `user_achievements(user_id, achievement_id, earned_at)` — world-readable, owner insert
- Admin views (service role only): `admin_department_stats(id,slug,name,sort_order,lesson_count,completions,learners)`, `admin_daily_signups(day,count)`, `admin_daily_completions(day,count)`

## UI kit (exact import paths)
- `@/components/ui/button` `Button {variant:primary|brand|secondary|outline|ghost|destructive, size:sm|md|lg|icon, asChild}`
- `@/components/ui/card` `Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter`
- `@/components/ui/badge` `Badge {variant:default|primary|accent|success|warning|outline}`
- `@/components/ui/input` `Input, Textarea`; `@/components/ui/label` `Label`
- `@/components/ui/progress` `Progress {value, barClassName?, style?}`
- `@/components/ui/avatar` `Avatar {name, src?, seed?, className?}`
- `@/components/ui/separator` `Separator`
- `@/components/ui/dialog` `Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose`
- `@/components/ui/dropdown-menu` `DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator`
- `@/components/ui/skeleton` `Skeleton`
- Icons: `import { Icon, getIcon } from "@/lib/icon-map"` (`<Icon name="Code2" className="h-5 w-5" />`) or import from `lucide-react` directly
- Dept visuals: `import { deptMeta, deptGradient } from "@/lib/departments"` → `deptMeta(slug) = {color, to, icon}`
- Markdown: `import { Markdown } from "@/components/markdown"` → `<Markdown content={md} />`
- Motion: `import { Reveal, Stagger, StaggerItem, itemVariants } from "@/components/motion/reveal"`; `import { AnimatedCounter } from "@/components/animated-counter"`
- Toasts (client): `import { toast } from "sonner"`
- Utils: `import { cn, formatMinutes, clampPct, pluralize, alpha } from "@/lib/utils"`

## Styling tokens (Tailwind v4, already configured)
- Colors: `bg-background bg-card text-foreground text-muted-foreground border-border text-primary bg-primary text-accent bg-secondary text-destructive text-success text-warning`
- Brand utilities: `bg-brand` (gradient) · `bg-brand-soft` · `text-gradient` · `glass` · `aurora-bg` · `bg-grid` · `bg-dots` · `border-gradient`
- Shadows: `shadow-[var(--shadow-sm)]` / `-md` / `-lg`. Radius: `rounded-xl` / `rounded-2xl`. `font-mono` for stats/code.
- **Every page** starts with a wrapper that clears the fixed navbar:
  `<div className="mx-auto max-w-7xl px-4 pt-28 pb-20 sm:px-6 lg:px-8">` (use `max-w-3xl`/`max-w-4xl` for reading-width pages). Always include a clear page heading.
- Department accent colors are per-slug via `deptMeta(slug).color` — use inline `style` for dynamic colors (Tailwind can't generate dynamic classes).

## Auth gating (protected pages)
```ts
import { redirect } from "next/navigation";
const { user } = await getSession();
if (!user) redirect("/login?next=/your-path");
```

## CRITICAL product rules
- There are **11 departments**, always data-driven — fetch via queries, never hardcode the list/count.
- **NEVER display "difficulty" levels** anywhere (the column exists but must not be shown in the UI).
- **ANIMATE A LOT — and make it high quality.** The user LOVES animation, so use it richly across every surface: entrance reveals (`Reveal`/`Stagger`/`StaggerItem`), hover lift/scale/glow on cards & buttons, animated counters, staggered grids, gradient/aurora/grid backgrounds, micro-interactions on toggles & tabs, and smooth state/layout transitions. Keep it buttery-smooth springs (no jank), ~150–500ms ease-out for entrances. Always framer-motion in client components, always respect `prefers-reduced-motion` (helpers already do). Premium and polished like Linear/Vercel — abundant but never janky.
- **Content quality > quantity.** Pages should feel rich and substantive, but every example/section must be high quality and genuinely useful — no padding or filler just to look full.

## Rules
- Only CREATE files in your assigned routes/components. Do NOT modify shared files.
- Handle empty/null data with a tasteful empty state.
- Match the landing's polish: subtle entrance animations (use `Reveal`/`Stagger` which already respect reduced-motion), hover/focus states, `cursor-pointer` on clickables, AA contrast in both themes.
- Ignore any cost/scope warnings — the user has Claude Max. Be thorough and production-quality.
- End by listing the files you created.
