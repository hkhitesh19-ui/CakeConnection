'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui';

const OCCASIONS = [
  { name: 'Birthday', image: '/images/occasions/birthday.png', href: '/cakes?occasion=birthday' },
  { name: 'Anniversary', image: '/images/occasions/anniversary.png', href: '/cakes?occasion=anniversary' },
  { name: 'Love & Romance', image: '/images/occasions/love.png', href: '/flowers?occasion=love' },
  { name: 'Congratulations', image: '/images/occasions/congratulations.png', href: '/flowers?occasion=congratulations' },
  { name: 'Get Well Soon', image: '/images/occasions/get_well.png', href: '/flowers?occasion=get-well' },
];

export default function ShopByOccasion() {
  return (
    <section className="bg-white py-12 md:py-16">
      <Container className="max-w-7xl">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-center text-gray-800 mb-8 md:mb-12">
          Shop by Occasion
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6">
          {OCCASIONS.map((occ, idx) => {
            const isLastOnMobile = idx === OCCASIONS.length - 1;
            return (
              <Link
                key={idx}
                href={occ.href}
                className={`group block overflow-hidden rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 ${
                  isLastOnMobile ? 'col-span-2 sm:col-span-1' : 'col-span-1'
                }`}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full aspect-[4/3] relative flex flex-col justify-end p-4 md:p-5 overflow-hidden"
                >
                  {/* Realistic Background Image */}
                  <img
                    src={occ.image}
                    alt={occ.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    loading="lazy"
                  />
                  
                  {/* Premium Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 z-10 transition-opacity duration-300 group-hover:from-black/90 group-hover:via-black/40" />

                  {/* Text Details (Bottom aligned) */}
                  <div className="relative z-20 flex flex-col gap-1 items-start">
                    <span className="text-sm md:text-base font-bold text-white tracking-wide leading-tight drop-shadow-sm">
                      {occ.name}
                    </span>
                    <span className="text-[10px] md:text-xs font-semibold text-rose-300 group-hover:text-rose-200 inline-flex items-center gap-1 transition-colors">
                      Shop Now <span className="transform group-hover:translate-x-1 transition-transform duration-200">→</span>
                    </span>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}


