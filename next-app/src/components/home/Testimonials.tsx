'use client';
// ============================================
// Testimonials Component — Cake Connection
// Auto-rotating customer review carousel with
// glassmorphism cards and crossfade animation
// ============================================

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { Container } from '@/components/ui';
import { useSiteStore } from '@/stores/siteStore';

interface Testimonial {
  id: number;
  name: string;
  initial: string;
  occasion: string;
  rating: number;
  review: string;
  color: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Priya Sharma',
    initial: 'P',
    occasion: 'Birthday Celebration',
    rating: 5,
    review:
      'I ordered a red velvet cake for my daughter\'s birthday at the last minute, and Cake Connection delivered it within 3 hours! The cake was absolutely stunning — moist, rich, and beautifully decorated. My daughter\'s face lit up the moment she saw it. Thank you for making her day so special!',
    color: 'bg-brand-rose',
  },
  {
    id: 2,
    name: 'Rahul Mehta',
    initial: 'R',
    occasion: 'Anniversary Surprise',
    rating: 5,
    review:
      'Surprised my wife with a cake and flower combo for our anniversary. The roses were fresh and vibrant, and the chocolate truffle cake tasted like it was from a five-star bakery. She was moved to tears! The midnight delivery option was the cherry on top. Truly premium quality.',
    color: 'bg-brand-red',
  },
  {
    id: 3,
    name: 'Ananya Patel',
    initial: 'A',
    occasion: 'Wedding Gift',
    rating: 5,
    review:
      'Sent a luxury bouquet and cake hamper as a wedding gift to my best friend in Vadodara. She sent me photos — the arrangement was gorgeous! The packaging was elegant and the cake was fresh despite the delivery distance. Cake Connection is now my go-to for every celebration.',
    color: 'bg-brand-rose-gold',
  },
  {
    id: 4,
    name: 'Vikram Singh',
    initial: 'V',
    occasion: 'Corporate Event',
    rating: 5,
    review:
      'We ordered 5 custom cakes for our office annual day celebration. Every cake was delivered on time, looked exactly as we discussed, and tasted incredible. The team loved the butterscotch and black forest flavours. Professional service from start to finish — highly recommended for bulk orders!',
    color: 'bg-brand-rose-dark',
  },
  {
    id: 5,
    name: 'Neha Joshi',
    initial: 'N',
    occasion: 'Mother\'s Day',
    rating: 5,
    review:
      'I live in Mumbai but wanted to send something special to my mom in Vadodara for Mother\'s Day. The strawberry cake and lily bouquet arrived perfectly. My mom called me crying happy tears. The quality, freshness, and care in the presentation — everything was beyond expectations. Will order again!',
    color: 'bg-brand-rose-light',
  },
];

const AUTOPLAY_INTERVAL = 5000;

export function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { testimonials: storeTestimonials } = useSiteStore();

  const colors = ['bg-brand-rose', 'bg-brand-red', 'bg-brand-rose-gold', 'bg-brand-rose-dark', 'bg-brand-rose-light'];

  // Normalize testimonials from store or use hardcoded fallback
  const list = useMemo(() => {
    if (storeTestimonials && storeTestimonials.length > 0) {
      return storeTestimonials.map((t, idx) => ({
        id: idx + 1,
        name: t.name,
        initial: t.name ? t.name.charAt(0).toUpperCase() : 'C',
        occasion: t.tag || 'Celebration',
        rating: t.rating || 5,
        review: t.text,
        color: colors[idx % colors.length],
      }));
    }
    // Fallback
    return testimonials;
  }, [storeTestimonials]);

  const goToNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % list.length);
  }, [list.length]);

  const goToIndex = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  // Auto-rotate
  useEffect(() => {
    if (isPaused || list.length <= 1) return;

    const timer = setInterval(goToNext, AUTOPLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [isPaused, goToNext, list.length]);

  if (list.length === 0) return null;

  const current = list[activeIndex];

  return (
    <section className="relative py-10 sm:py-12 lg:py-16 bg-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-rose/5 rounded-full blur-3xl pointer-events-none" />

      <Container size="lg">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-14 sm:mb-16"
        >
          <p className="text-brand-rose font-medium text-sm tracking-widest uppercase mb-3">
            Testimonials
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary">
            What Our Customers Say
          </h2>
        </motion.div>

        {/* Testimonial Card */}
        <div
          className="relative max-w-3xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.97 }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="glass rounded-2xl p-8 sm:p-10 lg:p-12 relative"
            >
              {/* Quote icon */}
              <div className="absolute top-6 right-6 sm:top-8 sm:right-8">
                <Quote className="w-10 h-10 sm:w-12 sm:h-12 text-brand-rose/20 fill-brand-rose/10" />
              </div>

              {/* Star rating */}
              <div className="flex gap-1 mb-6" aria-label={`${current.rating} out of 5 stars`}>
                {Array.from({ length: current.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-brand-rose-gold fill-brand-rose-gold"
                  />
                ))}
              </div>

              {/* Review text */}
              <blockquote className="text-text-secondary text-base sm:text-lg leading-relaxed mb-8 font-light">
                &ldquo;{current.review}&rdquo;
              </blockquote>

              {/* Customer info */}
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div
                  className={`w-12 h-12 rounded-full ${current.color} flex items-center justify-center text-text-primary font-display font-bold text-lg shrink-0`}
                >
                  {current.initial}
                </div>
                <div>
                  <p className="font-semibold text-text-primary text-base">
                    {current.name}
                  </p>
                  <p className="text-text-muted text-sm">{current.occasion}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots navigation */}
          <div className="flex items-center justify-center gap-2.5 mt-8" role="tablist">
            {list.map((_, index) => (
              <button
                key={index}
                role="tab"
                aria-selected={index === activeIndex}
                aria-label={`Go to testimonial ${index + 1}`}
                onClick={() => goToIndex(index)}
                className="group relative p-1 cursor-pointer"
              >
                <motion.div
                  className="rounded-full"
                  animate={{
                    width: index === activeIndex ? 28 : 10,
                    height: 10,
                    backgroundColor:
                      index === activeIndex
                        ? 'var(--color-brand-rose)'
                        : 'var(--color-surface-tertiary)',
                  }}
                  transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                />
              </button>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

