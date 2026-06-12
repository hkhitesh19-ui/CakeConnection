'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star, ShoppingCart } from 'lucide-react';
import { Container } from '@/components/ui';
import { useCartStore } from '@/stores';
import { useProducts } from '@/hooks/useProducts';
import type { Product } from '@/types';

export function ComboGifts() {
  const { products: allProducts, loading } = useProducts('combos');
  const addItem = useCartStore((s) => s.addItem);

  // Filter for available products and limit to 4 for the homepage grid
  const combos = allProducts.filter((p) => p.isAvailable).slice(0, 4);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    const variant = product.variants[0];
    if (!variant) return;

    addItem({
      productId: product.id,
      variantId: variant.id,
      name: product.name,
      image: product.images[0]?.url || '/images/combo-gift.png',
      weight: variant.weight,
      price: variant.price,
      quantity: 1,
    });
  };

  return (
    <section className="py-12 md:py-16 bg-white relative">
      <Container className="max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-baseline mb-8 md:mb-10 border-b border-gray-100 pb-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-rose block mb-1">
              Curated Gift Sets
            </span>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-800">
              Perfect Gift Combos
            </h2>
          </div>
          <Link
            href="/combos"
            className="text-brand-rose hover:text-brand-rose-dark font-semibold text-sm transition-colors duration-200 inline-flex items-center gap-1 group"
          >
            View All <span className="transform group-hover:translate-x-1 transition-transform duration-200">→</span>
          </Link>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {loading ? (
            // Skeleton Loader
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="w-full bg-white border border-gray-100 rounded-xl overflow-hidden p-4 space-y-4 animate-pulse"
              >
                <div className="aspect-[4/3] w-full bg-gray-100 rounded-lg" />
                <div className="h-4 w-3/4 bg-gray-100 rounded" />
                <div className="h-3 w-1/2 bg-gray-100 rounded" />
                <div className="h-8 w-full bg-gray-100 rounded-lg" />
              </div>
            ))
          ) : combos.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              No combo gifts found.
            </div>
          ) : (
            // Products List
            combos.map((product) => {
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
                  className="w-full bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group"
                >
                  {/* Image Area wrapped in link */}
                  <Link href={`/${product.category}/${product.slug}`} className="block relative aspect-[4/3] w-full overflow-hidden bg-gray-50">
                    <img
                      src={product.images[0]?.url || '/images/combo-gift.png'}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    {/* Discount Tag */}
                    {hasDiscount && (
                      <span className="absolute top-2 left-2 bg-brand-red text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
                        {discountPercent}% OFF
                      </span>
                    )}
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
                          ({product.reviewCount || 8})
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
                      </div>

                      {/* CTA button */}
                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        className="w-full py-2 bg-brand-rose hover:bg-brand-rose-dark text-white rounded-lg text-xs md:text-sm font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-95 cursor-pointer shadow-sm hover:shadow"
                      >
                        <ShoppingCart className="h-3.5 w-3.5" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </Container>
    </section>
  );
}
export default ComboGifts;


