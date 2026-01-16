import {
  generateOrganizationSchema,
  generateWebSiteSchema,
  generateAppSchema,
  renderJsonLd,
} from "~/lib/seo/schemaGenerators";

/**
 * JSON-LD structured data for the landing page
 * Includes Organization, WebSite, and SoftwareApplication schemas
 * This is a server component to avoid hydration issues
 */
export function LandingPageSchema() {
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebSiteSchema();
  const appSchema = generateAppSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: renderJsonLd(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: renderJsonLd(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: renderJsonLd(appSchema) }}
      />
    </>
  );
}
