'use client';
// ============================================
// Product Detail Page — Cake Connection
// The single most important conversion page
// ============================================

import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { useParams, useRouter as useNavigate } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  Heart,
  ShoppingBag,
  MessageCircle,
  ChevronRight,
  Home,
  Minus,
  Plus,
  Gift,
  Truck,
  Clock,
  ShieldCheck,
  Sparkles,
  Zap,
  Timer,
  Calendar,
  ChevronDown,
  Check,
  ArrowLeft,
  Search,
  AlertCircle,
} from 'lucide-react';

import { Container } from '@/components/ui';

import { cn, formatPrice, getDiscountPercent, getWhatsAppLink, formatTimeSlotDisplay } from '@/utils';
import { mockReviews } from '@/data/products';
import { useCartStore, useWishlistStore, useUIStore, useSiteStore, type DeliverySlot } from '@/stores';
import type { Product, ProductVariant } from '@/types';
import { AddonModal, type AddonProduct } from './AddonModal';

// ── Animation Variants ───────────────────────

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5 },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
};

// ── Helpers ──────────────────────────────────

function getDeliveryIcon(iconName: string) {
  switch (iconName?.toLowerCase()) {
    case 'zap': return <Zap className="h-3.5 w-3.5" />;
    case 'clock': return <Clock className="h-3.5 w-3.5" />;
    case 'timer': return <Timer className="h-3.5 w-3.5" />;
    case 'truck': return <Truck className="h-3.5 w-3.5" />;
    case 'calendar': return <Calendar className="h-3.5 w-3.5" />;
    default: return <Truck className="h-3.5 w-3.5" />;
  }
}

function getNext7Days(): { date: Date; label: string; shortLabel: string }[] {
  const days: { date: Date; label: string; shortLabel: string }[] = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    let label: string;
    let shortLabel: string;
    if (i === 0) {
      label = 'Today';
      shortLabel = 'Today';
    } else if (i === 1) {
      label = 'Tomorrow';
      shortLabel = 'Tmrw';
    } else {
      label = d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
      shortLabel = d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' });
    }
    days.push({ date: d, label, shortLabel });
  }
  return days;
}

function getCategoryLabel(category: string): string {
  switch (category) {
    case 'cakes': return 'Cakes';
    case 'flowers': return 'Flowers';
    case 'combos': return 'Combos';
    default: return category;
  }
}

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

// ── Star Rating Component ────────────────────

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const sizeMap = { sm: 'h-3.5 w-3.5', md: 'h-4 w-4', lg: 'h-5 w-5' };
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            sizeMap[size],
            i < Math.floor(rating)
              ? 'fill-amber-400 text-amber-400'
              : i < rating
                ? 'fill-amber-400/50 text-amber-400'
                : 'fill-surface-tertiary text-surface-tertiary'
          )}
        />
      ))}
    </div>
  );
}

// ── Rating Distribution Bar ──────────────────

function RatingBar({ stars, count, total }: { stars: number; count: number; total: number }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-text-secondary w-6 text-right">{stars}</span>
      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
      <div className="flex-1 h-2 bg-surface-tertiary rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full bg-amber-400 rounded-full"
        />
      </div>
      <span className="text-xs text-text-muted w-8">{count}</span>
    </div>
  );
}

// ── Related Product Card ─────────────────────

function RelatedProductCard({ product }: { product: Product }) {
  const variant = product.variants[0];
  const discount = variant.compareAtPrice
    ? getDiscountPercent(variant.price, variant.compareAtPrice)
    : 0;
  const wishlist = useWishlistStore();
  const isWished = wishlist.isInWishlist(product.id);

  return (
    <motion.article
      variants={cardVariants}
      className="group relative flex flex-col rounded-2xl border border-border-secondary bg-surface-secondary overflow-hidden transition-all duration-500 hover:border-brand-rose/40 hover:shadow-[0_0_30px_rgba(183,110,121,0.15)]"
    >
      <Link href={`/${product.category}/${product.slug}`} className="relative aspect-square overflow-hidden bg-surface-tertiary">
        <img
          src={product.images[0]?.url}
          alt={product.images[0]?.alt || product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isBestseller && (
            <span className="rounded-full bg-brand-rose/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
              Bestseller
            </span>
          )}
          {product.isNewArrival && (
            <span className="rounded-full bg-emerald-600/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-text-primary backdrop-blur-sm">
              New
            </span>
          )}
          {discount > 0 && (
            <span className="rounded-full bg-brand-red/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
              {discount}% OFF
            </span>
          )}
        </div>
        <div className="absolute top-3 right-3">
          <span className="rounded-full bg-white/95 px-2.5 py-0.5 text-[10px] font-bold text-gray-800 shadow-xs backdrop-blur-sm uppercase">
            {product.category === 'cakes' ? '🎂 Cake' : product.category === 'flowers' ? '💐 Flowers' : '🎁 Combo'}
          </span>
        </div>
      </Link>

      <button
        onClick={() =>
          wishlist.toggleItem({
            productId: product.id,
            name: product.name,
            image: product.images[0]?.url || '',
            price: variant.price,
            addedAt: new Date().toISOString(),
          })
        }
        aria-label={isWished ? 'Remove from wishlist' : 'Add to wishlist'}
        className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-surface-primary/70 backdrop-blur-sm border border-border-secondary transition-all duration-300 hover:bg-surface-primary hover:border-brand-rose/50 hover:scale-110 cursor-pointer z-10"
      >
        <Heart
          className={cn(
            'h-4 w-4 transition-colors duration-300',
            isWished ? 'fill-brand-rose text-brand-rose' : 'text-text-secondary'
          )}
        />
      </button>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="mb-2 flex items-center gap-1.5">
          <StarRating rating={product.rating} />
          <span className="text-xs text-text-muted">
            {product.rating} ({product.reviewCount})
          </span>
        </div>
        <h3 className="font-display text-lg font-semibold text-text-primary leading-tight">
          <Link href={`/${product.category}/${product.slug}`} className="hover:text-brand-rose transition-colors">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 text-xs font-medium text-text-muted uppercase tracking-wide">
          {variant.weight}
        </p>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-xl font-bold text-brand-rose">
            {formatPrice(variant.price)}
          </span>
          {variant.compareAtPrice && (
            <span className="text-sm text-text-muted line-through">
              {formatPrice(variant.compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}

// ── 404 / Not Found State ────────────────────

function ProductNotFound() {
  return (
    <>
      
      <section className="min-h-[60vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-md"
        >
          <div className="mb-6 mx-auto w-24 h-24 rounded-full bg-surface-secondary border border-border-secondary flex items-center justify-center">
            <Search className="h-10 w-10 text-text-muted" />
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-text-primary mb-3">
            Product Not Found
          </h1>
          <p className="text-text-secondary mb-8">
            We couldn't find the product you're looking for. It may have been removed or the link might be incorrect.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-rose text-white font-semibold text-sm transition-all duration-300 hover:bg-brand-rose-dark hover:shadow-lg hover:shadow-brand-rose/30"
            >
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
            <Link
              href="/cakes"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-surface-secondary text-text-primary font-semibold text-sm border border-border-secondary transition-all duration-300 hover:bg-surface-tertiary hover:border-brand-rose/30"
            >
              <ShoppingBag className="h-4 w-4" />
              Browse Shop
            </Link>
          </div>
        </motion.div>
      </section>
    </>
  );
}

// ╔══════════════════════════════════════════════╗
// ║         MAIN PRODUCT PAGE COMPONENT         ║
// ╚══════════════════════════════════════════════╝

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const { category } = useParams<{ category: string; slug: string }>();
  const navigate = useNavigate();
  const reviewsRef = useRef<HTMLDivElement>(null);
  const variantRef = useRef<HTMLDivElement>(null);
  const dateTimeRef = useRef<HTMLDivElement>(null);

  // ── Stores ──
  const addItem = useCartStore((s) => s.addItem);
  const wishlist = useWishlistStore();
  const addToast = useUIStore((s) => s.addToast);
  const {
    deliverySlots,
    closedDates,
    festivalDates,
    fetchSettings
  } = useSiteStore();

  // Call fetchSettings on mount
  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Sort variants by weight in grams (lowest weight / price first)
  const sortedVariants = useMemo(() => {
    if (!product?.variants || product.variants.length === 0) return [];
    return [...product.variants].sort((a, b) => {
      const gA = parseWeightInGrams(a.weight);
      const gB = parseWeightInGrams(b.weight);
      if (gA !== gB && gA < 99999 && gB < 99999) return gA - gB;
      return a.price - b.price;
    });
  }, [product?.variants]);

  // ── State (Lowest weight pre-selected by default as requested) ──
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(() => {
    if (!product?.variants || product.variants.length === 0) return null;
    return [...product.variants].sort((a, b) => {
      const gA = parseWeightInGrams(a.weight);
      const gB = parseWeightInGrams(b.weight);
      if (gA !== gB && gA < 99999 && gB < 99999) return gA - gB;
      return a.price - b.price;
    })[0] || null;
  });

  // Sync default variant when product/variants load
  useEffect(() => {
    if (sortedVariants.length > 0 && (!selectedVariant || !sortedVariants.some(v => v.id === selectedVariant.id))) {
      setSelectedVariant(sortedVariants[0]);
    }
  }, [sortedVariants, selectedVariant]);

  const [selectedDateIndex, setSelectedDateIndex] = useState<number | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [cakeMessage, setCakeMessage] = useState('');
  const [isCakeMessageOpen, setIsCakeMessageOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'delivery' | 'reviews'>('description');
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    variant?: boolean;
    date?: boolean;
    slot?: boolean;
  }>({});

  // ── Derived data ──
  const deliveryDays = useMemo(() => getNext7Days(), []);

  const selectedDateString = useMemo(() => {
    if (selectedDateIndex === null || selectedDateIndex === undefined || !deliveryDays[selectedDateIndex]) return '';
    const d = deliveryDays[selectedDateIndex].date;
    return d.toISOString().split('T')[0];
  }, [deliveryDays, selectedDateIndex]);

  const isDateClosed = useMemo(() => {
    if (!selectedDateString) return null;
    return closedDates.find((c) => c.date === selectedDateString) || null;
  }, [selectedDateString, closedDates]);

  // Delivery Slots directly from Admin Panel (siteStore) without redundant slots or artificial sections
  const availableSlots = useMemo(() => {
    if (!selectedDateString) return [];
    
    // Check if selected date is today
    const todayStr = new Date().toISOString().split('T')[0];
    const isToday = selectedDateString === todayStr;
    const currentHour = new Date().getHours();

    const festivalMatch = festivalDates.find((f) => f.date === selectedDateString);
    
    let rawSlots = deliverySlots && deliverySlots.length > 0 ? deliverySlots : [
      { label: '10:00 AM - 01:00 PM (No Fix Time)', cutoffHour: 8 },
      { label: '12:00 PM - 03:00 PM (No Fix Time)', cutoffHour: 11 },
      { label: '03:00 PM - 06:00 PM (No Fix Time)', cutoffHour: 14 },
      { label: '06:00 PM - 09:00 PM (No Fix Time)', cutoffHour: 17 },
    ];

    if (festivalMatch && festivalMatch.slots && festivalMatch.slots.length > 0) {
      rawSlots = festivalMatch.slots.map((label) => ({ label }));
    }

    // Filter out disabled slots if it's today and past the cutoff hour
    if (isToday) {
      rawSlots = rawSlots.filter(slot => {
        if (slot.cutoffHour === undefined || slot.cutoffHour === null) return true;
        return currentHour < slot.cutoffHour;
      });
    }

    // Deduplicate & format: Direct timeslot display without Morning/Afternoon/Evening and with "(No Fix Time)" at end
    const seen = new Set<string>();
    const cleanSlots: DeliverySlot[] = [];
    rawSlots.forEach((s) => {
      const formatted = formatTimeSlotDisplay(s.label || '');
      if (formatted && !seen.has(formatted.toLowerCase())) {
        seen.add(formatted.toLowerCase());
        cleanSlots.push({ ...s, label: formatted });
      }
    });

    return cleanSlots;
  }, [selectedDateString, festivalDates, deliverySlots]);

  // Sync / validate selected timeslot when available slots change
  useEffect(() => {
    if (availableSlots.length > 0 && selectedTimeSlot) {
      const isValid = availableSlots.some((s) => s.label === selectedTimeSlot);
      if (!isValid) {
        setSelectedTimeSlot('');
      }
    } else if (availableSlots.length === 0) {
      setSelectedTimeSlot('');
    }
  }, [availableSlots, selectedTimeSlot]);

  const isCake = product?.category === 'cakes';

  // Base price from selected variant (or lowest price variant)
  const currentPrice = useMemo(() => {
    if (selectedVariant) return selectedVariant.price;
    if (sortedVariants.length > 0) return sortedVariants[0].price;
    return 0;
  }, [selectedVariant, sortedVariants]);

  const compareAtPrice = useMemo(() => {
    if (selectedVariant?.compareAtPrice) return selectedVariant.compareAtPrice;
    if (sortedVariants.length > 0 && sortedVariants[0].compareAtPrice) return sortedVariants[0].compareAtPrice;
    return 0;
  }, [selectedVariant, sortedVariants]);

  const discount = useMemo(() => {
    if (!compareAtPrice || compareAtPrice <= currentPrice) return 0;
    return getDiscountPercent(currentPrice, compareAtPrice);
  }, [currentPrice, compareAtPrice]);

  const isWishlisted = product ? wishlist.isInWishlist(product.id) : false;

  // Rating distribution (mock)
  const ratingDistribution = useMemo(() => {
    const dist = [0, 0, 0, 0, 0]; // 1-5 stars
    mockReviews.forEach((r) => {
      dist[r.rating - 1]++;
    });
    return dist;
  }, []);

  // ── Handlers ──

  const [isAddonModalOpen, setIsAddonModalOpen] = useState(false);
  const [activeRelatedTab, setActiveRelatedTab] = useState<'all' | 'cakes' | 'flowers' | 'combos'>('all');

  const filteredRelated = useMemo(() => {
    if (activeRelatedTab === 'all') return relatedProducts;
    return relatedProducts.filter((p) => p.category === activeRelatedTab);
  }, [relatedProducts, activeRelatedTab]);

  const handleAddToCart = useCallback(() => {
    if (!product) return;

    const errors: { variant?: boolean; date?: boolean; slot?: boolean } = {};
    const missing: string[] = [];

    // Step 1: Weight is mandatory
    if (!selectedVariant) {
      errors.variant = true;
      missing.push(isCake ? 'Cake Weight' : 'Variant');
    }

    // Step 2: Date is mandatory
    if (selectedDateIndex === null) {
      errors.date = true;
      missing.push('Delivery Date');
    } else if (isDateClosed) {
      errors.date = true;
      missing.push(`Valid Delivery Date (${isDateClosed.reason || 'Bakery Closed'})`);
    }

    // Step 3: Timeslot is mandatory
    if (!selectedTimeSlot) {
      errors.slot = true;
      missing.push('Delivery Time Slot');
    }

    if (missing.length > 0) {
      setValidationErrors(errors);
      addToast({
        type: 'warning',
        message: `Please select required details: ${missing.join(', ')}`,
        duration: 4000,
      });

      // Smooth scroll to the first missing selection
      if (errors.variant && variantRef.current) {
        variantRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if ((errors.date || errors.slot) && dateTimeRef.current) {
        dateTimeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setValidationErrors({});
    setIsAddonModalOpen(true);
  }, [product, isCake, selectedVariant, selectedDateIndex, isDateClosed, selectedTimeSlot, addToast]);

  const handleConfirmAddons = useCallback((selectedAddons: AddonProduct[]) => {
    if (!product || !selectedVariant) return;
    const deliveryDate =
      selectedDateIndex !== null && deliveryDays[selectedDateIndex]
        ? deliveryDays[selectedDateIndex].date.toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];

    // 1. Add Main Cake Product
    addItem({
      productId: product.id,
      slug: product.slug,
      category: product.category,
      variantId: selectedVariant.id,
      name: product.name,
      image: product.images[0]?.url || '',
      weight: selectedVariant.weight,
      flavour: product.flavour,
      price: currentPrice,
      quantity,
      customMessage: cakeMessage || undefined,
      deliverySpeed: 'Standard Delivery',
      deliveryDate,
      deliverySlot: selectedTimeSlot,
    });

    // 2. Add Selected Add-on Items (Flowers, Chocolates, Candles, Cards)
    selectedAddons.forEach((addon) => {
      addItem({
        productId: addon.id,
        slug: addon.id,
        category: addon.category === 'flowers' ? 'flowers' : 'combos',
        variantId: `${addon.id}-std`,
        name: addon.name,
        image: addon.image,
        weight: 'Celebration Add-on',
        flavour: 'addon',
        price: addon.price,
        quantity: 1,
        deliverySpeed: 'Standard Delivery',
        deliveryDate,
        deliverySlot: selectedTimeSlot,
      });
    });

    addToast({
      type: 'success',
      message: selectedAddons.length > 0
        ? `${product.name} + ${selectedAddons.length} add-on(s) added to cart!`
        : `${product.name} added to cart!`,
      duration: 3000,
    });

    setIsAddonModalOpen(false);
    navigate.push('/cart');
  }, [product, selectedVariant, currentPrice, quantity, cakeMessage, selectedDateIndex, selectedTimeSlot, deliveryDays, addItem, addToast, navigate]);

  const handleWhatsApp = useCallback(() => {
    if (!product) return;
    const weightLabel = selectedVariant ? selectedVariant.weight : '500g';
    const dateLabel = selectedDateIndex !== null && deliveryDays[selectedDateIndex] ? deliveryDays[selectedDateIndex].label : 'Today';
    const slotLabel = selectedTimeSlot || 'Standard Delivery';
    const msg = `Hi! I'd like to order:\n\n🎂 *${product.name}*\n📦 ${weightLabel}\n💰 ${formatPrice(currentPrice)}\n🚚 Delivery: ${dateLabel} (${slotLabel})${cakeMessage ? `\n✉️ Message: "${cakeMessage}"` : ''}\n\nPlease confirm availability!`;
    const url = getWhatsAppLink(msg);
    window.open(url, '_blank');
  }, [product, selectedVariant, currentPrice, selectedDateIndex, selectedTimeSlot, cakeMessage, deliveryDays]);

  const handleToggleWishlist = useCallback(() => {
    if (!product) return;
    wishlist.toggleItem({
      productId: product.id,
      name: product.name,
      image: product.images[0]?.url || '',
      price: currentPrice,
      addedAt: new Date().toISOString(),
    });
    addToast({
      type: isWishlisted ? 'info' : 'success',
      message: isWishlisted ? 'Removed from wishlist' : 'Added to wishlist ❤️',
      duration: 2000,
    });
  }, [product, currentPrice, wishlist, isWishlisted, addToast]);

  const scrollToReviews = useCallback(() => {
    setActiveTab('reviews');
    setTimeout(() => {
      reviewsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, []);

  // ── Not found ──
  if (!product) return <ProductNotFound />;

  // ════════════════════════════════════════════
  //  RENDER
  // ════════════════════════════════════════════

  return (
      <main className="relative pb-28 sm:pb-32 lg:pb-32">
        {/* ── Ambient background glow ── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-brand-rose/[0.03] blur-3xl" />
          <div className="absolute bottom-1/3 right-0 w-[400px] h-[400px] rounded-full bg-brand-rose-gold/[0.02] blur-3xl" />
        </div>

        <Container as="div" size="xl" className="relative pt-4 sm:pt-6 lg:pt-8">
          {/* ═══ BREADCRUMBS ═══ */}
          <motion.nav
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            aria-label="Breadcrumb"
            className="mb-6 lg:mb-8"
          >
            <ol className="flex items-center gap-1.5 text-sm text-text-muted flex-wrap">
              <li>
                <Link
                  href="/"
                  className="flex items-center gap-1 hover:text-brand-rose transition-colors duration-200"
                >
                  <Home className="h-3.5 w-3.5" />
                  Home
                </Link>
              </li>
              <li><ChevronRight className="h-3.5 w-3.5 text-text-muted/50" /></li>
              <li>
                <Link
                  href={`/${product.category}`}
                  className="hover:text-brand-rose transition-colors duration-200 capitalize"
                >
                  {getCategoryLabel(product.category)}
                </Link>
              </li>
              <li><ChevronRight className="h-3.5 w-3.5 text-text-muted/50" /></li>
              <li className="text-text-primary font-medium truncate max-w-[200px]">
                {product.name}
              </li>
            </ol>
          </motion.nav>

          {/* ═══ PRODUCT HERO — TWO COLUMN ═══ */}
          <div className="grid grid-cols-1 lg:grid-cols-[55fr_45fr] gap-8 lg:gap-12 xl:gap-16">
            {/* ── LEFT: Photo Gallery ── */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="relative"
            >
              {/* Main Image */}
              <div className="relative rounded-2xl overflow-hidden bg-surface-secondary border border-border-secondary aspect-square">
                {/* Background glow */}
                <div className="absolute inset-0 bg-brand-rose/[0.03]" />

                <AnimatePresence mode="wait">
                  <motion.img
                    key={mainImageIndex}
                    src={product.images[mainImageIndex]?.url}
                    alt={product.images[mainImageIndex]?.alt || product.name}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className={cn(
                      'relative z-10 h-full w-full object-cover transition-transform duration-700',
                      isImageZoomed && 'scale-125 cursor-zoom-out'
                    )}
                    onClick={() => setIsImageZoomed(!isImageZoomed)}
                  />
                </AnimatePresence>

                {/* Badges overlay */}
                <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                  {product.isBestseller && (
                    <span className="rounded-full bg-brand-rose/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                      Bestseller
                    </span>
                  )}
                  {product.isNewArrival && (
                    <span className="rounded-full bg-emerald-600/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-text-primary backdrop-blur-sm">
                      New Arrival
                    </span>
                  )}
                </div>
              </div>

              {/* Thumbnail Strip */}
              {product.images.length > 1 && (
                <div className="mt-4 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setMainImageIndex(idx)}
                      className={cn(
                        'flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 cursor-pointer',
                        idx === mainImageIndex
                          ? 'border-brand-rose shadow-[0_0_12px_rgba(183,110,121,0.3)]'
                          : 'border-border-secondary hover:border-brand-rose/50 opacity-60 hover:opacity-100'
                      )}
                    >
                      <img
                        src={img.url}
                        alt={img.alt || `${product.name} thumbnail ${idx + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* ── RIGHT: Product Info ── */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="flex flex-col"
            >
              {/* (a) Title Block */}
              <motion.div variants={fadeInUp}>
                <div className="flex items-center gap-2.5 mb-3 flex-wrap">
                  <span className="inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-brand-rose bg-brand-rose/10 px-3 py-1 rounded-full">
                    {getCategoryLabel(product.category)}
                  </span>
                  {/* 100% Fresh - 100% Eggless Logo Badge for Cakes Only */}
                  {isCake && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 shadow-2xs">
                      <span className="inline-flex items-center justify-center w-3.5 h-3.5 border-2 border-emerald-600 rounded-[3px] bg-white">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      </span>
                      <span className="text-xs font-bold tracking-wide text-emerald-900">
                        100% Fresh - 100% Eggless
                      </span>
                    </div>
                  )}
                </div>
                <h1 className="font-display font-times text-3xl lg:text-4xl font-bold text-text-primary leading-tight">
                  {product.name}
                </h1>
                <p className="mt-2 text-text-secondary text-base leading-relaxed">
                  {product.shortDescription}
                </p>

                {/* Rating row */}
                <button
                  onClick={scrollToReviews}
                  className="mt-3 flex items-center gap-2 group/rating cursor-pointer"
                >
                  <StarRating rating={product.rating} size="md" />
                  <span className="text-sm text-text-secondary group-hover/rating:text-brand-rose transition-colors">
                    {product.rating} ({product.reviewCount} reviews)
                  </span>
                </button>
              </motion.div>

              {/* Divider */}
              <motion.div variants={fadeIn} className="my-5 h-px bg-border-secondary" />

              {/* (b) Variant / Weight Selection */}
              {/* (b) Variant / Weight Selection — Step 1 (Mandatory) */}
              <motion.div
                variants={fadeInUp}
                ref={variantRef}
                className={cn(
                  'p-3 sm:p-4 rounded-2xl transition-all duration-300',
                  validationErrors.variant
                    ? 'bg-rose-50/70 ring-2 ring-rose-400 border border-rose-300'
                    : 'bg-gray-50/40 border border-gray-100'
                )}
              >
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <label className={cn(
                      "flex items-center gap-2 text-sm font-bold transition-colors",
                      validationErrors.variant ? "text-red-600" : "text-gray-900"
                    )}>
                      <span className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shadow-xs text-white",
                        validationErrors.variant ? "bg-red-600" : "bg-brand-rose"
                      )}>
                        1
                      </span>
                      <span>{isCake ? 'Select Cake Weight' : 'Select Variant'}</span>
                    </label>
                    {validationErrors.variant && (
                      <span className="text-xs font-bold text-red-600 flex items-center gap-1 animate-pulse">
                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-red-600" />
                        Please select a cake weight
                      </span>
                    )}
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                    validationErrors.variant
                      ? "text-red-600 bg-red-50 border border-red-300"
                      : "text-brand-rose bg-rose-50 border border-rose-200"
                  )}>
                    * Required
                  </span>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {sortedVariants.map((v) => {
                    const isSelected = selectedVariant?.id === v.id;
                    const vPrice = v.price || v.compareAtPrice || 0;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => {
                          setSelectedVariant(v);
                          setValidationErrors((prev) => ({ ...prev, variant: false }));
                        }}
                        className={cn(
                          'group relative inline-flex items-center gap-2.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold border-2 transition-all duration-200 cursor-pointer select-none',
                          isSelected
                            ? 'bg-brand-rose text-white border-brand-rose shadow-md shadow-brand-rose/25 ring-2 ring-brand-rose/30 scale-[1.02]'
                            : 'bg-white text-gray-800 border-gray-200 hover:border-brand-rose/60 hover:text-brand-rose hover:bg-rose-50/30'
                        )}
                      >
                        <span className={cn('font-bold', isSelected ? 'text-white' : 'text-gray-900 group-hover:text-brand-rose')}>
                          {v.weight}
                        </span>
                        <span
                          className={cn(
                            'px-2 py-0.5 rounded-md text-xs font-black transition-all duration-200',
                            isSelected
                              ? 'bg-white text-brand-rose shadow-xs ring-1 ring-black/5 font-extrabold'
                              : 'bg-gray-100 text-gray-900 group-hover:bg-rose-100/80 group-hover:text-brand-rose'
                          )}
                        >
                          {formatPrice(vPrice)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>

              {/* (c) Dynamic Price Display */}
              <motion.div variants={fadeInUp} className="mt-4 px-1">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-3xl font-bold text-brand-rose">
                    {formatPrice(currentPrice)}
                  </span>
                  {compareAtPrice > currentPrice && (
                    <span className="text-lg text-text-muted line-through">
                      {formatPrice(compareAtPrice)}
                    </span>
                  )}
                  {discount > 0 && (
                    <span className="px-2.5 py-1 rounded-lg bg-brand-red/15 text-brand-red text-xs font-bold uppercase">
                      {discount}% OFF
                    </span>
                  )}
                  {isCake && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-2xs">
                      <span className="inline-flex items-center justify-center w-3 h-3 border border-emerald-600 rounded-[2px] bg-white">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      </span>
                      100% Fresh - 100% Eggless
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-text-muted">
                  Inclusive of all taxes
                </p>

                {/* (c.1) Custom Message on Cake — Step 2 (Optional) */}
                {isCake && (
                  <div className="mt-4 pt-3 border-t border-gray-150">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-xs font-bold">
                          2
                        </span>
                        <Gift className="h-4 w-4 text-brand-rose" />
                        <span className="text-sm font-bold text-gray-900">Add Message on Cake</span>
                        <span className="text-[10px] font-medium text-gray-500 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-full">
                          Optional
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold text-brand-rose bg-brand-rose/10 px-2 py-0.5 rounded-full">
                        Only 3 words max.
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        maxLength={30}
                        value={cakeMessage}
                        onChange={(e) => setCakeMessage(e.target.value)}
                        placeholder="e.g., Happy Birthday Priya (Leave blank if not needed)"
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-brand-rose focus:ring-2 focus:ring-brand-rose/15 transition-all duration-300"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-text-muted">
                        {cakeMessage.length}/30
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1">
                      Free personalized message hand-piped on your cake
                    </p>
                  </div>
                )}
              </motion.div>

              {/* (d) Choose Date & Time — Step 3 (Mandatory) */}
              <motion.div variants={fadeInUp} className="mt-5">
                <div
                  ref={dateTimeRef}
                  className={cn(
                    'rounded-2xl border-2 bg-white shadow-md overflow-hidden transition-all duration-300',
                    (validationErrors.date || validationErrors.slot)
                      ? 'border-rose-500 ring-4 ring-rose-400/30 bg-rose-50/20'
                      : 'border-brand-rose/60 ring-2 ring-brand-rose/15 hover:border-brand-rose hover:ring-brand-rose/25 shadow-brand-rose/10'
                  )}
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-brand-rose/15 bg-gradient-to-r from-rose-50/80 via-rose-50/30 to-white">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-brand-rose flex items-center justify-center flex-shrink-0 text-white font-bold text-xs shadow-md shadow-brand-rose/25">
                        {isCake ? 3 : 2}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-gray-900 leading-tight">Choose Date &amp; Time Slot</p>
                          <span className="text-[10px] font-bold text-brand-rose bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                            * Required
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5">Select when your order should be delivered in Vadodara</p>
                      </div>
                    </div>
                  </div>

                  {/* SELECT DATE */}
                  <div className="px-4 pt-3.5 pb-3">
                    <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={cn(
                          "text-[10px] font-bold uppercase tracking-widest transition-colors",
                          validationErrors.date ? "text-red-600 font-extrabold" : "text-gray-500"
                        )}>
                          Select Delivery Date *
                        </p>
                        {validationErrors.date && (
                          <span className="text-xs font-bold text-red-600 flex items-center gap-1 animate-pulse">
                            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-red-600" />
                            Please select a delivery date
                          </span>
                        )}
                      </div>
                      {selectedDateIndex !== null && (
                        <span className="text-xs font-semibold text-brand-rose">
                          Selected: {deliveryDays[selectedDateIndex]?.label}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                      {deliveryDays.map((day, idx) => {
                        const dayString = day.date.toISOString().split('T')[0];
                        const isClosed = closedDates.some((c) => c.date === dayString);
                        const dayName = idx === 0 ? 'Today' : idx === 1 ? 'Tmrw' : day.date.toLocaleDateString('en-IN', { weekday: 'short' });
                        const dateNum = day.date.getDate();
                        const monthName = day.date.toLocaleDateString('en-IN', { month: 'short' });
                        const isSelected = selectedDateIndex === idx;

                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              if (!isClosed) {
                                setSelectedDateIndex(idx);
                                setValidationErrors((prev) => ({ ...prev, date: false }));
                              }
                            }}
                            disabled={isClosed}
                            className={cn(
                              'flex-shrink-0 flex flex-col items-center justify-center w-[60px] py-2.5 rounded-xl border transition-all duration-200 cursor-pointer',
                              isSelected
                                ? 'bg-brand-rose text-white border-brand-rose shadow-md'
                                : 'bg-white text-gray-700 border-gray-200 hover:border-brand-rose/50 hover:bg-rose-50/20',
                              isClosed && 'opacity-40 cursor-not-allowed bg-gray-50'
                            )}
                          >
                            <span className={cn(
                              'text-[10px] font-semibold leading-none mb-1',
                              isSelected ? 'text-white/80' : 'text-gray-400'
                            )}>{dayName}</span>
                            <span className={cn(
                              'text-lg font-bold leading-none',
                              isSelected ? 'text-white' : 'text-gray-800',
                              isClosed && 'line-through'
                            )}>{dateNum}</span>
                            <span className={cn(
                              'text-[10px] font-medium leading-none mt-1',
                              isSelected ? 'text-white/80' : 'text-gray-400'
                            )}>{monthName}</span>
                            {isClosed && (
                              <span className="text-[8px] font-bold text-red-400 mt-0.5 uppercase">Closed</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Thin divider */}
                  <div className="mx-4 h-px bg-gray-100" />

                  {/* SELECT TIME */}
                  <div className="px-4 pt-3 pb-4">
                    <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={cn(
                          "text-[10px] font-bold uppercase tracking-widest transition-colors",
                          validationErrors.slot ? "text-red-600 font-extrabold" : "text-gray-500"
                        )}>
                          Select Delivery Time Slot *
                        </p>
                        {validationErrors.slot && (
                          <span className="text-xs font-bold text-red-600 flex items-center gap-1 animate-pulse">
                            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-red-600" />
                            Please select a delivery time slot
                          </span>
                        )}
                      </div>
                      {selectedTimeSlot && (
                        <span className="text-xs font-semibold text-brand-rose">
                          Slot: {selectedTimeSlot}
                        </span>
                      )}
                    </div>

                    {selectedDateIndex === null ? (
                      <div className={cn(
                        "flex items-center gap-2.5 p-3.5 rounded-xl border transition-all",
                        validationErrors.slot
                          ? "bg-red-50/60 border-red-300 text-red-700"
                          : "bg-gray-50 border-gray-200 text-gray-600"
                      )}>
                        <Calendar className={cn("h-4 w-4 flex-shrink-0", validationErrors.slot ? "text-red-600" : "text-brand-rose")} />
                        <span className="text-xs font-medium">
                          Please select a delivery date above to view available delivery time slots.
                        </span>
                      </div>
                    ) : availableSlots.length === 0 ? (
                      <div className="flex items-center gap-2 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800">
                        <AlertCircle className="h-4 w-4 flex-shrink-0 text-amber-600" />
                        <span className="text-xs font-semibold">
                          Today&apos;s delivery slots have ended. Please select Tomorrow or an upcoming date for fresh delivery.
                        </span>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {availableSlots.map((slot) => {
                          const isSelected = selectedTimeSlot === slot.label;
                          return (
                            <button
                              key={slot.label}
                              type="button"
                              onClick={() => {
                                setSelectedTimeSlot(slot.label);
                                setValidationErrors((prev) => ({ ...prev, slot: false }));
                              }}
                              className={cn(
                                'flex items-center justify-between px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold border transition-all duration-200 cursor-pointer text-left',
                                isSelected
                                  ? 'bg-brand-rose text-white border-brand-rose shadow-md shadow-brand-rose/25 font-bold'
                                  : 'bg-white text-gray-700 border-gray-200 hover:border-brand-rose/60 hover:text-brand-rose hover:bg-rose-50/30'
                              )}
                            >
                              <span className="flex items-center gap-2.5 min-w-0">
                                <Clock className={cn("w-4 h-4 flex-shrink-0", isSelected ? "text-white" : "text-brand-rose")} />
                                <span className="truncate">{slot.label}</span>
                              </span>
                              {isSelected && (
                                <Check className="w-4 h-4 text-white flex-shrink-0 ml-1.5" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {availableSlots.length > 0 && (
                      <p className="mt-2.5 text-[10px] text-gray-400 leading-relaxed">
                        ⚡ Bakery Kitchen: Freshly baked &amp; dispatched across Vadodara right on time.
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Divider */}
              <motion.div variants={fadeIn} className="my-5 h-px bg-border-secondary" />

              {isDateClosed && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-brand-red/10 border border-brand-red/20 text-brand-red mb-5 animate-pulse">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-semibold text-sm">Delivery Blocked</h5>
                    <p className="text-xs mt-0.5 opacity-90">
                      Our shop is closed on this date: <span className="font-semibold">{isDateClosed.reason || 'Shop Closed'}</span>. Please select another delivery date.
                    </p>
                  </div>
                </div>
              )}

              {/* (g) Quantity Selector */}
              <motion.div variants={fadeInUp} className="flex items-center gap-4 mt-5">
                <label className="text-sm font-semibold text-text-primary">Quantity</label>
                <div className="flex items-center border-2 border-border-secondary rounded-full overflow-hidden bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="w-9 h-9 flex items-center justify-center text-text-secondary hover:text-brand-rose hover:bg-brand-rose/5 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 text-sm font-bold text-text-primary min-w-[36px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    disabled={quantity >= 10}
                    className="w-9 h-9 flex items-center justify-center text-text-secondary hover:text-brand-rose hover:bg-brand-rose/5 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>

              {/* (h) Action Buttons — desktop */}
              <motion.div variants={fadeInUp} className="mt-6 space-y-3 hidden lg:block">
                {/* TOTAL + Add to Cart */}
                <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3.5 flex items-center justify-between gap-3 shadow-sm">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Total Amount
                    </p>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-2xl font-bold text-gray-900">
                        {formatPrice(currentPrice * quantity)}
                      </span>
                      {compareAtPrice > currentPrice && (
                        <span className="text-sm text-gray-400 line-through">
                          {formatPrice(compareAtPrice * quantity)}
                        </span>
                      )}
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleAddToCart}
                    className="flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-brand-rose text-white font-bold text-sm shadow-lg shadow-brand-rose/30 transition-all duration-300 hover:bg-brand-rose-dark hover:shadow-brand-rose/50 cursor-pointer whitespace-nowrap"
                  >
                    <ShoppingBag className="h-4.5 w-4.5" />
                    <span>Add to Cart</span>
                  </motion.button>
                </div>

                {/* Wishlist — Giftlaya style: circular border pill button */}
                <button
                  onClick={handleToggleWishlist}
                  className={cn(
                    'w-full flex items-center justify-center gap-2.5 py-3 rounded-full border-2 text-sm font-semibold transition-all duration-300 cursor-pointer',
                    isWishlisted
                      ? 'bg-brand-rose/8 border-brand-rose text-brand-rose'
                      : 'bg-white border-border-secondary text-text-secondary hover:border-brand-rose/60 hover:text-brand-rose hover:bg-brand-rose/5'
                  )}
                >
                  <Heart
                    className={cn(
                      'h-4 w-4 transition-all duration-300',
                      isWishlisted ? 'fill-brand-rose text-brand-rose scale-110' : ''
                    )}
                  />
                  {isWishlisted ? '♥ In Wishlist' : '♡ Add to Wishlist'}
                </button>
              </motion.div>

              {/* (i) Trust Badges — Giftlaya style: white cards */}
              <motion.div
                variants={fadeInUp}
                className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3"
              >
                {[
                  { icon: <Truck className="h-5 w-5" />, label: 'Free Delivery', sub: '₹999+' },
                  { icon: <Sparkles className="h-5 w-5" />, label: '100% Fresh', sub: 'Guaranteed' },
                  { icon: <Clock className="h-5 w-5" />, label: 'Express', sub: '60-90 Min' },
                  { icon: <Zap className="h-5 w-5" />, label: 'Same Day', sub: 'Available' },
                ].map((badge, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center gap-1.5 py-3.5 px-2 rounded-2xl bg-white border-2 border-border-secondary shadow-sm hover:border-brand-rose/30 hover:shadow-md transition-all duration-300"
                  >
                    <span className="text-brand-rose">{badge.icon}</span>
                    <span className="text-[11px] font-bold text-text-primary leading-tight text-center">
                      {badge.label}
                    </span>
                    <span className="text-[10px] text-text-muted">{badge.sub}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* ═══ PRODUCT DESCRIPTION TABS ═══ */}
          <motion.div
            ref={reviewsRef}
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="mt-16 lg:mt-24"
          >
            {/* Tab Headers */}
            <div className="flex gap-1 border-b border-border-secondary overflow-x-auto scrollbar-hide">
              {([
                { key: 'description' as const, label: 'Description' },
                { key: 'delivery' as const, label: 'Delivery Info' },
                { key: 'reviews' as const, label: `Reviews (${product.reviewCount})` },
              ]).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    'relative px-5 py-3.5 text-sm font-medium transition-colors duration-300 whitespace-nowrap cursor-pointer',
                    activeTab === tab.key
                      ? 'text-brand-rose'
                      : 'text-text-muted hover:text-text-primary'
                  )}
                >
                  {tab.label}
                  {activeTab === tab.key && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-rose rounded-full"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="py-8"
              >
                {/* Description Tab */}
                {activeTab === 'description' && (
                  <div className="max-w-3xl">
                    <p className="text-text-secondary leading-relaxed text-base whitespace-pre-line">
                      {product.description}
                    </p>
                    {product.tags.length > 0 && (
                      <div className="mt-6 flex flex-wrap gap-2">
                        {product.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 rounded-full text-xs font-medium bg-surface-secondary border border-border-secondary text-text-muted capitalize"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Delivery Info Tab */}
                {activeTab === 'delivery' && (
                  <div className="max-w-3xl space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-5 rounded-xl bg-surface-secondary border border-border-secondary">
                        <h4 className="font-semibold text-text-primary mb-2 flex items-center gap-2">
                          <Truck className="h-4 w-4 text-brand-rose" />
                          Delivery Areas
                        </h4>
                        <p className="text-sm text-text-secondary leading-relaxed">
                          We deliver across Vadodara, Gandhinagar, and surrounding areas within a 40km radius.
                        </p>
                      </div>
                      <div className="p-5 rounded-xl bg-surface-secondary border border-border-secondary">
                        <h4 className="font-semibold text-text-primary mb-2 flex items-center gap-2">
                          <Clock className="h-4 w-4 text-brand-rose" />
                          Delivery Timing
                        </h4>
                        <p className="text-sm text-text-secondary leading-relaxed">
                          Orders can be delivered between 9:00 AM and 10:00 PM with superfast express delivery across Vadodara.
                        </p>
                      </div>
                      <div className="p-5 rounded-xl bg-surface-secondary border border-border-secondary">
                        <h4 className="font-semibold text-text-primary mb-2 flex items-center gap-2">
                          <ShieldCheck className="h-4 w-4 text-brand-rose" />
                          Freshness Guarantee
                        </h4>
                        <p className="text-sm text-text-secondary leading-relaxed">
                          All items are prepared fresh on the day of delivery. We guarantee 100% freshness or your money back.
                        </p>
                      </div>
                      <div className="p-5 rounded-xl bg-surface-secondary border border-border-secondary">
                        <h4 className="font-semibold text-text-primary mb-2 flex items-center gap-2">
                          <Gift className="h-4 w-4 text-brand-rose" />
                          Gift Wrapping
                        </h4>
                        <p className="text-sm text-text-secondary leading-relaxed">
                          All orders include complimentary premium gift packaging with a personalized greeting card.
                        </p>
                      </div>
                    </div>

                    <div className="p-5 rounded-xl bg-brand-rose/5 border border-brand-rose/20">
                      <h4 className="font-semibold text-brand-rose mb-2">Delivery Time Slots Across Vadodara</h4>
                      <p className="text-xs text-text-secondary mb-3">
                        Choose your preferred time slot for guaranteed on-time doorstep delivery:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {deliverySlots.map((slot) => (
                          <div key={slot.label} className="flex items-center gap-2 text-sm text-text-secondary bg-white p-2.5 rounded-lg border border-border-secondary">
                            <Clock className="w-4 h-4 text-brand-rose flex-shrink-0" />
                            <span className="font-medium text-gray-800">{formatTimeSlotDisplay(slot.label)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === 'reviews' && (
                  <div className="max-w-4xl">
                    {/* Reviews Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8 mb-8">
                      {/* Average rating */}
                      <div className="text-center p-6 rounded-xl bg-surface-secondary border border-border-secondary">
                        <div className="text-5xl font-bold text-brand-rose mb-2">{product.rating}</div>
                        <StarRating rating={product.rating} size="lg" />
                        <p className="mt-2 text-sm text-text-muted">
                          Based on {product.reviewCount} reviews
                        </p>
                      </div>

                      {/* Distribution */}
                      <div className="flex flex-col justify-center gap-2">
                        {[5, 4, 3, 2, 1].map((stars) => (
                          <RatingBar
                            key={stars}
                            stars={stars}
                            count={ratingDistribution[stars - 1]}
                            total={mockReviews.length}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Individual Reviews */}
                    <div className="space-y-4">
                      {mockReviews.map((review) => (
                        <motion.div
                          key={review.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-5 rounded-xl bg-surface-secondary border border-border-secondary"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-text-primary text-sm">
                                  {review.userName}
                                </span>
                                {review.isVerified && (
                                  <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                                    <Check className="h-3 w-3" />
                                    Verified
                                  </span>
                                )}
                              </div>
                              <StarRating rating={review.rating} />
                            </div>
                            <div className="text-right">
                              <span className="text-xs text-text-muted">
                                {new Date(review.date).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </span>
                              <span className="block text-[10px] text-brand-rose mt-0.5">
                                {review.occasion}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-text-secondary leading-relaxed">
                            {review.comment}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* ═══ RELATED PRODUCTS ═══ */}
          {relatedProducts.length > 0 && (
            <motion.section
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              className="mt-16 lg:mt-24 pb-8"
            >
              <motion.div variants={fadeInUp} className="text-center mb-8">
                <span className="inline-block mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-brand-rose">
                  Discover More
                </span>
                <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-text-primary mb-5">
                  You Might Also{' '}
                  <span className="text-gradient-rose">Like</span>
                </h2>

                {/* Category Filter Tabs */}
                <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar py-1">
                  {[
                    { key: 'all', label: `All Recommendations (${relatedProducts.length})` },
                    { key: 'cakes', label: '🎂 Fresh Cakes (3)' },
                    { key: 'flowers', label: '💐 Flower Bouquets (3)' },
                    { key: 'combos', label: '🎁 Combos & Hampers (3)' },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveRelatedTab(tab.key as any)}
                      className={cn(
                        'px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap',
                        activeRelatedTab === tab.key
                          ? 'bg-brand-rose text-white shadow-sm'
                          : 'bg-white border-2 border-border-secondary text-text-secondary hover:border-brand-rose/50 hover:bg-rose-50/20'
                      )}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </motion.div>

              <motion.div
                variants={staggerContainer}
                className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6"
              >
                {filteredRelated.map((p) => (
                  <RelatedProductCard key={p.id} product={p} />
                ))}
              </motion.div>
            </motion.section>
          )}
        </Container>

        {/* ═══ STICKY FOOTER ACTION BAR (DESKTOP & MOBILE) ═══ */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-[0_-4px_25px_rgba(0,0,0,0.1)]">
          <Container as="div" size="xl">
            <div className="flex items-center justify-between gap-3 px-1 py-3 sm:py-3.5">
              {/* Price display & Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-xl sm:text-2xl font-bold text-brand-rose">
                    {formatPrice(currentPrice * quantity)}
                  </span>
                  {compareAtPrice > currentPrice && (
                    <span className="text-xs sm:text-sm text-gray-400 line-through">
                      {formatPrice(compareAtPrice * quantity)}
                    </span>
                  )}
                  {discount > 0 && (
                    <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-rose-50 text-brand-rose text-[11px] font-bold">
                      {discount}% OFF
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-gray-500 truncate">
                  {selectedVariant ? selectedVariant.weight : '500g'} • {selectedDateIndex !== null ? deliveryDays[selectedDateIndex]?.label : 'Select Date'}{selectedTimeSlot ? ` • ${selectedTimeSlot}` : ''}{cakeMessage ? ` • "${cakeMessage}"` : ''}
                </p>
              </div>

              {/* Wishlist Button */}
              <button
                onClick={handleToggleWishlist}
                className={cn(
                  'flex-shrink-0 flex items-center gap-1.5 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-full border-2 text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer',
                  isWishlisted
                    ? 'bg-brand-rose/10 border-brand-rose text-brand-rose'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-brand-rose/50 hover:text-brand-rose'
                )}
                aria-label="Toggle wishlist"
              >
                <Heart
                  className={cn(
                    'h-4 w-4 transition-all duration-300',
                    isWishlisted ? 'fill-brand-rose text-brand-rose scale-110' : 'text-gray-500'
                  )}
                />
                <span className="hidden sm:inline">{isWishlisted ? 'In Wishlist' : 'Add to Wishlist'}</span>
              </button>

              {/* Add to Cart — Prominent CTA */}
              <motion.button
                whileTap={{ scale: 0.96 }}
                whileHover={{ scale: 1.02 }}
                onClick={handleAddToCart}
                className="flex-shrink-0 flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-brand-rose text-white font-bold text-xs sm:text-sm shadow-lg shadow-brand-rose/35 hover:bg-brand-rose-dark transition-all cursor-pointer"
              >
                <ShoppingBag className="h-4 w-4" />
                Add to Cart
              </motion.button>
            </div>
          </Container>
        </div>

        {/* ═══ ADD-ON ITEMS MODAL ("Make it Extra Special" — IGP & Winni style) ═══ */}
        <AddonModal
          isOpen={isAddonModalOpen}
          onClose={() => setIsAddonModalOpen(false)}
          onConfirm={handleConfirmAddons}
          cakeName={product.name}
          cakePrice={currentPrice * quantity}
        />
      </main>
  );
}
