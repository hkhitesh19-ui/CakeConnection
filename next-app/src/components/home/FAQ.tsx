'use client';
// ============================================
// FAQ Component — Cake Connection
// Accordion FAQ section with smooth height
// animation and rotating plus/minus icons
// ============================================

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Container } from '@/components/ui';
import { useSiteStore } from '@/stores/siteStore';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    id: 1,
    question: 'What areas do you deliver to in Vadodara?',
    answer:
      'We deliver across all major areas of Vadodara including Satellite, Vastrapur, Bodakdev, Prahlad Nagar, SG Highway, Navrangpura, CG Road, Maninagar, Bopal, Thaltej, Ambawadi, Paldi, and many more. We cover over 200+ pin codes across the city. If you\'re unsure whether we deliver to your area, simply enter your pin code at checkout or reach out to us on WhatsApp — we\'ll confirm instantly.',
  },
  {
    id: 2,
    question: 'How does same-day delivery work?',
    answer:
      'Place your order before 4 PM, and we\'ll deliver it the same day! We offer multiple delivery windows: 2-hour express delivery for urgent celebrations, 4-hour standard same-day delivery, and scheduled time-slot delivery where you can choose a specific 2-hour window. Once your order is confirmed, you\'ll receive real-time tracking updates via WhatsApp so you always know when to expect your delivery.',
  },
  {
    id: 3,
    question: 'Can I customize my cake design?',
    answer:
      'Absolutely! We love bringing your cake visions to life. You can customize the flavour, weight, design, colour scheme, and add personal messages or photo prints. For themed cakes, share your reference images with us on WhatsApp, and our pastry artists will create a custom design just for you. Custom cakes typically require 24–48 hours advance notice, depending on the complexity of the design.',
  },
  {
    id: 4,
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major payment methods for your convenience. This includes UPI (Google Pay, PhonePe, Paytm), all debit and credit cards (Visa, Mastercard, RuPay), net banking, and Razorpay-powered secure checkout. You can also pay via direct bank transfer or cash on delivery (available for select areas within Vadodara). All online transactions are 100% secure and encrypted.',
  },
  {
    id: 5,
    question: 'Do you offer midnight delivery?',
    answer:
      'Yes! Our midnight delivery is one of our most popular options — perfect for birthday surprises and anniversary celebrations. We deliver between 11:30 PM and 12:30 AM to ensure your loved one receives their gift right at midnight. Midnight delivery is available across Vadodara at a nominal additional charge. We recommend placing midnight delivery orders at least 6 hours in advance.',
  },
  {
    id: 6,
    question: 'What is your cancellation policy?',
    answer:
      'We understand plans can change. You can cancel your order for a full refund if cancelled more than 6 hours before the scheduled delivery time. Cancellations made within 6 hours of delivery are eligible for a 50% refund or full store credit. For custom-designed cakes that are already in preparation, we offer store credit valid for 90 days. Refunds are processed within 3–5 business days to your original payment method.',
  },
];

export function FAQ() {
  const [openId, setOpenId] = useState<number | null>(null);
  const { faqs } = useSiteStore();

  const toggleItem = useCallback((id: number) => {
    setOpenId((prev) => (prev === id ? null : id));
  }, []);

  const itemsToShow = faqs && faqs.length > 0 ? faqs : faqData;

  return (
    <section className="relative py-10 sm:py-12 lg:py-16 bg-white overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-1/2 -translate-y-1/2 -left-32 w-64 h-64 bg-brand-rose/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/4 -right-24 w-48 h-48 bg-brand-rose-gold/5 rounded-full blur-3xl pointer-events-none" />

      <Container size="md">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-12 sm:mb-16"
        >
          <p className="text-brand-rose font-medium text-sm tracking-widest uppercase mb-3">
            Got Questions?
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary">
            Frequently Asked Questions
          </h2>
        </motion.div>

        {/* FAQ List */}
        <div className="space-y-3">
          {itemsToShow.map((item, index) => {
            const itemId = (item as any).id || (index + 1);
            const isOpen = openId === itemId;

            return (
              <motion.div
                key={itemId}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.06,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className={`rounded-xl border transition-colors duration-300 ${
                  isOpen
                    ? 'border-brand-rose/30 bg-surface-secondary'
                    : 'border-border-secondary bg-surface-secondary/50 hover:border-border-accent/30'
                }`}
              >
                {/* Question button */}
                <button
                  onClick={() => toggleItem(itemId)}
                  className="flex items-center justify-between w-full text-left px-6 py-5 sm:px-8 sm:py-6 gap-4 cursor-pointer group"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${itemId}`}
                >
                  <span
                    className={`font-medium text-base sm:text-lg transition-colors duration-300 ${
                      isOpen ? 'text-brand-rose' : 'text-text-primary group-hover:text-text-accent'
                    }`}
                  >
                    {item.question}
                  </span>

                  {/* Plus/minus icon with rotation */}
                  <motion.div
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                      isOpen
                        ? 'bg-brand-rose text-white'
                        : 'bg-surface-tertiary text-text-secondary'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                  </motion.div>
                </button>

                {/* Answer with height animation */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${itemId}`}
                      role="region"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        height: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] },
                        opacity: { duration: 0.25, delay: 0.1 },
                      }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 sm:px-8 sm:pb-6 pt-0">
                        <div className="w-12 h-px bg-brand-rose/30 mb-4" />
                        <p className="text-text-secondary text-sm sm:text-base leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

