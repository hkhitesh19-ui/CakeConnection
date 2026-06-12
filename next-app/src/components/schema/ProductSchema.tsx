import React from 'react'

interface ProductSchemaProps {
  name: string
  description: string
  image: string
  price: number
  currency?: string
  sku: string
  slug: string
  rating?: number
  reviewCount?: number
  inStock?: boolean
}

export default function ProductSchema({
  name, description, image, price, currency = 'INR',
  sku, slug, rating, reviewCount, inStock = true
}: ProductSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": name,
    "description": description,
    "image": image,
    "sku": sku,
    "brand": {
      "@type": "Brand",
      "name": "CakeConnection"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://cakeconnection.in/product/${slug}`,
      "priceCurrency": currency,
      "price": price,
      "priceValidUntil": new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
      "availability": inStock 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "CakeConnection"
      }
    },
    ...(rating && reviewCount ? {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": rating,
        "reviewCount": reviewCount,
        "bestRating": 5,
        "worstRating": 1
      }
    } : {})
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
