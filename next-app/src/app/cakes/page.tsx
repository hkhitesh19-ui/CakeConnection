"use client";

// ============================================
// Cakes Page — Cake Connection
// Giftlaya-Inspired Sleek Cards + Left Filter Panel
// ============================================

import { useState, useMemo, useCallback, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import {
  SlidersHorizontal,
  ArrowUpDown,
  X,
  ChevronRight,
  ChevronDown,
  Home,
  Search,
  PackageOpen,
  Plus,
  Check,
  Zap,
} from 'lucide-react';
import { Container } from '@/components/ui';
import { SEOHead } from '@/components/seo/SEOHead';
import { cn, formatPrice } from '@/utils';
import { useProducts } from '@/hooks/useProducts';
import { useCartStore, useUIStore } from '@/stores';
import type { Product, ProductVariant } from '@/types';

// ── Constants ────────────────────────────────

const WEIGHT_OPTIONS = [
  { value: '250g', label: 'Mini (250g)' },
  { value: '500g', label: '500g' },
  { value: '1kg', label: '1kg' },
  { value: '1.5kg', label: '1.5kg' },
  { value: '2kg', label: '2kg' },
];

// Top Visual Category Bubble Cards (Giftlaya Style)
const CATEGORY_BUBBLES = [
  {
    id: 'mini-cakes',
    label: 'Mini Cakes (250g)',
    type: 'weight',
    value: '250g',
    image: '/images/cakes/mini-creamy-choco-truffle-cake-250g.png',
  },
  {
    id: 'chocolate',
    label: 'Chocolate',
    type: 'flavour',
    value: 'chocolate',
    image: '/images/cakes/belgium-supreme-cake.jpeg',
  },
  {
    id: 'truffle',
    label: 'Choco Truffle',
    type: 'flavour',
    value: 'truffle',
    image: '/images/cakes/choco-truffle-2-5-hours.jpeg',
  },
  {
    id: 'black-forest',
    label: 'Black Forest',
    type: 'flavour',
    value: 'black-forest',
    image: '/images/cakes/beautiful-blackforest.jpeg',
  },
  {
    id: 'red-velvet',
    label: 'Red Velvet',
    type: 'flavour',
    value: 'red-velvet',
    image: '/images/cakes/red-velvet-flavour.jfif',
  },
  {
    id: 'butterscotch',
    label: 'Butterscotch',
    type: 'flavour',
    value: 'butterscotch',
    image: '/images/cakes/butterscotch-1.jpeg',
  },
  {
    id: 'fruit',
    label: 'Fresh Fruit',
    type: 'flavour',
    value: 'fruit',
    image: '/images/cakes/fresh-fruit-cake.jpg',
  },
  {
    id: 'rasmalai',
    label: 'Rasmalai',
    type: 'flavour',
    value: 'rasmalai',
    image: '/images/cakes/rasmalai-cake.jpg',
  },
  {
    id: 'pineapple',
    label: 'Pineapple',
    type: 'flavour',
    value: 'pineapple',
    image: '/images/cakes/15-kg-2-step-pineapple-cake.jpeg',
  },
  {
    id: 'strawberry',
    label: 'Strawberry',
    type: 'flavour',
    value: 'strawberry',
    image: '/images/cakes/15-kg-2-step-strawberry-cake.jpeg',
  },
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
  { value: 'newest', label: 'New Arrivals' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
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
    transition: { duration: 0.25, staggerChildren: 0.03 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
};

// Helper to parse weight into grams for accurate numerical sorting
function parseWeightInGrams(weightStr: string): number {
  const norm = (weightStr || '').toLowerCase().trim();
  if (norm.includes('kg')) {
    const val = parseFloat(norm.replace('kg', '').trim());
    return isNaN(val) ? 99999 : val * 1000;
  }
  if (norm.includes('g') || norm.includes('gm') || norm.includes('gram')) {
    const val = parseFloat(norm.replace(/[^0-9.]/g, '').trim());
    return isNaN(val) ? 99999 : val;
  }
  const val = parseFloat(norm);
  return isNaN(val) ? 99999 : val;
}

// ── Clean Product Card (Giftlaya Style) ───────

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
  const addToast = useUIStore((s) => s.addToast);
  const [isAdded, setIsAdded] = useState(false);

  // Extract starting lowest two weight variations (as per weight variation) with actual prices
  const displayVariants = useMemo(() => {
    const vars = product.variants || [];
    const valid = vars
      .map((v) => {
        // Use actual sale price (v.price) — same as product detail page shows
        // compareAtPrice was causing mismatch: listing showed 15% higher than detail page
        const mrp = Number(v.price) || 0;
        return {
          ...v,
          mrp,
          weightGrams: parseWeightInGrams(v.weight),
        };
      })
      .filter((v) => v.mrp > 0)
      .sort((a, b) => a.weightGrams - b.weightGrams);

    // If active weight filter is applied, place it first if matched
    if (activeWeightFilter) {
      const filterNorm = activeWeightFilter.toLowerCase().replace(/\s+/g, '');
      const matched = valid.find((v) => v.weight.toLowerCase().replace(/\s+/g, '') === filterNorm);
      if (matched) {
        const others = valid.filter((v) => v.id !== matched.id);
        return [matched, ...others].slice(0, 2);
      }
    }

    // Default: Return the lowest starting two weight variations (or 1 if only 250g or single variant)
    return valid.slice(0, 2);
  }, [product.variants, activeWeightFilter]);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const selectedVar = displayVariants[0] || product.variants?.[0];
    if (!selectedVar) return;

    const finalPrice = (selectedVar as any).mrp || selectedVar.price;

    addItem({
      productId: product.id,
      slug: product.slug,
      category: 'cakes',
      variantId: selectedVar.id,
      name: `${product.name} (${selectedVar.weight})`,
      image: product.images[0]?.url || '',
      weight: selectedVar.weight,
      flavour: product.flavour,
      price: finalPrice,
      quantity: 1,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);

    addToast({
      type: 'success',
      message: `${product.name} (${selectedVar.weight}) added to cart!`,
    });
  };

  return (
    <motion.article variants={cardVariants} layout className="h-full">
      <div className="group relative flex flex-col h-full rounded-2xl bg-white border border-gray-100 hover:border-brand-rose/40 hover:shadow-lg transition-all duration-300 overflow-hidden">
        {/* 1:1 Aspect Image Container */}
        <Link
          href={`/cakes/${product.slug}`}
          className="relative block aspect-square w-full overflow-hidden bg-[#F9F9F9] rounded-2xl"
        >
          <img
            src={product.images[0]?.url || '/placeholder.png'}
            alt={product.images[0]?.alt || product.name}
            loading={index < 8 ? 'eager' : 'lazy'}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />

          {/* Bottom Right Floating Quick Add (+) Button — Giftlaya Style */}
          <button
            type="button"
            onClick={handleQuickAdd}
            aria-label="Quick Add to Cart"
            title="Quick Add to Cart"
            className={cn(
              'absolute bottom-2.5 right-2.5 z-10 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full shadow-md transition-all duration-200 cursor-pointer',
              isAdded
                ? 'bg-emerald-600 text-white scale-110'
                : 'bg-white border border-gray-150 text-brand-rose hover:bg-brand-rose hover:text-white hover:scale-110 active:scale-95'
            )}
          >
            {isAdded ? (
              <Check className="h-4 w-4 stroke-[3]" />
            ) : (
              <Plus className="h-4 w-4 sm:h-5 sm:w-5 stroke-[2.5]" />
            )}
          </button>
        </Link>

        {/* Minimal Clean Details Under Image */}
        <div className="flex flex-1 flex-col justify-between pt-3 pb-2 px-1">
          <div>
            {/* Cake Name */}
            <Link href={`/cakes/${product.slug}`}>
              <h3 className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-1 hover:text-brand-rose transition-colors">
                {product.name}
              </h3>
            </Link>

            {/* Price Line: Lowest 2 Weight Variation MRP Prices (No Discounted Price) */}
            <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
              {displayVariants.map((v, i) => (
                <div
                  key={v.id || i}
                  className={cn(
                    "inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold leading-normal",
                    i === 0
                      ? "bg-rose-50 text-gray-900 border border-brand-rose/25"
                      : "bg-gray-50 text-gray-700 border border-gray-200"
                  )}
                >
                  <span className="text-[10px] font-semibold text-gray-500 uppercase">{v.weight}:</span>
                  <span className="text-xs sm:text-[13px] font-extrabold text-gray-900">
                    {formatPrice(v.mrp)}
                  </span>
                </div>
              ))}
            </div>

            {/* Delivery Badge */}
            <div className="mt-1 flex items-center gap-1 text-[11px] font-medium text-emerald-600">
              <Zap className="h-3 w-3 fill-emerald-600 text-emerald-600 shrink-0" />
              <span>Same Day Delivery</span>
            </div>
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
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      <div
        className={cn(
          'h-4 w-4 rounded border flex items-center justify-center transition-all duration-150 shrink-0',
          checked ? 'bg-brand-rose border-brand-rose text-white' : 'border-gray-300 bg-white group-hover/check:border-brand-rose'
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

// ── Accordion Group Component ─────────────────

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

// ── Leftside Filter Panel (Desktop Sticky) ───

function LeftFilterSidebar({
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

  const [openWeight, setOpenWeight] = useState(true);
  const [openCategory, setOpenCategory] = useState(true);
  const [openFlavour, setOpenFlavour] = useState(true);
  const [openPrice, setOpenPrice] = useState(true);

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
    <aside className="w-64 xl:w-72 shrink-0">
      <div className="sticky top-[100px] max-h-[calc(100vh-120px)] overflow-y-auto bg-white border border-gray-200/90 rounded-2xl p-4 shadow-xs scrollbar-thin scrollbar-thumb-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-150 mb-1">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-brand-rose" />
            <h3 className="font-display text-sm font-bold text-gray-900">Filters</h3>
            {activeFilterCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-rose text-[10px] font-bold text-white">
                {activeFilterCount}
              </span>
            )}
          </div>
          {activeFilterCount > 0 && (
            <button
              onClick={onClearAll}
              className="text-xs font-semibold text-brand-rose hover:underline cursor-pointer"
            >
              Clear All
            </button>
          )}
        </div>

        {/* 1. Cake Weight */}
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

        {/* 2. Flavours */}
        <AccordionGroup
          title="Flavours"
          isOpen={openFlavour}
          onToggle={() => setOpenFlavour(!openFlavour)}
          badge={selectedFlavours.length}
        >
          <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
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

        {/* 3. Categories & Occasions */}
        {subcategories.length > 0 && (
          <AccordionGroup
            title="Categories"
            isOpen={openCategory}
            onToggle={() => setOpenCategory(!openCategory)}
            badge={selectedSubcategories.length}
          >
            {subcategories.length > 8 && (
              <div className="relative mb-2">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={catSearch}
                  onChange={(e) => setCatSearch(e.target.value)}
                  className="w-full text-xs rounded-lg border border-gray-200 pl-8 pr-2.5 py-1.5 focus:outline-none focus:border-brand-rose"
                />
              </div>
            )}
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
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

// ── Slide-Over Filter Drawer (Mobile) ────────

function FilterDrawer({
  isOpen,
  onClose,
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
  totalMatchingCount,
}: {
  isOpen: boolean;
  onClose: () => void;
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
  totalMatchingCount: number;
}) {
  const subcategories = getSubcategories(products);
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
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs z-[600]"
            onClick={onClose}
          />

          {/* Drawer Panel */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed top-0 right-0 bottom-0 z-[601] w-full max-w-md bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-150 bg-white">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5 text-brand-rose" />
                <h3 className="font-display text-lg font-bold text-gray-900">Filters</h3>
                {activeFilterCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-rose text-[11px] font-bold text-white">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                {activeFilterCount > 0 && (
                  <button
                    onClick={onClearAll}
                    className="text-xs font-semibold text-brand-rose hover:underline cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Filters Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* 1. Cake Weight */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 mb-3">
                  Cake Weight
                </h4>
                <div className="grid grid-cols-2 gap-2">
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
              </div>

              {/* 2. Flavours */}
              <div className="pt-4 border-t border-gray-150">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 mb-3">
                  Flavours
                </h4>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
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
              </div>

              {/* 3. Categories & Themes */}
              {subcategories.length > 0 && (
                <div className="pt-4 border-t border-gray-150">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 mb-3">
                    Categories & Occasions
                  </h4>
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
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {filteredSubcategories.map((opt) => (
                      <FilterCheckbox
                        key={opt.value}
                        label={opt.label}
                        checked={selectedSubcategories.includes(opt.value)}
                        onChange={() => onToggleSubcategory(opt.value)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* 4. Price Range */}
              <div className="pt-4 border-t border-gray-150">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 mb-3">
                  Price Range
                </h4>
                <div className="space-y-1.5">
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
            </div>

            {/* Bottom Footer Actions */}
            <div className="p-4 border-t border-gray-150 bg-gray-50 flex items-center gap-3">
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={onClearAll}
                  className="flex-1 py-3 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Clear All
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl bg-brand-rose text-white text-xs font-bold shadow-sm hover:bg-brand-rose-dark transition-colors cursor-pointer text-center"
              >
                Apply Filters ({totalMatchingCount} Cakes)
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

// ── Main Page Content ────────────────────────

function CakesPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const urlSearch = searchParams.get('search') || searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(urlSearch);

  useEffect(() => {
    if (urlSearch) setSearchQuery(urlSearch);
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

  const activeWeightFilter = selectedWeights[0];

  // Filter & sort products
  const filteredProducts = useMemo(() => {
    // "but price set na kiya ho ya Zero ho wo Product Disaply hoga nahi"
    let result = [...cakeProducts].filter((p) => {
      if (!p.isAvailable) return false;
      const validVariants = (p.variants || []).filter((v) => {
        const price = Number(v.price) || 0;
        return price > 0;
      });
      return validVariants.length > 0;
    });

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

    // Weight filter (250g, 500g, 1kg, 1.5kg, 2kg)
    if (selectedWeights.length > 0) {
      result = result.filter((p) =>
        selectedWeights.some((w) => {
          const wNorm = w.toLowerCase().replace(/\s+/g, '');
          return p.variants.some((v) => v.weight.toLowerCase().replace(/\s+/g, '') === wNorm);
        })
      );
    }

    // Flavour filter
    if (selectedFlavours.length > 0) {
      result = result.filter((p) => selectedFlavours.some((f) => matchesFlavour(p, f)));
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
        return selectedSubcategories.some((sub) => {
          let target = slugify(sub);
          if (target.endsWith('-cakes')) target = target.replace(/-cakes$/, '');
          else if (target.endsWith('-cake')) target = target.replace(/-cake$/, '');
          return pSubs.some((pSub) => pSub === target || pSub.includes(target) || target.includes(pSub));
        });
      });
    }

    // Price range filter (using actual selling price v.price)
    if (selectedPriceRanges.length > 0) {
      const ranges = selectedPriceRanges
        .map((v) => PRICE_RANGES.find((r) => r.value === v)!)
        .filter(Boolean);
      result = result.filter((p) => {
        const lowestPrice = Math.min(
          ...(p.variants || []).map((v) => Number(v.price) || 0).filter((pr) => pr > 0)
        );
        return ranges.some((r) => lowestPrice >= r.min && lowestPrice <= r.max);
      });
    }

    // Sort (using actual selling price v.price for price-asc and price-desc)
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => {
          const minA = Math.min(...(a.variants || []).map((v) => Number(v.price) || 0).filter((pr) => pr > 0));
          const minB = Math.min(...(b.variants || []).map((v) => Number(v.price) || 0).filter((pr) => pr > 0));
          return minA - minB;
        });
        break;
      case 'price-desc':
        result.sort((a, b) => {
          const minA = Math.min(...(a.variants || []).map((v) => Number(v.price) || 0).filter((pr) => pr > 0));
          const minB = Math.min(...(b.variants || []).map((v) => Number(v.price) || 0).filter((pr) => pr > 0));
          return minB - minA;
        });
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      default: // popular
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-rose mb-4"></div>
        <p className="text-sm font-medium text-gray-500">Loading cakes...</p>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title="Online Cake Delivery in Vadodara — Fresh Handcrafted Cakes"
        description="Browse our luxury handcrafted cake collection in Vadodara with same-day express delivery."
      />

      <motion.div initial="hidden" animate="visible" variants={pageVariants} className="bg-white min-h-screen">
        {/* ── Top Category Bubble Carousel (Giftlaya Style) ──── */}
        <section className="bg-white pt-6 pb-4 border-b border-gray-100">
          <Container as="div" size="xl">
            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-xs text-gray-500">
              <Link href="/" className="flex items-center gap-1 hover:text-brand-rose transition-colors">
                <Home className="h-3.5 w-3.5" />
                Home
              </Link>
              <ChevronRight className="h-3 w-3 text-gray-400" />
              <span className="text-gray-900 font-medium">Cakes</span>
            </nav>

            {/* Visual Round Category Cards */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
              {CATEGORY_BUBBLES.map((cat) => {
                const isActive =
                  (cat.type === 'weight' && selectedWeights.includes(cat.value)) ||
                  (cat.type === 'flavour' && selectedFlavours.includes(cat.value)) ||
                  (cat.type === 'subcategory' && selectedSubcategories.includes(cat.value));

                const handleClick = () => {
                  if (cat.type === 'weight') onToggleWeight(cat.value);
                  else if (cat.type === 'flavour') onToggleFlavour(cat.value);
                  else if (cat.type === 'subcategory') onToggleSubcategory(cat.value);
                };

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={handleClick}
                    className={cn(
                      'group flex flex-col items-center justify-center p-2.5 rounded-2xl border shrink-0 transition-all duration-200 cursor-pointer w-24 sm:w-28 text-center',
                      isActive
                        ? 'bg-rose-50 border-brand-rose ring-2 ring-brand-rose/20 shadow-sm'
                        : 'bg-white border-rose-100/70 hover:border-brand-rose/50 hover:bg-rose-50/20 hover:shadow-xs'
                    )}
                  >
                    <div className="relative aspect-square w-16 sm:w-18 overflow-hidden rounded-full border-2 border-white shadow-xs bg-gray-50 mb-1.5">
                      <img
                        src={cat.image}
                        alt={cat.label}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <span
                      className={cn(
                        'text-[11px] sm:text-xs font-semibold leading-tight line-clamp-1',
                        isActive ? 'text-brand-rose font-bold' : 'text-gray-800 group-hover:text-brand-rose'
                      )}
                    >
                      {cat.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </Container>
        </section>

        {/* ── Sort, Count & Controls Bar ──── */}
        <section className="bg-white border-b border-gray-100 py-4">
          <Container as="div" size="xl">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Product Count & Search */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-500">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                </span>

                {/* Quick Search */}
                <div className="relative hidden md:block w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search cakes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-full bg-gray-50 border border-gray-200 py-1.5 pl-8 pr-7 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-brand-rose focus:bg-white transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Sort Pills + Filter Toggle Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-auto overflow-x-auto pb-1 sm:pb-0">
                {SORT_OPTIONS.map((opt) => {
                  const isActive = sortBy === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => onSetSort(opt.value)}
                      className={cn(
                        'px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer',
                        isActive
                          ? 'bg-[#7B1113] text-white shadow-xs'
                          : 'bg-white text-gray-700 border border-gray-200 hover:border-brand-rose/60 hover:text-brand-rose'
                      )}
                    >
                      {opt.label}
                    </button>
                  );
                })}

                {/* Desktop Toggle Left Sidebar Button */}
                <button
                  type="button"
                  onClick={() => setShowSidebar(!showSidebar)}
                  className="hidden lg:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border border-gray-200 text-gray-800 hover:border-brand-rose hover:text-brand-rose shadow-xs transition-all cursor-pointer whitespace-nowrap"
                  title="Toggle left filter panel"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  <span>{showSidebar ? 'Hide Panel' : 'Show Panel'}</span>
                  {activeFilterCount > 0 && (
                    <span className="flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-brand-rose text-[10px] font-bold text-white">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                {/* Mobile Filter Drawer Trigger Button */}
                <button
                  type="button"
                  onClick={() => setFilterDrawerOpen(true)}
                  className={cn(
                    'lg:hidden flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 cursor-pointer whitespace-nowrap',
                    activeFilterCount > 0
                      ? 'bg-rose-50 border-brand-rose text-brand-rose'
                      : 'bg-white border-gray-200 text-gray-800 hover:border-brand-rose hover:text-brand-rose shadow-xs'
                  )}
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  <span>Filters</span>
                  {activeFilterCount > 0 && (
                    <span className="flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-brand-rose text-[10px] font-bold text-white">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Active Filter Chips */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Active:
                </span>
                {selectedWeights.map((w) => (
                  <button
                    key={w}
                    onClick={() => onToggleWeight(w)}
                    className="flex items-center gap-1 rounded-full bg-rose-50 border border-brand-rose/40 px-2.5 py-0.5 text-xs font-medium text-brand-rose hover:bg-rose-100 transition-colors cursor-pointer"
                  >
                    <span>{w}</span>
                    <X className="h-3 w-3" />
                  </button>
                ))}
                {selectedFlavours.map((f) => (
                  <button
                    key={f}
                    onClick={() => onToggleFlavour(f)}
                    className="flex items-center gap-1 rounded-full bg-rose-50 border border-brand-rose/40 px-2.5 py-0.5 text-xs font-medium text-brand-rose hover:bg-rose-100 transition-colors cursor-pointer"
                  >
                    <span>{FLAVOUR_OPTIONS.find((o) => o.value === f)?.label || f}</span>
                    <X className="h-3 w-3" />
                  </button>
                ))}
                {selectedSubcategories.map((s) => (
                  <button
                    key={s}
                    onClick={() => onToggleSubcategory(s)}
                    className="flex items-center gap-1 rounded-full bg-rose-50 border border-brand-rose/40 px-2.5 py-0.5 text-xs font-medium text-brand-rose hover:bg-rose-100 transition-colors cursor-pointer"
                  >
                    <span>{s.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</span>
                    <X className="h-3 w-3" />
                  </button>
                ))}
                {selectedPriceRanges.map((p) => (
                  <button
                    key={p}
                    onClick={() => onTogglePriceRange(p)}
                    className="flex items-center gap-1 rounded-full bg-rose-50 border border-brand-rose/40 px-2.5 py-0.5 text-xs font-medium text-brand-rose hover:bg-rose-100 transition-colors cursor-pointer"
                  >
                    <span>{PRICE_RANGES.find((r) => r.value === p)?.label}</span>
                    <X className="h-3 w-3" />
                  </button>
                ))}
                <button
                  onClick={onClearAll}
                  className="text-xs font-semibold text-gray-500 hover:text-brand-rose underline ml-2 cursor-pointer"
                >
                  Clear All
                </button>
              </div>
            )}
          </Container>
        </section>

        {/* ── Main Content: Left Filter Panel + Product Grid ──── */}
        <section className="py-8 pb-20">
          <Container as="div" size="xl">
            <div className="flex gap-6 lg:gap-8 items-start">
              {/* Leftside Sticky Filter Panel */}
              {showSidebar && (
                <div className="hidden lg:block">
                  <LeftFilterSidebar
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
                </div>
              )}

              {/* Product Grid Area */}
              <div className="flex-1 min-w-0">
                {filteredProducts.length > 0 ? (
                  <motion.div
                    variants={pageVariants}
                    initial="hidden"
                    animate="visible"
                    className={cn(
                      'grid gap-4 sm:gap-5 lg:gap-6',
                      showSidebar
                        ? 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4'
                        : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
                    )}
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
                  <div className="flex flex-col items-center justify-center py-16 px-4 bg-gray-50 rounded-3xl text-center border border-gray-200">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 border border-rose-100">
                      <PackageOpen className="h-8 w-8 text-brand-rose" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-gray-900 mb-2">No cakes found</h3>
                    <p className="text-gray-500 text-sm max-w-md mb-6">
                      We couldn't find any cakes matching your selected filters. Try choosing a different option or clear all filters.
                    </p>
                    <button
                      onClick={onClearAll}
                      className="rounded-xl bg-brand-rose px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-rose-dark transition-colors shadow-sm cursor-pointer"
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </Container>
        </section>

        {/* ── Slide-Over Filter Drawer (Mobile) ───────────── */}
        <FilterDrawer
          isOpen={filterDrawerOpen}
          onClose={() => setFilterDrawerOpen(false)}
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
          totalMatchingCount={filteredProducts.length}
        />
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
          <p className="text-sm font-medium text-gray-500">Loading cakes...</p>
        </div>
      }
    >
      <CakesPageContent />
    </Suspense>
  );
}
