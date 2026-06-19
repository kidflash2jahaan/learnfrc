/**
 * Per-department UI metadata: accent color + icon + gradient stop.
 * Content (name, tagline, lessons …) lives in the database; this is purely visual.
 */
export type DeptMeta = {
  color: string; // primary accent
  to: string; // gradient end stop
  icon: string; // key into ICONS map
};

export const DEPARTMENT_META: Record<string, DeptMeta> = {
  "getting-started": { color: "#3b82f6", to: "#22d3ee", icon: "Rocket" },
  "mechanical-build": { color: "#f97316", to: "#f59e0b", icon: "Cog" },
  "cad-design": { color: "#8b5cf6", to: "#d946ef", icon: "PenTool" },
  "programming-software": { color: "#10b981", to: "#22d3ee", icon: "Code2" },
  "electrical-wiring": { color: "#f59e0b", to: "#facc15", icon: "Zap" },
  "business-operations": { color: "#f43f5e", to: "#fb7185", icon: "Briefcase" },
  "media-outreach": { color: "#ec4899", to: "#f472b6", icon: "Camera" },
  "impact-award": { color: "#eab308", to: "#f59e0b", icon: "Trophy" },
  "scouting-strategy": { color: "#14b8a6", to: "#22d3ee", icon: "LineChart" },
  "drive-team": { color: "#ef4444", to: "#f97316", icon: "Gamepad2" },
  safety: { color: "#84cc16", to: "#22c55e", icon: "ShieldCheck" },
};

const FALLBACK: DeptMeta = { color: "#5b8cff", to: "#22d3ee", icon: "BookOpen" };

export function deptMeta(slug: string): DeptMeta {
  return DEPARTMENT_META[slug] ?? FALLBACK;
}

export function deptGradient(slug: string, angle = 135) {
  const m = deptMeta(slug);
  return `linear-gradient(${angle}deg, ${m.color}, ${m.to})`;
}
