"use client";

// ============================================
// Flowers Category Page — Cake Connection
// ============================================

import { useState, useMemo, useCallback, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import {
  Star,
  Heart,
  ShoppingBag,
  SlidersHorizontal,
  ArrowUpDown,
  X,
  ChevronRight,
  Home,
  Search,
  PackageOpen,
} from 'lucide-react';
import { Container } from '@/components/ui';
import { SEOHead } from '@/components/seo/SEOHead';
import { cn, formatPrice, getDiscountPercent } from '@/utils';
import { flowerProducts } from '@/data/products';
import { useCartStore, useWishlistStore, useUIStore } from '@/stores';
import type { Product } from '@/types';

// ── Constants ────────────────────────────────

const PRICE_RANGES = [
  { value: '0-500', label: 'Under ₹500', min: 0, max: 500 },
  { value: '500-999', label: '₹500 – ₹999', min: 500, max: 999 },
  { value: '999-1499', label: '₹999 – ₹1,499', min: 999, max: 1499 },
  { value: '1500-above', label: 'Above ₹1,500', min: 1500, max: Infinity },
];

const SORT_OPTIONS = [
  { value: 'popular', label: 'Popular' },
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'newest', label: 'Newest' },
  { value: 'rating', label: 'Top Rated' },
];

function getSubcategories(): { value: string; label: string }[] {
  const subs = [...new Set(flowerProducts.map((p) => p.subcategory))];
  return subs.map((s) => ({
    value: s,
    label: s
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' '),
  }));
}

// ── Animation Variants ───────────────────────

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
};

const slideUp = {
  hidden: { y: '100%' },
  visible: { y: 0, transition: { type: 'spring', damping: 30, stiffness: 300 } },
  exit: { y: '100%', transition: { duration: 0.25 } },
} as const;


// ── Product Card ─────────────────────────────

function ProductCard({ product, index }: { product: Product; index: number }) {
  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist(product.id));
  const addToast = useUIStore((s) => s.addToast);

  const defaultVariant = product.variants[0];
  const discount = defaultVariant.compareAtPrice
    ? getDiscountPercent(defaultVariant.price, defaultVariant.compareAtPrice)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      variantId: defaultVariant.id,
      name: product.name,
      image: product.images[0]?.url || '',
      weight: defaultVariant.weight,
      price: defaultVariant.price,
      quantity: 1,
    });
    addToast({ type: 'success', message: `${product.name} added to cart` });
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({
      productId: product.id,
      name: product.name,
      image: product.images[0]?.url || '',
      price: defaultVariant.price,
      addedAt: new Date().toISOString(),
    });
  };

  return (
    <motion.article variants={cardVariants} layout>
      <Link
        href={`/flowers/${product.slug}`}
        className="group relative flex flex-col rounded-2xl border border-border-secondary bg-surface-secondary overflow-hidden transition-all duration-500 hover:border-brand-rose/40 hover:shadow-[0_0_30px_rgba(183,110,121,0.15)] h-full"
      >
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-surface-tertiary">
          <img
            src={product.images[0]?.url}
            alt={product.images[0]?.alt || product.name}
            loading={index < 4 ? 'eager' : 'lazy'}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isBestseller && (
              <span className="rounded-full bg-brand-rose/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                Bestseller
              </span>
            )}
            {product.isNewArrival && (
              <span className="rounded-full bg-emerald-600/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                New
              </span>
            )}
            {discount > 0 && (
              <span className="rounded-full bg-brand-red/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                {discount}% OFF
              </span>
            )}
          </div>

          {/* Wishlist */}
          <button
            onClick={handleWishlistToggle}
            aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-surface-primary/70 backdrop-blur-sm border border-border-secondary transition-all duration-300 hover:bg-surface-primary hover:border-brand-rose/50 hover:scale-110 cursor-pointer"
          >
            <Heart
              className={cn(
                'h-4 w-4 transition-colors duration-300',
                isInWishlist ? 'fill-brand-rose text-brand-rose' : 'text-text-secondary'
              )}
            />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-4 sm:p-5">
          {/* Rating */}
          <div className="mb-2 flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    'h-3.5 w-3.5',
                    i < Math.floor(product.rating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'fill-surface-tertiary text-surface-tertiary'
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-text-muted">
              {product.rating} ({product.reviewCount})
            </span>
          </div>

          {/* Name */}
          <h3 className="font-display text-lg font-semibold text-text-primary leading-tight line-clamp-2">
            {product.name}
          </h3>
          <p className="mt-1 text-xs font-medium text-text-muted uppercase tracking-wide">
            {defaultVariant.weight} • Fresh Flowers
          </p>

          {/* Price */}
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-xl font-bold text-brand-rose">
              {formatPrice(defaultVariant.price)}
            </span>
            {defaultVariant.compareAtPrice && (
              <span className="text-sm text-text-muted line-through">
                {formatPrice(defaultVariant.compareAtPrice)}
              </span>
            )}
          </div>

          {/* Add to Cart */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleAddToCart}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-rose px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:bg-brand-rose-dark hover:shadow-brand-rose/30 cursor-pointer"
          >
            <ShoppingBag className="h-4 w-4" />
            Add to Cart
          </motion.button>
        </div>
      </Link>
    </motion.article>
  );
}

// ── Filter Checkbox ──────────────────────────

function FilterCheckbox({
  label,
  checked,
  onChange,
  count,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
  count?: number;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group/check py-1">
      <div
        className={cn(
          'h-4.5 w-4.5 rounded border-2 flex items-center justify-center transition-all duration-200',
          checked
            ? 'bg-brand-rose border-brand-rose'
            : 'border-text-muted/40 group-hover/check:border-brand-rose/60'
        )}
      >
        {checked && (
          <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span className="text-sm text-text-secondary group-hover/check:text-text-primary transition-colors flex-1">
        {label}
      </span>
      {count !== undefined && (
        <span className="text-xs text-text-muted">({count})</span>
      )}
    </label>
  );
}

// ── Filter Section Wrapper ───────────────────

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="py-4 border-b border-border-secondary last:border-b-0">
      <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-text-muted mb-3">
        {title}
      </h4>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

// ── Sidebar Filters ──────────────────────────

function FilterSidebar({
  selectedPriceRanges,
  selectedSubcategories,
  onTogglePriceRange,
  onToggleSubcategory,
  onClearAll,
  activeFilterCount,
}: {
  selectedPriceRanges: string[];
  selectedSubcategories: string[];
  onTogglePriceRange: (v: string) => void;
  onToggleSubcategory: (v: string) => void;
  onClearAll: () => void;
  activeFilterCount: number;
}) {
  const subcategories = getSubcategories();

  return (
    <aside className="hidden lg:block w-72 shrink-0">
      <div className="sticky top-28 glass rounded-2xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-brand-rose" />
            <h3 className="font-display text-lg font-semibold text-text-primary">Filters</h3>
            {activeFilterCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-rose text-[10px] font-bold text-white">
                {activeFilterCount}
              </span>
            )}
          </div>
          {activeFilterCount > 0 && (
            <button
              onClick={onClearAll}
              className="text-xs text-brand-rose hover:text-brand-rose-light transition-colors cursor-pointer"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Subcategory */}
        <FilterGroup title="Type">
          {subcategories.map((opt) => (
            <FilterCheckbox
              key={opt.value}
              label={opt.label}
              checked={selectedSubcategories.includes(opt.value)}
              onChange={() => onToggleSubcategory(opt.value)}
            />
          ))}
        </FilterGroup>

        {/* Price Range */}
        <FilterGroup title="Price Range">
          {PRICE_RANGES.map((opt) => (
            <FilterCheckbox
              key={opt.value}
              label={opt.label}
              checked={selectedPriceRanges.includes(opt.value)}
              onChange={() => onTogglePriceRange(opt.value)}
            />
          ))}
        </FilterGroup>
      </div>
    </aside>
  );
}

// ── Mobile Sheet ─────────────────────────────

function MobileSheet({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[500]"
            onClick={onClose}
          />
          <motion.div
            variants={slideUp}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed bottom-0 left-0 right-0 z-[501] max-h-[85vh] rounded-t-3xl bg-surface-primary border-t border-border-secondary overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border-secondary shrink-0">
              <h3 className="font-display text-lg font-semibold text-text-primary">{title}</h3>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-secondary text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {/* Content */}
            <div className="overflow-y-auto flex-1 p-4">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ── Main Page Component ──────────────────────

function FlowersPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [mobileSortOpen, setMobileSortOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Parse URL params
  const selectedPriceRanges = searchParams.getAll('price');
  const selectedSubcategories = searchParams.getAll('subcategory');
  const sortBy = searchParams.get('sort') || 'popular';

  // URL updater helper
  const updateParam = useCallback(
    (key: string, values: string[]) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete(key);
      values.forEach((v) => params.append(key, v));
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname]
  );

  const toggleArrayParam = useCallback(
    (key: string, value: string, current: string[]) => {
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      updateParam(key, next);
    },
    [updateParam]
  );

  const onTogglePriceRange = (v: string) => toggleArrayParam('price', v, selectedPriceRanges);
  const onToggleSubcategory = (v: string) => toggleArrayParam('subcategory', v, selectedSubcategories);

  const onSetSort = (v: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (v === 'popular') params.delete('sort');
    else params.set('sort', v);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    setMobileSortOpen(false);
  };

  const onClearAll = () => {
    router.replace(pathname, { scroll: false });
    setSearchQuery('');
  };

  const activeFilterCount = selectedPriceRanges.length + selectedSubcategories.length;

  // Filter & sort products
  const filteredProducts = useMemo(() => {
    let result = [...flowerProducts].filter((p) => p.isAvailable);

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.tags.some((t) => t.includes(q))
      );
    }

    // Subcategory
    if (selectedSubcategories.length > 0) {
      result = result.filter((p) => selectedSubcategories.includes(p.subcategory));
    }

    // Price range
    if (selectedPriceRanges.length > 0) {
      const ranges = selectedPriceRanges.map((v) => PRICE_RANGES.find((r) => r.value === v)!).filter(Boolean);
      result = result.filter((p) => {
        const lowestPrice = Math.min(...p.variants.map((v) => v.price));
        return ranges.some((r) => lowestPrice >= r.min && lowestPrice <= r.max);
      });
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.variants[0].price - b.variants[0].price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.variants[0].price - a.variants[0].price);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
        break;
      default: // popular
        result.sort((a, b) => {
          if (a.isBestseller !== b.isBestseller) return a.isBestseller ? -1 : 1;
          return b.reviewCount - a.reviewCount;
        });
    }

    return result;
  }, [selectedPriceRanges, selectedSubcategories, sortBy, searchQuery]);

  // Shared filter content for mobile
  const filterContent = (
    <>
      <FilterGroup title="Type">
        {getSubcategories().map((opt) => (
          <FilterCheckbox
            key={opt.value}
            label={opt.label}
            checked={selectedSubcategories.includes(opt.value)}
            onChange={() => onToggleSubcategory(opt.value)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Price Range">
        {PRICE_RANGES.map((opt) => (
          <FilterCheckbox
            key={opt.value}
            label={opt.label}
            checked={selectedPriceRanges.includes(opt.value)}
            onChange={() => onTogglePriceRange(opt.value)}
          />
        ))}
      </FilterGroup>

      {activeFilterCount > 0 && (
        <button
          onClick={() => {
            onClearAll();
            setMobileFiltersOpen(false);
          }}
          className="mt-4 w-full rounded-xl border border-brand-rose/30 py-3 text-sm font-semibold text-brand-rose hover:bg-brand-rose/10 transition-colors cursor-pointer"
        >
          Clear All Filters
        </button>
      )}
    </>
  );

  return (
    <>
      <SEOHead
        title="Flower Bouquets"
        description="Order premium flower bouquets online in Vadodara — roses, lilies, orchids, mixed bouquets & birthday specials. Fresh farm-to-door delivery."
        keywords="flower bouquets, roses, lilies, orchids, flower delivery Vadodara, birthday flowers, anniversary flowers, fresh flowers"
      />

      <motion.div initial="hidden" animate="visible" variants={pageVariants}>
        {/* ── Hero Banner ──────────────────────── */}
        <section className="relative overflow-hidden bg-surface-primary py-12 sm:py-16 lg:py-20">
          {/* Decorative gradients */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-brand-rose/[0.06] blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-brand-rose-gold/[0.04] blur-3xl" />
          </div>

          <Container as="div" size="xl" className="relative">
            <motion.div variants={fadeUp}>
              {/* Breadcrumbs */}
              <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-sm">
                <Link href="/" className="flex items-center gap-1 text-text-muted hover:text-brand-rose transition-colors">
                  <Home className="h-3.5 w-3.5" />
                  Home
                </Link>
                <ChevronRight className="h-3.5 w-3.5 text-text-muted/50" />
                <span className="text-text-accent font-medium">Flower Bouquets</span>
              </nav>

              {/* Title */}
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary">
                Flower{' '}
                <span className="text-gradient-rose">Bouquets</span>
              </h1>
              <p className="mt-3 text-text-secondary max-w-2xl text-base sm:text-lg">
                Stunning arrangements of the freshest blooms — handcrafted by expert florists and delivered with love across Vadodara.
              </p>
            </motion.div>
          </Container>
        </section>

        {/* ── Main Content ─────────────────────── */}
        <section className="bg-brand-black pb-20">
          <Container as="div" size="xl">
            {/* Top bar */}
            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-6 border-b border-border-secondary mb-8"
            >
              {/* Search */}
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                <input
                  type="text"
                  placeholder="Search flowers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl bg-surface-secondary border border-border-secondary py-2.5 pl-10 pr-4 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-rose/50 transition-colors"
                />
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm text-text-muted whitespace-nowrap">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                </span>

                {/* Desktop sort */}
                <div className="hidden lg:flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4 text-text-muted" />
                  <select
                    value={sortBy}
                    onChange={(e) => onSetSort(e.target.value)}
                    className="bg-surface-secondary border border-border-secondary text-text-primary text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-brand-rose/50 cursor-pointer appearance-none pr-8"
                    style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23807A74' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>

            <div className="flex gap-8">
              {/* Desktop Sidebar */}
              <FilterSidebar
                selectedPriceRanges={selectedPriceRanges}
                selectedSubcategories={selectedSubcategories}
                onTogglePriceRange={onTogglePriceRange}
                onToggleSubcategory={onToggleSubcategory}
                onClearAll={onClearAll}
                activeFilterCount={activeFilterCount}
              />

              {/* Product Grid */}
              <div className="flex-1 min-w-0">
                {/* Active filter pills */}
                {activeFilterCount > 0 && (
                  <motion.div variants={fadeUp} className="flex flex-wrap gap-2 mb-6">
                    {selectedSubcategories.map((v) => (
                      <button
                        key={v}
                        onClick={() => onToggleSubcategory(v)}
                        className="flex items-center gap-1.5 rounded-full bg-brand-rose/15 border border-brand-rose/30 px-3 py-1.5 text-xs font-medium text-brand-rose hover:bg-brand-rose/25 transition-colors cursor-pointer"
                      >
                        {v.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                        <X className="h-3 w-3" />
                      </button>
                    ))}
                    {selectedPriceRanges.map((v) => (
                      <button
                        key={v}
                        onClick={() => onTogglePriceRange(v)}
                        className="flex items-center gap-1.5 rounded-full bg-brand-rose/15 border border-brand-rose/30 px-3 py-1.5 text-xs font-medium text-brand-rose hover:bg-brand-rose/25 transition-colors cursor-pointer"
                      >
                        {PRICE_RANGES.find((o) => o.value === v)?.label}
                        <X className="h-3 w-3" />
                      </button>
                    ))}
                  </motion.div>
                )}

                {filteredProducts.length > 0 ? (
                  <motion.div
                    variants={pageVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
                  >
                    {filteredProducts.map((product, index) => (
                      <ProductCard key={product.id} product={product} index={index} />
                    ))}
                  </motion.div>
                ) : (
                  /* Empty State */
                  <motion.div variants={fadeUp} className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-surface-secondary border border-border-secondary">
                      <PackageOpen className="h-9 w-9 text-text-muted" />
                    </div>
                    <h3 className="font-display text-xl font-semibold text-text-primary mb-2">
                      No bouquets found
                    </h3>
                    <p className="text-text-secondary text-sm max-w-md mb-6">
                      We couldn't find any bouquets matching your filters. Try adjusting or clearing your filters.
                    </p>
                    <button
                      onClick={onClearAll}
                      className="rounded-xl bg-brand-rose px-6 py-3 text-sm font-semibold text-white hover:bg-brand-rose-dark transition-colors cursor-pointer"
                    >
                      Clear All Filters
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </Container>
        </section>

        {/* ── Mobile Bottom Bar ────────────────── */}
        <div className="fixed bottom-0 left-0 right-0 z-[400] lg:hidden border-t border-border-secondary bg-surface-primary/95 backdrop-blur-xl">
          <div className="grid grid-cols-2 divide-x divide-border-secondary">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="flex items-center justify-center gap-2 py-3.5 text-sm font-medium text-text-primary hover:text-brand-rose transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-rose text-[10px] font-bold text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileSortOpen(true)}
              className="flex items-center justify-center gap-2 py-3.5 text-sm font-medium text-text-primary hover:text-brand-rose transition-colors cursor-pointer"
            >
              <ArrowUpDown className="h-4 w-4" />
              Sort
            </button>
          </div>
        </div>

        {/* Mobile Filter Sheet */}
        <MobileSheet isOpen={mobileFiltersOpen} onClose={() => setMobileFiltersOpen(false)} title="Filters">
          {filterContent}
        </MobileSheet>

        {/* Mobile Sort Sheet */}
        <MobileSheet isOpen={mobileSortOpen} onClose={() => setMobileSortOpen(false)} title="Sort By">
          <div className="space-y-1">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onSetSort(opt.value)}
                className={cn(
                  'w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer',
                  sortBy === opt.value
                    ? 'bg-brand-rose/15 text-brand-rose border border-brand-rose/30'
                    : 'text-text-secondary hover:bg-surface-secondary hover:text-text-primary'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </MobileSheet>
      </motion.div>
    </>
  );
}

export default function FlowersPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-brand-black flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-rose"></div>
      </div>
    }>
      <FlowersPageContent />
    </Suspense>
  );
}

