import { Metadata } from 'next';
import Link from 'next/link';
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema';
import AEOBlock from '@/components/seo/AEOBlock';

const BASE = 'https://cakeconnection.in';

export const metadata: Metadata = {
  title: 'Order Photo Cakes Online in Vadodara | Edible Picture Cakes',
  description: 'Print your favorite memories on cakes! Order 100% eggless edible photo cakes online in Vadodara with same-day home delivery.',
  keywords: ['photo cake online vadodara', 'edible picture cake vadodara', 'photo cake vadodara', 'custom photo cake vadodara', 'birthday photo cake vadodara'],
  alternates: { canonical: `${BASE}/photo-cake-vadodara` },
};

const photoCakeFaqs = [
  {
    question: 'Vadodara mein photo cake kaise order karein?',
    answer: 'CakeConnection.in pe jaao, photo cake category select karo, flavour aur size choose karo. Checkout ke baad WhatsApp pe apni photo bhejo (+917203824012). Hum 4 ghante mein deliver kar dete hain.',
  },
  {
    question: 'Photo cake ki photo kaise bhejni hai?',
    answer: 'Order place karne ke baad WhatsApp pe high-resolution photo bhejo. Selfie, couple photo, baby photo — koi bhi. 100% edible sugar sheet pe print hoti hai — safe to eat.',
  },
  {
    question: 'Kya photo cake Vadodara mein same day milti hai?',
    answer: 'Haan! 6 PM tak order karo aur photo WhatsApp pe bhejo — usi din 2-4 ghante mein deliver ho jaati hai. Subah 10 AM tak order karo toh best results milte hain customisation ke liye.',
  },
  {
    question: 'Photo cake mein kaun kaun se flavours available hain?',
    answer: 'Photo cake ki base mein Chocolate Truffle, Red Velvet, Black Forest, Butterscotch, Pineapple, aur Vanilla available hain — sab 100% eggless. Photo edible print upar lagti hai.',
  },
];

export default function PhotoCakeVadodara() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: BASE },
          { name: 'Photo Cake Vadodara', url: `${BASE}/photo-cake-vadodara` },
        ]}
      />
      <main className="py-10 bg-background-primary text-text-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm text-text-muted mb-6">
            <ol className="flex items-center gap-1.5">
              <li><Link href="/" className="hover:text-brand-rose">Home</Link></li>
              <li>›</li>
              <li className="text-text-primary font-medium">Photo Cake Vadodara</li>
            </ol>
          </nav>

          <h1 className="font-display text-4xl font-bold text-gradient-rose mb-5">
            Personalized Photo Cakes in Vadodara
          </h1>

          <p className="text-lg text-text-secondary leading-relaxed mb-8">
            Vadodara mein custom <strong className="text-white">photo cake</strong> same-day milti hai.
            Apni ya kisi ki bhi photo bhejo — <strong className="text-brand-rose">100% edible sugar sheet</strong> pe high-quality print.
            Order by <strong className="text-white">6 PM</strong>, delivery 2-4 hours mein. Sab flavours <strong className="text-white">100% eggless</strong>.
          </p>

          <div className="flex flex-wrap gap-3 mb-10">
            <Link href="/cakes" className="px-6 py-3 bg-brand-rose text-white font-semibold rounded-xl hover:bg-brand-rose/90 transition-colors">
              📸 Order Photo Cake →
            </Link>
          </div>

          {/* How it works */}
          <section className="mb-10">
            <h2 className="font-display text-xl font-bold text-white mb-4">Photo Cake Order Karne Ka Process</h2>
            <ol className="space-y-4">
              {[
                { step: '1', text: 'CakeConnection.in pe photo cake select karo — flavour aur size choose karo' },
                { step: '2', text: 'Checkout complete karo — order confirm ho jaayega' },
                { step: '3', text: 'WhatsApp pe photo bhejo (+917203824012) — high-resolution, clear photo' },
                { step: '4', text: 'Hum 100% edible sugar sheet pe print karke 2-4 ghante mein deliver karte hain' },
              ].map(item => (
                <li key={item.step} className="flex gap-4 items-start">
                  <span className="w-8 h-8 rounded-full bg-brand-rose text-white font-bold flex items-center justify-center shrink-0 text-sm">{item.step}</span>
                  <span className="text-text-secondary pt-1">{item.text}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* Available flavours */}
          <section className="mb-10">
            <h2 className="font-display text-xl font-bold text-white mb-3">Photo Cake Available Flavours</h2>
            <div className="flex flex-wrap gap-2">
              {['Chocolate Truffle', 'Red Velvet', 'Black Forest', 'Butterscotch', 'Pineapple', 'Vanilla', 'Strawberry'].map(f => (
                <span key={f} className="px-3 py-1.5 bg-surface-secondary border border-border-secondary rounded-lg text-sm text-white">{f}</span>
              ))}
            </div>
            <p className="text-xs text-text-muted mt-2">Sab flavours 100% eggless hain</p>
          </section>

          <AEOBlock
            title="Photo Cake Vadodara — FAQ"
            summary="CakeConnection Vadodara mein custom photo cakes same-day 2-4 ghante mein deliver karta hai. 100% edible photo print. Order by 6 PM. WhatsApp pe photo bhejo. Sab flavours eggless."
            faqs={photoCakeFaqs}
            city="Vadodara"
            keywords={['photo cake vadodara', 'edible photo cake', 'custom photo cake vadodara']}
          />
        </div>
      </main>
    </>
  );
}
