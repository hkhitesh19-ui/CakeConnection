"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  ShoppingBag, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Star, 
  ArrowRight, 
  Heart, 
  Check, 
  Zap, 
  Search, 
  SlidersHorizontal,
  Plus, 
  Leaf, 
  Flame, 
  Truck,
  Layers,
  ChevronRight,
  Smile,
  Cake,
  Gift
} from 'lucide-react';
import DesignSwitcher from '@/components/home/DesignSwitcher';
import { useCartStore } from '@/stores/cartStore';

// Bento Products
const BENTO_CAKES = [
  {
    id: 'bento-1',
    name: 'Belgian Dark Chocolate Ganache',
    category: 'Cakes',
    price: 649,
    originalPrice: 799,
    rating: 4.9,
    reviews: 240,
    badge: 'Trending #1',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
    tags: ['Best Seller', '100% Eggless'],
    flavor: 'Rich Truffle',
  },
  {
    id: 'bento-2',
    name: 'Exotic Strawberry Cheesecake',
    category: 'Cakes',
    price: 799,
    originalPrice: 949,
    rating: 4.9,
    reviews: 184,
    badge: 'Fresh Fruit',
    image: 'https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?auto=format&fit=crop&w=800&q=80',
    tags: ['Fresh Berries', 'Philadelphia Cream'],
    flavor: 'Fruit Cream',
  },
  {
    id: 'bento-3',
    name: 'Pistachio Rose Blossom Cake',
    category: 'Cakes',
    price: 849,
    originalPrice: 999,
    rating: 5.0,
    reviews: 95,
    badge: 'Chef Choice',
    image: 'https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&w=800&q=80',
    tags: ['Middle-Eastern Twist', 'Rose Water'],
    flavor: 'Exotic',
  },
  {
    id: 'bento-4',
    name: 'Dutch Rose & Truffle Birthday Box',
    category: 'Combos',
    price: 1399,
    originalPrice: 1699,
    rating: 5.0,
    reviews: 310,
    badge: 'Combo Hit',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
    tags: ['Cake + 10 Roses', 'Party Ready'],
    flavor: 'Gift Combo',
  },
  {
    id: 'bento-5',
    name: 'Red Velvet White Ganache',
    category: 'Cakes',
    price: 699,
    originalPrice: 849,
    rating: 4.8,
    reviews: 156,
    badge: 'Anniversary Special',
    image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=800&q=80',
    tags: ['Pure Velvet', 'Cream Cheese'],
    flavor: 'Classic',
  },
  {
    id: 'bento-6',
    name: 'Dutch Scarlet Bloom Bouquet',
    category: 'Flowers',
    price: 799,
    originalPrice: 999,
    rating: 4.9,
    reviews: 88,
    badge: 'Hand-Tied',
    image: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=800&q=80',
    tags: ['Fresh Morning Cut', 'Hydration Pack'],
    flavor: 'Fresh Flowers',
  },
];

export default function Design2Page() {
  const [activeTab, setActiveTab] = useState('All');
  const [heroWeight, setHeroWeight] = useState('500g');
  const [pincode, setPincode] = useState('');
  const [pincodeResult, setPincodeResult] = useState<string | null>(null);
  const [addedItem, setAddedItem] = useState<string | null>(null);
  const addItem = useCartStore((s) => s.addItem);

  const heroPrice = heroWeight === '500g' ? 649 : heroWeight === '1kg' ? 1199 : 2299;

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode) return;
    const vadodaraPins = ['390001', '390002', '390005', '390007', '390011', '390012', '390015', '390018', '390020'];
    if (vadodaraPins.includes(pincode.trim())) {
      setPincodeResult('⚡ Instant Delivery in 45-60 mins available for ' + pincode);
    } else {
      setPincodeResult('✅ Same-Day 3-hour delivery available across Vadodara for ' + pincode);
    }
  };

  const filtered = activeTab === 'All' 
    ? BENTO_CAKES 
    : BENTO_CAKES.filter(c => c.category === activeTab || c.flavor === activeTab);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased selection:bg-rose-100 selection:text-rose-900">
      <DesignSwitcher activeDesign="design-2" />

      {/* Floating Glassmorphic Header */}
      <header className="sticky top-[41px] z-40 bg-white/75 backdrop-blur-xl border-b border-slate-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-6">
            <Link href="/design-2" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/25">
                <Cake className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  CakeConnection
                </span>
                <span className="hidden sm:block text-[10px] font-semibold text-rose-600 tracking-wider uppercase">
                  Bento 2026 Edition
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1 text-xs font-medium text-slate-600">
              {['All', 'Cakes', 'Combos', 'Flowers'].map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeTab === t 
                      ? 'bg-rose-50 text-rose-600 font-semibold' 
                      : 'hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  {t}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 bg-slate-100/80 border border-slate-200/80 rounded-full px-3 py-1 text-xs text-slate-600">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Express Hub: Alkapuri, Vadodara</span>
            </div>

            <Link
              href="/cart"
              className="flex items-center gap-2 bg-slate-900 hover:bg-rose-600 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-md transition-all hover:scale-105"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Cart</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Toast */}
      {addedItem && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-slide-up text-xs font-medium border border-slate-700">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Added <strong>{addedItem}</strong> to your bag!</span>
          <Link href="/cart" className="underline text-rose-400 ml-2 font-bold">Checkout</Link>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-12">
        
        {/* ========================================================= */}
        {/* HERO SECTION: MODULAR BENTO GRID (Apple/Linear Style)     */}
        {/* ========================================================= */}
        <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          
          {/* Card 1 (Large 2x2): Spotlight Cake with Live Configurator */}
          <div className="md:col-span-2 lg:col-span-2 md:row-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-rose-100/60 to-transparent rounded-full blur-2xl -z-10"></div>
            
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-bold uppercase tracking-wider">
                  <Flame className="w-3.5 h-3.5 text-rose-500" />
                  #1 Bestseller Vadodara
                </span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Leaf className="w-3 h-3" /> 100% Eggless
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-4">
                Belgian Dark Ganache Truffle
              </h1>
              <p className="text-sm text-slate-500 mt-2 max-w-md">
                Rich melt-in-mouth European dark chocolate infused with real cocoa butter and layered in soft chocolate sponge. Baked fresh every morning.
              </p>
            </div>

            {/* Cake Showcase Image */}
            <div className="relative aspect-video my-6 rounded-2xl overflow-hidden bg-slate-100 border border-slate-100">
              <img 
                src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=85" 
                alt="Belgian Truffle" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-lg text-xs flex items-center gap-1.5 font-medium">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>4.9 (420+ Vadodara orders)</span>
              </div>
            </div>

            {/* Live Weight & Price Configurator */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 block">Select Weight</span>
                <div className="flex gap-2 mt-1">
                  {['500g', '1kg', '2kg'].map((w) => (
                    <button
                      key={w}
                      onClick={() => setHeroWeight(w)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        heroWeight === w
                          ? 'bg-rose-600 text-white shadow-sm scale-105'
                          : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                <div>
                  <span className="text-2xl font-black text-slate-900">₹{heroPrice}</span>
                  <span className="text-xs text-slate-400 line-through ml-1.5">₹{heroPrice + 200}</span>
                </div>
                <button
                  onClick={() => {
                    addItem({
                      productId: 'bento-hero',
                      variantId: `bento-hero-${heroWeight}`,
                      name: `Belgian Dark Truffle (${heroWeight})`,
                      price: heroPrice,
                      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
                      weight: heroWeight,
                      quantity: 1,
                    });
                    setAddedItem(`Belgian Dark Truffle (${heroWeight})`);
                    setTimeout(() => setAddedItem(null), 2500);
                  }}
                  className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold tracking-wide shadow-md shadow-rose-600/20 transition-all flex items-center gap-1.5"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Order Now</span>
                </button>
              </div>
            </div>
          </div>

          {/* Card 2 (1x1): Express Delivery Radar */}
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-3xl p-6 flex flex-col justify-between shadow-sm relative overflow-hidden">
            <div className="absolute top-2 right-2 text-white/10">
              <Truck className="w-24 h-24 stroke-[1]" />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                Vadodara Express
              </span>
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
              </span>
            </div>

            <div className="my-4">
              <span className="text-3xl font-black">45 - 60 min</span>
              <p className="text-xs text-emerald-100 mt-1 font-medium">
                Live delivery active across Alkapuri, Akota, Gotri, Vasna &amp; Karelibaug.
              </p>
            </div>

            <div className="text-[11px] text-white/90 bg-black/10 rounded-xl p-2.5 backdrop-blur-sm flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-emerald-200 shrink-0" />
              <span>Order before 11 PM for Tonight</span>
            </div>
          </div>

          {/* Card 3 (1x1): 100% Eggless Guarantee Badge */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <ShieldCheck className="w-6 h-6" />
            </div>

            <div className="my-3">
              <h3 className="text-lg font-bold text-slate-900">100% Pure Veg Promise</h3>
              <p className="text-xs text-slate-500 mt-1">
                Zero gelatin, zero egg derivatives. 100% clean vegetarian kitchen certified for your peace of mind.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50/80 px-3 py-1.5 rounded-xl border border-emerald-200/60">
              <Leaf className="w-4 h-4 text-emerald-600" />
              <span>Guaranteed Pure Veg</span>
            </div>
          </div>

          {/* Card 4 (2x1 Bento Tile): Midnight Celebration Surprise */}
          <div className="md:col-span-2 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 border border-slate-800">
            <div className="space-y-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider border border-amber-400/30">
                ⭐ 12:00 AM Delivery
              </span>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                Plan a Midnight Birthday Surprise
              </h3>
              <p className="text-xs text-slate-300 max-w-sm">
                Doorbell rings exactly at 12:00 AM! Gourmet cake + 10 red roses + custom card delivered together.
              </p>
            </div>

            <button
              onClick={() => setActiveTab('Combos')}
              className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 px-6 py-3 rounded-xl text-xs font-bold tracking-wide shadow-lg shrink-0 flex items-center gap-2 transition-all hover:scale-105"
            >
              <span>Explore Midnight Combos</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </section>

        {/* ========================================================= */}
        {/* INTERACTIVE PINCODE CHECKER WIDGET                       */}
        {/* ========================================================= */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-rose-600" />
                <h3 className="text-lg font-bold text-slate-900">Check Delivery Speed in Your Area</h3>
              </div>
              <p className="text-xs text-slate-500">
                Enter your 6-digit Vadodara pincode to see current delivery slots (e.g. 390007, 390015, 390020).
              </p>
            </div>

            <form onSubmit={handleCheckPincode} className="flex w-full md:w-auto gap-2">
              <input 
                type="text" 
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Enter Pincode (e.g. 390007)"
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none w-full md:w-56"
              />
              <button 
                type="submit"
                className="bg-slate-900 hover:bg-rose-600 text-white px-5 py-2.5 rounded-xl text-xs font-semibold shrink-0 transition-colors"
              >
                Check
              </button>
            </form>
          </div>

          {pincodeResult && (
            <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-emerald-700 flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-500" />
              <span>{pincodeResult}</span>
            </div>
          )}
        </section>

        {/* ========================================================= */}
        {/* PRODUCT CATALOG: BENTO CARDS                             */}
        {/* ========================================================= */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">Catalogue</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Trending Cakes &amp; Combos
              </h2>
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-medium text-slate-600 overflow-x-auto">
              {['All', 'Cakes', 'Combos', 'Flowers'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeTab === cat 
                      ? 'bg-white text-slate-900 font-bold shadow-sm' 
                      : 'hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <div 
                key={item.id}
                className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 mb-4">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold text-slate-800 shadow-sm">
                      {item.badge}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">{item.category}</span>
                    <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-bold">Eggless</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
                    {item.name}
                  </h3>

                  <div className="flex items-center gap-1 mt-2 text-xs font-medium text-slate-500">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-slate-800 font-bold">{item.rating}</span>
                    <span>({item.reviews} reviews)</span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-xl font-extrabold text-slate-900">₹{item.price}</span>
                    <span className="text-xs text-slate-400 line-through ml-1.5">₹{item.originalPrice}</span>
                  </div>

                  <button
                    onClick={() => {
                      addItem({
                        productId: item.id,
                        variantId: item.id,
                        name: item.name,
                        price: item.price,
                        image: item.image,
                        weight: 'Standard',
                        quantity: 1,
                      });
                      setAddedItem(item.name);
                      setTimeout(() => setAddedItem(null), 2500);
                    }}
                    className="bg-slate-900 hover:bg-rose-600 text-white p-2.5 rounded-xl transition-colors shadow-sm"
                    aria-label={`Add ${item.name} to cart`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* TECH-MINIMALIST FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-12 mt-20 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center">
                <Cake className="w-4 h-4" />
              </div>
              <span className="text-white font-bold text-base">CakeConnection Bento</span>
            </div>
            
            <div className="flex items-center gap-6">
              <span>⚡ Vadodara Delivery Hub</span>
              <span>🔒 100% Secure Checkout</span>
              <span>🌿 Pure Eggless</span>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© 2026 CakeConnection.in · Crafted with UI/UX Pro Max Bento System.</p>
            <Link href="/design-3" className="text-rose-400 hover:underline font-semibold">
              Next: Design 03 (Midnight Velvet) →
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
