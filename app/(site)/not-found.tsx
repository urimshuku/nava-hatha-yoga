import type { Metadata } from "next";

import { NotFoundContent } from "@/components/content/NotFoundContent";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

/** Segment not-found: uses (site) layout header/footer for recovery links. */
export default function SiteNotFound() {
  return <NotFoundContent />;
}
