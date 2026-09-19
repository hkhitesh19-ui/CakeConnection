"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Zap, 
  Search, 
  MapPin, 
  Clock, 
  ShoppingBag, 
  Plus, 
  Minus, 
  Check, 
  Flame, 
  Sparkles, 
  ShieldCheck, 
  ChevronDown, 
  Filter,
  ArrowRight,
  Gift,
  Tag
} from 'lucide-react';
import DesignSwitcher from '@/components/home/DesignSwitcher';
import { useCartStore } from '@/stores/cartStore';

const QUICK_CATEGORIES = [
  { id: 'all', name: 'All Treats', emoji: '✨' },
  { id: 'cakes', name: 'Eggless Cakes', emoji: '🎂' },
  { id: 'bouquets', name: 'Fresh Blooms', emoji: '💐' },
  { id: 'combos', name: 'Gift Combos', emoji: '🎁' },
  { id: 'midnight', name: 'Midnight 12AM', emoji: '🌙' },
  { id: 'bestsellers', name: 'Under ₹599', emoji: '⚡' },
];

const QUICK_PRODUCTS = [
  {
    id: 'qc-1',
    name: 'Belgian Truffle Dark Cake',
    category: 'cakes',
    price: 599,
    originalPrice: 749,
    eta: '35 mins',
    weight: '500g',
    rating: 4.9,
    reviews: 580,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80',
    tag: 'Vadodara #1 Choice',
  },
  {
    id: 'qc-2',
    name: 'Exotic Fresh Strawberry Cream',
    category: 'cakes',
    price: 649,
    originalPrice: 799,
    eta: '40 mins',
    weight: '500g',
    rating: 4.9,
    reviews: 320,
    image: 'https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?auto=format&fit=crop&w=600&q=80',
    tag: 'Daily Fresh Berries',
  },
  {
    id: 'qc-3',
    name: 'Scarlet Dutch Roses (12 Stems)',
    category: 'bouquets',
    price: 699,
    originalPrice: 899,
    eta: '35 mins',
    weight: 'Bouquet',
    rating: 5.0,
    reviews: 140,
    image: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=600&q=80',
    tag: 'Cold Packaged',
  },
  {
    id: 'qc-4',
    name: 'Midnight Birthday Special Combo',
    category: 'combos',
    price: 1299,
    originalPrice: 1599,
    eta: 'Today 12AM',
    weight: 'Cake + Roses',
    rating: 5.0,
    reviews: 290,
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80',
    tag: 'Includes Sparkler & Card',
  },
  {
    id: 'qc-5',
    name: 'Classic Black Forest Velvet',
    category: 'cakes',
    price: 499,
    originalPrice: 649,
    eta: '35 mins',
    weight: '500g',
    rating: 4.8,
    reviews: 410,
    image: 'https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&w=600&q=80',
    tag: 'Under ₹599 Deal',
  },
  {
    id: 'qc-6',
    name: 'Ferrero Hazelnut Glaze Cake',
    category: 'cakes',
    price: 799,
    originalPrice: 999,
    eta: '45 mins',
    weight: '500g',
    rating: 4.9,
    reviews: 180,
    image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=600&q=80',
    tag: 'Ferrero Crunch',
  },
];

export default function Design4Page() {
  const [selectedCat, setSelectedCat] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [selectedLocality, setSelectedLocality] = useState('Alkapuri, Vadodara');
  const [showLocationModal, setShowLocationModal] = useState(false);
  
  const addItem = useCartStore((s) => s.addItem);
  const cartItems = useCartStore((s) => s.items);

  const handleIncrement = (product: typeof QUICK_PRODUCTS[0]) => {
    const current = quantities[product.id] || 0;
    const next = current + 1;
    setQuantities(prev => ({ ...prev, [product.id]: next }));

    addItem({
      productId: product.id,
      variantId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      weight: product.weight,
      quantity: 1,
    });
  };

  const handleDecrement = (product: typeof QUICK_PRODUCTS[0]) => {
    const current = quantities[product.id] || 0;
    if (current > 0) {
      setQuantities(prev => ({ ...prev, [product.id]: current - 1 }));
    }
  };

  const filtered = QUICK_PRODUCTS.filter(p => {
    const matchesCat = selectedCat === 'all' || p.category === selectedCat || (selectedCat === 'bestsellers' && p.price <= 599);
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const totalCartCount = Object.values(quantities).reduce((a, b) => a + b, 0);
  const totalCartAmount = Object.entries(quantities).reduce((acc, [id, qty]) => {
    const prod = QUICK_PRODUCTS.find(p => p.id === id);
    return acc + (prod ? prod.price * qty : 0);
  }, 0);

  return (
    <div className="min-h-screen bg-[#F4F6F8] text-slate-900 font-sans antialiased pb-28 selection:bg-emerald-100 selection:text-emerald-900">
      <DesignSwitcher activeDesign="design-4" />

      {/* QUICK-COMMERCE ADDRESS & SPEED HEADER */}
      <header className="sticky top-[41px] z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-2.5">
          <div className="flex items-center justify-between gap-4">
            
            {/* Delivery address chip */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setShowLocationModal(true)}>
              <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Zap className="w-4 h-4 fill-emerald-500" />
              </div>
              <div>
                <div className="flex items-center gap-1 text-xs font-bold text-slate-900">
                  <span>Delivering in 35–45 Mins</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <span className="text-[11px] text-slate-500 block truncate max-w-[200px] sm:max-w-xs">
                  {selectedLocality}
                </span>
              </div>
            </div>

            {/* Quick stats & Cart Link */}
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                🌱 100% Pure Veg
              </span>
              <Link 
                href="/cart"
                className="relative bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Cart ({totalCartCount || cartItems.length})</span>
              </Link>
            </div>
          </div>

          {/* Search bar front & center */}
          <div className="mt-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cakes, flowers, truffle, midnight combos..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 border border-transparent focus:border-emerald-500 transition-all"
            />
          </div>
        </div>

        {/* STICKY HORIZONTAL CATEGORY CHIPS */}
        <div className="border-t border-slate-100 bg-white">
          <div className="max-w-5xl mx-auto px-4 flex items-center gap-2 overflow-x-auto py-2 scrollbar-none text-xs">
            {QUICK_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                className={`px-3 py-1.5 rounded-full whitespace-nowrap font-semibold transition-all flex items-center gap-1.5 ${
                  selectedCat === cat.id
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* QUICK COMMERCE MAIN FEED */}
      <main className="max-w-5xl mx-auto px-4 py-4 space-y-4">
        
        {/* FLASH DEALS COUNTDOWN TICKER BANNER */}
        <div className="bg-gradient-to-r from-amber-500 via-rose-500 to-emerald-600 text-white p-3 sm:p-4 rounded-2xl shadow-sm flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center font-black">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider block">Vadodara Express Flash Deal</span>
              <p className="text-[11px] text-white/90">Flat ₹100 Instant Discount on orders ₹699+ · Code: <strong>EXPRESS100</strong></p>
            </div>
          </div>
          <span className="hidden sm:block text-xs font-black bg-white text-slate-950 px-3 py-1 rounded-lg">
            Ends in 02:45:00
          </span>
        </div>

        {/* DENSE QUICK COMMERCE PRODUCT LISTING */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {filtered.map(product => {
            const qty = quantities[product.id] || 0;
            return (
              <div 
                key={product.id}
                className="bg-white rounded-2xl p-3 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 mb-2.5">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-1.5 left-1.5 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                      <Clock className="w-2.5 h-2.5" /> {product.eta}
                    </span>
                  </div>

                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold inline-block mb-1">
                    100% Eggless
                  </span>

                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                    {product.name}
                  </h3>

                  <span className="text-[11px] text-slate-500 block mt-0.5">{product.weight}</span>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-sm sm:text-base font-black text-slate-900">₹{product.price}</span>
                    <span className="text-[10px] text-slate-400 line-through ml-1">₹{product.originalPrice}</span>
                  </div>

                  {/* STEPPER BUTTON (- 1 +) */}
                  {qty === 0 ? (
                    <button
                      onClick={() => handleIncrement(product)}
                      className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 px-3 py-1 rounded-lg text-xs font-bold transition-all shadow-xs"
                    >
                      ADD
                    </button>
                  ) : (
                    <div className="flex items-center bg-emerald-600 text-white rounded-lg px-1.5 py-0.5 text-xs font-bold gap-2 shadow-xs">
                      <button onClick={() => handleDecrement(product)} className="p-0.5 hover:opacity-80">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span>{qty}</span>
                      <button onClick={() => handleIncrement(product)} className="p-0.5 hover:opacity-80">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </main>

      {/* STICKY BOTTOM CHECKOUT DRAWER BAR (Swiggy / Zepto Style) */}
      {totalCartCount > 0 && (
        <aside 
          aria-label="Active Cart Order Drawer" 
          className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900 text-white p-3 shadow-2xl border-t border-slate-800 animate-slide-up"
        >
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
            <div>
              <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider block">
                {totalCartCount} item{totalCartCount > 1 ? 's' : ''} added
              </span>
              <span className="text-lg font-black text-white">₹{totalCartAmount}</span>
              <span className="text-[11px] text-slate-400 ml-2">(Free Delivery Active)</span>
            </div>

            <Link
              href="/cart"
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 px-6 py-2.5 rounded-xl font-black text-xs tracking-wide transition-all shadow-lg flex items-center gap-1.5"
            >
              <span>View Cart &amp; Pay</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </aside>
      )}

      {/* LOCALITY PICKER MODAL */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900">Select Vadodara Area</h3>
            <p className="text-xs text-slate-500">Pick your neighborhood for fastest 35-minute doorstep dispatch:</p>
            <div className="space-y-1.5 max-h-60 overflow-y-auto">
              {['Alkapuri, Vadodara (35 mins)', 'Akota & Old Padra Rd (40 mins)', 'Gotri & Vasna (45 mins)', 'Karelibaug & Fatehgunj (40 mins)', 'Manjalpur (45 mins)', 'Bhayli (50 mins)'].map(loc => (
                <button
                  key={loc}
                  onClick={() => {
                    setSelectedLocality(loc.split(' (')[0]);
                    setShowLocationModal(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold hover:bg-slate-100 flex items-center justify-between"
                >
                  <span>{loc}</span>
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowLocationModal(false)}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
