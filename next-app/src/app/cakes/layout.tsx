import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Premium Cakes | Same Day Delivery',
  description: 'Order premium handcrafted cakes online in Vadodara — Chocolate Truffle, Red Velvet, Black Forest & more. Free delivery on orders above ₹999.',
  keywords: ['cakes in vadodara', 'birthday cakes', 'chocolate cake vadodara', 'red velvet cake vadodara', 'order cake online vadodara', 'eggless cake vadodara', 'same day cake delivery vadodara'],
  openGraph: {
    title: 'Premium Cakes in Vadodara | Same Day Delivery',
    description: 'Order premium handcrafted cakes online in Vadodara.',
    url: 'https://cakeconnection.in/cakes',
    images: ['https://cakeconnection.in/images/cakes-category.jpg'],
  }
};

export default function CakesLayout({ children }: { children: React.ReactNode }) {
  // Add CollectionPage Schema
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Premium Cakes in Vadodara",
    "description": "Order premium handcrafted cakes online in Vadodara.",
    "url": "https://cakeconnection.in/cakes",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {children}
    </>
  );
}
