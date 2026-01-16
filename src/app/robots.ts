import type { MetadataRoute } from "next";
import { siteConfig, noIndexRoutes } from "~/lib/seo/seoConfig";

/**
 * Dynamic robots.txt generation
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.url;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: noIndexRoutes.map((route) => `${route}/`),
      },
      // Block AI crawlers if desired (optional)
      {
        userAgent: "GPTBot",
        disallow: ["/"],
      },
      {
        userAgent: "ChatGPT-User",
        disallow: ["/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
