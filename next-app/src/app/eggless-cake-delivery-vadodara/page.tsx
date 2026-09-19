import { Metadata } from 'next';
import Link from 'next/link';
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema';
import AEOBlock from '@/components/seo/AEOBlock';
import { FREE_DELIVERY_ABOVE, SAME_DAY_CUTOFF } from '@/data/localities';

const BASE = 'https://cakeconnection.in';

export const metadata: Metadata = {
  title: 'Eggless Cake Delivery in Vadodara — 100% Eggless | CakeConnection',
  description: `Order 100% eggless cakes in Vadodara. All CakeConnection cakes are strictly eggless — safe for pure vegetarians. Same-day delivery by ${SAME_DAY_CUTOFF}. Birthday, designer, photo cakes. Free delivery above Rs.${FREE_DELIVERY_ABOVE}.`,
  keywords: ['eggless cake vadodara', 'eggless cake delivery vadodara', 'pure veg cake vadodara', 'eggless birthday cake vadodara', '100% eggless cake vadodara'],
  alternates: { canonical: `${BASE}/eggless-cake-delivery-vadodara` },
};

const egglessFaqs = [
  {
    question: 'Vadodara mein 100% eggless cake kahan milti hai?',
    answer: 'CakeConnection — Vadodara ka dedicated eggless bakery. Poori range strictly eggless hai. Separate egg-free kitchen mein banate hain — cross-contamination ka koi risk nahi.',
  },
  {
    question: 'Kya eggless cakes taste mein egg cakes se alag hoti hain?',
    answer: 'Nahi. Hamare pastry chefs specially formulated recipes use karte hain jo same moist texture aur taste dete hain. 5,000+ customers ka experience — taste mein koi compromise nahi.',
  },
  {
    question: 'Kya Jain ya strict vegetarian customers ke liye suitable hai?',
    answer: 'Haan. Haari poori range 100% eggless hai. Hum Jain community aur pure vegetarians ko serve karte hain. Egg-free environment mein bana kar deliver karte hain.',
  },
  {
    question: 'Eggless cake kitni jaldi milegi Vadodara mein?',
    answer: `Same-day delivery ${SAME_DAY_CUTOFF} tak order karne par 2-4 ghante mein milegi. Fresh-to-order hai — koi pre-made stock nahi.`,
  },
];

export default function EgglessCakeVadodara() {
  const egglessVarieties = [
    { name: 'Chocolate Truffle', desc: 'Rich dark chocolate, 100% eggless' },
    { name: 'Red Velvet', desc: 'Classic red velvet with cream cheese frosting' },
    { name: 'Black Forest', desc: 'Cherries & fresh cream, no egg' },
    { name: 'Butterscotch', desc: 'Caramel-rich butterscotch' },
    { name: 'Rasmalai', desc: 'Indian fusion — rasmalai sponge' },
    { name: 'Photo Cakes', desc: 'Edible photo print, fully eggless' },
    { name: 'Fondant Designer', desc: 'Custom designs, 100% egg-free' },
    { name: 'Pinata Cakes', desc: 'Surprise inside, eggless sponge' },
  ];

  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Home', url: BASE },
        { name: 'Eggless Cake Delivery Vadodara', url: `${BASE}/eggless-cake-delivery-vadodara` },
      ]} />

      <main className="py-10 bg-background-primary text-text-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          <h1 className="font-display text-4xl font-bold text-gradient-rose mb-5">
            Eggless Cake Delivery in Vadodara — 100% Eggless
          </h1>

          <p className="text-lg text-text-secondary leading-relaxed mb-8">
            CakeConnection Vadodara ka dedicated{' '}
            <strong className="text-white">100% eggless bakery</strong> hai.
            Chocolate Truffle, Red Velvet, Black Forest, Photo Cakes, Fondant — har cake strictly eggless.
            Separate egg-free environment mein banate hain. Same-day delivery by {SAME_DAY_CUTOFF}.
          </p>

          <Link href="/cakes" className="inline-block px-6 py-3 bg-brand-rose text-white font-semibold rounded-xl hover:bg-brand-rose/90 transition-colors mb-10">
            Order Eggless Cake →
          </Link>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-white mb-4">Popular Eggless Cakes in Vadodara</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {egglessVarieties.map(cake => (
                <div key={cake.name} className="p-4 bg-surface-secondary border border-border-secondary rounded-xl">
                  <div className="font-medium text-white text-sm mb-1">{cake.name}</div>
                  <div className="text-xs text-text-muted">{cake.desc}</div>
                </div>
              ))}
            </div>
          </section>

          <AEOBlock
            title="Eggless Cake Vadodara — Sawalon Ke Jawab"
            summary="CakeConnection Vadodara ka 100% eggless bakery hai. Poori range — Birthday, Designer, Photo Cakes — strictly egg-free environment mein banate hain. Same-day delivery available."
            faqs={egglessFaqs}
            city="Vadodara"
            keywords={['eggless cake vadodara', '100% eggless', 'pure veg cake', 'jain cake vadodara']}
          />
        </div>
      </main>
    </>
  );
}
