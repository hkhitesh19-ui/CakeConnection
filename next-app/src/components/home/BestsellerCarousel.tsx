'use client';
import { useState, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Star, ShoppingCart, Check } from 'lucide-react';
import { Container } from '@/components/ui';
import { useCartStore, useUIStore } from '@/stores';
import { useProducts } from '@/hooks/useProducts';
import type { Product } from '@/types';

interface BestsellerCarouselProps {
  title: string;
  category: 'cakes' | 'flowers' | 'combos';
  viewAllLink: string;
}

export default function BestsellerCarousel({
  title,
  category,
  viewAllLink,
}: BestsellerCarouselProps) {
  const { products: allProducts, loading } = useProducts(category);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [addedId, setAddedId] = useState<string | null>(null);
  const addItem = useCartStore((s) => s.addItem);
  const addToast = useUIStore((s) => s.addToast);

  const availableProducts = allProducts.filter((p) => p.isAvailable);
  const products = availableProducts.slice(0, 12);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      const scrollTo = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    const variant = product.variants?.[0] || {
      id: `${product.id}-default`,
      weight: category === 'cakes' ? '500g' : 'Standard',
      price: (product as any).price || 499,
    };

    addItem({
      productId: product.id,
      slug: product.slug,
      category: product.category || category || 'cakes',
      variantId: variant.id,
      name: product.name,
      image: product.images?.[0]?.url || (category === 'flowers' ? '/images/hero-flowers.png' : '/images/hero-cake.png'),
      weight: variant.weight || (category === 'cakes' ? '500g' : 'Standard'),
      price: variant.price || 499,
      quantity: 1,
    });

    setAddedId(product.id);
    addToast({
      type: 'success',
      message: `Added "${product.name}" to cart!`,
    });

    setTimeout(() => {
      setAddedId((prev) => (prev === product.id ? null : prev));
    }, 1800);
  };

  return (
    <section className="py-8 md:py-12 bg-white relative">
      <Container className="max-w-7xl relative">
        {/* Header */}
        <div className="flex justify-between items-baseline mb-6 md:mb-8 border-b border-gray-150 pb-3">
          <div>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-800">
              {title}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {category === 'flowers'
                ? 'Handcrafted floral arrangements'
                : 'Celebrations crafted with love'}
            </p>
          </div>
          {products.length > 0 ? (
            <Link
              href={viewAllLink}
              className="text-brand-rose hover:text-brand-rose-dark font-semibold text-sm transition-colors duration-200 inline-flex items-center gap-1 group"
            >
              View All <span className="transform group-hover:translate-x-1 transition-transform duration-200">→</span>
            </Link>
          ) : (
            <span className="rounded-full bg-rose-50 border border-rose-200 px-3 py-1 text-xs font-bold text-brand-rose">
              Coming Soon
            </span>
          )}
        </div>

        {/* Carousel or Coming Soon */}
        {!loading && products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/60 p-8 sm:p-12 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center mb-3.5 text-2xl shadow-xs">
              {category === 'flowers' ? '🌸' : '🎁'}
            </div>
            <span className="rounded-md bg-brand-rose/10 text-brand-rose font-extrabold text-[11px] uppercase tracking-wider px-2.5 py-0.5 mb-2">
              Coming Soon
            </span>
            <h3 className="text-lg font-display font-bold text-gray-900">
              {category === 'flowers' ? 'Fresh Flower Bouquets Launching Soon!' : 'Exciting Gift Combos Launching Soon!'}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 max-w-md mt-1.5 leading-relaxed">
              {category === 'flowers'
                ? 'We are carefully curating fresh farm-direct roses, lilies, and orchids for Vadodara with same-day express delivery.'
                : 'Our team is putting together exciting gift hampers, teddy sets, and celebration combos for Vadodara.'}
            </p>
            <Link
              href="/cakes"
              className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-brand-rose px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-brand-rose-dark transition-all cursor-pointer"
            >
              Explore Fresh Handcrafted Cakes →
            </Link>
          </div>
        ) : (
          <div className="relative group/carousel w-full">
            {/* Left Arrow Button */}
            <button
              onClick={() => scroll('left')}
              className="absolute left-2 top-[35%] -translate-y-1/2 z-20 h-10 w-10 bg-white border border-gray-100 hover:bg-gray-50 text-gray-800 rounded-full shadow-md md:flex hidden items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 cursor-pointer"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            {/* Right Arrow Button */}
            <button
              onClick={() => scroll('right')}
              className="absolute right-2 top-[35%] -translate-y-1/2 z-20 h-10 w-10 bg-white border border-gray-100 hover:bg-gray-50 text-gray-800 rounded-full shadow-md md:flex hidden items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 cursor-pointer"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Cards Track */}
            <div
              ref={scrollRef}
              className="flex gap-4 md:gap-6 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory scroll-smooth"
            >
              {loading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-[240px] md:w-[280px] shrink-0 bg-white border border-gray-100 rounded-xl overflow-hidden p-4 space-y-4"
                    >
                      <div className="aspect-[4/3] w-full bg-gray-100 animate-pulse rounded-lg" />
                      <div className="h-4 w-3/4 bg-gray-100 animate-pulse rounded" />
                      <div className="h-3 w-1/2 bg-gray-100 animate-pulse rounded" />
                      <div className="h-8 w-full bg-gray-100 animate-pulse rounded-lg" />
                    </div>
                  ))
                : products.map((product) => {
                    const variant = product.variants[0];
                    const price = variant?.price || 0;
                    const compareAtPrice = variant?.compareAtPrice;
                    const hasDiscount = !!(compareAtPrice && compareAtPrice > price);
                    const discountPercent = hasDiscount
                      ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
                      : 0;

                    return (
                      <article
                        key={product.id}
                        className="w-[240px] md:w-[280px] shrink-0 snap-start bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group"
                      >
                        <Link href={`/${product.category}/${product.slug}`} className="block relative aspect-[4/3] w-full overflow-hidden bg-gray-55">
                          <img
                            src={product.images[0]?.url || '/images/hero-cake.png'}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />

                        </Link>

                        <div className="p-4 flex flex-col flex-grow justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              <div className="flex items-center">
                                {Array.from({ length: 5 }).map((_, idx) => (
                                  <Star
                                    key={idx}
                                    className={`h-3 w-3 ${
                                      idx < Math.floor(product.rating || 5)
                                        ? 'text-amber-400 fill-amber-400'
                                        : 'text-gray-200 fill-gray-200'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-[10px] text-gray-400 font-semibold">
                                ({product.reviewCount || 12})
                              </span>
                            </div>

                            <Link href={`/${product.category}/${product.slug}`}>
                              <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 hover:text-brand-rose transition-colors duration-200">
                                {product.name}
                              </h3>
                            </Link>
                          </div>

                          <div className="space-y-3">
                            <div className="flex justify-between items-end">
                              <div className="flex flex-col">
                                {hasDiscount && (
                                  <span className="text-[10px] text-gray-400 line-through">
                                    ₹{compareAtPrice}
                                  </span>
                                )}
                                <span className="text-base md:text-lg font-bold text-gray-900">
                                  ₹{price}
                                </span>
                              </div>

                              {category === 'cakes' && variant?.weight && (
                                <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                  {variant.weight}
                                </span>
                              )}
                            </div>

                            <button
                              onClick={(e) => handleAddToCart(e, product)}
                              className={`w-full py-2 rounded-lg text-xs md:text-sm font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-95 cursor-pointer shadow-sm hover:shadow ${
                                addedId === product.id
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-brand-rose hover:bg-brand-rose-dark text-white'
                              }`}
                            >
                              {addedId === product.id ? (
                                <>
                                  <Check className="h-3.5 w-3.5" />
                                  Added!
                                </>
                              ) : (
                                <>
                                  <ShoppingCart className="h-3.5 w-3.5" />
                                  Add to Cart
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
