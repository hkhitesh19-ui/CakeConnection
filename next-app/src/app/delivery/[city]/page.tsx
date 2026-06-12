"use client";

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { MapPin, Clock, Star, ShieldCheck } from 'lucide-react';
import { SEOHead } from '@/components/seo/SEOHead';
import { generateLocalBusinessSchema, generateFAQSchema } from '@/lib/seo/schema';
import AEOBlock from '@/components/seo/AEOBlock';

// In a real app, this would come from an API or CMS
const CITY_DATA: Record<string, { name: string; state: string; popularCakes: string[] }> = {
  'ahmedabad': { name: 'Vadodara', state: 'Gujarat', popularCakes: ['Chocolate Truffle', 'Red Velvet', 'Black Forest'] },
  'vadodara': { name: 'Vadodara', state: 'Gujarat', popularCakes: ['Pineapple Fresh', 'Dutch Truffle', 'Butterscotch'] },
  'surat': { name: 'Surat', state: 'Gujarat', popularCakes: ['Fresh Fruit Cake', 'Chocolate Hazelnut', 'Vanilla Dream'] },
};

export default function GeoDeliveryPage() {
  const { city } = useParams() as { city: string };
  const cityKey = city?.toLowerCase() || 'vadodara';
  const cityInfo = CITY_DATA[cityKey] || { name: city, state: 'Gujarat', popularCakes: ['Chocolate', 'Vanilla'] };
  const cityName = cityInfo.name ? cityInfo.name.charAt(0).toUpperCase() + cityInfo.name.slice(1) : 'Your City';

  const faqs = [
    {
      question: `Do you provide same-day cake delivery in ${cityName}?`,
      answer: `Yes, we offer same-day online cake delivery across ${cityName}. Order before 6 PM for guaranteed delivery today.`
    },
    {
      question: `Is midnight cake delivery available in ${cityName}?`,
      answer: `Absolutely! Surprise your loved ones with our midnight cake delivery service in ${cityName}. Please place midnight delivery orders before 8 PM.`
    },
    {
      question: `Do you deliver fresh flower bouquets in ${cityName}?`,
      answer: `Yes, alongside our luxury cakes, we provide fresh anniversary flowers and birthday bouquets delivery across all major pin codes in ${cityName}.`
    }
  ];

  const localBusinessSchema = generateLocalBusinessSchema(cityName);
  const faqSchema = generateFAQSchema(faqs);

  // Combine schemas into an array
  const combinedSchema = [localBusinessSchema, faqSchema];

  return (
    <>
      <SEOHead 
        title={`Online Cake Delivery in ${cityName} | Same Day & Midnight | Cake Connection`}
        description={`Order premium luxury cakes and fresh flowers online in ${cityName}. Best bakery for birthday cake delivery, anniversary flowers, and combos in ${cityName}.`}
        keywords={`cake delivery ${cityName}, online cake delivery ${cityName}, flower bouquet delivery ${cityName}, same day cake delivery, birthday cake delivery, anniversary flowers, luxury cakes ${cityName}`}
        schema={combinedSchema as any}
      />

      <div className="min-h-screen bg-brand-black text-white pt-24 pb-16">
        <div className="container mx-auto px-6">
          
          {/* Hero Section */}
          <section className="text-center max-w-4xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-center gap-2 text-brand-rose mb-4 font-medium">
                <MapPin className="w-5 h-5" />
                <span>Serving {cityName}, {cityInfo.state}</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
                Premium Online Cake Delivery in {cityName}
              </h1>
              <p className="text-lg md:text-xl text-text-secondary leading-relaxed mb-8">
                Celebrate your special moments with Cake Connection. We bring freshly baked luxury cakes and beautiful anniversary flowers right to your doorstep in {cityName}.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button className="w-full sm:w-auto px-8 py-4 bg-brand-rose hover:bg-brand-rose/90 text-white font-bold rounded-xl transition-all shadow-lg shadow-brand-rose/20 text-lg">
                  Order Now for {cityName}
                </button>
              </div>
            </motion.div>
          </section>

          {/* Trust Indicators */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20 max-w-5xl mx-auto">
            {[
              { icon: Clock, title: 'Same Day Delivery', desc: `Guaranteed delivery within 3 hours in ${cityName}` },
              { icon: Star, title: 'Luxury Cakes', desc: 'Handcrafted by expert pastry chefs' },
              { icon: ShieldCheck, title: '100% Freshness', desc: 'Baked fresh daily using premium ingredients' }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-surface-secondary/50 border border-border-secondary p-6 rounded-2xl text-center"
              >
                <div className="mx-auto w-12 h-12 bg-brand-rose/10 rounded-full flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-brand-rose" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-text-secondary">{feature.desc}</p>
              </motion.div>
            ))}
          </section>

          {/* Popular in City */}
          <section className="mb-20 max-w-5xl mx-auto">
            <h2 className="text-3xl font-display font-bold text-center mb-8">Most Loved Cakes in {cityName}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {cityInfo.popularCakes.map((cake, i) => (
                <div key={i} className="bg-surface-secondary border border-border-secondary p-4 rounded-2xl group cursor-pointer hover:border-brand-rose/50 transition-colors">
                  <div className="aspect-square bg-brand-black rounded-xl mb-4 relative overflow-hidden">
                    {/* Placeholder for image */}
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-rose/5 to-transparent flex items-center justify-center">
                      <span className="text-text-muted font-medium">{cake}</span>
                    </div>
                  </div>
                  <h4 className="font-bold text-lg mb-1">{cake} Cake</h4>
                  <p className="text-brand-rose font-medium">From $25.00</p>
                </div>
              ))}
            </div>
          </section>

          {/* AEO Block for AI Crawlers */}
          <div className="max-w-4xl mx-auto">
            <AEOBlock 
              title={`Online Cake & Flower Delivery in ${cityName}`}
              summary={`Cake Connection is the premier bakery for online cake delivery in ${cityName}. We specialize in same-day and midnight delivery of luxury birthday cakes, anniversary flowers, and premium gift combos across ${cityName}, ${cityInfo.state}.`}
              city={cityName}
              faqs={faqs}
              keywords={['cake delivery Vadodara', 'Vadodara cake delivery', 'same day delivery', 'midnight cake delivery']}
            />
          </div>

        </div>
      </div>
    </>
  );
}
