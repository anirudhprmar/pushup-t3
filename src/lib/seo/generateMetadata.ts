import type { Metadata } from "next";
import { siteConfig, defaultKeywords } from "./seoConfig";

/**
 * Parameters for generating page metadata
 */
interface PageMetadataParams {
  title: string;
  description: string;
  path: string;
  image?: string;
  noIndex?: boolean;
  keywords?: readonly string[] | string[];
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  section?: string;
}

/**
 * Generate the canonical URL for a given path
 */
export function generateCanonicalUrl(path: string): string {
  const baseUrl = siteConfig.url.replace(/\/$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}

/**
 * Generate complete page metadata with Open Graph and Twitter cards
 * Used by generateMetadata exports in page.tsx files
 */
export function generatePageMetadata({
  title,
  description,
  path,
  image,
  noIndex = false,
  keywords = [],
  publishedTime,
  modifiedTime,
  authors,
  section,
}: PageMetadataParams): Metadata {
  const canonicalUrl = generateCanonicalUrl(path);
  const ogImage = image ?? siteConfig.ogImage;
  const fullImageUrl = ogImage.startsWith("http") 
    ? ogImage 
    : `${siteConfig.url}${ogImage}`;

  const allKeywords = [...new Set([...keywords, ...defaultKeywords])];

  const metadata: Metadata = {
    title,
    description,
    keywords: allKeywords,
    authors: authors?.map((name) => ({ name })) ?? [{ name: siteConfig.name }],
    creator: siteConfig.name,
    
    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      type: section ? "article" : "website",
      locale: siteConfig.locale,
      url: canonicalUrl,
      siteName: siteConfig.name,
      title,
      description,
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(section && { section }),
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [fullImageUrl],
      creator: siteConfig.twitterHandle,
    },

    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };

  return metadata;
}

/**
 * Generate metadata for hub/category pages
 */
export function generateCategoryMetadata(
  categorySlug: string,
  categoryTitle: string,
  categoryDescription: string,
  pageCount?: number
): Metadata {
  const enhancedDescription = pageCount
    ? `${categoryDescription} Browse ${pageCount}+ guides and resources.`
    : categoryDescription;

  return generatePageMetadata({
    title: `${categoryTitle} - ${siteConfig.tagline}`,
    description: enhancedDescription,
    path: `/${categorySlug}`,
    keywords: [categorySlug, categoryTitle.toLowerCase()],
  });
}

/**
 * Generate metadata for article/guide pages
 */
export function generateArticleMetadata(
  slug: string,
  title: string,
  description: string,
  options?: {
    category?: string;
    keywords?: string[];
    publishedTime?: string;
    modifiedTime?: string;
    image?: string;
  }
): Metadata {
  return generatePageMetadata({
    title,
    description,
    path: options?.category ? `/${options.category}/${slug}` : `/guide/${slug}`,
    keywords: options?.keywords,
    publishedTime: options?.publishedTime,
    modifiedTime: options?.modifiedTime,
    image: options?.image,
    section: options?.category,
  });
}
