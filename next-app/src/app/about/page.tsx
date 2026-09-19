import { Metadata } from 'next'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import { Container } from '@/components/ui'

export const metadata: Metadata = {
  title: 'About CakeConnection | Vadodara\'s Online Eggless Bakery',
  description: 'Learn about CakeConnection, Vadodara\'s leading online eggless bakery. Founded in Manjalpur, we have served over 5000+ happy customers with fresh cakes, flowers, and gifts.',
  alternates: {
    canonical: 'https://cakeconnection.in/about',
  },
}

export default function AboutPage() {
  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://cakeconnection.in' },
        { name: 'About Us', url: 'https://cakeconnection.in/about' },
      ]} />
      
      <main className="py-12 bg-background-primary text-text-primary">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-gradient-rose text-center mb-8">
              About CakeConnection
            </h1>
            
            <section className="space-y-6 text-text-secondary text-lg leading-relaxed mb-12">
              <p>
                CakeConnection is Vadodara's trusted online bakery shop specializing in 100% eggless cakes, fresh flowers, and premium gift combos. 
                Founded with a mission to bring delight and ease to celebrations, we deliver gourmet cakes to over 500+ pincodes in Vadodara, Surat, and Baroda.
              </p>
              
              <h2 className="font-display text-2xl font-bold text-white mt-8 mb-4">Our Story</h2>
              <p>
                What started as a small local bakery in Manjalpur, Vadodara has grown into a leading online delivery service. 
                Over the years, we have served more than 5,000 satisfied customers. Every cake is crafted from scratch using high-quality ingredients by our expert pastry chefs.
              </p>

              <section className="my-10 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
                {[
                  { number: "5,000+", label: "Happy Customers" },
                  { number: "500+", label: "Pincodes Covered" },
                  { number: "100+", label: "Cake Varieties" },
                  { number: "3 Hrs", label: "Express Delivery" },
                ].map((stat) => (
                  <div key={stat.label} className="p-4 rounded-xl bg-surface-secondary border border-border-secondary">
                    <div className="font-display text-3xl font-bold text-gradient-rose">{stat.number}</div>
                    <div className="text-text-secondary text-sm mt-1">{stat.label}</div>
                  </div>
                ))}
              </section>

              <h2 className="font-display text-2xl font-bold text-white mt-8 mb-4">Our Core Values</h2>
              <ul className="list-disc pl-6 space-y-2 text-text-secondary">
                <li><strong className="text-white">100% Eggless Guarantee:</strong> We bake strictly in an egg-free environment to cater to pure vegetarians.</li>
                <li><strong className="text-white">Uncompromised Freshness:</strong> We do not pre-bake; every cake is made fresh to order.</li>
                <li><strong className="text-white">Prompt Delivery:</strong> Our reliable delivery network ensures your cake arrives in pristine condition within 3 hours.</li>
                <li><strong className="text-white">Customer Centricity:</strong> Custom designs are curated via WhatsApp to meet your exact specifications.</li>
              </ul>
            </section>
          </div>
        </Container>
      </main>
    </>
  )
}
