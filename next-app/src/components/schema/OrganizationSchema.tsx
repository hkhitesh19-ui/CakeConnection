import React from 'react'

export default function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://cakeconnection.in/#organization",
        "name": "CakeConnection",
        "url": "https://cakeconnection.in",
        "logo": {
          "@type": "ImageObject",
          "url": "https://cakeconnection.in/logo.png",
          "width": 300,
          "height": 174
        },
        "description": "Vadodara's trusted online bakery for 100% eggless cakes, flowers, and gifts. Same-day delivery within 3 hours.",
        "telephone": "+917203824012",
        "email": "info@cakeconnection.in",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Exit Gate, GF9 RutuPlatina Complex, Eva Mall Rd",
          "addressLocality": "Manjalpur",
          "addressRegion": "Gujarat",
          "postalCode": "390011",
          "addressCountry": "IN"
        },
        "areaServed": ["Vadodara", "Surat", "Vadodara"],
        "sameAs": [
          "https://www.zomato.com/vadodara/cake-connection-live-cake-manjalpur",
          "https://www.facebook.com/cakeconnection",
          "https://www.instagram.com/cakeconnection"
        ],
        "priceRange": "₹₹",
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
          "opens": "09:00",
          "closes": "23:59"
        }
      },
      {
        "@type": ["LocalBusiness", "Bakery", "FoodEstablishment"],
        "@id": "https://cakeconnection.in/#localbusiness",
        "name": "CakeConnection",
        "image": "https://cakeconnection.in/storefront.jpg",
        "telephone": "+917203824012",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Exit Gate, GF9 RutuPlatina Complex, Eva Mall Rd",
          "addressLocality": "Manjalpur, Vadodara",
          "addressRegion": "Gujarat",
          "postalCode": "390011",
          "addressCountry": "IN"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 22.2700,
          "longitude": 73.1855
        },
        "url": "https://cakeconnection.in",
        "servesCuisine": "Bakery",
        "paymentAccepted": "Cash, Credit Card, UPI, Net Banking",
        "currenciesAccepted": "INR"
      },
      {
        "@type": "WebSite",
        "@id": "https://cakeconnection.in/#website",
        "url": "https://cakeconnection.in",
        "name": "CakeConnection",
        "publisher": { "@id": "https://cakeconnection.in/#organization" },
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://cakeconnection.in/search?q={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        }
      }
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
