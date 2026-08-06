import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/constants";
import {
  getProgramSlugEntries,
  getRetreatSlugEntries,
} from "@/sanity/lib/fetch";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [programEntries, retreatEntries] = await Promise.all([
    getProgramSlugEntries(),
    getRetreatSlugEntries(),
  ]);

  // Static routes: omit lastModified rather than inventing "now" (Google
  // ignores unreliable lastmod signals).
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

  const entries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: new URL(path, SITE_URL).toString(),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));

  for (const entry of programEntries) {
    entries.push({
      url: new URL(`/programs/${entry.slug}`, SITE_URL).toString(),
      ...(entry._updatedAt ? { lastModified: new Date(entry._updatedAt) } : {}),
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  for (const entry of retreatEntries) {
    entries.push({
      url: new URL(`/retreats/${entry.slug}`, SITE_URL).toString(),
      ...(entry._updatedAt ? { lastModified: new Date(entry._updatedAt) } : {}),
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  return entries;
}
