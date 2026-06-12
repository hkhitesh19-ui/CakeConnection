'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Heart, ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui';
import { cn } from '@/utils';
import { useProducts } from '@/hooks/useProducts';
import { useCartStore, useWishlistStore, useUIStore } from '@/stores';

interface CakeProduct {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  weight: string;
  rating: number;
  reviews: number;
  badge?: 'Bestseller' | 'New';
  slug: string;
}

function getDiscountPercent(price: number, originalPrice: number): number {
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

function formatPrice(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const headingVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as any },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as any },
  },
};

function CakeCard({ cake, index, rawProduct }: { cake: CakeProduct; index: number; rawProduct: any }) {
  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist(cake.id));
  const addToast = useUIStore((s) => s.addToast);

  const discount = getDiscountPercent(cake.price, cake.originalPrice);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const defaultVariant = rawProduct?.variants?.[0] || { id: cake.id, weight: cake.weight, price: cake.price };

    addItem({
      productId: cake.id,
      variantId: defaultVariant.id,
      name: cake.name,
      image: cake.image,
      weight: cake.weight,
      flavour: rawProduct?.flavour || '',
      price: cake.price,
      quantity: 1,
    });
    addToast({ type: 'success', message: `${cake.name} added to cart` });
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({
      productId: cake.id,
      name: cake.name,
      image: cake.image,
      price: cake.price,
      addedAt: new Date().toISOString(),
    });
  };

  return (
    <motion.article
      variants={cardVariants}
      className="group relative flex flex-col rounded-2xl border border-border-secondary bg-white overflow-hidden transition-all duration-300 hover:shadow-lg h-full"
    >
      <Link href={`/cakes/${cake.slug}`} className="flex flex-col h-full">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-surface-tertiary">
          <img
            src={cake.image}
            alt={cake.name}
            loading={index < 2 ? 'eager' : 'lazy'}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
            {cake.badge && (
              <span className="rounded px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-brand-rose text-white shadow">
                {cake.badge}
              </span>
            )}
            {discount > 0 && (
              <span className="rounded bg-brand-red px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow">
                {discount}% OFF
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            className="absolute top-2.5 right-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/85 backdrop-blur-sm border border-border-secondary transition-all duration-300 hover:bg-white hover:scale-110 cursor-pointer shadow"
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
        <div className="flex flex-1 flex-col p-3 sm:p-4">
          {/* Title */}
          <h3 className="font-sans text-sm sm:text-base font-bold text-text-primary leading-tight line-clamp-2 group-hover:text-brand-rose transition-colors duration-350">
            {cake.name}
          </h3>

          {/* Rating & Reviews */}
          <div className="mt-1.5 flex items-center gap-1.5">
            <span className="inline-flex items-center gap-0.5 bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
              {cake.rating || '4.5'} ★
            </span>
            <span className="text-[11px] text-text-muted">
              ({cake.reviews || 42} Reviews)
            </span>
          </div>

          <p className="mt-1.5 text-[11px] font-medium text-text-muted">
            {cake.weight} • Eggless Option
          </p>

          {/* Pricing & CTA Row */}
          <div className="mt-auto pt-3 flex items-center justify-between gap-2">
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-extrabold text-brand-rose">
                {formatPrice(cake.price)}
              </span>
              {cake.originalPrice > cake.price && (
                <span className="text-xs text-text-muted line-through">
                  {formatPrice(cake.originalPrice)}
                </span>
              )}
            </div>

            {/* Quick Add Button */}
            <button
              onClick={handleAddToCart}
              className="px-3.5 py-2 bg-brand-rose hover:bg-brand-rose-dark text-white rounded-lg text-xs font-bold transition-all duration-300 hover:scale-105 cursor-pointer shadow hover:shadow-brand-rose/25"
            >
              Order
            </button>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

export function FeaturedCakes() {
  const { products, loading } = useProducts('cakes');
  const featured = products.filter(p => p.isFeatured || p.isBestseller).slice(0, 4);
  const displayList = featured.length > 0 ? featured : products.slice(0, 4);

  const mappedCakes = displayList.map(p => ({
    id: p.id,
    name: p.name,
    image: p.images[0]?.url || '/images/hero-cake.png',
    price: p.variants[0]?.price || 0,
    originalPrice: p.variants[0]?.compareAtPrice || p.variants[0]?.price || 0,
    weight: p.variants[0]?.weight || '500g',
    rating: p.rating,
    reviews: p.reviewCount,
    badge: p.isBestseller ? 'Bestseller' : (p.isNewArrival ? 'New' : undefined) as any,
    slug: p.slug
  }));

  return (
    <section className="relative py-12 bg-white overflow-hidden">
      <Container as="div" size="xl" className="relative">
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {/* Section Header */}
          <motion.div variants={headingVariants} className="text-center mb-10">
            <span className="inline-block mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-brand-rose">
              Freshly Baked
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary">
              Our Signature <span className="text-gradient-rose">Cakes</span>
            </h2>
            <div className="mx-auto mt-3 h-[2px] w-16 rounded bg-brand-rose" />
          </motion.div>

          {/* Product Grid */}
          <motion.div
            variants={sectionVariants}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            {loading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="animate-pulse rounded-2xl bg-surface-secondary border border-border-secondary aspect-square flex flex-col justify-between p-5 min-h-[300px]">
                  <div className="w-full aspect-square bg-surface-tertiary rounded-xl mb-4" />
                  <div className="h-4 bg-surface-tertiary w-3/4 rounded" />
                  <div className="h-4 bg-surface-tertiary w-1/2 rounded mt-2" />
                </div>
              ))
            ) : mappedCakes.length === 0 ? (
              <div className="col-span-4 text-center py-10 text-text-muted">No featured cakes found.</div>
            ) : (
              mappedCakes.map((cake, index) => (
                <CakeCard key={cake.id} cake={cake} index={index} rawProduct={displayList[index]} />
              ))
            )}
          </motion.div>

          {/* View All CTA */}
          <motion.div variants={headingVariants} className="mt-10 text-center">
            <Link
              href="/cakes"
              className="group/link inline-flex items-center gap-2 text-brand-rose font-semibold text-sm sm:text-base transition-all duration-300 hover:gap-3"
            >
              View All Cakes
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1" />
            </Link>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}


