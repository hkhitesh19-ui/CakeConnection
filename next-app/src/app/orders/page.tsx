"use client";

// ============================================
// Orders Page & Real-Time Tracking — Cake Connection
// ============================================

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Home,
  ChevronRight,
  ChevronDown,
  Package,
  Check,
  Clock,
  Truck,
  MapPin,
  CreditCard,
  RefreshCw,
  HelpCircle,
  Search,
  Loader2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Container } from '@/components/ui';
import { SEOHead } from '@/components/seo/SEOHead';
import { cn, formatPrice } from '@/utils';

// ── Types ────────────────────────────────────

type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'out-for-delivery' | 'delivered' | 'cancelled' | 'refunded';

interface OrderItem {
  name: string;
  weight: string;
  qty: number;
  price: number;
  image: string;
}

interface OrderDisplay {
  id: string;
  date: string;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  address: string;
  payment: string;
  deliveryDate?: string;
  deliverySlot?: string;
}

// ── Fallback Sample Orders ────────────────────

const MOCK_ORDERS: OrderDisplay[] = [
  {
    id: 'CC-250310-003',
    date: '10 Mar 2025',
    status: 'preparing',
    items: [
      { name: 'Premium Cake & Flowers Combo', weight: 'Standard', qty: 1, price: 1999, image: '/images/combo-gift.png' },
    ],
    total: 1999,
    address: '42, Sunrise Apartments, SG Highway, Vadodara — 380015',
    payment: 'Online (Razorpay)',
    deliveryDate: '2025-03-10',
    deliverySlot: 'Standard (09:00 AM - 09:00 PM)',
  },
  {
    id: 'CC-250220-002',
    date: '20 Feb 2025',
    status: 'out-for-delivery',
    items: [
      { name: 'Royal Red Roses Bouquet', weight: '24 Stems', qty: 1, price: 1299, image: '/images/luxury-bouquet.png' },
    ],
    total: 1299,
    address: 'Tower B, 5th Floor, Corporate Park, Navrangpura — 380009',
    payment: 'UPI Direct',
    deliveryDate: '2025-02-20',
    deliverySlot: 'Evening (05:00 PM - 09:00 PM)',
  },
  {
    id: 'CC-250115-001',
    date: '15 Jan 2025',
    status: 'delivered',
    items: [
      { name: 'Chocolate Truffle Cake', weight: '1 kg', qty: 1, price: 799, image: '/images/black-forest-cake.png' },
      { name: 'Red Velvet Cake', weight: '500g', qty: 1, price: 599, image: '/images/red-velvet-cake.png' },
    ],
    total: 1398,
    address: '42, Sunrise Apartments, SG Highway, Vadodara — 380015',
    payment: 'Cash on Delivery',
    deliveryDate: '2025-01-15',
    deliverySlot: 'Morning (09:00 AM - 01:00 PM)',
  },
];

// ── Status Config ────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; color: string; bgColor: string }> = {
  pending: { label: 'Order Received', color: 'text-amber-400', bgColor: 'bg-amber-400/15' },
  confirmed: { label: 'Confirmed', color: 'text-brand-rose', bgColor: 'bg-brand-rose/15' },
  preparing: { label: 'Baking / Preparing', color: 'text-blue-400', bgColor: 'bg-blue-400/15' },
  'out-for-delivery': { label: 'Out for Delivery', color: 'text-cyan-400', bgColor: 'bg-cyan-400/15' },
  delivered: { label: 'Delivered', color: 'text-emerald-400', bgColor: 'bg-emerald-400/15' },
  cancelled: { label: 'Cancelled', color: 'text-red-400', bgColor: 'bg-red-400/15' },
  refunded: { label: 'Refunded', color: 'text-purple-400', bgColor: 'bg-purple-400/15' },
};

const TIMELINE_STEPS = [
  { key: 'pending', label: 'Order Placed', icon: Check },
  { key: 'confirmed', label: 'Confirmed by Bakery', icon: Package },
  { key: 'preparing', label: 'Fresh Baking & Packing', icon: Clock },
  { key: 'out-for-delivery', label: 'Out for Delivery', icon: Truck },
  { key: 'delivered', label: 'Delivered to Receiver', icon: Check },
];

function getStepIndex(status: string): number {
  switch (status) {
    case 'pending': return 0;
    case 'confirmed': return 1;
    case 'preparing': return 2;
    case 'out-for-delivery': return 3;
    case 'delivered': return 4;
    default: return -1;
  }
}

// ── Animations ───────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
};

const pageVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, staggerChildren: 0.1 } },
};

// ── Order Card ───────────────────────────────

function OrderCard({ order }: { order: OrderDisplay }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const statusConf = STATUS_CONFIG[order.status] || {
    label: order.status,
    color: 'text-gray-400',
    bgColor: 'bg-gray-400/15'
  };
  const currentStepIdx = getStepIndex(order.status);
  const isCancelled = order.status === 'cancelled' || order.status === 'refunded';

  return (
    <motion.div
      variants={fadeUp}
      className="rounded-2xl bg-surface-secondary border border-border-secondary overflow-hidden hover:border-brand-rose/30 transition-colors shadow-lg"
    >
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-5 text-left cursor-pointer"
      >
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
            <span className="font-mono text-base font-bold text-text-primary tracking-wide">{order.id}</span>
            <span className={cn('px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider', statusConf.bgColor, statusConf.color)}>
              {statusConf.label}
            </span>
          </div>
          <p className="text-xs text-text-muted">{order.date}</p>

          {/* Items preview */}
          <div className="flex items-center gap-2 mt-3">
            <div className="flex -space-x-2">
              {order.items.slice(0, 3).map((item, idx) => (
                <div
                  key={idx}
                  className="w-9 h-9 rounded-xl overflow-hidden border-2 border-surface-secondary bg-surface-tertiary"
                >
                  <img src={item.image || '/images/black-forest-cake.png'} alt={item.name} className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
            <span className="text-xs text-text-muted">
              {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
            </span>
            <span className="text-sm font-semibold text-brand-rose ml-auto mr-2">
              {formatPrice(order.total)}
            </span>
          </div>
        </div>
        <ChevronDown className={cn('h-5 w-5 text-text-muted transition-transform flex-shrink-0 ml-2', isExpanded && 'rotate-180')} />
      </button>

      {/* Expanded Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-0 space-y-5 border-t border-border-secondary">

              {/* Items list */}
              <div className="pt-4 space-y-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-surface-tertiary/40 p-2.5 rounded-xl border border-border-secondary/60">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-surface-tertiary flex-shrink-0">
                      <img src={item.image || '/images/black-forest-cake.png'} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">{item.name}</p>
                      <p className="text-xs text-text-muted">{item.weight} × {item.qty}</p>
                    </div>
                    <span className="text-sm font-semibold text-text-primary">{formatPrice(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>

              {/* Info rows */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="flex items-start gap-2 bg-surface-primary/40 p-3 rounded-xl border border-border-secondary/50">
                  <MapPin className="h-4 w-4 text-brand-rose mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-text-muted block text-[10px] uppercase font-semibold">Delivery Address</span>
                    <span className="text-text-secondary">{order.address}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2 bg-surface-primary/40 p-3 rounded-xl border border-border-secondary/50">
                  <Calendar className="h-4 w-4 text-brand-rose mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-text-muted block text-[10px] uppercase font-semibold">Delivery Slot</span>
                    <span className="text-text-secondary">{order.deliveryDate || 'Scheduled'} • {order.deliverySlot || 'Standard Slot'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-surface-primary/40 p-3 rounded-xl border border-border-secondary/50 sm:col-span-2">
                  <CreditCard className="h-4 w-4 text-brand-rose flex-shrink-0" />
                  <div>
                    <span className="text-text-muted block text-[10px] uppercase font-semibold">Payment</span>
                    <span className="text-text-secondary">{order.payment}</span>
                  </div>
                </div>
              </div>

              {/* Timeline Tracker */}
              {!isCancelled && (
                <div className="rounded-xl bg-surface-primary/60 p-4 border border-border-secondary">
                  <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-4">Live Order Journey</h4>
                  <div className="space-y-0">
                    {TIMELINE_STEPS.map((step, idx) => {
                      const isCompleted = idx <= currentStepIdx;
                      const isCurrent = idx === currentStepIdx;
                      const Icon = step.icon;
                      return (
                        <div key={idx} className="flex items-start gap-3">
                          {/* Dot + Line */}
                          <div className="flex flex-col items-center">
                            <div className={cn(
                              'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all',
                              isCompleted
                                ? 'bg-brand-rose text-white shadow-md shadow-brand-rose/25'
                                : 'bg-surface-tertiary text-text-muted',
                              isCurrent && 'ring-2 ring-brand-rose ring-offset-2 ring-offset-surface-secondary'
                            )}>
                              <Icon className="h-3 w-3" />
                            </div>
                            {idx < TIMELINE_STEPS.length - 1 && (
                              <div className={cn(
                                'w-0.5 h-6 my-0.5',
                                idx < currentStepIdx ? 'bg-brand-rose' : 'bg-surface-tertiary'
                              )} />
                            )}
                          </div>
                          {/* Label */}
                          <div className="pb-3">
                            <p className={cn(
                              'text-sm font-medium',
                              isCompleted ? 'text-text-primary font-semibold' : 'text-text-muted'
                            )}>
                              {step.label}
                            </p>
                            {isCurrent && (
                              <p className="text-[10px] text-brand-rose font-bold mt-0.5">Current Status</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {isCancelled && (
                <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-center">
                  <p className="text-sm text-red-400 font-medium">This order was cancelled</p>
                  <p className="text-xs text-text-muted mt-1">If already paid, a refund has been initiated to your original payment method.</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-2">
                <Link 
                  href="/cakes" 
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-brand-rose/30 text-brand-rose text-sm font-medium hover:bg-brand-rose/10 transition-colors"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Order More Treats
                </Link>
                <a 
                  href="https://wa.me/917984852932?text=Hi%20Cake%20Connection,%20I%20need%20help%20with%20my%20order"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-text-muted text-sm font-medium hover:text-text-secondary transition-colors"
                >
                  <HelpCircle className="h-3.5 w-3.5" />
                  Need Help? WhatsApp Us
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Orders Content Component (Inside Suspense) ──

function OrdersContent() {
  const searchParams = useSearchParams();
  const initialOrderParam = searchParams.get('order_number') || searchParams.get('id') || '';

  const [query, setQuery] = useState(initialOrderParam);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [liveOrders, setLiveOrders] = useState<OrderDisplay[]>([]);
  const [hasSearchedEmpty, setHasSearchedEmpty] = useState(false);

  useEffect(() => {
    if (initialOrderParam) {
      handleSearch(initialOrderParam);
    }
  }, [initialOrderParam]);

  const handleSearch = async (searchTerm?: string) => {
    const term = (searchTerm ?? query).trim();
    if (!term) return;

    setLoading(true);
    setSearched(true);
    setHasSearchedEmpty(false);

    try {
      const response = await fetch(`/api/orders?search=${encodeURIComponent(term)}`);
      const resData = await response.json();

      if (resData.success && Array.isArray(resData.data) && resData.data.length > 0) {
        const mapped: OrderDisplay[] = resData.data.map((o: any) => {
          let addressLine = o.shipping_address_line || '';
          if (!addressLine && typeof o.delivery_address === 'string') {
            addressLine = o.delivery_address;
          }

          const itemsArr = Array.isArray(o.items) ? o.items.map((it: any) => ({
            name: it.name || 'Delicious Cake',
            weight: it.weight || 'Standard',
            qty: it.quantity || it.qty || 1,
            price: Number(it.price || 0),
            image: it.image || '/images/black-forest-cake.png',
          })) : [];

          return {
            id: o.order_number || o.id,
            date: new Date(o.created_at).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            }),
            status: (o.order_status || 'pending') as OrderStatus,
            items: itemsArr,
            total: Number(o.total || 0),
            address: addressLine || 'Vadodara, Gujarat',
            payment: o.payment_method === 'cod' ? 'Cash on Delivery' : `Online (${o.payment_status || 'Paid'})`,
            deliveryDate: o.delivery_date,
            deliverySlot: o.delivery_slot,
          };
        });

        setLiveOrders(mapped);
      } else {
        setLiveOrders([]);
        setHasSearchedEmpty(true);
      }
    } catch (err) {
      console.error('Failed to lookup order:', err);
      setHasSearchedEmpty(true);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setSearched(false);
    setLiveOrders([]);
    setHasSearchedEmpty(false);
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={pageVariants}>
      {/* Header */}
      <section className="relative overflow-hidden bg-surface-primary py-8 sm:py-12 border-b border-border-secondary">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[400px] h-[400px] rounded-full bg-brand-rose/[0.04] blur-3xl" />
        </div>
        <Container as="div" size="xl" className="relative">
          <motion.div variants={fadeUp}>
            <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-sm">
              <Link href="/" className="flex items-center gap-1 text-text-muted hover:text-brand-rose transition-colors">
                <Home className="h-3.5 w-3.5" /> Home
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-text-muted/50" />
              <span className="text-text-accent font-medium">My Orders</span>
            </nav>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-text-primary flex items-center gap-3">
              Track & View <span className="text-gradient-rose">Orders</span>
              <Package className="h-7 w-7 text-brand-rose" />
            </h1>
            <p className="mt-2 text-text-secondary text-sm">
              Enter your Order Number or registered phone to check live kitchen baking and delivery status.
            </p>

            {/* Tracking Search Input */}
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
              className="mt-6 flex flex-col sm:flex-row gap-3 max-w-xl"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Order ID (e.g. ORD-123456) or Phone..."
                  className="w-full bg-surface-secondary border border-border-secondary rounded-xl pl-10 pr-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-rose focus:ring-1 focus:ring-brand-rose text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-brand-rose hover:bg-brand-rose/90 text-white font-semibold text-sm rounded-xl transition-colors shadow-lg shadow-brand-rose/20 disabled:opacity-50 cursor-pointer"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span>Track Order</span>
              </button>
              {searched && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-4 py-3 bg-surface-tertiary hover:bg-surface-secondary text-text-muted text-sm rounded-xl border border-border-secondary cursor-pointer transition-colors"
                >
                  Clear
                </button>
              )}
            </form>
          </motion.div>
        </Container>
      </section>

      {/* Orders List Section */}
      <section className="bg-[#FAF9F6] pb-24 pt-8 min-h-[50vh] border-t border-gray-150">
        <Container as="div" size="lg">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-text-muted space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-brand-rose" />
              <p className="text-sm">Fetching real-time order status from database...</p>
            </div>
          ) : searched ? (
            <div className="space-y-6">
              {liveOrders.length > 0 ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-text-primary">
                      Found {liveOrders.length} matching order{liveOrders.length > 1 ? 's' : ''}
                    </h2>
                  </div>
                  <div className="space-y-4">
                    {liveOrders.map((order) => (
                      <OrderCard key={order.id} order={order} />
                    ))}
                  </div>
                </div>
              ) : hasSearchedEmpty ? (
                <div className="bg-surface-secondary border border-border-secondary rounded-2xl p-8 text-center max-w-lg mx-auto space-y-3">
                  <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
                  <h3 className="text-lg font-bold text-text-primary">No Orders Found</h3>
                  <p className="text-xs text-text-muted">
                    We could not find any active order matching &quot;{query}&quot;. Please verify your Order Number from your confirmation email or invoice.
                  </p>
                  <button
                    onClick={handleClear}
                    className="inline-block mt-2 px-4 py-2 bg-surface-tertiary text-brand-rose text-xs font-semibold rounded-xl border border-border-secondary hover:bg-surface-secondary"
                  >
                    View Sample Orders
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-text-secondary">Recent Order Activity & Demo Orders</h2>
                <span className="text-xs text-text-muted">{MOCK_ORDERS.length} sample orders</span>
              </div>
              <div className="space-y-4">
                {MOCK_ORDERS.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            </div>
          )}
        </Container>
      </section>
    </motion.div>
  );
}

// ── Main Page Export (Wrapped in Suspense) ──

export default function OrdersPage() {
  return (
    <>
      <SEOHead title="My Orders & Live Order Tracking" description="Track your Cake Connection order live with real-time bakery status." noIndex />
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-white text-gray-500">
          <Loader2 className="w-8 h-8 animate-spin text-brand-rose" />
        </div>
      }>
        <OrdersContent />
      </Suspense>
    </>
  );
}
