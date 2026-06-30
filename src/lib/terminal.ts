// Command engine for the site's interactive terminal. Pure + sync: it returns
// lines to print plus an optional action (navigate / clear / close / search).
// Every command shown in the site's decorative terminal windows is implemented
// here so they actually work.

export type TermTone = "out" | "err" | "ok" | "muted" | "accent" | "cmd";
export type TermLine = { text: string; tone?: TermTone };
export type TermResult = {
  lines: TermLine[];
  navigate?: string;
  clear?: boolean;
  close?: boolean;
  search?: string;
  newsletter?: boolean;
};
export type TermCtx = { path: string; authed: boolean };

const out = (text: string, tone: TermTone = "out"): TermLine => ({ text, tone });

const SECTIONS: Record<string, string> = {
  home: "/", "~": "/", "/": "/", root: "/",
  guides: "/guides", learn: "/guides", departments: "/guides", depts: "/guides",
  articles: "/blog", blog: "/blog", posts: "/blog",
  paths: "/paths", tracks: "/paths",
  glossary: "/glossary", terms: "/glossary",
  resources: "/resources", tools: "/resources",
  leaderboard: "/leaderboard", ranks: "/leaderboard", board: "/leaderboard",
  dashboard: "/dashboard", home2: "/dashboard",
  profile: "/profile",
  settings: "/settings", config: "/settings",
  bookmarks: "/bookmarks", saved: "/bookmarks",
  teams: "/teams", team: "/teams",
  "for-teams": "/for-teams", forteams: "/for-teams", mentors: "/for-teams",
  login: "/login", signin: "/login",
  signup: "/signup", join: "/signup", register: "/signup",
  admin: "/admin",
  privacy: "/privacy", terms2: "/terms",
};

const DEPT_ALIASES: Record<string, string> = {
  "getting-started": "getting-started", getting: "getting-started", rookie: "getting-started", intro: "getting-started",
  mechanical: "mechanical-build", "mechanical-build": "mechanical-build", build: "mechanical-build", mech: "mechanical-build",
  cad: "cad-design", "cad-design": "cad-design", design: "cad-design",
  programming: "programming-software", "programming-software": "programming-software", code: "programming-software", software: "programming-software", program: "programming-software",
  electrical: "electrical-wiring", "electrical-wiring": "electrical-wiring", wiring: "electrical-wiring", electronics: "electrical-wiring",
  business: "business-operations", "business-operations": "business-operations", operations: "business-operations", funding: "business-operations",
  media: "media-outreach", "media-outreach": "media-outreach", outreach: "media-outreach", branding: "media-outreach",
  impact: "impact-award", "impact-award": "impact-award", award: "impact-award",
  scouting: "scouting-strategy", "scouting-strategy": "scouting-strategy", strategy: "scouting-strategy", scout: "scouting-strategy",
  drive: "drive-team", "drive-team": "drive-team", driveteam: "drive-team",
  safety: "safety", safe: "safety",
};

export const DEPT_LIST = [
  "getting-started", "mechanical-build", "cad-design", "programming-software",
  "electrical-wiring", "business-operations", "media-outreach", "impact-award",
  "scouting-strategy", "drive-team", "safety",
];
const SECTION_LIST = [
  "guides", "articles", "paths", "glossary", "resources",
  "leaderboard", "for-teams", "dashboard", "login", "signup",
];

/** Resolve a word (section name, department alias, or path) to a route. */
function resolve(word: string): string | "__back__" | null {
  if (!word) return null;
  const w = word.toLowerCase().replace(/^\.?\/+/, "").replace(/\/+$/, "");
  if (w === ".." || w === "back" || w === "-") return "__back__";
  if (w === "" || w === "~" || w === "/") return "/";
  if (SECTIONS[w] != null) return SECTIONS[w];
  if (DEPT_ALIASES[w] != null) return "/guides/" + DEPT_ALIASES[w];
  // guides/<slug>
  const m = w.match(/^guides\/([a-z0-9-]+)/);
  if (m && DEPT_ALIASES[m[1]]) return "/guides/" + DEPT_ALIASES[m[1]];
  return null;
}

const HELP: TermLine[] = [
  out("LearnFRC terminal — available commands:", "accent"),
  out(""),
  out("  help                 show this list", "muted"),
  out("  ls [departments]     list sections / departments", "muted"),
  out("  cd <name>            go to a section or department  (also: open, goto)", "muted"),
  out("  scan ./departments   open the department map (/guides)", "muted"),
  out("  begin --dept <name>  jump into a department", "muted"),
  out("  start                start learning (sign up)", "muted"),
  out("  rank                 open the leaderboard  (also: climb)", "muted"),
  out("  onboard              open the rookie getting-started track", "muted"),
  out("  search <query>       open search  (also: grep)", "muted"),
  out("  auth login           go to the login screen", "muted"),
  out("  subscribe            jump to the newsletter signup", "muted"),
  out("  analyze --sources    admin: traffic sources (admins only)", "muted"),
  out("  whoami / pwd         who you are / where you are", "muted"),
  out("  clear                clear the screen   ·   exit  close the terminal", "muted"),
  out(""),
  out("tip: every command you see in a terminal box on the site works here.", "muted"),
];

function navMsg(path: string): TermResult {
  return { lines: [out("→ navigating to " + path, "ok")], navigate: path };
}

export function runTerminal(raw: string, ctx: TermCtx): TermResult {
  const input = raw.trim();
  if (!input) return { lines: [] };
  const parts = input.split(/\s+/);
  let cmd = parts[0].toLowerCase();
  const args = parts.slice(1);
  const rest = input.slice(parts[0].length).trim();
  const flagless = args.filter((a) => !a.startsWith("-") && !a.startsWith("./"));

  // normalize "./start.sh" / "./climb.sh" style
  const script = cmd.replace(/^\.\//, "").replace(/\.sh$/, "");
  if (script !== cmd) cmd = script;

  switch (cmd) {
    case "help": case "?": case "man": case "commands":
      return { lines: HELP };

    case "ls": case "dir": {
      const t = (flagless[0] || "").toLowerCase();
      if (t.startsWith("dep")) return { lines: [out("departments/", "accent"), ...DEPT_LIST.map((d) => out("  " + d, "muted"))] };
      if (t.startsWith("sec")) return { lines: [out("sections/", "accent"), ...SECTION_LIST.map((s) => out("  " + s, "muted"))] };
      return {
        lines: [
          out("sections/   " + SECTION_LIST.join("  "), "muted"),
          out("departments/   run `ls departments`", "muted"),
        ],
      };
    }

    case "cd": case "open": case "goto": case "cat": {
      const target = flagless[0] ?? rest;
      const r = resolve(target);
      if (r === "__back__") return { lines: [out("→ back", "ok")], navigate: "__back__" };
      if (r) return navMsg(r);
      if (!target) return navMsg("/");
      return { lines: [out(`cd: no such section or department: ${target}`, "err"), out("try `ls` or `ls departments`", "muted")] };
    }

    case "scan": case "map":
      return navMsg("/guides");

    case "begin": case "continue": case "resume": {
      const di = args.indexOf("--dept");
      const dept = di >= 0 ? args[di + 1] : flagless[0];
      if (dept && DEPT_ALIASES[dept.toLowerCase()]) return navMsg("/guides/" + DEPT_ALIASES[dept.toLowerCase()]);
      return navMsg(ctx.authed ? "/dashboard" : "/guides");
    }

    case "start": case "get-started": case "getstarted":
      return navMsg("/signup");

    case "onboard":
      return navMsg("/guides/getting-started");

    case "rank": case "leaderboard": case "climb": case "ranks":
      return navMsg("/leaderboard");

    case "analyze":
      if (!ctx.authed) return { lines: [out("analyze: not authorized — admins only. run `auth login` first.", "err")] };
      return navMsg("/admin");

    case "auth": {
      const sub = (flagless[0] || "login").toLowerCase();
      if (sub === "signup" || sub === "register") return navMsg("/signup");
      if (sub === "logout" || sub === "signout") return { lines: [out("run logout from the profile menue (top-right).", "muted")] };
      return navMsg("/login");
    }

    case "search": case "grep": case "find": {
      const q = rest.replace(/^["']|["']$/g, "");
      return { lines: [out("opening search…", "ok")], search: q || "" };
    }

    case "subscribe":
      return { lines: [out("→ newsletter signup", "ok")], newsletter: true };

    case "quiz.run": case "quiz":
      return { lines: [out("quizzes live at the bottom of each lesson — open a lesson first (`cd guides`).", "muted")] };

    case "whoami":
      return { lines: [out(ctx.authed ? "logged-in learner" : "guest (run `auth login` to sign in)", ctx.authed ? "ok" : "muted")] };

    case "pwd":
      return { lines: [out("~" + (ctx.path === "/" ? "" : ctx.path), "muted")] };

    case "clear": case "cls":
      return { lines: [], clear: true };

    case "exit": case "close": case "quit": case "q":
      return { lines: [], close: true };

    case "about": case "frc": case "motd":
      return {
        lines: [
          out("LearnFRC", "accent"),
          out("Free, structured guides for every department of the FIRST Robotics Competition.", "muted"),
          out("Built by Jahaan Pardhanani. Type `help` to get around.", "muted"),
        ],
      };

    case "echo":
      return { lines: [out(rest)] };

    case "sudo":
      return { lines: [out("nice try — you already have root. everything's free.", "muted")] };

    case "rm":
      return { lines: [out("rm: permission denied (this knowledge is staying right here).", "err")] };

    case "ping":
      return { lines: [out("pong — system: online ●", "ok")] };

    default:
      return { lines: [out(`command not found: ${cmd}`, "err"), out("type `help` for the list", "muted")] };
  }
}

/** Suggestions for tab-completion. */
export const TERM_VERBS = [
  "help", "ls", "cd", "open", "scan", "begin", "start", "rank", "climb",
  "onboard", "search", "auth", "subscribe", "analyze", "whoami", "clear", "exit",
];
