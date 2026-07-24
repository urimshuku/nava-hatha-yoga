import type { Metadata, Viewport } from "next";

import StudioClient from "./StudioClient";

export const dynamic = "force-static";

// Defined inline instead of re-exporting from "next-sanity/studio" so the
// Sanity Studio package never enters the server bundle (Worker size limit).
export const metadata: Metadata = {
  title: "Sanity Studio",
  robots: { index: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function StudioPage() {
  return <StudioClient />;
}
