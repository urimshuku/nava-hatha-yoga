import type { Metadata } from "next";

import { NotFoundContent } from "@/components/content/NotFoundContent";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { getSiteSettings } from "@/sanity/lib/fetch";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

/**
 * Global not-found (unknown URLs outside a matching segment).
 * Mirrors site chrome so lost visitors still get header/footer navigation.
 */
export default async function RootNotFound() {
  const settings = await getSiteSettings();

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-saffron focus:px-5 focus:py-2.5 focus:text-sm focus:font-medium focus:text-ivory"
      >
        Skip to content
      </a>
      <Header brandName={settings.brandName} />
      <main id="main" className="min-h-screen bg-cream">
        <NotFoundContent />
      </main>
      <Footer settings={settings} />
    </>
  );
}
