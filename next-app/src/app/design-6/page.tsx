"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, 
  MapPin, 
  ShoppingBag, 
  Heart, 
  User, 
  ChevronDown, 
  Clock, 
  Sparkles, 
  Truck, 
  ShieldCheck, 
  Star, 
  Plus, 
  Minus, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Phone, 
  Gift, 
  Zap,
  Tag,
  HelpCircle,
  Award,
  CreditCard,
  Cake,
  Flame,
  X,
  Calendar,
  Ticket,
  ArrowRight
} from 'lucide-react';
import DesignSwitcher from '@/components/home/DesignSwitcher';
import { useCartStore } from '@/stores/cartStore';

// Hero Carousel Slides
const HERO_SLIDES = [
  {
    id: 1,
    badge: 'Vadodara Bestseller 2026',
    title: 'Delight in Every Bite — 100% Eggless Cakes',
    subtitle: 'Belgian Truffle, Fresh Berry Gateaux & Dutch Cream Cakes baked fresh upon order.',
    priceBadge: 'Starting @ ₹449',
    cta: 'Order Cake Now',
    coupon: 'Use Code: CAKE50 for ₹50 OFF',
    tag: '⚡ 2-Hour Express Drop',
    bgGradient: 'from-[#881337] via-[#9F1239] to-[#E11D48]',
    accentBadge: '#FFE500',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 2,
    badge: 'FlowerAura Romance Collection',
    title: 'Say It With Hand-Tied Blooms & Cakes',
    subtitle: '15 Dutch Crimson Roses + Rich Belgian Ganache Gateau for an unforgettable gesture.',
    priceBadge: 'Combos from ₹899',
    cta: 'Explore Combos',
    coupon: 'Includes Free Greeting Card & Ribbon',
    tag: '🌸 Cold-Chain Hydrated',
    bgGradient: 'from-[#4C0519] via-[#831843] to-[#BE185D]',
    accentBadge: '#FDE047',
    image: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 3,
    badge: 'Winni Midnight Surprise',
    title: 'Guaranteed 12:00 AM Midnight Delivery',
    subtitle: 'The doorbell rings right when their birthday begins. Confirmed slot booking in Vadodara.',
    priceBadge: '12:00 AM Slot Confirmed',
    cta: 'Book Midnight Slot',
    coupon: 'Includes Magic Sparklers & Velvet Note',
    tag: '🌙 12:00 AM Bell Drop',
    bgGradient: 'from-[#0F081D] via-[#1E0F3D] to-[#3B1470]',
    accentBadge: '#F59E0B',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 4,
    badge: 'Personalized Memories',
    title: 'Custom Edible Photo Cakes in 2 Hours',
    subtitle: '100% edible sugar sheet printing with food-grade colors. Send photo on WhatsApp!',
    priceBadge: 'Ready in 2 Hours',
    cta: 'Order Photo Cake',
    coupon: 'Flat 15% OFF on Photo Cakes',
    tag: '📸 100% Edible Print',
    bgGradient: 'from-[#1E3A8A] via-[#1D4ED8] to-[#2563EB]',
    accentBadge: '#93C5FD',
    image: 'https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&w=1200&q=85',
  },
];

// Circular Navigation Icons
const QUICK_CIRCLES = [
  { id: 'c1', label: 'All Cakes', emoji: '🎂', href: '#products', color: 'bg-rose-50 text-rose-600 border-rose-200' },
  { id: 'c2', label: 'Flowers', emoji: '💐', href: '#products', color: 'bg-pink-50 text-pink-600 border-pink-200' },
  { id: 'c3', label: 'Combos', emoji: '🎁', href: '#products', color: 'bg-amber-50 text-amber-600 border-amber-200' },
  { id: 'c4', label: 'Midnight 12AM', emoji: '🌙', href: '#products', color: 'bg-purple-50 text-purple-600 border-purple-200' },
  { id: 'c5', label: 'Photo Cakes', emoji: '📸', href: '#products', color: 'bg-blue-50 text-blue-600 border-blue-200' },
  { id: 'c6', label: 'Chocolates', emoji: '🍫', href: '#products', color: 'bg-amber-50 text-amber-800 border-amber-200' },
  { id: 'c7', label: '100% Eggless', emoji: '🌱', href: '#products', color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
  { id: 'c8', label: 'Under ₹599', emoji: '⚡', href: '#products', color: 'bg-red-50 text-red-600 border-red-200' },
];

// Curated Occasions
const OCCASION_CARDS = [
  {
    id: 'bday',
    title: 'Birthday Cakes',
    subtitle: 'From ₹499',
    image: 'https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&w=600&q=80',
    tag: 'Bestseller',
  },
  {
    id: 'anniv',
    title: 'Anniversary Roses & Cake',
    subtitle: 'Combos from ₹999',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80',
    tag: 'Most Loved',
  },
  {
    id: 'romance',
    title: 'Romantic Surprises',
    subtitle: 'Heart-Shaped Bakes',
    image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=600&q=80',
    tag: '12:00 AM Slot',
  },
  {
    id: 'berries',
    title: 'Fresh Fruit Delights',
    subtitle: 'Real Berry Cakes',
    image: 'https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?auto=format&fit=crop&w=600&q=80',
    tag: 'Seasonal',
  },
];

// Product Catalog Data
const WINNI_PRODUCTS = [
  {
    id: 'wn-1',
    name: 'Luscious Chocolate Truffle Cake',
    category: 'cakes',
    price: 549,
    originalPrice: 699,
    discount: '21% OFF',
    rating: 4.9,
    reviews: 1420,
    deliverySpeed: 'Earliest Delivery: Today in 2 Hours',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=700&q=80',
    tag: 'Bestseller #1',
  },
  {
    id: 'wn-2',
    name: 'Red Velvet Heart Cake with Cream Cheese',
    category: 'cakes',
    price: 649,
    originalPrice: 799,
    discount: '19% OFF',
    rating: 4.9,
    reviews: 890,
    deliverySpeed: 'Earliest Delivery: Today in 2 Hours',
    image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=700&q=80',
    tag: 'Romantic Special',
  },
  {
    id: 'wn-3',
    name: 'Fresh Strawberry Vanilla Gateau',
    category: 'cakes',
    price: 599,
    originalPrice: 749,
    discount: '20% OFF',
    rating: 4.8,
    reviews: 640,
    deliverySpeed: 'Earliest Delivery: Today in 2 Hours',
    image: 'https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?auto=format&fit=crop&w=700&q=80',
    tag: 'Fresh Farm Fruit',
  },
  {
    id: 'wn-4',
    name: 'Celebration Truffle Cake + 10 Red Roses Combo',
    category: 'combos',
    price: 1199,
    originalPrice: 1499,
    discount: '20% OFF',
    rating: 5.0,
    reviews: 1120,
    deliverySpeed: 'Midnight Delivery Available',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=700&q=80',
    tag: 'Super Saver Combo',
  },
  {
    id: 'wn-5',
    name: '12 Scarlet Red Dutch Roses Bouquet',
    category: 'flowers',
    price: 599,
    originalPrice: 799,
    discount: '25% OFF',
    rating: 4.9,
    reviews: 480,
    deliverySpeed: 'Earliest Delivery: Today in 2 Hours',
    image: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=700&q=80',
    tag: 'Fresh Morning Blooms',
  },
  {
    id: 'wn-6',
    name: 'Rainbow Birthday Confetti Cake',
    category: 'cakes',
    price: 649,
    originalPrice: 799,
    discount: '18% OFF',
    rating: 4.8,
    reviews: 520,
    deliverySpeed: 'Earliest Delivery: Today in 2 Hours',
    image: 'https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&w=700&q=80',
    tag: 'Kids Favorite',
  },
  {
    id: 'wn-7',
    name: 'Midnight Romantic Truffle & Greeting Combo',
    category: 'midnight',
    price: 1399,
    originalPrice: 1699,
    discount: '17% OFF',
    rating: 5.0,
    reviews: 730,
    deliverySpeed: '12:00 AM Delivery Guaranteed',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=700&q=80',
    tag: 'Midnight Special',
  },
  {
    id: 'wn-8',
    name: 'Exotic Mixed Carnations & Lilies Bunch',
    category: 'flowers',
    price: 849,
    originalPrice: 1099,
    discount: '22% OFF',
    rating: 4.9,
    reviews: 310,
    deliverySpeed: 'Earliest Delivery: Today in 2 Hours',
    image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=700&q=80',
    tag: 'Luxury Arrangement',
  },
];

export default function Design6Page() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [selectedLocality, setSelectedLocality] = useState('Vadodara (390007)');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedWeights, setSelectedWeights] = useState<{ [key: string]: string }>({});
  const [addedNotice, setAddedNotice] = useState<string | null>(null);
  
  // Gift Finder Bar State (FlowerAura style)
  const [finderOccasion, setFinderOccasion] = useState('Birthday');
  const [finderCategory, setFinderCategory] = useState('all');
  const [finderArea, setFinderArea] = useState('Vadodara (390007)');
  const [finderWhen, setFinderWhen] = useState('Today (Within 2 Hours)');

  const handleFindGifts = () => {
    setActiveTab(finderCategory);
    setSelectedLocality(finderArea);
    const prodSection = document.getElementById('products');
    if (prodSection) {
      prodSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  const addItem = useCartStore((s) => s.addItem);
  const cartItems = useCartStore((s) => s.items);

  // Auto carousel slide timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handleQuickAdd = (product: typeof WINNI_PRODUCTS[0]) => {
    const w = selectedWeights[product.id] || '500g';
    const multiplier = w === '1kg' ? 1.85 : w === '2kg' ? 3.6 : 1;
    const finalPrice = Math.round(product.price * multiplier);

    addItem({
      productId: product.id,
      variantId: `${product.id}-${w}`,
      name: `${product.name} (${w})`,
      price: finalPrice,
      image: product.image,
      weight: w,
      quantity: 1,
    });

    setAddedNotice(product.name);
    setTimeout(() => setAddedNotice(null), 2500);
  };

  const filteredProducts = activeTab === 'all' 
    ? WINNI_PRODUCTS 
    : WINNI_PRODUCTS.filter(p => p.category === activeTab);

  return (
    <div className="min-h-screen bg-[#F7F7F7] text-gray-800 font-sans antialiased selection:bg-rose-100 selection:text-rose-900">
      <DesignSwitcher activeDesign="design-6" />

      {/* 1. TOP MICRO NAV (Winni Style) */}
      <div className="bg-[#212121] text-gray-300 text-[11px] py-1.5 px-4 hidden md:block border-b border-gray-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span>🇮🇳 Delivering to <strong>Vadodara</strong> &amp; All Major Gujarat Locations</span>
            <span className="text-gray-500">•</span>
            <span className="text-amber-400 font-semibold">⚡ Same-Day Delivery within 2 Hours</span>
          </div>

          <div className="flex items-center gap-5 text-gray-300">
            <Link href="/faq" className="hover:text-white transition-colors">Help &amp; FAQ</Link>
            <span>|</span>
            <span className="text-gray-400">Currency: <strong className="text-white">INR (₹)</strong></span>
            <span>|</span>
            <Link href="/orders" className="hover:text-white transition-colors">Track Order</Link>
            <span>|</span>
            <span className="text-rose-400 font-bold">100% Eggless Certified</span>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER (Winni Style Brand, Big Search & Location) */}
      <header className="sticky top-[41px] z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <Link href="/design-6" className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#DC0013] to-[#FF4E89] text-white flex items-center justify-center shadow-md shadow-red-500/20">
              <Cake className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-[#DC0013]">
                Cake<span className="text-[#212121]">Connection</span>
              </span>
              <span className="block text-[9px] uppercase tracking-[0.25em] text-gray-500 font-bold -mt-0.5">
                Cakes · Flowers · Gifts
              </span>
            </div>
          </Link>

          {/* Search Bar Front & Center */}
          <div className="flex-1 max-w-xl relative hidden md:block">
            <div className="relative">
              <input 
                type="text"
                value={searchQuery}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search 5000+ cakes, flowers, combos, gifts in Vadodara..."
                className="w-full pl-4 pr-11 py-2.5 rounded-lg border border-gray-300 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#DC0013] focus:ring-1 focus:ring-[#DC0013] transition-all bg-gray-50 focus:bg-white"
              />
              <button 
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-md bg-[#DC0013] text-white flex items-center justify-center hover:bg-[#b50010] transition-colors"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>

            {/* Trending shortcut popup on focus */}
            {searchFocused && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-50 animate-slide-up text-xs">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                  Trending Searches in Vadodara:
                </span>
                <div className="flex flex-wrap gap-2">
                  {['Truffle Cake', 'Midnight Delivery', 'Dutch Roses', 'Red Velvet', 'Birthday Combos', 'Photo Cakes', 'Under ₹599'].map(term => (
                    <button
                      key={term}
                      onClick={() => setSearchQuery(term)}
                      className="px-3 py-1 rounded-full bg-gray-100 hover:bg-rose-50 hover:text-[#DC0013] text-gray-700 font-medium transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Action Icons: Location, Account, Wishlist, Cart */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Delivery Location Picker */}
            <button 
              onClick={() => setShowLocationModal(true)}
              className="hidden lg:flex items-center gap-2 bg-rose-50 hover:bg-rose-100 text-[#DC0013] px-3 py-1.5 rounded-lg border border-rose-200 transition-colors text-xs font-semibold"
            >
              <MapPin className="w-4 h-4 text-[#DC0013] shrink-0" />
              <div className="text-left">
                <span className="text-[10px] text-gray-500 block leading-tight">Deliver To:</span>
                <span className="truncate max-w-[120px] block">{selectedLocality}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 ml-1 text-gray-500" />
            </button>

            {/* User Account */}
            <Link 
              href="/auth/login"
              className="flex items-center gap-1.5 text-xs text-gray-700 hover:text-[#DC0013] font-medium p-1.5 rounded-lg transition-colors"
            >
              <User className="w-5 h-5" />
              <span className="hidden xl:inline">Sign In</span>
            </Link>

            {/* Wishlist */}
            <Link 
              href="/wishlist"
              className="relative p-1.5 text-gray-700 hover:text-[#DC0013] transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#DC0013] text-white text-[10px] font-bold flex items-center justify-center">
                0
              </span>
            </Link>

            {/* Shopping Cart Button */}
            <Link 
              href="/cart"
              className="flex items-center gap-2 bg-[#DC0013] hover:bg-[#b50010] text-white px-4 py-2 rounded-lg text-xs font-bold shadow-md shadow-red-500/20 transition-all hover:scale-105"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Cart ({cartItems.length})</span>
            </Link>
          </div>
        </div>

        {/* 3. MEGA CATEGORY NAVIGATION BAR (Winni Style) */}
        <nav className="border-t border-gray-100 bg-white shadow-xs overflow-x-auto scrollbar-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-6 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-700 whitespace-nowrap">
            <button onClick={() => setActiveTab('cakes')} className="hover:text-[#DC0013] transition-colors flex items-center gap-1">
              <span>CAKES</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>
            <button onClick={() => setActiveTab('flowers')} className="hover:text-[#DC0013] transition-colors flex items-center gap-1">
              <span>FLOWERS</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>
            <button onClick={() => setActiveTab('combos')} className="hover:text-[#DC0013] transition-colors flex items-center gap-1">
              <span>COMBOS</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>
            <Link href="/cakes" className="hover:text-[#DC0013] transition-colors">PHOTO CAKES</Link>
            <Link href="/combos" className="hover:text-[#DC0013] transition-colors">CHOCOLATES</Link>
            <Link href="/flowers" className="hover:text-[#DC0013] transition-colors">PLANTS</Link>
            <button onClick={() => setActiveTab('midnight')} className="hover:text-[#DC0013] transition-colors flex items-center gap-1 text-purple-700">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>MIDNIGHT 12AM</span>
            </button>
            <button onClick={() => setActiveTab('all')} className="hover:text-[#DC0013] transition-colors flex items-center gap-1 text-[#DC0013]">
              <Zap className="w-3.5 h-3.5 fill-[#DC0013]" />
              <span>SAME DAY IN 2 HRS</span>
            </button>
          </div>
        </nav>
      </header>

      {/* Toast Notification */}
      {addedNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#212121] text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 border border-gray-700 text-xs font-semibold animate-slide-up">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Added <strong>{addedNotice}</strong> to cart!</span>
          <Link href="/cart" className="underline text-[#FF4E89] ml-2 font-bold uppercase">View Cart</Link>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. HERO SECTION: FLOWERAURA & WINNI HYBRID SPLIT PROMO     */}
      {/* ========================================================= */}
      <section className="relative bg-gradient-to-b from-gray-50 via-white to-gray-50/50 py-4 sm:py-6 border-b border-gray-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          {/* Top Trust Micro Bar (FlowerAura Style Trust Elements) */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-semibold text-gray-600 bg-white py-2 px-4 rounded-xl shadow-xs border border-gray-100 mb-4">
            <div className="flex items-center gap-2 text-[#DC0013]">
              <Zap className="w-4 h-4 fill-[#DC0013]" />
              <span className="font-bold text-gray-900">Vadodara Express:</span>
              <span className="text-gray-600">Free 2-Hour Delivery on orders above ₹499</span>
            </div>
            <div className="hidden sm:flex items-center gap-4 text-[11px] text-gray-500">
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 100% Eggless Certified</span>
              <span className="text-gray-300">•</span>
              <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-amber-500" /> 12:00 AM Midnight Slots Available</span>
              <span className="text-gray-300">•</span>
              <span className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> 4.9/5 Rating (12,800+ Reviews)</span>
            </div>
          </div>

          {/* Grid: 8 Cols Main Carousel + 4 Cols Stacked Promo Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5">
            
            {/* LEFT: 70% MAIN PROMOTIONAL CAROUSEL */}
            <div className="lg:col-span-8 relative rounded-2xl overflow-hidden shadow-xl min-h-[380px] sm:min-h-[420px] lg:min-h-[440px] flex">
              {HERO_SLIDES.map((slide, idx) => (
                <div 
                  key={slide.id}
                  className={`absolute inset-0 transition-opacity duration-700 bg-gradient-to-r ${slide.bgGradient} text-white flex flex-col justify-between p-6 sm:p-8 lg:p-10 ${
                    idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                  }`}
                >
                  {/* Decorative ambient background blur */}
                  <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full filter blur-3xl pointer-events-none -mr-20 -mt-20"></div>
                  <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-black/20 rounded-full filter blur-2xl pointer-events-none"></div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 h-full items-center relative z-10">
                    {/* Slide Text Content */}
                    <div className="sm:col-span-7 space-y-4 text-left">
                      
                      {/* Top Badges */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span 
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider shadow-sm text-slate-950"
                          style={{ backgroundColor: slide.accentBadge }}
                        >
                          <Flame className="w-3 h-3 text-red-600 fill-red-600" />
                          {slide.badge}
                        </span>
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-black/30 backdrop-blur-sm border border-white/20 text-white">
                          {slide.tag}
                        </span>
                      </div>

                      {/* Main Title */}
                      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight drop-shadow-sm">
                        {slide.title}
                      </h1>

                      {/* Subtitle */}
                      <p className="text-xs sm:text-sm text-white/90 font-medium leading-relaxed max-w-md line-clamp-2">
                        {slide.subtitle}
                      </p>

                      {/* FlowerAura Style Promo Coupon Pill */}
                      <div className="inline-flex items-center gap-2.5 bg-black/35 backdrop-blur-md border border-dashed border-amber-300/80 px-3.5 py-1.5 rounded-lg text-xs">
                        <Ticket className="w-4 h-4 text-amber-300 shrink-0" />
                        <span className="font-bold text-amber-200 tracking-wide">{slide.coupon}</span>
                      </div>

                      {/* CTA Actions */}
                      <div className="pt-2 flex flex-wrap items-center gap-3">
                        <a 
                          href="#products"
                          onClick={() => {
                            if (slide.id === 1) setActiveTab('cakes');
                            if (slide.id === 2) setActiveTab('combos');
                            if (slide.id === 3) setActiveTab('midnight');
                            if (slide.id === 4) setActiveTab('cakes');
                          }}
                          className="inline-flex items-center gap-2 bg-white hover:bg-amber-50 text-slate-950 px-6 py-3 rounded-xl text-xs font-black shadow-2xl transition-all hover:scale-105 uppercase tracking-wider group"
                        >
                          <span>{slide.cta}</span>
                          <ArrowRight className="w-4 h-4 text-[#DC0013] group-hover:translate-x-1 transition-transform" />
                        </a>

                        <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold">
                          <Tag className="w-3.5 h-3.5 text-amber-300" />
                          <span>{slide.priceBadge}</span>
                        </div>
                      </div>
                    </div>

                    {/* Slide Product Hero Image */}
                    <div className="hidden sm:flex sm:col-span-5 relative h-full items-center justify-center">
                      <div className="relative w-full aspect-square max-w-[280px] lg:max-w-[320px]">
                        <img 
                          src={slide.image} 
                          alt={slide.title} 
                          className="w-full h-full object-cover rounded-2xl shadow-2xl border-2 border-white/20 transform group-hover:scale-105 transition-transform duration-500"
                        />
                        {/* Highlighting Tag Sticker */}
                        <div className="absolute -bottom-3 -right-2 bg-[#212121] text-white px-3 py-1.5 rounded-xl border border-amber-400/50 shadow-xl flex items-center gap-1.5 text-[11px] font-bold">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          <span>100% Eggless Vadodara</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Slider Navigation Arrows */}
              <button 
                onClick={() => setCurrentSlide((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1))}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/75 text-white flex items-center justify-center backdrop-blur-md transition-all hover:scale-110 shadow-lg"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/75 text-white flex items-center justify-center backdrop-blur-md transition-all hover:scale-110 shadow-lg"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Slider Indicators */}
              <div className="absolute bottom-4 left-6 z-20 flex items-center gap-2">
                {HERO_SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === currentSlide ? 'bg-white w-8' : 'bg-white/40 w-2 hover:bg-white/70'
                    }`}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* RIGHT: 30% STACKED WINNI / FLOWERAURA PROMO CARDS */}
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4">
              
              {/* Promo Card 1: ⚡ Express 2-Hour Delivery */}
              <div className="flex-1 relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#E11D48] via-[#BE123C] to-[#881337] p-5 text-white shadow-lg border border-red-400/30 flex flex-col justify-between group hover:shadow-2xl transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full filter blur-xl pointer-events-none"></div>
                
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shadow-md font-black">
                      <Zap className="w-5 h-5 fill-slate-950 text-slate-950" />
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider bg-black/30 backdrop-blur-xs border border-white/20 px-2.5 py-1 rounded-full text-amber-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      Kitchen Active Now
                    </span>
                  </div>

                  <h3 className="text-lg font-black tracking-tight text-white mb-1">
                    ⚡ 2-Hour Express Delivery
                  </h3>
                  <p className="text-xs text-rose-100 leading-relaxed mb-3">
                    Hot out of the oven! Baked on order and rushed directly to your doorstep in Vadodara.
                  </p>

                  <div className="space-y-1.5 text-[11px] text-white/90 font-medium mb-4">
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                      <span>Alkapuri, Akota, Gotri, Manjalpur &amp; 30+ Hubs</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                      <span>Zero delivery fee on prepaid orders</span>
                    </div>
                  </div>
                </div>

                <a 
                  href="#products"
                  onClick={() => setActiveTab('all')}
                  className="inline-flex items-center justify-between w-full bg-white hover:bg-amber-50 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl shadow-md transition-all group-hover:scale-[1.02]"
                >
                  <span>Order Express Now</span>
                  <ArrowRight className="w-4 h-4 text-[#DC0013] group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

              {/* Promo Card 2: 🌙 Guaranteed Midnight 12 AM Delivery */}
              <div className="flex-1 relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0F081D] via-[#1E0F3D] to-[#3B1470] p-5 text-white shadow-lg border border-purple-500/30 flex flex-col justify-between group hover:shadow-2xl transition-all duration-300">
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full filter blur-xl pointer-events-none"></div>

                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="w-9 h-9 rounded-xl bg-purple-500 text-white flex items-center justify-center shadow-md font-black">
                      <Sparkles className="w-5 h-5 text-amber-300" />
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2.5 py-1 rounded-full">
                      12:00 AM Guaranteed
                    </span>
                  </div>

                  <h3 className="text-lg font-black tracking-tight text-white mb-1">
                    🌙 Midnight 12 AM Surprise
                  </h3>
                  <p className="text-xs text-purple-200 leading-relaxed mb-3">
                    The doorbell rings exact at midnight! Make their birthday or anniversary truly unforgettable.
                  </p>

                  <div className="space-y-1.5 text-[11px] text-white/90 font-medium mb-4">
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                      <span>Complimentary Magic Sparklers &amp; Velvet Card</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                      <span>99.8% On-Time Midnight Drop in Vadodara</span>
                    </div>
                  </div>
                </div>

                <a 
                  href="#products"
                  onClick={() => setActiveTab('midnight')}
                  className="inline-flex items-center justify-between w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl shadow-md transition-all group-hover:scale-[1.02]"
                >
                  <span>Book Midnight Slot</span>
                  <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

            </div>

          </div>

          {/* ========================================================= */}
          {/* FLOWERAURA SIGNATURE GIFT FINDER BAR                      */}
          {/* ========================================================= */}
          <div className="mt-5 sm:mt-6 bg-white rounded-2xl shadow-xl border border-gray-200/90 p-4 sm:p-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3 sm:mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#DC0013] flex items-center justify-center font-bold">
                  <Gift className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-black text-gray-900 tracking-tight">
                    FlowerAura Gift Finder — Vadodara Express
                  </h2>
                  <p className="text-[11px] text-gray-500 font-medium">
                    Quickly discover the best-rated cakes, blooms &amp; combos for your special occasion
                  </p>
                </div>
              </div>
              <span className="hidden md:inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                Fast Dispatch Across Vadodara
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
              {/* 1. Occasion */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-gray-500 mb-1.5">
                  1. Occasion
                </label>
                <div className="relative">
                  <select
                    value={finderOccasion}
                    onChange={(e) => setFinderOccasion(e.target.value)}
                    className="w-full bg-gray-50 hover:bg-gray-100 focus:bg-white text-gray-900 text-xs font-bold py-2.5 pl-3 pr-8 rounded-xl border border-gray-200 focus:border-[#DC0013] focus:ring-1 focus:ring-[#DC0013] outline-none transition-all cursor-pointer"
                  >
                    <option value="Birthday">🎂 Birthday Celebration</option>
                    <option value="Anniversary">💍 Wedding &amp; Anniversary</option>
                    <option value="Romance">❤️ Romance &amp; Love</option>
                    <option value="Congratulations">🎉 Congratulations</option>
                    <option value="Thank You">💐 Thank You &amp; Appreciation</option>
                    <option value="Midnight">🌙 Midnight 12AM Surprise</option>
                  </select>
                </div>
              </div>

              {/* 2. Category / Looking For */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-gray-500 mb-1.5">
                  2. I Am Looking For
                </label>
                <div className="relative">
                  <select
                    value={finderCategory}
                    onChange={(e) => setFinderCategory(e.target.value)}
                    className="w-full bg-gray-50 hover:bg-gray-100 focus:bg-white text-gray-900 text-xs font-bold py-2.5 pl-3 pr-8 rounded-xl border border-gray-200 focus:border-[#DC0013] focus:ring-1 focus:ring-[#DC0013] outline-none transition-all cursor-pointer"
                  >
                    <option value="all">🌟 All Categories</option>
                    <option value="cakes">🎂 Freshly Baked Cakes</option>
                    <option value="flowers">💐 Hand-Tied Flowers</option>
                    <option value="combos">🎁 Cake + Flower Combos</option>
                    <option value="midnight">🌙 Midnight 12AM Specials</option>
                  </select>
                </div>
              </div>

              {/* 3. Delivery Locality */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-gray-500 mb-1.5">
                  3. Deliver To (Vadodara)
                </label>
                <div className="relative">
                  <select
                    value={finderArea}
                    onChange={(e) => setFinderArea(e.target.value)}
                    className="w-full bg-gray-50 hover:bg-gray-100 focus:bg-white text-gray-900 text-xs font-bold py-2.5 pl-3 pr-8 rounded-xl border border-gray-200 focus:border-[#DC0013] focus:ring-1 focus:ring-[#DC0013] outline-none transition-all cursor-pointer"
                  >
                    <option value="Vadodara (390007)">Vadodara (All Areas)</option>
                    <option value="Alkapuri (390007)">Alkapuri (390007)</option>
                    <option value="Akota (390020)">Akota (390020)</option>
                    <option value="Gotri (390021)">Gotri (390021)</option>
                    <option value="Manjalpur (390011)">Manjalpur (390011)</option>
                    <option value="Fatehgunj (390002)">Fatehgunj (390002)</option>
                    <option value="Karelibaug (390018)">Karelibaug (390018)</option>
                    <option value="Vasna Road (390015)">Vasna Road (390015)</option>
                    <option value="Subhanpura (390023)">Subhanpura (390023)</option>
                  </select>
                </div>
              </div>

              {/* 4. When / Time Slot */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-gray-500 mb-1.5">
                  4. When to Deliver
                </label>
                <div className="relative">
                  <select
                    value={finderWhen}
                    onChange={(e) => setFinderWhen(e.target.value)}
                    className="w-full bg-gray-50 hover:bg-gray-100 focus:bg-white text-gray-900 text-xs font-bold py-2.5 pl-3 pr-8 rounded-xl border border-gray-200 focus:border-[#DC0013] focus:ring-1 focus:ring-[#DC0013] outline-none transition-all cursor-pointer"
                  >
                    <option value="Today (Within 2 Hours)">⚡ Today (Within 2 Hours)</option>
                    <option value="Today (Evening 5-8 PM)">🌆 Today (Evening 5:00 - 8:00 PM)</option>
                    <option value="Today (Midnight 12 AM)">🌙 Today (Midnight 12:00 AM)</option>
                    <option value="Tomorrow (Standard Slot)">📅 Tomorrow (Standard Free Slot)</option>
                    <option value="Select Custom Date">📆 Select Custom Date</option>
                  </select>
                </div>
              </div>

              {/* 5. Find Gifts CTA Button */}
              <div>
                <button
                  onClick={handleFindGifts}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-[#DC0013] to-[#FF4E89] hover:from-[#b50010] hover:to-[#e03a74] text-white text-xs font-black rounded-xl shadow-md shadow-red-500/25 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>FIND GIFTS</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. CIRCULAR QUICK CATEGORY ICONS (Winni Style)            */}
      {/* ========================================================= */}
      <section className="bg-white py-6 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-4 text-center">
            {QUICK_CIRCLES.map((circ) => (
              <a 
                key={circ.id}
                href={circ.href}
                onClick={() => {
                  if (circ.id === 'c1') setActiveTab('cakes');
                  if (circ.id === 'c2') setActiveTab('flowers');
                  if (circ.id === 'c3') setActiveTab('combos');
                  if (circ.id === 'c4') setActiveTab('midnight');
                }}
                className="group flex flex-col items-center gap-2 cursor-pointer"
              >
                <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 ${circ.color} flex items-center justify-center text-2xl sm:text-3xl shadow-xs group-hover:scale-110 group-hover:shadow-md transition-all duration-300`}>
                  <span>{circ.emoji}</span>
                </div>
                <span className="text-xs font-bold text-gray-700 group-hover:text-[#DC0013] transition-colors leading-tight">
                  {circ.label}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. CURATED OCCASION CARDS (Winni Occasion Grid)           */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
              Celebrate Every Moment in Vadodara
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">Handpicked collections for birthdays, anniversaries &amp; romantic dates</p>
          </div>
          <Link href="/cakes" className="text-xs font-bold text-[#DC0013] hover:underline flex items-center gap-1">
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {OCCASION_CARDS.map((occ) => (
            <div 
              key={occ.id}
              onClick={() => setActiveTab('cakes')}
              className="relative rounded-xl overflow-hidden bg-gray-900 group cursor-pointer shadow-sm hover:shadow-lg transition-all"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img 
                  src={occ.image} 
                  alt={occ.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-85 group-hover:opacity-100"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 text-white">
                <span className="text-[10px] uppercase tracking-wider font-bold text-amber-400 mb-0.5">{occ.tag}</span>
                <h3 className="text-sm sm:text-base font-bold leading-tight">{occ.title}</h3>
                <span className="text-xs text-gray-300 font-medium mt-0.5">{occ.subtitle}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 7. FEATURED PRODUCTS CATALOG (Winni Style Grid)           */}
      {/* ========================================================= */}
      <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        
        {/* Category Filter Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-3 mb-6">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none text-xs font-bold">
            {[
              { id: 'all', label: '🔥 All Bestsellers' },
              { id: 'cakes', label: '🎂 Cakes' },
              { id: 'combos', label: '🎁 Combos' },
              { id: 'flowers', label: '💐 Flowers' },
              { id: 'midnight', label: '🌙 Midnight Specials' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#DC0013] text-white shadow-md shadow-red-500/20'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <span className="text-xs text-gray-500 font-medium">
            Showing {filteredProducts.length} treats available in Vadodara
          </span>
        </div>

        {/* Winni-Style Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredProducts.map((product) => {
            const currentWeight = selectedWeights[product.id] || '500g';
            const multiplier = currentWeight === '1kg' ? 1.85 : currentWeight === '2kg' ? 3.6 : 1;
            const dynamicPrice = Math.round(product.price * multiplier);
            const dynamicOriginal = Math.round(product.originalPrice * multiplier);

            return (
              <div 
                key={product.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-rose-300 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Image container */}
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Veg Green Dot Badge */}
                    <div className="absolute top-2.5 left-2.5 bg-white p-1 rounded border border-gray-200 shadow-xs flex items-center justify-center">
                      <div className="w-3.5 h-3.5 border-2 border-emerald-600 flex items-center justify-center p-0.5">
                        <div className="w-2 h-2 rounded-full bg-emerald-600"></div>
                      </div>
                    </div>

                    {/* Tag Badge */}
                    <span className="absolute top-2.5 right-2.5 bg-[#DC0013] text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded shadow-xs">
                      {product.tag}
                    </span>

                    {/* Rating pill */}
                    <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-sm px-2 py-0.5 rounded text-[11px] font-bold text-gray-800 shadow-xs flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{product.rating}</span>
                      <span className="text-gray-400 text-[10px]">({product.reviews})</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-2">
                    <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#DC0013] transition-colors line-clamp-1 leading-snug">
                      {product.name}
                    </h3>

                    {/* Weight Switcher (If cake) */}
                    {product.category === 'cakes' && (
                      <div className="flex items-center gap-1 pt-1">
                        <span className="text-[11px] text-gray-500 font-semibold mr-1">Weight:</span>
                        {['500g', '1kg'].map(w => (
                          <button
                            key={w}
                            onClick={() => setSelectedWeights(prev => ({ ...prev, [product.id]: w }))}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                              currentWeight === w 
                                ? 'bg-[#DC0013] text-white border-[#DC0013]' 
                                : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-400'
                            }`}
                          >
                            {w}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Price Block */}
                    <div className="flex items-baseline gap-2 pt-1">
                      <span className="text-lg font-black text-[#DC0013]">₹{dynamicPrice}</span>
                      <span className="text-xs text-gray-400 line-through">₹{dynamicOriginal}</span>
                      <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                        {product.discount}
                      </span>
                    </div>

                    {/* Delivery speed line */}
                    <div className="flex items-center gap-1 text-[11px] text-gray-500 pt-1">
                      <Clock className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span className="truncate">{product.deliverySpeed}</span>
                    </div>
                  </div>
                </div>

                {/* Add to Cart CTA */}
                <div className="p-4 pt-0">
                  <button
                    onClick={() => handleQuickAdd(product)}
                    className="w-full py-2.5 rounded-lg bg-[#DC0013] hover:bg-[#b50010] text-white text-xs font-bold tracking-wide transition-all shadow-sm flex items-center justify-center gap-1.5 active:scale-98"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>ADD TO CART</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 8. BUDGET-FRIENDLY GIFTING BANNER                         */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="bg-gradient-to-r from-rose-500 via-[#DC0013] to-red-700 text-white rounded-2xl p-6 sm:p-8 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-xs uppercase tracking-widest font-black text-amber-300">Pocket-Friendly Gifting</span>
            <h3 className="text-xl sm:text-2xl font-black">Find the Perfect Gift within Your Budget</h3>
            <p className="text-xs text-white/80">Delicious 100% eggless cakes &amp; fresh flowers without breaking the bank.</p>
          </div>

          <div className="flex flex-wrap gap-2.5 justify-center">
            {['Under ₹499', 'Under ₹799', 'Under ₹999', 'Luxury Above ₹1499'].map(b => (
              <button
                key={b}
                onClick={() => setActiveTab('cakes')}
                className="bg-white/15 hover:bg-white text-white hover:text-gray-900 border border-white/40 px-4 py-2 rounded-lg text-xs font-bold transition-all backdrop-blur-sm"
              >
                {b}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 9. WINNI-STYLE TRUST & USP BADGES                         */}
      {/* ========================================================= */}
      <section className="bg-white py-10 border-y border-gray-200 mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-3.5 p-3">
              <div className="w-12 h-12 rounded-xl bg-red-50 text-[#DC0013] flex items-center justify-center shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">2-Hour Express Delivery</h4>
                <p className="text-xs text-gray-500 mt-0.5">Prompt delivery across all Vadodara pin codes.</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">12:00 AM Midnight Delivery</h4>
                <p className="text-xs text-gray-500 mt-0.5">Surprise them right when their birthday begins.</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">100% Pure Eggless Kitchen</h4>
                <p className="text-xs text-gray-500 mt-0.5">Zero gelatin, prepared strictly vegetarian.</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">15,000+ Happy Customers</h4>
                <p className="text-xs text-gray-500 mt-0.5">Vadodara&apos;s highest-rated gifting bakery portal.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 10. LOCAL SEO & ABOUT CONTENT (Winni Style Bottom Text)   */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="bg-white rounded-xl p-6 sm:p-8 border border-gray-200 space-y-4 text-xs text-gray-600 leading-relaxed">
          <h2 className="text-base font-bold text-gray-900">
            Online Cake Delivery in Vadodara – Same Day &amp; Midnight by CakeConnection
          </h2>
          <p>
            Welcome to CakeConnection, Vadodara&apos;s trusted online portal for fresh, delicious, 100% eggless cakes, fragrant flower bouquets, and curated celebration combos. Whether you are celebrating a Birthday, 25th Anniversary, Valentine&apos;s Day, or a festive milestone, our master bakers in Vadodara bake every single gateau fresh upon your order.
          </p>
          <p>
            We proudly serve all key localities in Vadodara including <strong>Alkapuri, Akota, Gotri, Vasna Road, Karelibaug, Fatehgunj, Manjalpur, Waghodia Road, and Bhayli</strong> with temperature-controlled 2-hour rush courier dispatches and confirmed 12:00 AM midnight deliveries.
          </p>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 11. WINNI-STYLE MULTI-COLUMN FOOTER                      */}
      {/* ========================================================= */}
      <footer className="bg-[#1C1C1C] text-gray-400 text-xs pt-12 pb-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-10 border-b border-gray-800">
            
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Popular Cake Flavors</h4>
              <ul className="space-y-1.5 text-gray-400">
                <li><Link href="/cakes" className="hover:text-white transition-colors">Chocolate Truffle Cake</Link></li>
                <li><Link href="/cakes" className="hover:text-white transition-colors">Black Forest Cake</Link></li>
                <li><Link href="/cakes" className="hover:text-white transition-colors">Red Velvet Cheese Cake</Link></li>
                <li><Link href="/cakes" className="hover:text-white transition-colors">Butterscotch Cake</Link></li>
                <li><Link href="/cakes" className="hover:text-white transition-colors">Fresh Fruit &amp; Strawberry Cake</Link></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Flowers &amp; Combos</h4>
              <ul className="space-y-1.5 text-gray-400">
                <li><Link href="/flowers" className="hover:text-white transition-colors">Red Dutch Roses Bouquet</Link></li>
                <li><Link href="/flowers" className="hover:text-white transition-colors">Carnations &amp; Lilies</Link></li>
                <li><Link href="/combos" className="hover:text-white transition-colors">Cake &amp; Flowers Combos</Link></li>
                <li><Link href="/combos" className="hover:text-white transition-colors">Midnight Surprise Bundles</Link></li>
                <li><Link href="/combos" className="hover:text-white transition-colors">Custom Photo Cakes</Link></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Vadodara Areas Serviced</h4>
              <ul className="space-y-1.5 text-gray-400">
                <li>Alkapuri &amp; RC Dutt Road</li>
                <li>Akota &amp; Old Padra Road</li>
                <li>Gotri, Vasna &amp; Bhayli</li>
                <li>Karelibaug &amp; Sayajigunj</li>
                <li>Manjalpur &amp; Makarpura</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Help &amp; Support</h4>
              <ul className="space-y-1.5 text-gray-400">
                <li><Link href="/orders" className="hover:text-white transition-colors">Track Order Status</Link></li>
                <li><Link href="/faq" className="hover:text-white transition-colors">Frequently Asked Questions</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">About CakeConnection</Link></li>
                <li><span className="text-rose-400 font-semibold">Customer Helpline: +91 98250 12345</span></li>
                <li><span>Email: support@cakeconnection.in</span></li>
              </ul>
            </div>

          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-500">
            <p>© 2026 CakeConnection.in · Inspired by Winni.in High-Conversion Design · All Rights Reserved.</p>
            <div className="flex items-center gap-4">
              <span>🔒 100% Safe Payments (UPI, Cards, NetBanking, COD)</span>
            </div>
          </div>
        </div>
      </footer>

      {/* LOCATION PICKER MODAL */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900">Select Vadodara Pincode / Area</h3>
              <button onClick={() => setShowLocationModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500">Choose your delivery destination in Vadodara:</p>
            <div className="space-y-1.5 max-h-60 overflow-y-auto">
              {[
                'Alkapuri, Vadodara (390007)',
                'Akota & Old Padra Rd (390020)',
                'Gotri & Vasna (390021)',
                'Karelibaug & Fatehgunj (390018)',
                'Manjalpur (390011)',
                'Bhayli (391410)'
              ].map(loc => (
                <button
                  key={loc}
                  onClick={() => {
                    setSelectedLocality(loc);
                    setShowLocationModal(false);
                  }}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold hover:bg-rose-50 hover:text-[#DC0013] flex items-center justify-between border border-transparent hover:border-rose-200 transition-colors"
                >
                  <span>{loc}</span>
                  <MapPin className="w-3.5 h-3.5 text-[#DC0013]" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
