import type { Metadata } from "next";

import { LegalPageView } from "@/components/content/LegalPageView";
import { buildMetadata } from "@/lib/seo";
import { getLegalPage } from "@/sanity/lib/fetch";

const SLUG = "privacy-policy";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getLegalPage(SLUG);
  return buildMetadata({
    title: page?.title ?? "Privacy Policy",
    seo: page?.seo,
    path: `/${SLUG}`,
  });
}

export default async function PrivacyPolicyPage() {
  const page = await getLegalPage(SLUG);
  return <LegalPageView page={page} fallbackTitle="Privacy Policy" />;
}
