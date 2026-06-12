import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Beautiful Flower Bouquets | Online Delivery',
  description: 'Best online flower delivery in Vadodara. Fresh roses, orchids, and lilies for anniversaries, birthdays, and special occasions. Same-day flower delivery.',
  keywords: ['online flower delivery in vadodara', 'best florist in vadodara', 'best flowershop in vadodara', 'same day flower delivery vadodara', 'roses delivery vadodara'],
  openGraph: {
    title: 'Beautiful Flower Bouquets in Vadodara | Online Delivery',
    description: 'Best online flower delivery in Vadodara. Fresh roses, orchids, and lilies.',
    url: 'https://cakeconnection.in/flowers',
    images: ['https://cakeconnection.in/images/flowers-category.jpg'],
  }
};

export default function FlowersLayout({ children }: { children: React.ReactNode }) {
  // Add CollectionPage Schema
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Beautiful Flower Bouquets in Vadodara",
    "description": "Best online flower delivery in Vadodara.",
    "url": "https://cakeconnection.in/flowers",
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
