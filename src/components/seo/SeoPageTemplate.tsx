import {
  generateArticleSchema,
  type FAQ,
  type BreadcrumbItem,
  renderJsonLd,
} from "~/lib/seo/schemaGenerators";
import { Breadcrumbs } from "./Breadcrumbs";
import { FAQSection } from "./FAQSection";
import { RelatedPages } from "./RelatedPages";

interface RelatedPage {
  id: string;
  slug: string;
  title: string;
  description: string;
}

interface SeoPageTemplateProps {
  title: string;
  description: string;
  slug: string;
  content: string;
  breadcrumbs: BreadcrumbItem[];
  faqs?: FAQ[];
  relatedPages?: RelatedPage[];
  publishedAt?: string;
  updatedAt?: string;
  schemaType?: "Article" | "HowTo" | "FAQ";
  basePath?: string;
}

/**
 * Reusable SEO page template with built-in structured data
 * Handles Article schema, breadcrumbs, FAQs, and internal linking
 */
export function SeoPageTemplate({
  title,
  description,
  slug,
  content,
  breadcrumbs,
  faqs = [],
  relatedPages = [],
  publishedAt,
  updatedAt,
  schemaType: _schemaType = "Article",
  basePath = "/guide",
}: SeoPageTemplateProps) {
  // Generate Article schema
  const articleSchema = generateArticleSchema({
    title,
    description,
    url: `${basePath}/${slug}`,
    datePublished: publishedAt ?? new Date().toISOString(),
    dateModified: updatedAt ?? publishedAt ?? new Date().toISOString(),
  });

  return (
    <>
      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: renderJsonLd(articleSchema) }}
      />

      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumbs */}
          <Breadcrumbs items={breadcrumbs} className="mb-8" />

          {/* Main Article */}
          <article className="prose prose-slate prose-lg max-w-none">
            <header className="mb-8 not-prose">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-4">
                {title}
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed">
                {description}
              </p>
              {publishedAt && (
                <div className="mt-4 flex items-center gap-4 text-sm text-slate-500">
                  <time dateTime={publishedAt}>
                    Published: {new Date(publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                  {updatedAt && updatedAt !== publishedAt && (
                    <time dateTime={updatedAt}>
                      Updated: {new Date(updatedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                  )}
                </div>
              )}
            </header>

            {/* Main Content */}
            <div
              className="[&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mt-10 [&>h2]:mb-4
                         [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:mt-8 [&>h3]:mb-3
                         [&>p]:mb-4 [&>p]:leading-relaxed
                         [&>ul]:my-4 [&>ul]:pl-6 [&>ul>li]:mb-2
                         [&>ol]:my-4 [&>ol]:pl-6 [&>ol>li]:mb-2"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </article>

          {/* FAQ Section */}
          {faqs.length > 0 && (
            <FAQSection faqs={faqs} className="border-t border-slate-200 mt-12" />
          )}

          {/* Related Pages */}
          {relatedPages.length > 0 && (
            <RelatedPages
              pages={relatedPages}
              basePath={basePath}
              className="border-t border-slate-200"
            />
          )}
        </div>
      </div>
    </>
  );
}

/**
 * Minimal version for embedding in other layouts
 */
export function SeoArticleContent({
  title,
  description,
  content,
  publishedAt: _publishedAt,
}: Pick<SeoPageTemplateProps, "title" | "description" | "content" | "publishedAt">) {
  return (
    <article className="prose prose-slate prose-lg max-w-none">
      <header className="mb-8 not-prose">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-4">
          {title}
        </h1>
        <p className="text-xl text-slate-600">{description}</p>
      </header>

      <div dangerouslySetInnerHTML={{ __html: content }} />
    </article>
  );
}
