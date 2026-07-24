"use client";

import dynamic from "next/dynamic";

// Load the Studio only in the browser. Keeping it out of the server bundle is
// required to stay under Cloudflare's Worker size limit.
const Studio = dynamic(() => import("./Studio"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-screen items-center justify-center text-sm text-neutral-500">
      Loading Studio…
    </div>
  ),
});

export default function StudioClient() {
  return <Studio />;
}
