'use client';
import Link from 'next/link';
import { Container } from '@/components/ui';

const MUST_HAVE_ITEMS = [
  {
    title: 'Mango Cake',
    subtitle: "Summer's Sweet Tropical Escape",
    image: '/images/hero-cake.png', // Placeholder
    href: '/cakes?flavour=mango',
    colSpan: 1,
    rowSpan: 1,
  },
  {
    title: 'WINNI CELEBRATION SALE',
    subtitle: 'Amazing Discounts on Cakes, Flowers, and More!',
    image: '/images/hero_couple_banner.png', // Placeholder
    href: '/offers',
    colSpan: 1,
    rowSpan: 2,
    isPromo: true,
  },
  {
    title: 'Anniversary Flowers',
    subtitle: 'Fresh Blooms For Lasting Love',
    image: '/images/hero-flowers.png', // Placeholder
    href: '/flowers?occasion=anniversary',
    colSpan: 1,
    rowSpan: 1,
  },
  {
    title: 'New Arrival',
    subtitle: 'New & Made with Your Touch',
    image: '/images/combo-gift.png', // Placeholder
    href: '/new-arrivals',
    colSpan: 1,
    rowSpan: 1,
  },
  {
    title: 'Caricatures',
    subtitle: 'Turning Memories into Art',
    image: '/images/combo-gift.png', // Placeholder
    href: '/gifts?type=caricatures',
    colSpan: 1,
    rowSpan: 1,
  },
  {
    title: 'Winni Chocolates',
    subtitle: 'Made to Melt Hearts',
    image: '/images/combo-gift.png', // Placeholder
    href: '/chocolates',
    colSpan: 1,
    rowSpan: 1,
  },
  {
    title: 'Lucky Bamboo Plants',
    subtitle: 'Grow Positivity Every Day',
    image: '/images/hero-flowers.png', // Placeholder
    href: '/plants?type=bamboo',
    colSpan: 1,
    rowSpan: 1,
  },
  {
    title: 'Personalised Accessories',
    subtitle: 'Crafted to Reflect You',
    image: '/images/combo-gift.png', // Placeholder
    href: '/gifts?type=personalised',
    colSpan: 1,
    rowSpan: 1,
  },
];

export function MustHaveSection() {
  return (
    <section className="py-12 bg-white">
      <Container className="max-w-5xl">
        <h2 className="text-center text-xl sm:text-2xl font-bold text-gray-800 mb-8">
          Must Have
        </h2>
        
        {/* CSS Grid for the masonry-like layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-fr">
          {/* Top Left */}
          <div className="flex flex-col gap-4 md:gap-6">
            <PromoCard item={MUST_HAVE_ITEMS[0]} />
            <PromoCard item={MUST_HAVE_ITEMS[3]} />
            <PromoCard item={MUST_HAVE_ITEMS[5]} />
          </div>

          {/* Middle Column (Contains the tall promo) */}
          <div className="flex flex-col gap-4 md:gap-6">
            <PromoCard item={MUST_HAVE_ITEMS[1]} isTall />
            <PromoCard item={MUST_HAVE_ITEMS[6]} />
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-4 md:gap-6">
            <PromoCard item={MUST_HAVE_ITEMS[2]} />
            <PromoCard item={MUST_HAVE_ITEMS[4]} />
            <PromoCard item={MUST_HAVE_ITEMS[7]} />
          </div>
        </div>
      </Container>
    </section>
  );
}

function PromoCard({ item, isTall = false }: { item: any, isTall?: boolean }) {
  if (item.isPromo) {
    return (
      <Link href={item.href} className="group block relative w-full h-[400px] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-[#FFF5F8]">
        <img src={item.image} alt={item.title} className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
          <div className="bg-white/90 backdrop-blur-sm p-4 rounded-full inline-block mb-4 shadow-lg border border-brand-rose/20">
            <h3 className="text-brand-rose font-black text-xl leading-tight">{item.title}</h3>
          </div>
          <p className="text-gray-800 font-bold text-lg bg-white/80 px-4 py-1 rounded-full">{item.subtitle}</p>
        </div>
      </Link>
    );
  }

  return (
    <Link 
      href={item.href} 
      className={`group flex flex-col items-center p-6 rounded-xl border border-gray-100 bg-[#FAFAFA] hover:bg-white hover:shadow-lg transition-all duration-300 w-full ${isTall ? 'h-full min-h-[300px]' : 'h-[280px]'}`}
    >
      <h3 className="text-[#D81B60] font-bold text-lg mb-1 group-hover:text-brand-rose-dark transition-colors">{item.title}</h3>
      <p className="text-xs text-gray-500 mb-6 text-center">{item.subtitle}</p>
      <div className="flex-1 w-full relative flex items-center justify-center">
        <img 
          src={item.image} 
          alt={item.title} 
          className="max-h-[160px] w-auto object-contain group-hover:scale-105 transition-transform duration-500" 
        />
      </div>
    </Link>
  );
}

