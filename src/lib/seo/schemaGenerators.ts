import { siteConfig } from "./seoConfig";

/**
 * Types for schema.org structured data
 * Using schema-dts-like interfaces for type safety
 */

interface FAQ {
  question: string;
  answer: string;
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface ArticleData {
  title: string;
  description: string;
  url: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
}

interface HowToStep {
  name: string;
  text: string;
  image?: string;
}

interface HowToData {
  name: string;
  description: string;
  steps: HowToStep[];
  totalTime?: string; // ISO 8601 duration format (e.g., "PT30M")
  image?: string;
}

/**
 * Generate FAQPage schema markup
 * @see https://schema.org/FAQPage
 */
export function generateFAQSchema(faqs: FAQ[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate BreadcrumbList schema markup
 * @see https://schema.org/BreadcrumbList
 */
export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${siteConfig.url}${item.url}`,
    })),
  };
}

/**
 * Generate Article schema markup
 * @see https://schema.org/Article
 */
export function generateArticleSchema(article: ArticleData) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    url: article.url.startsWith("http") ? article.url : `${siteConfig.url}${article.url}`,
    image: article.image 
      ? (article.image.startsWith("http") ? article.image : `${siteConfig.url}${article.image}`)
      : `${siteConfig.url}${siteConfig.ogImage}`,
    datePublished: article.datePublished,
    dateModified: article.dateModified ?? article.datePublished,
    author: {
      "@type": "Organization",
      name: article.authorName ?? siteConfig.name,
      url: siteConfig.url,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/logo.png`,
      },
    },
  };
}

/**
 * Generate HowTo schema markup for step-by-step guides
 * @see https://schema.org/HowTo
 */
export function generateHowToSchema(data: HowToData) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: data.name,
    description: data.description,
    ...(data.totalTime && { totalTime: data.totalTime }),
    ...(data.image && { 
      image: data.image.startsWith("http") ? data.image : `${siteConfig.url}${data.image}` 
    }),
    step: data.steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.image && { 
        image: step.image.startsWith("http") ? step.image : `${siteConfig.url}${step.image}` 
      }),
    })),
  };
}

/**
 * Generate Organization schema for the site
 * @see https://schema.org/Organization
 */
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    description: siteConfig.description,
    email: siteConfig.email,
    sameAs: [
      siteConfig.social.twitter,
      siteConfig.social.github,
    ].filter(Boolean),
  };
}

/**
 * Generate WebSite schema with search action
 * @see https://schema.org/WebSite
 */
export function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Generate SoftwareApplication schema for the app
 * @see https://schema.org/SoftwareApplication
 */
export function generateAppSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    applicationCategory: "LifestyleApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "1000",
      bestRating: "5",
      worstRating: "1",
    },
  };
}

/**
 * Helper to render JSON-LD script tag content
 */
export function renderJsonLd(schema: Record<string, unknown>): string {
  return JSON.stringify(schema, null, 0);
}

/**
 * Export types for use in components
 */
export type { FAQ, BreadcrumbItem, ArticleData, HowToStep, HowToData };
