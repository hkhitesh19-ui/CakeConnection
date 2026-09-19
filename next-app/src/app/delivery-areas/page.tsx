import { Metadata } from 'next';
import Link from 'next/link';
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema';
import { LOCALITIES, FREE_DELIVERY_ABOVE, MIDNIGHT_CHARGE, SAME_DAY_CUTOFF, MIDNIGHT_CUTOFF } from '@/data/localities';

const BASE = 'https://cakeconnection.in';

export const metadata: Metadata = {
  title: 'Cake Delivery Areas in Vadodara — Pincode & ETA List | CakeConnection',
  description: `CakeConnection delivers cakes to 12+ areas in Vadodara. Check your pincode, ETA, and midnight delivery availability. Same-day cut-off ${SAME_DAY_CUTOFF}. Free delivery above Rs.${FREE_DELIVERY_ABOVE}.`,
  alternates: { canonical: `${BASE}/delivery-areas` },
};

export default function DeliveryAreasPage() {
  const midnightAreas = LOCALITIES.filter(l => l.midnightAvailable);
  const expressAreas = LOCALITIES.filter(l => l.expresAvailable);

  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Home', url: BASE },
        { name: 'Delivery Areas', url: `${BASE}/delivery-areas` },
      ]} />

      <main className="py-10 bg-background-primary text-text-primary">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          <h1 className="font-display text-4xl font-bold text-gradient-rose mb-4">
            Cake Delivery Areas in Vadodara
          </h1>

          <p className="text-lg text-text-secondary leading-relaxed mb-8 max-w-3xl">
            CakeConnection delivers cakes to {LOCALITIES.length} areas in Vadodara.
            Same-day delivery in 90 min to 3 hours (order by {SAME_DAY_CUTOFF}).
            Midnight delivery in {midnightAreas.length} areas — order by {MIDNIGHT_CUTOFF}, charge Rs.{MIDNIGHT_CHARGE}.
            Free delivery on orders above Rs.{FREE_DELIVERY_ABOVE}.
          </p>

          <section className="mb-12">
            <h2 className="font-display text-2xl font-bold text-white mb-4">Complete Delivery Area List</h2>
            <div className="overflow-x-auto rounded-xl border border-border-secondary">
              <table className="w-full text-sm">
                <caption className="sr-only">Cake Delivery Areas in Vadodara — ETA, Pincode, Midnight Availability</caption>
                <thead className="bg-brand-rose/10">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-text-secondary">Area</th>
                    <th className="px-4 py-3 text-left font-semibold text-text-secondary">Pincode</th>
                    <th className="px-4 py-3 text-left font-semibold text-text-secondary">Same-Day ETA</th>
                    <th className="px-4 py-3 text-left font-semibold text-text-secondary">Midnight (Rs.{MIDNIGHT_CHARGE})</th>
                    <th className="px-4 py-3 text-left font-semibold text-text-secondary">Superfast</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-secondary">
                  {LOCALITIES.map((loc) => (
                    <tr key={loc.slug} className="hover:bg-surface-secondary/50">
                      <td className="px-4 py-3 font-medium">
                        <Link href={`/cakes/vadodara/${loc.slug}`} className="text-brand-rose hover:underline">
                          {loc.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-text-muted font-mono">{loc.pincode}</td>
                      <td className="px-4 py-3 text-white">{loc.etaText}</td>
                      <td className="px-4 py-3">
                        {loc.midnightAvailable
                          ? <span className="text-green-400">Yes</span>
                          : <span className="text-text-muted">No</span>}
                      </td>
                      <td className="px-4 py-3">
                        {loc.expresAvailable
                          ? <span className="text-brand-rose">1-2 hrs</span>
                          : <span className="text-text-muted">No</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-text-muted mt-2">Last updated: September 2026. ETA may vary during festivals and peak hours.</p>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-xl font-bold text-white mb-3">
              Midnight Delivery Available Areas ({midnightAreas.length})
            </h2>
            <p className="text-text-secondary mb-3">Order by {MIDNIGHT_CUTOFF} — delivery at 11 PM–12 AM | Charge: Rs.{MIDNIGHT_CHARGE}</p>
            <div className="flex flex-wrap gap-2">
              {midnightAreas.map(loc => (
                <Link key={loc.slug} href={`/cakes/vadodara/${loc.slug}`}
                  className="px-3 py-2 bg-surface-secondary border border-border-secondary rounded-lg text-sm text-white hover:border-brand-rose transition-colors">
                  {loc.name} ({loc.pincode})
                </Link>
              ))}
            </div>
          </section>

          <section className="mb-10">
            <h2 className="font-display text-xl font-bold text-white mb-3">
              Superfast 1–2 Hour Delivery Areas ({expressAreas.length})
            </h2>
            <div className="flex flex-wrap gap-2">
              {expressAreas.map(loc => (
                <Link key={loc.slug} href={`/cakes/vadodara/${loc.slug}`}
                  className="px-3 py-2 bg-surface-secondary border border-border-secondary rounded-lg text-sm text-white hover:border-brand-rose transition-colors">
                  {loc.name} ({loc.pincode})
                </Link>
              ))}
            </div>
          </section>

          <div className="text-center py-8 bg-surface-secondary rounded-2xl border border-border-secondary">
            <p className="text-text-secondary mb-4">Apne area mein cake order karo abhi!</p>
            <Link href="/cakes" className="inline-block px-8 py-4 bg-brand-rose text-white font-bold rounded-xl hover:bg-brand-rose/90 transition-colors">
              Order Cake Online →
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
