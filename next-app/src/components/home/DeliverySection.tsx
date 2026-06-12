'use client';
// ============================================
// DeliverySection — Cake Connection (Winni.in Redesign)
// Shop by Occasion and Recipient navigation grids
// ============================================

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Gift, Heart, Sparkles, Smile, Target, Users, Gem, Star } from 'lucide-react';
import { Container } from '@/components/ui';

interface NavCard {
  title: string;
  description: string;
  Icon: any;
  href: string;
  color: string;
  bgGlow: string;
}

const occasions: NavCard[] = [
  {
    title: 'Birthday Special',
    description: 'Celebrate another beautiful year with sweet surprises',
    Icon: Gift,
    href: '/cakes?search=birthday',
    color: 'text-amber-500',
    bgGlow: 'bg-amber-500/10',
  },
  {
    title: 'Anniversary Special',
    description: 'Make love grow with premium flowers and cakes',
    Icon: Heart,
    href: '/cakes?search=anniversary',
    color: 'text-red-500',
    bgGlow: 'bg-red-500/10',
  },
  {
    title: 'Love & Romance',
    description: 'Fresh red roses to express your deepest emotions',
    Icon: Sparkles,
    href: '/flowers?search=love',
    color: 'text-pink-500',
    bgGlow: 'bg-pink-500/10',
  },
  {
    title: 'Congratulations',
    description: 'Perfect hampers to celebrate their success',
    Icon: Smile,
    href: '/combos?search=congratulations',
    color: 'text-emerald-500',
    bgGlow: 'bg-emerald-500/10',
  },
];

const recipients: NavCard[] = [
  {
    title: 'For Her',
    description: 'Beautiful bouquets and sweet treats she will love',
    Icon: Gem,
    href: '/flowers?search=her',
    color: 'text-rose-500',
    bgGlow: 'bg-rose-500/10',
  },
  {
    title: 'For Him',
    description: 'Premium cakes and gift hampers crafted for him',
    Icon: Target,
    href: '/cakes?search=him',
    color: 'text-blue-500',
    bgGlow: 'bg-blue-500/10',
  },
  {
    title: 'For Mother',
    description: 'Delivering warmth and gratitude to the best mom',
    Icon: Users,
    href: '/cakes?search=mother',
    color: 'text-purple-500',
    bgGlow: 'bg-purple-500/10',
  },
  {
    title: 'For Father',
    description: 'Show your appreciation to the pillar of strength',
    Icon: Star,
    href: '/cakes?search=father',
    color: 'text-indigo-500',
    bgGlow: 'bg-indigo-500/10',
  },
];

const headingVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.08,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  }),
};

export default function DeliverySection() {
  return (
    <section className="py-16 bg-surface-primary relative overflow-hidden">
      {/* Decorative blurred backgrounds */}
      <div className="absolute top-1/3 left-0 w-80 h-80 rounded-full bg-brand-rose/[0.02] blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-brand-rose-gold/[0.02] blur-3xl pointer-events-none" />

      <Container>
        {/* Section Heading */}
        <motion.div
          variants={headingVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="text-center mb-16"
        >
          <p className="text-brand-rose text-sm font-semibold tracking-widest uppercase mb-3">
            Gifting Made Easy
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary">
            Choose The Perfect Gift
          </h2>
          <div className="mx-auto mt-4 h-[2.5px] w-24 rounded-full bg-brand-rose" />
        </motion.div>

        {/* Dual Grids */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Shop by Occasion */}
          <div>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-text-primary mb-6 flex items-center gap-2 border-b border-border-secondary pb-3">
              <Gift className="w-6 h-6 text-brand-rose" />
              Shop by Occasion
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {occasions.map((opt, i) => (
                <motion.div
                  key={opt.title}
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <Link
                    href={opt.href}
                    className="block p-5 rounded-2xl border border-border-secondary bg-white hover:border-brand-rose/40 hover:shadow-md transition-all duration-300 group"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${opt.bgGlow} ${opt.color}`}>
                        <opt.Icon className="w-5.5 h-5.5" />
                      </div>
                      <div>
                        <h4 className="font-sans text-sm font-bold text-text-primary group-hover:text-brand-rose transition-colors duration-300">
                          {opt.title}
                        </h4>
                        <p className="mt-1 text-xs text-text-secondary leading-relaxed">
                          {opt.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Shop by Recipient */}
          <div>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-text-primary mb-6 flex items-center gap-2 border-b border-border-secondary pb-3">
              <Users className="w-6 h-6 text-brand-rose" />
              Shop by Recipient
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recipients.map((opt, i) => (
                <motion.div
                  key={opt.title}
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <Link
                    href={opt.href}
                    className="block p-5 rounded-2xl border border-border-secondary bg-white hover:border-brand-rose/40 hover:shadow-md transition-all duration-300 group"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${opt.bgGlow} ${opt.color}`}>
                        <opt.Icon className="w-5.5 h-5.5" />
                      </div>
                      <div>
                        <h4 className="font-sans text-sm font-bold text-text-primary group-hover:text-brand-rose transition-colors duration-300">
                          {opt.title}
                        </h4>
                        <p className="mt-1 text-xs text-text-secondary leading-relaxed">
                          {opt.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}


