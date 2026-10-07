import { Metadata } from 'next';
import Link from 'next/link';
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema';
import AEOBlock from '@/components/seo/AEOBlock';

const BASE = 'https://cakeconnection.in';

export const metadata: Metadata = {
  title: 'Birthday Cake Delivery in Vadodara | Fresh Designer Birthday Cakes',
  description: 'Make birthdays special with fresh & delicious birthday cakes in Vadodara. Choose from photo cakes, theme cakes & eggless options. Fast home delivery!',
  keywords: ['birthday cake vadodara', 'birthday cake delivery vadodara', 'order birthday cake online vadodara', 'same day birthday cake vadodara', 'designer birthday cake vadodara'],
  alternates: { canonical: `${BASE}/birthday-cake-vadodara` },
};

const birthdayFaqs = [
  {
    question: 'Vadodara mein birthday cake same day order ho sakti hai?',
    answer: '6 PM tak order karo — birthday cake 2-4 ghante mein deliver ho jaati hai Vadodara mein. Midnight delivery bhi available hai: 8 PM tak order karo, delivery 11 PM-12 AM (₹149 extra).',
  },
  {
    question: 'Birthday cake ke saath free message likh sakte hain?',
    answer: 'Haan! "Happy Birthday [Name]" message free mein cake pe likhte hain. 30 characters tak message product page mein enter karo.',
  },
  {
    question: 'Kitne size ki birthday cake order karni chahiye?',
    answer: '500g — 4-6 log (small family). 1kg — 8-12 log (standard party). 1.5kg — 15-18 log. 2kg — 20-25 log. Bade party ke liye 2-tier ya 3kg+ cake le sakte hain.',
  },
  {
    question: 'Kya birthday cake 100% eggless hoti hai?',
    answer: 'Haan. CakeConnection ki poori birthday cake range 100% eggless hai — Chocolate Truffle, Red Velvet, Black Forest, Photo Cakes, Designer Cakes sab. Pure vegetarians ke liye safe.',
  },
];

export default function BirthdayCakeVadodara() {
  const popularCakes = [
    { name: 'Chocolate Truffle', desc: '#1 bestseller — dark chocolate ganache, soft sponge', tag: 'Most Popular' },
    { name: 'Red Velvet', desc: 'Classic red velvet with cream cheese frosting', tag: 'Fan Favourite' },
    { name: 'Photo Cake', desc: 'Birthday person ki photo edible print pe', tag: 'Personalised' },
    { name: 'Black Forest', desc: 'Cherries + fresh cream + chocolate', tag: 'Classic' },
    { name: 'Butterscotch', desc: 'Caramel-rich butterscotch with crunch topping', tag: 'Sweet Choice' },
    { name: 'Pinata Cake', desc: 'Surprise chocolates inside — party hit!', tag: 'Fun & Trendy' },
  ];

  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Home', url: BASE },
        { name: 'Birthday Cake Vadodara', url: `${BASE}/birthday-cake-vadodara` },
      ]} />
      <main className="py-10 bg-background-primary text-text-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm text-text-muted mb-6">
            <ol className="flex items-center gap-1.5">
              <li><Link href="/" className="hover:text-brand-rose">Home</Link></li>
              <li>›</li>
              <li className="text-text-primary font-medium">Birthday Cake Vadodara</li>
            </ol>
          </nav>
          <h1 className="font-display text-4xl font-bold text-gradient-rose mb-5">
            Fresh &amp; Designer Birthday Cakes in Vadodara
          </h1>
          <p className="text-lg text-text-secondary leading-relaxed mb-8">
            Vadodara mein birthday cake <strong className="text-white">same-day 2-4 ghante</strong> mein milti hai.
            Order by <strong className="text-brand-rose">6 PM</strong>. Midnight delivery by 8 PM (₹149).
            <strong className="text-white"> 100% eggless</strong> — Chocolate Truffle, Red Velvet, Photo Cakes, Designer Cakes.
            Free delivery above ₹999.
          </p>
          <div className="flex flex-wrap gap-3 mb-10">
            <Link href="/cakes" className="px-6 py-3 bg-brand-rose text-white font-semibold rounded-xl hover:bg-brand-rose/90 transition-colors">
              🎂 Order Birthday Cake →
            </Link>
            <Link href="/midnight-cake-delivery-vadodara" className="px-6 py-3 bg-surface-secondary border border-border-secondary text-white font-semibold rounded-xl hover:border-brand-rose transition-colors">
              🌙 Midnight Delivery Info
            </Link>
          </div>

          {/* Sizing guide — AEO */}
          <section className="mb-10 p-5 bg-surface-secondary border border-border-secondary rounded-2xl">
            <h2 className="font-display text-xl font-bold text-white mb-3">📏 Birthday Cake Size Guide</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border-secondary">
                    <th className="pb-2 text-left text-text-muted font-medium">Size</th>
                    <th className="pb-2 text-left text-text-muted font-medium">Serves</th>
                    <th className="pb-2 text-left text-text-muted font-medium">Best For</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-secondary">
                  {[
                    ['500g', '4-6 log', 'Small family celebration'],
                    ['1kg', '8-12 log', 'Standard birthday party'],
                    ['1.5kg', '15-18 log', 'Office birthday / bigger party'],
                    ['2kg', '20-25 log', 'Large gathering'],
                    ['3kg+', '30+ log', '2-tier cake recommended'],
                  ].map(([size, serves, best]) => (
                    <tr key={size}>
                      <td className="py-2 text-white font-medium">{size}</td>
                      <td className="py-2 text-text-secondary">{serves}</td>
                      <td className="py-2 text-text-muted text-xs">{best}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-white mb-4">Popular Birthday Cakes in Vadodara</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {popularCakes.map(cake => (
                <div key={cake.name} className="p-4 bg-surface-secondary border border-border-secondary rounded-xl">
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <span className="font-medium text-white text-sm">{cake.name}</span>
                    <span className="text-xs bg-brand-rose/20 text-brand-rose px-2 py-0.5 rounded-full shrink-0">{cake.tag}</span>
                  </div>
                  <p className="text-xs text-text-muted">{cake.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <AEOBlock
            title="Birthday Cake Vadodara — Sawal Jawab"
            summary="Birthday cake Vadodara mein same-day 2-4 ghante mein milti hai. Order by 6 PM. Midnight by 8 PM (₹149). 100% eggless. Sizes: 500g (4-6 log) to 2kg+ (25+ log)."
            faqs={birthdayFaqs}
            city="Vadodara"
            keywords={['birthday cake vadodara', 'same day birthday cake', 'eggless birthday cake vadodara']}
          />
        </div>
      </main>
    </>
  );
}
