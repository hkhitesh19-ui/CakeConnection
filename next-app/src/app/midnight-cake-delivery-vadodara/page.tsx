import { Metadata } from 'next';
import Link from 'next/link';
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema';
import AEOBlock from '@/components/seo/AEOBlock';
import { LOCALITIES, MIDNIGHT_CHARGE, MIDNIGHT_CUTOFF } from '@/data/localities';

const BASE = 'https://cakeconnection.in';

export const metadata: Metadata = {
  title: 'Midnight Cake Delivery in Vadodara — Order by 8 PM | CakeConnection',
  description: `Midnight cake delivery in Vadodara at 11 PM-12 AM. Order by ${MIDNIGHT_CUTOFF}. Charge Rs.${MIDNIGHT_CHARGE}. Available in Alkapuri, Gotri, Manjalpur, Fatehgunj & more. 100% eggless fresh cakes.`,
  keywords: ['midnight cake delivery vadodara', 'midnight cake vadodara', '12 am cake delivery vadodara', 'night cake delivery vadodara', 'surprise cake delivery vadodara'],
  alternates: { canonical: `${BASE}/midnight-cake-delivery-vadodara` },
};

const midnightAreas = LOCALITIES.filter(l => l.midnightAvailable);

const midnightFaqs = [
  {
    question: 'Vadodara mein midnight cake delivery ka cut-off time kya hai?',
    answer: `Midnight delivery ke liye ${MIDNIGHT_CUTOFF} tak order karna hota hai. Delivery 11 PM se 12 AM ke beech hoti hai. Midnight delivery charge sirf Rs.${MIDNIGHT_CHARGE} extra hai.`,
  },
  {
    question: 'Vadodara mein midnight cake delivery kaun se areas mein hoti hai?',
    answer: `Midnight cake delivery ${midnightAreas.map(l => l.name).join(', ')} mein available hai — ${midnightAreas.length} areas total.`,
  },
  {
    question: 'Kya midnight delivery mein koi extra charge lagta hai?',
    answer: `Haan, midnight delivery charge Rs.${MIDNIGHT_CHARGE} extra hai. Yeh charge 11 PM-12 AM delivery slot ke liye hai. Standard delivery charges alag se apply hote hain.`,
  },
  {
    question: 'Birthday surprise ke liye midnight cake kaise order karein Vadodara mein?',
    answer: `CakeConnection pe jaao, cake choose karo, checkout mein "Midnight Delivery" select karo. Ya WhatsApp pe +917203824012 par message karo. ${MIDNIGHT_CUTOFF} se pehle order confirm karein.`,
  },
];

export default function MidnightCakeDeliveryVadodara() {
  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Home', url: BASE },
        { name: 'Midnight Cake Delivery Vadodara', url: `${BASE}/midnight-cake-delivery-vadodara` },
      ]} />

      <main className="py-10 bg-background-primary text-text-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          <h1 className="font-display text-4xl font-bold text-gradient-rose mb-5">
            Midnight Cake Delivery in Vadodara
          </h1>

          <p className="text-lg text-text-secondary leading-relaxed mb-8">
            Vadodara mein midnight cake delivery ka cut-off{' '}
            <strong className="text-white">{MIDNIGHT_CUTOFF}</strong> hai.
            Order {MIDNIGHT_CUTOFF} se pehle karo — fresh cake{' '}
            <strong className="text-brand-rose">11 PM–12 AM</strong> ke beech deliver hogi.
            Midnight delivery charge sirf Rs.{MIDNIGHT_CHARGE}. Available in {midnightAreas.length} Vadodara areas.
          </p>

          <div className="flex flex-wrap gap-3 mb-10">
            <Link href="/cakes" className="px-6 py-3 bg-brand-rose text-white font-semibold rounded-xl hover:bg-brand-rose/90 transition-colors">
              Order Midnight Cake →
            </Link>
          </div>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-white mb-4">Midnight Delivery Kaise Kaam Karta Hai?</h2>
            <ol className="space-y-4">
              {[
                { step: '1', text: `Apni pasandida cake choose karo CakeConnection.in pe` },
                { step: '2', text: `Checkout mein "Midnight Delivery" slot select karo` },
                { step: '3', text: `${MIDNIGHT_CUTOFF} se pehle order confirm ho jaana chahiye` },
                { step: '4', text: `11 PM-12 AM ke beech fresh cake doorstep pe pahunch jaayegi` },
              ].map(item => (
                <li key={item.step} className="flex gap-4 items-start">
                  <span className="w-8 h-8 rounded-full bg-brand-rose text-white font-bold flex items-center justify-center flex-shrink-0 text-sm">{item.step}</span>
                  <span className="text-text-secondary pt-1">{item.text}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-xl font-bold text-white mb-3">
              Midnight Delivery Available Areas ({midnightAreas.length})
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {midnightAreas.map(loc => (
                <Link key={loc.slug} href={`/cakes/vadodara/${loc.slug}`}
                  className="p-3 bg-surface-secondary border border-border-secondary rounded-xl text-center hover:border-brand-rose transition-colors">
                  <div className="text-white font-medium text-sm">{loc.name}</div>
                  <div className="text-text-muted text-xs">{loc.pincode}</div>
                </Link>
              ))}
            </div>
          </section>

          <AEOBlock
            title="Midnight Cake Delivery Vadodara — FAQ"
            summary={`Vadodara mein midnight cake delivery cut-off ${MIDNIGHT_CUTOFF} hai. Delivery 11 PM-12 AM. Charge Rs.${MIDNIGHT_CHARGE}. ${midnightAreas.length} areas covered: ${midnightAreas.map(l => l.name).join(', ')}.`}
            faqs={midnightFaqs}
            city="Vadodara"
            keywords={['midnight cake delivery vadodara', 'midnight delivery vadodara', 'surprise cake delivery']}
          />
        </div>
      </main>
    </>
  );
}
