import { eq, and, desc, sql } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { seoTopics, seoPages, seoFaqs } from "~/server/db/schema";

/**
 * SEO Router - Public procedures for programmatic SEO pages
 * These are public because SEO pages need to be accessible without auth
 */
export const seoRouter = createTRPCRouter({
  /**
   * Get a single page by its slug
   * Used by dynamic route pages for SSG/ISR
   */
  getPageBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const page = await ctx.db.query.seoPages.findFirst({
        where: and(
          eq(seoPages.slug, input.slug),
          eq(seoPages.isPublished, true)
        ),
        with: {
          topic: true,
          faqs: {
            orderBy: [seoFaqs.sortOrder],
          },
        },
      });

      return page ?? null;
    }),

  /**
   * Get all published page slugs
   * Used by generateStaticParams for static generation
   */
  getAllPublishedSlugs: publicProcedure.query(async ({ ctx }) => {
    const pages = await ctx.db
      .select({
        slug: seoPages.slug,
        updatedAt: seoPages.updatedAt,
      })
      .from(seoPages)
      .where(eq(seoPages.isPublished, true));

    return pages;
  }),

  /**
   * Get paginated slugs for large-scale sitemap generation
   * Returns batches of 1000 for efficient sitemap building
   */
  getPageSlugsBatch: publicProcedure
    .input(
      z.object({
        offset: z.number().int().min(0).default(0),
        limit: z.number().int().min(1).max(5000).default(1000),
      })
    )
    .query(async ({ ctx, input }) => {
      const pages = await ctx.db
        .select({
          slug: seoPages.slug,
          updatedAt: seoPages.updatedAt,
          schemaType: seoPages.schemaType,
        })
        .from(seoPages)
        .where(eq(seoPages.isPublished, true))
        .limit(input.limit)
        .offset(input.offset);

      return pages;
    }),

  /**
   * Get total count of published pages
   * Used for sitemap pagination calculations
   */
  getTotalPageCount: publicProcedure.query(async ({ ctx }) => {
    const result = await ctx.db
      .select({ count: sql<number>`count(*)` })
      .from(seoPages)
      .where(eq(seoPages.isPublished, true));

    return result[0]?.count ?? 0;
  }),

  /**
   * Get related pages for internal linking
   * Returns pages from the same topic or category
   */
  getRelatedPages: publicProcedure
    .input(
      z.object({
        pageId: z.string().uuid(),
        limit: z.number().int().min(1).max(10).default(5),
      })
    )
    .query(async ({ ctx, input }) => {
      // First get the current page to find its topic
      const currentPage = await ctx.db.query.seoPages.findFirst({
        where: eq(seoPages.id, input.pageId),
        columns: { topicId: true },
      });

      if (!currentPage?.topicId) {
        // Return random published pages if no topic
        return ctx.db
          .select({
            id: seoPages.id,
            slug: seoPages.slug,
            title: seoPages.title,
            description: seoPages.description,
          })
          .from(seoPages)
          .where(
            and(
              eq(seoPages.isPublished, true),
              sql`${seoPages.id} != ${input.pageId}`
            )
          )
          .limit(input.limit);
      }

      // Get pages from the same topic
      const relatedPages = await ctx.db
        .select({
          id: seoPages.id,
          slug: seoPages.slug,
          title: seoPages.title,
          description: seoPages.description,
        })
        .from(seoPages)
        .where(
          and(
            eq(seoPages.topicId, currentPage.topicId),
            eq(seoPages.isPublished, true),
            sql`${seoPages.id} != ${input.pageId}`
          )
        )
        .limit(input.limit);

      return relatedPages;
    }),

  /**
   * Get a topic with its child pages (hub-and-spoke structure)
   */
  getTopicWithPages: publicProcedure
    .input(z.object({ topicSlug: z.string() }))
    .query(async ({ ctx, input }) => {
      const topic = await ctx.db.query.seoTopics.findFirst({
        where: and(
          eq(seoTopics.slug, input.topicSlug),
          eq(seoTopics.isPublished, true)
        ),
        with: {
          pages: {
            where: eq(seoPages.isPublished, true),
            orderBy: [desc(seoPages.publishedAt)],
            columns: {
              id: true,
              slug: true,
              title: true,
              description: true,
              publishedAt: true,
            },
          },
        },
      });

      return topic ?? null;
    }),

  /**
   * Get all published topics for category pages
   */
  getAllTopics: publicProcedure.query(async ({ ctx }) => {
    const topics = await ctx.db
      .select({
        id: seoTopics.id,
        slug: seoTopics.slug,
        title: seoTopics.title,
        description: seoTopics.description,
        category: seoTopics.category,
      })
      .from(seoTopics)
      .where(eq(seoTopics.isPublished, true))
      .orderBy(seoTopics.title);

    return topics;
  }),

  /**
   * Get breadcrumb data for a page
   */
  getBreadcrumbs: publicProcedure
    .input(z.object({ pageSlug: z.string() }))
    .query(async ({ ctx, input }) => {
      const page = await ctx.db.query.seoPages.findFirst({
        where: eq(seoPages.slug, input.pageSlug),
        with: {
          topic: {
            columns: {
              slug: true,
              title: true,
              category: true,
            },
          },
        },
      });

      if (!page) return [];

      const breadcrumbs = [
        { name: "Home", url: "/" },
      ];

      if (page.topic) {
        breadcrumbs.push({
          name: page.topic.title,
          url: `/topics/${page.topic.slug}`,
        });
      }

      breadcrumbs.push({
        name: page.title,
        url: `/guide/${page.slug}`,
      });

      return breadcrumbs;
    }),
});
