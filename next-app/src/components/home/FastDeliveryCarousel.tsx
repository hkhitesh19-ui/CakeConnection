'use client';
import { useState, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Star, ShoppingCart, Check } from 'lucide-react';
import { Container } from '@/components/ui';
import { useCartStore, useUIStore } from '@/stores';
import { useProducts } from '@/hooks/useProducts';
import { cakeProducts } from '@/data/products';
import type { Product } from '@/types';

interface FastDeliveryCarouselProps {
  title: string;
  category: 'cakes' | 'flowers' | 'combos';
  viewAllLink: string;
}

const mockProducts: Product[] = cakeProducts.slice(0, 8);

export default function FastDeliveryCarousel({
  title,
  category,
  viewAllLink,
}: FastDeliveryCarouselProps) {
  const { products: allProducts, loading } = useProducts(category);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [addedId, setAddedId] = useState<string | null>(null);
  const addItem = useCartStore((s) => s.addItem);
  const addToast = useUIStore((s) => s.addToast);

  // Filter for super fast delivery options
  const filteredProducts = allProducts.filter((p) => {
    if (!p.isAvailable) return false;
    
    const inDelivery = Array.isArray(p.deliveryOptions) 
      ? p.deliveryOptions.some(d => d.includes('1 to 2 Hours SuperFast Delivery'))
      : false;
      
    const inSubcat = typeof p.subcategory === 'string' 
      ? p.subcategory.includes('1 to 2 Hours SuperFast Delivery')
      : false;

    return inDelivery || inSubcat;
  }).slice(0, 12);

  const products = filteredProducts.length > 0 ? filteredProducts : mockProducts;

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
      weight: '500g',
      price: (product as any).price || 499,
    };

    addItem({
      productId: product.id,
      variantId: variant.id,
      name: product.name,
      image: product.images?.[0]?.url || '/images/hero-cake.png',
      weight: variant.weight || '500g',
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
        <div className="flex justify-between items-baseline mb-6 md:mb-8 border-b border-gray-100 pb-3">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-800">
            {title}
          </h2>
          <Link
            href={viewAllLink}
            className="text-brand-rose hover:text-brand-rose-dark font-semibold text-sm transition-colors duration-200 inline-flex items-center gap-1 group"
          >
            View All <span className="transform group-hover:translate-x-1 transition-transform duration-200">→</span>
          </Link>
        </div>

        {/* Carousel Container (with hover arrows wrapper) */}
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
            {loading ? (
              // Loading Skeleton State
              Array.from({ length: 4 }).map((_, i) => (
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
            ) : products.length === 0 ? (
              <div className="w-full text-center py-12 text-gray-500">
                No products found in this category.
              </div>
            ) : (
              // Product Cards
              products.map((product) => {
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
                    {/* Image Area wrapped in link */}
                    <Link href={`/${product.category}/${product.slug}`} className="block relative aspect-[4/3] w-full overflow-hidden bg-gray-55">
                      <img
                        src={product.images[0]?.url || '/images/hero-cake.png'}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />

                    </Link>

                    {/* Product Details */}
                    <div className="p-4 flex flex-col flex-grow justify-between gap-3">
                      <div className="space-y-1">
                        {/* Rating block */}
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

                        {/* Title */}
                        <Link href={`/${product.category}/${product.slug}`}>
                          <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 hover:text-brand-rose transition-colors duration-200">
                            {product.name}
                          </h3>
                        </Link>
                      </div>

                      {/* Pricing, weight, CTA block */}
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

                          {/* Weight (for cakes only) */}
                          {category === 'cakes' && variant?.weight && (
                            <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                              {variant.weight}
                            </span>
                          )}
                        </div>

                        {/* CTA button */}
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
              })
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}


