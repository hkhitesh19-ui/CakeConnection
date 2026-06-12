import { Metadata } from 'next'
import FAQSchema from '@/components/schema/FAQSchema'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import ProductListings from '@/components/seo/ProductListings'
import { Container } from '@/components/ui'

export const metadata: Metadata = {
  title: 'Same Day Cake Delivery in Vadodara | Delivered within 3 Hours',
  description: 'Need urgent cake delivery in Vadodara? Order fresh eggless cakes, chocolates, and flowers online with same-day express delivery within 3 hours. Handcrafted and delicious.',
  alternates: {
    canonical: 'https://cakeconnection.in/same-day-cake-delivery-vadodara',
  },
  openGraph: {
    title: 'Same Day Cake Delivery Vadodara | CakeConnection',
    description: 'Express cake delivery in Vadodara within 3 hours.',
    url: 'https://cakeconnection.in/same-day-cake-delivery-vadodara',
    images: [{ url: '/images/hero-cake.png', width: 1200, height: 630 }],
  },
}

const faqs = [
  {
    question: "How fast is your same-day cake delivery in Vadodara?",
    answer: "We offer express delivery within 3 hours of confirming your order. Our live bakery handles production quickly to guarantee freshness."
  },
  {
    question: "Is there any extra charge for same-day delivery?",
    answer: "Standard same-day delivery during daytime slots has no extra charge above the normal shipping fee. Premium slots like midnight or fixed-time delivery may carry an additional nominal charge."
  },
  {
    question: "Can I cancel a same-day order?",
    answer: "Since same-day cakes are immediately baked and prepared upon order confirmation, cancellations are not accepted. However, scheduling changes can be requested if production hasn't started."
  },
  {
    question: "What is the last time I can order for same-day cake delivery?",
    answer: "You can place same-day cake orders until 9 PM in Vadodara. Orders placed after 9 PM are scheduled for next-day morning delivery by 10 AM."
  },
  {
    question: "Which areas in Vadodara get same-day cake delivery?",
    answer: "We deliver same-day to 500+ pincodes including Manjalpur, Alkapuri, Fatehgunj, Gotri, Vasna, Karelibaug, Nizampura, Makarpura, Akota, and all major Vadodara areas."
  }
]

export default function SameDayCakeDeliveryVadodara() {
  return (
    <>
      <FAQSchema faqs={faqs} />
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://cakeconnection.in' },
        { name: 'Same Day Cake Delivery Vadodara', url: 'https://cakeconnection.in/same-day-cake-delivery-vadodara' },
      ]} />
      
      <main className="py-12 bg-background-primary text-text-primary">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-gradient-rose text-center mb-8">
              Same Day Cake Delivery in Vadodara
            </h1>
            
            <div className="p-6 rounded-2xl bg-surface-secondary border border-border-secondary mb-12 text-lg leading-relaxed text-text-secondary">
              <p>
                Forgot a birthday or celebrating last minute? CakeConnection offers premium same-day cake delivery services across Vadodara. 
                Get 100% fresh, eggless cakes delivered straight to your doorstep within 3 hours. Order from our extensive collection of classic and gourmet flavors today.
              </p>
            </div>

            <ProductListings category="delivery" />

            <section className="my-16 p-8 rounded-2xl bg-surface-secondary/50 border border-border-secondary/40">
              <h2 className="font-display text-2xl font-bold text-white mb-6">
                How to Order Same Day Cake in Vadodara
              </h2>
              <ol className="space-y-4 text-text-secondary">
                <li className="flex gap-3"><span className="font-bold text-brand-rose">1.</span><span>Browse cakes and select your favourite flavor and design</span></li>
                <li className="flex gap-3"><span className="font-bold text-brand-rose">2.</span><span>Choose today's date and select a 3-hour delivery time slot</span></li>
                <li className="flex gap-3"><span className="font-bold text-brand-rose">3.</span><span>Add your custom message (free) and confirm your address</span></li>
                <li className="flex gap-3"><span className="font-bold text-brand-rose">4.</span><span>Pay securely via UPI, card, or net banking</span></li>
                <li className="flex gap-3"><span className="font-bold text-brand-rose">5.</span><span>Fresh cake baked and delivered to your door within 3 hours</span></li>
              </ol>
            </section>

            <section className="my-12 p-8 rounded-2xl bg-brand-rose/[0.02] border border-brand-rose/10 text-center">
              <h2 className="font-display text-2xl font-bold text-white mb-4">
                Same Day Delivery Areas in Vadodara
              </h2>
              <p className="text-text-secondary leading-relaxed max-w-2xl mx-auto">
                Express same-day delivery available in Manjalpur, Alkapuri, Fatehgunj, 
                Gotri, Vasna, Karelibaug, Nizampura, Makarpura, Akota, Waghodia Road, 
                Harni, Subhanpura, and 500+ pincodes across Vadodara.
              </p>
            </section>

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
          </div>
        </Container>
      </main>
    </>
  )
}
