'use client';
// ============================================
// FooterCTA Component — Cake Connection
// Final call-to-action with dual buttons,
// WhatsApp quick order, and animated entrance
// ============================================

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Cake, Flower2, MessageCircle, Sparkles } from 'lucide-react';
import { Container } from '@/components/ui';
import { whatsappConfig } from '@/config/site.config';

export function FooterCTA() {
  return (
    <section className="relative py-12 sm:py-14 lg:py-36 overflow-hidden bg-surface-primary">
      {/* Radial gradient glows */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-rose/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-brand-rose-gold/5 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[250px] h-[250px] bg-brand-red/5 rounded-full blur-[80px] pointer-events-none" />
      </div>

      {/* Rose gold decorative lines */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-rose/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-rose/20 to-transparent" />

      {/* Floating decorative elements */}
      <motion.div
        className="absolute top-16 left-[10%] w-2 h-2 rounded-full bg-brand-rose/30"
        animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-24 right-[15%] w-3 h-3 rounded-full bg-brand-rose-gold/25"
        animate={{ y: [0, -15, 0], opacity: [0.25, 0.5, 0.25] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />
      <motion.div
        className="absolute bottom-20 left-[20%] w-2.5 h-2.5 rounded-full bg-brand-rose-light/25"
        animate={{ y: [0, -18, 0], opacity: [0.2, 0.45, 0.2] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />
      <motion.div
        className="absolute bottom-32 right-[12%] w-1.5 h-1.5 rounded-full bg-brand-rose/35"
        animate={{ y: [0, -12, 0], opacity: [0.35, 0.6, 0.35] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      />

      <Container size="md" className="relative z-10">
        <div className="flex flex-col items-center text-center">
          {/* Sparkle icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ type: 'spring', stiffness: 200, damping: 12 }}
            className="mb-6"
          >
            <Sparkles className="w-8 h-8 text-brand-rose" />
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-text-primary tracking-tight mb-5"
          >
            Ready to Make Someone{' '}
            <span className="text-gradient-rose">Smile?</span>
          </motion.h2>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-text-secondary text-lg sm:text-xl max-w-xl mb-10 font-light"
          >
            Order your perfect cake or bouquet today
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex flex-col sm:flex-row items-center gap-4 mb-8"
          >
            <Link
              href="/cakes"
              className="inline-flex items-center gap-2.5 px-8 py-4 bg-brand-rose text-white font-semibold rounded-lg text-base shadow-lg hover:shadow-brand-rose/30 hover:bg-brand-rose-dark transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] w-full sm:w-auto justify-center"
            >
              <Cake className="w-5 h-5" />
              Explore Cakes
            </Link>
            <Link
              href="/flowers"
              className="inline-flex items-center gap-2.5 px-8 py-4 border-2 border-brand-rose text-brand-rose font-semibold rounded-lg text-base hover:bg-brand-rose hover:text-white transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] w-full sm:w-auto justify-center"
            >
              <Flower2 className="w-5 h-5" />
              Send Flowers
            </Link>
          </motion.div>

          {/* WhatsApp quick order */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <a
              href={whatsappConfig.getOrderUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-text-muted hover:text-green-400 transition-colors duration-300 text-sm group"
            >
              <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
              <span>
                Or quick order via{' '}
                <span className="underline underline-offset-4 decoration-text-muted/30 group-hover:decoration-green-400/50">
                  WhatsApp
                </span>
              </span>
            </a>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}


