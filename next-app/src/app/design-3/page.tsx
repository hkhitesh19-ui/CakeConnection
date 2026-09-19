"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Moon, 
  Sparkles, 
  Clock, 
  Heart, 
  Star, 
  Gift, 
  ShoppingBag, 
  ArrowRight, 
  Check, 
  ShieldCheck, 
  Flame, 
  PartyPopper,
  Calendar,
  Lock,
  ChevronRight,
  Plus
} from 'lucide-react';
import DesignSwitcher from '@/components/home/DesignSwitcher';
import { useCartStore } from '@/stores/cartStore';

const MIDNIGHT_SPECIALS = [
  {
    id: 'd3-m1',
    name: 'Midnight Velvet Desire Box',
    price: 1499,
    originalPrice: 1799,
    rating: 5.0,
    reviews: 320,
    tag: '12:00 AM Special',
    desc: 'Belgium Truffle Gateau + 15 Red Dutch Roses + Fairy Lights + Midnight Card',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
    slot: 'Tonight 12:00 AM Slot Guaranteed',
  },
  {
    id: 'd3-m2',
    name: 'Royal Black Forest & Wine Rose',
    price: 1299,
    originalPrice: 1549,
    rating: 4.9,
    reviews: 198,
    tag: 'Anniversary Hit',
    desc: 'Layers of sour cherry compote, dark chocolate flakes & crimson roses bunch',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
    slot: 'Confirmed 12:00 AM Drop',
  },
  {
    id: 'd3-m3',
    name: 'L’Amour Ferrero Luxury Tower',
    price: 1899,
    originalPrice: 2299,
    rating: 5.0,
    reviews: 142,
    tag: 'Ultra Premium',
    desc: 'Ferrero Hazelnut Glaze Cake + 24 Red Roses + 16 Ferrero Rocher pyramid',
    image: 'https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&w=800&q=80',
    slot: 'White Glove Courier in Vadodara',
  },
  {
    id: 'd3-m4',
    name: 'Midnight Red Velvet Elegance',
    price: 849,
    originalPrice: 999,
    rating: 4.9,
    reviews: 215,
    tag: 'Romance Favorite',
    desc: 'Silky cream cheese frosting on ruby red sponge with golden candle included',
    image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=800&q=80',
    slot: 'Available Tonight',
  },
];

export default function Design3Page() {
  const [selectedAddons, setSelectedAddons] = useState<string[]>(['Fairy Lights']);
  const [addedItem, setAddedItem] = useState<string | null>(null);
  const addItem = useCartStore((s) => s.addItem);

  const toggleAddon = (addon: string) => {
    setSelectedAddons(prev => 
      prev.includes(addon) ? prev.filter(a => a !== addon) : [...prev, addon]
    );
  };

  return (
    <div className="min-h-screen bg-[#0A0510] text-[#F3E8FF] font-sans antialiased selection:bg-amber-500/30 selection:text-amber-200 relative overflow-hidden">
      <DesignSwitcher activeDesign="design-3" />

      {/* Ambient Cosmic Background Glows */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-purple-900/20 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="fixed bottom-1/4 right-10 w-[500px] h-[500px] bg-rose-950/25 rounded-full blur-3xl pointer-events-none -z-10"></div>

      {/* Midnight Alert Ribbon */}
      <div className="bg-gradient-to-r from-amber-600 via-rose-600 to-purple-800 text-white py-2 px-4 text-center text-xs font-semibold tracking-wider flex items-center justify-center gap-3">
        <Moon className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
        <span>MIDNIGHT DELIVERY ACTIVE: Order before 10:30 PM for Tonight 12:00 AM sharp doorbell delivery across Vadodara!</span>
      </div>

      {/* Header */}
      <header className="sticky top-[41px] z-40 bg-[#0F0818]/85 backdrop-blur-xl border-b border-purple-950/70">
        <div className="max-w-7xl mx-auto px-6 h-18 py-4 flex items-center justify-between">
          <Link href="/design-3" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
              <Moon className="w-5 h-5 fill-amber-200" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-amber-200 via-rose-200 to-purple-200 bg-clip-text text-transparent font-serif">
                CakeConnection
              </span>
              <span className="block text-[9px] uppercase tracking-[0.25em] text-amber-400 font-semibold">
                Midnight Atelier · Vadodara
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4 text-xs">
            <div className="hidden sm:flex items-center gap-2 bg-purple-950/60 border border-purple-800/40 px-3.5 py-1.5 rounded-full text-purple-200">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>12:00 AM Bell Drop Guarantee</span>
            </div>

            <Link
              href="/cart"
              className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 px-4 py-2 rounded-full font-bold shadow-lg shadow-amber-500/20 transition-all hover:scale-105"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Your Box</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Toast */}
      {addedItem && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#160B24] text-amber-300 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-amber-500/40 text-xs font-semibold animate-slide-up">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Added <strong>{addedItem}</strong> for Midnight Drop!</span>
          <Link href="/cart" className="underline text-white ml-2">Checkout</Link>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-20">
        
        {/* ========================================================= */}
        {/* HERO: MIDNIGHT ROMANCE & CELEBRATION                      */}
        {/* ========================================================= */}
        <section className="relative rounded-3xl p-8 sm:p-14 bg-gradient-to-b from-purple-950/40 to-[#12081E]/60 border border-purple-900/40 shadow-2xl backdrop-blur-md overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-amber-500/10 via-rose-500/10 to-transparent blur-3xl pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Vadodara&apos;s #1 Midnight Surprise Service</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight font-serif">
                When the Clock Strikes Twelve, <br />
                <span className="bg-gradient-to-r from-amber-300 via-rose-300 to-purple-300 bg-clip-text text-transparent">
                  Make It Unforgettable.
                </span>
              </h1>

              <p className="text-purple-200/80 text-base max-w-xl font-light leading-relaxed">
                Imagine the doorbell ringing exactly at 00:00. A freshly baked, decadent eggless cake paired with fragrant Dutch roses and candlelight, handed over with your personal audio/letter wish.
              </p>

              {/* Slot Indicator */}
              <div className="p-4 rounded-2xl bg-black/40 border border-amber-500/30 max-w-lg flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-amber-400 font-bold block uppercase tracking-wider">Tonight 12:00 AM Slot</span>
                    <span className="text-xs text-purple-200">Only 7 slots left for Alkapuri &amp; Akota</span>
                  </div>
                </div>
                <a 
                  href="#midnight-specials"
                  className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all shrink-0"
                >
                  Book Slot
                </a>
              </div>

              <div className="pt-4 flex items-center gap-8 text-xs text-purple-300">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>100% Pure Eggless</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Exact 12:00 AM Drop</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Free Sparkler &amp; Card</span>
                </div>
              </div>
            </div>

            {/* Hero Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border border-amber-500/30 shadow-2xl bg-black/60 group">
                <img 
                  src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=85" 
                  alt="Midnight Celebration Box" 
                  className="w-full aspect-[4/5] object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="px-3 py-1 rounded-full bg-rose-500 text-white text-[10px] font-bold uppercase tracking-wider">
                    Midnight Signature
                  </span>
                  <h3 className="text-xl font-bold text-white mt-2 font-serif">Belgian Truffle + 15 Dutch Roses</h3>
                  <p className="text-xs text-purple-200 mt-1">Includes fairy lights, gold candle &amp; wax-sealed wish card.</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-2xl font-black text-amber-300">₹1,499</span>
                    <button
                      onClick={() => {
                        addItem({
                          productId: 'midnight-hero-box',
                          variantId: 'midnight-hero-box',
                          name: 'Midnight Belgian Truffle + 15 Roses Box',
                          price: 1499,
                          image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
                          weight: 'Standard',
                          quantity: 1,
                        });
                        setAddedItem('Midnight Belgian Truffle + Roses Box');
                        setTimeout(() => setAddedItem(null), 2500);
                      }}
                      className="bg-amber-400 hover:bg-amber-500 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold transition-all"
                    >
                      Instant Reserve
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* MIDNIGHT COMBOS CATALOG                                  */}
        {/* ========================================================= */}
        <section id="midnight-specials" className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-amber-400">Night Curations</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-serif">
              Midnight Surprise Combos
            </h2>
            <p className="text-xs text-purple-300/80 font-light">
              Hand-delivered right on time by our courteous uniformed midnight couriers across Vadodara.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MIDNIGHT_SPECIALS.map((item) => (
              <div 
                key={item.id}
                className="bg-[#140A20]/80 rounded-2xl p-5 border border-purple-900/50 hover:border-amber-500/50 shadow-lg hover:shadow-amber-500/10 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-purple-950 mb-4">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-2.5 left-2.5 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold text-amber-300 border border-amber-500/30">
                      {item.tag}
                    </span>
                  </div>

                  <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 mb-1">
                    <Clock className="w-3 h-3" /> {item.slot}
                  </span>

                  <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors font-serif">
                    {item.name}
                  </h3>

                  <p className="text-xs text-purple-300/70 mt-1.5 line-clamp-2">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-purple-900/60 flex items-center justify-between">
                  <div>
                    <span className="text-lg font-black text-amber-300">₹{item.price}</span>
                    <span className="text-xs text-purple-400 line-through ml-1.5">₹{item.originalPrice}</span>
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
                    className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shadow-md"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Order</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================= */}
        {/* ADDON CUSTOMIZER STRIP                                    */}
        {/* ========================================================= */}
        <section className="bg-gradient-to-r from-purple-950/60 via-[#180C28]/80 to-purple-950/60 rounded-3xl p-8 border border-purple-900/60">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <h3 className="text-lg font-bold text-white font-serif">Complete the Midnight Surprise</h3>
              <p className="text-xs text-purple-300/80">Every midnight order can include complimentary custom party add-ons:</p>
            </div>

            <div className="flex flex-wrap gap-3 justify-center">
              {['Fairy Lights (+₹99)', 'Cold Sparkler Candle (+₹49)', 'Custom Letter (+₹0)', 'Midnight Party Cap (+₹29)'].map(add => (
                <button
                  key={add}
                  onClick={() => toggleAddon(add)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${
                    selectedAddons.includes(add)
                      ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-md'
                      : 'bg-purple-950/40 text-purple-200 border-purple-800/60 hover:border-amber-400/50'
                  }`}
                >
                  {selectedAddons.includes(add) ? '✓ ' : '+ '}{add}
                </button>
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-[#07030B] border-t border-purple-950 text-purple-400 py-12 text-xs">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Moon className="w-5 h-5 text-amber-400 fill-amber-400" />
            <span className="text-white font-serif font-bold">CakeConnection Midnight Atelier</span>
          </div>

          <p>© 2026 CakeConnection.in · Midnight delivery available across all Vadodara pincodes.</p>

          <Link href="/design-4" className="text-amber-400 hover:underline font-semibold">
            Next: Design 04 (Joyful Festivity) →
          </Link>
        </div>
      </footer>
    </div>
  );
}
