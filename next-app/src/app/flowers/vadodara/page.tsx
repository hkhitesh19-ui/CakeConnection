import { Metadata } from 'next';
import Link from 'next/link';
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema';
import AEOBlock from '@/components/seo/AEOBlock';
import { LOCALITIES, FREE_DELIVERY_ABOVE, SAME_DAY_CUTOFF } from '@/data/localities';

const BASE = 'https://cakeconnection.in';

export const metadata: Metadata = {
  title: 'Flower Delivery in Vadodara — Same Day & Fresh Bouquets | CakeConnection',
  description: `Order fresh flower bouquets in Vadodara. Roses, lilies, orchids, mixed bouquets. Same-day delivery by ${SAME_DAY_CUTOFF}. Free delivery above Rs.${FREE_DELIVERY_ABOVE}. Delivery in Alkapuri, Gotri, Manjalpur & more.`,
  keywords: ['flower delivery vadodara', 'flower bouquet vadodara', 'rose bouquet vadodara', 'same day flower delivery vadodara', 'online flower order vadodara', 'anniversary flowers vadodara'],
  alternates: { canonical: `${BASE}/flowers/vadodara` },
};

const flowerFaqs = [
  {
    question: 'Vadodara mein fresh flower bouquet kahan se order karein?',
    answer: 'CakeConnection se Vadodara mein fresh roses, lilies, orchids, gerberas, aur mixed bouquets same-day delivery ke saath order kar sakte ho. Website ya WhatsApp se order karo.',
  },
  {
    question: 'Vadodara mein flower delivery kitni fast hoti hai?',
    answer: `Same-day flower delivery 2-4 ghante mein hoti hai. ${SAME_DAY_CUTOFF} se pehle order karo. Alkapuri aur Gotri mein 90 min mein bhi milti hai.`,
  },
  {
    question: 'Anniversary ke liye kaun sa bouquet best hai Vadodara mein?',
    answer: 'Anniversary ke liye Red Roses (20 ya 50 stems), Mixed Flowers premium bouquet, ya Cake + Flowers combo popular choices hain Vadodara mein.',
  },
  {
    question: 'Kya cake aur flowers combo milta hai Vadodara mein?',
    answer: 'Haan! CakeConnection pe Cake + Flowers combos available hain — perfect birthday aur anniversary gifts. Ek order mein dono ek saath deliver hoti hain.',
  },
];

export default function FlowersVadodaraPage() {
  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Home', url: BASE },
        { name: 'Flowers', url: `${BASE}/flowers` },
        { name: 'Flower Delivery Vadodara', url: `${BASE}/flowers/vadodara` },
      ]} />

      <main className="py-10 bg-background-primary text-text-primary">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          <nav className="text-sm text-text-muted mb-6" aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5">
              <li><Link href="/" className="hover:text-brand-rose">Home</Link></li>
              <li>›</li>
              <li><Link href="/flowers" className="hover:text-brand-rose">Flowers</Link></li>
              <li>›</li>
              <li className="text-text-primary font-medium">Flower Delivery Vadodara</li>
            </ol>
          </nav>

          <h1 className="font-display text-4xl sm:text-5xl font-bold text-gradient-rose mb-6">
            Flower Delivery in Vadodara — Same Day Fresh Bouquets
          </h1>

          <p className="text-lg text-text-secondary leading-relaxed mb-8 max-w-3xl">
            CakeConnection delivers fresh flower bouquets across Vadodara in 2–4 hours.
            Roses, lilies, orchids, carnations, gerberas aur premium mixed bouquets.
            Same-day cut-off {SAME_DAY_CUTOFF}. Free delivery above Rs.{FREE_DELIVERY_ABOVE}.
          </p>

          <div className="flex flex-wrap gap-3 mb-12">
            <Link href="/flowers" className="px-6 py-3 bg-brand-rose hover:bg-brand-rose/90 text-white font-semibold rounded-xl transition-colors">
              Order Flowers Online →
            </Link>
            <Link href="/combos" className="px-6 py-3 bg-surface-secondary border border-border-secondary hover:border-brand-rose text-white font-semibold rounded-xl transition-colors">
              Cake + Flower Combos
            </Link>
          </div>

          <section className="mb-12">
            <h2 className="font-display text-2xl font-bold text-white mb-4">Vadodara Flower Delivery Areas</h2>
            <div className="overflow-x-auto rounded-xl border border-border-secondary">
              <table className="w-full text-sm">
                <caption className="sr-only">Flower Delivery Areas in Vadodara with ETA and Pincode</caption>
                <thead className="bg-brand-rose/10">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-text-secondary">Area</th>
                    <th className="px-4 py-3 text-left font-semibold text-text-secondary">Pincode</th>
                    <th className="px-4 py-3 text-left font-semibold text-text-secondary">Delivery ETA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-secondary">
                  {LOCALITIES.map(loc => (
                    <tr key={loc.slug} className="hover:bg-surface-secondary/50">
                      <td className="px-4 py-3 font-medium text-white">{loc.name}</td>
                      <td className="px-4 py-3 text-text-muted font-mono">{loc.pincode}</td>
                      <td className="px-4 py-3 text-white">{loc.etaText}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-text-muted mt-2">Last updated: September 2026</p>
          </section>

          <AEOBlock
            title="Flower Delivery Vadodara — FAQ"
            summary={`CakeConnection Vadodara mein fresh flower bouquets 2-4 ghante mein deliver karta hai. Roses, lilies, orchids, mixed bouquets. Same-day cut-off ${SAME_DAY_CUTOFF}. Free delivery above Rs.${FREE_DELIVERY_ABOVE}.`}
            faqs={flowerFaqs}
            city="Vadodara"
          />
        </div>
      </main>
    </>
  );
}
