import { Metadata } from 'next';
import Link from 'next/link';
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema';
import AEOBlock from '@/components/seo/AEOBlock';
import { LOCALITIES, FREE_DELIVERY_ABOVE, SAME_DAY_CUTOFF } from '@/data/localities';

const BASE = 'https://cakeconnection.in';

export const metadata: Metadata = {
  title: 'Same Day Cake Delivery in Vadodara - 2 to 4 Hours | CakeConnection',
  description: `Same-day cake delivery in Vadodara in 2-4 hours. Order by ${SAME_DAY_CUTOFF}. Superfast 1-2 hr delivery in Alkapuri and Gotri. 100% eggless fresh cakes. Free delivery above Rs.${FREE_DELIVERY_ABOVE}.`,
  keywords: ['same day cake delivery vadodara', 'express cake delivery vadodara', '2 hour cake delivery vadodara', 'urgent cake delivery vadodara', 'fast cake delivery vadodara'],
  alternates: { canonical: `${BASE}/same-day-cake-delivery-vadodara` },
};

const expressFaqs = [
  {
    question: 'Vadodara mein same-day cake delivery mein kitna time lagta hai?',
    answer: `CakeConnection ${SAME_DAY_CUTOFF} se pehle order karne par 2-4 ghante mein fresh cake deliver karta hai. Alkapuri aur Gotri mein 90 min ka express option bhi hai.`,
  },
  {
    question: 'Kya aaj cake order karke aaj hi mil sakti hai Vadodara mein?',
    answer: `Haan! ${SAME_DAY_CUTOFF} se pehle order karo aur usi din 2-4 ghante mein delivery paoge. Superfast 1-2 ghante wala option bhi select areas mein hai.`,
  },
  {
    question: 'Last minute birthday cake kaise milegi Vadodara mein?',
    answer: `${SAME_DAY_CUTOFF} tak order karo. CakeConnection.in pe jaao ya WhatsApp karo +917203824012 pe. Fresh cake banke usi din pahunch jaayegi.`,
  },
];

export default function SameDayCakeVadodara() {
  const expressAreas = LOCALITIES.filter(l => l.expresAvailable);

  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Home', url: BASE },
        { name: 'Same Day Cake Delivery Vadodara', url: `${BASE}/same-day-cake-delivery-vadodara` },
      ]} />

      <main className="py-10 bg-background-primary text-text-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          <h1 className="font-display text-4xl font-bold text-gradient-rose mb-5">
            Same Day Cake Delivery in Vadodara — 2 to 4 Hours
          </h1>

          <p className="text-lg text-text-secondary leading-relaxed mb-8">
            Vadodara mein same-day cake delivery ka cut-off{' '}
            <strong className="text-white">{SAME_DAY_CUTOFF}</strong> hai.
            {SAME_DAY_CUTOFF} se pehle order karo — fresh eggless cake{' '}
            <strong className="text-brand-rose">2–4 ghante</strong> mein deliver.
            Alkapuri aur Gotri mein{' '}
            <strong className="text-brand-rose">90-minute superfast</strong> option bhi available hai.
          </p>

          <Link href="/cakes" className="inline-block px-6 py-3 bg-brand-rose text-white font-semibold rounded-xl hover:bg-brand-rose/90 transition-colors mb-10">
            Order Same-Day Cake →
          </Link>

          <section className="mb-10">
            <h2 className="font-display text-xl font-bold text-white mb-3">Vadodara Delivery Time by Area</h2>
            <div className="overflow-x-auto rounded-xl border border-border-secondary">
              <table className="w-full text-sm">
                <caption className="sr-only">Same Day Cake Delivery Times by Area in Vadodara</caption>
                <thead className="bg-brand-rose/10">
                  <tr>
                    <th className="px-4 py-3 text-left text-text-secondary font-semibold">Area</th>
                    <th className="px-4 py-3 text-left text-text-secondary font-semibold">Standard ETA</th>
                    <th className="px-4 py-3 text-left text-text-secondary font-semibold">Superfast</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-secondary">
                  {LOCALITIES.map(loc => (
                    <tr key={loc.slug} className="hover:bg-surface-secondary/50">
                      <td className="px-4 py-3 text-white font-medium">{loc.name}</td>
                      <td className="px-4 py-3 text-white">{loc.etaText}</td>
                      <td className="px-4 py-3">
                        {loc.expresAvailable
                          ? <span className="text-brand-rose font-medium">⚡ 90 min</span>
                          : <span className="text-text-muted">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {expressAreas.length > 0 && (
            <section className="mb-10">
              <h2 className="font-display text-xl font-bold text-white mb-3">
                Superfast 90-Min Areas ({expressAreas.length})
              </h2>
              <div className="flex flex-wrap gap-2">
                {expressAreas.map(loc => (
                  <Link key={loc.slug} href={`/cakes/vadodara/${loc.slug}`}
                    className="px-3 py-2 bg-surface-secondary border border-border-secondary rounded-lg text-sm text-white hover:border-brand-rose transition-colors">
                    {loc.name} ({loc.pincode})
                  </Link>
                ))}
              </div>
            </section>
          )}

          <AEOBlock
            title="Same-Day Delivery Vadodara — FAQ"
            summary={`Vadodara mein same-day cake delivery cut-off ${SAME_DAY_CUTOFF} hai. Delivery 2-4 hrs. Alkapuri, Gotri mein 90 min superfast option. Free delivery above Rs.${FREE_DELIVERY_ABOVE}.`}
            faqs={expressFaqs}
            city="Vadodara"
          />
        </div>
      </main>
    </>
  );
}
