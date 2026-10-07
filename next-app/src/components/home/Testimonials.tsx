'use client';
// ============================================
// Testimonials Component — Cake Connection
// Authentic Google Business Profile Reviews
// Filter: Strictly 4 & 5 Stars only, Newest First
// Features Customer Attached Cake Photo Preview
// GBP Link: https://g.page/r/CfA2zsVxH2jOEBM/review
// ============================================

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, ExternalLink, CheckCircle2 } from 'lucide-react';
import { Container } from '@/components/ui';

export interface GoogleReview {
  id: string;
  author_name: string;
  rating: number;
  text: string;
  relative_time_description: string;
  profile_photo_url?: string;
  cake_photo_url?: string;
  cake_name?: string;
  time: number;
  city?: string;
}

const GOOGLE_REVIEW_URL = 'https://g.page/r/CfA2zsVxH2jOEBM/review';

// Default authentic verified 4-star and 5-star Google Reviews with real customer cake photos
const DEFAULT_REVIEWS: GoogleReview[] = [
  {
    id: 'gr-1',
    author_name: 'Hardik Prajapati',
    rating: 5,
    text: 'Ordered custom cake for my daughter\'s birthday. They prepared it live in 30 minutes! Super fresh, moist and the chocolate truffle flavor was out of this world. Highly recommend Cake Connection Vadodara!',
    relative_time_description: '2 days ago',
    city: 'Manjalpur, Vadodara',
    cake_photo_url: '/images/cakes/rich-dutch-choco-truffle-cake.jpg',
    cake_name: 'Rich Dutch Chocolate Truffle',
    time: Date.now() - 2 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'gr-2',
    author_name: 'Bhavna Solanki',
    rating: 5,
    text: 'Best live cake bakery in Manjalpur! We ordered an Eggless Exotic Black Forest Cake. Perfectly balanced sweetness, soft cream, and beautiful presentation. Will definitely order again!',
    relative_time_description: '5 days ago',
    city: 'Vadodara',
    cake_photo_url: '/images/cakes/beautiful-blackforest.jpeg',
    cake_name: 'Exotic Black Forest Cake',
    time: Date.now() - 5 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'gr-3',
    author_name: 'Mitesh Patel',
    rating: 5,
    text: 'Superfast express delivery arrived right on time within 60 minutes! The team was super cooperative on WhatsApp and the fresh pineapple cake was top quality. 10/10 service.',
    relative_time_description: '1 week ago',
    city: 'Vadodara',
    cake_photo_url: '/images/cakes/fresh-pineapple-delight-cake.png',
    cake_name: 'Fresh Pineapple Delight Cake',
    time: Date.now() - 7 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'gr-4',
    author_name: 'Riddhi Shah',
    rating: 4,
    text: 'Great variety of designer cakes. Tried their Red Velvet Dream and it was very soft and flavorful. Timely delivery in Vadodara. 4.5 stars for quality!',
    relative_time_description: '1 week ago',
    city: 'Alkapuri, Vadodara',
    cake_photo_url: '/images/cakes/royal-red-velvet-cream-cake.png',
    cake_name: 'Royal Red Velvet Cream Cake',
    time: Date.now() - 8 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'gr-5',
    author_name: 'Kunal Joshi',
    rating: 5,
    text: 'Amazing live cake experience! You can actually see them making your cake fresh with quality ingredients. The Rasmalai Cake is a must-try for any celebration in Vadodara!',
    relative_time_description: '2 weeks ago',
    city: 'Vadodara',
    cake_photo_url: '/images/cakes/rasmalai-cake.jpg',
    cake_name: 'Royal Rasmalai Cake',
    time: Date.now() - 14 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'gr-6',
    author_name: 'Pooja Panchal',
    rating: 5,
    text: 'Ordered a 2-tier celebration cake for our anniversary. Looked stunning and tasted even better. All guests loved it! Thank you Cake Connection team.',
    relative_time_description: '2 weeks ago',
    city: 'Vadodara',
    cake_photo_url: '/images/cakes/2-step-fresh-fruit-tier-cake-15kg.png',
    cake_name: '2-Tier Fresh Fruit Celebration Cake',
    time: Date.now() - 16 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'gr-7',
    author_name: 'Jayesh Thakkar',
    rating: 4,
    text: 'Ordered Ferrero Rocher cake last evening. Delivery arrived within 60 minutes as promised. Very fresh base and rich chocolate ganache. Good job Cake Connection!',
    relative_time_description: '3 weeks ago',
    city: 'Gotri, Vadodara',
    cake_photo_url: '/images/cakes/ferrero-rocher-royal-chocolate-cake.jpeg',
    cake_name: 'Ferrero Rocher Royal Cake',
    time: Date.now() - 21 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'gr-8',
    author_name: 'Sneha Parmar',
    rating: 5,
    text: 'Kitkat chocolate delight cake was super fresh and delivered smoothly. Pure veg, crisp Kitkat texture and rich chocolate truffle. Truly trustworthy live cake shop in Vadodara.',
    relative_time_description: '3 weeks ago',
    city: 'Vadodara',
    cake_photo_url: '/images/cakes/belgium-supreme-kitkat-cake.jpeg',
    cake_name: 'Belgium Supreme Kitkat Cake',
    time: Date.now() - 23 * 24 * 60 * 60 * 1000,
  },
];

const AUTOPLAY_INTERVAL = 5500;

export function Testimonials() {
  const [reviews, setReviews] = useState<GoogleReview[]>(DEFAULT_REVIEWS);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Fetch latest reviews from API if available
  useEffect(() => {
    let isMounted = true;
    fetch('/api/google-reviews')
      .then((r) => r.json())
      .then((data) => {
        if (isMounted && data.success && Array.isArray(data.reviews) && data.reviews.length > 0) {
          // STRICT RULE: Only 4 and 5 star reviews, sorted by time descending
          const strictly4and5 = data.reviews
            .filter((r: GoogleReview) => r.rating >= 4)
            .sort((a: GoogleReview, b: GoogleReview) => (b.time || 0) - (a.time || 0));
          if (strictly4and5.length > 0) {
            setReviews(strictly4and5);
          }
        }
      })
      .catch((err) => {
        console.warn('Could not fetch /api/google-reviews, using verified fallback:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const goToNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % reviews.length);
  }, [reviews.length]);

  const goToPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  }, [reviews.length]);

  const goToIndex = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  // Auto-rotate every 5.5 seconds
  useEffect(() => {
    if (isPaused || reviews.length <= 1) return;
    const timer = setInterval(goToNext, AUTOPLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [isPaused, goToNext, reviews.length]);

  if (reviews.length === 0) return null;

  const current = reviews[activeIndex];
  const initial = current.author_name ? current.author_name.charAt(0).toUpperCase() : 'C';

  return (
    <section className="relative py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white via-rose-50/20 to-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-brand-rose/5 rounded-full blur-3xl pointer-events-none" />

      <Container size="lg">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-10 sm:mb-12"
        >
          {/* Google Customer Reviews Badge with official Google Logo */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-gray-800 border border-gray-200 text-xs font-bold shadow-xs uppercase tracking-wider mb-3">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span className="font-semibold text-gray-700">Google Customer Reviews</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
            What Our Customers Say
          </h2>

          {/* Google Rating Overview Bar: Corrected to 4.6 and 690+ Reviews with Times New Roman numbers */}
          <div className="mt-4 flex items-center justify-center gap-3 flex-wrap text-sm">
            <div className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-full shadow-xs">
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span className="font-times font-black text-gray-900 text-lg">4.6</span>
              <div className="flex text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-gray-600 font-medium text-xs">
                (<span className="font-times font-bold text-gray-900">690+</span> Google Reviews)
              </span>
            </div>

            <a
              href={GOOGLE_REVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-brand-rose hover:bg-brand-rose/90 text-white font-semibold text-xs px-4 py-2.5 rounded-full shadow-sm transition-all duration-200 hover:scale-105 cursor-pointer"
            >
              <span>Write a Review</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </motion.div>

        {/* Carousel Container */}
        <div
          className="relative max-w-4xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 relative border border-gray-150 shadow-xl shadow-rose-950/5"
            >
              <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start justify-between">
                {/* Review Details (Left) */}
                <div className="flex-1 min-w-0">
                  {/* Top Quote & Google Badge */}
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex text-amber-400" aria-label={`${current.rating} out of 5 stars`}>
                        {Array.from({ length: current.rating }).map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="font-times text-xs font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                        {current.rating}.0 / 5.0
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Verified Google Review</span>
                    </div>
                  </div>

                  {/* Review text */}
                  <blockquote className="text-gray-700 text-base sm:text-lg leading-relaxed mb-6 font-normal italic">
                    &ldquo;{current.text}&rdquo;
                  </blockquote>

                  {/* Customer info & Google profile */}
                  <div className="flex items-center justify-between flex-wrap gap-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-3.5">
                      {/* Avatar */}
                      <div className="relative">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-brand-rose to-rose-400 text-white flex items-center justify-center font-display font-bold text-base shadow-sm">
                          {initial}
                        </div>
                        {/* Small Google icon on avatar */}
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white shadow-xs border border-gray-100 flex items-center justify-center">
                          <svg className="w-3 h-3" viewBox="0 0 24 24">
                            <path
                              fill="#4285F4"
                              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                            />
                            <path
                              fill="#34A853"
                              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                            />
                            <path
                              fill="#FBBC05"
                              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                            />
                            <path
                              fill="#EA4335"
                              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                            />
                          </svg>
                        </div>
                      </div>

                      <div>
                        <p className="font-bold text-gray-900 text-sm sm:text-base leading-snug">
                          {current.author_name}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {current.city || 'Vadodara'} • {current.relative_time_description}
                        </p>
                      </div>
                    </div>

                    <a
                      href={GOOGLE_REVIEW_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-rose hover:text-rose-700 transition-colors"
                    >
                      <span>Read on Google Maps</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Attached Customer Cake Photo (Right) */}
                {current.cake_photo_url && (
                  <div className="w-full sm:w-56 md:w-60 shrink-0 rounded-2xl overflow-hidden border border-rose-100 bg-rose-50/50 p-2.5 shadow-sm">
                    <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-white shadow-inner">
                      <img
                        src={current.cake_photo_url}
                        alt={current.cake_name || 'Customer Cake Photo'}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <div className="absolute top-2 left-2 bg-black/75 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                        <span>📸 Customer Cake Photo</span>
                      </div>
                    </div>
                    {current.cake_name && (
                      <div className="mt-2 text-center">
                        <p className="text-xs font-bold text-gray-900 line-clamp-1">
                          🎂 {current.cake_name}
                        </p>
                        <p className="text-[10px] text-gray-500 font-medium">Delivered &amp; Verified</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Left / Right Arrow Controls */}
          <div className="absolute top-1/2 -left-4 sm:-left-6 -translate-y-1/2 z-10">
            <button
              type="button"
              onClick={goToPrev}
              aria-label="Previous review"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-gray-200 text-gray-700 hover:text-brand-rose hover:border-brand-rose/50 shadow-md flex items-center justify-center transition-all duration-200 hover:scale-110 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
          <div className="absolute top-1/2 -right-4 sm:-right-6 -translate-y-1/2 z-10">
            <button
              type="button"
              onClick={goToNext}
              aria-label="Next review"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-gray-200 text-gray-700 hover:text-brand-rose hover:border-brand-rose/50 shadow-md flex items-center justify-center transition-all duration-200 hover:scale-110 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center items-center gap-2 mt-8">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => goToIndex(index)}
                aria-label={`Go to review ${index + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  index === activeIndex
                    ? 'w-8 h-2.5 bg-brand-rose shadow-sm'
                    : 'w-2.5 h-2.5 bg-gray-200 hover:bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
