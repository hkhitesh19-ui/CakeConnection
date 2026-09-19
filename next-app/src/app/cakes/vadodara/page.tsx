import { Metadata } from 'next';
import Link from 'next/link';
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema';
import AEOBlock from '@/components/seo/AEOBlock';
import { LOCALITIES, FREE_DELIVERY_ABOVE, MIDNIGHT_CHARGE, SAME_DAY_CUTOFF, MIDNIGHT_CUTOFF } from '@/data/localities';
import { siteConfig } from '@/config/site.config';

const BASE = 'https://cakeconnection.in';

export const metadata: Metadata = {
  title: 'Cake Delivery in Vadodara — Same Day & Midnight | CakeConnection',
  description: `Order fresh eggless cakes in Vadodara. Same-day delivery by ${SAME_DAY_CUTOFF}, within 2–4 hours. Midnight delivery by ${MIDNIGHT_CUTOFF} at Rs.${MIDNIGHT_CHARGE}. Birthday, designer & photo cakes. Free delivery above Rs.${FREE_DELIVERY_ABOVE}.`,
  keywords: ['cake delivery vadodara', 'online cake order vadodara', 'same day cake delivery vadodara', 'eggless cake vadodara', 'midnight cake delivery vadodara', 'birthday cake vadodara', 'cake shop vadodara'],
  alternates: {
    canonical: `${BASE}/cakes/vadodara`,
  },
  openGraph: {
    title: 'Cake Delivery in Vadodara — Same Day & Midnight | CakeConnection',
    description: 'Order fresh eggless cakes in Vadodara. Same-day delivery in 2–4 hours. Midnight delivery available.',
    url: `${BASE}/cakes/vadodara`,
    images: [{ url: `${BASE}/og-image.jpg`, width: 1200, height: 630, alt: 'Cake Delivery in Vadodara - CakeConnection' }],
  },
};

const cityFaqsForAEO = [
  {
    question: 'Vadodara mein same-day cake delivery ka cut-off time kya hai?',
    answer: `Vadodara mein same-day cake delivery ka cut-off ${SAME_DAY_CUTOFF} hai. ${SAME_DAY_CUTOFF} se pehle order karo toh usi din 2-4 ghante mein delivery milegi — Alkapuri, Gotri, Manjalpur, Akota aur baaki areas mein.`,
  },
  {
    question: 'CakeConnection Vadodara mein midnight cake delivery kaise karti hai?',
    answer: `Midnight delivery ke liye ${MIDNIGHT_CUTOFF} tak order karna hota hai. Delivery 11 PM se 12 AM ke beech hoti hai. Midnight delivery charge Rs.${MIDNIGHT_CHARGE} hai. Alkapuri, Gotri, Manjalpur, Fatehgunj, Old Padra Road mein midnight delivery available hai.`,
  },
  {
    question: 'Kya Vadodara mein eggless cake milti hai?',
    answer: 'Haan. CakeConnection ki poori cake range 100% eggless hai — Chocolate Truffle, Red Velvet, Black Forest, Butterscotch, Photo Cakes, Designer Cakes sab eggless hain. Strict egg-free environment mein banate hain.',
  },
  {
    question: 'Cake delivery Vadodara mein free hai?',
    answer: `Rs.${FREE_DELIVERY_ABOVE} se upar ke orders par free delivery milti hai. Us se kam orders par delivery charge nominal hai jo checkout par dikhayi deta hai.`,
  },
  {
    question: 'Vadodara mein photo cake kaise order karein?',
    answer: 'Photo cake order karne ke liye website par select karo aur WhatsApp par apni photo bhejo. Hum 100% edible photo print use karte hain. Same-day delivery available hai agar order subah tak ho.',
  },
  {
    question: 'CakeConnection Vadodara mein kaun kaun se areas mein deliver karta hai?',
    answer: 'Alkapuri, Gotri, Manjalpur, Akota, Sayajigunj, Vadiwadi, Fatehgunj, Karelibaug, Old Padra Road, Waghodia Road, Subhanpura, Diwalipura — 12 se zyada areas mein delivery hoti hai.',
  },
];

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'Bakery', 'FoodEstablishment'],
  '@id': `${BASE}/#localbusiness`,
  name: 'CakeConnection',
  image: `${BASE}/og-image.jpg`,
  telephone: siteConfig.contact.phone,
  url: BASE,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Exit Gate, GF9 RutuPlatina Complex, Eva Mall Rd',
    addressLocality: 'Manjalpur, Vadodara',
    addressRegion: 'Gujarat',
    postalCode: '390011',
    addressCountry: 'IN',
  },
  geo: { '@type': 'GeoCoordinates', latitude: 22.2700, longitude: 73.1855 },
  priceRange: 'Rs.Rs.',
  servesCuisine: 'Bakery',
  areaServed: LOCALITIES.map(l => ({ '@type': 'City', name: l.name })),
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
    opens: '09:00',
    closes: '23:59',
  },
  sameAs: [siteConfig.social.instagram, siteConfig.social.facebook].filter(Boolean),
};

const itemListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Cake Categories — Vadodara Delivery',
  numberOfItems: 6,
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Birthday Cakes Vadodara', url: `${BASE}/cakes?occasion=birthday` },
    { '@type': 'ListItem', position: 2, name: 'Designer Cakes Vadodara', url: `${BASE}/cakes?type=designer` },
    { '@type': 'ListItem', position: 3, name: 'Eggless Cakes Vadodara',  url: `${BASE}/eggless-cake-delivery-vadodara` },
    { '@type': 'ListItem', position: 4, name: 'Photo Cakes Vadodara',    url: `${BASE}/photo-cake-vadodara` },
    { '@type': 'ListItem', position: 5, name: 'Midnight Cakes Vadodara', url: `${BASE}/midnight-cake-delivery-vadodara` },
    { '@type': 'ListItem', position: 6, name: 'Flower Bouquets Vadodara',url: `${BASE}/flowers/vadodara` },
  ],
};

export default function CakesVadodaraPage() {
  return (
    <>
      {/* Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <BreadcrumbSchema items={[
        { name: 'Home', url: BASE },
        { name: 'Cakes', url: `${BASE}/cakes` },
        { name: 'Cake Delivery Vadodara', url: `${BASE}/cakes/vadodara` },
      ]} />

      <main className="py-10 bg-background-primary text-text-primary">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Breadcrumb Nav */}
          <nav className="text-sm text-text-muted mb-6" aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5">
              <li><Link href="/" className="hover:text-brand-rose transition-colors">Home</Link></li>
              <li><span aria-hidden>›</span></li>
              <li><Link href="/cakes" className="hover:text-brand-rose transition-colors">Cakes</Link></li>
              <li><span aria-hidden>›</span></li>
              <li className="text-text-primary font-medium">Cake Delivery Vadodara</li>
            </ol>
          </nav>

          {/* H1 */}
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-gradient-rose mb-6">
            Cake Delivery in Vadodara — Same Day &amp; Midnight
          </h1>

          {/* AEO: Answer-first paragraph — 40-60 words, factual, no fluff */}
          <p className="text-lg text-text-secondary leading-relaxed mb-8 max-w-3xl">
            CakeConnection delivers fresh 100% eggless cakes across Vadodara in 2–4 hours.
            Same-day delivery cut-off is {SAME_DAY_CUTOFF}. Midnight delivery (11 PM–12 AM) available in
            Alkapuri, Gotri, Manjalpur &amp; 5 more areas — order by {MIDNIGHT_CUTOFF}, charge ₹{MIDNIGHT_CHARGE}.
            Free delivery on orders above ₹{FREE_DELIVERY_ABOVE}.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3 mb-12">
            <Link href="/cakes" className="px-6 py-3 bg-brand-rose hover:bg-brand-rose/90 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-brand-rose/20">
              Order Cakes Online →
            </Link>
            <Link href={`https://wa.me/${siteConfig.contact.whatsapp}?text=Hi! I want to order a cake in Vadodara`} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors">
              WhatsApp Order
            </Link>
          </div>

          {/* Section: Delivery Areas Table */}
          <section className="mb-12">
            <h2 className="font-display text-2xl font-bold text-white mb-4">
              Vadodara Mein Cake Delivery — Area-wise ETA Table
            </h2>
            <p className="text-text-secondary mb-4">
              Neeche aapke area ka delivery time aur pincode dekh sakte hain:
            </p>
            <div className="overflow-x-auto rounded-xl border border-border-secondary">
              <table className="w-full text-sm text-left">
                <caption className="sr-only">Cake Delivery Areas in Vadodara with ETA and Pincode</caption>
                <thead className="bg-brand-rose/10 text-text-secondary">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Area</th>
                    <th className="px-4 py-3 font-semibold">Pincode</th>
                    <th className="px-4 py-3 font-semibold">Same-Day ETA</th>
                    <th className="px-4 py-3 font-semibold">Midnight</th>
                    <th className="px-4 py-3 font-semibold">Superfast</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-secondary">
                  {LOCALITIES.map((loc) => (
                    <tr key={loc.slug} className="hover:bg-surface-secondary/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-white">
                        <Link href={`/cakes/vadodara/${loc.slug}`} className="hover:text-brand-rose transition-colors">
                          {loc.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-text-muted font-mono">{loc.pincode}</td>
                      <td className="px-4 py-3 text-white">{loc.etaText}</td>
                      <td className="px-4 py-3">
                        {loc.midnightAvailable
                          ? <span className="text-green-400 font-medium">✓ Available</span>
                          : <span className="text-text-muted">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        {loc.expresAvailable
                          ? <span className="text-brand-rose font-medium">⚡ 1–2 hrs</span>
                          : <span className="text-text-muted">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-text-muted mt-2">Last updated: September 2026. ETA may vary during peak hours and festivals.</p>
          </section>

          {/* Section: Why CakeConnection */}
          <section className="mb-12">
            <h2 className="font-display text-2xl font-bold text-white mb-4">
              Vadodara Mein Cake Order Karna Kyun Easy Hai CakeConnection Pe?
            </h2>
            <p className="text-text-secondary mb-4">
              FNP, Bakingo, Winni jaise aggregators Vadodara mein physically present nahi hain —
              unki delivery outsourced hoti hai. CakeConnection Vadodara ka local business hai.
              Har cake fresh bana ke deliver hoti hai — koi pre-baked stock nahi.
            </p>
            <ul className="space-y-3 text-text-secondary">
              <li className="flex gap-3"><span className="text-brand-rose font-bold text-lg">✓</span><span><strong className="text-white">100% Eggless Guarantee:</strong> Strict egg-free environment — pure vegetarians ke liye safe.</span></li>
              <li className="flex gap-3"><span className="text-brand-rose font-bold text-lg">✓</span><span><strong className="text-white">Fresh-to-Order:</strong> Koi pre-made cakes nahi — har order pe fresh banta hai.</span></li>
              <li className="flex gap-3"><span className="text-brand-rose font-bold text-lg">✓</span><span><strong className="text-white">Same-Day Delivery:</strong> {SAME_DAY_CUTOFF} tak order karo, 2-4 ghante mein delivery.</span></li>
              <li className="flex gap-3"><span className="text-brand-rose font-bold text-lg">✓</span><span><strong className="text-white">Midnight Delivery:</strong> {MIDNIGHT_CUTOFF} tak order, delivery 11 PM–12 AM. Sirf ₹{MIDNIGHT_CHARGE} extra.</span></li>
              <li className="flex gap-3"><span className="text-brand-rose font-bold text-lg">✓</span><span><strong className="text-white">WhatsApp Ordering:</strong> Custom designs WhatsApp par discuss karo — quick aur personal service.</span></li>
              <li className="flex gap-3"><span className="text-brand-rose font-bold text-lg">✓</span><span><strong className="text-white">5,000+ Happy Customers:</strong> Vadodara ka trusted bakery — Manjalpur se serve kar rahe hain.</span></li>
            </ul>
          </section>

          {/* Section: Locality Links */}
          <section className="mb-12">
            <h2 className="font-display text-2xl font-bold text-white mb-4">
              Apne Area Mein Cake Delivery Details Dekho
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {LOCALITIES.map((loc) => (
                <Link
                  key={loc.slug}
                  href={`/cakes/vadodara/${loc.slug}`}
                  className="p-3 rounded-xl bg-surface-secondary border border-border-secondary hover:border-brand-rose hover:bg-brand-rose/5 transition-all group text-center"
                >
                  <div className="font-medium text-white group-hover:text-brand-rose transition-colors text-sm">{loc.name}</div>
                  <div className="text-xs text-text-muted mt-0.5">{loc.etaText} delivery</div>
                </Link>
              ))}
            </div>
          </section>

          {/* AEO Block */}
          <AEOBlock
            title="Cake Delivery Vadodara — Saare Sawaalon Ke Jawab"
            summary={`CakeConnection Vadodara mein 100% eggless cakes 2-4 ghante mein deliver karta hai. Same-day cut-off ${SAME_DAY_CUTOFF}, midnight cut-off ${MIDNIGHT_CUTOFF} (Rs.${MIDNIGHT_CHARGE} extra). Free delivery above Rs.${FREE_DELIVERY_ABOVE}. 12 Vadodara areas covered.`}
            faqs={cityFaqsForAEO}
            city="Vadodara"
            keywords={['cake delivery vadodara', 'eggless cake vadodara', 'midnight delivery vadodara', 'same day cake vadodara']}
          />

          {/* Shop CTA */}
          <div className="text-center mt-12 py-10 bg-surface-secondary rounded-2xl border border-border-secondary">
            <h2 className="font-display text-2xl font-bold text-white mb-3">Ready to Order?</h2>
            <p className="text-text-secondary mb-6">Vadodara mein fresh cake deliver karo — aaj hi!</p>
            <Link href="/cakes" className="inline-block px-8 py-4 bg-brand-rose hover:bg-brand-rose/90 text-white font-bold rounded-xl transition-colors text-lg shadow-lg shadow-brand-rose/30">
              Browse All Cakes →
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
