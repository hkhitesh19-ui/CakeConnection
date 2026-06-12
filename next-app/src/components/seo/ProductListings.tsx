import React from 'react';
import Link from 'next/link';
import { Star, Heart, ShoppingBag } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  weight: string;
  rating: number;
  reviews: number;
  slug: string;
}

const mockProducts: Record<string, Product[]> = {
  eggless: [
    {
      id: 'eggless-1',
      name: 'Eggless Chocolate Truffle Cake',
      image: '/images/hero-cake.png',
      price: 899,
      originalPrice: 1199,
      weight: '1kg',
      rating: 4.9,
      reviews: 342,
      slug: 'eggless-chocolate-truffle',
    },
    {
      id: 'eggless-2',
      name: 'Eggless Red Velvet Dream Cake',
      image: '/images/red-velvet-cake.png',
      price: 999,
      originalPrice: 1399,
      weight: '1kg',
      rating: 4.8,
      reviews: 215,
      slug: 'eggless-red-velvet-dream',
    },
    {
      id: 'eggless-3',
      name: 'Eggless Black Forest Classic',
      image: '/images/black-forest-cake.png',
      price: 799,
      originalPrice: 1099,
      weight: '1kg',
      rating: 4.7,
      reviews: 189,
      slug: 'eggless-black-forest-classic',
    },
    {
      id: 'eggless-4',
      name: 'Eggless Butterscotch Bliss',
      image: '/images/butterscotch-cake.png',
      price: 849,
      originalPrice: 1149,
      weight: '1kg',
      rating: 4.8,
      reviews: 120,
      slug: 'eggless-butterscotch-bliss',
    },
  ],
  birthday: [
    {
      id: 'bday-1',
      name: 'Birthday Special Chocolate Overload',
      image: '/images/hero-cake.png',
      price: 949,
      originalPrice: 1299,
      weight: '1kg',
      rating: 4.9,
      reviews: 512,
      slug: 'birthday-chocolate-overload',
    },
    {
      id: 'bday-2',
      name: 'Royal Rose Anniversary & Birthday Cake',
      image: '/images/red-velvet-cake.png',
      price: 1199,
      originalPrice: 1599,
      weight: '1kg',
      rating: 4.8,
      reviews: 98,
      slug: 'royal-rose-cake',
    },
  ],
  delivery: [
    {
      id: 'del-1',
      name: 'Express Delivery Chocolate Truffle',
      image: '/images/hero-cake.png',
      price: 899,
      originalPrice: 1199,
      weight: '1kg',
      rating: 4.9,
      reviews: 320,
      slug: 'express-chocolate-truffle',
    },
    {
      id: 'del-2',
      name: 'Same Day Special Black Forest',
      image: '/images/black-forest-cake.png',
      price: 799,
      originalPrice: 1099,
      weight: '1kg',
      rating: 4.8,
      reviews: 156,
      slug: 'same-day-black-forest',
    },
  ],
  online: [
    {
      id: 'online-1',
      name: 'Classic Pineapple Cake',
      image: '/images/butterscotch-cake.png',
      price: 699,
      originalPrice: 899,
      weight: '1kg',
      rating: 4.7,
      reviews: 240,
      slug: 'classic-pineapple-cake',
    },
    {
      id: 'online-2',
      name: 'Premium Chocolate Hazelnut Cake',
      image: '/images/hero-cake.png',
      price: 1099,
      originalPrice: 1499,
      weight: '1kg',
      rating: 4.9,
      reviews: 185,
      slug: 'premium-chocolate-hazelnut',
    },
  ]
};

export default function ProductListings({ category }: { category: string }) {
  const products = mockProducts[category] || mockProducts.eggless;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 my-12">
      {products.map((product) => {
        const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
        return (
          <article
            key={product.id}
            className="group relative flex flex-col rounded-2xl border border-[#332224] bg-[#1a0f11] overflow-hidden transition-all duration-500 hover:border-[#b76e79]/40 hover:shadow-[0_0_30px_rgba(183,110,121,0.15)]"
          >
            <div className="relative aspect-square overflow-hidden bg-[#241719]">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                <span className="rounded-full bg-[#b76e79] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                  {discount}% OFF
                </span>
              </div>
            </div>
            <div className="flex flex-1 flex-col p-5">
              <div className="mb-2 flex items-center gap-1.5">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-neutral-600'}`}
                    />
                  ))}
                </div>
                <span className="text-xs text-neutral-400">
                  {product.rating} ({product.reviews})
                </span>
              </div>
              <h3 className="font-display text-base font-semibold text-white leading-tight">
                {product.name}
              </h3>
              <p className="mt-1 text-xs font-medium text-neutral-400 uppercase tracking-wide">
                {product.weight} • 100% Eggless
              </p>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-lg font-bold text-[#b76e79]">
                  ₹{product.price}
                </span>
                <span className="text-sm text-neutral-500 line-through">
                  ₹{product.originalPrice}
                </span>
              </div>
              <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#b76e79] px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:bg-[#a35d68] cursor-pointer">
                <ShoppingBag className="h-4 w-4" />
                Add to Cart
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
