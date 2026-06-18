import type { NextConfig } from "next";

/**
 * Server Actions allowed origins.
 * In production this MUST include the public hostname, otherwise mutating
 * actions are rejected with a 403 (CSRF protection). Configure via the
 * NEXT_PUBLIC_APP_URL environment variable, falling back to localhost for dev.
 */
const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
const siteHost = (() => {
  try {
    return new URL(siteUrl).host;
  } catch {
    return "localhost:3000";
  }
})();

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    // Tool logos / screenshots can be hosted anywhere; the catalog references
    // arbitrary tool websites. Tightened to HTTPS-first with an explicit HTTP
    // fallback for local/dev assets.
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "localhost" },
      { protocol: "http", hostname: "127.0.0.1" },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", siteHost],
    },
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
