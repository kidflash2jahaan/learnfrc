import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

const FILE = process.argv[2];
if (!FILE) {
  console.error("usage: node apply-content-fixes.mjs <verify-output.json>");
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
const fixes = Array.isArray(parsed) ? parsed : parsed.fixes || resultObj?.fixes || [];

function validQuiz(q) {
  return (
    Array.isArray(q) &&
    q.length >= 1 &&
    q.every(
      (i) =>
        i &&
        typeof i.question === "string" &&
        Array.isArray(i.options) &&
        i.options.length === 4 &&
        Number.isInteger(i.answer) &&
        i.answer >= 0 &&
        i.answer <= 3 &&
        typeof i.explanation === "string"
    )
  );
}

const report = {
  totalFixes: fixes.length,
  contentApplied: 0,
  quizApplied: 0,
  skipped: 0,
  errors: [],
  log: [],
};

for (const f of fixes) {
  if (!f?.id) {
    report.skipped++;
    continue;
  }
  const update = {};
  if (f.contentFixed && typeof f.newContent === "string" && f.newContent.length > 50) {
    update.content = f.newContent;
  }
  if (f.quizFixed && validQuiz(f.newQuiz)) {
    update.quiz = f.newQuiz;
  }
  if (Object.keys(update).length === 0) {
    report.skipped++;
    continue;
  }
  const { error } = await supabase.from("lessons").update(update).eq("id", f.id);
  if (error) {
    report.errors.push(`${f.id}: ${error.message}`);
    continue;
  }
  if (update.content) report.contentApplied++;
  if (update.quiz) report.quizApplied++;
  report.log.push(
    `${update.content ? "C" : ""}${update.quiz ? "Q" : ""} · ${f.title} — ${f.notes || ""}`
  );
}

console.log(
  JSON.stringify(
    { ...report, log: undefined, summary: report.log },
    null,
    2
  )
);
