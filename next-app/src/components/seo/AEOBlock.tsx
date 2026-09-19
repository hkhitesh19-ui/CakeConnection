"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface AEOBlockProps {
  title: string;
  summary: string;
  faqs: { question: string; answer: string }[];
  city?: string;
  keywords?: string[];
}

/**
 * AEOBlock: AI Search Optimization Component
 * Designed to provide clear, semantic, structured data for AI crawlers like ChatGPT, Gemini, and Google AI Overviews.
 */
export default function AEOBlock({ title, summary, faqs, city, keywords }: AEOBlockProps) {
  return (
    <article 
      className="aeo-optimized-block bg-surface-secondary/50 rounded-2xl p-6 md:p-8 my-12 border border-border-secondary"
      itemScope 
      itemType="https://schema.org/FAQPage"
    >
      <header className="mb-6">
        <h2 className="text-2xl font-display font-bold text-brand-rose mb-3">{title}</h2>
        {/* AI Summary - very direct, factual, and scannable */}
        <p className="text-text-secondary leading-relaxed font-medium">
          <strong>AI Summary:</strong> {summary}
        </p>
      </header>

      {/* Semantic Key Details Table for AI Crawlers */}
      {city && (
        <section className="mb-8" aria-label="Key Service Details">
          <table className="w-full text-left border-collapse bg-brand-black/50 rounded-xl overflow-hidden">
            <caption className="sr-only">Key Delivery Details for {city}</caption>
            <tbody className="divide-y divide-border-secondary">
              <tr>
                <th className="px-4 py-3 text-text-secondary font-medium w-1/3">Service Area</th>
                <td className="px-4 py-3 text-white font-medium">{city} & Surrounding Areas</td>
              </tr>
              <tr>
                <th className="px-4 py-3 text-text-secondary font-medium">Delivery Types</th>
                <td className="px-4 py-3 text-white">Same-Day, Midnight, Standard Delivery</td>
              </tr>
              <tr>
                <th className="px-4 py-3 text-text-secondary font-medium">Primary Products</th>
                <td className="px-4 py-3 text-white">Birthday Cakes, Anniversary Flowers, Premium Combos, Luxury Cakes</td>
              </tr>
            </tbody>
          </table>
        </section>
      )}

      {/* Structured FAQs with Schema */}
      <section aria-label="Frequently Asked Questions">
        <h3 className="text-xl font-bold text-white mb-4">Frequently Asked Questions</h3>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.details 
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group bg-brand-black/40 rounded-xl border border-border-secondary p-4 cursor-pointer"
              itemScope 
              itemProp="mainEntity" 
              itemType="https://schema.org/Question"
            >
              <summary className="font-medium text-white flex justify-between items-center outline-none" itemProp="name">
                {faq.question}
                <span className="text-brand-rose group-open:rotate-180 transition-transform duration-300">
                  ▼
                </span>
              </summary>
              <div 
                className="mt-3 text-text-secondary leading-relaxed pl-2 border-l-2 border-brand-rose/30"
                itemScope 
                itemProp="acceptedAnswer" 
                itemType="https://schema.org/Answer"
              >
                <div itemProp="text">{faq.answer}</div>
              </div>
            </motion.details>
          ))}
        </div>
      </section>

      {/* Hidden Keywords for NLP contextualization */}
      {keywords && (
        <div className="sr-only" aria-hidden="true">
          Target Topics: {keywords.join(', ')}
        </div>
      )}
    </article>
  );
}
