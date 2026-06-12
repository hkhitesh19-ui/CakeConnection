"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ShoppingBag, Eye, Heart, Volume2, VolumeX } from 'lucide-react';
import { Container } from '@/components/ui';
import { cn } from '@/utils';
import Link from 'next/link';

// ── Web Audio API sound generator (No external assets required!) ──
function playBeep(frequency = 600, type: OscillatorType = 'sine', duration = 0.08) {
  if (typeof window === 'undefined') return;
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = type;
    osc.frequency.value = frequency;
    
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // Audio context not allowed or supported
  }
}

export default function Homepage2() {
  const [flavor, setFlavor] = useState<'chocolate' | 'strawberry' | 'gold'>('chocolate');
  const [toppings, setToppings] = useState<string[]>(['sprinkles']);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  // Mouse coordinate state for 3D hover rotation
  const [rotateY, setRotateY] = useState(0);
  const [rotateX, setRotateX] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Calculate smooth 360 degree rotation on X-axis and tilt on Y-axis
    const calculatedY = (x / (rect.width / 2)) * 180; // Rotates up to 180 degrees left/right
    const calculatedX = -(y / (rect.height / 2)) * 30; // Tilts up to 30 degrees up/down
    
    setRotateY(calculatedY);
    setRotateX(calculatedX);
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
    if (soundEnabled) playBeep(700, 'sine', 0.05);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    // Smooth reset
    setRotateY(0);
    setRotateX(0);
  };

  const handleToppingToggle = (topping: string) => {
    if (soundEnabled) playBeep(800, 'triangle');
    setToppings((prev) =>
      prev.includes(topping) ? prev.filter((t) => t !== topping) : [...prev, topping]
    );
  };

  const selectFlavor = (newFlavor: typeof flavor) => {
    if (soundEnabled) playBeep(500, 'sine', 0.15);
    setFlavor(newFlavor);
  };

  // Flavor styling config
  const flavorConfig = {
    chocolate: {
      bg: 'from-amber-950 to-stone-900',
      cakeImage: '/images/black-forest-cake.png',
      accentColor: '#d4a574',
      glow: 'shadow-[0_0_60px_rgba(92,58,33,0.45)]',
      text: 'Chocolate Fudge Duo'
    },
    strawberry: {
      bg: 'from-rose-950 to-stone-900',
      cakeImage: '/images/red-velvet-cake.png',
      accentColor: '#f7cad0',
      glow: 'shadow-[0_0_60px_rgba(232,125,143,0.5)]',
      text: 'Strawberry Velvet'
    },
    gold: {
      bg: 'from-amber-900 via-stone-900 to-stone-900',
      cakeImage: '/images/butterscotch-cake.png',
      accentColor: '#f7d070',
      glow: 'shadow-[0_0_60px_rgba(217,167,74,0.45)]',
      text: 'Golden Butterscotch'
    }
  };

  const activeTheme = flavorConfig[flavor];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${activeTheme.bg} transition-colors duration-1000 text-white font-sans overflow-hidden relative`}>
      
      {/* ── Background Glow ── */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-brand-rose/[0.05] blur-3xl pointer-events-none" />

      {/* ── Top Bar Controls ── */}
      <div className="absolute top-6 right-6 z-50 flex items-center gap-4">
        <button 
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full border border-white/10 transition-colors"
          title={soundEnabled ? "Disable Sounds" : "Enable Sounds"}
        >
          {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-gray-400" />}
        </button>
      </div>

      <Container className="pt-28 pb-20 relative z-10">
        
        {/* ── Main Feature: 3D Interactive Customizer ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
          
          {/* Left: 3D Image Hover Rotation Area */}
          <div className="flex flex-col items-center justify-center relative min-h-[400px]">
            
            {/* Interactive Control Instructions */}
            <div className="absolute top-0 flex gap-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-4 py-1.5 z-30 text-xs font-semibold text-brand-rose tracking-wider uppercase animate-pulse">
              ✨ Hover Mouse to Rotate 3D Cake Image ✨
            </div>

            {/* Interactive Image Container */}
            <div 
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="w-96 h-96 flex items-center justify-center relative cursor-crosshair"
              style={{ perspective: '1000px' }}
            >
              <div 
                className={`relative w-80 h-80 transition-all duration-300 ease-out rounded-full overflow-hidden ${activeTheme.glow}`}
                style={{
                  transformStyle: 'preserve-3d',
                  transform: isHovering 
                    ? `rotateY(${rotateY}deg) rotateX(${rotateX}deg) scale(1.08)` 
                    : 'rotateY(0deg) rotateX(0deg) scale(1)',
                  boxShadow: isHovering 
                    ? '0 30px 60px rgba(0,0,0,0.6), 0 0 40px rgba(255,255,255,0.05)'
                    : '0 15px 30px rgba(0,0,0,0.4)'
                }}
              >
                {/* Real Cake Image */}
                <img
                  src={activeTheme.cakeImage}
                  alt={activeTheme.text}
                  className="w-full h-full object-cover select-none"
                />

                {/* Toppings visual overlays when active */}
                {toppings.includes('sprinkles') && (
                  <div className="absolute inset-0 bg-gradient-to-tr from-brand-rose/20 via-transparent to-brand-rose-gold/20 mix-blend-overlay pointer-events-none" />
                )}
                {toppings.includes('fruits') && (
                  <div className="absolute top-4 left-4 z-10 w-8 h-8 rounded-full bg-red-600/20 blur-md pointer-events-none" />
                )}
              </div>

              {/* Decorative 3D Ring */}
              <div 
                className="absolute inset-0 rounded-full border border-white/10 pointer-events-none transition-transform duration-300"
                style={{
                  transform: isHovering 
                    ? `rotateY(${rotateY * 0.5}deg) rotateX(${rotateX * 0.5}deg) scale(1.15)`
                    : 'rotateY(0deg) rotateX(0deg) scale(1)'
                }}
              />
            </div>

            {/* Specifications Label */}
            <div className="mt-8 text-center bg-white/5 border border-white/10 backdrop-blur-md px-6 py-3 rounded-2xl">
              <span className="text-xs text-brand-rose font-bold uppercase tracking-wider block">Real-time Custom Image Customizer</span>
              <h3 className="text-lg font-bold mt-1 text-white">{activeTheme.text}</h3>
              <p className="text-xs text-text-secondary mt-1">
                Move mouse over image to rotate left-right / tilt up-down
              </p>
            </div>

          </div>

          {/* Right: Customizer Control Interface */}
          <div className="space-y-8 text-left">
            <div className="space-y-4">
              <span className="text-xs font-bold text-brand-rose tracking-widest uppercase flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Interactive 3D Lab
              </span>
              <h2 className="font-display text-4xl sm:text-5xl font-extrabold leading-tight text-white">
                Customize Your <br />
                <span className="text-gradient-rose">3D Artisan Cake</span>
              </h2>
              <p className="text-text-secondary text-sm sm:text-base leading-relaxed">
                Experience real-time interactive design. Choose the flavor, toppings, and witness it transform instantly. Handmade fresh in Vadodara.
              </p>
            </div>

            {/* Flavor Select */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary">
                Select Base Flavor
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'chocolate', label: 'Belgian Chocolate' },
                  { id: 'strawberry', label: 'Strawberry Velvet' },
                  { id: 'gold', label: 'Royal Butterscotch' }
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => selectFlavor(f.id as any)}
                    className={cn(
                      "px-4 py-3 rounded-xl border text-xs font-bold tracking-wide transition-all duration-300 cursor-pointer",
                      flavor === f.id 
                        ? "bg-brand-rose border-brand-rose text-white shadow-lg shadow-brand-rose/25" 
                        : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20"
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Toppings Select */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary">
                Add Premium Toppings
              </label>
              <div className="flex flex-wrap gap-3">
                {[
                  { id: 'sprinkles', label: 'Sparkly Sprinkles' },
                  { id: 'fruits', label: 'Fresh Berry Medley' },
                  { id: 'chips', label: 'Choco Chip Layer' }
                ].map((t) => {
                  const isChecked = toppings.includes(t.id);
                  return (
                    <button
                      key={t.id}
                      onClick={() => handleToppingToggle(t.id)}
                      className={cn(
                        "px-4 py-2.5 rounded-xl border text-xs font-semibold tracking-wide transition-all cursor-pointer",
                        isChecked 
                          ? "bg-white text-black border-white shadow-md" 
                          : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
                      )}
                    >
                      {isChecked ? '✓ ' : '+ '} {t.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Cart & Action Block */}
            <div className="pt-6 border-t border-white/10 flex items-center justify-between gap-6">
              <div>
                <span className="text-xs text-text-secondary">Estimated Price</span>
                <div className="text-2xl font-bold text-brand-rose">₹699</div>
              </div>

              <div className="flex gap-3">
                <Link
                  href="/cakes"
                  className="px-6 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold tracking-wide transition-all flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" /> View Catalog
                </Link>
                <button
                  onClick={() => {
                    if (soundEnabled) playBeep(900, 'sine', 0.25);
                    alert(`${activeTheme.text} added to cart!`);
                  }}
                  className="px-8 py-3.5 bg-brand-rose hover:bg-brand-rose-dark text-white rounded-xl text-sm font-bold tracking-wide transition-all shadow-lg shadow-brand-rose/20 flex items-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" /> Order Custom Cake
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* ── Interactive 3D Card Hover Section ── */}
        <div className="mt-28 space-y-10">
          <div className="text-center">
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
              Interactive 3D Hover Cards
            </h3>
            <p className="text-text-secondary text-sm max-w-md mx-auto mt-2">
              Move your mouse over the cards below to see the luxury 3D tilt perspective.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Signature Cakes', desc: 'Indulge in artisanal chocolate truffles & premium red velvets.', img: '/images/hero-cake.png', href: '/cakes' },
              { title: 'Fresh Bouquets', desc: 'Exquisite red roses, orchids & seasonal mixed flower arrangements.', img: '/images/hero-flowers.png', href: '/flowers' },
              { title: 'Gift Combos', desc: 'Curated combination hampers to surprise your loved ones.', img: '/images/combo-gift.png', href: '/combos' }
            ].map((card, idx) => (
              <motion.div
                key={idx}
                onMouseEnter={() => {
                  setHoveredCard(idx);
                  if (soundEnabled) playBeep(700 + idx * 50, 'sine', 0.05);
                }}
                onMouseLeave={() => setHoveredCard(null)}
                className="group relative h-96 rounded-2xl overflow-hidden border border-white/10 bg-white/5 flex flex-col justify-end p-6 cursor-pointer shadow-xl transition-all duration-300 hover:border-brand-rose/40"
                style={{
                  perspective: '1000px',
                }}
              >
                {/* 3D background scale */}
                <div className="absolute inset-0 z-0">
                  <img 
                    src={card.img} 
                    alt={card.title} 
                    className="w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                </div>

                {/* Floating tags */}
                <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-brand-rose/80 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-wider text-white">
                  3D View Available
                </div>

                {/* Content */}
                <div 
                  className="relative z-10 space-y-2 text-left transition-transform duration-500"
                  style={{
                    transform: hoveredCard === idx ? 'translateZ(30px) translateY(-5px)' : 'translateZ(0) translateY(0)'
                  }}
                >
                  <h4 className="font-display text-xl font-bold text-white group-hover:text-brand-rose transition-colors">
                    {card.title}
                  </h4>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {card.desc}
                  </p>
                  <Link 
                    href={card.href}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-rose hover:text-brand-rose-light transition-colors pt-2"
                  >
                    Enter Experience <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </Container>
    </div>
  );
}

// Icon helper
function ArrowRight(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
  );
}
