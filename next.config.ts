import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  // The HTML sitemap discovers routes by reading the `app` directory at
  // request time. File tracing can't see that dynamic read, so include the
  // page files in the deployed bundle explicitly.
  outputFileTracingIncludes: {
    "/sitemap": ["./app/**/page.tsx"],
  },
};

export default nextConfig;
