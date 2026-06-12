'use client';
// ============================================
// Mega Menu Component — Cake Connection
// Full-width luxury mega dropdown
// ============================================

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { MegaMenuSection } from '@/config/site.config';

interface MegaMenuProps {
  sections: MegaMenuSection[];
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function MegaMenu({ sections, onMouseEnter, onMouseLeave }: MegaMenuProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.98 }}
      transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-[100]"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Arrow pointer */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-surface-secondary rotate-45 border-l border-t border-border-secondary" />

      <div
        className="relative bg-surface-secondary/95 backdrop-blur-xl border border-border-secondary rounded-2xl shadow-2xl shadow-black/40 overflow-hidden"
        style={{ minWidth: sections.length > 1 ? '700px' : '360px' }}
      >
        {/* Rose gold top accent line */}
        <div className="h-[2px] bg-gradient-to-r from-transparent via-brand-rose to-transparent" />

        <div className="p-6">
          <div
            className="grid gap-8"
            style={{ gridTemplateColumns: `repeat(${sections.length}, 1fr)` }}
          >
            {sections.map((section) => (
              <div key={section.title}>
                {/* Section Title */}
                <h3 className="font-display text-sm font-semibold text-brand-rose uppercase tracking-wider mb-4 pb-2 border-b border-border-primary">
                  {section.title}
                </h3>

                {/* Items */}
                <ul className="space-y-1">
                  {section.items.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="group flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-surface-glass-light transition-all duration-300"
                      >
                        <div className="flex-1 min-w-0">
                          <span className="block text-sm font-medium text-text-primary group-hover:text-brand-rose transition-colors">
                            {item.label}
                          </span>
                          {item.description && (
                            <span className="block text-xs text-text-muted mt-0.5 line-clamp-2">
                              {item.description}
                            </span>
                          )}
                        </div>
                        <ArrowRight
                          size={14}
                          className="mt-1 text-text-muted opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-6 pt-4 border-t border-border-secondary">
            <div className="flex items-center justify-between">
              <p className="text-xs text-text-muted">
                🚚 Free delivery on orders above ₹999
              </p>
              <Link
                href="/cakes"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-rose hover:text-brand-rose-light transition-colors group"
              >
                View All Products
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}


