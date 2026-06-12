"use client";

// ============================================
// Cart Page — Cake Connection
// ============================================

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ShoppingBag,
  Trash2,
  Minus,
  Plus,
  Tag,
  ArrowRight,
  Home,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  RotateCcw,
  X,
  Gift,
  ChevronDown,
} from 'lucide-react';
import { Container } from '@/components/ui';
import { SEOHead } from '@/components/seo/SEOHead';
import { cn, formatPrice } from '@/utils';
import { useCartStore, useUIStore, useSiteStore } from '@/stores';

// ── Coupon logic ─────────────────────────────

interface Coupon {
  code: string;
  type: 'percent' | 'flat';
  value: number;
  label: string;
  minPurchase?: number;
}

// ── Animations ───────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
};

const itemVariant = {
  hidden: { opacity: 0, x: -20, scale: 0.95 },
  visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, x: 40, scale: 0.9, transition: { duration: 0.3 } },
};

const pageVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, staggerChildren: 0.08, delayChildren: 0.1 } },
};

// ── Free delivery threshold ──────────────────

const FREE_DELIVERY_THRESHOLD = 999;

// ── Cart Item Component ──────────────────────

function CartItemCard({
  item,
  onUpdateQty,
  onRemove,
}: {
  item: ReturnType<typeof useCartStore.getState>['items'][0];
  onUpdateQty: (qty: number) => void;
  onRemove: () => void;
}) {
  return (
    <motion.div
      variants={itemVariant}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
      className="flex gap-4 p-4 sm:p-5 rounded-2xl bg-surface-secondary border border-border-secondary hover:border-brand-rose/20 transition-all duration-300"
    >
      {/* Image */}
      <Link href={`/cakes/${item.productId}`} className="flex-shrink-0">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-surface-tertiary">
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover"
          />
        </div>
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-display text-base sm:text-lg font-semibold text-text-primary truncate">
              {item.name}
            </h3>
            <p className="text-xs text-text-muted mt-0.5">
              {item.weight}
              {item.flavour && ` • ${item.flavour.charAt(0).toUpperCase() + item.flavour.slice(1)}`}
            </p>
          </div>
          {/* Remove */}
          <button
            onClick={onRemove}
            aria-label="Remove item"
            className="flex-shrink-0 p-1.5 text-text-muted hover:text-brand-red transition-colors cursor-pointer rounded-lg hover:bg-brand-red/10"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        {/* Delivery info */}
        {item.deliverySpeed && (
          <p className="text-[11px] text-text-muted mt-1.5">
            🚚 {item.deliverySpeed} • {item.deliveryDate} • {item.deliverySlot}
          </p>
        )}

        {/* Cake message */}
        {item.customMessage && (
          <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-brand-rose-gold italic">
            <Gift className="h-3 w-3" />
            "{item.customMessage}"
          </div>
        )}

        {/* Bottom row: qty + price */}
        <div className="flex items-center justify-between mt-3">
          {/* Quantity */}
          <div className="flex items-center gap-0 rounded-xl border border-border-secondary bg-surface-tertiary overflow-hidden">
            <button
              onClick={() => onUpdateQty(Math.max(1, item.quantity - 1))}
              disabled={item.quantity <= 1}
              className="p-2 text-text-secondary hover:text-text-primary disabled:opacity-30 transition-colors cursor-pointer"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-8 text-center text-sm font-semibold text-text-primary">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQty(Math.min(10, item.quantity + 1))}
              disabled={item.quantity >= 10}
              className="p-2 text-text-secondary hover:text-text-primary disabled:opacity-30 transition-colors cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Price */}
          <span className="text-lg font-bold text-brand-rose">
            {formatPrice(item.price * item.quantity)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main Page ────────────────────────────────

export default function CartPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clearCart = useCartStore((s) => s.clearCart);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const getDeliveryCharge = useCartStore((s) => s.getDeliveryCharge);
  const getTotal = useCartStore((s) => s.getTotal);
  const getItemCount = useCartStore((s) => s.getItemCount);
  const addToast = useUIStore((s) => s.addToast);

  const { coupons, fetchSettings } = useSiteStore();

  const [mounted, setMounted] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponOpen, setCouponOpen] = useState(false);
  const [couponError, setCouponError] = useState('');

  useEffect(() => {
    setMounted(true);
    fetchSettings();
  }, [fetchSettings]);

  const subtotal = getSubtotal();
  const deliveryCharge = getDeliveryCharge();
  const itemCount = getItemCount();

  useEffect(() => {
    if (appliedCoupon && subtotal < (appliedCoupon.minPurchase || 0)) {
      setAppliedCoupon(null);
      addToast({ type: 'warning', message: 'Coupon removed as subtotal fell below minimum requirement' });
    }
  }, [subtotal, appliedCoupon, addToast]);

  const couponDiscount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === 'percent') return Math.round(subtotal * appliedCoupon.value / 100);
    return Math.min(appliedCoupon.value, subtotal);
  }, [appliedCoupon, subtotal]);

  const finalTotal = subtotal + deliveryCharge - couponDiscount;
  const freeDeliveryProgress = Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100);
  const amountToFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);

  const handleApplyCoupon = () => {
    setCouponError('');
    const codeClean = couponInput.toUpperCase().trim();
    const found = coupons.find((c: any) => c.code === codeClean);
    if (!found) {
      setCouponError('Invalid coupon code');
      return;
    }

    if (found.status !== 'active') {
      setCouponError('This coupon is currently inactive');
      return;
    }

    const isExpired = new Date(found.expiry) < new Date(new Date().setHours(0, 0, 0, 0));
    if (isExpired) {
      setCouponError('This coupon has expired');
      return;
    }

    if (subtotal < (found.minPurchase || 0)) {
      setCouponError(`Minimum purchase of ₹${found.minPurchase} required`);
      return;
    }

    if (found.usageLimit && (found.usageCount || 0) >= found.usageLimit) {
      setCouponError('This coupon has reached its usage limit');
      return;
    }

    setAppliedCoupon({
      code: found.code,
      type: found.type,
      value: found.value,
      label: found.type === 'percent' ? `${found.value}% off` : `₹${found.value} off`,
      minPurchase: found.minPurchase,
    });
    addToast({ type: 'success', message: `Coupon "${found.code}" applied!` });
    setCouponInput('');
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    addToast({ type: 'info', message: 'Coupon removed' });
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-rose"></div>
      </div>
    );
  }


  // ── Empty Cart ──
  if (items.length === 0) {
    return (
      <>
        <SEOHead title="Your Cart" description="Review your cart items." noIndex />
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="min-h-[60vh] flex items-center justify-center px-4"
        >
          <div className="text-center max-w-md">
            <div className="mb-6 mx-auto w-24 h-24 rounded-full bg-surface-secondary border border-border-secondary flex items-center justify-center">
              <ShoppingBag className="h-10 w-10 text-text-muted" />
            </div>
            <h1 className="font-display text-3xl font-bold text-text-primary mb-3">
              Your Cart is Empty
            </h1>
            <p className="text-text-secondary mb-8">
              Looks like you haven't added any delicious treats yet. Browse our collection and find something you'll love!
            </p>
            <Link
              href="/cakes"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-brand-rose text-white font-semibold text-sm transition-all duration-300 hover:bg-brand-rose-dark hover:shadow-lg hover:shadow-brand-rose/30"
            >
              <Sparkles className="h-4 w-4" />
              Browse Collection
            </Link>
          </div>
        </motion.section>
      </>
    );
  }

  return (
    <>
      <SEOHead title="Your Cart" description="Review items in your cart before checkout." noIndex />

      <motion.div initial="hidden" animate="visible" variants={pageVariants}>
        {/* Hero */}
        <section className="relative overflow-hidden bg-surface-primary py-8 sm:py-12">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-brand-rose/[0.04] blur-3xl" />
          </div>
          <Container as="div" size="xl" className="relative">
            <motion.div variants={fadeUp}>
              <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-sm">
                <Link href="/" className="flex items-center gap-1 text-text-muted hover:text-brand-rose transition-colors">
                  <Home className="h-3.5 w-3.5" /> Home
                </Link>
                <ChevronRight className="h-3.5 w-3.5 text-text-muted/50" />
                <span className="text-text-accent font-medium">Cart</span>
              </nav>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-text-primary">
                Your <span className="text-gradient-rose">Cart</span>
              </h1>
              <p className="mt-2 text-text-secondary text-sm">
                {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
              </p>
            </motion.div>
          </Container>
        </section>

        {/* Main Content */}
        <section className="bg-brand-black pb-24 lg:pb-20">
          <Container as="div" size="xl">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 lg:gap-10">

              {/* Left: Cart Items */}
              <motion.div variants={fadeUp} className="space-y-4">
                {/* Clear All */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-text-muted">{itemCount} items</span>
                  <button
                    onClick={() => {
                      clearCart();
                      addToast({ type: 'info', message: 'Cart cleared' });
                    }}
                    className="flex items-center gap-1.5 text-xs text-text-muted hover:text-brand-red transition-colors cursor-pointer"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Clear All
                  </button>
                </div>

                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <CartItemCard
                      key={`${item.productId}-${item.variantId}`}
                      item={item}
                      onUpdateQty={(qty) => updateQuantity(item.productId, item.variantId, qty)}
                      onRemove={() => {
                        removeItem(item.productId, item.variantId);
                        addToast({ type: 'info', message: `${item.name} removed from cart` });
                      }}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Right: Order Summary */}
              <motion.div variants={fadeUp} className="hidden lg:block">
                <div className="sticky top-28 glass rounded-2xl p-6 space-y-5">
                  <h2 className="font-display text-xl font-semibold text-text-primary">
                    Order Summary
                  </h2>

                  {/* Free delivery progress */}
                  {subtotal < FREE_DELIVERY_THRESHOLD && (
                    <div className="rounded-xl bg-surface-secondary p-3 border border-border-secondary">
                      <p className="text-xs text-text-secondary mb-2">
                        Add <span className="text-brand-rose font-semibold">{formatPrice(amountToFreeDelivery)}</span> more for <span className="text-emerald-400 font-semibold">free delivery!</span>
                      </p>
                      <div className="h-1.5 bg-surface-tertiary rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${freeDeliveryProgress}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className="h-full bg-brand-rose rounded-full"
                        />
                      </div>
                    </div>
                  )}

                  {/* Price breakdown */}
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Subtotal</span>
                      <span className="text-text-primary font-medium">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Delivery</span>
                      <span className={cn('font-medium', deliveryCharge === 0 ? 'text-emerald-400' : 'text-text-primary')}>
                        {deliveryCharge === 0 ? 'FREE' : formatPrice(deliveryCharge)}
                      </span>
                    </div>
                    {couponDiscount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-emerald-400">Coupon ({appliedCoupon?.code})</span>
                        <span className="text-emerald-400 font-medium">-{formatPrice(couponDiscount)}</span>
                      </div>
                    )}
                    <div className="h-px bg-border-secondary" />
                    <div className="flex justify-between items-baseline">
                      <span className="text-text-primary font-semibold text-base">Total</span>
                      <span className="text-2xl font-bold text-brand-rose">{formatPrice(finalTotal)}</span>
                    </div>
                  </div>

                  {/* Coupon */}
                  <div className="border-t border-border-secondary pt-4">
                    <button
                      onClick={() => setCouponOpen(!couponOpen)}
                      className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors cursor-pointer w-full"
                    >
                      <Tag className="h-4 w-4 text-brand-rose" />
                      {appliedCoupon ? `Coupon: ${appliedCoupon.code}` : 'Have a coupon code?'}
                      <ChevronDown className={cn('h-4 w-4 ml-auto transition-transform', couponOpen && 'rotate-180')} />
                    </button>

                    <AnimatePresence>
                      {couponOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          {appliedCoupon ? (
                            <div className="mt-3 flex items-center justify-between rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3">
                              <div>
                                <span className="text-sm font-semibold text-emerald-400">{appliedCoupon.code}</span>
                                <span className="text-xs text-text-muted ml-2">— {appliedCoupon.label}</span>
                              </div>
                              <button onClick={handleRemoveCoupon} className="text-text-muted hover:text-brand-red transition-colors cursor-pointer">
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="mt-3 space-y-2">
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={couponInput}
                                  onChange={(e) => { setCouponInput(e.target.value); setCouponError(''); }}
                                  placeholder="Enter code"
                                  className="flex-1 rounded-lg bg-surface-secondary border border-border-secondary px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-rose/50"
                                  onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                                />
                                <button
                                  onClick={handleApplyCoupon}
                                  className="px-4 py-2 rounded-lg bg-brand-rose text-white text-sm font-semibold hover:bg-brand-rose-dark transition-colors cursor-pointer"
                                >
                                  Apply
                                </button>
                              </div>
                              {couponError && <p className="text-xs text-brand-red">{couponError}</p>}
                              <p className="text-[10px] text-text-muted">
                                Try: {coupons.filter((c: any) => c.status === 'active').map((c: any) => c.code).join(', ') || 'WELCOME10'}
                              </p>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Checkout CTA */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push('/checkout')}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-rose px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-rose/25 hover:bg-brand-rose-dark transition-all duration-300 cursor-pointer"
                  >
                    Proceed to Checkout
                    <ArrowRight className="h-4 w-4" />
                  </motion.button>

                  <Link
                    href="/cakes"
                    className="block text-center text-sm text-text-muted hover:text-brand-rose transition-colors"
                  >
                    Continue Shopping
                  </Link>

                  {/* Trust */}
                  <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border-secondary">
                    {[
                      { icon: ShieldCheck, label: 'Secure\nCheckout' },
                      { icon: Sparkles, label: 'Fresh\nGuarantee' },
                      { icon: RotateCcw, label: 'Easy\nReturns' },
                    ].map(({ icon: Icon, label }) => (
                      <div key={label} className="flex flex-col items-center gap-1.5 text-center">
                        <Icon className="h-4 w-4 text-brand-rose" />
                        <span className="text-[10px] text-text-muted leading-tight whitespace-pre-line">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </Container>
        </section>

        {/* Mobile Bottom Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-[400] lg:hidden border-t border-border-secondary bg-surface-primary/95 backdrop-blur-xl px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-text-muted">{itemCount} items</p>
              <p className="text-xl font-bold text-brand-rose">{formatPrice(finalTotal)}</p>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/checkout')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-rose text-white font-semibold text-sm shadow-lg shadow-brand-rose/30 cursor-pointer"
            >
              Checkout
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
