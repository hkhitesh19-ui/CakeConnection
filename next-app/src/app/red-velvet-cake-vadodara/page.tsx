import { Metadata } from 'next';
import Link from 'next/link';
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema';
import AEOBlock from '@/components/seo/AEOBlock';

const BASE = 'https://cakeconnection.in';

export const metadata: Metadata = {
  title: 'Red Velvet Cake Vadodara — Same Day Delivery | CakeConnection',
  description: 'Order fresh red velvet cake in Vadodara. Classic red velvet with cream cheese frosting — 100% eggless. Same-day delivery in 2-4 hours. Order by 6 PM.',
  keywords: ['red velvet cake vadodara', 'red velvet cake delivery vadodara', 'eggless red velvet vadodara'],
  alternates: { canonical: `${BASE}/red-velvet-cake-vadodara` },
};

const redVelvetFaqs = [
  {
    question: 'Vadodara mein red velvet cake same day milti hai?',
    answer: 'Haan. CakeConnection pe 6 PM tak order karo — red velvet cake 2-4 ghante mein deliver ho jaati hai.',
  },
  {
    question: 'CakeConnection ki red velvet cake kya 100% eggless hai?',
    answer: 'Haan, bilkul. Haari red velvet cake strictly eggless hai — same moist texture, same rich flavour bina egg ke. Pure vegetarians ke liye perfect.',
  },
  {
    question: 'Red velvet cake kis occasion ke liye best hai?',
    answer: "Red velvet birthdays, anniversaries, aur Valentine's Day ke liye Vadodara mein sabse popular choice hai. Red colour romantic aur festive dono feel deta hai.",
  },
];

export default function RedVelvetCakeVadodara() {
  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Home', url: BASE },
        { name: 'Red Velvet Cake Vadodara', url: `${BASE}/red-velvet-cake-vadodara` },
      ]} />
      <main className="py-10 bg-background-primary text-text-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm text-text-muted mb-6">
            <ol className="flex items-center gap-1.5">
              <li><Link href="/" className="hover:text-brand-rose">Home</Link></li>
              <li>›</li>
              <li className="text-text-primary font-medium">Red Velvet Cake Vadodara</li>
            </ol>
          </nav>
          <h1 className="font-display text-4xl font-bold text-gradient-rose mb-5">
            Red Velvet Cake in Vadodara — Same Day Delivery
          </h1>
          <p className="text-lg text-text-secondary leading-relaxed mb-8">
            Classic red velvet cake with cream cheese frosting — <strong className="text-white">100% eggless</strong>, same-day delivery in Vadodara.
            Order by <strong className="text-brand-rose">6 PM</strong> → fresh red velvet at your door in 2-4 hours.
            Birthdays, anniversaries, Valentine&apos;s Day — red velvet suits every occasion.
          </p>
          <Link href="/cakes" className="inline-block px-6 py-3 bg-brand-rose text-white font-semibold rounded-xl hover:bg-brand-rose/90 transition-colors mb-10">
            Order Red Velvet Cake →
          </Link>
          <section className="mb-10">
            <h2 className="font-display text-xl font-bold text-white mb-3">Red Velvet Sizes Available</h2>
            <div className="overflow-x-auto rounded-xl border border-border-secondary">
              <table className="w-full text-sm">
                <thead className="bg-brand-rose/10">
                  <tr>
                    <th className="px-4 py-3 text-left text-text-secondary font-semibold">Size</th>
                    <th className="px-4 py-3 text-left text-text-secondary font-semibold">Serves</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-secondary">
                  {[['500g (Half Kg)', '4-6 log'], ['1kg', '8-12 log'], ['1.5kg', '15-18 log'], ['2kg', '20-25 log']].map(([size, serves]) => (
                    <tr key={size} className="hover:bg-surface-secondary/50">
                      <td className="px-4 py-3 text-white font-medium">{size}</td>
                      <td className="px-4 py-3 text-text-secondary">{serves}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          <AEOBlock
            title="Red Velvet Cake Vadodara — FAQ"
            summary="Red velvet cake Vadodara mein CakeConnection se same-day order kar sakte hain. 100% eggless. Order by 6 PM, delivery 2-4 hours. Free delivery above ₹999."
            faqs={redVelvetFaqs}
            city="Vadodara"
          />
        </div>
      </main>
    </>
  );
}
