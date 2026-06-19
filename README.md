# LearnFRC

**The complete, structured guide to mastering the FIRST Robotics Competition.**

LearnFRC is a full-stack learning platform covering every department of an FRC team — mechanical, CAD, programming, electrical, controls, business, media, the Impact Award, scouting, drive team, and safety. Every guide is researched and fact-checked against authoritative FRC sources (WPILib docs, FIRST, REV/CTRE, Chief Delphi, The Blue Alliance).

🔗 **Live:** [learnfrc.systemerr.com](https://learnfrc.systemerr.com)

Built by **Jahaan Pardhanani** · Software Lead, Sage Hill Robotics (FRC Team 5835).

---

## Features

- **11 departments · 59 modules · 200+ lessons** — a complete curriculum per role, with cited sources.
- **Accounts & progress tracking** — sign up, complete lessons, earn XP, and pick up where you left off.
- **Achievements & leaderboard** — unlock badges and climb a global XP leaderboard.
- **Learning paths** — guided multi-department journeys (onboarding, programming, build & design, Impact Award, game day).
- **FRC glossary** — a searchable, filterable reference of FRC terms and acronyms.
- **Resources hub** — the essential FRC links plus the sources behind every guide.
- **Bookmarks** — save lessons for later.
- **Global ⌘K search** — jump to any department or lesson instantly.
- **Admin dashboard** — live metrics (signups, completions, XP, top departments, activity charts).
- **Dark / light mode**, heavy Framer Motion animation, fully responsive, SEO + OG images.

## Tech stack

- **Next.js 16** (App Router, React 19, TypeScript)
- **Tailwind CSS v4** (CSS-first theming, dark/light tokens)
- **Supabase** (Postgres, Auth, Row Level Security)
- **Framer Motion** for animation
- **Vercel** for hosting
- Email via **Resend**

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in your Supabase keys
npm run dev
```

### Environment variables

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon / publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | Service-role key (server-only; admin dashboard + seeding) |
| `NEXT_PUBLIC_SITE_URL` | Public site URL (e.g. `https://learnfrc.systemerr.com`) |
| `ADMIN_EMAILS` | Comma-separated emails granted admin access |
| `RESEND_API_KEY` | Resend API key for transactional email (optional) |
| `EMAIL_FROM` | From address for emails (optional) |

### Database

Schema lives in Supabase (`profiles`, `departments`, `modules`, `lessons`, `lesson_progress`, `bookmarks`, `achievements`, `user_achievements`) with Row Level Security on every table. Seed content from the research output:

```bash
node --env-file=.env.local scripts/seed.mjs
```

## Project structure

```
src/
  app/            # routes (App Router) — guides, auth, dashboard, admin, etc.
  components/     # UI kit, motion helpers, feature components
  lib/            # supabase clients, queries, auth, content metadata
content/          # web-grounded FRC content (seed source)
scripts/seed.mjs  # idempotent database seeder
```

---

> LearnFRC is an independent, student-built resource. It is **not affiliated with or endorsed by FIRST®**. All trademarks belong to their respective owners.
