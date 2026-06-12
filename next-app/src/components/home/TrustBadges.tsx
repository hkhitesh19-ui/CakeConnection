'use client';
import { Truck, Moon, Leaf, Shield, Sparkles } from 'lucide-react';
import { Container } from '@/components/ui';

const BADGES = [
  { icon: Truck, title: 'Same Day Delivery', subtitle: 'Order by 5 PM' },
  { icon: Moon, title: 'Midnight Delivery', subtitle: 'Surprise at 12 AM' },
  { icon: Leaf, title: '100% Eggless', subtitle: 'Pure Vegetarian Cakes' },
  { icon: Shield, title: 'Secure Payments', subtitle: 'Razorpay Protected' },
  { icon: Sparkles, title: 'Freshness Guaranteed', subtitle: 'Baked Fresh Daily' },
];

export default function TrustBadges() {
  return (
    <section className="bg-gray-50 py-10 md:py-14 border-y border-gray-100">
      <Container className="max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8 justify-items-center">
          {BADGES.map((badge, idx) => {
            const IconComponent = badge.icon;
            // Center the 5th badge on tablet (since it will be 2 cols + 2 cols + 1 col)
            const isLastOnTablet = idx === BADGES.length - 1;
            
            return (
              <div
                key={idx}
                className={`flex flex-col items-center text-center p-4 rounded-2xl bg-white/60 backdrop-blur-sm shadow-sm border border-gray-50 hover:shadow-md transition-shadow duration-300 w-full max-w-[200px] ${
                  isLastOnTablet ? 'col-span-2 md:col-span-1 lg:col-span-1' : 'col-span-1'
                }`}
              >
                {/* Circle Icon */}
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-brand-rose/10 flex items-center justify-center text-brand-rose">
                  <IconComponent className="h-6 w-6 md:h-7 md:w-7" />
                </div>
                
                {/* Title */}
                <h3 className="text-xs md:text-sm font-bold text-gray-800 mt-4 tracking-wide">
                  {badge.title}
                </h3>
                
                {/* Subtitle */}
                <p className="text-[10px] md:text-xs text-gray-500 mt-1">
                  {badge.subtitle}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

