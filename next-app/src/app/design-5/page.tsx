"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  ShoppingBag, 
  ArrowRight, 
  Check, 
  Flame, 
  PartyPopper, 
  Zap, 
  Star, 
  Plus, 
  HelpCircle,
  Clock,
  Heart,
  ThumbsUp,
  Smile
} from 'lucide-react';
import DesignSwitcher from '@/components/home/DesignSwitcher';
import { useCartStore } from '@/stores/cartStore';

const BRUTAL_CAKES = [
  {
    id: 'brutal-1',
    name: 'DEATH BY VALRHONA TRUFFLE',
    price: 649,
    originalPrice: 849,
    rating: '5.0 / 5',
    color: 'bg-[#FECDD3]',
    sticker: '🔥 OBSESSION',
    punchline: 'Single origin dark chocolate. Zero boring stuff.',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'brutal-2',
    name: 'WILD STRAWBERRY EXPLOSION',
    price: 749,
    originalPrice: 949,
    rating: '4.9 / 5',
    color: 'bg-[#BAE6FD]',
    sticker: '🍓 BERRY MADNESS',
    punchline: 'Direct from Mahabaleshwar. Loaded to the max.',
    image: 'https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'brutal-3',
    name: 'PISTACHIO ROYAL ROYALE',
    price: 849,
    originalPrice: 1099,
    rating: '4.9 / 5',
    color: 'bg-[#BBF7D0]',
    sticker: '👑 CHEF FLEX',
    punchline: 'Bronte pistachios + real rose water infusion.',
    image: 'https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'brutal-4',
    name: 'DUTCH ROSE + CAKE BOMB COMBO',
    price: 1399,
    originalPrice: 1699,
    rating: '5.0 / 5',
    color: 'bg-[#FDE68A]',
    sticker: '💥 ULTIMATE COMBO',
    punchline: 'Cake + 15 fresh crimson roses + party card.',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80',
  },
];

export default function Design5Page() {
  const [selectedTag, setSelectedTag] = useState('ALL');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const addItem = useCartStore((s) => s.addItem);

  const handleAdd = (cake: typeof BRUTAL_CAKES[0]) => {
    addItem({
      productId: cake.id,
      variantId: cake.id,
      name: cake.name,
      price: cake.price,
      image: cake.image,
      weight: '500g',
      quantity: 1,
    });
    setToastMsg(cake.name);
    setTimeout(() => setToastMsg(null), 2500);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF0] text-black font-sans antialiased selection:bg-[#FFE500] selection:text-black">
      <DesignSwitcher activeDesign="design-5" />

      {/* RUNNING RETRO MARQUEE BANNER */}
      <div className="bg-[#FFE500] border-b-4 border-black py-2.5 overflow-hidden whitespace-nowrap text-xs font-black uppercase tracking-widest flex items-center">
        <div className="animate-marquee flex items-center gap-8">
          <span>⚡ 100% EGGLESS CERTIFIED</span>
          <span>★</span>
          <span>SAME-DAY 2-HOUR DROP ACROSS VADODARA</span>
          <span>★</span>
          <span>ZERO GELATIN · ZERO COMPROMISE</span>
          <span>★</span>
          <span>12:00 AM MIDNIGHT SURPRISE SQUAD</span>
          <span>★</span>
          <span>FRESH BAKES DAILY</span>
          <span>★</span>
        </div>
      </div>

      {/* NEUBRUTALIST CHUNKY HEADER */}
      <header className="sticky top-[41px] z-40 bg-white border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-6 h-18 py-3 flex items-center justify-between">
          <Link href="/design-5" className="flex items-center gap-2">
            <div className="bg-[#FF5A5F] text-white font-black text-xl px-3 py-1 border-3 border-black shadow-[3px_3px_0px_#000] -rotate-2">
              CAKE!
            </div>
            <span className="font-black text-2xl tracking-tighter uppercase">
              CONNECTION<span className="text-[#FF5A5F]">.IN</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block bg-[#00F0FF] px-3 py-1 border-2 border-black font-black text-xs uppercase shadow-[2px_2px_0px_#000]">
              📍 VADODARA ONLY
            </span>

            <Link
              href="/cart"
              className="bg-[#FFE500] hover:bg-yellow-400 text-black px-5 py-2 border-3 border-black font-black text-xs uppercase tracking-wider shadow-[4px_4px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#000] transition-all flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>BAG</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#00F0FF] text-black px-6 py-4 border-4 border-black shadow-[6px_6px_0px_#000] font-black text-xs uppercase animate-bounce flex items-center gap-3">
          <Sparkles className="w-5 h-5" />
          <span>BOOM! {toastMsg} ADDED!</span>
          <Link href="/cart" className="underline font-black ml-2 bg-black text-white px-2 py-1">VIEW BAG</Link>
        </div>
      )}

      {/* ========================================================= */}
      {/* HERO: NEUBRUTALIST POSTER LAYOUT                          */}
      {/* ========================================================= */}
      <main className="max-w-7xl mx-auto px-6 py-12 space-y-20">
        <section className="bg-[#FF7686] border-4 border-black p-8 sm:p-14 shadow-[10px_10px_0px_#000] relative">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-block bg-[#FFE500] border-3 border-black px-4 py-1.5 font-black text-xs uppercase shadow-[3px_3px_0px_#000] -rotate-1">
                🧁 NO BORING CAKES ALLOWED!
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight uppercase leading-[0.95] drop-shadow-[3px_3px_0px_#000]">
                VADODARA’S <br />
                <span className="text-[#FFE500]">MOST CRAVEABLE</span> <br />
                EGGLESS CAKES.
              </h1>

              <p className="text-black font-bold text-base sm:text-lg max-w-xl bg-white p-4 border-3 border-black shadow-[4px_4px_0px_#000] leading-snug">
                100% Pure Veg European dark truffle, fresh seasonal strawberries &amp; midnight party drops. Handcrafted daily in Alkapuri.
              </p>

              <div className="pt-2 flex flex-wrap gap-4">
                <a
                  href="#bestsellers"
                  className="bg-black hover:bg-zinc-800 text-white px-8 py-4 border-3 border-black font-black text-sm uppercase tracking-wider shadow-[5px_5px_0px_#FFE500] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-2"
                >
                  <span>GRAB A CAKE NOW</span>
                  <ArrowRight className="w-5 h-5" />
                </a>

                <div className="bg-[#00F0FF] border-3 border-black px-6 py-4 font-black text-xs uppercase shadow-[4px_4px_0px_#000] flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>2HR VADODARA DROP</span>
                </div>
              </div>
            </div>

            {/* Poster Card Visual */}
            <div className="lg:col-span-5 relative">
              <div className="bg-white border-4 border-black p-4 shadow-[8px_8px_0px_#000] rotate-2 hover:rotate-0 transition-transform">
                <div className="relative aspect-square overflow-hidden border-3 border-black bg-zinc-100">
                  <img 
                    src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=85" 
                    alt="Valrhona Truffle Cake" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-[#FFE500] border-2 border-black px-3 py-1 font-black text-xs shadow-[2px_2px_0px_#000]">
                    🔥 VADODARA #1
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-black text-lg uppercase">VALRHONA TRUFFLE</h3>
                    <p className="text-xs font-bold text-zinc-600">Pure Belgian Cocoa Ganache</p>
                  </div>
                  <span className="font-black text-2xl bg-[#FFE500] px-3 py-1 border-2 border-black shadow-[2px_2px_0px_#000]">
                    ₹649
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* BRUTALIST PRODUCT SHOWCASE                                */}
        {/* ========================================================= */}
        <section id="bestsellers" className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-block bg-black text-white px-3 py-1 font-black text-xs uppercase tracking-widest mb-2">
                FRESHLY BAKED TODAY
              </div>
              <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">
                TOP FLAVOUR DROPS
              </h2>
            </div>
            <p className="text-xs font-black uppercase bg-[#00F0FF] px-4 py-2 border-2 border-black shadow-[3px_3px_0px_#000]">
              ⚡ SAME DAY 2-HOUR DELIVERY
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {BRUTAL_CAKES.map((cake) => (
              <div 
                key={cake.id}
                className={`${cake.color} border-4 border-black p-5 shadow-[6px_6px_0px_#000] hover:shadow-[10px_10px_0px_#000] hover:-translate-x-1 hover:-translate-y-1 transition-all flex flex-col justify-between`}
              >
                <div>
                  <div className="relative aspect-square border-3 border-black bg-white overflow-hidden mb-4">
                    <img 
                      src={cake.image} 
                      alt={cake.name} 
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 left-2 bg-white border-2 border-black px-2 py-0.5 text-[10px] font-black uppercase shadow-[2px_2px_0px_#000]">
                      {cake.sticker}
                    </span>
                  </div>

                  <span className="text-[10px] font-black uppercase bg-black text-white px-2 py-0.5 inline-block mb-2">
                    100% EGGLESS
                  </span>

                  <h3 className="text-base font-black uppercase leading-tight">
                    {cake.name}
                  </h3>

                  <p className="text-xs font-bold mt-2 text-zinc-800 leading-snug">
                    {cake.punchline}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t-3 border-black flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-black">₹{cake.price}</span>
                    <span className="text-xs font-bold line-through ml-1 opacity-60">₹{cake.originalPrice}</span>
                  </div>

                  <button
                    onClick={() => handleAdd(cake)}
                    className="bg-black hover:bg-zinc-800 text-white px-4 py-2 border-2 border-black font-black text-xs uppercase shadow-[3px_3px_0px_#FFE500] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>ADD</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================= */}
        {/* BRUTALIST PROMISE BANNER                                  */}
        {/* ========================================================= */}
        <section className="bg-[#FFE500] border-4 border-black p-8 sm:p-12 shadow-[8px_8px_0px_#000]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-white p-6 border-3 border-black shadow-[4px_4px_0px_#000]">
              <div className="text-3xl mb-2">🥚❌</div>
              <h4 className="font-black text-base uppercase">ZERO EGGS. EVER.</h4>
              <p className="text-xs font-bold text-zinc-700 mt-1">100% vegetarian bakery kitchen. No gelatin, no animal fat.</p>
            </div>

            <div className="bg-white p-6 border-3 border-black shadow-[4px_4px_0px_#000]">
              <div className="text-3xl mb-2">🚀⏱️</div>
              <h4 className="font-black text-base uppercase">2-HOUR VADODARA RUSH</h4>
              <p className="text-xs font-bold text-zinc-700 mt-1">Direct temperature-controlled bike dispatch to your door.</p>
            </div>

            <div className="bg-white p-6 border-3 border-black shadow-[4px_4px_0px_#000]">
              <div className="text-3xl mb-2">🌙🔔</div>
              <h4 className="font-black text-base uppercase">12:00 AM MIDNIGHT DROP</h4>
              <p className="text-xs font-bold text-zinc-700 mt-1">Guaranteed midnight doorbell surprises for birthdays.</p>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-black text-white py-12 border-t-4 border-black text-xs font-bold">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="bg-[#FFE500] text-black px-2 py-0.5 font-black uppercase">CAKECONNECTION</span>
            <span>NEUBRUTALIST EDITION 2026</span>
          </div>

          <p>© 2026 CakeConnection.in · All cakes baked fresh in Vadodara.</p>

          <Link href="/design-1" className="text-[#FFE500] hover:underline font-black uppercase">
            ← Back to Design 01 (3D Studio)
          </Link>
        </div>
      </footer>
    </div>
  );
}
