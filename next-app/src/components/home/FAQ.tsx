'use client';
// ============================================
// FAQ Component — Cake Connection
// AEO (Answer Engine Optimization) & SEO Powerhouse
// Features 12 Comprehensive Q&As for Vadodara, Category Tabs,
// and embedded FAQPage JSON-LD Structured Data Schema
// ============================================

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle, Truck, Cake, Flower2, ShieldCheck, MessageCircle } from 'lucide-react';
import { Container } from '@/components/ui';
import { cn } from '@/utils';
import { whatsappConfig } from '@/config/site.config';

export interface FAQItem {
  id: number;
  category: 'delivery' | 'cakes' | 'flowers' | 'payments';
  question: string;
  answer: string;
}

export const SEO_FAQ_DATA: FAQItem[] = [
  // ── Delivery & Timings ──
  {
    id: 1,
    category: 'delivery',
    question: 'What areas do you deliver to in Vadodara, and is delivery free?',
    answer:
      'Yes! We offer free same-day cake delivery across all major localities of Vadodara including Alkapuri, Gotri, Manjalpur, Akota, Fatehgunj, Karelibaug, Sayajigunj, Vasna Road, Waghodia Road, Sama, Subhanpura, Atladra, and Harni. We cover over 20+ pin codes across Vadodara. Standard delivery is completely free for orders above ₹499 with no hidden charges.',
  },
  {
    id: 2,
    category: 'delivery',
    question: 'How does 2-hour express cake delivery work in Vadodara?',
    answer:
      'Our 2-hour express delivery is powered by our local live bakery kitchen in Vadodara. The moment your order is confirmed, our pastry chefs immediately bake your cake fresh, package it in insulated boxes with cooling packs, and dispatch it via a dedicated delivery executive to reach your doorstep within 120 minutes.',
  },
  {
    id: 3,
    category: 'delivery',
    question: 'What are your same-day delivery time slots in Vadodara?',
    answer:
      'We deliver daily across Vadodara between 10:00 AM and 9:00 PM with flexible slots. You can choose express delivery (60 to 90 minutes) or your preferred delivery time slot at checkout for smooth door-to-door delivery.',
  },
  {
    id: 4,
    category: 'delivery',
    question: 'What is the cut-off time for same-day cake delivery in Vadodara?',
    answer:
      'You can place same-day orders up to 7:00 PM for standard evening delivery. For urgent cake requirements, you can WhatsApp our live kitchen team directly for instant baking and dispatch availability.',
  },
  // ── 🔴 NEW: How to Order (AEO Gold — Process Explanation) ──
  {
    id: 5,
    category: 'delivery',
    question: 'How do I order a cake from CakeConnection in Vadodara?',
    answer:
      'Ordering takes 3 steps and under 5 minutes. Step 1: Browse cakes on CakeConnection.in and choose your flavour, size, and any customisation (photo, message, theme). Step 2: Select your delivery date, time slot (same-day express or a future date), and enter your Vadodara delivery address. Step 3: Pay securely via UPI, card, or net banking through Razorpay — you get an instant WhatsApp confirmation. Our team calls if any customisation details are needed before baking.',
  },
  // ── Cakes, Flavours & 100% Eggless ──
  {
    id: 6,
    category: 'cakes',
    question: 'Are all cakes at CakeConnection 100% eggless and freshly baked?',
    answer:
      'Yes, 100% of our cakes are strictly pure vegetarian (eggless) baked in a dedicated egg-free bakery kitchen following strict FSSAI hygiene standards. We never use premade frozen cakes — every single order is freshly baked only after you place your order, guaranteeing ultra-soft sponge and fresh cream.',
  },
  // ── 🔴 NEW: Cake Sizing Guide (Most-cited AEO content) ──
  {
    id: 7,
    category: 'cakes',
    question: 'Kitne logon ke liye kitne weight ki cake order karni chahiye?',
    answer:
      'Cake size guide: 500g (half kg) — 4 to 6 log ke liye perfect, jaise small family cutting. 1kg — 8 to 12 log ke liye, standard birthday party. 1.5kg — 15 to 18 log ke liye. 2kg — 20 to 25 log ke liye. 3kg+ ya 2-tier cake — 30+ logon ke liye ya badi parties ke liye. Ek tip: agar cake cutting chhota ho aur return gifts bhi ho, toh 1 size upar lena behtar rehta hai.',
  },
  {
    id: 8,
    category: 'cakes',
    question: 'Can I order custom photo cakes and personalized designer cakes in Vadodara?',
    answer:
      'Absolutely! We specialize in customized photo cakes printed on 100% edible sugar sheets using food-grade natural inks. You can also order custom themed cakes (Unicorn, PubG, Barbie, Super Dad, Car themes, 2-tier wedding cakes) by sharing your reference photo with our master decorators on WhatsApp.',
  },
  {
    id: 9,
    category: 'cakes',
    question: 'Can I write a personalized message on the cake? Is it free?',
    answer:
      'Yes! Writing a custom celebration message (up to 30 characters / 3 words, e.g., "Happy Birthday Priya" or "Happy 25th Anniversary Mom & Dad") on your cake is completely FREE. You can type your message directly in the message box on the product page before adding to cart.',
  },
  {
    id: 16,
    category: 'cakes',
    question: 'Where can I get a fresh live cake baked in 5 minutes in Vadodara?',
    answer:
      'Cake Connection Manjalpur offers instant 5-minute live cake selection, fresh cream finishing, and fast shop pickup at GF9 RutuPlatina Complex, Eva Mall Road. You can walk in or order online for instant live preparation.',
  },
  {
    id: 17,
    category: 'cakes',
    question: 'Which is the best 100% eggless bakery in Vadodara for custom theme cakes?',
    answer:
      'Cake Connection is Vadodara\'s top-rated, FSSAI-certified 100% pure veg live cake bakery. We specialize in custom fondant, pinata, photo, and designer theme cakes baked fresh on order in a strictly dedicated egg-free facility.',
  },
  // ── Flowers, Combos & Gifts ──
  {
    id: 10,
    category: 'flowers',
    question: 'Can I send fresh flower bouquets, chocolates, and greeting cards with the cake?',
    answer:
      'Yes! When you click "Add to Cart", our "Make it Extra Special" celebration add-on popup allows you to pair your cake with farm-fresh Dutch red roses, pink carnations, exotic orchids, Ferrero Rocher chocolates, sparkling fountain candles, party poppers, and handwritten pop-up greeting cards — all delivered together in a single elegant gift hamper.',
  },
  {
    id: 18,
    category: 'flowers',
    question: 'How to send fresh roses and cakes together anywhere in Vadodara on the same day?',
    answer:
      'Order online at cakeconnection.in for 2-hour express combo delivery. We deliver fresh Dutch red rose bouquets paired with freshly baked eggless cakes across Vadodara with midnight delivery options.',
  },
  // ── 🔴 NEW: Flower Occasion Guide (AI Citation Magnet) ──
  {
    id: 11,
    category: 'flowers',
    question: 'Kis occasion pe kaun si flowers bhejni chahiye?',
    answer:
      'Red roses — love aur romance ke liye: Valentine\'s Day, anniversary, proposal. Pink roses aur carnations — mothers, sisters, aur teachers ke liye. Yellow roses aur gerberas — congratulations aur achievements ke liye, bina zyada bolein. White lilies aur orchids — respect aur elegance ke liye, weddings ke liye bhi perfect. Mixed bouquet — jab decide na ho, sab occasions ke liye safe choice. Sunflowers — positivity aur friendship ke liye, birthdays ke liye great alternative to roses.',
  },
  {
    id: 12,
    category: 'flowers',
    question: 'Are the flowers delivered fresh and hand-arranged?',
    answer:
      'Every flower bouquet is hand-arranged by our expert local florists right before delivery using fresh morning blooms sourced directly from farm growers. Stems are wrapped in water-retaining floral foam to ensure they stay fresh, vibrant, and fragrant for days.',
  },
  // ── Payments, Safety & Guarantee ──
  {
    id: 13,
    category: 'payments',
    question: 'What payment methods do you accept? Is Cash on Delivery (COD) available?',
    answer:
      'We accept UPI (Google Pay, PhonePe, Paytm, BHIM), all major Credit & Debit Cards (Visa, Mastercard, RuPay), Net Banking, and digital wallets via 256-bit encrypted Razorpay. Cash on Delivery (COD) is also available across select pincodes in Vadodara.',
  },
  {
    id: 14,
    category: 'payments',
    question: 'What if the recipient is not available at the delivery address?',
    answer:
      'Our delivery partner will call both the recipient and sender. If unavailable, we can safely coordinate with a neighbor, security desk, or reschedule the delivery slot at the customer\'s convenience without compromising the cake freshness.',
  },
  {
    id: 15,
    category: 'payments',
    question: 'What is your cancellation and 100% Satisfaction Guarantee policy?',
    answer:
      'If you need to modify or cancel your order, you can do so up to 4 hours before the scheduled delivery slot for a full 100% refund. Furthermore, if your cake arrives damaged or differs from what you ordered, simply send us a photo on WhatsApp and we will immediately issue a free fresh replacement or full refund.',
  },
];


export function FAQ() {
  const [openId, setOpenId] = useState<number | null>(1); // First question open by default for AEO/UX
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'delivery' | 'cakes' | 'flowers' | 'payments'>('all');

  const toggleItem = useCallback((id: number) => {
    setOpenId((prev) => (prev === id ? null : id));
  }, []);

  const filteredFaqs = useMemo(() => {
    if (selectedCategory === 'all') return SEO_FAQ_DATA;
    return SEO_FAQ_DATA.filter((item) => item.category === selectedCategory);
  }, [selectedCategory]);

  // Generate Google-compliant FAQPage JSON-LD schema
  const faqSchema = useMemo(() => {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: SEO_FAQ_DATA.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    };
  }, []);

  return (
    <section className="relative py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white via-rose-50/20 to-white overflow-hidden" id="faq">
      {/* FAQPage JSON-LD Schema for Google Rich Snippets & AI Overviews */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Subtle Background Glows */}
      <div className="absolute top-1/3 -left-32 w-72 h-72 bg-brand-rose/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-24 w-60 h-60 bg-pink-500/5 rounded-full blur-3xl pointer-events-none" />

      <Container size="md">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-brand-rose/20 text-brand-rose text-xs font-bold uppercase tracking-wider mb-3">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
            Frequently Asked <span className="text-gradient-rose">Questions</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-600 max-w-xl mx-auto">
            Everything you need to know about fresh eggless cakes, 2-hour delivery, and flower delivery across Vadodara.
          </p>

          {/* Category Filter Tabs for AEO / SEO Navigation */}
          <div className="flex items-center justify-center gap-2 mt-6 overflow-x-auto no-scrollbar py-1">
            {[
              { key: 'all', label: `All Questions (${SEO_FAQ_DATA.length})`, icon: null },
              { key: 'delivery', label: '🚚 Delivery & Timings', icon: <Truck className="h-3.5 w-3.5" /> },
              { key: 'cakes', label: '🎂 Cakes & Eggless', icon: <Cake className="h-3.5 w-3.5" /> },
              { key: 'flowers', label: '💐 Flowers & Gifts', icon: <Flower2 className="h-3.5 w-3.5" /> },
              { key: 'payments', label: '💳 Payments & Guarantee', icon: <ShieldCheck className="h-3.5 w-3.5" /> },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setSelectedCategory(tab.key as any)}
                className={cn(
                  'px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5',
                  selectedCategory === tab.key
                    ? 'bg-brand-rose text-white shadow-md shadow-brand-rose/25 scale-102'
                    : 'bg-white border border-gray-200 text-gray-700 hover:border-brand-rose/50 hover:bg-rose-50/20'
                )}
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* FAQ List */}
        <div className="space-y-3">
          {filteredFaqs.map((item) => {
            const isOpen = openId === item.id;

            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  'rounded-2xl border transition-all duration-200 overflow-hidden bg-white',
                  isOpen
                    ? 'border-brand-rose/40 shadow-md shadow-brand-rose/5 ring-1 ring-brand-rose/15'
                    : 'border-gray-200 hover:border-brand-rose/30 hover:shadow-xs'
                )}
              >
                <button
                  onClick={() => toggleItem(item.id)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left cursor-pointer transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className={cn(
                    'text-sm sm:text-base font-bold pr-4 transition-colors',
                    isOpen ? 'text-brand-rose' : 'text-gray-900'
                  )}>
                    {item.question}
                  </span>
                  <div className={cn(
                    'w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 transition-colors',
                    isOpen ? 'bg-brand-rose text-white' : 'bg-gray-100 text-gray-500'
                  )}>
                    {isOpen ? (
                      <Minus className="h-4 w-4 stroke-[2.5]" />
                    ) : (
                      <Plus className="h-4 w-4 stroke-[2.5]" />
                    )}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                    >
                      <div className="px-4 pb-5 sm:px-5 sm:pb-6 pt-1 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 bg-gray-50/40">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* WhatsApp Help CTA */}
        <div className="mt-10 sm:mt-12 p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-white to-green-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h4 className="text-sm sm:text-base font-bold text-gray-900">
              Still have questions or need a custom design?
            </h4>
            <p className="text-xs text-gray-500 mt-0.5">
              Our cake artists are online 24/7 on WhatsApp to help with custom orders & quick queries.
            </p>
          </div>
          <a
            href={whatsappConfig.getOrderUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/25 transition-all shrink-0 cursor-pointer"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </Container>
    </section>
  );
}
