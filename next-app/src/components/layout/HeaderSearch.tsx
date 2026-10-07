'use client';
// ============================================
// Pro-Level Direct Header Search — Cake Connection
// Embedded directly in Header (No Popup Modal!)
// Instant Live Autocomplete, Trending Chips, Product Cards
// ============================================

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, TrendingUp, Sparkles, ChevronRight, Star } from 'lucide-react';
import { cn, formatPrice } from '@/utils';
import { useSearch } from '@/hooks/useSearch';

const TRENDING_TAGS = [
  'Chocolate',
  'Red Velvet',
  'Black Forest',
  'Truffle',
  'Butterscotch',
  'Fruit Cake',
  'Rasmalai',
  'Kitkat Cake',
];

interface HeaderSearchProps {
  idPrefix?: string;
  className?: string;
  placeholder?: string;
}

export function HeaderSearch({
  idPrefix = 'desktop',
  className = '',
  placeholder = 'Search fresh cakes, flavours...',
}: HeaderSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    suggestions,
    isLoading,
    getSuggestions,
    clearResults,
  } = useSearch();

  // Handle outside click to close dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced suggestion query
  useEffect(() => {
    if (query.trim().length >= 2) {
      getSuggestions(query.trim());
    } else {
      clearResults();
    }
  }, [query, getSuggestions, clearResults]);

  const handleSelectTag = (tag: string) => {
    setQuery(tag);
    setIsOpen(true);
    getSuggestions(tag);
    inputRef.current?.focus();
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    setIsOpen(false);
    router.push(`/cakes?search=${encodeURIComponent(query.trim())}`);
  };

  const handleClear = () => {
    setQuery('');
    clearResults();
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {/* Search Input Box with Pro-level Highlighter */}
      <form onSubmit={handleSearchSubmit} className="relative w-full">
        <div
          className={cn(
            'flex items-center gap-2.5 px-3.5 py-2 sm:py-2.5 rounded-full bg-white border-2 transition-all duration-300 shadow-xs',
            isOpen
              ? 'border-brand-rose ring-4 ring-brand-rose/15 shadow-md bg-white'
              : 'border-gray-200 hover:border-brand-rose/50 bg-gray-50/70 hover:bg-white'
          )}
        >
          {/* Magnifying Glass with subtle pulse on active */}
          <Search
            className={cn(
              'h-4 w-4 shrink-0 transition-colors duration-200',
              isOpen || query ? 'text-brand-rose' : 'text-gray-400'
            )}
          />

          {/* Direct Input */}
          <input
            ref={inputRef}
            id={`${idPrefix}-header-search-input`}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (!isOpen) setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setIsOpen(false);
            }}
            placeholder={placeholder}
            autoComplete="off"
            className="w-full text-xs sm:text-sm bg-transparent text-gray-900 placeholder:text-gray-400 focus:outline-none font-medium"
          />

          {/* Loading Spinner or Clear Button */}
          {isLoading ? (
            <div className="h-4 w-4 shrink-0 border-2 border-brand-rose border-t-transparent rounded-full animate-spin" />
          ) : query ? (
            <button
              type="button"
              onClick={handleClear}
              className="p-0.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : null}
        </div>
      </form>

      {/* ═══ PRO-LEVEL LIVE DROPDOWN (Directly below input) ═══ */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="absolute left-0 right-0 top-full mt-1.5 z-[350] bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden max-h-[75vh] overflow-y-auto"
          >
            {/* When Query is Empty -> Show Trending Cake Searches */}
            {!query.trim() && (
              <div className="p-4">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-400 mb-2.5">
                  <TrendingUp className="h-3.5 w-3.5 text-brand-rose" />
                  <span>Popular Cake Searches</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {TRENDING_TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleSelectTag(tag)}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-50 border border-gray-200 text-gray-700 hover:bg-rose-50 hover:text-brand-rose hover:border-brand-rose/40 transition-all cursor-pointer"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* When User has Typed -> Show Live Suggestions */}
            {query.trim().length > 0 && (
              <div>
                {suggestions && suggestions.length > 0 ? (
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-2 bg-gray-50/80 border-b border-gray-100 text-[11px] font-semibold text-gray-500">
                      <span>Matching Cakes ({suggestions.length})</span>
                      <span className="text-brand-rose">Press Enter to view all</span>
                    </div>

                    {/* Product rows */}
                    <div className="divide-y divide-gray-100">
                      {suggestions.slice(0, 6).map((product) => {
                        const firstVar = product.variants?.[0];
                        const price = (firstVar?.compareAtPrice && firstVar.compareAtPrice > 0)
                          ? firstVar.compareAtPrice
                          : (firstVar?.price || 449);
                        const weight = firstVar?.weight || '500g';
                        const firstImg = Array.isArray(product.images) && product.images.length > 0
                          ? (typeof product.images[0] === 'string' ? product.images[0] : product.images[0]?.url)
                          : '';
                        const img = firstImg || '/images/placeholder-cake.jpg';

                        return (
                          <Link
                            key={product.id}
                            href={`/cakes/${product.slug}`}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3.5 p-3 hover:bg-rose-50/50 transition-colors group cursor-pointer"
                          >
                            {/* Product Thumbnail (Enlarged & Reliable) */}
                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200/80 shadow-xs">
                              <img
                                src={img}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                  e.currentTarget.src = '/images/placeholder-cake.jpg';
                                }}
                              />
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs sm:text-sm font-semibold text-gray-900 truncate group-hover:text-brand-rose transition-colors">
                                {product.name}
                              </h4>
                              <div className="flex items-center gap-2 mt-0.5 text-[11px] text-gray-500">
                                <span>{weight}</span>
                                <span>•</span>
                                <span className="flex items-center gap-0.5 text-amber-500 font-semibold">
                                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                  {product.rating || 4.8}
                                </span>
                              </div>
                            </div>

                            {/* Price */}
                            <div className="text-right shrink-0">
                              <span className="text-sm font-bold text-brand-rose">
                                {formatPrice(price)}
                              </span>
                              <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-brand-rose group-hover:translate-x-0.5 transition-all ml-auto mt-0.5" />
                            </div>
                          </Link>
                        );
                      })}
                    </div>

                    {/* Footer View All CTA */}
                    <button
                      type="button"
                      onClick={() => handleSearchSubmit()}
                      className="w-full py-2.5 px-4 bg-gray-50 hover:bg-rose-50 text-brand-rose font-bold text-xs text-center border-t border-gray-100 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      View all results for &quot;{query}&quot; →
                    </button>
                  </div>
                ) : !isLoading ? (
                  <div className="p-6 text-center">
                    <p className="text-sm font-semibold text-gray-700">No cakes found for &quot;{query}&quot;</p>
                    <p className="text-xs text-gray-400 mt-1">Try searching for Chocolate, Red Velvet, or Butterscotch</p>
                    <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                      {['Chocolate', 'Red Velvet', 'Black Forest'].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => handleSelectTag(t)}
                          className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 hover:bg-brand-rose hover:text-white transition-colors"
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
