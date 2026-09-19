"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  ShoppingBag, 
  Check, 
  RotateCcw, 
  Sliders, 
  Layers, 
  Heart, 
  Info, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  ArrowRight,
  Flame
} from 'lucide-react';
import DesignSwitcher from '@/components/home/DesignSwitcher';
import { useCartStore } from '@/stores/cartStore';

// Studio Customizer Presets
const FLAVORS = [
  {
    id: 'truffle',
    name: 'Belgian Dark Truffle',
    color: '#381E15',
    tag: '70% Valrhona Cacao',
    basePrice: 649,
    description: 'Rich bittersweet ganache made with single-origin Belgian cocoa butter.',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=85',
  },
  {
    id: 'strawberry',
    name: 'Mahabaleshwar Fresh Berry',
    color: '#BE185D',
    tag: 'Farm-fresh Strawberry',
    basePrice: 749,
    description: 'Soft vanilla sponge layered with hand-crushed seasonal strawberries and whipped cream.',
    image: 'https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?auto=format&fit=crop&w=1000&q=85',
  },
  {
    id: 'pistachio',
    name: 'Bronte Pistachio & Rose',
    color: '#065F46',
    tag: 'Royal Persian Nut',
    basePrice: 849,
    description: 'Bronte pistachio mousse infused with organic rose water and edible emerald crunch.',
    image: 'https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&w=1000&q=85',
  },
  {
    id: 'hazelnut',
    name: 'Piedmont Praline Crunch',
    color: '#92400E',
    tag: 'Roasted Hazelnut',
    basePrice: 799,
    description: 'Silky roasted hazelnut cream layered with crispy caramelized French wafer flakes.',
    image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=1000&q=85',
  },
];

const WEIGHTS = [
  { id: '500g', label: '500 Grams', servings: 'Serves 4–6', multiplier: 1 },
  { id: '1kg', label: '1 Kilogram', servings: 'Serves 8–12', multiplier: 1.85 },
  { id: '2kg', label: '2 Kilograms', servings: 'Serves 16–22', multiplier: 3.6 },
];

const TOPPINGS = [
  { id: 'macarons', label: 'French Macarons (x3)', price: 129 },
  { id: 'goldleaf', label: '24K Edible Gold Leaf', price: 99 },
  { id: 'berries', label: 'Extra Glazed Berries', price: 119 },
  { id: 'rosepetals', label: 'Candied Rose Petals', price: 79 },
];

export default function Design1Page() {
  const [selectedFlavor, setSelectedFlavor] = useState(FLAVORS[0]);
  const [selectedWeight, setSelectedWeight] = useState(WEIGHTS[0]);
  const [selectedToppings, setSelectedToppings] = useState<string[]>(['macarons']);
  const [customPlaque, setCustomPlaque] = useState('Happy Birthday!');
  const [activeTab, setActiveTab] = useState<'cake' | 'message' | 'toppings'>('cake');
  const [addedNotice, setAddedNotice] = useState(false);
  
  const addItem = useCartStore((s) => s.addItem);

  // Price Calculation
  const toppingsTotal = selectedToppings.reduce((acc, tId) => {
    const t = TOPPINGS.find(item => item.id === tId);
    return acc + (t ? t.price : 0);
  }, 0);

  const totalPrice = Math.round((selectedFlavor.basePrice * selectedWeight.multiplier) + toppingsTotal);

  const handleToggleTopping = (id: string) => {
    setSelectedToppings(prev => 
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const handleAddToCart = () => {
    addItem({
      productId: `studio-${selectedFlavor.id}`,
      variantId: `studio-${selectedFlavor.id}-${selectedWeight.id}`,
      name: `${selectedFlavor.name} Studio Cake`,
      price: totalPrice,
      image: selectedFlavor.image,
      weight: selectedWeight.id,
      customMessage: customPlaque,
      quantity: 1,
    });
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#111318] text-slate-100 font-sans antialiased selection:bg-amber-500/30 selection:text-amber-200">
      <DesignSwitcher activeDesign="design-1" />

      {/* STUDIO TOOLBAR HEADER */}
      <header className="sticky top-[41px] z-40 bg-[#161922]/90 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/design-1" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-black shadow-md">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-2">
                  CakeConnection <span className="text-[10px] px-2 py-0.5 rounded bg-amber-400/10 text-amber-400 border border-amber-400/30 uppercase tracking-wider font-bold">3D Studio</span>
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="hidden sm:flex items-center gap-2 text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Vadodara Atelier · 100% Eggless</span>
            </div>

            <Link
              href="/cart"
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-3.5 py-1.5 rounded-lg font-medium transition-colors border border-slate-700"
            >
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span>Cart</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Toast */}
      {addedNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-amber-400 text-slate-950 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 font-bold text-xs animate-slide-up border border-amber-300">
          <Check className="w-4 h-4 text-slate-950" />
          <span>Custom Studio Cake added to bag!</span>
          <Link href="/cart" className="underline font-black ml-2">Checkout</Link>
        </div>
      )}

      {/* ========================================================= */}
      {/* FULL STUDIO WORKBENCH (SPLIT-SCREEN INTERACTIVE CANVAS)   */}
      {/* ========================================================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: VISUAL INTERACTIVE STUDIO CANVAS (7 COLS) */}
          <div className="lg:col-span-7 bg-[#171A24] rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative flex flex-col justify-between overflow-hidden min-h-[580px]">
            <div className="absolute -top-24 -left-24 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Top Canvas Bar */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs uppercase tracking-wider font-bold text-slate-400">Live 3D Customizer</span>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {selectedFlavor.tag}
              </span>
            </div>

            {/* Cake Visual Display with Simulated Real-Time Layers */}
            <div className="my-8 relative flex items-center justify-center">
              <div className="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden border-2 border-slate-700/80 shadow-2xl bg-black/40 group">
                <img 
                  src={selectedFlavor.image} 
                  alt={selectedFlavor.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />

                {/* Simulated Custom Plaque Overlay */}
                {customPlaque && (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-amber-100 text-amber-950 px-5 py-2 rounded-full shadow-2xl border-2 border-amber-300/80 font-serif italic text-xs sm:text-sm font-bold tracking-wide whitespace-nowrap backdrop-blur-md">
                    “{customPlaque}”
                  </div>
                )}

                {/* Live Badge */}
                <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md text-amber-300 px-3 py-1 rounded-lg text-xs font-semibold border border-amber-400/30 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{selectedWeight.label}</span>
                </div>
              </div>
            </div>

            {/* Bottom Canvas Controls: Quick Flavor Switcher Pills */}
            <div className="z-10 bg-[#12141C] p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
                {FLAVORS.map(f => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedFlavor(f)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 border whitespace-nowrap ${
                      selectedFlavor.id === f.id
                        ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md font-bold'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: f.color }}></span>
                    <span>{f.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>

              <span className="text-[11px] text-slate-400 shrink-0">
                100% Pure Eggless Guaranteed
              </span>
            </div>
          </div>

          {/* RIGHT: LIVE CONFIGURATOR & ORDER CONTROL (5 COLS) */}
          <div className="lg:col-span-5 bg-[#171A24] rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6">
            
            {/* Header info */}
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-1">
                Active Recipe Configuration
              </span>
              <h2 className="text-2xl font-black text-white">{selectedFlavor.name}</h2>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{selectedFlavor.description}</p>
            </div>

            {/* STEP 1: WEIGHT SELECTION */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>1. Select Weight &amp; Size</span>
                <span className="text-amber-400 text-[11px] font-normal">{selectedWeight.servings}</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {WEIGHTS.map(w => (
                  <button
                    key={w.id}
                    onClick={() => setSelectedWeight(w)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border text-center ${
                      selectedWeight.id === w.id
                        ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span className="block">{w.id}</span>
                    <span className="block text-[9px] font-normal opacity-80">{w.servings.split(' ')[1]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* STEP 2: CUSTOM CHOCOLATE PLAQUE MESSAGE */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>2. Message on Chocolate Plaque</span>
                <span className="text-slate-500 text-[10px]">Free of charge</span>
              </label>
              <input
                type="text"
                maxLength={30}
                value={customPlaque}
                onChange={(e) => setCustomPlaque(e.target.value)}
                placeholder="e.g. Happy 25th Anniversary Mom & Dad!"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              />
              <span className="text-[10px] text-slate-500 block text-right">Max 30 characters</span>
            </div>

            {/* STEP 3: GOURMET TOPPINGS ADD-ONS */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="text-xs font-bold text-slate-300 block">
                3. Upgrade Gourmet Toppings (Optional)
              </label>
              <div className="space-y-2">
                {TOPPINGS.map(topping => {
                  const isSelected = selectedToppings.includes(topping.id);
                  return (
                    <button
                      key={topping.id}
                      onClick={() => handleToggleTopping(topping.id)}
                      className={`w-full p-3 rounded-xl text-xs font-medium transition-all flex items-center justify-between border ${
                        isSelected
                          ? 'bg-slate-900 text-amber-300 border-amber-400/60'
                          : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${isSelected ? 'bg-amber-400 text-slate-950 font-bold' : 'border border-slate-700'}`}>
                          {isSelected && '✓'}
                        </div>
                        <span>{topping.label}</span>
                      </div>
                      <span className="font-bold text-white">+₹{topping.price}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* PRICE SUMMARY & INSTANT ORDER */}
            <div className="pt-4 border-t border-slate-800 space-y-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">Total Studio Price</span>
                  <span className="text-3xl font-black text-amber-400">₹{totalPrice}</span>
                  <span className="text-xs text-slate-500 line-through ml-2">₹{totalPrice + 250}</span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-emerald-400 font-semibold block flex items-center justify-end gap-1">
                    <Clock className="w-3.5 h-3.5" /> 3h Express Delivery
                  </span>
                  <span className="text-[10px] text-slate-500">Vadodara Pin Codes Covered</span>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-slate-950 text-sm font-black tracking-wide shadow-xl shadow-amber-500/20 transition-all hover:scale-102 flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add Studio Cake to Bag</span>
              </button>
            </div>

          </div>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="mt-16 border-t border-slate-800 bg-[#0E1015] py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 CakeConnection Studio Edition · Interactive 3D Pâtisserie Customizer.</p>
          <Link href="/design-2" className="text-amber-400 hover:underline font-bold">
            Next: Design 02 (Bento Grid) →
          </Link>
        </div>
      </footer>
    </div>
  );
}
