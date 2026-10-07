'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui';

interface CategoryItem {
  name: string;
  image: string;
  href: string;
  badge?: string;
}

const CATEGORIES: CategoryItem[] = [
  { name: 'Bestsellers', image: '/images/hero-cake.png', href: '/cakes' },
  { name: 'Birthday Cakes', image: '/images/red-velvet-cake.png', href: '/birthday-cake-vadodara' },
  { name: 'All Cakes', image: '/images/categories/cakes.png', href: '/cakes/vadodara' },
  { name: 'Flower Bouquets', image: '/images/categories/flowers.png', href: '/flowers/vadodara' },
  { name: 'Combos', image: '/images/categories/combos.png', href: '/combos' },
  { name: 'Anniversary', image: '/images/luxury-bouquet.png', href: '/anniversary-cake-vadodara' },
  { name: 'Same Day (2h)', image: '/images/combo-gift.png', href: '/same-day-cake-delivery-vadodara' },
  { name: 'Midnight', image: '/images/black-forest-cake.png', href: '/midnight-cake-delivery-vadodara' },
];

export default function CategoriesSection() {
  return (
    <section className="bg-white py-8 md:py-12 relative overflow-hidden">
      <Container className="max-w-7xl">
        {/* Horizontally scrollable on mobile, centered/wrapped on desktop */}
        <div className="flex gap-4 md:gap-8 overflow-x-auto pb-4 md:pb-0 scrollbar-none md:flex-wrap md:justify-center md:overflow-visible">
          {CATEGORIES.map((cat, idx) => (
            <Link
              key={idx}
              href={cat.href}
              className="flex flex-col items-center gap-3 shrink-0 group select-none min-w-[80px] md:min-w-[100px]"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden bg-white shadow-sm border border-gray-100 group-hover:shadow-md transition-shadow duration-300 flex items-center justify-center"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover p-1 group-hover:scale-105 transition-transform duration-300"
                />
                {cat.badge && (
                  <span className="absolute bottom-1 bg-brand-rose text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full shadow-xs uppercase tracking-wider">
                    {cat.badge}
                  </span>
                )}
              </motion.div>
              <span className="text-xs md:text-sm font-medium text-gray-700 group-hover:text-brand-rose transition-colors duration-200 text-center whitespace-nowrap md:whitespace-normal max-w-[90px] md:max-w-[110px]">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
