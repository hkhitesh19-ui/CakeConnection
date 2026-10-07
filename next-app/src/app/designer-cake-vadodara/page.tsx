import { Metadata } from 'next';
import Link from 'next/link';
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema';
import AEOBlock from '@/components/seo/AEOBlock';

const BASE = 'https://cakeconnection.in';

export const metadata: Metadata = {
  title: 'Custom & Theme Cakes in Vadodara | Best Designer Bakery',
  description: 'Get customized theme cakes for kids & special events in Vadodara. 100% eggless fondant & cream designer cakes freshly baked on order.',
  keywords: ['custom cakes vadodara', 'designer theme cakes vadodara', 'customized cake vadodara', 'fondant cake vadodara', 'theme cake vadodara', 'pinata cake vadodara'],
  alternates: { canonical: `${BASE}/designer-cake-vadodara` },
};

const designerFaqs = [
  {
    question: 'Vadodara mein custom designer cake kaise order karein?',
    answer: 'CakeConnection.in pe designer cake section mein jaao ya WhatsApp pe (+917203824012) reference photo bhejo. Hum aapki requirements discuss karenge — theme, colours, message — aur usi din deliver karenge agar subah tak order ho.',
  },
  {
    question: 'Pinata cake Vadodara mein milti hai?',
    answer: 'Haan! Pinata cake (surprise inside cake) Vadodara mein available hai. Chocolates ya candies andar bharte hain — birthday pe surprising aur fun. Same-day order available.',
  },
  {
    question: 'Designer cake ke liye advance booking kitni jaldi karni chahiye?',
    answer: 'Simple custom designs 1 din advance mein ho jaate hain. Complex fondant cakes (wedding, elaborate themes) ke liye 2-3 din advance booking recommended hai. WhatsApp pe discuss karo.',
  },
];

export default function DesignerCakeVadodara() {
  const themes = [
    'Unicorn', 'Barbie / Doll', 'Superhero', 'Princess', 'Cars / Racing',
    'Floral Garden', 'Galaxy / Space', 'Football', 'Wedding Tier', 'Pinata Cake',
    'Donut Tower', 'Minion', 'Paw Patrol', 'Frozen / Elsa', 'Boss Baby',
  ];

  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Home', url: BASE },
        { name: 'Designer Cake Vadodara', url: `${BASE}/designer-cake-vadodara` },
      ]} />
      <main className="py-10 bg-background-primary text-text-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm text-text-muted mb-6">
            <ol className="flex items-center gap-1.5">
              <li><Link href="/" className="hover:text-brand-rose">Home</Link></li>
              <li>›</li>
              <li className="text-text-primary font-medium">Designer Cake Vadodara</li>
            </ol>
          </nav>
          <h1 className="font-display text-4xl font-bold text-gradient-rose mb-5">
            Customized &amp; Theme Cake Delivery in Vadodara
          </h1>
          <p className="text-lg text-text-secondary leading-relaxed mb-8">
            Custom designer cakes Vadodara mein — <strong className="text-white">fondant, theme, pinata, tier cakes</strong> — sab
            <strong className="text-white"> 100% eggless</strong>.
            WhatsApp pe reference photo bhejo, hum exact design banate hain.
            Simple designs same-day available. Complex cakes 2-3 din advance book karo.
          </p>
          <div className="flex flex-wrap gap-3 mb-10">
            <Link href="/cakes" className="px-6 py-3 bg-brand-rose text-white font-semibold rounded-xl hover:bg-brand-rose/90 transition-colors">
              🎨 Order Designer Cake →
            </Link>
          </div>
          <section className="mb-10">
            <h2 className="font-display text-xl font-bold text-white mb-3">Available Themes</h2>
            <div className="flex flex-wrap gap-2">
              {themes.map(t => (
                <span key={t} className="px-3 py-1.5 bg-surface-secondary border border-border-secondary rounded-lg text-sm text-white">{t}</span>
              ))}
            </div>
            <p className="text-xs text-text-muted mt-2">Custom theme bhi bana sakte hain — WhatsApp pe discuss karo</p>
          </section>
          <AEOBlock
            title="Designer Cake Vadodara — FAQ"
            summary="CakeConnection Vadodara mein custom designer, fondant, theme, pinata cakes banata hai. 100% eggless. WhatsApp pe design bhejo. Simple designs same-day. Complex cakes 2-3 din advance."
            faqs={designerFaqs}
            city="Vadodara"
          />
        </div>
      </main>
    </>
  );
}
