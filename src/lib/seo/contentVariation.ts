/**
 * Content variation utilities to prevent thin/duplicate content
 * at scale (100K+ pages)
 */

/**
 * Title templates for dynamic generation
 * Each template produces unique, intent-matched titles
 */
export const titleTemplates = {
  howTo: [
    "How to {action} {topic} in {timeframe}",
    "The Complete Guide to {action} {topic}",
    "{action} {topic}: A Step-by-Step Guide",
    "Master {topic}: {action} Like a Pro",
    "{timeframe} Guide to {action} {topic}",
  ],
  tips: [
    "{count} {adjective} Tips for {topic}",
    "Top {count} Ways to {action} {topic}",
    "{topic}: {count} {adjective} Strategies That Work",
    "Best {count} {topic} Tips for {audience}",
  ],
  comparison: [
    "{topic1} vs {topic2}: Which is Better for {goal}?",
    "Comparing {topic1} and {topic2} for {goal}",
    "{topic1} or {topic2}? The Complete Comparison",
  ],
  listicle: [
    "{count} {topic} Ideas for {audience}",
    "The {count} Best {topic} for {year}",
    "{count} {adjective} {topic} You Need to Try",
  ],
} as const;

type TemplateType = keyof typeof titleTemplates;

interface TitleVariables {
  action?: string;
  topic?: string;
  timeframe?: string;
  count?: number;
  adjective?: string;
  audience?: string;
  topic1?: string;
  topic2?: string;
  goal?: string;
  year?: number;
}

/**
 * Generate a unique title from a template
 */
export function generateUniqueTitle(
  templateType: TemplateType,
  variables: TitleVariables,
  templateIndex?: number
): string {
  const templates = titleTemplates[templateType] as readonly string[];
  const index = templateIndex ?? Math.floor(Math.random() * templates.length);
  let template = templates[index % templates.length]!;

  // Replace variables
  const replacements: Record<string, string> = {
    "{action}": variables.action ?? "build",
    "{topic}": variables.topic ?? "habits",
    "{timeframe}": variables.timeframe ?? "30 days",
    "{count}": String(variables.count ?? 10),
    "{adjective}": variables.adjective ?? "effective",
    "{audience}": variables.audience ?? "beginners",
    "{topic1}": variables.topic1 ?? "option A",
    "{topic2}": variables.topic2 ?? "option B",
    "{goal}": variables.goal ?? "success",
    "{year}": String(variables.year ?? new Date().getFullYear()),
  };

  for (const [key, value] of Object.entries(replacements)) {
    template = template.replace(new RegExp(key, "g"), value);
  }

  return template;
}

/**
 * Description templates for meta descriptions
 */
export const descriptionTemplates = {
  guide: [
    "Learn how to {action} {topic} with our comprehensive guide. Discover proven strategies, tips, and step-by-step instructions for {goal}.",
    "Master {topic} with this complete guide. Get actionable advice on how to {action} and achieve {goal} in {timeframe}.",
    "Ready to {action} {topic}? This in-depth guide covers everything you need to know about {goal}, from basics to advanced techniques.",
  ],
  tips: [
    "Discover {count} proven tips for {topic}. Learn the best strategies to {action} and achieve {goal} faster.",
    "Looking to improve your {topic}? These {count} actionable tips will help you {action} and reach {goal}.",
  ],
  listicle: [
    "Explore our curated list of {count} {topic} ideas. Perfect for {audience} looking to {action}.",
    "Find the best {topic} with our top {count} picks. Ideal for {audience} who want to {goal}.",
  ],
} as const;

type DescriptionTemplateType = keyof typeof descriptionTemplates;

/**
 * Generate a unique description from a template
 */
export function generateUniqueDescription(
  templateType: DescriptionTemplateType,
  variables: TitleVariables,
  templateIndex?: number
): string {
  const templates = descriptionTemplates[templateType] as readonly string[];
  const index = templateIndex ?? Math.floor(Math.random() * templates.length);
  let template = templates[index % templates.length]!;

  const replacements: Record<string, string> = {
    "{action}": variables.action ?? "improve",
    "{topic}": variables.topic ?? "your habits",
    "{timeframe}": variables.timeframe ?? "30 days",
    "{count}": String(variables.count ?? 10),
    "{goal}": variables.goal ?? "success",
    "{audience}": variables.audience ?? "beginners",
  };

  for (const [key, value] of Object.entries(replacements)) {
    template = template.replace(new RegExp(key, "g"), value);
  }

  return template;
}

/**
 * Calculate content similarity using Jaccard index
 * Returns a value between 0 (no similarity) and 1 (identical)
 */
function calculateSimilarity(content1: string, content2: string): number {
  const words1 = new Set(content1.toLowerCase().split(/\s+/));
  const words2 = new Set(content2.toLowerCase().split(/\s+/));
  
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  
  return intersection.size / union.size;
}

/**
 * Validate that content is sufficiently unique compared to existing content
 * Returns true if content is unique enough (similarity below threshold)
 */
export function validateContentUniqueness(
  content: string,
  existingContents: string[],
  similarityThreshold = 0.7
): { isUnique: boolean; maxSimilarity: number; similarTo?: number } {
  let maxSimilarity = 0;
  let similarToIndex: number | undefined;

  for (let i = 0; i < existingContents.length; i++) {
    const similarity = calculateSimilarity(content, existingContents[i]!);
    if (similarity > maxSimilarity) {
      maxSimilarity = similarity;
      similarToIndex = i;
    }
  }

  return {
    isUnique: maxSimilarity < similarityThreshold,
    maxSimilarity,
    similarTo: maxSimilarity >= similarityThreshold ? similarToIndex : undefined,
  };
}

/**
 * Generate a content hash for deduplication
 * Uses a simple hash of normalized content
 */
export function generateContentHash(content: string): string {
  const normalized = content
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
  
  // Simple hash function for content fingerprinting
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return Math.abs(hash).toString(36);
}

/**
 * Check for potential keyword cannibalization
 * Returns true if the new page might compete with existing pages
 */
export function detectKeywordCannibalization(
  newKeywords: string[],
  existingPagesKeywords: Array<{ pageId: string; keywords: string[] }>,
  overlapThreshold = 0.6
): { hasIssue: boolean; conflictingPages: string[] } {
  const conflictingPages: string[] = [];
  const newKeywordsSet = new Set(newKeywords.map(k => k.toLowerCase()));

  for (const page of existingPagesKeywords) {
    const existingSet = new Set(page.keywords.map(k => k.toLowerCase()));
    const intersection = new Set([...newKeywordsSet].filter(x => existingSet.has(x)));
    const overlapRatio = intersection.size / Math.min(newKeywordsSet.size, existingSet.size);

    if (overlapRatio >= overlapThreshold) {
      conflictingPages.push(page.pageId);
    }
  }

  return {
    hasIssue: conflictingPages.length > 0,
    conflictingPages,
  };
}

/**
 * Minimum content length requirements to avoid thin content
 */
export const contentLengthRequirements = {
  title: { min: 30, max: 60 },
  description: { min: 120, max: 160 },
  bodyContent: { min: 300, recommended: 800 },
  faqAnswer: { min: 50, recommended: 150 },
} as const;

/**
 * Validate content meets minimum length requirements
 */
export function validateContentLength(
  content: string,
  type: keyof typeof contentLengthRequirements
): { isValid: boolean; length: number; requirement: typeof contentLengthRequirements[typeof type] } {
  const requirement = contentLengthRequirements[type];
  const length = content.length;

  return {
    isValid: length >= requirement.min,
    length,
    requirement,
  };
}
