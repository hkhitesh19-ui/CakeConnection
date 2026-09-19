'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Container } from '@/components/ui';

const SLIDES = [
  {
    image: '/images/banners/banner_express_3d.jpg',
    title: 'SuperFast 60-90 Min Delivery',
    subtitle: 'CakeConnection Express Vadodara',
    description: 'Hot out of the oven! Artisan cakes & fresh flowers delivered across Vadodara in 60-90 mins.',
    cta: 'Order Express Now',
    link: '/cakes',
    isGraphicBanner: true,
  },
  {
    image: '/images/banners/banner_midnight_3d.jpg',
    title: 'Guaranteed 12:00 AM Surprise',
    subtitle: 'Midnight Cake & Gift Delivery',
    description: 'Surprise them right as the clock strikes 12! Free sparklers & personalized greeting card.',
    cta: 'Book Midnight Slot',
    link: '/combos',
    isGraphicBanner: true,
  },
  {
    image: '/images/banners/banner_cakes.png',
    title: 'Premium Cakes',
    subtitle: 'Handcrafted With Love',
    description: 'Freshly baked eggless cakes delivered to your doorstep in Vadodara',
    cta: 'Shop Cakes',
    link: '/cakes',
  },
  {
    image: '/images/banners/banner_flowers.png',
    title: 'Fresh Flower Bouquets',
    subtitle: 'Express Your Emotions',
    description: 'Hand-arranged bouquets of roses, lilies & orchids for every occasion',
    cta: 'Shop Flowers',
    link: '/flowers',
  },
  {
    image: '/images/banners/banner_combos.png',
    title: 'Gift Combos',
    subtitle: 'The Perfect Combination',
    description: 'Cake + Flowers + Teddy — make every celebration unforgettable',
    cta: 'Shop Combos',
    link: '/combos',
  },
  {
    image: '/images/banners/banner_delivery.png',
    title: 'Same Day Delivery',
    subtitle: 'Lightning Fast Service',
    description: 'Order before 5 PM — get it delivered today in Vadodara!',
    cta: 'Order Now',
    link: '/cakes',
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Autoplay function
  const startTimer = () => {
    stopTimer();
    if (SLIDES.length <= 1) return;
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    if (mounted && !isHovering) {
      startTimer();
    } else {
      stopTimer();
    }
    return () => stopTimer();
  }, [mounted, isHovering, currentSlide]);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  return (
    <section className="bg-white py-0 relative overflow-hidden w-full">
      <div
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden bg-gray-900 group"
      >
        {/* Render static first slide for SSR / Initial render */}
        {!mounted ? (
          <div className="absolute inset-0 w-full h-full">
            <img
              src={SLIDES[0].image}
              alt={SLIDES[0].title}
              className="w-full h-full object-cover object-center"
            />
            {SLIDES[0].isGraphicBanner ? (
              <Link href={SLIDES[0].link} className="absolute inset-0 z-20 block w-full h-full cursor-pointer">
                <div className="absolute bottom-4 right-4 md:bottom-8 md:right-12 z-20 hidden sm:flex items-center gap-2 bg-brand-rose hover:bg-brand-rose-dark text-white px-5 py-2 md:px-7 md:py-3 rounded-full font-bold text-xs md:text-sm shadow-2xl transition-all hover:scale-105">
                  <span>{SLIDES[0].cta}</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </Link>
            ) : (
              <>
                {/* Desktop Gradient Overlay (Right aligned) */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/50 to-black/70 md:from-transparent md:via-black/20 md:to-black/75 z-10" />
                <div className="absolute inset-0 z-20 flex items-center">
                  <Container className="w-full flex justify-end">
                    <div className="w-full md:w-1/2 text-right md:text-right px-6 md:px-12 flex flex-col items-end gap-3 md:gap-4">
                      <span className="text-rose-300 text-sm md:text-xl font-serif tracking-wider font-semibold">
                        {SLIDES[0].subtitle}
                      </span>
                      <h1 className="text-2xl md:text-5xl font-display font-bold text-white drop-shadow-md leading-tight">
                        {SLIDES[0].title}
                      </h1>
                      <p className="text-xs md:text-base text-white/80 max-w-md">
                        {SLIDES[0].description}
                      </p>
                      <Link
                        href={SLIDES[0].link}
                        className="mt-2 px-6 py-2 md:px-8 md:py-3 bg-brand-rose hover:bg-brand-rose-dark text-white rounded-full font-semibold text-xs md:text-sm shadow-lg hover:shadow-xl transition-all hover:scale-105"
                      >
                        {SLIDES[0].cta}
                      </Link>
                    </div>
                  </Container>
                </div>
              </>
            )}
          </div>
        ) : (
          <>
            {/* Animated Slides */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
                className="absolute inset-0 w-full h-full"
              >
                <img
                  src={SLIDES[currentSlide].image}
                  alt={SLIDES[currentSlide].title}
                  className="w-full h-full object-cover object-center"
                />
                
                {SLIDES[currentSlide].isGraphicBanner ? (
                  <Link href={SLIDES[currentSlide].link} className="absolute inset-0 z-20 block w-full h-full cursor-pointer">
                    <div className="absolute bottom-4 right-4 md:bottom-8 md:right-12 z-20 hidden sm:flex items-center gap-2 bg-brand-rose hover:bg-brand-rose-dark text-white px-5 py-2 md:px-7 md:py-3 rounded-full font-bold text-xs md:text-sm shadow-2xl transition-all hover:scale-105">
                      <span>{SLIDES[currentSlide].cta}</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </Link>
                ) : (
                  <>
                    {/* Responsive Gradient Overlay - Darker on mobile for readability, right-aligned on desktop */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/40 to-black/75 md:from-transparent md:via-black/20 md:to-black/75 z-10" />
                    
                    <div className="absolute inset-0 z-20 flex items-center">
                      <Container className="w-full flex justify-end">
                        <div className="w-full md:w-1/2 text-right px-6 md:px-12 flex flex-col items-end gap-2 md:gap-4">
                          <span className="text-rose-300 text-sm md:text-xl font-serif tracking-wider font-semibold">
                            {SLIDES[currentSlide].subtitle}
                          </span>
                          <h2 className="text-2xl md:text-5xl font-display font-bold text-white drop-shadow-md leading-tight">
                            {SLIDES[currentSlide].title}
                          </h2>
                          <p className="text-xs md:text-base text-white/80 max-w-md">
                            {SLIDES[currentSlide].description}
                          </p>
                          <Link
                            href={SLIDES[currentSlide].link}
                            className="mt-1 md:mt-2 px-6 py-2 md:px-8 md:py-3 bg-brand-rose hover:bg-brand-rose-dark text-white rounded-full font-semibold text-xs md:text-sm shadow-lg hover:shadow-xl transition-all hover:scale-105"
                          >
                            {SLIDES[currentSlide].cta}
                          </Link>
                        </div>
                      </Container>
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Slider Controls */}
            {SLIDES.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-30 flex h-8 w-8 md:h-12 md:w-12 items-center justify-center rounded-full bg-white/80 hover:bg-white text-gray-800 shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-30 flex h-8 w-8 md:h-12 md:w-12 items-center justify-center rounded-full bg-white/80 hover:bg-white text-gray-800 shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
                  aria-label="Next slide"
                >
                  <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
                </button>
              </>
            )}

            {/* Dots Indicator */}
            {SLIDES.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-1.5 md:gap-2">
                {SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentSlide(idx);
                    }}
                    className={`h-1.5 md:h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      currentSlide === idx ? 'w-5 md:w-8 bg-brand-rose' : 'w-1.5 md:w-2 bg-white/60 hover:bg-white'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}


