'use client';
import { useState, useRef, useMemo } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Star, ShoppingCart, Check } from 'lucide-react';
import { Container } from '@/components/ui';
import { useCartStore, useUIStore } from '@/stores';
import { useProducts } from '@/hooks/useProducts';
import type { Product } from '@/types';

export interface CakeCategoryCarouselProps {
  title: string;
  subtitle?: string;
  category?: 'cakes' | 'flowers' | 'combos';
  filterType: '2hr' | 'bestseller' | 'same-day' | 'next-day';
  viewAllLink: string;
  icon?: string;
}

export default function CakeCategoryCarousel({
  title,
  subtitle,
  category = 'cakes',
  filterType,
  viewAllLink,
  icon,
}: CakeCategoryCarouselProps) {
  const { products: allProducts, loading } = useProducts(category);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [addedId, setAddedId] = useState<string | null>(null);
  const addItem = useCartStore((s) => s.addItem);
  const addToast = useUIStore((s) => s.addToast);

  // Filter products strictly based on subcategory type
  const products = useMemo(() => {
    return allProducts.filter((p) => {
      if (!p.isAvailable) return false;
      const opts = Array.isArray(p.deliveryOptions || (p as any).delivery_options)
        ? (p.deliveryOptions || (p as any).delivery_options)
        : [];

      if (filterType === '2hr') {
        return opts.some((d: string) => /2\s*hr|2\s*hour|superfast|express/i.test(d));
      }
      if (filterType === 'bestseller') {
        return !!p.isBestseller;
      }
      if (filterType === 'same-day') {
        return opts.some((d: string) => /same-day|same\s*day/i.test(d));
      }
      if (filterType === 'next-day') {
        return opts.some((d: string) => /next-day|next\s*day/i.test(d));
      }
      return true;
    }).slice(0, 12);
  }, [allProducts, filterType]);

  // Strict: Never render fake fallbacks if no products match
  if (!loading && products.length === 0) {
    return null;
  }

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
          <div>
            <div className="flex items-center gap-2">
              {icon && <span className="text-xl md:text-2xl">{icon}</span>}
              <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-800">
                {title}
              </h2>
            </div>
            {subtitle && (
              <p className="text-xs text-gray-500 mt-1">
                {subtitle}
              </p>
            )}
          </div>
          <Link
            href={viewAllLink}
            className="text-brand-rose hover:text-brand-rose-dark font-semibold text-sm transition-colors duration-200 inline-flex items-center gap-1 group whitespace-nowrap"
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

          {/* Product Cards Row */}
          <div
            ref={scrollRef}
            className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide py-2 px-1 scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products.map((product) => {
              const firstVariant = product.variants?.[0];
              const price = firstVariant?.price || (product as any).price || 499;
              const originalPrice = firstVariant?.compareAtPrice;
              const isAdded = addedId === product.id;

              return (
                <div
                  key={product.id}
                  className="w-[200px] md:w-[240px] flex-shrink-0 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between overflow-hidden group"
                >
                  <Link href={`/cakes/${product.slug}`} className="block relative">
                    <div className="relative aspect-square w-full bg-gray-50 overflow-hidden">
                      {product.images?.[0]?.url ? (
                        <img
                          src={product.images[0].url}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">
                          🎂
                        </div>
                      )}
                      {/* Subcategory specific tag */}
                      <div className="absolute top-2 left-2">
                        {filterType === '2hr' && (
                          <span className="bg-emerald-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs flex items-center gap-1 backdrop-blur-xs">
                            ⚡ 2 Hours
                          </span>
                        )}
                        {filterType === 'bestseller' && (
                          <span className="bg-amber-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs flex items-center gap-1 backdrop-blur-xs">
                            ⭐ Bestseller
                          </span>
                        )}
                        {filterType === 'same-day' && (
                          <span className="bg-blue-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs flex items-center gap-1 backdrop-blur-xs">
                            🚚 Same Day
                          </span>
                        )}
                        {filterType === 'next-day' && (
                          <span className="bg-purple-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs flex items-center gap-1 backdrop-blur-xs">
                            📅 Next Day
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-3">
                      <div className="flex items-center gap-1 text-[11px] text-amber-500 font-semibold mb-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{product.rating || 4.8}</span>
                        <span className="text-gray-400">({product.reviewCount || 25})</span>
                      </div>
                      <h3 className="font-medium text-gray-800 text-sm truncate group-hover:text-brand-rose transition-colors">
                        {product.name}
                      </h3>
                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="font-bold text-gray-900 text-base">
                          ₹{price}
                        </span>
                        {originalPrice && originalPrice > price && (
                          <span className="text-xs text-gray-400 line-through">
                            ₹{originalPrice}
                          </span>
                        )}
                        {firstVariant?.weight && (
                          <span className="text-[10px] text-gray-500 font-medium ml-auto">
                            {firstVariant.weight}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>

                  <div className="px-3 pb-3">
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      disabled={isAdded}
                      className={`w-full py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                        isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-brand-rose hover:bg-brand-rose-dark text-white'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
