"use client";

// ============================================
// Orders Page — Cake Connection
// ============================================

import { useState } from 'react';
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
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import { Container } from '@/components/ui';
import { SEOHead } from '@/components/seo/SEOHead';
import { cn, formatPrice } from '@/utils';

// ── Types ────────────────────────────────────

type OrderStatus = 'confirmed' | 'preparing' | 'out-for-delivery' | 'delivered' | 'cancelled';

interface OrderItem {
  name: string;
  weight: string;
  qty: number;
  price: number;
  image: string;
}

interface MockOrder {
  id: string;
  date: string;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  address: string;
  payment: string;
}

// ── Mock Orders ──────────────────────────────

const MOCK_ORDERS: MockOrder[] = [
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
  },
  {
    id: 'CC-241225-004',
    date: '25 Dec 2024',
    status: 'cancelled',
    items: [
      { name: 'Premium Gift Hamper Grand', weight: 'Grand', qty: 1, price: 3499, image: '/images/combo-gift.png' },
    ],
    total: 3499,
    address: '42, Sunrise Apartments, SG Highway, Vadodara — 380015',
    payment: 'Online (Razorpay)',
  },
];

// ── Status Config ────────────────────────────

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bgColor: string }> = {
  confirmed: { label: 'Confirmed', color: 'text-brand-rose', bgColor: 'bg-brand-rose/15' },
  preparing: { label: 'Preparing', color: 'text-amber-400', bgColor: 'bg-amber-400/15' },
  'out-for-delivery': { label: 'Out for Delivery', color: 'text-blue-400', bgColor: 'bg-blue-400/15' },
  delivered: { label: 'Delivered', color: 'text-emerald-400', bgColor: 'bg-emerald-400/15' },
  cancelled: { label: 'Cancelled', color: 'text-red-400', bgColor: 'bg-red-400/15' },
};

const TIMELINE_STEPS: { key: OrderStatus; label: string; icon: React.ElementType }[] = [
  { key: 'confirmed', label: 'Order Placed', icon: Check },
  { key: 'confirmed', label: 'Confirmed', icon: Package },
  { key: 'preparing', label: 'Preparing', icon: Clock },
  { key: 'out-for-delivery', label: 'Out for Delivery', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: Check },
];

function getStepIndex(status: OrderStatus): number {
  switch (status) {
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

function OrderCard({ order }: { order: MockOrder }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const statusConf = STATUS_CONFIG[order.status];
  const currentStepIdx = getStepIndex(order.status);
  const isCancelled = order.status === 'cancelled';

  return (
    <motion.div
      variants={fadeUp}
      className="rounded-2xl bg-surface-secondary border border-border-secondary overflow-hidden hover:border-brand-rose/15 transition-colors"
    >
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-5 text-left cursor-pointer"
      >
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
            <span className="font-mono text-sm font-bold text-text-primary">{order.id}</span>
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
                  className="w-8 h-8 rounded-full overflow-hidden border-2 border-surface-secondary bg-surface-tertiary"
                >
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
            <span className="text-xs text-text-muted">
              {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
            </span>
            <span className="text-sm font-semibold text-text-primary ml-auto mr-2">
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
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-surface-tertiary flex-shrink-0">
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-text-primary truncate">{item.name}</p>
                      <p className="text-xs text-text-muted">{item.weight} × {item.qty}</p>
                    </div>
                    <span className="text-sm font-medium text-text-primary">{formatPrice(item.price)}</span>
                  </div>
                ))}
              </div>

              {/* Info rows */}
              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2">
                  <MapPin className="h-3.5 w-3.5 text-text-muted mt-0.5 flex-shrink-0" />
                  <span className="text-text-secondary">{order.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-3.5 w-3.5 text-text-muted flex-shrink-0" />
                  <span className="text-text-secondary">{order.payment}</span>
                </div>
              </div>

              {/* Timeline Tracker */}
              {!isCancelled && (
                <div className="rounded-xl bg-surface-primary/50 p-4">
                  <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-4">Order Tracking</h4>
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
                                ? 'bg-brand-rose text-white'
                                : 'bg-surface-tertiary text-text-muted',
                              isCurrent && 'ring-2 ring-brand-rose/40 ring-offset-2 ring-offset-surface-secondary'
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
                              isCompleted ? 'text-text-primary' : 'text-text-muted'
                            )}>
                              {step.label}
                            </p>
                            {isCurrent && (
                              <p className="text-[10px] text-brand-rose mt-0.5">Current Status</p>
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
                  <p className="text-xs text-text-muted mt-1">Refund has been initiated to your original payment method</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-brand-rose/30 text-brand-rose text-sm font-medium hover:bg-brand-rose/10 transition-colors cursor-pointer">
                  <RefreshCw className="h-3.5 w-3.5" />
                  Reorder
                </button>
                {!isCancelled && order.status !== 'delivered' && (
                  <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-tertiary text-text-primary text-sm font-medium hover:bg-surface-secondary transition-colors cursor-pointer border border-border-secondary">
                    <Truck className="h-3.5 w-3.5" />
                    Track Order
                  </button>
                )}
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-text-muted text-sm font-medium hover:text-text-secondary transition-colors cursor-pointer">
                  <HelpCircle className="h-3.5 w-3.5" />
                  Need Help?
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Main Page ────────────────────────────────

export default function OrdersPage() {
  return (
    <>
      <SEOHead title="My Orders" description="View your order history and track deliveries." noIndex />

      <motion.div initial="hidden" animate="visible" variants={pageVariants}>
        {/* Header */}
        <section className="relative overflow-hidden bg-surface-primary py-8 sm:py-12">
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
                My <span className="text-gradient-rose">Orders</span>
                <Package className="h-7 w-7 text-brand-rose" />
              </h1>
              <p className="mt-2 text-text-secondary text-sm">{MOCK_ORDERS.length} orders</p>
            </motion.div>
          </Container>
        </section>

        {/* Orders List */}
        <section className="bg-brand-black pb-20">
          <Container as="div" size="lg">
            <div className="space-y-4 pt-4">
              {MOCK_ORDERS.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          </Container>
        </section>
      </motion.div>
    </>
  );
}
