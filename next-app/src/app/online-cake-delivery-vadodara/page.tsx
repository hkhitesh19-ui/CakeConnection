import { Metadata } from 'next'
import FAQSchema from '@/components/schema/FAQSchema'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import ProductListings from '@/components/seo/ProductListings'
import { Container } from '@/components/ui'

export const metadata: Metadata = {
  title: 'Online Cake Delivery in Vadodara | Order Cakes Online | CakeConnection',
  description: 'Order cakes online in Vadodara with CakeConnection. Best selection of eggless cakes, custom designs, and gourmet flavors. Hand-delivered fresh within 3 hours.',
  alternates: {
    canonical: 'https://cakeconnection.in/online-cake-delivery-vadodara',
  },
  openGraph: {
    title: 'Online Cake Delivery Vadodara | CakeConnection',
    description: 'Order cakes online in Vadodara for same-day delivery.',
    url: 'https://cakeconnection.in/online-cake-delivery-vadodara',
    images: [{ url: '/images/hero-cake.png', width: 1200, height: 630 }],
  },
}

const faqs = [
  {
    question: "How do I order a cake online in Vadodara?",
    answer: "Browse our menu, select your preferred cake, choose the size (500g, 1kg, 2kg+), pick a delivery date & time slot, write a custom message for the cake, and checkout securely. You can also order directly via WhatsApp."
  },
  {
    question: "Do you accept international orders?",
    answer: "Yes, we accept international credit cards and payment methods. You can order a cake online from anywhere in the world and have it delivered to your family or friends in Vadodara."
  },
  {
    question: "Are there customizable greeting options?",
    answer: "Yes, every cake comes with a complimentary greeting card. You can write your personalized message during checkout, and we will write it nicely on a card and send it with the cake."
  }
]

export default function OnlineCakeDeliveryVadodara() {
  return (
    <>
      <FAQSchema faqs={faqs} />
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://cakeconnection.in' },
        { name: 'Online Cake Delivery Vadodara', url: 'https://cakeconnection.in/online-cake-delivery-vadodara' },
      ]} />
      
      <main className="py-12 bg-background-primary text-text-primary">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-gradient-rose text-center mb-8">
              Online Cake Delivery in Vadodara
            </h1>
            
            <div className="p-6 rounded-2xl bg-surface-secondary border border-border-secondary mb-12 text-lg leading-relaxed text-text-secondary">
              <p>
                Ordering cakes online is now quick and easy. CakeConnection is your local premium bakery shop, serving fresh and flavorful eggless cakes all across Vadodara. 
                Whether it's a birthday, wedding, anniversary, or a corporate event, order online for a hassle-free delivery experience.
              </p>
            </div>

            <ProductListings category="online" />

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
