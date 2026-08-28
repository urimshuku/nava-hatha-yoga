import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { StructuredData } from "@/components/StructuredData";
import { getSiteSettings } from "@/lib/cms/site-content";

/**
 * Every page under this layout renders per request from D1.
 *
 * Pages stay dynamic so a production build without D1 cannot bake placeholder
 * copy into the Worker. The Worker caches public HTML for a minute (and serves
 * stale HTML while refreshing) so visitors are not billed a full Next.js render
 * on every hit — that path is what caused intermittent Error 1102.
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
