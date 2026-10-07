import { Metadata } from 'next';
import Link from 'next/link';
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema';
import AEOBlock from '@/components/seo/AEOBlock';

const BASE = 'https://cakeconnection.in';

export const metadata: Metadata = {
  title: '1st Birthday Cake in Vadodara — First Birthday Delivery | CakeConnection',
  description: 'Order special 1st birthday cakes in Vadodara. Custom smash cakes, theme cakes, photo cakes for first birthday. 100% eggless, safe for babies. Same-day delivery. Free above ₹999.',
  keywords: ['1st birthday cake vadodara', 'first birthday cake vadodara', 'smash cake vadodara', 'baby first birthday cake vadodara', 'one year birthday cake vadodara'],
  alternates: { canonical: `${BASE}/1st-birthday-cake-vadodara` },
};

const firstBdayFaqs = [
  {
    question: 'Baby ke first birthday ke liye konsi cake best hai Vadodara mein?',
    answer: 'First birthday ke liye Smash Cake + Display Cake combo sabse popular hai. Smash cake (small, 500g) baby ke liye — woh hath se tode. Display cake (1kg+) guests ke liye cutting. Dono 100% eggless, baby-safe ingredients.',
  },
  {
    question: 'Kya 1st birthday cake baby ke liye safe hai?',
    answer: 'Haan. CakeConnection ki sabhi cakes 100% eggless hain — no egg, no allergens. First birthday cakes specifically minimal artificial colour ke saath banate hain. Baby-safe frosting available hai. FSSAI certified kitchen.',
  },
  {
    question: 'First birthday cake pe name aur age number lag sakta hai?',
    answer: 'Bilkul! "Happy 1st Birthday [Baby Name]" message free mein likhte hain. Number 1 candle bhi available hai. Custom theme (Disney, rainbow, floral) discuss karo WhatsApp pe.',
  },
  {
    question: 'Smash cake alag se order ho sakti hai Vadodara mein?',
    answer: 'Haan! Small smash cake (250g-500g) alag se order kar sakte ho. Isko baby ke haath se todne ke liye design kiya jaata hai — soft sponge, minimal decoration. Main cake ke saath ya alag deliver hoti hai.',
  },
];

export default function FirstBirthdayCakeVadodara() {
  const cakeOptions = [
    { name: 'Smash Cake (250g)', desc: 'Baby ke haath se todne ke liye — classic first birthday moment', tag: 'Baby Special' },
    { name: 'Smash + Display Combo', desc: 'Small cake for baby + big cake for guests — most popular', tag: 'Most Popular' },
    { name: 'Photo First Birthday Cake', desc: 'Baby ki photo edible print pe — memorable keepsake', tag: 'Photo Cake' },
    { name: 'Rainbow Layer Cake', desc: '5 colourful layers — rainbow theme for first birthday', tag: 'Theme Cake' },
    { name: 'Teddy Bear Fondant', desc: 'Cute teddy bear design — kids love it', tag: 'Designer' },
    { name: 'Floral Garden Cake', desc: 'Pastel flowers — elegant and Pinterest-worthy', tag: 'Designer' },
  ];

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: BASE },
          { name: '1st Birthday Cake Vadodara', url: `${BASE}/1st-birthday-cake-vadodara` },
        ]}
      />
      <main className="py-10 bg-background-primary text-text-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm text-text-muted mb-6">
            <ol className="flex items-center gap-1.5">
              <li><Link href="/" className="hover:text-brand-rose">Home</Link></li>
              <li>›</li>
              <li className="text-text-primary font-medium">1st Birthday Cake Vadodara</li>
            </ol>
          </nav>

          <h1 className="font-display text-4xl font-bold text-gradient-rose mb-5">
            1st Birthday Cake in Vadodara — Special First Birthday
          </h1>

          <p className="text-lg text-text-secondary leading-relaxed mb-8">
            Baby ka pehla birthday ek baar aata hai. CakeConnection Vadodara mein
            <strong className="text-white"> 100% eggless, baby-safe</strong> first birthday cakes deliver karta hai.
            Smash cakes, photo cakes, theme cakes — same-day delivery by <strong className="text-brand-rose">6 PM</strong> order pe.
            Free delivery above ₹999.
          </p>

          <div className="flex flex-wrap gap-3 mb-10">
            <Link href="/cakes" className="px-6 py-3 bg-brand-rose text-white font-semibold rounded-xl hover:bg-brand-rose/90 transition-colors">
              🎈 Order 1st Birthday Cake →
            </Link>
          </div>

          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold text-white mb-4">First Birthday Cake Options</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {cakeOptions.map(cake => (
                <div key={cake.name} className="p-4 bg-surface-secondary border border-border-secondary rounded-xl">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="font-medium text-white text-sm">{cake.name}</span>
                    <span className="text-xs bg-brand-rose/20 text-brand-rose px-2 py-0.5 rounded-full shrink-0">{cake.tag}</span>
                  </div>
                  <p className="text-xs text-text-muted">{cake.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-10 p-5 bg-surface-secondary border border-brand-rose/20 rounded-2xl">
            <h2 className="font-display text-xl font-bold text-white mb-3">🍰 Smash Cake + Display Cake Combo Kya Hai?</h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              First birthday ka sabse popular trend: <strong className="text-white">2 cakes order karo.</strong>
              <br /><br />
              <strong className="text-brand-rose">Smash Cake (500g):</strong> Baby ke liye — woh hath se torta hai, photos mein bahut cute lagta hai.<br />
              <strong className="text-brand-rose">Display Cake (1-2kg):</strong> Guests ke liye proper cutting — decorated beautifully.
              <br /><br />
              Dono ek saath deliver hoti hain. Same-day available.
            </p>
          </section>

          <AEOBlock
            title="First Birthday Cake Vadodara — Sawaal Jawab"
            summary="CakeConnection Vadodara mein 100% eggless first birthday cakes same-day deliver karta hai. Smash cakes, photo cakes, theme cakes. Baby-safe ingredients. Order by 6 PM. Free delivery above ₹999."
            faqs={firstBdayFaqs}
            city="Vadodara"
          />
        </div>
      </main>
    </>
  );
}
