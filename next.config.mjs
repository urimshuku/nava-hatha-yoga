import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pin the file-tracing root to this project (avoids picking up parent lockfiles).
  outputFileTracingRoot: projectRoot,
  serverExternalPackages: ["@pdf-lib/fontkit"],
  // Legacy dynamic OG route URL → static asset (avoids 404 after removing ImageResponse).
  async redirects() {
    return [
      {
        source: "/opengraph-image",
        destination: "/images/og-default.png",
        permanent: true,
      },
      {
        source: "/events/free-introduction-to-hatha-yoga-online-2026-09-11",
        destination: "/events/free-introduction-to-hatha-yoga-tirane-2026-09-10",
        permanent: true,
      },
    ];
  },
  // Static metadata icons are emitted as /icon.png and /apple-icon.png; keep the
  // short /icon and /apple-icon paths working (manifest + crawlers) via rewrite.
  async rewrites() {
    return [
      { source: "/icon", destination: "/icon.png" },
      { source: "/apple-icon", destination: "/apple-icon.png" },
    ];
  },
  images: {
    loader: "custom",
    loaderFile: "./image-loader.ts",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
