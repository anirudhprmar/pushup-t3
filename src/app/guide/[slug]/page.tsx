import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { staticApi } from "~/trpc/static";
import { generatePageMetadata } from "~/lib/seo/generateMetadata";
import { SeoPageTemplate } from "~/components/seo/SeoPageTemplate";
import type { BreadcrumbItem, FAQ } from "~/lib/seo/schemaGenerators";

interface Props {
  params: Promise<{ slug: string }>;
}

/**
 * Generate static paths for all published SEO pages
 * Uses staticApi because headers() isn't available during SSG
 * Returns empty array if tables don't exist yet (initial build)
 */
export async function generateStaticParams() {
  try {
    const pages = await staticApi.seo.getAllPublishedSlugs();
    return pages.map((page) => ({
      slug: page.slug,
    }));
  } catch (error) {
    // Tables may not exist during initial build before migration
    console.warn("SEO tables not ready, skipping static generation:", error);
    return [];
  }
}

/**
 * Generate dynamic metadata for each page
 * Uses staticApi because headers() isn't available during SSG
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await staticApi.seo.getPageBySlug({ slug });

  if (!page) {
    return {
      title: "Page Not Found",
    };
  }

  return generatePageMetadata({
    title: page.metaTitle ?? page.title,
    description: page.metaDescription ?? page.description,
    path: `/guide/${slug}`,
    keywords: page.keywords ?? [],
    publishedTime: page.publishedAt?.toISOString(),
    modifiedTime: page.updatedAt?.toISOString(),
    section: page.topic?.category,
  });
}

/**
 * Dynamic SEO guide page with ISR
 * Uses staticApi since this runs during build/revalidation
 */
export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const page = await staticApi.seo.getPageBySlug({ slug });

  if (!page) {
    notFound();
  }

  // Get related pages for internal linking
  const relatedPages = await staticApi.seo.getRelatedPages({
    pageId: page.id,
    limit: 6,
  });

  // Build breadcrumbs
  const breadcrumbs: BreadcrumbItem[] = [
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
    url: `/guide/${slug}`,
  });

  // Transform FAQs to expected format
  const faqs: FAQ[] = page.faqs.map((faq) => ({
    question: faq.question,
    answer: faq.answer,
  }));

  return (
    <SeoPageTemplate
      title={page.title}
      description={page.description}
      slug={page.slug}
      content={page.content}
      breadcrumbs={breadcrumbs}
      faqs={faqs}
      relatedPages={relatedPages}
      publishedAt={page.publishedAt?.toISOString()}
      updatedAt={page.updatedAt?.toISOString()}
      schemaType={page.schemaType as "Article" | "HowTo" | "FAQ" | undefined}
      basePath="/guide"
    />
  );
}

/**
 * ISR configuration - revalidate every hour
 * Balances freshness with build performance for 100K+ pages
 */
export const revalidate = 3600;

/**
 * Dynamic params configuration
 * Allow pages not generated at build time to be created on-demand
 */
export const dynamicParams = true;
