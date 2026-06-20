import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

const FILE = process.argv[2];
if (!FILE) {
  console.error("usage: node seed-prereqs.mjs <workflow-output.json>");
  process.exit(1);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

const parsed = JSON.parse(readFileSync(FILE, "utf8"));
const resultObj =
  typeof parsed.result === "string" ? JSON.parse(parsed.result) : parsed.result;
const mods = Array.isArray(parsed) ? parsed : parsed.modules || resultObj?.modules || [];

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

const report = { departments: 0, modulesUpserted: 0, lessons: 0, errors: [] };

for (const entry of mods) {
  if (!entry?.dept || !entry?.module?.lessons?.length) {
    report.errors.push(`bad entry: ${entry?.dept || "?"}`);
    continue;
  }
  const { dept, module } = entry;

  const { data: d } = await supabase
    .from("departments")
    .select("id")
    .eq("slug", dept)
    .maybeSingle();
  if (!d) {
    report.errors.push(`dept not found: ${dept}`);
    continue;
  }
  report.departments++;

  // Upsert the prerequisites module (idempotent on department_id + slug).
  const moduleSlug = "prerequisites";
  const { data: existing } = await supabase
    .from("modules")
    .select("id")
    .eq("department_id", d.id)
    .eq("slug", moduleSlug)
    .maybeSingle();

  let moduleId = existing?.id;
  if (moduleId) {
    await supabase
      .from("modules")
      .update({
        title: module.title,
        overview: module.description,
        sort_order: -1,
        is_prerequisite: true,
      })
      .eq("id", moduleId);
    await supabase.from("lessons").delete().eq("module_id", moduleId);
  } else {
    const { data: ins, error } = await supabase
      .from("modules")
      .insert({
        department_id: d.id,
        slug: moduleSlug,
        title: module.title,
        overview: module.description,
        sort_order: -1,
        is_prerequisite: true,
      })
      .select("id")
      .single();
    if (error) {
      report.errors.push(`module insert ${dept}: ${error.message}`);
      continue;
    }
    moduleId = ins.id;
  }
  report.modulesUpserted++;

  // Insert lessons, ensuring unique slugs within the module.
  const seen = new Set();
  const rows = module.lessons.map((l, i) => {
    let slug = slugify(l.slug || l.title);
    while (seen.has(slug)) slug = `${slug}-${i}`;
    seen.add(slug);
    return {
      module_id: moduleId,
      slug,
      title: l.title,
      summary: l.summary ?? null,
      content: l.content,
      key_takeaways: l.key_takeaways ?? [],
      resources: l.resources ?? [],
      quiz: l.quiz ?? [],
      estimated_minutes: 0,
      sort_order: i,
    };
  });
  const { error: lerr } = await supabase.from("lessons").insert(rows);
  if (lerr) report.errors.push(`lessons ${dept}: ${lerr.message}`);
  else report.lessons += rows.length;
}

console.log(JSON.stringify(report, null, 2));
