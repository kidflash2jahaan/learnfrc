/**
 * Seeds the LearnFRC database from content/frc-content.json (web-grounded
 * research), consolidating the original 14 research areas into 11 departments.
 * Idempotent: wipes content tables and reloads.
 *
 * Run: node --env-file=.env.local scripts/seed.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}
const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// Original research order (14): 0 getting-started, 1 mechanical, 2 cad, 3 programming,
// 4 electrical, 5 controls-sensors, 6 pneumatics, 7 business, 8 media, 9 impact,
// 10 scouting, 11 drive-team, 12 safety, 13 fundraising.
// Consolidated to 11 departments below (sources = indices to merge, in order).
const CANON = [
  { slug: "getting-started", name: "Getting Started with FRC", tagline: "New to FIRST Robotics? Start your journey here.", color: "#3b82f6", icon: "Rocket", sources: [0] },
  { slug: "mechanical-build", name: "Mechanical, Build & Pneumatics", tagline: "Drivetrains, mechanisms, fabrication, and pneumatics.", color: "#f97316", icon: "Cog", sources: [1, 6] },
  { slug: "cad-design", name: "CAD & Design", tagline: "Design robots in Onshape, SolidWorks & Fusion.", color: "#8b5cf6", icon: "PenTool", sources: [2] },
  { slug: "programming-software", name: "Programming, Controls & Sensors", tagline: "Code the robot with WPILib — plus sensors, vision & control.", color: "#10b981", icon: "Code2", sources: [3, 5] },
  { slug: "electrical-wiring", name: "Electrical & Wiring", tagline: "Power, the control system, and legal wiring.", color: "#f59e0b", icon: "Zap", sources: [4] },
  { slug: "business-operations", name: "Business, Operations & Fundraising", tagline: "Run your team — and fund it — like a real organization.", color: "#f43f5e", icon: "Briefcase", sources: [7, 13] },
  { slug: "media-outreach", name: "Media, Branding & Outreach", tagline: "Branding, media, and community impact.", color: "#ec4899", icon: "Camera", sources: [8] },
  { slug: "impact-award", name: "The Impact Award", tagline: "Pursue FRC's most prestigious award.", color: "#eab308", icon: "Trophy", sources: [9] },
  { slug: "scouting-strategy", name: "Scouting & Strategy", tagline: "Turn match data into winning strategy.", color: "#14b8a6", icon: "LineChart", sources: [10] },
  { slug: "drive-team", name: "Drive Team", tagline: "Driver, operator, and coach on the field.", color: "#ef4444", icon: "Gamepad2", sources: [11] },
  { slug: "safety", name: "Safety", tagline: "Build a safety-first robotics culture.", color: "#84cc16", icon: "ShieldCheck", sources: [12] },
];

const ACHIEVEMENTS = [
  { slug: "first-lesson", name: "First Steps", description: "Complete your very first lesson.", icon: "CheckCircle2", criteria: { type: "lessons", count: 1 }, sort_order: 1 },
  { slug: "five-lessons", name: "Warmed Up", description: "Complete 5 lessons.", icon: "Flame", criteria: { type: "lessons", count: 5 }, sort_order: 2 },
  { slug: "ten-lessons", name: "Committed", description: "Complete 10 lessons.", icon: "Flame", criteria: { type: "lessons", count: 10 }, sort_order: 3 },
  { slug: "twentyfive-lessons", name: "Quarter Master", description: "Complete 25 lessons.", icon: "Target", criteria: { type: "lessons", count: 25 }, sort_order: 4 },
  { slug: "fifty-lessons", name: "Half Centurion", description: "Complete 50 lessons.", icon: "Medal", criteria: { type: "lessons", count: 50 }, sort_order: 5 },
  { slug: "hundred-lessons", name: "Centurion", description: "Complete 100 lessons.", icon: "Star", criteria: { type: "lessons", count: 100 }, sort_order: 6 },
  { slug: "first-department", name: "Department Graduate", description: "Finish every lesson in a department.", icon: "GraduationCap", criteria: { type: "departments", count: 1 }, sort_order: 7 },
  { slug: "three-departments", name: "Multi-Disciplinary", description: "Finish 3 full departments.", icon: "Sparkles", criteria: { type: "departments", count: 3 }, sort_order: 8 },
  { slug: "all-departments", name: "FRC Master", description: "Finish every department on LearnFRC.", icon: "Trophy", criteria: { type: "departments", count: 11 }, sort_order: 9 },
];

function uniqueSlugs(items, getSlug) {
  const seen = new Set();
  return items.map((it, i) => {
    let s = (getSlug(it) || `item-${i}`).toString().toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
    if (!s) s = `item-${i}`;
    let candidate = s;
    let n = 2;
    while (seen.has(candidate)) candidate = `${s}-${n++}`;
    seen.add(candidate);
    return candidate;
  });
}

function dedupe(arr) {
  const out = [];
  const seen = new Set();
  for (const v of arr || []) {
    const k = typeof v === "string" ? v : JSON.stringify(v);
    if (!seen.has(k)) {
      seen.add(k);
      out.push(v);
    }
  }
  return out;
}

async function main() {
  const content = JSON.parse(
    readFileSync(join(root, "content", "frc-content.json"), "utf8")
  );
  const src = content.departments;
  if (!Array.isArray(src) || src.length !== 14) {
    throw new Error(`Expected 14 source areas, got ${src?.length}`);
  }

  console.log("Wiping existing content…");
  await supabase.from("departments").delete().neq("slug", "__none__");
  await supabase.from("achievements").delete().neq("slug", "__none__");

  const structure = []; // for the enrichment pass
  let totalModules = 0;
  let totalLessons = 0;

  for (let i = 0; i < CANON.length; i++) {
    const c = CANON[i];
    const primary = src[c.sources[0]];
    const merged = c.sources.map((idx) => src[idx]);

    const { data: dept, error: dErr } = await supabase
      .from("departments")
      .insert({
        slug: c.slug,
        name: c.name,
        tagline: c.tagline,
        description: primary.description ?? null,
        difficulty: primary.difficulty ?? "All Levels",
        estimated_hours: merged.reduce((s, m) => s + (m.estimatedHours || 0), 0) || null,
        what_youll_learn: dedupe(merged.flatMap((m) => m.whatYoullLearn || [])),
        prerequisites: dedupe(primary.prerequisites || []),
        tools: dedupe(merged.flatMap((m) => m.tools || [])),
        sources: dedupe(merged.flatMap((m) => m.sources || [])),
        accent: c.color,
        icon: c.icon,
        sort_order: i,
      })
      .select("id")
      .single();
    if (dErr) throw dErr;

    // merge modules from all source areas, in order
    const allModules = merged.flatMap((m) => m.modules || []);
    const modSlugs = uniqueSlugs(allModules, (m) => m.slug || m.title);
    const structModules = [];

    for (let mi = 0; mi < allModules.length; mi++) {
      const m = allModules[mi];
      const { data: mod, error: mErr } = await supabase
        .from("modules")
        .insert({
          department_id: dept.id,
          slug: modSlugs[mi],
          title: m.title,
          overview: m.overview ?? null,
          sort_order: mi,
        })
        .select("id")
        .single();
      if (mErr) throw mErr;
      totalModules++;

      const lessons = m.lessons ?? [];
      const lesSlugs = uniqueSlugs(lessons, (l) => l.slug || l.title);
      const rows = lessons.map((l, li) => ({
        module_id: mod.id,
        slug: lesSlugs[li],
        title: l.title,
        summary: l.summary ?? null,
        content: l.content ?? "",
        key_takeaways: l.keyTakeaways ?? [],
        resources: l.resources ?? [],
        estimated_minutes: l.estimatedMinutes ?? 10,
        sort_order: li,
      }));
      if (rows.length) {
        const { error: lErr } = await supabase.from("lessons").insert(rows);
        if (lErr) throw lErr;
        totalLessons += rows.length;
      }
      structModules.push({ title: m.title, lessons: lessons.map((l) => l.title) });
    }

    structure.push({ slug: c.slug, name: c.name, modules: structModules });
    console.log(`✓ ${c.slug} — ${allModules.length} modules`);
  }

  console.log("Seeding achievements…");
  const { error: aErr } = await supabase.from("achievements").insert(ACHIEVEMENTS);
  if (aErr) throw aErr;

  writeFileSync(
    join(root, "content", "structure.json"),
    JSON.stringify(structure, null, 2)
  );

  console.log(
    `\nDone. ${CANON.length} departments, ${totalModules} modules, ${totalLessons} lessons, ${ACHIEVEMENTS.length} achievements.`
  );
}

main().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});
