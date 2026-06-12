import { Metadata } from 'next'
import FAQSchema from '@/components/schema/FAQSchema'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import { Container } from '@/components/ui'

export const metadata: Metadata = {
  title: 'Frequently Asked Questions (FAQ) | CakeConnection Vadodara',
  description: 'Find answers to common questions about cake delivery speed, locations, payment methods, eggless guarantees, and customization options at CakeConnection Vadodara.',
  alternates: {
    canonical: 'https://cakeconnection.in/faq',
  },
}

const faqs = [
  {
    question: "How fast is cake delivery in Vadodara?",
    answer: "CakeConnection delivers fresh cakes within 3 hours across Vadodara. We bake each cake to order so that it reaches you fresh and delicious."
  },
  {
    question: "Do you deliver cakes to all areas of Vadodara?",
    answer: "Yes, we deliver to all major areas including Manjalpur, Alkapuri, Fatehgunj, Gotri, Waghodia Road, Vasna, Karelibaug, Nizampura, and more, covering 500+ pincodes."
  },
  {
    question: "What is the minimum order for cake delivery?",
    answer: "Our minimum order size starts at 500 grams (0.5kg) for cakes. We also deliver cupcakes, chocolates, and flowers without any high minimums."
  },
  {
    question: "Are your cakes really 100% eggless?",
    answer: "Yes, all our cakes and bakery products are 100% eggless. We maintain a completely egg-free environment to cater to vegetarians."
  },
  {
    question: "Can I order a custom cake in Vadodara?",
    answer: "Yes, we customize designer cakes, photo cakes, and multi-tier cakes. Share your ideas with us on WhatsApp (+91 7203824012), and we'll bake it for you."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major UPI platforms (GPay, PhonePe, Paytm), Credit/Debit cards, Net Banking, and select international payment methods."
  },
  {
    question: "Do you deliver cakes outside Vadodara?",
    answer: "Yes, we deliver to Surat and Vadodara as well. NRI customers can place international orders via our CCAvenue payment gateway at cakeconnection.in."
  },
  {
    question: "Is midnight cake delivery available in Vadodara?",
    answer: "Yes, midnight delivery at 12:00 AM sharp is available for birthday surprises in Vadodara. Book at least 6 hours in advance to confirm the midnight slot."
  },
  {
    question: "How do I order a photo cake in Vadodara?",
    answer: "Send your photo on WhatsApp to +91 7203824012, choose your cake size (minimum 500g), confirm the design and price, and pay advance. Fresh photo cake delivered same day."
  },
  {
    question: "Can I track my cake delivery?",
    answer: "Yes, you will receive WhatsApp updates when your order is confirmed, when baking starts, and when it is out for delivery. Our delivery partner will also call before arrival."
  }
]

export default function FAQPage() {
  return (
    <>
      <FAQSchema faqs={faqs} />
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://cakeconnection.in' },
        { name: 'FAQ', url: 'https://cakeconnection.in/faq' },
      ]} />
      
      <main className="py-12 bg-background-primary text-text-primary">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-gradient-rose text-center mb-6">
              Frequently Asked Questions
            </h1>
            
            <p className="text-center text-text-secondary text-lg mb-12 max-w-2xl mx-auto">
              Answers to common questions about cake delivery, eggless guarantee, 
              custom orders, payment, and delivery areas in Vadodara.
            </p>

            <h2 className="font-display text-2xl font-bold text-white mb-6">
              Cake Delivery Questions
            </h2>
            
            <div className="space-y-6">
              {faqs.map((faq, i) => (
                <article key={i} className="p-6 rounded-2xl bg-surface-secondary border border-border-secondary">
                  <h3 className="text-xl font-semibold text-white mb-3">{faq.question}</h3>
                  <p className="text-text-secondary leading-relaxed">{faq.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </Container>
      </main>
    </>
  )
}
