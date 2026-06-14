import type { Metadata } from "next";

import { LegalPageView } from "@/components/content/LegalPageView";
import { buildMetadata } from "@/lib/seo";
import { getLegalPage } from "@/sanity/lib/fetch";

const SLUG = "terms-of-service";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getLegalPage(SLUG);
  return buildMetadata({
    title: page?.title ?? "Terms of Service",
    seo: page?.seo,
    path: `/${SLUG}`,
  });
}

export default async function TermsOfServicePage() {
  const page = await getLegalPage(SLUG);
  return <LegalPageView page={page} fallbackTitle="Terms of Service" />;
}
