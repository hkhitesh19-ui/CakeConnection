'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { Container } from '@/components/ui';

interface PromoBanner {
  title: string;
  subtitle: string;
  image: string;
  btnText: string;
  href: string;
  tag: string;
}

const promoBanners: PromoBanner[] = [
  {
    title: 'Midnight Celebrations',
    subtitle: 'Surprise your loved ones right at 12 AM with fresh cakes',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=600',
    btnText: 'Order Midnight Cake',
    href: '/cakes?delivery=midnight',
    tag: 'Midnight Special',
  },
  {
    title: 'Fresh Rose Bouquets',
    subtitle: 'Fragrant farm-fresh roses hand-curated to express emotions',
    image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?q=80&w=600',
    btnText: 'Send Fresh Flowers',
    href: '/flowers?search=love',
    tag: 'Fresh Blooms',
  },
  {
    title: 'Anniversary Hampers',
    subtitle: 'Exquisite combinations of premium cakes and fresh bouquets',
    image: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=600',
    btnText: 'Explore Combos',
    href: '/combos',
    tag: 'Best Combos',
  },
];

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      delay: i * 0.12,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  }),
};

export function DeliveryBanner() {
  return (
    <section className="py-16 bg-white border-t border-b border-border-secondary overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {promoBanners.map((promo, idx) => (
            <motion.div
              key={promo.title}
              custom={idx}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              className="relative rounded-2xl overflow-hidden shadow-md group aspect-[4/3] flex flex-col justify-end"
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={promo.image}
                  alt={promo.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />
              </div>

              {/* Tag Badge */}
              <span className="absolute top-4 left-4 bg-brand-rose text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow">
                {promo.tag}
              </span>

              {/* Content Panel */}
              <div className="relative p-6 text-white z-10 space-y-2.5">
                <h3 className="font-display text-lg sm:text-xl font-bold leading-tight">
                  {promo.title}
                </h3>
                <p className="text-xs text-white/80 leading-relaxed line-clamp-2">
                  {promo.subtitle}
                </p>
                <div className="pt-2">
                  <Link
                    href={promo.href}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-brand-rose hover:bg-brand-cream text-xs font-bold rounded-lg shadow transition-all duration-300 hover:scale-103 cursor-pointer"
                  >
                    <span>{promo.btnText}</span>
                    <Sparkles className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}


