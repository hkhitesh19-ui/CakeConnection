"use client";

// ============================================
// Wishlist Page — Cake Connection
// ============================================

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Heart,
  ShoppingBag,
  X,
  Home,
  ChevronRight,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { Container } from '@/components/ui';
import { SEOHead } from '@/components/seo/SEOHead';
import { cn, formatPrice } from '@/utils';
import { useWishlistStore, useCartStore, useUIStore } from '@/stores';
import { getProductById } from '@/data/products';

// ── Animations ───────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, scale: 0.8, y: 20, transition: { duration: 0.3 } },
};

const pageVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, staggerChildren: 0.06 } },
};

// ── Wishlist Card ────────────────────────────

function WishlistCard({ item }: { item: ReturnType<typeof useWishlistStore.getState>['items'][0] }) {
  const removeItem = useWishlistStore((s) => s.removeItem);
  const addToCart = useCartStore((s) => s.addItem);
  const addToast = useUIStore((s) => s.addToast);

  const product = getProductById(item.productId);
  const defaultVariant = product?.variants[0];

  const handleAddToCart = () => {
    if (!product || !defaultVariant) return;
    addToCart({
      productId: product.id,
      variantId: defaultVariant.id,
      name: product.name,
      image: product.images[0]?.url || '',
      weight: defaultVariant.weight,
      flavour: product.flavour,
      price: defaultVariant.price,
      quantity: 1,
    });
    addToast({ type: 'success', message: `${product.name} added to cart!` });
  };

  const handleRemove = () => {
    removeItem(item.productId);
    addToast({ type: 'info', message: 'Removed from wishlist' });
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
      className="group relative flex flex-col rounded-2xl border border-border-secondary bg-surface-secondary overflow-hidden transition-all duration-500 hover:border-brand-rose/40 hover:shadow-[0_0_30px_rgba(183,110,121,0.12)]"
    >
      {/* Remove button */}
      <button
        onClick={handleRemove}
        aria-label="Remove from wishlist"
        className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-surface-primary/80 backdrop-blur-sm border border-border-secondary text-text-muted hover:text-brand-red hover:bg-brand-red/10 hover:border-brand-red/30 transition-all cursor-pointer"
      >
        <X className="h-3.5 w-3.5" />
      </button>

      {/* Image */}
      <Link href={product ? `/${product.category}/${product.slug}` : '#'} className="relative aspect-square overflow-hidden bg-surface-tertiary">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        <h3 className="font-display text-base font-semibold text-text-primary leading-tight line-clamp-2">
          <Link href={product ? `/${product.category}/${product.slug}` : '#'} className="hover:text-brand-rose transition-colors">
            {item.name}
          </Link>
        </h3>

        <p className="mt-2 text-lg font-bold text-brand-rose">
          {formatPrice(item.price)}
        </p>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleAddToCart}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-rose px-4 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-brand-rose-dark hover:shadow-brand-rose/30 transition-all cursor-pointer"
        >
          <ShoppingBag className="h-4 w-4" />
          Add to Cart
        </motion.button>
      </div>
    </motion.div>
  );
}

// ── Main Page ────────────────────────────────

export default function WishlistPage() {
  const items = useWishlistStore((s) => s.items);
  const clearWishlist = useWishlistStore((s) => s.clearWishlist);
  const addToast = useUIStore((s) => s.addToast);
  const itemCount = useWishlistStore((s) => s.getItemCount());

  // Empty state
  if (items.length === 0) {
    return (
      <>
        <SEOHead title="Wishlist" description="Your saved items." noIndex />
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="min-h-[60vh] flex items-center justify-center px-4"
        >
          <div className="text-center max-w-md">
            <div className="mb-6 mx-auto w-24 h-24 rounded-full bg-surface-secondary border border-border-secondary flex items-center justify-center">
              <Heart className="h-10 w-10 text-text-muted" />
            </div>
            <h1 className="font-display text-3xl font-bold text-text-primary mb-3">
              Your Wishlist is Empty
            </h1>
            <p className="text-text-secondary mb-8">
              Start exploring our collection and save items you love for later!
            </p>
            <Link
              href="/cakes"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-brand-rose text-white font-semibold text-sm transition-all hover:bg-brand-rose-dark hover:shadow-lg hover:shadow-brand-rose/30"
            >
              <Sparkles className="h-4 w-4" />
              Start Exploring
            </Link>
          </div>
        </motion.section>
      </>
    );
  }

  return (
    <>
      <SEOHead title="Wishlist" description="Your saved items." noIndex />

      <motion.div initial="hidden" animate="visible" variants={pageVariants}>
        {/* Header */}
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
                <span className="text-text-accent font-medium">Wishlist</span>
              </nav>
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-display text-3xl sm:text-4xl font-bold text-text-primary flex items-center gap-3">
                    Your <span className="text-gradient-rose">Wishlist</span>
                    <Heart className="h-7 w-7 text-brand-rose fill-brand-rose" />
                  </h1>
                  <p className="mt-2 text-text-secondary text-sm">{itemCount} saved {itemCount === 1 ? 'item' : 'items'}</p>
                </div>
                <button
                  onClick={() => { clearWishlist(); addToast({ type: 'info', message: 'Wishlist cleared' }); }}
                  className="flex items-center gap-1.5 text-xs text-text-muted hover:text-brand-red transition-colors cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Clear All
                </button>
              </div>
            </motion.div>
          </Container>
        </section>

        {/* Grid */}
        <section className="bg-brand-black pb-20">
          <Container as="div" size="xl">
            <AnimatePresence mode="popLayout">
              <motion.div variants={pageVariants} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {items.map((item) => (
                  <WishlistCard key={item.productId} item={item} />
                ))}
              </motion.div>
            </AnimatePresence>
          </Container>
        </section>
      </motion.div>
    </>
  );
}
