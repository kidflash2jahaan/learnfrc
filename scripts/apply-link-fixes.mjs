import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

const FILE = process.argv[2];
if (!FILE) {
  console.error("usage: node apply-link-fixes.mjs <workflow-output.json>");
  process.exit(1);
}

const s = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

const parsed = JSON.parse(readFileSync(FILE, "utf8"));
const resultObj =
  typeof parsed.result === "string" ? JSON.parse(parsed.result) : parsed.result;
const fixes = Array.isArray(parsed) ? parsed : parsed.fixes || resultObj?.fixes || [];

const validResources = (r) =>
  Array.isArray(r) &&
  r.every((x) => x && typeof x.title === "string" && typeof x.url === "string");

const report = { total: fixes.length, content: 0, resources: 0, skipped: 0, errors: [] };

for (const f of fixes) {
  if (!f?.id) {
    report.skipped++;
    continue;
  }
  const update = {};
  if (f.contentFixed && typeof f.newContent === "string" && f.newContent.length > 50)
    update.content = f.newContent;
  if (f.resourcesFixed && validResources(f.newResources)) update.resources = f.newResources;
  if (!Object.keys(update).length) {
    report.skipped++;
    continue;
  }
  const { error } = await s.from("lessons").update(update).eq("id", f.id);
  if (error) {
    report.errors.push(`${f.id}: ${error.message}`);
    continue;
  }
  if (update.content) report.content++;
  if (update.resources) report.resources++;
}

console.log(JSON.stringify(report, null, 2));
