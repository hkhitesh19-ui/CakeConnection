'use client';
// ============================================
// Mega Menu Component — Cake Connection
// Full-width luxury mega dropdown (Winni Style)
// ============================================

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight } from 'lucide-react';
import type { NavCategory } from '@/config/site.config';
import { cn } from '@/utils';

interface MegaMenuProps {
  navItem: NavCategory;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function MegaMenu({ navItem, onMouseEnter, onMouseLeave }: MegaMenuProps) {
  const sections = navItem.megaMenu || [];
  const trending = navItem.trendingLinks;
  const promos = navItem.promotions;

  if (sections.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.98 }}
      transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="absolute top-full left-0 right-0 w-full flex justify-center mt-0 z-[100]"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="relative bg-surface-secondary/95 backdrop-blur-xl border border-t-0 border-border-secondary rounded-b-2xl shadow-2xl shadow-black/40 overflow-hidden flex w-max max-w-[95vw]">
        {/* Rose gold top accent line */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-brand-rose/20 via-brand-rose to-brand-rose/20" />

        {/* ── LEFT SECTION: Navigation Columns ── */}
        <div className="flex-1 p-6 md:p-8 min-w-[500px]">
          <div
            className="grid gap-x-8 gap-y-6"
            style={{ gridTemplateColumns: `repeat(${sections.length}, minmax(140px, 1fr))` }}
          >
            {sections.map((section) => (
              <div key={section.title}>
                {/* Section Title */}
                <h3 className="font-display text-sm font-bold text-text-primary mb-4 pb-2 border-b border-border-primary whitespace-nowrap">
                  {section.title}
                </h3>

                {/* Items */}
                <ul className="space-y-1">
                  {section.items.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="group flex items-center px-2 py-1.5 -ml-2 rounded-lg hover:bg-surface-glass-light transition-colors"
                      >
                        <div className="w-1 h-3 rounded-full bg-brand-rose/50 mr-2 scale-y-0 group-hover:scale-y-100 transition-transform origin-center" />
                        <span className="text-[13px] font-medium text-text-secondary group-hover:text-brand-rose transition-colors">
                          {item.label}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom CTA within left section */}
          <div className="mt-8 pt-4 border-t border-border-secondary flex items-center justify-between">
             <p className="text-xs text-text-muted">
               🚚 Free Delivery all Over Vadodara | Same Day Delivery in Vadodara
             </p>
             <Link
               href={navItem.href}
               className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-rose hover:text-brand-rose-light transition-colors group"
             >
               View All {navItem.label}
               <ArrowRight
                 size={14}
                 className="group-hover:translate-x-1 transition-transform"
               />
             </Link>
          </div>
        </div>

        {/* ── MIDDLE SECTION: Trending Links ── */}
        {trending && (
          <div className="w-56 p-6 md:p-8 bg-surface-glass-light border-l border-border-secondary shrink-0">
            <h3 className="font-display text-sm font-bold text-brand-rose mb-4 pb-2 border-b border-brand-rose/20 whitespace-nowrap">
              {trending.title}
            </h3>
            <ul className="space-y-1">
              {trending.items.map((item, idx) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="group flex items-center justify-between px-3 py-2 -mx-3 rounded-lg hover:bg-surface-secondary transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-brand-rose/50" />
                      <span className={cn(
                        "text-[13px] transition-colors",
                        idx >= trending.items.length - 2 ? "font-bold text-text-primary" : "font-medium text-text-secondary group-hover:text-brand-rose"
                      )}>
                        {item.label}
                      </span>
                    </div>
                    {idx >= trending.items.length - 2 && (
                       <ChevronRight size={14} className="text-text-muted group-hover:text-brand-rose group-hover:translate-x-0.5 transition-all" />
                    )}
                  </Link>
                  {/* Separator before "All Cakes" and "Best Sellers" */}
                  {idx === trending.items.length - 3 && (
                    <div className="my-3 h-px bg-border-secondary ml-3" />
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ── RIGHT SECTION: Promotions ── */}
        {promos && (
          <div className="w-64 p-6 md:p-8 bg-brand-black shrink-0 flex flex-col gap-5 justify-center border-l border-border-secondary">
            {promos.map((promo, idx) => (
              <Link
                key={idx}
                href={promo.href}
                className="block group relative rounded-xl overflow-hidden shadow-lg shadow-black/20"
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-surface-secondary">
                  <img
                    src={promo.image}
                    alt={promo.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                <div className="absolute inset-x-0 bottom-0 p-3 bg-white/95 backdrop-blur-md translate-y-0 text-center">
                  <span className="text-[11px] font-bold text-brand-black uppercase tracking-[0.15em] flex items-center justify-center gap-1.5">
                    {promo.title}
                    <ArrowRight size={12} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-brand-rose" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
