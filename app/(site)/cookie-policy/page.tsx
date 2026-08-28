import type { Metadata } from "next";

import { LegalPageView } from "@/components/content/LegalPageView";
import { buildMetadata } from "@/lib/seo";
import { getLegalPage } from "@/lib/cms/site-content";

const SLUG = "cookie-policy";

// Rendered per request so edits made in /admin are live the moment they are saved.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getLegalPage(SLUG);
  return buildMetadata({
    title: page?.title ?? "Cookie Policy",
    seo: page?.seo,
    path: `/${SLUG}`,
  });
}

export default async function CookiePolicyPage() {
  const page = await getLegalPage(SLUG);
  return <LegalPageView page={page} fallbackTitle="Cookie Policy" />;
}
