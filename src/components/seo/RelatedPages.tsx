import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";

interface RelatedPage {
  id: string;
  slug: string;
  title: string;
  description: string;
}

interface RelatedPagesProps {
  pages: RelatedPage[];
  title?: string;
  basePath?: string;
  className?: string;
}

/**
 * Internal linking component for hub-and-spoke SEO architecture
 * Displays related pages to keep users engaged and distribute link equity
 */
export function RelatedPages({
  pages,
  title = "Related Guides",
  basePath = "/guide",
  className = "",
}: RelatedPagesProps) {
  if (pages.length === 0) return null;

  return (
    <aside className={`mt-12 ${className}`} aria-labelledby="related-pages-title">
      <h2 id="related-pages-title" className="text-2xl font-bold mb-6 text-slate-900">
        {title}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pages.map((page) => (
          <Link
            key={page.id}
            href={`${basePath}/${page.slug}`}
            className="group block"
          >
            <Card className="h-full transition-all duration-200 hover:shadow-md hover:border-primary/50 group-focus:ring-2 group-focus:ring-primary group-focus:ring-offset-2">
              <CardContent className="p-5">
                <h3 className="font-semibold text-slate-900 group-hover:text-primary transition-colors line-clamp-2 mb-2">
                  {page.title}
                </h3>
                <p className="text-sm text-slate-600 line-clamp-2 mb-3">
                  {page.description}
                </p>
                <span className="inline-flex items-center text-sm font-medium text-primary group-hover:gap-2 transition-all">
                  Read more
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </aside>
  );
}

/**
 * Compact version for sidebar placement
 */
export function RelatedPagesSidebar({
  pages,
  title = "You might also like",
  basePath = "/guide",
  className = "",
}: RelatedPagesProps) {
  if (pages.length === 0) return null;

  return (
    <aside className={`${className}`} aria-labelledby="sidebar-related-title">
      <h3 id="sidebar-related-title" className="font-semibold text-slate-900 mb-4">
        {title}
      </h3>
      <ul className="space-y-3">
        {pages.map((page) => (
          <li key={page.id}>
            <Link
              href={`${basePath}/${page.slug}`}
              className="block text-sm text-slate-600 hover:text-primary transition-colors line-clamp-2"
            >
              {page.title}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
