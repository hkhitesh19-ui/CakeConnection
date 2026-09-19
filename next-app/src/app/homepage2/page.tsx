"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  User,
  ShoppingBag,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Clock,
  Wheat,
  Palette,
  Star,
  ArrowRight,
  Check,
  X,
  Sparkles,
  Menu,
  ShieldCheck,
  Phone,
  Mail,
  MessageCircle,
  Truck,
  CreditCard,
  Lock,
  Gift
} from 'lucide-react';
import { FaInstagram, FaFacebookF } from 'react-icons/fa';
import { useCartStore } from '@/stores/cartStore';
import { formatPrice } from '@/utils';

// --- Types ---
interface ProductCard {
  id: string;
  name: string;
  category: 'cake' | 'bouquet';
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  image: string;
  badge?: string;
  description: string;
  flavors?: string[];
  weights?: string[];
}

interface Testimonial {
  id: number;
  name: string;
  occasion: string;
  locality: string;
  rating: number;
  quote: string;
  avatar: string;
}

interface BlogPost {
  id: number;
  title: string;
  readTime: string;
  category: string;
  image: string;
  excerpt: string;
}

// --- Data ---
const HERO_SLIDES = [
  {
    id: 1,
    image: '/images/hero-cake.png',
    headline: 'Fresh Cakes & Bouquets, Delivered Across Vadodara',
    subheadline: 'Custom designs, same-day delivery, premium quality 100% eggless bakes.',
    primaryCta: { text: 'Explore Cakes', href: '#featured-categories' },
    secondaryCta: { text: 'View Bouquets', href: '#featured-categories' },
    tag: 'Vadodara Exclusive'
  },
  {
    id: 2,
    image: '/images/luxury-bouquet.png',
    headline: 'Handcrafted Floral Bouquets For Every Celebration',
    subheadline: 'Farm-fresh roses, lilies and orchids hand-tied by master florists.',
    primaryCta: { text: 'Order Bouquets', href: '#featured-categories' },
    secondaryCta: { text: 'Combos & Gifts', href: '#featured-categories' },
    tag: 'Same Day 3-Hour Delivery'
  },
  {
    id: 3,
    image: '/images/hero_couple_banner.png',
    headline: 'Midnight Surprises That Make Memories Sweeter',
    subheadline: 'Book midnight delivery (11:30 PM - 12:30 AM) to all Vadodara locations.',
    primaryCta: { text: 'Explore Celebrations', href: '#featured-categories' },
    secondaryCta: { text: 'Check Your Pincode', href: '#delivery-map' },
    tag: 'Midnight Special'
  }
];

const FEATURED_CAKES: ProductCard[] = [
  {
    id: 'c-1',
    name: 'Royal Belgian Chocolate Truffle',
    category: 'cake',
    price: 649,
    originalPrice: 799,
    rating: 4.9,
    reviewsCount: 142,
    image: '/images/black-forest-cake.png',
    badge: 'Bestseller',
    description: 'Velvety dark chocolate ganache with moist sponge and edible gold leafing.',
    flavors: ['Dark Chocolate', 'Dutch Truffle', 'Choco Hazelnut'],
    weights: ['500g', '1kg', '1.5kg', '2kg']
  },
  {
    id: 'c-2',
    name: 'Strawberry Velvet Berry Bliss',
    category: 'cake',
    price: 699,
    originalPrice: 849,
    rating: 4.8,
    reviewsCount: 98,
    image: '/images/strawberry-cake.png',
    badge: 'Trending',
    description: 'Fresh strawberries blended into whipped cream and soft vanilla sponge.',
    flavors: ['Fresh Strawberry', 'Mixed Berry', 'White Chocolate Berry'],
    weights: ['500g', '1kg', '1.5kg']
  },
  {
    id: 'c-3',
    name: 'Classic Red Velvet Cream Cheese',
    category: 'cake',
    price: 749,
    originalPrice: 899,
    rating: 5.0,
    reviewsCount: 185,
    image: '/images/red-velvet-cake.png',
    badge: 'Chef Special',
    description: 'Authentic crimson red velvet crumb paired with Philadelphia cream cheese frosting.',
    flavors: ['Traditional Cream Cheese', 'Choco Red Velvet'],
    weights: ['500g', '1kg', '2kg']
  },
  {
    id: 'c-4',
    name: 'Crunchy Golden Butterscotch',
    category: 'cake',
    price: 549,
    originalPrice: 649,
    rating: 4.7,
    reviewsCount: 76,
    image: '/images/butterscotch-cake.png',
    badge: 'Popular',
    description: 'Caramelized praline crunch layered between golden butterscotch sponge and butter glaze.',
    flavors: ['Butterscotch Nougat', 'Caramel Crunch'],
    weights: ['500g', '1kg', '2kg']
  }
];

const FEATURED_BOUQUETS: ProductCard[] = [
  {
    id: 'b-1',
    name: 'Royal Scarlet Red Rose Ensemble',
    category: 'bouquet',
    price: 799,
    originalPrice: 999,
    rating: 4.9,
    reviewsCount: 120,
    image: '/images/luxury-bouquet.png',
    badge: 'Most Loved',
    description: '24 hand-picked Dutch Red Roses hand-tied in premium matte blush paper.',
    flavors: ['24 Roses', '36 Roses Luxury', '50 Roses Grand']
  },
  {
    id: 'b-2',
    name: 'Pastel Sunshine Birthday Posy',
    category: 'bouquet',
    price: 899,
    originalPrice: 1099,
    rating: 4.8,
    reviewsCount: 64,
    image: '/images/birthday-bouquet.png',
    badge: 'Fresh Today',
    description: 'Yellow carnations, white lilies, and eucalyptus foliage tied with satin mint ribbon.',
    flavors: ['Standard Arrangement', 'Deluxe Vase Included']
  },
  {
    id: 'b-3',
    name: 'Enchanted Orchid & Lily Radiance',
    category: 'bouquet',
    price: 1199,
    originalPrice: 1449,
    rating: 5.0,
    reviewsCount: 52,
    image: '/images/combo-gift.png',
    badge: 'Premium',
    description: 'Purple Thai orchids paired with fragrant Asiatic white lilies in luxury wrapping.',
    flavors: ['Exotic 12 Stems', 'Grand 20 Stems']
  },
  {
    id: 'b-4',
    name: 'Blush Pink Carnation Symphony',
    category: 'bouquet',
    price: 649,
    originalPrice: 799,
    rating: 4.7,
    reviewsCount: 88,
    image: '/images/hero-flowers.png',
    badge: 'Delicate',
    description: 'Sweet pink carnations with baby breath accents, perfect for heartfelt moments.',
    flavors: ['Standard 15 Stems', 'Luxury 25 Stems']
  }
];

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: 'Ananya Desai',
    occasion: 'Sister’s 25th Birthday',
    locality: 'Alkapuri, Vadodara',
    rating: 5,
    quote: 'Ordered the Belgian Truffle cake at 11 AM and it was at my doorstep by 2:30 PM! The texture was heavenly, perfectly eggless and not overly sweet. The presentation was 10/10.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 2,
    name: 'Rajiv Patel',
    occasion: '10th Wedding Anniversary',
    locality: 'Vasna Road, Vadodara',
    rating: 5,
    quote: 'The midnight delivery option is so reliable! Exactly at 12:00 AM the delivery partner handed over the Red Rose Bouquet and Red Velvet cake. My wife was thrilled.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 3,
    name: 'Dr. Meera Shah',
    occasion: 'Clinic Anniversary Celebration',
    locality: 'Sayajigunj, Vadodara',
    rating: 5,
    quote: 'CakeConnection has become our go-to bakery in Vadodara. Customized our logo message accurately and flowers were so fresh they lasted a whole week in our vase.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  }
];

const BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    title: 'Trending Cake Designs for 2025: From Bento to Vintage Lambeth',
    readTime: '4 min read',
    category: 'Design Trends',
    image: '/images/categories/designer-cakes.png',
    excerpt: 'Explore the minimal aesthetics, pastel buttercreams, and edible floral art dominating birthday celebrations this year.'
  },
  {
    id: 2,
    title: 'How to Keep Fresh Flowers Hydrated & Vibrant Longer in Vadodara Weather',
    readTime: '3 min read',
    category: 'Floral Care',
    image: '/images/categories/flower-bouquets.png',
    excerpt: 'Simple florist-approved techniques to trim stems, balance water temperature, and maintain bouquet longevity at home.'
  },
  {
    id: 3,
    title: 'The Ultimate Vadodara Festive Gifting Guide: Same-Day Surprise Hacks',
    readTime: '5 min read',
    category: 'Gifting Guide',
    image: '/images/categories/gift-combos.png',
    excerpt: 'How to coordinate timing, select the ideal cake flavor for large families, and choose bouquet combinations with ease.'
  }
];

const VADODARA_LOCALITIES = [
  { name: 'Alkapuri', pincode: '390007', status: 'Fast 2-Hour Delivery' },
  { name: 'Akota', pincode: '390020', status: 'Same Day Available' },
  { name: 'Gotri', pincode: '390021', status: 'Same Day Available' },
  { name: 'Vasna Road', pincode: '390015', status: 'Fast 2-Hour Delivery' },
  { name: 'Manjalpur', pincode: '390011', status: 'Same Day Available' },
  { name: 'Karelibaug', pincode: '390018', status: 'Same Day Available' },
  { name: 'Fatehgunj', pincode: '390002', status: 'Same Day Available' },
  { name: 'Gorwa', pincode: '390016', status: 'Same Day Available' },
  { name: 'Sayajigunj', pincode: '390005', status: 'Fast 2-Hour Delivery' },
  { name: 'Harni Road', pincode: '390022', status: 'Same Day Available' }
];

export default function Homepage2() {
  // --- Cart Store Hook ---
  const { addItem, getItemCount, setCartOpen } = useCartStore();
  const cartCount = getItemCount();

  // --- States ---
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedPincode, setSelectedPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState<string | null>(null);
  const [activeCategoryTab, setActiveCategoryTab] = useState<'cakes' | 'bouquets'>('cakes');

  // Quick order modal state
  const [quickOrderStep, setQuickOrderStep] = useState<number | null>(null);
  const [customizingProduct, setCustomizingProduct] = useState<ProductCard | null>(null);
  const [selectedWeight, setSelectedWeight] = useState('500g');
  const [cakeMessage, setCakeMessage] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('Standard (5:00 PM - 9:00 PM)');
  const [addedNotice, setAddedNotice] = useState(false);

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  // Mobile menu toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // --- Auto-play Hero Carousel (5s) ---
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // --- Scroll Detection for Sticky Bar & Header ---
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- Pincode Checker ---
  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPincode) return;

    const matched = VADODARA_LOCALITIES.find(
      (l) => l.pincode === selectedPincode.trim() || l.name.toLowerCase().includes(selectedPincode.toLowerCase())
    );

    if (matched) {
      setPincodeStatus(`✅ Hurray! We deliver to ${matched.name} (${matched.pincode}) with ${matched.status}.`);
    } else if (selectedPincode.startsWith('390') || selectedPincode.startsWith('391')) {
      setPincodeStatus(`✅ Vadodara Serviceable Area! Same-Day delivery supported for PIN ${selectedPincode}.`);
    } else {
      setPincodeStatus(`⚠️ We currently deliver exclusively within Vadodara (390xxx / 391xxx). Contact us on WhatsApp for special courier requests.`);
    }
  };

  // --- Quick Add To Cart Handler ---
  const handleAddToCart = (product: ProductCard) => {
    addItem({
      productId: product.id,
      variantId: `${product.id}-${selectedWeight}`,
      name: product.name,
      image: product.image,
      price: product.price,
      weight: selectedWeight,
      quantity: 1,
      customMessage: cakeMessage
    });

    setAddedNotice(true);
    setTimeout(() => {
      setAddedNotice(false);
      setCustomizingProduct(null);
      setQuickOrderStep(null);
    }, 1200);
  };

  // --- Newsletter Submit ---
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSuccess(true);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSuccess(false), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#2E2E2E] font-sans selection:bg-[#F7C8D0] selection:text-[#2E2E2E]">

      {/* ========================================================= */}
      {/* 1. HEADER (Fixed Thin Bar)                                */}
      {/* ========================================================= */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-stone-200/70 py-2.5'
            : 'bg-white/80 backdrop-blur-sm border-b border-stone-100 py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/homepage2" className="flex items-center gap-2 group">
            <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#2E2E2E] group-hover:text-[#D81B60] transition-colors">
              Cake<span className="text-[#D81B60] font-sans font-medium text-lg">.Connection</span>
            </span>
          </Link>

          {/* Centered Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center space-x-8 text-sm font-medium text-[#2E2E2E]">
            <Link href="/homepage2" className="text-[#D81B60] transition-colors">Home</Link>
            <Link href="/cakes" className="hover:text-[#D81B60] transition-colors">Cakes</Link>
            <Link href="/flowers" className="hover:text-[#D81B60] transition-colors">Bouquets</Link>
            <Link href="/about" className="hover:text-[#D81B60] transition-colors">About</Link>
            <Link href="#delivery-map" className="hover:text-[#D81B60] transition-colors">Delivery</Link>
            <Link href="#blog-section" className="hover:text-[#D81B60] transition-colors">Blog</Link>
            <Link href="/faq" className="hover:text-[#D81B60] transition-colors">Contact</Link>
          </nav>

          {/* Right-Hand Controls */}
          <div className="flex items-center space-x-3 sm:space-x-5">
            {/* Vadodara Preset Selector */}
            <div className="hidden sm:flex items-center gap-1.5 bg-[#C8F7D9]/30 text-[#1f5b3a] px-3 py-1 rounded-full text-xs font-semibold border border-[#C8F7D9]">
              <MapPin className="w-3.5 h-3.5 text-[#1f5b3a]" />
              <span>Vadodara</span>
            </div>

            {/* Search Icon */}
            <button
              onClick={() => {
                const el = document.getElementById('featured-categories');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="p-2 text-[#2E2E2E] hover:text-[#D81B60] hover:bg-[#F7C8D0]/20 rounded-full transition-colors"
              title="Search products"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* User Profile */}
            <Link
              href="/auth/login"
              className="p-2 text-[#2E2E2E] hover:text-[#D81B60] hover:bg-[#F7C8D0]/20 rounded-full transition-colors hidden sm:block"
              title="My Account / Admin"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Cart Icon with Dynamic Count */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 text-[#2E2E2E] hover:text-[#D81B60] hover:bg-[#F7C8D0]/20 rounded-full transition-colors"
              title="View Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#D81B60] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#2E2E2E] hover:text-[#D81B60] rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-b border-stone-200 px-6 py-4 space-y-3"
            >
              <div className="flex items-center gap-2 bg-[#C8F7D9]/40 text-[#1f5b3a] px-3 py-1.5 rounded-lg text-xs font-semibold mb-2">
                <MapPin className="w-4 h-4" />
                <span>Delivery: Vadodara City (All Pincodes)</span>
              </div>
              <Link href="/homepage2" onClick={() => setMobileMenuOpen(false)} className="block text-[#D81B60] font-medium py-1">Home</Link>
              <Link href="/cakes" onClick={() => setMobileMenuOpen(false)} className="block text-[#2E2E2E] hover:text-[#D81B60] py-1">Fresh Cakes</Link>
              <Link href="/flowers" onClick={() => setMobileMenuOpen(false)} className="block text-[#2E2E2E] hover:text-[#D81B60] py-1">Flower Bouquets</Link>
              <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="block text-[#2E2E2E] hover:text-[#D81B60] py-1">About Us</Link>
              <Link href="#delivery-map" onClick={() => setMobileMenuOpen(false)} className="block text-[#2E2E2E] hover:text-[#D81B60] py-1">Vadodara Delivery</Link>
              <Link href="#blog-section" onClick={() => setMobileMenuOpen(false)} className="block text-[#2E2E2E] hover:text-[#D81B60] py-1">Inspiration Blog</Link>
              <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)} className="block text-[#2E2E2E] hover:text-[#D81B60] py-1">Admin / Login</Link>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ========================================================= */}
      {/* 2. HERO BANNER (Full-Width Sliding Carousel)               */}
      {/* ========================================================= */}
      <section className="relative pt-18 sm:pt-20 overflow-hidden bg-stone-900 text-white min-h-[580px] sm:min-h-[660px] flex items-center">
        {/* Slides */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0 z-0"
          >
            {/* Background Image with Semi-Dark Tint */}
            <div className="relative w-full h-full">
              <Image
                src={HERO_SLIDES[currentSlide].image}
                alt={HERO_SLIDES[currentSlide].headline}
                fill
                priority
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/35" />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Hero Content Overlay */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <motion.div
            key={`content-${currentSlide}`}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl space-y-6"
          >
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 bg-[#F7C8D0]/20 text-[#F7C8D0] backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase border border-[#F7C8D0]/40">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{HERO_SLIDES[currentSlide].tag}</span>
            </div>

            {/* Headline (Serif Font) */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-white drop-shadow-sm">
              {HERO_SLIDES[currentSlide].headline}
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-xl text-stone-200 font-light max-w-xl leading-relaxed">
              {HERO_SLIDES[currentSlide].subheadline}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              {/* Primary CTA (Blush Pink Fill) */}
              <a
                href={HERO_SLIDES[currentSlide].primaryCta.href}
                className="bg-[#F7C8D0] hover:bg-[#F2B3BE] text-[#2E2E2E] font-semibold px-7 py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-pink-950/20 hover:scale-[1.03] inline-flex items-center gap-2"
              >
                <span>{HERO_SLIDES[currentSlide].primaryCta.text}</span>
                <ArrowRight className="w-4 h-4 text-[#2E2E2E]" />
              </a>

              {/* Secondary CTA (Transparent with Blush border) */}
              <a
                href={HERO_SLIDES[currentSlide].secondaryCta.href}
                className="bg-white/10 hover:bg-white/20 text-white font-medium px-6 py-3.5 rounded-xl border border-[#F7C8D0]/60 transition-all duration-300 backdrop-blur-sm hover:scale-[1.03]"
              >
                {HERO_SLIDES[currentSlide].secondaryCta.text}
              </a>
            </div>
          </motion.div>
        </div>

        {/* Carousel Manual Controls */}
        <div className="absolute bottom-8 right-8 z-20 hidden sm:flex items-center space-x-3">
          <button
            onClick={() => setCurrentSlide((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1))}
            className="w-11 h-11 rounded-full bg-black/40 hover:bg-[#F7C8D0] hover:text-[#2E2E2E] text-white backdrop-blur-md flex items-center justify-center transition-colors border border-white/20"
            title="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
            className="w-11 h-11 rounded-full bg-black/40 hover:bg-[#F7C8D0] hover:text-[#2E2E2E] text-white backdrop-blur-md flex items-center justify-center transition-colors border border-white/20"
            title="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Slide Indicator Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 transition-all rounded-full ${
                currentSlide === idx ? 'w-8 bg-[#F7C8D0]' : 'w-2 bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. QUICK-ORDER BAR (Sticky on Scroll)                     */}
      {/* ========================================================= */}
      <section className="sticky top-[60px] sm:top-[68px] z-40 bg-white/95 backdrop-blur-md border-y border-stone-200 shadow-sm py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
          
          <div className="flex items-center space-x-2 sm:space-x-6 text-xs sm:text-sm font-medium whitespace-nowrap">
            <span className="text-[#D81B60] font-bold uppercase tracking-wider text-[11px] hidden md:inline">
              Quick Order:
            </span>

            {/* Step 1 */}
            <button
              onClick={() => setQuickOrderStep(1)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAFAFA] hover:bg-[#F7C8D0]/30 transition-colors border border-stone-200"
            >
              <div className="w-5 h-5 rounded-full bg-[#F7C8D0] text-[#2E2E2E] text-[10px] font-bold flex items-center justify-center">1</div>
              <span>Select Product</span>
            </button>

            <span className="text-stone-300">→</span>

            {/* Step 2 */}
            <button
              onClick={() => setQuickOrderStep(2)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAFAFA] hover:bg-[#F7C8D0]/30 transition-colors border border-stone-200"
            >
              <div className="w-5 h-5 rounded-full bg-[#C8F7D9] text-[#1f5b3a] text-[10px] font-bold flex items-center justify-center">2</div>
              <span>Choose Size / Flowers</span>
            </button>

            <span className="text-stone-300">→</span>

            {/* Step 3 */}
            <button
              onClick={() => setQuickOrderStep(3)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAFAFA] hover:bg-[#F7C8D0]/30 transition-colors border border-stone-200"
            >
              <div className="w-5 h-5 rounded-full bg-[#F7C8D0] text-[#2E2E2E] text-[10px] font-bold flex items-center justify-center">3</div>
              <span>Delivery Slot</span>
            </button>

            <span className="text-stone-300">→</span>

            {/* Step 4 */}
            <Link
              href="/checkout"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#D81B60] text-white hover:bg-[#AD1457] transition-all font-semibold shadow-sm"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Checkout</span>
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-xs text-stone-500 font-medium">
            <Clock className="w-3.5 h-3.5 text-[#D81B60]" />
            <span>Today's Cutoff: Order by 2:00 PM for Same-Day</span>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. FEATURED CATEGORIES (2-Column Grid: Cakes & Bouquets)  */}
      {/* ========================================================= */}
      <section id="featured-categories" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D81B60] bg-[#F7C8D0]/30 px-3 py-1 rounded-full">
            Artisanal Selection
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2E2E2E]">
            Handcrafted With Care in Vadodara
          </h2>
          <p className="text-stone-600 text-sm sm:text-base">
            Every creation is prepared fresh to order using pure ingredients, delivered right on time.
          </p>

          {/* Toggle Switch */}
          <div className="inline-flex p-1 bg-stone-200/60 rounded-xl mt-4">
            <button
              onClick={() => setActiveCategoryTab('cakes')}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeCategoryTab === 'cakes'
                  ? 'bg-white text-[#2E2E2E] shadow-sm'
                  : 'text-stone-600 hover:text-[#2E2E2E]'
              }`}
            >
              🎂 Signature Cakes
            </button>
            <button
              onClick={() => setActiveCategoryTab('bouquets')}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeCategoryTab === 'bouquets'
                  ? 'bg-white text-[#2E2E2E] shadow-sm'
                  : 'text-stone-600 hover:text-[#2E2E2E]'
              }`}
            >
              💐 Fresh Bouquets
            </button>
          </div>
        </div>

        {/* 2-Column Grid Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          
          {/* LEFT COLUMN: CAKES */}
          <div className={`space-y-6 ${activeCategoryTab === 'bouquets' ? 'hidden md:block opacity-60' : ''}`}>
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <h3 className="font-serif text-2xl font-bold text-[#2E2E2E] flex items-center gap-2">
                <span>100% Eggless Cakes</span>
                <span className="text-xs font-sans font-normal text-stone-500">(Fresh Baked)</span>
              </h3>
              <Link href="/cakes" className="text-xs font-semibold text-[#D81B60] hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {FEATURED_CAKES.map((cake) => (
                <div
                  key={cake.id}
                  className="group bg-white rounded-2xl p-4 border border-stone-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Image Box */}
                    <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-stone-50 mb-3.5">
                      <Image
                        src={cake.image}
                        alt={cake.name}
                        fill
                        className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                      />
                      {cake.badge && (
                        <span className="absolute top-2.5 left-2.5 bg-[#F7C8D0] text-[#2E2E2E] text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                          {cake.badge}
                        </span>
                      )}
                      <div className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-full flex items-center gap-1 text-xs font-semibold text-stone-700 shadow-xs">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        <span>{cake.rating}</span>
                      </div>
                    </div>

                    {/* Title & Desc */}
                    <h4 className="font-serif font-bold text-lg text-[#2E2E2E] group-hover:text-[#D81B60] transition-colors line-clamp-1">
                      {cake.name}
                    </h4>
                    <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                      {cake.description}
                    </p>
                  </div>

                  {/* Price & Action */}
                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-stone-400">Starting at</span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-lg font-bold text-[#2E2E2E]">{formatPrice(cake.price)}</span>
                        <span className="text-xs text-stone-400 line-through">{formatPrice(cake.originalPrice)}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setCustomizingProduct(cake);
                        setQuickOrderStep(2);
                      }}
                      className="bg-[#F7C8D0] hover:bg-[#D81B60] hover:text-white text-[#2E2E2E] text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-xs active:scale-95"
                    >
                      Customize
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: BOUQUETS */}
          <div className={`space-y-6 ${activeCategoryTab === 'cakes' ? 'hidden md:block opacity-60' : ''}`}>
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <h3 className="font-serif text-2xl font-bold text-[#2E2E2E] flex items-center gap-2">
                <span>Hand-Tied Bouquets</span>
                <span className="text-xs font-sans font-normal text-stone-500">(Fresh Floral)</span>
              </h3>
              <Link href="/flowers" className="text-xs font-semibold text-[#D81B60] hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {FEATURED_BOUQUETS.map((bouquet) => (
                <div
                  key={bouquet.id}
                  className="group bg-white rounded-2xl p-4 border border-stone-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Image Box */}
                    <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-stone-50 mb-3.5">
                      <Image
                        src={bouquet.image}
                        alt={bouquet.name}
                        fill
                        className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                      />
                      {bouquet.badge && (
                        <span className="absolute top-2.5 left-2.5 bg-[#C8F7D9] text-[#1f5b3a] text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                          {bouquet.badge}
                        </span>
                      )}
                      <div className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-full flex items-center gap-1 text-xs font-semibold text-stone-700 shadow-xs">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        <span>{bouquet.rating}</span>
                      </div>
                    </div>

                    {/* Title & Desc */}
                    <h4 className="font-serif font-bold text-lg text-[#2E2E2E] group-hover:text-[#D81B60] transition-colors line-clamp-1">
                      {bouquet.name}
                    </h4>
                    <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                      {bouquet.description}
                    </p>
                  </div>

                  {/* Price & Action */}
                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-stone-400">Starting at</span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-lg font-bold text-[#2E2E2E]">{formatPrice(bouquet.price)}</span>
                        <span className="text-xs text-stone-400 line-through">{formatPrice(bouquet.originalPrice)}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setCustomizingProduct(bouquet);
                        setQuickOrderStep(2);
                      }}
                      className="bg-[#C8F7D9] hover:bg-[#22C55E] hover:text-white text-[#1f5b3a] text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-xs active:scale-95"
                    >
                      Customize
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. WHY CHOOSE US (Three-Icon Row)                          */}
      {/* ========================================================= */}
      <section className="py-16 bg-[#F8F9FA] border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-white border border-stone-200/70 shadow-xs flex flex-col items-center space-y-3 hover:scale-102 transition-transform">
              <div className="w-14 h-14 rounded-2xl bg-[#F7C8D0]/40 flex items-center justify-center text-[#D81B60]">
                <Clock className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#2E2E2E]">Same-Day Delivery</h3>
              <p className="text-sm text-stone-600 max-w-xs leading-relaxed">
                Order by 2:00 PM and receive fresh bakes and hand-tied bouquets today across Vadodara.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-white border border-stone-200/70 shadow-xs flex flex-col items-center space-y-3 hover:scale-102 transition-transform">
              <div className="w-14 h-14 rounded-2xl bg-[#C8F7D9]/40 flex items-center justify-center text-[#1f5b3a]">
                <Wheat className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#2E2E2E]">Premium Ingredients</h3>
              <p className="text-sm text-stone-600 max-w-xs leading-relaxed">
                100% vegetarian, locally sourced pure dairy, Belgian couverture, and zero artificial preservatives.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-white border border-stone-200/70 shadow-xs flex flex-col items-center space-y-3 hover:scale-102 transition-transform">
              <div className="w-14 h-14 rounded-2xl bg-[#F7C8D0]/40 flex items-center justify-center text-[#D81B60]">
                <Palette className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#2E2E2E]">Personalized Design</h3>
              <p className="text-sm text-stone-600 max-w-xs leading-relaxed">
                Tell us your theme, flavor preference, and custom message — our pastry chefs bring it to life.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. CUSTOMER TESTIMONIALS CAROUSEL                          */}
      {/* ========================================================= */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D81B60] bg-[#F7C8D0]/30 px-3 py-1 rounded-full">
            Real Vadodara Stories
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2E2E2E]">
            Celebrations Made Sweeter
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-2xl p-7 border border-stone-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div className="space-y-4">
                {/* Rating Stars */}
                <div className="flex text-amber-500 gap-1">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-sm text-stone-700 italic leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              {/* User Avatar & Name */}
              <div className="flex items-center gap-3.5 mt-6 pt-5 border-t border-stone-100">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#F7C8D0]"
                />
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#2E2E2E]">{t.name}</h4>
                  <p className="text-xs text-[#D81B60] font-medium">{t.occasion}</p>
                  <p className="text-[11px] text-stone-400">{t.locality}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 7. LATEST BLOG / INSPIRATION (Three-Column Layout)         */}
      {/* ========================================================= */}
      <section id="blog-section" className="py-16 sm:py-24 bg-[#F8F9FA] border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#1f5b3a] bg-[#C8F7D9]/40 px-3 py-1 rounded-full">
                Bakery & Flower Chronicles
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2E2E2E]">
                Ideas, Inspiration & Care Guides
              </h2>
            </div>
            <Link href="#blog-section" className="text-sm font-semibold text-[#D81B60] hover:underline flex items-center gap-1.5">
              <span>View All Articles</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {BLOG_POSTS.map((post) => (
              <article
                key={post.id}
                className="group bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col"
              >
                {/* Thumbnail */}
                <div className="relative aspect-16/10 w-full overflow-hidden bg-stone-100">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-white/95 text-[11px] font-semibold text-stone-700 px-2.5 py-0.5 rounded-full shadow-xs">
                    {post.readTime}
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-[#D81B60] uppercase tracking-wider">
                      {post.category}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-[#2E2E2E] group-hover:text-[#D81B60] transition-colors leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>

                  <span className="text-xs font-bold text-[#D81B60] inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read More <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 8. DELIVERY COVERAGE MAP & PINCODE CHECKER                 */}
      {/* ========================================================= */}
      <section id="delivery-map" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          
          <div className="space-y-5">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1f5b3a] bg-[#C8F7D9]/40 px-3 py-1 rounded-full">
              Vadodara City Wide
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2E2E2E]">
              We Deliver Across Every Corner of Vadodara
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              From Alkapuri and Akota to Manjalpur, Karelibaug, Gorwa, and Waghodia Road — our temperature-controlled delivery vans ensure your cakes arrive intact and flowers bloom fresh.
            </p>

            {/* Pincode Search Form */}
            <form onSubmit={handlePincodeCheck} className="space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row gap-2.5 max-w-md">
                <div className="relative flex-1">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    value={selectedPincode}
                    onChange={(e) => setSelectedPincode(e.target.value)}
                    placeholder="Enter Pincode (e.g. 390007) or Area"
                    className="w-full pl-10 pr-4 py-3 bg-[#FAFAFA] border border-stone-300 rounded-xl text-sm text-[#2E2E2E] focus:outline-none focus:border-[#D81B60] transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#F7C8D0] hover:bg-[#D81B60] hover:text-white text-[#2E2E2E] font-semibold px-6 py-3 rounded-xl text-sm transition-all shadow-xs"
                >
                  Check Pincode
                </button>
              </div>

              {pincodeStatus && (
                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-medium text-stone-800 animate-fadeIn">
                  {pincodeStatus}
                </div>
              )}
            </form>
          </div>

          {/* Interactive Zone Badges */}
          <div className="bg-[#FAFAFA] rounded-2xl p-6 sm:p-8 border border-stone-200 space-y-4">
            <h4 className="font-serif font-bold text-lg text-[#2E2E2E] flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#D81B60]" />
              <span>Serviceable Hubs & Daily Slots</span>
            </h4>

            <div className="grid grid-cols-2 gap-2.5 text-xs">
              {VADODARA_LOCALITIES.map((loc, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-stone-200/70">
                  <span className="font-medium text-stone-800">{loc.name}</span>
                  <span className="text-[11px] text-[#1f5b3a] font-semibold bg-[#C8F7D9]/50 px-2 py-0.5 rounded">
                    {loc.pincode}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-stone-500 border-t border-stone-200">
              <span>Standard: Free on orders ₹999+</span>
              <span className="text-[#D81B60] font-semibold">Midnight: 11:30 PM - 12:30 AM</span>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 9. NEWSLETTER SIGNUP (Full-Width Pastel Strip)             */}
      {/* ========================================================= */}
      <section className="py-16 bg-[#F7C8D0]/30 border-y border-[#F7C8D0]/60">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-5">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D81B60]">
            Exclusive Perks & Festival Alerts
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2E2E2E]">
            Stay Sweet — Get 15% Off Your First Order
          </h2>
          <p className="text-stone-600 text-sm sm:text-base max-w-xl mx-auto">
            Subscribe for seasonal cake flavor announcements, fresh flower alerts, and exclusive Vadodara discount codes.
          </p>

          <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2 pt-2">
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="flex-1 px-4 py-3 bg-white border border-stone-300 rounded-xl text-sm text-[#2E2E2E] focus:outline-none focus:border-[#D81B60]"
            />
            <button
              type="submit"
              className="bg-[#D81B60] hover:bg-[#AD1457] text-white font-semibold px-7 py-3 rounded-xl text-sm transition-all shadow-sm"
            >
              Subscribe
            </button>
          </form>

          {newsletterSuccess ? (
            <p className="text-xs font-semibold text-emerald-700 animate-fadeIn">
              ✅ Welcome to the CakeConnection family! Check your inbox for your 15% voucher.
            </p>
          ) : (
            <p className="text-xs text-stone-500">
              We respect your privacy. Zero spam, unsubscribe anytime.
            </p>
          )}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 10. FOOTER (Four-Column Layout)                            */}
      {/* ========================================================= */}
      <footer className="bg-white text-[#2E2E2E] border-t border-stone-200 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-stone-200">
            
            {/* Col 1: Brand & Socials */}
            <div className="space-y-4">
              <span className="font-serif text-2xl font-bold text-[#2E2E2E]">
                Cake<span className="text-[#D81B60]">.Connection</span>
              </span>
              <p className="text-xs text-stone-600 leading-relaxed">
                Vadodara&apos;s premier online boutique for pure eggless designer cakes, floral arrangements, and memorable celebrations.
              </p>
              <div className="flex items-center space-x-3 text-stone-600 pt-1">
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center hover:bg-[#F7C8D0] hover:text-[#D81B60] transition-colors">
                  <FaInstagram className="w-4 h-4" />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center hover:bg-[#F7C8D0] hover:text-[#D81B60] transition-colors">
                  <FaFacebookF className="w-4 h-4" />
                </a>
                <a href="https://wa.me/919999999999" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center hover:bg-[#C8F7D9] hover:text-[#1f5b3a] transition-colors">
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Col 2: Quick Links */}
            <div className="space-y-3 text-xs">
              <h4 className="font-serif font-bold text-sm text-[#2E2E2E] uppercase tracking-wider">Quick Shop</h4>
              <ul className="space-y-2 text-stone-600">
                <li><Link href="/cakes" className="hover:text-[#D81B60] transition-colors">All Cakes (Eggless)</Link></li>
                <li><Link href="/flowers" className="hover:text-[#D81B60] transition-colors">Hand-Tied Bouquets</Link></li>
                <li><Link href="/combos" className="hover:text-[#D81B60] transition-colors">Cake & Flower Combos</Link></li>
                <li><Link href="/birthday-cake-vadodara" className="hover:text-[#D81B60] transition-colors">Birthday Cakes Vadodara</Link></li>
                <li><Link href="/same-day-cake-delivery-vadodara" className="hover:text-[#D81B60] transition-colors">Same-Day Deliveries</Link></li>
              </ul>
            </div>

            {/* Col 3: Information & Policies */}
            <div className="space-y-3 text-xs">
              <h4 className="font-serif font-bold text-sm text-[#2E2E2E] uppercase tracking-wider">Information</h4>
              <ul className="space-y-2 text-stone-600">
                <li><Link href="/about" className="hover:text-[#D81B60] transition-colors">About Our Bakery</Link></li>
                <li><Link href="/faq" className="hover:text-[#D81B60] transition-colors">Delivery FAQ & Timings</Link></li>
                <li><Link href="/orders" className="hover:text-[#D81B60] transition-colors">Track Your Order</Link></li>
                <li><Link href="/auth/login" className="hover:text-[#D81B60] transition-colors">Admin Dashboard</Link></li>
                <li><a href="#" className="hover:text-[#D81B60] transition-colors">Privacy & Refund Policy</a></li>
              </ul>
            </div>

            {/* Col 4: Vadodara HQ Contact */}
            <div className="space-y-3 text-xs">
              <h4 className="font-serif font-bold text-sm text-[#2E2E2E] uppercase tracking-wider">Vadodara HQ</h4>
              <ul className="space-y-2 text-stone-600">
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#D81B60] shrink-0 mt-0.5" />
                  <span>Alkapuri Main Road, Opp. Inox, Vadodara, Gujarat 390007</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#D81B60] shrink-0" />
                  <span>+91 98765 43210 / WhatsApp Support</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#D81B60] shrink-0" />
                  <span>Order.CakeConnection@gmail.com</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
            <p>© 2026 CakeConnection.in — All Rights Reserved. Vadodara, Gujarat.</p>
            
            <div className="flex items-center space-x-4">
              <span className="flex items-center gap-1"><Lock className="w-3.5 h-3.5 text-emerald-600" /> 256-Bit SSL Encrypted</span>
              <span>•</span>
              <span>Razorpay Verified</span>
              <span>•</span>
              <span>UPI / Cards / Netbanking</span>
            </div>
          </div>

        </div>
      </footer>

      {/* ========================================================= */}
      {/* CUSTOMIZE & QUICK-ORDER MODAL                             */}
      {/* ========================================================= */}
      <AnimatePresence>
        {(customizingProduct || quickOrderStep !== null) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-stone-200 relative max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  setCustomizingProduct(null);
                  setQuickOrderStep(null);
                }}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Product Header */}
              {customizingProduct ? (
                <div className="space-y-6">
                  <div className="flex gap-4 items-center">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-stone-50 border border-stone-200 shrink-0">
                      <Image
                        src={customizingProduct.image}
                        alt={customizingProduct.name}
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-lg text-[#2E2E2E]">
                        {customizingProduct.name}
                      </h3>
                      <p className="text-xs text-stone-500">{customizingProduct.description}</p>
                      <p className="text-base font-bold text-[#D81B60] mt-1">
                        {formatPrice(customizingProduct.price)}
                      </p>
                    </div>
                  </div>

                  {/* Weight Selector (If Cake) */}
                  {customizingProduct.category === 'cake' && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-stone-600">Select Weight</label>
                      <div className="grid grid-cols-4 gap-2">
                        {['500g', '1kg', '1.5kg', '2kg'].map((w) => (
                          <button
                            key={w}
                            type="button"
                            onClick={() => setSelectedWeight(w)}
                            className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                              selectedWeight === w
                                ? 'bg-[#F7C8D0] text-[#2E2E2E] border-[#D81B60]'
                                : 'bg-[#FAFAFA] border-stone-200 text-stone-700 hover:bg-stone-100'
                            }`}
                          >
                            {w}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Message on Cake */}
                  {customizingProduct.category === 'cake' && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-stone-600">
                        Add Message on Cake (Optional)
                      </label>
                      <input
                        type="text"
                        value={cakeMessage}
                        onChange={(e) => setCakeMessage(e.target.value)}
                        placeholder="e.g. Happy Birthday Riya!"
                        maxLength={35}
                        className="w-full px-4 py-2.5 bg-[#FAFAFA] border border-stone-300 rounded-xl text-sm focus:outline-none focus:border-[#D81B60]"
                      />
                    </div>
                  )}

                  {/* Delivery Slot Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-600">Delivery Slot</label>
                    <select
                      value={selectedSlot}
                      onChange={(e) => setSelectedSlot(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#FAFAFA] border border-stone-300 rounded-xl text-sm focus:outline-none focus:border-[#D81B60]"
                    >
                      <option>Morning (9:00 AM - 1:00 PM)</option>
                      <option>Standard (5:00 PM - 9:00 PM)</option>
                      <option>Express 3-Hour Delivery (+₹49)</option>
                      <option>Midnight Surprise (11:30 PM - 12:30 AM) (+₹149)</option>
                    </select>
                  </div>

                  {/* Action */}
                  <button
                    onClick={() => handleAddToCart(customizingProduct)}
                    className="w-full bg-[#D81B60] hover:bg-[#AD1457] text-white font-semibold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    {addedNotice ? (
                      <>
                        <Check className="w-5 h-5 text-emerald-300" />
                        <span>Added to Cart!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-5 h-5" />
                        <span>Add To Cart ({formatPrice(customizingProduct.price)})</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                /* Quick Order Guide Step */
                <div className="space-y-4 text-center py-4">
                  <div className="w-16 h-16 rounded-full bg-[#F7C8D0]/40 text-[#D81B60] flex items-center justify-center mx-auto">
                    <Gift className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-[#2E2E2E]">Quick Order Vadodara</h3>
                  <p className="text-sm text-stone-600 max-w-sm mx-auto">
                    Select any cake or bouquet from the catalog below to choose your custom weight, personalized message, and delivery time slot!
                  </p>
                  <button
                    onClick={() => {
                      setQuickOrderStep(null);
                      const el = document.getElementById('featured-categories');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="bg-[#D81B60] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#AD1457] transition-all"
                  >
                    Browse Catalog Now
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
