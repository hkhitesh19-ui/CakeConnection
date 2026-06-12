'use client';
// ============================================
// AI-Powered Search Overlay — Cake Connection
// ============================================

import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Search,
  X,
  TrendingUp,
  Clock,
  Star,
  Sparkles,
  Cake,
  Flower2,
  Gift,
  Tag,
  BadgePercent,
} from 'lucide-react';
import { useSearch, type SearchFilters } from '@/hooks/useSearch';
import { formatPrice, cn } from '@/utils';
import type { Product } from '@/types';

// ============================================
// Props & Constants
// ============================================

interface SearchOverlayProps {
  onClose: () => void;
}

const trendingSearches = [
  'Chocolate Cake',
  'Red Velvet',
  'Birthday Bouquet',
  'Cake + Flowers Combo',
  'Anniversary Special',
  'Black Forest',
  'Eggless Cake',
  'Rose Bouquet',
];

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  cakes: <Cake size={14} />,
  flowers: <Flower2 size={14} />,
  combos: <Gift size={14} />,
};

const CATEGORY_EMOJI: Record<string, string> = {
  cakes: '🎂',
  flowers: '💐',
  combos: '🎁',
};

// ============================================
// Animation Variants
// ============================================

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const panelVariants = {
  hidden: { opacity: 0, y: -30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -30, scale: 0.95, transition: { duration: 0.2 } },
};

const chipVariants = {
  hidden: { opacity: 0, scale: 0.8, x: -10 },
  visible: { opacity: 1, scale: 1, x: 0 },
  exit: { opacity: 0, scale: 0.8 },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.3 },
  }),
};

const listItemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.03, duration: 0.2 },
  }),
};

// ============================================
// Helper: Highlight matching text
// ============================================

function HighlightedText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;

  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 1);

  if (terms.length === 0) return <>{text}</>;

  // Build a regex that matches any of the search terms
  const escapedTerms = terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(`(${escapedTerms.join('|')})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <span key={i} className="font-bold text-brand-rose">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

// ============================================
// Helper: Get discount percentage
// ============================================

function getDiscount(price: number, compareAt?: number): number {
  if (!compareAt || compareAt <= price) return 0;
  return Math.round(((compareAt - price) / compareAt) * 100);
}

// ============================================
// Sub-component: Filter Chips
// ============================================

function FilterChips({ filters }: { filters: SearchFilters }) {
  const chips: { key: string; label: string; icon: React.ReactNode }[] = [];

  if (filters.category) {
    const emoji = CATEGORY_EMOJI[filters.category] || '📦';
    chips.push({
      key: 'category',
      label: filters.category.charAt(0).toUpperCase() + filters.category.slice(1),
      icon: <span>{emoji}</span>,
    });
  }

  if (filters.maxPrice) {
    chips.push({
      key: 'maxPrice',
      label: `Under ₹${filters.maxPrice}`,
      icon: <Tag size={13} />,
    });
  }

  if (filters.minPrice) {
    chips.push({
      key: 'minPrice',
      label: `Above ₹${filters.minPrice}`,
      icon: <Tag size={13} />,
    });
  }

  if (filters.isBestseller) {
    chips.push({ key: 'bestseller', label: 'Bestseller', icon: <Star size={13} /> });
  }

  if (filters.isEggless) {
    chips.push({ key: 'eggless', label: 'Eggless', icon: <span>🥚</span> });
  }

  if (filters.isNewArrival) {
    chips.push({ key: 'newArrival', label: 'New Arrival', icon: <Sparkles size={13} /> });
  }

  if (filters.tags && filters.tags.length > 0) {
    filters.tags.forEach((tag) => {
      chips.push({
        key: `tag-${tag}`,
        label: tag.charAt(0).toUpperCase() + tag.slice(1),
        icon: <span>🏷️</span>,
      });
    });
  }

  if (filters.weight) {
    chips.push({ key: 'weight', label: filters.weight, icon: <span>⚖️</span> });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-3 px-1">
      <AnimatePresence>
        {chips.map((chip, i) => (
          <motion.span
            key={chip.key}
            variants={chipVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ delay: i * 0.05 }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-brand-rose/15 text-brand-rose border border-brand-rose/30"
          >
            {chip.icon}
            {chip.label}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// Sub-component: Product Card (Search Result)
// ============================================

function SearchProductCard({
  product,
  index,
  onClick,
}: {
  product: Product;
  index: number;
  onClick: () => void;
}) {
  const firstImage = product.images?.[0];
  const firstVariant = product.variants?.[0];
  const price = firstVariant?.price || 0;
  const compareAt = firstVariant?.compareAtPrice;
  const discount = getDiscount(price, compareAt);

  return (
    <motion.button
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      onClick={onClick}
      className="group text-left bg-surface-secondary border border-border-secondary rounded-xl overflow-hidden hover:border-brand-rose/40 hover:shadow-lg transition-all duration-300 cursor-pointer"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-surface-tertiary">
        {firstImage ? (
          <img
            src={firstImage.url}
            alt={firstImage.alt || product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-muted">
            <Cake size={32} />
          </div>
        )}

        {/* Discount Badge */}
        {discount > 0 && (
          <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold rounded-full bg-brand-rose text-white">
            {discount}% OFF
          </span>
        )}

        {/* Category Badge */}
        <span className="absolute top-2 right-2 px-2 py-0.5 text-[10px] font-medium rounded-full bg-black/50 text-white backdrop-blur-sm">
          {CATEGORY_EMOJI[product.category] || '📦'} {product.category}
        </span>
      </div>

      {/* Info */}
      <div className="p-3">
        <h4 className="text-sm font-medium text-text-primary line-clamp-2 leading-snug group-hover:text-brand-rose transition-colors">
          {product.name}
        </h4>

        {/* Rating */}
        {product.rating > 0 && (
          <div className="flex items-center gap-1 mt-1.5">
            <Star size={12} className="text-amber-400 fill-amber-400" />
            <span className="text-xs text-text-secondary">
              {product.rating.toFixed(1)}
            </span>
            {product.reviewCount > 0 && (
              <span className="text-xs text-text-muted">
                ({product.reviewCount})
              </span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-sm font-bold text-brand-rose">
            {formatPrice(price)}
          </span>
          {compareAt && compareAt > price && (
            <span className="text-xs text-text-muted line-through">
              {formatPrice(compareAt)}
            </span>
          )}
        </div>
      </div>
    </motion.button>
  );
}

// ============================================
// Main Component: SearchOverlay
// ============================================

export function SearchOverlay({ onClose }: SearchOverlayProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  const {
    results,
    suggestions,
    recentSearches,
    isLoading,
    activeFilters,
    search,
    getSuggestions,
    addRecentSearch,
    clearRecentSearches,
    clearResults,
  } = useSearch();

  // Auto-focus on mount & ESC to close
  useEffect(() => {
    inputRef.current?.focus();
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Handle text change → suggestions
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setHasSearched(false);

    if (value.trim().length >= 2) {
      getSuggestions(value);
    }
  };

  // Handle search submit
  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    search(trimmed);
    addRecentSearch(trimmed);
    setHasSearched(true);
    setCategoryFilter(null);
  };

  // Handle suggestion click → navigate to product
  const handleSuggestionClick = (product: Product) => {
    addRecentSearch(product.name);
    router.push(`/${product.category}/${product.slug}`);
    onClose();
  };

  // Handle product card click → navigate
  const handleProductClick = (product: Product) => {
    router.push(`/${product.category}/${product.slug}`);
    onClose();
  };

  // Handle trending/recent search click
  const handleQuickSearch = (term: string) => {
    setQuery(term);
    search(term);
    addRecentSearch(term);
    setHasSearched(true);
    setCategoryFilter(null);
  };

  // Handle clear
  const handleClear = () => {
    setQuery('');
    setHasSearched(false);
    setCategoryFilter(null);
    clearResults();
    inputRef.current?.focus();
  };

  // Remove a single recent search
  const removeRecentSearch = (term: string) => {
    const updated = recentSearches.filter((s) => s !== term);
    // We need to update localStorage directly since hook doesn't expose individual removal
    try {
      localStorage.setItem('cake-connection-recent-searches', JSON.stringify(updated));
    } catch { /* ignore */ }
    // Force re-render by clearing and re-searching
    clearRecentSearches();
    updated.forEach((s) => addRecentSearch(s));
  };

  // Filter results by category tab
  const filteredResults = useMemo(() => {
    if (!categoryFilter || categoryFilter === 'all') return results;
    return results.filter((p) => p.category === categoryFilter);
  }, [results, categoryFilter]);

  // Category counts for tabs
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: results.length };
    results.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [results]);

  // Determine what to show
  const showEmpty = !query.trim() && !hasSearched;
  const showSuggestions = query.trim().length >= 2 && !hasSearched && suggestions.length > 0;
  const showResults = hasSearched;
  const showNoResults = hasSearched && !isLoading && results.length === 0;

  // Check if any filter is active
  const hasActiveFilters =
    activeFilters.category ||
    activeFilters.maxPrice ||
    activeFilters.minPrice ||
    activeFilters.isBestseller ||
    activeFilters.isEggless ||
    activeFilters.isNewArrival ||
    (activeFilters.tags && activeFilters.tags.length > 0) ||
    activeFilters.weight;

  return (
    <motion.div
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-[500] flex items-start justify-center overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        variants={panelVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="w-full max-w-2xl mx-4 mt-[8vh] sm:mt-[12vh] mb-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ─────────────── Search Input ─────────────── */}
        <form onSubmit={handleSearch} className="relative">
          <Search
            size={22}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Search cakes, flowers, combos..."
            className="w-full pl-14 pr-24 py-5 bg-surface-secondary/95 backdrop-blur-xl text-text-primary text-lg rounded-2xl border border-border-secondary focus:border-brand-rose focus:outline-none transition-colors placeholder:text-text-muted"
            id="search-input"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1.5 text-text-muted hover:text-text-primary transition-colors"
                aria-label="Clear search"
              >
                <X size={18} />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-text-muted hover:text-text-primary transition-colors"
              aria-label="Close search"
            >
              <X size={20} />
            </button>
          </div>
        </form>

        {/* ─────────────── Active Filter Chips ─────────────── */}
        {hasActiveFilters && <FilterChips filters={activeFilters} />}

        {/* ─────────────── Content Area ─────────────── */}
        <div className="mt-4">
          <AnimatePresence mode="wait">
            {/* ═══ EMPTY STATE: Recent + Trending ═══ */}
            {showEmpty && (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div className="p-5 bg-surface-secondary/90 backdrop-blur-xl rounded-2xl border border-border-secondary mb-3">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 text-text-muted text-sm">
                        <Clock size={16} />
                        <span>Recent Searches</span>
                      </div>
                      <button
                        onClick={clearRecentSearches}
                        className="text-xs text-text-muted hover:text-brand-rose transition-colors"
                      >
                        Clear All
                      </button>
                    </div>
                    <div className="space-y-1">
                      {recentSearches.slice(0, 5).map((term, i) => (
                        <motion.div
                          key={term}
                          custom={i}
                          variants={listItemVariants}
                          initial="hidden"
                          animate="visible"
                          className="flex items-center justify-between group"
                        >
                          <button
                            onClick={() => handleQuickSearch(term)}
                            className="flex items-center gap-3 py-2 px-2 text-sm text-text-secondary hover:text-text-primary transition-colors flex-1 text-left rounded-lg hover:bg-surface-tertiary"
                          >
                            <Clock size={14} className="text-text-muted flex-shrink-0" />
                            <span>{term}</span>
                          </button>
                          <button
                            onClick={() => removeRecentSearch(term)}
                            className="p-1.5 text-text-muted hover:text-text-primary opacity-0 group-hover:opacity-100 transition-all"
                            aria-label={`Remove "${term}"`}
                          >
                            <X size={14} />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trending Searches */}
                <div className="p-5 bg-surface-secondary/90 backdrop-blur-xl rounded-2xl border border-border-secondary">
                  <div className="flex items-center gap-2 text-text-muted text-sm mb-3">
                    <TrendingUp size={16} />
                    <span>Trending Searches</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {trendingSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => handleQuickSearch(term)}
                        className="px-4 py-2 text-sm text-text-secondary hover:text-text-primary bg-surface-tertiary hover:bg-surface-elevated rounded-full transition-all duration-200 hover:scale-105"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ═══ SUGGESTIONS (as user types) ═══ */}
            {showSuggestions && (
              <motion.div
                key="suggestions"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-surface-secondary/90 backdrop-blur-xl rounded-2xl border border-border-secondary overflow-hidden"
              >
                <div className="p-2">
                  {suggestions.map((product, i) => (
                    <motion.button
                      key={product.id}
                      custom={i}
                      variants={listItemVariants}
                      initial="hidden"
                      animate="visible"
                      onClick={() => handleSuggestionClick(product)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-xl hover:bg-surface-tertiary transition-colors group"
                    >
                      {/* Product thumbnail */}
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-surface-tertiary flex-shrink-0">
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0].url}
                            alt=""
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-text-muted">
                            {CATEGORY_ICONS[product.category] || <Search size={14} />}
                          </div>
                        )}
                      </div>

                      {/* Product info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-text-primary group-hover:text-brand-rose transition-colors truncate">
                          <HighlightedText text={product.name} query={query} />
                        </p>
                        {product.variants?.[0] && (
                          <p className="text-xs text-text-muted mt-0.5">
                            {formatPrice(product.variants[0].price)}
                          </p>
                        )}
                      </div>

                      {/* Category badge */}
                      <span className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-text-muted bg-surface-tertiary rounded-full flex-shrink-0">
                        {CATEGORY_ICONS[product.category]}
                        <span className="capitalize">{product.category}</span>
                      </span>
                    </motion.button>
                  ))}
                </div>

                {/* Search for full query hint */}
                <button
                  onClick={() => handleSearch()}
                  className="w-full flex items-center gap-3 px-6 py-3 text-sm text-text-muted hover:text-brand-rose border-t border-border-secondary hover:bg-surface-tertiary transition-colors"
                >
                  <Search size={16} />
                  <span>
                    Search for &ldquo;<span className="text-text-primary font-medium">{query}</span>&rdquo;
                  </span>
                </button>
              </motion.div>
            )}

            {/* ═══ LOADING ═══ */}
            {isLoading && hasSearched && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-8 bg-surface-secondary/90 backdrop-blur-xl rounded-2xl border border-border-secondary"
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-2 border-brand-rose/30 border-t-brand-rose rounded-full animate-spin" />
                  <p className="text-sm text-text-muted">Searching products...</p>
                </div>
              </motion.div>
            )}

            {/* ═══ SEARCH RESULTS ═══ */}
            {showResults && !isLoading && results.length > 0 && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                ref={resultsRef}
                className="bg-surface-secondary/90 backdrop-blur-xl rounded-2xl border border-border-secondary overflow-hidden"
              >
                {/* Result count & category filter tabs */}
                <div className="p-4 pb-0">
                  <p className="text-sm text-text-muted mb-3">
                    Found{' '}
                    <span className="text-text-primary font-semibold">
                      {results.length}
                    </span>{' '}
                    product{results.length !== 1 ? 's' : ''} for &ldquo;
                    <span className="text-text-primary">{query}</span>&rdquo;
                  </p>

                  {/* Category Quick Filter Tabs */}
                  <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
                    {['all', 'cakes', 'flowers', 'combos']
                      .filter((cat) => cat === 'all' || (categoryCounts[cat] || 0) > 0)
                      .map((cat) => {
                        const isActive =
                          cat === 'all'
                            ? !categoryFilter || categoryFilter === 'all'
                            : categoryFilter === cat;
                        const count = categoryCounts[cat] || 0;
                        return (
                          <button
                            key={cat}
                            onClick={() => setCategoryFilter(cat === 'all' ? null : cat)}
                            className={cn(
                              'flex items-center gap-1.5 px-4 py-1.5 text-sm rounded-full border transition-all duration-200 whitespace-nowrap flex-shrink-0',
                              isActive
                                ? 'bg-brand-rose/15 text-brand-rose border-brand-rose/30 font-medium'
                                : 'bg-surface-tertiary text-text-secondary border-transparent hover:bg-surface-elevated hover:text-text-primary'
                            )}
                          >
                            {cat !== 'all' && CATEGORY_ICONS[cat]}
                            <span className="capitalize">{cat}</span>
                            <span
                              className={cn(
                                'text-xs',
                                isActive ? 'text-brand-rose/70' : 'text-text-muted'
                              )}
                            >
                              ({count})
                            </span>
                          </button>
                        );
                      })}
                  </div>
                </div>

                {/* Products Grid */}
                <div className="p-4 pt-1 max-h-[50vh] overflow-y-auto scrollbar-thin">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {filteredResults.map((product, i) => (
                      <SearchProductCard
                        key={product.id}
                        product={product}
                        index={i}
                        onClick={() => handleProductClick(product)}
                      />
                    ))}
                  </div>

                  {/* Filtered empty state */}
                  {filteredResults.length === 0 && categoryFilter && (
                    <div className="py-8 text-center">
                      <p className="text-sm text-text-muted">
                        No {categoryFilter} found for this search.
                      </p>
                      <button
                        onClick={() => setCategoryFilter(null)}
                        className="mt-2 text-sm text-brand-rose hover:underline"
                      >
                        Show all results
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ═══ NO RESULTS ═══ */}
            {showNoResults && (
              <motion.div
                key="no-results"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="p-6 bg-surface-secondary/90 backdrop-blur-xl rounded-2xl border border-border-secondary text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-surface-tertiary flex items-center justify-center">
                  <Search size={28} className="text-text-muted" />
                </div>
                <p className="text-text-primary font-medium mb-1">
                  No products found for &ldquo;{query}&rdquo;
                </p>
                <p className="text-sm text-text-muted mb-4">
                  Try a different search or browse our popular picks:
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {trendingSearches.slice(0, 6).map((term) => (
                    <button
                      key={term}
                      onClick={() => handleQuickSearch(term)}
                      className="px-4 py-2 text-sm text-text-secondary hover:text-text-primary bg-surface-tertiary hover:bg-surface-elevated rounded-full transition-all duration-200 hover:scale-105"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ─────────────── AI Powered Badge ─────────────── */}
        <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-text-muted/60">
          <Sparkles size={12} />
          <span>AI-powered smart search</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

