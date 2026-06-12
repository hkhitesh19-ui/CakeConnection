import { Metadata } from 'next'
import FAQSchema from '@/components/schema/FAQSchema'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import ProductListings from '@/components/seo/ProductListings'
import { Container } from '@/components/ui'

export const metadata: Metadata = {
  title: 'Birthday Cake Delivery in Vadodara | Same Day | CakeConnection',
  description: 'Order fresh birthday cakes in Vadodara online. 50+ designs, eggless, custom message, same day delivery within 3 hours. Best cake designs for boys, girls, adults.',
  alternates: {
    canonical: 'https://cakeconnection.in/birthday-cake-vadodara',
  },
  openGraph: {
    title: 'Birthday Cake Delivery Vadodara | CakeConnection',
    description: 'Fresh birthday cakes delivered same day in Vadodara.',
    url: 'https://cakeconnection.in/birthday-cake-vadodara',
    images: [{ url: '/images/hero-cake.png', width: 1200, height: 630 }],
  },
}

const faqs = [
  {
    question: "Do you offer same-day birthday cake delivery in Vadodara?",
    answer: "Yes, CakeConnection offers express same-day birthday cake delivery across Vadodara. Order online, and we will bake it fresh and deliver within 3 hours."
  },
  {
    question: "Can I customize the design of my birthday cake?",
    answer: "Absolutely! We specialize in custom designer cakes. You can share your reference design or theme with us on WhatsApp (+91 7203824012), and our chefs will make it exactly as you want."
  },
  {
    question: "Are birthday cakes eggless?",
    answer: "Yes, all our birthday cakes are 100% eggless and vegetarian-friendly, made with clean ingredients in a completely hygienic environment."
  },
  {
    question: "Can I send a birthday cake at midnight?",
    answer: "Yes, we support midnight delivery slots so you can surprise your loved ones right at 12:00 AM. Please book your slot at least 6 hours in advance."
  }
]

export default function BirthdayCakeVadodara() {
  return (
    <>
      <FAQSchema faqs={faqs} />
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://cakeconnection.in' },
        { name: 'Birthday Cake Vadodara', url: 'https://cakeconnection.in/birthday-cake-vadodara' },
      ]} />
      
      <main className="py-12 bg-background-primary text-text-primary">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-gradient-rose text-center mb-8">
              Birthday Cake Delivery in Vadodara
            </h1>
            
            <div className="p-6 rounded-2xl bg-surface-secondary border border-border-secondary mb-12 text-lg leading-relaxed text-text-secondary">
              <p>
                Celebrate special birthdays with CakeConnection's premium cake delivery service in Vadodara. 
                We offer a wide collection of designer, theme, photo, and customized birthday cakes in 15+ rich flavors. 
                Enjoy same-day express delivery within 3 hours or surprise them with a midnight delivery slot. 100% fresh and eggless.
              </p>
            </div>

            <ProductListings category="birthday" />

            <section className="my-16 p-8 rounded-2xl bg-surface-secondary/50 border border-border-secondary/40">
              <h2 className="font-display text-2xl font-bold text-white mb-6">Birthday Cake Customizations</h2>
              <ul className="grid sm:grid-cols-2 gap-4 text-text-secondary">
                <li className="flex items-start gap-2">✓ <span className="font-medium text-white">Customized Photo Cakes</span> with edible inks</li>
                <li className="flex items-start gap-2">✓ <span className="font-medium text-white">Designer Theme Cakes</span> (superhero, cartoon, makeup, etc.)</li>
                <li className="flex items-start gap-2">✓ <span className="font-medium text-white">Multi-tier cakes</span> for grand celebrations</li>
                <li className="flex items-start gap-2">✓ <span className="font-medium text-white">Custom messages</span> and card greetings</li>
              </ul>
            </section>

            <section className="my-12 p-8 rounded-2xl bg-brand-rose/[0.02] border border-brand-rose/10 text-center">
              <h2 className="font-display text-2xl font-bold text-white mb-4">
                Birthday Cake Delivery Areas in Vadodara
              </h2>
              <p className="text-text-secondary leading-relaxed max-w-2xl mx-auto">
                We deliver birthday cakes to Manjalpur, Alkapuri, Fatehgunj, Gotri, 
                Waghodia Road, Karelibaug, Vasna, Makarpura, Nizampura, Subhanpura, 
                Harni, Akota, and all major areas of Vadodara. 500+ pincodes covered.
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
