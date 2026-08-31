import type { Metadata, Viewport } from "next";

import "./globals.css";
import { fontBody, fontHeading } from "@/lib/fonts";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/constants";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";
import { getSiteSettings } from "@/lib/cms/site-content";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const brandName = settings.brandName ?? SITE_NAME;
  const description =
    settings.seo?.description ?? settings.description ?? SITE_DESCRIPTION;
  const defaultTitle =
    settings.seo?.title ?? `${brandName} · Classical Hatha Yoga`;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: defaultTitle,
      template: `%s · ${brandName}`,
    },
    description,
    applicationName: brandName,
    openGraph: {
      type: "website",
      siteName: brandName,
      locale: "en_GB",
      description,
      images: [{ ...DEFAULT_OG_IMAGE, alt: defaultTitle }],
    },
    twitter: {
      card: "summary_large_image",
      description,
      images: [DEFAULT_OG_IMAGE.url],
    },
    robots: { index: true, follow: true },
    formatDetection: { telephone: false },
  };
}

export const viewport: Viewport = {
  themeColor: "#FAF6EE",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB" className={`${fontHeading.variable} ${fontBody.variable}`}>
      <body>{children}</body>
    </html>
  );
}
