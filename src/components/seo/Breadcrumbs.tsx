import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { generateBreadcrumbSchema, type BreadcrumbItem } from "~/lib/seo/schemaGenerators";
import { renderJsonLd } from "~/lib/seo/schemaGenerators";

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * Accessible breadcrumb navigation with schema.org markup
 * Implements BreadcrumbList structured data for rich search results
 */
export function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  if (items.length === 0) return null;

  const schema = generateBreadcrumbSchema(items);

  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: renderJsonLd(schema) }}
      />

      {/* Breadcrumb Navigation */}
      <nav
        aria-label="Breadcrumb"
        className={`flex items-center text-sm text-slate-600 ${className}`}
      >
        <ol className="flex items-center flex-wrap gap-1" role="list">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            const isHome = index === 0;

            return (
              <li key={item.url} className="flex items-center">
                {index > 0 && (
                  <ChevronRight
                    className="mx-2 h-4 w-4 text-slate-400 shrink-0"
                    aria-hidden="true"
                  />
                )}

                {isLast ? (
                  <span
                    className="font-medium text-slate-900 truncate max-w-[200px]"
                    aria-current="page"
                    title={item.name}
                  >
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.url}
                    className="flex items-center gap-1 hover:text-primary transition-colors"
                  >
                    {isHome && <Home className="h-4 w-4" aria-hidden="true" />}
                    <span className={isHome ? "sr-only" : ""}>{item.name}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
