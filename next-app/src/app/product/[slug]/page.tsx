"use client";

// ============================================
// Product Detail Page — Cake Connection
// The single most important conversion page
// ============================================

import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
} from 'lucide-react';

import { Container } from '@/components/ui';
import { SEOHead } from '@/components/seo/SEOHead';
import { cn, formatPrice, getDiscountPercent, getWhatsAppLink } from '@/utils';
import { getProductBySlug, getRelatedProducts, getReviewsByProductId } from '@/lib/db';
import {
  DELIVERY_SPEED_OPTIONS,
  TIME_SLOTS,
  type DeliverySpeedOption,
} from '@/data/pricing';
import { useCartStore, useWishlistStore, useUIStore } from '@/stores';
import type { Product, ProductVariant } from '@/types';


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

function getDeliveryIcon(value: string) {
  switch (value) {
    case '2hr': return <Zap className="h-3.5 w-3.5" />;
    case '4hr': return <Clock className="h-3.5 w-3.5" />;
    case '6hr': return <Timer className="h-3.5 w-3.5" />;
    case 'same-day': return <Truck className="h-3.5 w-3.5" />;
    case 'next-day': return <Calendar className="h-3.5 w-3.5" />;
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
      <SEOHead title="Product Not Found" description="The product you're looking for doesn't exist." noIndex />
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
export default function ProductPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;
  const router = useRouter();
  const reviewsRef = useRef<HTMLDivElement>(null);

  // ── State ──
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedDelivery, setSelectedDelivery] = useState<string>('same-day');
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>(TIME_SLOTS[2]);
  const [quantity, setQuantity] = useState(1);
  const [cakeMessage, setCakeMessage] = useState('');
  const [isCakeMessageOpen, setIsCakeMessageOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'delivery' | 'reviews'>('description');
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [isImageZoomed, setIsImageZoomed] = useState(false);

  // ── Stores ──
  const addItem = useCartStore((s) => s.addItem);
  const wishlist = useWishlistStore();
  const addToast = useUIStore((s) => s.addToast);

  // ── Fetch Data ──
  useEffect(() => {
    if (!slug) return;
    async function loadProductData() {
      try {
        setLoading(true);
        const prod = await getProductBySlug(slug);
        if (prod) {
          router.replace(`/${prod.category}/${prod.slug}`);
          return;
        }
      } catch (err) {
        console.error('Error fetching product details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProductData();
  }, [slug]);

  // ── Derived data ──
  const deliveryDays = useMemo(() => getNext7Days(), []);

  const isCake = product?.category === 'cakes';

  const availableDeliveryOptions = useMemo(() => {
    if (!product) return [];
    return DELIVERY_SPEED_OPTIONS.filter((opt) =>
      product.deliveryOptions.includes(opt.value)
    );
  }, [product]);

  const deliverySurcharge = useMemo(() => {
    const opt = DELIVERY_SPEED_OPTIONS.find((d) => d.value === selectedDelivery);
    return opt?.surcharge || 0;
  }, [selectedDelivery]);

  const currentPrice = useMemo(() => {
    if (!selectedVariant) return 0;
    return selectedVariant.price + deliverySurcharge;
  }, [selectedVariant, deliverySurcharge]);

  const compareAtPrice = useMemo(() => {
    if (!selectedVariant?.compareAtPrice) return 0;
    return selectedVariant.compareAtPrice + deliverySurcharge;
  }, [selectedVariant, deliverySurcharge]);

  const discount = useMemo(() => {
    if (!compareAtPrice || compareAtPrice <= currentPrice) return 0;
    return getDiscountPercent(currentPrice, compareAtPrice);
  }, [currentPrice, compareAtPrice]);

  const isWishlisted = product ? wishlist.isInWishlist(product.id) : false;

  // Rating distribution
  const ratingDistribution = useMemo(() => {
    const dist = [0, 0, 0, 0, 0]; // 1-5 stars
    reviews.forEach((r) => {
      if (r.rating >= 1 && r.rating <= 5) {
        dist[r.rating - 1]++;
      }
    });
    return dist;
  }, [reviews]);

  // ── Handlers ──

  const handleAddToCart = useCallback(() => {
    if (!product || !selectedVariant) return;
    const deliveryDate = deliveryDays[selectedDateIndex]?.date.toISOString().split('T')[0];

    addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      name: product.name,
      image: product.images[0]?.url || '',
      weight: selectedVariant.weight,
      flavour: product.flavour,
      price: currentPrice,
      quantity,
      customMessage: cakeMessage || undefined,
      deliverySpeed: selectedDelivery,
      deliveryDate,
      deliverySlot: selectedTimeSlot,
    });

    addToast({
      type: 'success',
      message: `${product.name} added to cart!`,
      duration: 3000,
    });
  }, [product, selectedVariant, currentPrice, quantity, cakeMessage, selectedDelivery, selectedDateIndex, selectedTimeSlot, deliveryDays, addItem, addToast]);

  const handleWhatsApp = useCallback(() => {
    if (!product || !selectedVariant) return;
    const msg = `Hi! I'd like to order:\n\n🎂 *${product.name}*\n📦 ${selectedVariant.weight}\n💰 ${formatPrice(currentPrice)}\n🚚 Delivery: ${selectedDelivery}\n📅 ${deliveryDays[selectedDateIndex]?.label}\n⏰ ${selectedTimeSlot}${cakeMessage ? `\n✉️ Message: "${cakeMessage}"` : ''}\n\nPlease confirm availability!`;
    const url = getWhatsAppLink(msg);
    window.open(url, '_blank');
  }, [product, selectedVariant, currentPrice, selectedDelivery, selectedDateIndex, selectedTimeSlot, cakeMessage, deliveryDays]);

  const handleToggleWishlist = useCallback(() => {
    if (!product || !selectedVariant) return;
    wishlist.toggleItem({
      productId: product.id,
      name: product.name,
      image: product.images[0]?.url || '',
      price: selectedVariant.price,
      addedAt: new Date().toISOString(),
    });
    addToast({
      type: isWishlisted ? 'info' : 'success',
      message: isWishlisted ? 'Removed from wishlist' : 'Added to wishlist ❤️',
      duration: 2000,
    });
  }, [product, selectedVariant, wishlist, isWishlisted, addToast]);

  const scrollToReviews = useCallback(() => {
    setActiveTab('reviews');
    setTimeout(() => {
      reviewsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-white text-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-rose"></div>
      </div>
    );
  }

  if (!product) return <ProductNotFound />;

  // ════════════════════════════════════════════
  //  RENDER
  // ════════════════════════════════════════════

  return (
    <>
      {/* ── SEO Head ── */}
      <SEOHead
        title={product.name}
        description={product.shortDescription}
        type="product"
        ogImage={product.images[0]?.url}
        keywords={product.tags.join(', ')}
        schema={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.name,
          description: product.description,
          image: product.images.map((i) => i.url),
          offers: {
            '@type': 'Offer',
            priceCurrency: 'INR',
            price: selectedVariant?.price || product.variants[0].price,
            availability: product.isAvailable
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
          },
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: product.rating,
            reviewCount: product.reviewCount,
          },
        }}
      />

      <main className="relative pb-24 lg:pb-12">
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
              <div className="relative rounded-2xl overflow-hidden bg-surface-secondary border border-border-secondary aspect-[4/5] sm:aspect-[4/4] lg:aspect-[4/5]">
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
                    <span className="rounded-full bg-emerald-600/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
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
                <span className="inline-block mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-brand-rose bg-brand-rose/10 px-3 py-1 rounded-full">
                  {getCategoryLabel(product.category)}
                </span>
                <h1 className="font-display text-3xl lg:text-4xl font-bold text-text-primary leading-tight">
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
              <motion.div variants={fadeInUp}>
                <label className="block text-sm font-semibold text-text-primary mb-3">
                  {isCake ? 'Select Weight' : 'Select Variant'}
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={cn(
                        'px-4 py-2.5 rounded-xl text-sm font-medium border transition-all duration-300 cursor-pointer',
                        selectedVariant?.id === v.id
                          ? 'bg-brand-rose text-white border-brand-rose shadow-lg shadow-brand-rose/20'
                          : 'bg-surface-secondary text-text-secondary border-border-secondary hover:border-brand-rose/40 hover:text-text-primary'
                      )}
                    >
                      {v.weight}
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* (c) Dynamic Price Display */}
              <motion.div variants={fadeInUp} className="mt-5">
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
                </div>
                <p className="mt-1 text-xs text-text-muted">Inclusive of all taxes</p>
                {deliverySurcharge > 0 && (
                  <p className="mt-0.5 text-xs text-text-muted">
                    Includes {formatPrice(deliverySurcharge)} delivery surcharge
                  </p>
                )}
              </motion.div>

              {/* Divider */}
              <motion.div variants={fadeIn} className="my-5 h-px bg-border-secondary" />

              {/* (d) Delivery Options */}
              {availableDeliveryOptions.length > 0 && (
                <motion.div variants={fadeInUp}>
                  <label className="block text-sm font-semibold text-text-primary mb-3">
                    Delivery Speed
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableDeliveryOptions.map((opt: DeliverySpeedOption) => (
                      <button
                        key={opt.value}
                        onClick={() => setSelectedDelivery(opt.value)}
                        className={cn(
                          'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm border transition-all duration-300 cursor-pointer',
                          selectedDelivery === opt.value
                            ? 'bg-brand-rose text-white border-brand-rose shadow-lg shadow-brand-rose/20'
                            : 'bg-surface-secondary text-text-secondary border-border-secondary hover:border-brand-rose/40 hover:text-text-primary'
                        )}
                      >
                        {getDeliveryIcon(opt.value)}
                        <span className="font-medium">{opt.label}</span>
                        {opt.surcharge > 0 && (
                          <span className={cn(
                            'text-[10px] ml-1',
                            selectedDelivery === opt.value ? 'text-white/70' : 'text-text-muted'
                          )}>
                            +{formatPrice(opt.surcharge)}
                          </span>
                        )}
                        {opt.surcharge === 0 && (
                          <span className={cn(
                            'text-[10px] ml-1 font-semibold',
                            selectedDelivery === opt.value ? 'text-white/90' : 'text-emerald-500'
                          )}>
                            FREE
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* (e) Delivery Date & Time Slot */}
              <motion.div variants={fadeInUp} className="mt-5 space-y-4">
                {/* Date pills */}
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-3">
                    Delivery Date
                  </label>
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {deliveryDays.map((day, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedDateIndex(idx)}
                        className={cn(
                          'flex-shrink-0 flex flex-col items-center px-4 py-2.5 rounded-xl text-xs border transition-all duration-300 cursor-pointer min-w-[70px]',
                          selectedDateIndex === idx
                            ? 'bg-brand-rose text-white border-brand-rose shadow-lg shadow-brand-rose/20'
                            : 'bg-surface-secondary text-text-secondary border-border-secondary hover:border-brand-rose/40 hover:text-text-primary'
                        )}
                      >
                        <span className="font-semibold text-sm">{day.shortLabel}</span>
                        {idx > 1 && (
                          <span className={cn(
                            'text-[10px] mt-0.5',
                            selectedDateIndex === idx ? 'text-white/70' : 'text-text-muted'
                          )}>
                            {day.date.toLocaleDateString('en-IN', { month: 'short' })}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time slot pills */}
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-3">
                    Time Slot
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {TIME_SLOTS.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setSelectedTimeSlot(slot)}
                        className={cn(
                          'px-3 py-2 rounded-xl text-xs font-medium border transition-all duration-300 cursor-pointer',
                          selectedTimeSlot === slot
                            ? 'bg-brand-rose text-white border-brand-rose shadow-lg shadow-brand-rose/20'
                            : 'bg-surface-secondary text-text-secondary border-border-secondary hover:border-brand-rose/40 hover:text-text-primary'
                        )}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* (f) Custom Message on Cake */}
              {isCake && (
                <motion.div variants={fadeInUp} className="mt-5">
                  <button
                    onClick={() => setIsCakeMessageOpen(!isCakeMessageOpen)}
                    className="flex items-center gap-2 text-sm font-semibold text-text-primary hover:text-brand-rose transition-colors cursor-pointer w-full"
                  >
                    <Gift className="h-4 w-4 text-brand-rose" />
                    Add Message on Cake
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 ml-auto transition-transform duration-300',
                        isCakeMessageOpen && 'rotate-180'
                      )}
                    />
                  </button>
                  <AnimatePresence>
                    {isCakeMessageOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="pt-3">
                          <div className="relative">
                            <input
                              type="text"
                              maxLength={50}
                              value={cakeMessage}
                              onChange={(e) => setCakeMessage(e.target.value)}
                              placeholder="e.g., Happy Birthday, Priya!"
                              className="w-full bg-surface-secondary border border-border-secondary rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-rose/50 focus:shadow-[0_0_12px_rgba(183,110,121,0.15)] transition-all duration-300"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-text-muted">
                              {cakeMessage.length}/50
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* Divider */}
              <motion.div variants={fadeIn} className="my-5 h-px bg-border-secondary" />

              {/* (g) Quantity Selector */}
              <motion.div variants={fadeInUp} className="flex items-center gap-4">
                <label className="text-sm font-semibold text-text-primary">Quantity</label>
                <div className="flex items-center border border-border-secondary rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="px-3 py-2 text-text-secondary hover:text-text-primary hover:bg-surface-tertiary transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 text-sm font-semibold text-text-primary min-w-[40px] text-center bg-surface-secondary">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    disabled={quantity >= 10}
                    className="px-3 py-2 text-text-secondary hover:text-text-primary hover:bg-surface-tertiary transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>

              {/* (h) Action Buttons — desktop */}
              <motion.div variants={fadeInUp} className="mt-6 space-y-3 hidden lg:block">
                {/* Add to Cart */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  className="w-full flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-brand-rose text-white font-semibold text-base shadow-lg shadow-brand-rose/20 transition-all duration-300 hover:bg-brand-rose-dark hover:shadow-brand-rose/40 cursor-pointer"
                >
                  <ShoppingBag className="h-5 w-5" />
                  Add to Cart — {formatPrice(currentPrice * quantity)}
                </motion.button>

                {/* WhatsApp */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleWhatsApp}
                  className="w-full flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-emerald-600 text-white font-semibold text-sm shadow-lg shadow-emerald-600/20 transition-all duration-300 hover:bg-emerald-700 hover:shadow-emerald-600/40 cursor-pointer"
                >
                  <MessageCircle className="h-4.5 w-4.5" />
                  Order on WhatsApp
                </motion.button>

                {/* Wishlist */}
                <button
                  onClick={handleToggleWishlist}
                  className="w-full flex items-center justify-center gap-2 py-3 text-sm font-medium text-text-secondary hover:text-brand-rose transition-colors cursor-pointer"
                >
                  <Heart
                    className={cn(
                      'h-4 w-4 transition-colors',
                      isWishlisted ? 'fill-brand-rose text-brand-rose' : ''
                    )}
                  />
                  {isWishlisted ? 'In Wishlist' : 'Add to Wishlist'}
                </button>
              </motion.div>

              {/* (i) Trust Badges */}
              <motion.div
                variants={fadeInUp}
                className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3"
              >
                {[
                  { icon: <Truck className="h-5 w-5" />, label: 'Free Delivery', sub: '₹999+' },
                  { icon: <Sparkles className="h-5 w-5" />, label: '100% Fresh', sub: 'Guaranteed' },
                  { icon: <Clock className="h-5 w-5" />, label: 'Midnight', sub: 'Delivery' },
                  { icon: <Zap className="h-5 w-5" />, label: 'Same Day', sub: 'Available' },
                ].map((badge, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl bg-surface-secondary/50 border border-border-secondary"
                  >
                    <span className="text-brand-rose">{badge.icon}</span>
                    <span className="text-[11px] font-semibold text-text-primary leading-tight text-center">
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
                          Orders can be delivered between 8:00 AM and 10:00 PM. Midnight delivery available for special occasions.
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
                      <h4 className="font-semibold text-brand-rose mb-2">Available Delivery Options</h4>
                      <div className="space-y-2">
                        {availableDeliveryOptions.map((opt) => (
                          <div key={opt.value} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2 text-text-secondary">
                              {getDeliveryIcon(opt.value)}
                              <span>{opt.label}</span>
                              <span className="text-text-muted text-xs">— {opt.description}</span>
                            </div>
                            <span className={cn(
                              'font-medium',
                              opt.surcharge === 0 ? 'text-emerald-500' : 'text-text-primary'
                            )}>
                              {opt.surcharge === 0 ? 'FREE' : `+${formatPrice(opt.surcharge)}`}
                            </span>
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
                            total={reviews.length}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Individual Reviews */}
                    <div className="space-y-4">
                      {reviews.map((review) => (
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
                                {new Date(review.createdAt).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </span>
                              {(review.occasion) && (
                                <span className="block text-[10px] text-brand-rose mt-0.5">
                                  {review.occasion}
                                </span>
                              )}
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
              <motion.div variants={fadeInUp} className="text-center mb-10">
                <span className="inline-block mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-brand-rose">
                  Discover More
                </span>
                <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-text-primary">
                  You Might Also{' '}
                  <span className="text-gradient-rose">Like</span>
                </h2>
              </motion.div>

              <motion.div
                variants={staggerContainer}
                className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
              >
                {relatedProducts.map((p) => (
                  <RelatedProductCard key={p.id} product={p} />
                ))}
              </motion.div>
            </motion.section>
          )}
        </Container>

        {/* ═══ MOBILE STICKY BOTTOM BAR ═══ */}
        <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
          <div className="glass border-t border-border-secondary">
            <div className="flex items-center gap-3 px-4 py-3">
              {/* Price display */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-brand-rose">
                    {formatPrice(currentPrice * quantity)}
                  </span>
                  {discount > 0 && (
                    <span className="text-xs text-text-muted line-through">
                      {formatPrice(compareAtPrice * quantity)}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-text-muted truncate">
                  {selectedVariant?.weight} • {deliveryDays[selectedDateIndex]?.label}
                </p>
              </div>

              {/* Wishlist mini */}
              <button
                onClick={handleToggleWishlist}
                className="flex-shrink-0 p-2.5 rounded-xl border border-border-secondary transition-colors cursor-pointer"
                aria-label="Toggle wishlist"
              >
                <Heart
                  className={cn(
                    'h-5 w-5',
                    isWishlisted ? 'fill-brand-rose text-brand-rose' : 'text-text-secondary'
                  )}
                />
              </button>

              {/* Add to Cart */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleAddToCart}
                className="flex-shrink-0 flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-rose text-white font-semibold text-sm shadow-lg shadow-brand-rose/30 cursor-pointer"
              >
                <ShoppingBag className="h-4 w-4" />
                Add to Cart
              </motion.button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
