import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://learnfrc.systemerr.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/guides",
    "/paths",
    "/glossary",
    "/resources",
    "/leaderboard",
    "/login",
    "/signup",
  ].map((p) => ({
    url: `${SITE}${p}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: p === "" ? 1 : 0.7,
  }));

  try {
    const supabase = await createClient();
    const [{ data: depts }, { data: lessons }] = await Promise.all([
      supabase.from("departments").select("slug"),
      supabase.from("lessons").select("slug, modules(slug, departments(slug))"),
    ]);

    const deptRoutes: MetadataRoute.Sitemap = (depts ?? []).map((d) => ({
      url: `${SITE}/guides/${d.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    const lessonRoutes: MetadataRoute.Sitemap = (lessons ?? [])
      .map((l) => {
        const m = l.modules as { slug?: string; departments?: { slug?: string } } | null;
        const ds = m?.departments?.slug;
        const ms = m?.slug;
        if (!ds || !ms) return null;
        return {
          url: `${SITE}/guides/${ds}/${ms}/${l.slug}`,
          lastModified: now,
          changeFrequency: "monthly" as const,
          priority: 0.6,
        };
      })
      .filter(Boolean) as MetadataRoute.Sitemap;

    return [...staticRoutes, ...deptRoutes, ...lessonRoutes];
  } catch {
    return staticRoutes;
  }
}
