import type { MetadataRoute } from "next";
import { siteConfig, sitemapPriorities } from "~/lib/seo/seoConfig";

/**
 * Dynamic sitemap generation
 * Supports static routes + programmatic SEO pages
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;
  const now = new Date();

  // Static routes that are always included
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: sitemapPriorities.home,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: sitemapPriorities.legal,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: sitemapPriorities.legal,
    },
  ];

  // Dynamic SEO pages from database
  // TODO: Uncomment when seo.router is implemented
  // const seoPages = await api.seo.getAllPublishedSlugs();
  // const dynamicRoutes: MetadataRoute.Sitemap = seoPages.map((page) => ({
  //   url: `${baseUrl}/guide/${page.slug}`,
  //   lastModified: page.updatedAt,
  //   changeFrequency: "monthly" as const,
  //   priority: sitemapPriorities.article,
  // }));

  const dynamicRoutes: MetadataRoute.Sitemap = [];

  return [...staticRoutes, ...dynamicRoutes];
}

/**
 * For very large sitemaps (100K+ pages), Next.js supports
 * generating multiple sitemaps via generateSitemaps()
 * 
 * Uncomment and implement when page count exceeds 50,000:
 * 
 * export async function generateSitemaps() {
 *   const totalPages = await api.seo.getTotalPageCount();
 *   const sitemapsNeeded = Math.ceil(totalPages / 50000);
 *   
 *   return Array.from({ length: sitemapsNeeded }, (_, i) => ({ id: i }));
 * }
 * 
 * export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
 *   const pages = await api.seo.getPagesBatch({ offset: id * 50000, limit: 50000 });
 *   // ... generate sitemap entries
 * }
 */
