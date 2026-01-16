/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "163jz9wo57.ufs.sh",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      }
    ],
    // Optimize images for production
    formats: ["image/avif", "image/webp"],
  },

  // Performance: Cache headers for SEO pages
  async headers() {
    return [
      {
        // Static SEO pages - cache aggressively
        source: "/guide/:slug*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=86400, stale-while-revalidate=604800",
          },
        ],
      },
      {
        // Topic/category pages
        source: "/topics/:slug*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=86400, stale-while-revalidate=604800",
          },
        ],
      },
      {
        // Sitemap and robots - cache for 1 hour
        source: "/:file(sitemap.xml|robots.txt)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=3600, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },

  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
      {
       source: "/ingest/decide",
       destination: "https://us.i.posthog.com/decide",
      },
    ];
  },

  // Experimental features for large-scale SSG
  experimental: {
    // Optimize for many static pages
    isrFlushToDisk: true,
  },
};

export default config;

