import { createClient } from "@supabase/supabase-js";

const s = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

const { data: lessons } = await s
  .from("lessons")
  .select("title, content, resources");
const { data: depts } = await s.from("departments").select("slug, sources");

const refs = new Map(); // url -> Set(where)
const add = (u, where) => {
  if (!u || !/^https?:\/\//i.test(u)) return;
  const clean = u.replace(/[.,)\]]+$/, "").trim();
  if (!refs.has(clean)) refs.set(clean, new Set());
  refs.get(clean).add(where);
};

for (const l of lessons ?? []) {
  for (const r of l.resources ?? []) add(r?.url, l.title);
  const md = l.content ?? "";
  const re = /\]\((https?:\/\/[^)\s]+)\)/g;
  let m;
  while ((m = re.exec(md))) add(m[1], l.title);
}
for (const d of depts ?? []) for (const r of d.sources ?? []) add(r?.url, `dept:${d.slug}`);

const urls = [...refs.keys()];
console.log("unique URLs:", urls.length);

async function check(u) {
  try {
    const c = new AbortController();
    const t = setTimeout(() => c.abort(), 12000);
    const opt = {
      redirect: "follow",
      signal: c.signal,
      headers: { "User-Agent": "Mozilla/5.0 (LinkCheck)" },
    };
    let r = await fetch(u, { method: "HEAD", ...opt });
    if (r.status === 405 || r.status === 403 || r.status >= 500) {
      r = await fetch(u, { method: "GET", ...opt });
    }
    clearTimeout(t);
    return r.status;
  } catch (e) {
    return "ERR:" + (e.name || e.message || "fail").slice(0, 24);
  }
}

const dead = [];
const CH = 25;
for (let i = 0; i < urls.length; i += CH) {
  const batch = urls.slice(i, i + CH);
  const res = await Promise.all(batch.map(check));
  batch.forEach((u, j) => {
    const st = res[j];
    if (typeof st === "string" || st >= 400) {
      dead.push({ u, st, refs: [...refs.get(u)].slice(0, 4) });
    }
  });
}

dead.sort((a, b) => String(a.st).localeCompare(String(b.st)));
console.log("\nPOTENTIALLY BROKEN:", dead.length);
for (const d of dead) console.log(`[${d.st}] ${d.u}\n      <- ${d.refs.join(" | ")}`);
