import React from 'react'

export default function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Bakery", "Store", "LocalBusiness"],
        "@id": "https://cakeconnection.in/#bakery",
        "name": "Cake Connection - Live Cake & Online Delivery",
        "url": "https://cakeconnection.in",
        "logo": {
          "@type": "ImageObject",
          "url": "https://cakeconnection.in/logo.png",
          "width": 300,
          "height": 174
        },
        "image": "https://cakeconnection.in/og-image.jpg",
        "description": "Vadodara's premier FSSAI Certified, 100% Pure Veg & Eggless Live Cake bakery and online gift store. Established in 2013 under Head Chef Mr. Bipul Singh's expertise. Shop open till 12:00 AM Midnight for live cake self-pickup, with express delivery across Vadodara.",
        "foundingDate": "2013",
        "founder": {
          "@type": "Person",
          "name": "Mr. Bipul Singh",
          "jobTitle": "Head Chef"
        },
        "telephone": "+917203824012",
        "priceRange": "₹₹",
        "currenciesAccepted": "INR",
        "paymentAccepted": "Cash, Credit Card, UPI, Google Pay, PhonePe, Net Banking",
        "servesCuisine": ["Cakes", "Desserts", "Bakery"],
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "GF9 RutuPlatina Complex, Besides Duliram Pendawala, Eva Mall Rd, Manjalpur",
          "addressLocality": "Vadodara",
          "addressRegion": "Gujarat",
          "postalCode": "390011",
          "addressCountry": "IN"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 22.2687,
          "longitude": 73.1972
        },
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
            "opens": "09:00",
            "closes": "23:59"
          }
        ],
        "areaServed": [
          { "@type": "City", "name": "Vadodara" },
          { "@type": "AdministrativeArea", "name": "Manjalpur" },
          { "@type": "AdministrativeArea", "name": "Alkapuri" },
          { "@type": "AdministrativeArea", "name": "Gotri" },
          { "@type": "AdministrativeArea", "name": "Waghodia Road" },
          { "@type": "AdministrativeArea", "name": "Akota" },
          { "@type": "AdministrativeArea", "name": "Sayajigunj" }
        ],
        "sameAs": [
          "https://www.zomato.com/vadodara/cake-connection-live-cake-manjalpur",
          "https://www.facebook.com/cakeconnection",
          "https://www.instagram.com/cakeconnection",
          "https://share.google/5KW2Z1K0uQxAx1VWp"
        ],
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Cakes & Flowers Delivery Services",
          "itemListElement": [
            {
              "@type": "OfferCatalog",
              "name": "Live Birthday Cakes",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Product",
                    "name": "Fresh Live Chocolate Cake"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Product",
                    "name": "Customized Theme Cake"
                  }
                }
              ]
            },
            {
              "@type": "OfferCatalog",
              "name": "Flower Bouquets & Gifts",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Product",
                    "name": "Fresh Red Rose Bouquet Delivery"
                  }
                }
              ]
            }
          ]
        }
      },
      {
        "@type": "FAQPage",
        "@id": "https://cakeconnection.in/#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Which is the best live cake shop in Vadodara for same-day delivery?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Cake Connection in Manjalpur, Vadodara is highly rated for fresh live cakes and customized theme cakes with same-day and express doorstep delivery across Vadodara."
            }
          },
          {
            "@type": "Question",
            "name": "Can I order midnight cake and flower bouquet delivery in Vadodara?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, Cake Connection offers midnight online delivery for fresh cakes, rose bouquets, and combo gifts across all areas in Vadodara through cakeconnection.in."
            }
          },
          {
            "@type": "Question",
            "name": "How fast can Cake Connection deliver live birthday cakes in Vadodara?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Cake Connection prepares fresh live cakes on order and delivers within 1 to 2 hours anywhere in Vadodara including Manjalpur, Alkapuri, and Gotri."
            }
          }
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://cakeconnection.in/#website",
        "url": "https://cakeconnection.in",
        "name": "Cake Connection",
        "publisher": { "@id": "https://cakeconnection.in/#bakery" },
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
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
