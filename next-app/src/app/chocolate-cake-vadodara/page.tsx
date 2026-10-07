import { Metadata } from 'next';
import Link from 'next/link';
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema';
import AEOBlock from '@/components/seo/AEOBlock';

const BASE = 'https://cakeconnection.in';

export const metadata: Metadata = {
  title: 'Chocolate Cake Delivery in Vadodara — Truffle, Fudge & More | CakeConnection',
  description: 'Order rich chocolate cakes in Vadodara — Chocolate Truffle, Dark Chocolate Fudge, Choco Lava, Death by Chocolate. 100% eggless. Same-day delivery in 2-4 hours.',
  keywords: ['chocolate cake vadodara', 'chocolate truffle cake vadodara', 'dark chocolate cake vadodara', 'chocolate cake delivery vadodara', 'choco lava cake vadodara'],
  alternates: { canonical: `${BASE}/chocolate-cake-vadodara` },
};

const chocolateFaqs = [
  {
    question: 'Vadodara mein best chocolate cake kaun si hai?',
    answer: 'CakeConnection ka Chocolate Truffle Vadodara ka sabse popular cake hai — dark chocolate ganache, soft eggless sponge. Death by Chocolate bhi bahut pasand kiya jaata hai — triple chocolate layers. Dono same-day deliver hoti hain.',
  },
  {
    question: 'Kya chocolate cake 100% eggless hoti hai?',
    answer: 'Haan. CakeConnection ki poori chocolate range strictly eggless hai — Chocolate Truffle, Dark Fudge, Choco Lava, Black Forest sab. Pure vegetarians aur Jain community ke liye safe.',
  },
  {
    question: 'Chocolate cake Vadodara mein kitne time mein deliver hoti hai?',
    answer: '6 PM tak order karo — 2 se 4 ghante mein fresh chocolate cake doorstep pe. Alkapuri, Gotri jaise areas mein 90 minute express delivery bhi available hai.',
  },
];

export default function ChocolateCakeVadodara() {
  const varieties = [
    { name: 'Chocolate Truffle', desc: 'Dark chocolate ganache + soft eggless sponge — the classic', tag: '#1 Bestseller' },
    { name: 'Death by Chocolate', desc: 'Triple chocolate — sponge + ganache + chocolate chips', tag: 'Most Indulgent' },
    { name: 'Dark Chocolate Fudge', desc: 'Dense, rich, bittersweet fudge cake', tag: 'For Choco Lovers' },
    { name: 'Choco Lava / Molten', desc: 'Warm chocolate centre — best eaten fresh', tag: 'Warm Cake' },
    { name: 'Chocolate Black Forest', desc: 'Chocolate sponge + cherries + fresh cream', tag: 'Fusion' },
    { name: 'Chocolate Photo Cake', desc: 'Chocolate base with edible photo print', tag: 'Customisable' },
  ];

  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Home', url: BASE },
        { name: 'Chocolate Cake Vadodara', url: `${BASE}/chocolate-cake-vadodara` },
      ]} />
      <main className="py-10 bg-background-primary text-text-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm text-text-muted mb-6">
            <ol className="flex items-center gap-1.5">
              <li><Link href="/" className="hover:text-brand-rose">Home</Link></li>
              <li>›</li>
              <li className="text-text-primary font-medium">Chocolate Cake Vadodara</li>
            </ol>
          </nav>

          <h1 className="font-display text-4xl font-bold text-gradient-rose mb-5">
            Chocolate Cake Delivery in Vadodara
          </h1>

          <p className="text-lg text-text-secondary leading-relaxed mb-8">
            Vadodara ka <strong className="text-white">#1 bestseller</strong>: Chocolate Truffle — dark chocolate ganache,
            ultra-soft eggless sponge, same-day delivery. CakeConnection pe
            <strong className="text-brand-rose"> 6 chocolate varieties</strong> available hain, sab
            <strong className="text-white"> 100% eggless</strong>. Order by 6 PM → delivery in 2-4 hrs.
          </p>

          <Link href="/cakes" className="inline-block px-6 py-3 bg-brand-rose text-white font-semibold rounded-xl hover:bg-brand-rose/90 transition-colors mb-10">
            🍫 Order Chocolate Cake →
          </Link>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-white mb-4">Chocolate Cakes — Vadodara</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {varieties.map(v => (
                <div key={v.name} className="p-4 bg-surface-secondary border border-border-secondary rounded-xl">
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <span className="font-medium text-white text-sm">{v.name}</span>
                    <span className="text-xs bg-brand-rose/20 text-brand-rose px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap">{v.tag}</span>
                  </div>
                  <p className="text-xs text-text-muted">{v.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <AEOBlock
            title="Chocolate Cake Vadodara — FAQ"
            summary="CakeConnection Vadodara mein Chocolate Truffle, Dark Fudge, Choco Lava cakes same-day deliver karta hai. 100% eggless. Order by 6 PM, delivery in 2-4 hours. Free delivery above ₹999."
            faqs={chocolateFaqs}
            city="Vadodara"
            keywords={['chocolate cake vadodara', 'chocolate truffle vadodara', 'eggless chocolate cake']}
          />
        </div>
      </main>
    </>
  );
}
