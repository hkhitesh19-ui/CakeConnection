'use client';
// ============================================
// Instagram Reel Style Gallery — Cake Connection
// ============================================

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaInstagram } from 'react-icons/fa6';
import { Heart, MessageCircle } from 'lucide-react';
import { Container } from '@/components/ui';
import { useSiteStore } from '@/stores/siteStore';

const galleryItems = [
  {
    image: '/images/hero-cake.png',
    likes: '2.4K',
    comments: '186',
    caption: 'Chocolate dreams delivered ✨',
  },
  {
    image: '/images/hero-flowers.png',
    likes: '3.1K',
    comments: '245',
    caption: 'Fresh roses, fresh love 🌹',
  },
  {
    image: '/images/red-velvet-cake.png',
    likes: '1.8K',
    comments: '142',
    caption: 'Red Velvet perfection 🎂',
  },
  {
    image: '/images/luxury-bouquet.png',
    likes: '2.7K',
    comments: '203',
    caption: 'Luxury blooms for her 💐',
  },
  {
    image: '/images/combo-gift.png',
    likes: '4.2K',
    comments: '389',
    caption: 'The ultimate surprise combo 🎁',
  },
  {
    image: '/images/black-forest-cake.png',
    likes: '1.5K',
    comments: '118',
    caption: 'Black Forest forever 🍫',
  },
];

export function InstagramGallery() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const { generalSettings } = useSiteStore();
  const instagramUrl = generalSettings.socials?.instagram || 'https://www.instagram.com/cakeconnection';
  const handle = instagramUrl.split('/').filter(Boolean).pop() || 'cakeconnection';

  return (
    <section ref={sectionRef} className="py-10 lg:py-14 bg-surface-primary">
      <Container>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <FaInstagram className="text-brand-rose" size={28} />
            <span className="text-brand-rose font-medium text-lg">@{handle}</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary">
            Follow Our <span className="text-gradient-rose">Sweet Journey</span>
          </h2>
          <p className="mt-3 text-text-secondary max-w-lg mx-auto">
            Join thousands of happy customers sharing their Cake Connection moments
          </p>
        </motion.div>

        {/* Gallery Grid — Instagram Reel Style */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {galleryItems.map((item, i) => (
            <motion.a
              key={i}
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.08 * i }}
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer"
            >
              {/* Image */}
              <img
                src={item.image}
                alt={item.caption}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />

              {/* Dark overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-500 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-center">
                  <div className="flex items-center justify-center gap-4 mb-2">
                    <span className="flex items-center gap-1.5 text-text-primary text-sm font-semibold">
                      <Heart size={18} className="fill-white" />
                      {item.likes}
                    </span>
                    <span className="flex items-center gap-1.5 text-text-primary text-sm font-semibold">
                      <MessageCircle size={18} className="fill-white" />
                      {item.comments}
                    </span>
                  </div>
                  <p className="text-text-primary/80 text-xs px-2">{item.caption}</p>
                </div>
              </div>

              {/* Instagram icon corner */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <FaInstagram className="text-text-primary" size={20} />
              </div>
            </motion.a>
          ))}
        </div>

        {/* Follow CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-10"
        >
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-text-primary font-semibold rounded-xl hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300 hover:scale-105"
          >
            <FaInstagram size={20} />
            Follow @{handle}
          </a>
        </motion.div>
      </Container>
    </section>
  );
}

