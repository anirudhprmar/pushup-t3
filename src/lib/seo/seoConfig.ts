/**
 * Site-wide SEO configuration and constants
 * Central source of truth for all SEO-related settings
 */

export const siteConfig = {
  name: "Pushup",
  tagline: "Build Habits That Last",
  description: "Transform your life with the all-or-nothing habit tracker. Track 365 days of consistency, visualize progress, and build habits that truly last.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://pushup.app",
  ogImage: "/og-default.png",
  twitterHandle: "@pushupapp",
  locale: "en_US",
  themeColor: "#6366f1",
  
  // Social links
  social: {
    twitter: "https://twitter.com/pushupapp",
    github: "https://github.com/pushupapp",
  },
  
  // Contact
  email: "anirudhparmar2004@gmail.com",
} as const;

/**
 * SEO category definitions for programmatic pages
 * Used for hub-and-spoke internal linking structure
 */
export const seoCategories = {
  habits: {
    slug: "habits",
    title: "Habit Guides",
    description: "Comprehensive guides on building and maintaining habits",
  },
  guides: {
    slug: "guides",
    title: "How-To Guides",
    description: "Step-by-step guides for habit formation and productivity",
  },
  tips: {
    slug: "tips",
    title: "Quick Tips",
    description: "Actionable tips for daily consistency and motivation",
  },
  resources: {
    slug: "resources",
    title: "Resources",
    description: "Tools, templates, and resources for habit tracking",
  },
} as const;

export type SeoCategory = keyof typeof seoCategories;

/**
 * Routes that should be excluded from indexing
 * Used in robots.txt and noindex meta tags
 */
export const noIndexRoutes = [
  "/api",
  "/login",
  "/profile",
  "/habits",
  "/tasks",
  "/goals",
  "/settings",
  "/notifications",
  "/leaderboard",
  "/weekly-goals",
] as const;

/**
 * Priority mapping for sitemap generation
 */
export const sitemapPriorities = {
  home: 1.0,
  category: 0.9,
  article: 0.8,
  guide: 0.7,
  legal: 0.3,
} as const;

/**
 * Default keywords for the site
 */
export const defaultKeywords = [
  "habit tracker",
  "365-day challenge",
  "habit building",
  "consistency tracking",
  "daily habits",
  "productivity app",
  "streak counter",
  "habit formation",
  "self improvement",
  "goal tracking",
] as const;
