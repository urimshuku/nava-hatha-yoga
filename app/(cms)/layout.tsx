import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Website Editor",
  robots: { index: false, follow: false },
};

/**
 * The CMS lives outside the public site's chrome: no header, no footer, no
 * marketing styling. Deliberately plain so the editing screens stay readable.
 */
export default function CmsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="min-h-screen bg-ivory font-body text-charcoal">{children}</div>;
}
