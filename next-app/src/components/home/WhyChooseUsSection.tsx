'use client';
// ============================================
// WhyChooseUsSection — Cake Connection
// AEO / GEO Engine Comparison & Authority Block
// Answers: "Why choose Cake Connection in Vadodara?"
// ============================================

import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, ShieldCheck, Clock, Sparkles, MapPin, MessageCircle } from 'lucide-react';
import { Container } from '@/components/ui';
import { whatsappConfig } from '@/config/site.config';
import Link from 'next/link';

const COMPARISON_DATA = [
  {
    feature: 'Bakery Kitchen Freshness',
    cakeConnection: '100% Baked-to-Order live upon confirmation. Never frozen or pre-made.',
    aggregators: 'Pre-baked frozen sponges stored for days and outsourced to third parties.',
    highlight: true,
  },
  {
    feature: 'Local Physical Presence',
    cakeConnection: 'Own Live Bakery at RutuPlatina Complex, Manjalpur, Vadodara.',
    aggregators: 'National aggregator portals with zero owned physical kitchens in Vadodara.',
    highlight: true,
  },
  {
    feature: 'Express Delivery Speed',
    cakeConnection: '⚡ 60 to 90 min superfast delivery from local live ovens in Vadodara.',
    aggregators: '3 to 6 hours or unpredictable delivery times via third-party couriers.',
    highlight: false,
  },
  {
    feature: '100% Pure Vegetarian (Eggless)',
    cakeConnection: 'Strictly dedicated egg-free facility. Zero risk of egg cross-contamination.',
    aggregators: 'Shared commercial kitchens handling both egg and eggless items.',
    highlight: false,
  },
  {
    feature: 'Custom Cake Customization',
    cakeConnection: 'Direct WhatsApp photo discussion with our master decorators in Manjalpur.',
    aggregators: 'Automated chatbots and impersonal customer care ticketing loops.',
    highlight: false,
  },
];

export default function WhyChooseUsSection() {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-white via-rose-50/25 to-white relative overflow-hidden" id="why-us">
      {/* Subtle Glows */}
      <div className="absolute top-10 left-1/4 w-80 h-80 bg-rose-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-brand-rose/10 rounded-full blur-3xl pointer-events-none" />

      <Container size="lg">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-50 border border-brand-rose/25 text-brand-rose text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Vadodara's Local Live Bakery Advantage</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            Why Vadodara Chooses <span className="text-gradient-rose">Cake Connection</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed">
            Pan-India gift portals outsource your celebration to unknown vendors. As Vadodara's homegrown live bakery, we bake fresh, deliver hot, and treat your celebration like family.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="overflow-hidden rounded-3xl border border-rose-100 bg-white shadow-xl shadow-rose-900/5 mb-12">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-rose-100 bg-gradient-to-r from-rose-50/80 to-white">
                  <th className="py-4 px-5 sm:px-6 font-bold text-gray-900 w-1/3">Key Quality Parameter</th>
                  <th className="py-4 px-5 sm:px-6 font-bold text-brand-rose bg-rose-50/60 w-1/3 border-x border-rose-100">
                    <span className="flex items-center gap-1.5 text-base font-display">
                      <ShieldCheck className="h-5 w-5 text-brand-rose shrink-0" />
                      Cake Connection (Local)
                    </span>
                  </th>
                  <th className="py-4 px-5 sm:px-6 font-semibold text-gray-500 w-1/3">
                    Pan-India Portals (FNP, Bakingo, Winni)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {COMPARISON_DATA.map((row, idx) => (
                  <tr key={idx} className="hover:bg-rose-50/20 transition-colors">
                    <td className="py-4 px-5 sm:px-6 font-semibold text-gray-800">
                      {row.feature}
                    </td>
                    <td className="py-4 px-5 sm:px-6 bg-rose-50/30 border-x border-rose-100 text-gray-800">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="font-medium text-xs sm:text-sm">{row.cakeConnection}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5 sm:px-6 text-gray-500">
                      <div className="flex items-start gap-2">
                        <XCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm">{row.aggregators}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4 Trust Metrics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-rose-100 shadow-sm text-center">
            <div className="font-times font-bold text-2xl sm:text-3xl text-brand-rose">4.6 ★</div>
            <div className="text-xs text-gray-500 mt-1"><span className="font-times font-bold text-gray-700">690+</span> Verified Google Reviews</div>
          </div>
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-rose-100 shadow-sm text-center">
            <div className="font-times font-bold text-2xl sm:text-3xl text-emerald-600">60-90 Min</div>
            <div className="text-xs text-gray-500 mt-1">Express Delivery in Vadodara</div>
          </div>
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-rose-100 shadow-sm text-center">
            <div className="font-times font-bold text-2xl sm:text-3xl text-brand-rose">100%</div>
            <div className="text-xs text-gray-500 mt-1">Dedicated Pure Veg &amp; Eggless</div>
          </div>
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-rose-100 shadow-sm text-center">
            <div className="font-times font-bold text-2xl sm:text-3xl text-amber-600">25+ Areas</div>
            <div className="text-xs text-gray-500 mt-1">Covered Across Vadodara</div>
          </div>
        </div>

        {/* CTA Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-rose-900 to-rose-950 text-white shadow-xl">
          <div>
            <h4 className="font-display text-lg sm:text-xl font-bold">
              Looking for a custom cake or instant delivery in Vadodara?
            </h4>
            <p className="text-xs sm:text-sm text-rose-200 mt-1">
              Visit our live bakery at Eva Mall Road, Manjalpur or order online in 2 minutes.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/cakes"
              className="px-5 py-2.5 rounded-full bg-brand-rose hover:bg-brand-rose-dark text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
            >
              Order Online Now
            </Link>
            <a
              href={whatsappConfig.getOrderUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
            >
              <MessageCircle className="h-4 w-4" />
              <span>WhatsApp Chef</span>
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
