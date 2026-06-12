import { siteConfig } from '@/config/site.config';

export function generateProductSchema(product: {
  name: string;
  description: string;
  image: string;
  price: string;
  sku: string;
  inStock: boolean;
  rating?: number;
  reviewCount?: number;
}) {
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.image,
    "description": product.description,
    "sku": product.sku,
    "brand": {
      "@type": "Brand",
      "name": siteConfig.name
    },
    ...(product.rating && product.reviewCount ? {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": product.rating,
        "reviewCount": product.reviewCount
      }
    } : {}),
    "offers": {
      "@type": "Offer",
      "url": window.location.href,
      "priceCurrency": "USD",
      "price": product.price,
      "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "itemCondition": "https://schema.org/NewCondition"
    }
  };
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

export function generateReviewSchema(review: {
  author: string;
  datePublished: string;
  rating: number;
  text: string;
  itemName: string;
}) {
  return {
    "@context": "https://schema.org/",
    "@type": "Review",
    "itemReviewed": {
      "@type": "Product",
      "name": review.itemName
    },
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": review.rating,
      "bestRating": "5"
    },
    "author": {
      "@type": "Person",
      "name": review.author
    },
    "datePublished": review.datePublished,
    "reviewBody": review.text
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
}

export function generateLocalBusinessSchema(city: string = "Vadodara") {
  return {
    "@context": "https://schema.org",
    "@type": "Bakery",
    "name": `${siteConfig.name} - ${city}`,
    "image": `${siteConfig.url}/og-image.jpg`,
    "@id": `${siteConfig.url}/delivery/${city.toLowerCase()}`,
    "url": `${siteConfig.url}/delivery/${city.toLowerCase()}`,
    "telephone": "+91-9876543210",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Main Market Road",
      "addressLocality": city,
      "addressRegion": "GJ",
      "postalCode": "390001",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 22.3072,
      "longitude": 73.1812
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "08:00",
      "closes": "23:00"
    },
    "sameAs": [
      "https://www.facebook.com/cakeconnection",
      "https://www.instagram.com/cakeconnection"
    ]
  };
}
