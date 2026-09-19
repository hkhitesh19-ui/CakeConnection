import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema';
import AEOBlock from '@/components/seo/AEOBlock';
import { LOCALITIES, getLocality, FREE_DELIVERY_ABOVE, MIDNIGHT_CHARGE, SAME_DAY_CUTOFF, MIDNIGHT_CUTOFF } from '@/data/localities';
import { siteConfig } from '@/config/site.config';

const BASE = 'https://cakeconnection.in';

type Props = { params: Promise<{ locality: string }> };

export async function generateStaticParams() {
  return LOCALITIES.map(l => ({ locality: l.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locality: localitySlug } = await params;
  const loc = getLocality(localitySlug);
  if (!loc) return { title: 'Not Found' };
  return {
    title: `Cake Delivery in ${loc.name}, Vadodara - Same Day in ${loc.etaText} | CakeConnection`,
    description: `Order fresh eggless cakes in ${loc.name}, Vadodara (${loc.pincode}). Delivery in ${loc.etaText}. ${loc.midnightAvailable ? 'Midnight delivery available. ' : ''}Birthday, designer, photo cakes. Free delivery above Rs.${FREE_DELIVERY_ABOVE}.`,
    keywords: [`cake delivery ${loc.name.toLowerCase()}`, `cake delivery ${loc.name.toLowerCase()} vadodara`, `${loc.pincode} cake delivery`, 'eggless cake vadodara', `birthday cake ${loc.name.toLowerCase()}`],
    alternates: { canonical: `${BASE}/cakes/vadodara/${loc.slug}` },
    openGraph: {
      title: `Cake Delivery in ${loc.name}, Vadodara - ${loc.etaText} Delivery`,
      description: `Fresh eggless cakes delivered to ${loc.name}, Vadodara in ${loc.etaText}.`,
      url: `${BASE}/cakes/vadodara/${loc.slug}`,
    },
  };
}

export default async function LocalityPage({ params }: Props) {
  const { locality: localitySlug } = await params;
  const loc = getLocality(localitySlug);
  if (!loc) notFound();

  const localityFaqs = [
    {
      question: `${loc.name} mein cake delivery ka time kitna lagta hai?`,
      answer: `${loc.name} (pincode ${loc.pincode}) mein same-day delivery approximately ${loc.etaText} mein hoti hai. ${SAME_DAY_CUTOFF} se pehle order karo.`,
    },
    {
      question: `${loc.name} mein midnight cake delivery available hai?`,
      answer: loc.midnightAvailable
        ? `Haan! ${loc.name} mein midnight delivery available hai. ${MIDNIGHT_CUTOFF} tak order karo, 11 PM-12 AM ke beech delivery hogi. Charge Rs.${MIDNIGHT_CHARGE} extra.`
        : `Abhi ${loc.name} mein midnight delivery available nahi hai. Same-day delivery ${SAME_DAY_CUTOFF} tak order par available hai.`,
    },
    {
      question: `${loc.name} ke liye cake delivery free hai?`,
      answer: `Rs.${FREE_DELIVERY_ABOVE} se upar ke orders par ${loc.name} mein free delivery milti hai. Chhote orders par nominal delivery charge apply hota hai.`,
    },
    {
      question: `${loc.name} mein kaun kaun si cakes popular hain?`,
      answer: `${loc.name} mein ${loc.popularFor.join(', ')} sabse zyada order hoti hain. Sab 100% eggless hain.`,
    },
  ];

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'Bakery'],
    name: 'CakeConnection',
    telephone: siteConfig.contact.phone,
    url: `${BASE}/cakes/vadodara/${loc.slug}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: `${loc.name}, Vadodara`,
      postalCode: loc.pincode,
      addressRegion: 'Gujarat',
      addressCountry: 'IN',
    },
    areaServed: { '@type': 'City', name: loc.name },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      <BreadcrumbSchema items={[
        { name: 'Home', url: BASE },
        { name: 'Cakes', url: `${BASE}/cakes` },
        { name: 'Vadodara', url: `${BASE}/cakes/vadodara` },
        { name: loc.name, url: `${BASE}/cakes/vadodara/${loc.slug}` },
      ]} />

      <main className="py-10 bg-background-primary text-text-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          <nav className="text-sm text-text-muted mb-6" aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5 flex-wrap">
              <li><Link href="/" className="hover:text-brand-rose">Home</Link></li>
              <li><span>›</span></li>
              <li><Link href="/cakes" className="hover:text-brand-rose">Cakes</Link></li>
              <li><span>›</span></li>
              <li><Link href="/cakes/vadodara" className="hover:text-brand-rose">Vadodara</Link></li>
              <li><span>›</span></li>
              <li className="text-text-primary font-medium">{loc.name}</li>
            </ol>
          </nav>

          <h1 className="font-display text-3xl sm:text-4xl font-bold text-gradient-rose mb-5">
            Cake Delivery in {loc.name}, Vadodara
          </h1>

          <p className="text-lg text-text-secondary leading-relaxed mb-8">
            CakeConnection delivers fresh 100% eggless cakes to{' '}
            <strong className="text-white">{loc.name}</strong> (pincode {loc.pincode})
            in approximately <strong className="text-brand-rose">{loc.etaText}</strong>.
            Order by {SAME_DAY_CUTOFF} for same-day delivery.
            {loc.midnightAvailable && ` Midnight delivery also available - order by ${MIDNIGHT_CUTOFF}.`}
            {' '}Free delivery on orders above Rs.{FREE_DELIVERY_ABOVE}.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            {[
              { label: 'Pincode', value: loc.pincode },
              { label: 'Same-Day ETA', value: loc.etaText },
              { label: 'Midnight Delivery', value: loc.midnightAvailable ? 'Available' : 'Not Available' },
              { label: 'Superfast (1-2 hr)', value: loc.expresAvailable ? 'Available' : 'Not Available' },
            ].map(item => (
              <div key={item.label} className="p-4 bg-surface-secondary rounded-xl border border-border-secondary text-center">
                <div className="text-sm text-text-muted mb-1">{item.label}</div>
                <div className="font-bold text-white text-sm">{item.value}</div>
              </div>
            ))}
          </div>

          <section className="mb-10">
            <h2 className="font-display text-xl font-bold text-white mb-3">
              {loc.name} Mein Popular Cakes
            </h2>
            <p className="text-text-secondary mb-4">
              {loc.name} ke customers mein{' '}
              <strong className="text-white">{loc.popularFor.join(', ')}</strong> sabse zyada popular hain.
              Sab 100% eggless hain aur same-day delivery available hai.
            </p>
            <Link href="/cakes" className="inline-block px-6 py-3 bg-brand-rose hover:bg-brand-rose/90 text-white font-semibold rounded-xl transition-colors">
              All Cakes Dekho
            </Link>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-xl font-bold text-white mb-3">
              {loc.name} Delivery Information
            </h2>
            <div className="overflow-x-auto rounded-xl border border-border-secondary">
              <table className="w-full text-sm">
                <tbody className="divide-y divide-border-secondary">
                  <tr>
                    <th className="px-4 py-3 text-text-muted font-medium text-left w-1/3">Area</th>
                    <td className="px-4 py-3 text-white">{loc.name}, Vadodara</td>
                  </tr>
                  <tr>
                    <th className="px-4 py-3 text-text-muted font-medium text-left">Pincode</th>
                    <td className="px-4 py-3 text-white font-mono">{loc.pincode}</td>
                  </tr>
                  <tr>
                    <th className="px-4 py-3 text-text-muted font-medium text-left">Same-Day ETA</th>
                    <td className="px-4 py-3 text-white">{loc.etaText}</td>
                  </tr>
                  <tr>
                    <th className="px-4 py-3 text-text-muted font-medium text-left">Same-Day Cut-Off</th>
                    <td className="px-4 py-3 text-white">{SAME_DAY_CUTOFF}</td>
                  </tr>
                  <tr>
                    <th className="px-4 py-3 text-text-muted font-medium text-left">Midnight Delivery</th>
                    <td className="px-4 py-3">
                      {loc.midnightAvailable
                        ? <span className="text-green-400 font-medium">Available - Order by {MIDNIGHT_CUTOFF} | Rs.{MIDNIGHT_CHARGE} extra</span>
                        : <span className="text-text-muted">Not available</span>}
                    </td>
                  </tr>
                  <tr>
                    <th className="px-4 py-3 text-text-muted font-medium text-left">Free Delivery</th>
                    <td className="px-4 py-3 text-white">On orders above Rs.{FREE_DELIVERY_ABOVE}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-text-muted mt-2">Last updated: September 2026</p>
          </section>

          <AEOBlock
            title={`${loc.name} Cake Delivery - Sawal Jawab`}
            summary={`CakeConnection ${loc.name}, Vadodara (${loc.pincode}) mein fresh eggless cakes ${loc.etaText} mein deliver karta hai. Same-day cut-off ${SAME_DAY_CUTOFF}. Free delivery above Rs.${FREE_DELIVERY_ABOVE}.`}
            faqs={localityFaqs}
            city={loc.name}
          />

          <section className="mt-10">
            <h2 className="font-display text-lg font-bold text-white mb-4">Doosre Vadodara Areas</h2>
            <div className="flex flex-wrap gap-2">
              {LOCALITIES.filter(l => l.slug !== loc.slug).map(other => (
                <Link key={other.slug} href={`/cakes/vadodara/${other.slug}`}
                  className="px-3 py-1.5 bg-surface-secondary border border-border-secondary rounded-lg text-sm text-text-secondary hover:text-brand-rose hover:border-brand-rose transition-colors">
                  {other.name}
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}