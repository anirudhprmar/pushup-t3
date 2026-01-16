import { generateFAQSchema, type FAQ, renderJsonLd } from "~/lib/seo/schemaGenerators";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "~/components/ui/accordion";

interface FAQSectionProps {
  faqs: FAQ[];
  title?: string;
  className?: string;
}

/**
 * FAQ section with FAQPage schema markup
 * Enables rich results in Google Search
 */
export function FAQSection({
  faqs,
  title = "Frequently Asked Questions",
  className = "",
}: FAQSectionProps) {
  if (faqs.length === 0) return null;

  const schema = generateFAQSchema(faqs);

  return (
    <section
      className={`py-12 ${className}`}
      aria-labelledby="faq-section-title"
    >
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: renderJsonLd(schema) }}
      />

      <h2
        id="faq-section-title"
        className="text-2xl md:text-3xl font-bold mb-8 text-slate-900"
      >
        {title}
      </h2>

      <Accordion type="single" collapsible className="space-y-3">
        {faqs.map((faq, index) => (
          <AccordionItem
            key={index}
            value={`faq-${index}`}
            className="border border-slate-200 rounded-lg px-6 py-1 bg-white hover:border-primary/30 transition-colors"
          >
            <AccordionTrigger className="text-left font-medium text-slate-900 hover:no-underline py-4">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-slate-600 leading-relaxed pb-4">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

/**
 * Inline FAQ for use within article content
 */
export function InlineFAQ({ faqs, className = "" }: Omit<FAQSectionProps, "title">) {
  if (faqs.length === 0) return null;

  const schema = generateFAQSchema(faqs);

  return (
    <div className={className}>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: renderJsonLd(schema) }}
      />

      <dl className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="border-l-4 border-primary/30 pl-4">
            <dt className="font-semibold text-slate-900 mb-2">{faq.question}</dt>
            <dd className="text-slate-600">{faq.answer}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
