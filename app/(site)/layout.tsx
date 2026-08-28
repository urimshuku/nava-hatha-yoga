import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { StructuredData } from "@/components/StructuredData";
import { getSiteSettings } from "@/lib/cms/site-content";

/**
 * Every page under this layout renders per request.
 *
 * The header and footer read the site settings, and each page reads content that
 * the built-in CMS can change at any moment. The Cloudflare deployment has no
 * shared incremental cache, so a cached page could not be revalidated across
 * isolates: rendering on request is what makes an edit appear immediately.
 */
export const dynamic = "force-dynamic";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <>
      <StructuredData settings={settings} />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-saffron focus:px-5 focus:py-2.5 focus:text-sm focus:font-medium focus:text-ivory"
      >
        Skip to content
      </a>
      <Header brandName={settings.brandName} />
      <main id="main" className="min-h-screen">
        {children}
      </main>
      <Footer settings={settings} />
    </>
  );
}
