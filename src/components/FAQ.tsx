"use client"

import React from 'react'
import { 
  Accordion, 
  AccordionItem, 
  AccordionTrigger, 
  AccordionContent 
} from "~/components/ui/accordion"

const faqData = [
  {
    id: "1",
    question: "What makes this habit tracker different from others?",
    answer: "Our minimalist tracker focuses on true commitment with a 365-day all-or-nothing approach. Miss one day and the counter resets, teaching real discipline. We emphasize simplicity, consistency, and visual progress tracking without overwhelming features."
  },
  {
    id: "2",
    question: "What happens if I miss a day?",
    answer: "If you miss logging a habit for even one day, your counter resets to zero. This strict approach isn't about punishment—it's about building genuine discipline and understanding that transformation requires daily commitment. Every day counts."
  },
  {
    id: "3",
    question: "Can I track multiple habits at once?",
    answer: "Yes! You can track multiple habits simultaneously. Each habit has its own 365-day journey, streak counter, and progress visualization. Focus on building a sustainable routine without overcommitting."
  },
  {
    id: "4",
    question: "How do I stay motivated for 365 days?",
    answer: "Our app provides daily visual feedback through progress charts, streak counters, and a full-year calendar view. You'll see your consistency compound over time, making motivation intrinsic. Small daily wins lead to massive transformation."
  },
  {
    id: "5",
    question: "Is there a mobile app available?",
    answer: "The web app is fully responsive and works seamlessly on mobile devices. Access your habit tracker anytime, anywhere through your mobile browser with a native app-like experience. No separate download needed."
  }
]

export default function FAQ() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-semibold mb-4 font-serif">
            Clear information to help you get{" "}
            <span className="text-primary">started with confidence</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know before starting your habit tracking journey
          </p>
        </div>

        {/* FAQ Accordion */}
        <Accordion type="single" collapsible className="space-y-4" defaultValue="1">
          {faqData.map((faq) => (
            <AccordionItem 
              key={faq.id} 
              value={faq.id}
              className="border border-border rounded-xl px-6 py-2 bg-white hover:border-primary/50 transition-colors"
            >
              <AccordionTrigger className="text-lg font-semibold text-foreground hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed h-full">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}