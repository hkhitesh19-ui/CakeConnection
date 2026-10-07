import { Metadata } from 'next';
import Link from 'next/link';
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema';
import AEOBlock from '@/components/seo/AEOBlock';

const BASE = 'https://cakeconnection.in';

export const metadata: Metadata = {
  title: 'Anniversary Cake Delivery in Vadodara | Romantic Heart Cakes',
  description: 'Order romantic anniversary cakes online in Vadodara. Heart-shaped, red velvet & customized anniversary cakes with midnight delivery option.',
  keywords: ['anniversary cake vadodara', 'anniversary cake delivery vadodara', 'heart cake vadodara', 'couple cake vadodara', 'anniversary gift vadodara', 'romantic cakes vadodara'],
  alternates: { canonical: `${BASE}/anniversary-cake-vadodara` },
  openGraph: {
    title: 'Anniversary Cake Delivery in Vadodara | Romantic Heart Cakes',
    description: '100% eggless anniversary cakes — same-day & midnight delivery in Vadodara.',
    url: `${BASE}/anniversary-cake-vadodara`,
  },
};

const anniversaryFaqs = [
  {
    question: 'Vadodara mein anniversary cake same day milti hai?',
    answer: 'Haan. CakeConnection pe 6 PM se pehle order karo — anniversary cake 2-4 ghante mein deliver ho jaati hai. Midnight delivery bhi available hai (order by 8 PM, delivery 11 PM-12 AM, charge ₹149).',
  },
  {
    question: 'Anniversary ke liye kaun si cake best hoti hai?',
    answer: 'Anniversary ke liye most popular choices: Heart-shaped Chocolate Truffle, Red Velvet with couple photo, Rasmalai (traditional touch), ya Premium Tier Cake. Ek romantic touch ke liye cake ke saath red rose bouquet combo bhi le sakte ho.',
  },
  {
    question: 'Kya anniversary cake pe couple ki photo lag sakti hai?',
    answer: 'Haan! Photo cake anniversary ka best choice hai. 100% edible sugar sheet pe high-quality photo print hoti hai. WhatsApp pe photo bhejo aur message batao — usi din delivery available hai.',
  },
  {
    question: 'Anniversary cake ke saath kya gift bheja ja sakta hai?',
    answer: 'Cake ke saath red roses bouquet, Ferrero Rocher chocolates, teddy bear, ya premium gift hamper add kar sakte ho checkout mein. Cake + Flowers combo anniversary ka sabse popular choice hai Vadodara mein.',
  },
];

const anniversaryCakes = [
  { name: 'Heart-Shaped Chocolate Truffle', desc: 'Classic heart design — most romantic anniversary choice', popular: true },
  { name: 'Red Velvet Couple Photo Cake', desc: 'Red velvet sponge with your couple photo on top', popular: true },
  { name: 'Rasmalai Anniversary Cake', desc: 'Indian fusion — rasmalai cream with rose petals', popular: false },
  { name: 'Black Forest Special', desc: 'Dark chocolate, cherries, fresh cream', popular: false },
  { name: 'Butterscotch Caramel Cake', desc: 'Caramel-rich butterscotch with crunch topping', popular: false },
  { name: '2-Tier Anniversary Cake', desc: 'Premium 2-tier cake for big celebrations', popular: true },
];

export default function AnniversaryCakeVadodara() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Anniversary Cakes in Vadodara',
            numberOfItems: anniversaryCakes.length,
            itemListElement: anniversaryCakes.map((c, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: c.name,
            })),
          }),
        }}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: BASE },
          { name: 'Anniversary Cake Vadodara', url: `${BASE}/anniversary-cake-vadodara` },
        ]}
      />

      <main className="py-10 bg-background-primary text-text-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm text-text-muted mb-6">
            <ol className="flex items-center gap-1.5 flex-wrap">
              <li><Link href="/" className="hover:text-brand-rose">Home</Link></li>
              <li>›</li>
              <li className="text-text-primary font-medium">Anniversary Cake Vadodara</li>
            </ol>
          </nav>

          <h1 className="font-display text-4xl font-bold text-gradient-rose mb-5">
            Premium Anniversary Cakes in Vadodara
          </h1>

          {/* AEO: Answer-first paragraph */}
          <p className="text-lg text-text-secondary leading-relaxed mb-8">
            CakeConnection Vadodara mein anniversary cakes same-day deliver karta hai — <strong className="text-white">2-4 ghante</strong> mein.
            Order by <strong className="text-brand-rose">6 PM</strong> for same-day, ya midnight delivery by 8 PM (₹149 extra).
            Heart-shaped, photo cakes, rasmalai, red velvet — sab <strong className="text-white">100% eggless</strong>.
            Free delivery above ₹999.
          </p>

          <div className="flex flex-wrap gap-3 mb-10">
            <Link href="/cakes" className="px-6 py-3 bg-brand-rose text-white font-semibold rounded-xl hover:bg-brand-rose/90 transition-colors">
              💕 Order Anniversary Cake →
            </Link>
            <Link href="/combos" className="px-6 py-3 bg-surface-secondary border border-border-secondary text-white font-semibold rounded-xl hover:border-brand-rose transition-colors">
              Cake + Flowers Combo
            </Link>
          </div>

          {/* Popular choices */}
          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-white mb-4">Anniversary Cake Options — Vadodara</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {anniversaryCakes.map((cake) => (
                <div key={cake.name} className="p-4 bg-surface-secondary border border-border-secondary rounded-xl flex gap-3 items-start">
                  <div className="flex-1">
                    <div className="font-medium text-white text-sm flex items-center gap-2">
                      {cake.name}
                      {cake.popular && <span className="text-xs bg-brand-rose/20 text-brand-rose px-2 py-0.5 rounded-full">Popular</span>}
                    </div>
                    <div className="text-xs text-text-muted mt-1">{cake.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Why combo */}
          <section className="mb-10 p-5 bg-surface-secondary border border-border-secondary rounded-2xl">
            <h2 className="font-display text-xl font-bold text-white mb-3">🌹 Anniversary Mein Cake + Flowers Combo Kyun?</h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              Sirf cake se zyada impact chahiye? CakeConnection pe <strong className="text-white">Cake + Red Roses combo</strong> select karo —
              ek order mein dono saath aate hain. Vadodara mein anniversary combo ka sabse popular choice hai yeh.
              Fresh Dutch red roses + chocolate truffle anniversary cake = perfect surprise.
            </p>
            <Link href="/combos" className="inline-block mt-4 text-brand-rose text-sm font-semibold hover:underline">
              View All Cake + Flower Combos →
            </Link>
          </section>

          <AEOBlock
            title="Anniversary Cake Vadodara — Jawab Har Sawaal Ka"
            summary="CakeConnection Vadodara mein anniversary cakes same-day 2-4 ghante mein deliver karta hai. Order by 6 PM. Midnight delivery by 8 PM (₹149). Heart, photo, rasmalai cakes — sab 100% eggless. Free delivery above ₹999."
            faqs={anniversaryFaqs}
            city="Vadodara"
            keywords={['anniversary cake vadodara', 'anniversary cake delivery', 'heart cake vadodara']}
          />
        </div>
      </main>
    </>
  );
}
