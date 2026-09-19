import { siteConfig } from '@/config/site.config';

export function generateProductSchema(product: {
  name: string;
  description: string;
  image: string;
  price: string;
  sku: string;
  inStock: boolean;
  url?: string;          // ✅ Accept URL as parameter (SSR-safe, no window)
  category?: string;
  slug?: string;
  rating?: number;
  reviewCount?: number;
}) {
  // ✅ SSR-safe URL — no window.location.href
  const productUrl = product.url
    || (product.category && product.slug
        ? `${siteConfig.url}/${product.category}/${product.slug}`
        : siteConfig.url);

  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.image,
    "description": product.description,
    "sku": product.sku,
    "brand": {
      "@type": "Brand",
      "name": "CakeConnection"
    },
    ...(product.rating && product.reviewCount ? {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": product.rating,
        "bestRating": "5",
        "reviewCount": product.reviewCount
      }
    } : {}),
    "offers": {
      "@type": "Offer",
      "url": productUrl,
      "priceCurrency": "INR",   // ✅ Fixed: INR for Indian business (was USD)
      "price": product.price,
      "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "itemCondition": "https://schema.org/NewCondition",
      "seller": {
        "@type": "Organization",
        "name": "CakeConnection"
      }
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
    "name": `CakeConnection`,
    "image": `${siteConfig.url}/og-image.jpg`,
    "@id": `${siteConfig.url}/#localbusiness`,
    "url": siteConfig.url,
    "telephone": siteConfig.contact.phone,  // ✅ Fixed: use siteConfig (was placeholder +91-9876543210)
    "priceRange": "₹₹",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Exit Gate, GF9 RutuPlatina Complex, Eva Mall Rd",
      "addressLocality": city,
      "addressRegion": "GJ",
      "postalCode": "390011",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 22.2700,
      "longitude": 73.1855
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday", "Tuesday", "Wednesday", "Thursday",
        "Friday", "Saturday", "Sunday"
      ],
      "opens": siteConfig.hours.open,
      "closes": siteConfig.hours.close
    },
    "sameAs": [
      siteConfig.social.instagram,
      siteConfig.social.facebook,
    ].filter(Boolean)
  };
}

