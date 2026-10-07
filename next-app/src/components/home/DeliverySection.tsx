'use client';
// ============================================
// DeliverySection — Cake Connection (Winni.in Redesign)
// Shop by Occasion and Recipient navigation grids
// ============================================

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Gift, Heart, Sparkles, Smile, Target, Users, Gem, Star } from 'lucide-react';
import { Container } from '@/components/ui';

interface NavCard {
  title: string;
  description: string;
  image: string;
  href: string;
}

const occasions: NavCard[] = [
  {
    title: 'Birthday Special',
    description: 'Celebrate another beautiful year with sweet surprises',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80',
    href: '/birthday-cake-vadodara',
  },
  {
    title: 'Anniversary Special',
    description: 'Make love grow with premium flowers and cakes',
    image: 'https://images.unsplash.com/photo-1535141192574-5d4897c13636?auto=format&fit=crop&w=600&q=80',
    href: '/anniversary-cake-vadodara',
  },
  {
    title: 'Love & Romance',
    description: 'Fresh red roses to express your deepest emotions',
    image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=600&q=80',
    href: '/flowers/vadodara',
  },
  {
    title: 'Gift Combos',
    description: 'Perfect hampers to celebrate their success',
    image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=600&q=80',
    href: '/combos',
  },
];

const recipients: NavCard[] = [
  {
    title: 'For Her',
    description: 'Beautiful bouquets and sweet treats she will love',
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=600&q=80',
    href: '/flowers/vadodara',
  },
  {
    title: 'For Him',
    description: 'Premium cakes and gift hampers crafted for him',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80',
    href: '/chocolate-cake-vadodara',
  },
  {
    title: 'Custom Photo Cakes',
    description: 'Turn your cherished memories into edible delicious art',
    image: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=600&q=80',
    href: '/photo-cake-vadodara',
  },
  {
    title: 'Same Day Celebrations',
    description: 'Freshly baked cakes delivered within hours across Vadodara',
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=600&q=80',
    href: '/same-day-cake-delivery-vadodara',
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
                    className="block relative overflow-hidden rounded-xl h-40 w-full group hover:shadow-lg transition-all duration-300"
                  >
                    <Image
                      src={opt.image}
                      alt={opt.title}
                      layout="fill"
                      objectFit="cover"
                      className="hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/10 z-10" />
                    
                    <div className="absolute inset-0 p-4 flex flex-col justify-end z-20 text-white font-bold">
                      <h4 className="font-sans text-sm font-bold text-white transition-colors duration-300">
                        {opt.title}
                      </h4>
                      <p className="mt-1 text-xs text-white/90 leading-relaxed font-bold">
                        {opt.description}
                      </p>
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
                    className="block relative overflow-hidden rounded-xl h-40 w-full group hover:shadow-lg transition-all duration-300"
                  >
                    <Image
                      src={opt.image}
                      alt={opt.title}
                      layout="fill"
                      objectFit="cover"
                      className="hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/10 z-10" />
                    
                    <div className="absolute inset-0 p-4 flex flex-col justify-end z-20 text-white font-bold">
                      <h4 className="font-sans text-sm font-bold text-white transition-colors duration-300">
                        {opt.title}
                      </h4>
                      <p className="mt-1 text-xs text-white/90 leading-relaxed font-bold">
                        {opt.description}
                      </p>
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


