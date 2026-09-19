"use client";

// ============================================
// Cakes Category Page — Cake Connection
// Monginis-Style Sticky Left Filter + 4 Variants (500g, 1kg, 1.5kg, 2kg)
// Clean White Theme Inspired by Giftlaya & Monginis
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
  ChevronDown,
  Home,
  Search,
  PackageOpen,
  Scale,
} from 'lucide-react';
import { Container } from '@/components/ui';
import { SEOHead } from '@/components/seo/SEOHead';
import { cn, formatPrice, getDiscountPercent } from '@/utils';
import { useProducts } from '@/hooks/useProducts';
import { useCartStore, useWishlistStore, useUIStore } from '@/stores';
import type { Product, ProductVariant } from '@/types';

// ── Constants ────────────────────────────────

const WEIGHT_OPTIONS = [
  { value: '500g', label: '500g' },
  { value: '1kg', label: '1kg' },
  { value: '1.5kg', label: '1.5kg' },
  { value: '2kg', label: '2kg' },
];

const QUICK_FLAVOURS = [
  { value: 'chocolate', label: 'Chocolate', image: '/images/cakes/choco-chips.jpg' },
  { value: 'red-velvet', label: 'Red Velvet', image: '/images/cakes/red-velvet-flavour.jfif' },
  { value: 'black-forest', label: 'Black Forest', image: '/images/cakes/beautiful-blackforest.jpeg' },
  { value: 'truffle', label: 'Truffle', image: '/images/cakes/choco-truffle-2-5-hours.jpeg' },
  { value: 'butterscotch', label: 'Butterscotch', image: '/images/cakes/butterscotch-1.jpeg' },
  { value: 'fruit', label: 'Fresh Fruit', image: '/images/cakes/fresh-fruit-cake.jpg' },
  { value: 'rasmalai', label: 'Rasmalai', image: '/images/cakes/rasmalai-cake.jpg' },
  { value: 'pineapple', label: 'Pineapple', image: '/images/cakes/15-kg-2-step-pineapple-cake.jpeg' },
  { value: 'strawberry', label: 'Strawberry', image: '/images/cakes/15-kg-2-step-strawberry-cake.jpeg' },
];

const FLAVOUR_OPTIONS = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'black-forest', label: 'Black Forest' },
  { value: 'red-velvet', label: 'Red Velvet' },
  { value: 'truffle', label: 'Truffle' },
  { value: 'butterscotch', label: 'Butterscotch' },
  { value: 'fruit', label: 'Fresh Fruit' },
  { value: 'rasmalai', label: 'Rasmalai' },
  { value: 'pineapple', label: 'Pineapple' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' },
];

const PRICE_RANGES = [
  { value: '0-500', label: 'Under ₹500', min: 0, max: 500 },
  { value: '500-999', label: '₹500 – ₹999', min: 500, max: 999 },
  { value: '999-1499', label: '₹999 – ₹1,499', min: 999, max: 1499 },
  { value: '1500-above', label: 'Above ₹1,500', min: 1500, max: Infinity },
];

const SORT_OPTIONS = [
  { value: 'popular', label: 'Popularity' },
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'newest', label: 'New Arrivals' },
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function matchesFlavour(product: Product, flavourValue: string): boolean {
  if (product.flavour && product.flavour.toLowerCase() === flavourValue.toLowerCase()) {
    return true;
  }
  const fClean = flavourValue.replace(/-/g, ' ').toLowerCase();
  const name = (product.name || '').toLowerCase();
  const sub = (product.subcategory || '').toLowerCase();
  const tags = (product.tags || []).map((t) => t.toLowerCase());

  if (fClean === 'chocolate') {
    if (name.includes('choco') || sub.includes('choco') || tags.some((t) => t.includes('choco'))) return true;
  }
  if (fClean === 'black forest') {
    if (name.includes('blackforest') || name.includes('black forest') || sub.includes('blackforest')) return true;
  }
  if (fClean === 'red velvet') {
    if (name.includes('velvet') || sub.includes('velvet') || tags.some((t) => t.includes('velvet'))) return true;
  }
  if (fClean === 'fruit') {
    if (name.includes('fruit') || sub.includes('fruit') || tags.some((t) => t.includes('fruit'))) return true;
  }

  return (
    name.includes(fClean) ||
    sub.includes(fClean) ||
    tags.some((t) => t.includes(fClean))
  );
}

function getSubcategories(products: Product[]): { value: string; label: string }[] {
  if (!products || !Array.isArray(products)) return [];
  const subsMap = new Map<string, string>();
  products.forEach((p) => {
    if (!p.subcategory) return;
    p.subcategory.split(',').forEach((s) => {
      const trimmed = s.trim();
      let slug = slugify(trimmed);

      if (slug.endsWith('-cakes')) slug = slug.replace(/-cakes$/, '');
      else if (slug.endsWith('-cake')) slug = slug.replace(/-cake$/, '');

      if (slug && !subsMap.has(slug)) {
        let label = trimmed;
        if (label.toLowerCase().endsWith(' cakes')) label = label.substring(0, label.length - 6);
        else if (label.toLowerCase().endsWith(' cake')) label = label.substring(0, label.length - 5);
        subsMap.set(slug, label);
      }
    });
  });
  return Array.from(subsMap.entries())
    .map(([value, label]) => ({ value, label }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

// ── Animation Variants ───────────────────────

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3, staggerChildren: 0.04, delayChildren: 0.02 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
};

const slideUp = {
  hidden: { y: '100%' },
  visible: { y: 0, transition: { type: 'spring', damping: 30, stiffness: 300 } },
  exit: { y: '100%', transition: { duration: 0.2 } },
} as const;

// ── Product Card with 500g, 1kg, 1.5kg, 2kg Selectors ────

function ProductCard({
  product,
  index,
  activeWeightFilter,
}: {
  product: Product;
  index: number;
  activeWeightFilter?: string;
}) {
  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist(product.id));
  const addToast = useUIStore((s) => s.addToast);

  // Pick variant matching activeWeightFilter if provided, else default to first
  const initialVariant = useMemo(() => {
    if (activeWeightFilter && product.variants && product.variants.length > 0) {
      const match = product.variants.find((v) =>
        v.weight.toLowerCase().replace(/\s+/g, '') === activeWeightFilter.toLowerCase().replace(/\s+/g, '')
      );
      if (match) return match;
    }
    return product.variants[0];
  }, [product.variants, activeWeightFilter]);

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(initialVariant);

  // Sync if weight filter changes
  useEffect(() => {
    if (activeWeightFilter && product.variants && product.variants.length > 0) {
      const match = product.variants.find((v) =>
        v.weight.toLowerCase().replace(/\s+/g, '') === activeWeightFilter.toLowerCase().replace(/\s+/g, '')
      );
      if (match) setSelectedVariant(match);
    }
  }, [activeWeightFilter, product.variants]);

  const currentVariant = selectedVariant || product.variants[0] || {
    id: 'default',
    weight: '500g',
    price: 449,
    stock: 50,
  };

  const discount = currentVariant.compareAtPrice
    ? getDiscountPercent(currentVariant.price, currentVariant.compareAtPrice)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      productId: product.id,
      slug: product.slug,
      category: 'cakes',
      variantId: currentVariant.id,
      name: `${product.name} (${currentVariant.weight})`,
      image: product.images[0]?.url || '',
      weight: currentVariant.weight,
      flavour: product.flavour,
      price: currentVariant.price,
      quantity: 1,
    });
    addToast({
      type: 'success',
      message: `${product.name} (${currentVariant.weight}) added to cart!`,
    });
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({
      productId: product.id,
      name: product.name,
      image: product.images[0]?.url || '',
      price: currentVariant.price,
      addedAt: new Date().toISOString(),
    });
  };

  return (
    <motion.article variants={cardVariants} layout>
      <div className="group relative flex flex-col rounded-2xl border border-gray-200/90 bg-white overflow-hidden transition-all duration-300 hover:border-brand-rose/50 hover:shadow-xl hover:-translate-y-1 h-full">
        {/* Clickable Area to Product Detail */}
        <Link href={`/cakes/${product.slug}`} className="block relative aspect-square overflow-hidden bg-gray-50">
          <img
            src={product.images[0]?.url}
            alt={product.images[0]?.alt || product.name}
            loading={index < 6 ? 'eager' : 'lazy'}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
            {product.isBestseller && (
              <span className="rounded-md bg-brand-rose px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-xs">
                Bestseller
              </span>
            )}
            {product.isNewArrival && (
              <span className="rounded-md bg-emerald-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-xs">
                New
              </span>
            )}
            {discount > 0 && (
              <span className="rounded-md bg-rose-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                {discount}% OFF
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            type="button"
            onClick={handleWishlistToggle}
            aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            className="absolute top-2.5 right-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 shadow-xs transition-all duration-200 hover:bg-white hover:border-brand-rose hover:scale-110 cursor-pointer"
          >
            <Heart
              className={cn(
                'h-4 w-4 transition-colors duration-200',
                isInWishlist ? 'fill-brand-rose text-brand-rose' : 'text-gray-400 group-hover:text-gray-600'
              )}
            />
          </button>
        </Link>

        {/* Content */}
        <div className="flex flex-1 flex-col p-3.5 sm:p-4 bg-white justify-between">
          <div>
            {/* Rating */}
            <div className="mb-1.5 flex items-center gap-1.5">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'h-3.5 w-3.5',
                      i < Math.floor(product.rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'fill-gray-200 text-gray-200'
                    )}
                  />
                ))}
              </div>
              <span className="text-xs font-medium text-gray-500">
                {product.rating} ({product.reviewCount})
              </span>
            </div>

            {/* Name */}
            <Link href={`/cakes/${product.slug}`}>
              <h3 className="font-display text-sm sm:text-base font-semibold text-gray-900 leading-snug line-clamp-2 hover:text-brand-rose transition-colors">
                {product.name}
              </h3>
            </Link>

            {/* Same Day Delivery Badge */}
            <div className="mt-1 flex items-center gap-1 text-[11px] font-medium text-emerald-600">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              ⚡ Express Vadodara Delivery
            </div>

            {/* Weight Variant Selector (500g, 1kg, 1.5kg, 2kg) */}
            <div className="mt-2.5 pt-2 border-t border-gray-100">
              <div className="flex items-center justify-between text-[11px] font-semibold text-gray-500 mb-1.5">
                <span>Weight:</span>
                <span className="text-brand-rose font-bold">{currentVariant.weight}</span>
              </div>
              <div className="grid grid-cols-4 gap-1">
                {product.variants.map((v) => {
                  const isSelected = currentVariant.id === v.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedVariant(v);
                      }}
                      className={cn(
                        'py-1 text-[10px] sm:text-[11px] font-semibold rounded-md border text-center transition-all cursor-pointer',
                        isSelected
                          ? 'bg-brand-rose text-white border-brand-rose shadow-xs'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-brand-rose/60 hover:bg-rose-50/40'
                      )}
                    >
                      {v.weight}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div>
            {/* Price */}
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-lg sm:text-xl font-bold text-gray-900">
                {formatPrice(currentVariant.price)}
              </span>
              {currentVariant.compareAtPrice && (
                <span className="text-xs sm:text-sm text-gray-400 line-through">
                  {formatPrice(currentVariant.compareAtPrice)}
                </span>
              )}
              {discount > 0 && (
                <span className="text-xs font-bold text-emerald-600">
                  {discount}% off
                </span>
              )}
            </div>

            {/* Add to Cart */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handleAddToCart}
              className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-rose px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-brand-rose-dark hover:shadow-md cursor-pointer"
            >
              <ShoppingBag className="h-4 w-4" />
              Add to Cart
            </motion.button>
          </div>
        </div>
      </div>
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
    <label className="flex items-center gap-2.5 cursor-pointer group/check py-1">
      {/* Hidden real checkbox so label click fires onChange correctly */}
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <div
        className={cn(
          'h-4 w-4 rounded border flex items-center justify-center transition-all duration-150 shrink-0',
          checked
            ? 'bg-brand-rose border-brand-rose text-white'
            : 'border-gray-300 bg-white group-hover/check:border-brand-rose'
        )}
      >
        {checked && (
          <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span
        className={cn(
          'text-xs sm:text-sm transition-colors flex-1 line-clamp-1',
          checked ? 'text-gray-900 font-semibold' : 'text-gray-700 group-hover/check:text-gray-900'
        )}
      >
        {label}
      </span>
      {count !== undefined && count > 0 && (
        <span className="text-[11px] text-gray-400 font-normal">({count})</span>
      )}
    </label>
  );
}

// ── Monginis-Style Accordion Group ───────────

function AccordionGroup({
  title,
  isOpen,
  onToggle,
  children,
  badge,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  badge?: number | string;
}) {
  return (
    <div className="border-b border-gray-150 py-3 last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between py-1 text-left cursor-pointer group"
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-800 group-hover:text-brand-rose transition-colors">
            {title}
          </span>
          {badge !== undefined && Number(badge) > 0 && (
            <span className="flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-brand-rose text-[10px] font-bold text-white">
              {badge}
            </span>
          )}
        </div>
        <ChevronDown
          className={cn(
            'h-4 w-4 text-gray-400 transition-transform duration-200 group-hover:text-brand-rose',
            isOpen && 'rotate-180 text-brand-rose'
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-2 pb-1">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Monginis-Style Sticky Sidebar Filters (Desktop) ──

function FilterSidebar({
  selectedWeights,
  selectedFlavours,
  selectedPriceRanges,
  selectedSubcategories,
  onToggleWeight,
  onToggleFlavour,
  onTogglePriceRange,
  onToggleSubcategory,
  onClearAll,
  activeFilterCount,
  products,
}: {
  selectedWeights: string[];
  selectedFlavours: string[];
  selectedPriceRanges: string[];
  selectedSubcategories: string[];
  onToggleWeight: (v: string) => void;
  onToggleFlavour: (v: string) => void;
  onTogglePriceRange: (v: string) => void;
  onToggleSubcategory: (v: string) => void;
  onClearAll: () => void;
  activeFilterCount: number;
  products: Product[];
}) {
  const subcategories = getSubcategories(products);

  // Accordion open states
  const [openWeight, setOpenWeight] = useState(true);
  const [openCategory, setOpenCategory] = useState(true);
  const [openFlavour, setOpenFlavour] = useState(true);
  const [openPrice, setOpenPrice] = useState(true);

  // Subcategory search filter within sidebar
  const [catSearch, setCatSearch] = useState('');
  const filteredSubcategories = useMemo(() => {
    if (!catSearch.trim()) return subcategories;
    const q = catSearch.toLowerCase();
    return subcategories.filter((s) => s.label.toLowerCase().includes(q));
  }, [subcategories, catSearch]);

  const getWeightCount = (weight: string) => {
    const wNorm = weight.toLowerCase().replace(/\s+/g, '');
    return products.filter((p) =>
      p.variants.some((v) => v.weight.toLowerCase().replace(/\s+/g, '') === wNorm)
    ).length;
  };

  const getFlavourCount = (flavour: string) => {
    return products.filter((p) => matchesFlavour(p, flavour)).length;
  };

  return (
    <aside className="hidden lg:block w-72 shrink-0">
      {/* Sticky container that stays firmly visible on scroll right under the header */}
      <div className="sticky top-[96px] lg:top-[112px] max-h-[calc(100vh-110px)] lg:max-h-[calc(100vh-125px)] overflow-y-auto pr-1 bg-white border border-gray-200/90 rounded-2xl p-5 shadow-sm scrollbar-thin scrollbar-thumb-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-150 mb-1">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-brand-rose" />
            <h3 className="font-display text-base font-bold text-gray-900">Filters</h3>
            {activeFilterCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-rose text-[10px] font-bold text-white">
                {activeFilterCount}
              </span>
            )}
          </div>
          {activeFilterCount > 0 && (
            <button
              onClick={onClearAll}
              className="text-xs font-semibold text-brand-rose hover:text-brand-rose-dark transition-colors cursor-pointer"
            >
              Clear All
            </button>
          )}
        </div>

        {/* 1. Weight Filter (500g, 1kg, 1.5kg, 2kg) */}
        <AccordionGroup
          title="Cake Weight"
          isOpen={openWeight}
          onToggle={() => setOpenWeight(!openWeight)}
          badge={selectedWeights.length}
        >
          <div className="space-y-1">
            {WEIGHT_OPTIONS.map((opt) => (
              <FilterCheckbox
                key={opt.value}
                label={opt.label}
                checked={selectedWeights.includes(opt.value)}
                onChange={() => onToggleWeight(opt.value)}
                count={getWeightCount(opt.value)}
              />
            ))}
          </div>
        </AccordionGroup>

        {/* 2. Categories & Subcategories (Monginis style) */}
        {subcategories.length > 0 && (
          <AccordionGroup
            title="Categories & Themes"
            isOpen={openCategory}
            onToggle={() => setOpenCategory(!openCategory)}
            badge={selectedSubcategories.length}
          >
            {subcategories.length > 8 && (
              <div className="relative mb-2">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={catSearch}
                  onChange={(e) => setCatSearch(e.target.value)}
                  className="w-full text-xs rounded-lg border border-gray-200 pl-8 pr-2.5 py-1.5 focus:outline-none focus:border-brand-rose"
                />
              </div>
            )}
            <div className="space-y-1 max-h-52 overflow-y-auto pr-1">
              {filteredSubcategories.map((opt) => (
                <FilterCheckbox
                  key={opt.value}
                  label={opt.label}
                  checked={selectedSubcategories.includes(opt.value)}
                  onChange={() => onToggleSubcategory(opt.value)}
                />
              ))}
            </div>
          </AccordionGroup>
        )}

        {/* 3. Flavour */}
        <AccordionGroup
          title="Flavour"
          isOpen={openFlavour}
          onToggle={() => setOpenFlavour(!openFlavour)}
          badge={selectedFlavours.length}
        >
          <div className="space-y-1 max-h-52 overflow-y-auto pr-1">
            {FLAVOUR_OPTIONS.map((opt) => (
              <FilterCheckbox
                key={opt.value}
                label={opt.label}
                checked={selectedFlavours.includes(opt.value)}
                onChange={() => onToggleFlavour(opt.value)}
                count={getFlavourCount(opt.value)}
              />
            ))}
          </div>
        </AccordionGroup>

        {/* 4. Price Range */}
        <AccordionGroup
          title="Price Range"
          isOpen={openPrice}
          onToggle={() => setOpenPrice(!openPrice)}
          badge={selectedPriceRanges.length}
        >
          <div className="space-y-1">
            {PRICE_RANGES.map((opt) => (
              <FilterCheckbox
                key={opt.value}
                label={opt.label}
                checked={selectedPriceRanges.includes(opt.value)}
                onChange={() => onTogglePriceRange(opt.value)}
              />
            ))}
          </div>
        </AccordionGroup>
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
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[500]"
            onClick={onClose}
          />
          <motion.div
            variants={slideUp}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed bottom-0 left-0 right-0 z-[501] max-h-[85vh] rounded-t-3xl bg-white border-t border-gray-200 overflow-hidden flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-150 shrink-0 bg-white">
              <h3 className="font-display text-lg font-bold text-gray-900">{title}</h3>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {/* Content */}
            <div className="overflow-y-auto flex-1 p-4 bg-white">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ── Main Page Component ──────────────────────

function CakesPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [mobileSortOpen, setMobileSortOpen] = useState(false);
  const urlSearch = searchParams.get('search') || searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(urlSearch);

  useEffect(() => {
    if (urlSearch) {
      setSearchQuery(urlSearch);
    }
  }, [urlSearch]);

  const { products: cakeProducts, loading } = useProducts('cakes');

  // Parse URL params
  const selectedWeights = searchParams.getAll('weight');
  const selectedFlavours = searchParams.getAll('flavour');
  const selectedPriceRanges = searchParams.getAll('price');
  const selectedSubcategories = searchParams.getAll('subcategory');
  const sortBy = searchParams.get('sort') || 'popular';

  // Helper to update query params
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

  const onToggleWeight = (v: string) => toggleArrayParam('weight', v, selectedWeights);
  const onToggleFlavour = (v: string) => toggleArrayParam('flavour', v, selectedFlavours);
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

  const activeFilterCount =
    selectedWeights.length +
    selectedFlavours.length +
    selectedPriceRanges.length +
    selectedSubcategories.length;

  // Active primary weight for card display
  const activeWeightFilter = selectedWeights[0];

  // Filter & sort products
  const filteredProducts = useMemo(() => {
    let result = [...cakeProducts].filter((p) => p.isAvailable);

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription?.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q)) ||
          (p.subcategory && p.subcategory.toLowerCase().includes(q)) ||
          (p.flavour && p.flavour.toLowerCase().includes(q))
      );
    }

    // Weight filter (500g, 1kg, 1.5kg, 2kg)
    if (selectedWeights.length > 0) {
      result = result.filter((p) =>
        selectedWeights.some((w) => {
          const wNorm = w.toLowerCase().replace(/\s+/g, '');
          return p.variants.some((v) => v.weight.toLowerCase().replace(/\s+/g, '') === wNorm);
        })
      );
    }

    // Flavour filter (smart matching across flavour, name, subcategory)
    if (selectedFlavours.length > 0) {
      result = result.filter((p) =>
        selectedFlavours.some((f) => matchesFlavour(p, f))
      );
    }

    // Subcategory filter
    if (selectedSubcategories.length > 0) {
      result = result.filter((p) => {
        if (!p.subcategory) return false;
        const pSubs = p.subcategory.split(',').map((s) => {
          let sl = slugify(s.trim());
          if (sl.endsWith('-cakes')) sl = sl.replace(/-cakes$/, '');
          else if (sl.endsWith('-cake')) sl = sl.replace(/-cake$/, '');
          return sl;
        });
        return selectedSubcategories.some((sub) => pSubs.includes(sub));
      });
    }

    // Price range filter
    if (selectedPriceRanges.length > 0) {
      const ranges = selectedPriceRanges
        .map((v) => PRICE_RANGES.find((r) => r.value === v)!)
        .filter(Boolean);
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
      default: // popular — bestseller first, then by reviews
        result.sort((a, b) => {
          if (a.isBestseller !== b.isBestseller) return a.isBestseller ? -1 : 1;
          return b.reviewCount - a.reviewCount;
        });
    }

    return result;
  }, [
    cakeProducts,
    selectedWeights,
    selectedFlavours,
    selectedPriceRanges,
    selectedSubcategories,
    sortBy,
    searchQuery,
  ]);

  // Mobile Filter Content
  const mobileFilterContent = (
    <div className="space-y-4">
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 mb-2">Cake Weight</h4>
        <div className="grid grid-cols-2 gap-2">
          {WEIGHT_OPTIONS.map((opt) => (
            <FilterCheckbox
              key={opt.value}
              label={opt.label}
              checked={selectedWeights.includes(opt.value)}
              onChange={() => onToggleWeight(opt.value)}
            />
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-gray-150">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 mb-2">Flavours</h4>
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {FLAVOUR_OPTIONS.map((opt) => (
            <FilterCheckbox
              key={opt.value}
              label={opt.label}
              checked={selectedFlavours.includes(opt.value)}
              onChange={() => onToggleFlavour(opt.value)}
            />
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-gray-150">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 mb-2">Categories</h4>
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {getSubcategories(cakeProducts).map((opt) => (
            <FilterCheckbox
              key={opt.value}
              label={opt.label}
              checked={selectedSubcategories.includes(opt.value)}
              onChange={() => onToggleSubcategory(opt.value)}
            />
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-gray-150">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 mb-2">Price Range</h4>
        <div className="space-y-1">
          {PRICE_RANGES.map((opt) => (
            <FilterCheckbox
              key={opt.value}
              label={opt.label}
              checked={selectedPriceRanges.includes(opt.value)}
              onChange={() => onTogglePriceRange(opt.value)}
            />
          ))}
        </div>
      </div>

      {activeFilterCount > 0 && (
        <button
          onClick={() => {
            onClearAll();
            setMobileFiltersOpen(false);
          }}
          className="mt-4 w-full rounded-xl border border-brand-rose/40 py-3 text-sm font-semibold text-brand-rose hover:bg-rose-50 transition-colors cursor-pointer"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-rose mb-4"></div>
        <p className="text-sm font-medium text-gray-500">Loading cakes & variants...</p>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title="Online Cake Delivery in Vadodara — Fresh & Handcrafted Cakes"
        description="Order fresh handcrafted cakes online in Vadodara — Chocolate Truffle, Red Velvet, Black Forest, Butterscotch & more in 500g, 1kg, 1.5kg, 2kg variants."
        keywords="cakes, birthday cakes, chocolate cake, red velvet cake, order cake online, Vadodara, eggless cake, 500g, 1kg, 1.5kg, 2kg cake delivery"
      />

      <motion.div initial="hidden" animate="visible" variants={pageVariants} className="bg-white">
        {/* ── Top Header / Hero Section ───────────── */}
        <section className="bg-white border-b border-gray-150 pt-8 pb-6">
          <Container as="div" size="xl">
            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-xs sm:text-sm">
              <Link href="/" className="flex items-center gap-1 text-gray-500 hover:text-brand-rose transition-colors">
                <Home className="h-3.5 w-3.5" />
                Home
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
              <span className="text-gray-900 font-semibold">Cakes</span>
            </nav>

            {/* Title & Trust Highlights */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
                  Online Cake Delivery in <span className="text-brand-rose">Vadodara</span>
                </h1>
                <div className="mt-2.5 flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                  <div className="flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200/80 px-2.5 py-0.5 text-amber-700 font-semibold">
                    <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                    4.8 (2,450+ Ratings)
                  </div>
                  <span className="hidden sm:inline text-gray-300">•</span>
                  <span className="flex items-center gap-1 text-gray-700 font-medium">
                    <Scale className="h-3.5 w-3.5 text-brand-rose" />
                    Available in 500g, 1kg, 1.5kg & 2kg
                  </span>
                  <span className="hidden sm:inline text-gray-300">•</span>
                  <span className="flex items-center gap-1 text-emerald-700 font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    100% Eggless Available
                  </span>
                  <span className="hidden sm:inline text-gray-300">•</span>
                  <span className="flex items-center gap-1 text-brand-rose font-medium">
                    ⚡ 90-Min SuperFast Delivery
                  </span>
                </div>
              </div>
            </div>

            {/* ── Flavour Quick Filter Cards ── */}
            <div className="mt-6 pt-5 border-t border-gray-150">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Popular Cake Flavours
                </h2>
                {selectedFlavours.length > 0 && (
                  <button
                    onClick={() => updateParam('flavour', [])}
                    className="text-xs text-brand-rose font-semibold hover:underline cursor-pointer"
                  >
                    Clear Flavour Filter
                  </button>
                )}
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2 sm:gap-3">
                {QUICK_FLAVOURS.map((item) => {
                  const isSelected = selectedFlavours.includes(item.value);
                  return (
                    <button
                      key={item.value}
                      onClick={() => onToggleFlavour(item.value)}
                      className={cn(
                        'group flex flex-col items-center rounded-2xl p-2 sm:p-2.5 border transition-all duration-200 cursor-pointer text-center',
                        isSelected
                          ? 'bg-rose-50/90 border-brand-rose ring-2 ring-brand-rose/20 shadow-sm'
                          : 'bg-white border-gray-200 hover:border-brand-rose/50 hover:bg-rose-50/20 hover:shadow-xs'
                      )}
                    >
                      <div className="relative aspect-square w-14 sm:w-16 overflow-hidden rounded-xl bg-gray-100 mb-1.5">
                        <img
                          src={item.image}
                          alt={item.label}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <span
                        className={cn(
                          'text-[11px] sm:text-xs font-semibold leading-tight line-clamp-1',
                          isSelected ? 'text-brand-rose font-bold' : 'text-gray-800 group-hover:text-brand-rose'
                        )}
                      >
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </Container>
        </section>

        {/* ── Main Content Section with Sticky Sidebar ─────── */}
        <section className="bg-[#FAF9F6] min-h-screen py-8 pb-24">
          <Container as="div" size="xl">
            {/* Top Controls Bar: Search + Product Count + Sort */}
            <motion.div
              variants={fadeUp}
              className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pb-6 mb-6 border-b border-gray-200/80"
            >
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search cakes by name, flavour, weight..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl bg-white border border-gray-200 py-2.5 pl-10 pr-9 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm focus:outline-none focus:border-brand-rose focus:ring-2 focus:ring-brand-rose/20 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Count & Sort Controls */}
              <div className="flex flex-wrap items-center justify-between lg:justify-end gap-3 sm:gap-4">
                <span className="text-sm font-semibold text-gray-700">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'cake' : 'cakes'}
                </span>

                {/* Quick Sort Pills */}
                <div className="hidden sm:flex items-center gap-1.5 p-1 bg-white border border-gray-200 rounded-xl shadow-sm text-xs font-medium">
                  <span className="px-2 py-1 text-gray-400 flex items-center gap-1 font-semibold uppercase tracking-wider text-[10px]">
                    <ArrowUpDown className="h-3 w-3" /> Sort:
                  </span>
                  {SORT_OPTIONS.map((opt) => {
                    const isActive = sortBy === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => onSetSort(opt.value)}
                        className={cn(
                          'px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer',
                          isActive
                            ? 'bg-brand-rose text-white shadow-xs font-semibold'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        )}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>

                {/* Mobile Sort Dropdown */}
                <div className="sm:hidden flex items-center">
                  <select
                    value={sortBy}
                    onChange={(e) => onSetSort(e.target.value)}
                    className="bg-white border border-gray-200 text-gray-800 text-xs font-medium rounded-xl px-3 py-2 shadow-sm focus:outline-none focus:border-brand-rose"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        Sort: {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Layout: Sticky Left Filter + Product Grid */}
            <div className="flex gap-8 items-start">
              {/* Monginis-style Sticky Left Filter */}
              <FilterSidebar
                selectedWeights={selectedWeights}
                selectedFlavours={selectedFlavours}
                selectedPriceRanges={selectedPriceRanges}
                selectedSubcategories={selectedSubcategories}
                onToggleWeight={onToggleWeight}
                onToggleFlavour={onToggleFlavour}
                onTogglePriceRange={onTogglePriceRange}
                onToggleSubcategory={onToggleSubcategory}
                onClearAll={onClearAll}
                activeFilterCount={activeFilterCount}
                products={cakeProducts}
              />

              {/* Product Grid Area */}
              <div className="flex-1 min-w-0">
                {/* Active Filter Badges */}
                {activeFilterCount > 0 && (
                  <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-2 mb-6">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mr-1">
                      Active:
                    </span>
                    {selectedWeights.map((w) => (
                      <button
                        key={w}
                        onClick={() => onToggleWeight(w)}
                        className="flex items-center gap-1.5 rounded-full bg-rose-50 border border-brand-rose/40 px-3 py-1 text-xs font-medium text-brand-rose hover:bg-rose-100 transition-colors cursor-pointer"
                      >
                        <span>Weight: {w}</span>
                        <X className="h-3 w-3" />
                      </button>
                    ))}
                    {selectedFlavours.map((v) => (
                      <button
                        key={v}
                        onClick={() => onToggleFlavour(v)}
                        className="flex items-center gap-1.5 rounded-full bg-rose-50 border border-brand-rose/40 px-3 py-1 text-xs font-medium text-brand-rose hover:bg-rose-100 transition-colors cursor-pointer"
                      >
                        <span>Flavour: {FLAVOUR_OPTIONS.find((o) => o.value === v)?.label || v}</span>
                        <X className="h-3 w-3" />
                      </button>
                    ))}
                    {selectedSubcategories.map((v) => (
                      <button
                        key={v}
                        onClick={() => onToggleSubcategory(v)}
                        className="flex items-center gap-1.5 rounded-full bg-rose-50 border border-brand-rose/40 px-3 py-1 text-xs font-medium text-brand-rose hover:bg-rose-100 transition-colors cursor-pointer"
                      >
                        <span>{v.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</span>
                        <X className="h-3 w-3" />
                      </button>
                    ))}
                    {selectedPriceRanges.map((v) => (
                      <button
                        key={v}
                        onClick={() => onTogglePriceRange(v)}
                        className="flex items-center gap-1.5 rounded-full bg-rose-50 border border-brand-rose/40 px-3 py-1 text-xs font-medium text-brand-rose hover:bg-rose-100 transition-colors cursor-pointer"
                      >
                        <span>{PRICE_RANGES.find((o) => o.value === v)?.label}</span>
                        <X className="h-3 w-3" />
                      </button>
                    ))}
                    <button
                      onClick={onClearAll}
                      className="text-xs font-semibold text-gray-500 hover:text-brand-rose underline ml-1 cursor-pointer"
                    >
                      Clear all
                    </button>
                  </motion.div>
                )}

                {filteredProducts.length > 0 ? (
                  <motion.div
                    variants={pageVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6"
                  >
                    {filteredProducts.map((product, index) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        index={index}
                        activeWeightFilter={activeWeightFilter}
                      />
                    ))}
                  </motion.div>
                ) : (
                  /* Empty State */
                  <motion.div
                    variants={fadeUp}
                    className="flex flex-col items-center justify-center py-16 px-4 bg-white border border-gray-200 rounded-3xl text-center shadow-sm"
                  >
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 border border-rose-100">
                      <PackageOpen className="h-8 w-8 text-brand-rose" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-gray-900 mb-2">
                      No cakes found
                    </h3>
                    <p className="text-gray-500 text-sm max-w-md mb-6">
                      We couldn't find any cakes matching your selected filters. Try choosing a different weight, flavour or clear your filters to view all cakes.
                    </p>
                    <button
                      onClick={onClearAll}
                      className="rounded-xl bg-brand-rose px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-rose-dark transition-colors shadow-sm cursor-pointer"
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
        <div className="fixed bottom-0 left-0 right-0 z-[400] lg:hidden border-t border-gray-200 bg-white/95 backdrop-blur-xl shadow-lg">
          <div className="grid grid-cols-2 divide-x divide-gray-200">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="flex items-center justify-center gap-2 py-3.5 text-sm font-semibold text-gray-800 hover:text-brand-rose transition-colors cursor-pointer"
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
              className="flex items-center justify-center gap-2 py-3.5 text-sm font-semibold text-gray-800 hover:text-brand-rose transition-colors cursor-pointer"
            >
              <ArrowUpDown className="h-4 w-4" />
              Sort
            </button>
          </div>
        </div>

        {/* Mobile Filter Sheet */}
        <MobileSheet isOpen={mobileFiltersOpen} onClose={() => setMobileFiltersOpen(false)} title="Filter Cakes">
          {mobileFilterContent}
        </MobileSheet>

        {/* Mobile Sort Sheet */}
        <MobileSheet isOpen={mobileSortOpen} onClose={() => setMobileSortOpen(false)} title="Sort Cakes">
          <div className="space-y-1.5">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onSetSort(opt.value)}
                className={cn(
                  'w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer',
                  sortBy === opt.value
                    ? 'bg-rose-50 text-brand-rose font-bold border border-brand-rose/30'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
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

export default function CakesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex flex-col items-center justify-center text-gray-900">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-rose mb-4"></div>
          <p className="text-sm font-medium text-gray-500">Loading delicious cakes...</p>
        </div>
      }
    >
      <CakesPageContent />
    </Suspense>
  );
}
