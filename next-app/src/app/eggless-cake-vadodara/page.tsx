import { Metadata } from 'next'
import FAQSchema from '@/components/schema/FAQSchema'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import ProductListings from '@/components/seo/ProductListings'
import { Container } from '@/components/ui'

export const metadata: Metadata = {
  title: 'Eggless Cake Delivery in Vadodara | Same Day | CakeConnection',
  description: 'Order 100% eggless cakes online in Vadodara. Same-day delivery in 3 hours. Birthday, anniversary, designer eggless cakes. Fresh & custom made.',
  alternates: {
    canonical: 'https://cakeconnection.in/eggless-cake-vadodara',
  },
  openGraph: {
    title: 'Eggless Cake Delivery Vadodara | CakeConnection',
    description: '100% eggless cakes delivered same day in Vadodara.',
    url: 'https://cakeconnection.in/eggless-cake-vadodara',
    images: [{ url: '/images/hero-cake.png', width: 1200, height: 630 }],
  },
}

const faqs = [
  {
    question: "Do you deliver eggless cakes in Vadodara?",
    answer: "Yes, CakeConnection delivers 100% eggless cakes across all areas of Vadodara including Manjalpur, Alkapuri, Fatehgunj, Gotri, Waghodia Road, and 500+ pincodes. Same-day delivery available within 3 hours of ordering."
  },
  {
    question: "Are all CakeConnection cakes eggless?",
    answer: "Yes, all cakes at CakeConnection are 100% eggless. We specialize in eggless baking and do not use eggs in any of our products, making them suitable for vegetarians."
  },
  {
    question: "What flavors of eggless cakes are available?",
    answer: "We offer eggless cakes in 15+ flavors including chocolate, red velvet, black forest, butterscotch, truffle, pineapple, vanilla, strawberry, mango, fruit, white forest, Kit Kat, and Oreo."
  },
  {
    question: "Can I order a custom eggless cake in Vadodara?",
    answer: "Yes, we make custom eggless cakes for any occasion. Share your design, theme, message or photo on WhatsApp at +91 7203824012 and we'll create it fresh."
  },
  {
    question: "What is the minimum order for eggless cake delivery?",
    answer: "Minimum order starts from 500g cakes. We deliver from a single kg cake to multi-tier wedding cakes across Vadodara."
  }
]

export default function EgglessCakeVadodara() {
  return (
    <>
      <FAQSchema faqs={faqs} />
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://cakeconnection.in' },
        { name: 'Eggless Cake Vadodara', url: 'https://cakeconnection.in/eggless-cake-vadodara' },
      ]} />
      
      <main className="py-12 bg-background-primary text-text-primary">
        <Container>
          <div className="max-w-4xl mx-auto">
            {/* H1 — Primary keyword */}
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-gradient-rose text-center mb-8">
              Eggless Cake Delivery in Vadodara
            </h1>
            
            {/* AEO Answer Block — 60-80 words answering "What is this page?" */}
            <div className="p-6 rounded-2xl bg-surface-secondary border border-border-secondary mb-12 text-lg leading-relaxed text-text-secondary">
              <p>
                CakeConnection delivers 100% fresh eggless cakes across Vadodara within 3 hours. 
                Choose from 15+ flavors — chocolate, red velvet, black forest, truffle, and more. 
                Order birthday cakes, anniversary cakes, photo cakes, or custom designer cakes online. 
                All products are vegetarian-friendly and made fresh to order. 
                Serving 500+ pincodes in Vadodara, Surat, and Vadodara.
              </p>
            </div>

            {/* Product Listings Component */}
            <ProductListings category="eggless" />

            {/* Why Section — GEO Trust Signals */}
            <section className="my-16 p-8 rounded-2xl bg-surface-secondary/50 border border-border-secondary/40">
              <h2 className="font-display text-2xl font-bold text-white mb-6">Why Choose CakeConnection for Eggless Cakes?</h2>
              <ul className="grid sm:grid-cols-2 gap-4 text-text-secondary">
                <li className="flex items-start gap-2">✓ <span className="font-medium text-white">100% eggless</span> — every product guaranteed</li>
                <li className="flex items-start gap-2">✓ <span className="font-medium text-white">Same-day delivery</span> in 3 hours</li>
                <li className="flex items-start gap-2">✓ <span className="font-medium text-white">5000+ happy customers</span> in Vadodara</li>
                <li className="flex items-start gap-2">✓ <span className="font-medium text-white">Custom designs</span> on WhatsApp</li>
                <li className="flex items-start gap-2">✓ <span className="font-medium text-white">International payments</span> accepted</li>
              </ul>
            </section>

            {/* FAQ Section — AEO Block */}
            <section className="my-16">
              <h2 className="font-display text-3xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>
              <div className="space-y-6">
                {faqs.map((faq, i) => (
                  <div key={i} className="p-6 rounded-xl bg-surface-secondary border border-border-secondary">
                    <h3 className="text-lg font-semibold text-white mb-2">{faq.question}</h3>
                    <p className="text-text-secondary leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Local Area Coverage — Local SEO */}
            <section className="my-12 p-8 rounded-2xl bg-brand-rose/[0.02] border border-brand-rose/10 text-center">
              <h2 className="font-display text-2xl font-bold text-white mb-4">Eggless Cake Delivery Areas in Vadodara</h2>
              <p className="text-text-secondary leading-relaxed max-w-2xl mx-auto">
                We deliver to Manjalpur, Alkapuri, Fatehgunj, Gotri, Waghodia Road, 
                Karelibaug, Vasna, Makarpura, Nizampura, Subhanpura, Harni, and all 
                major areas of Vadodara. Check pincode availability at checkout.
              </p>
            </section>
          </div>
        </Container>
      </main>
    </>
  )
}
