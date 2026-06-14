import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/constants";
import { getProgramSlugs, getRetreatSlugs } from "@/sanity/lib/fetch";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [programSlugs, retreatSlugs] = await Promise.all([
    getProgramSlugs(),
    getRetreatSlugs(),
  ]);

  const staticPaths = [
    "/",
    "/programs",
    "/retreats",
    "/events",
    "/events/archive",
    "/about",
    "/contact",
    "/terms-of-service",
    "/privacy-policy",
    "/cookie-policy",
  ];

  const now = new Date();

  const entries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: new URL(path, SITE_URL).toString(),
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));

  for (const slug of programSlugs) {
    entries.push({
      url: new URL(`/programs/${slug}`, SITE_URL).toString(),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  for (const slug of retreatSlugs) {
    entries.push({
      url: new URL(`/retreats/${slug}`, SITE_URL).toString(),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  return entries;
}
