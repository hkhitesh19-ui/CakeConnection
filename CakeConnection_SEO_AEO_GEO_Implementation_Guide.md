# CakeConnection — Complete SEO + AEO + GEO Implementation Guide
## Next.js (next-app) | Beyond SEO Framework | AI-Powered

> **Stack:** Next.js (App Router) + TypeScript + Tailwind CSS v4 + Supabase + Zustand  
> **Target:** Vadodara, Gujarat, India  
> **Business:** Online Eggless Cake, Flower & Gift Delivery  
> **Goal:** Rank + appear in Google AI Overviews + ChatGPT/Perplexity citations

---

## PHASE 1 — FOUNDATION (Week 1-2) — Do First

### 1.1 Next.js Metadata Setup — `app/layout.tsx`

Every page ka SEO yahan se control hoga. Root layout mein base metadata set karo:

```tsx
// app/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://cakeconnection.in'),
  title: {
    template: '%s | CakeConnection Vadodara',
    default: 'Online Cake Delivery in Vadodara | Same Day | CakeConnection',
  },
  description: 'Order fresh eggless cakes, flowers & gifts online in Vadodara. Same-day delivery within 3 hours. Birthday, anniversary, designer cakes. 100% fresh guarantee.',
  keywords: ['cake delivery vadodara', 'eggless cake vadodara', 'online cake order vadodara', 'birthday cake vadodara', 'same day cake delivery'],
  authors: [{ name: 'CakeConnection', url: 'https://cakeconnection.in' }],
  creator: 'CakeConnection',
  publisher: 'CakeConnection',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://cakeconnection.in',
    siteName: 'CakeConnection',
    title: 'Online Cake Delivery in Vadodara | CakeConnection',
    description: 'Same-day eggless cake delivery in Vadodara. Fresh cakes, flowers & gifts.',
    images: [
      {
        url: '/og-image.jpg', // 1200x630px banner banana
        width: 1200,
        height: 630,
        alt: 'CakeConnection — Online Cake Delivery Vadodara',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Online Cake Delivery in Vadodara | CakeConnection',
    description: 'Same-day eggless cake delivery in Vadodara.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'k1iIk0gWj_4hbe-y6xqfTCU_8wLvJcGDs67kttncJYw', // existing GSC code
  },
  alternates: {
    canonical: 'https://cakeconnection.in',
  },
}
```

---

### 1.2 Sitemap — `app/sitemap.ts`

```ts
// app/sitemap.ts
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://cakeconnection.in'
  
  // Static pages
  const staticPages = [
    '', '/cakes', '/flowers', '/chocolates', '/combos', '/sweets',
    '/dry-fruits', '/fresh-fruits', '/personalized-gifts',
    '/birthday-cake-vadodara', '/anniversary-cake-vadodara',
    '/eggless-cake-vadodara', '/same-day-cake-delivery-vadodara',
    '/photo-cake-vadodara', '/designer-cake-vadodara',
    '/chocolate-cake-vadodara', '/red-velvet-cake-vadodara',
    '/about', '/contact', '/delivery-areas', '/faq',
  ].map(path => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.8,
  }))

  // TODO: Dynamic product pages from Supabase/MongoDB
  // const products = await getProducts()
  // const productPages = products.map(p => ({ url: `${baseUrl}/product/${p.slug}`, ... }))

  return [...staticPages]
}
```

---

### 1.3 Robots.txt — `app/robots.ts`

```ts
// app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/cart/', '/checkout/', '/my-account/', '/wp-admin/'],
    },
    sitemap: 'https://cakeconnection.in/sitemap.xml',
  }
}
```

---

## PHASE 2 — SCHEMA MARKUP (Week 1) — Entity SEO + GEO Foundation

Schema = AI systems ko samjhao "yeh kya hai, kahan hai, kitna trusted hai."

### 2.1 Sitewide JSON-LD — `components/schema/OrganizationSchema.tsx`

```tsx
// components/schema/OrganizationSchema.tsx
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
        "areaServed": ["Vadodara", "Surat", "Ahmedabad"],
        "sameAs": [
          "https://www.zomato.com/vadodara/cake-connection-live-cake-manjalpur",
          "https://www.facebook.com/cakeconnection",
          "https://www.instagram.com/cakeconnection"
          // Add all social/directory profiles
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
        "@type": "LocalBusiness",
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
        "hasMap": "https://maps.google.com/?cid=YOUR_GBP_CID",
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
```

**Use karo `app/layout.tsx` mein:**
```tsx
import OrganizationSchema from '@/components/schema/OrganizationSchema'
// Inside <head> or before </body>
<OrganizationSchema />
```

---

### 2.2 Product Schema — `components/schema/ProductSchema.tsx`

Har product page pe use karo:

```tsx
// components/schema/ProductSchema.tsx
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
```

---

### 2.3 FAQ Schema — `components/schema/FAQSchema.tsx`

AEO ke liye most important — Google "People Also Ask" mein aane ke liye:

```tsx
// components/schema/FAQSchema.tsx
interface FAQ {
  question: string
  answer: string
}

export default function FAQSchema({ faqs }: { faqs: FAQ[] }) {
  const schema = {
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
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
```

---

### 2.4 BreadcrumbList Schema — `components/schema/BreadcrumbSchema.tsx`

```tsx
// components/schema/BreadcrumbSchema.tsx
interface BreadcrumbItem {
  name: string
  url: string
}

export default function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
```

---

## PHASE 3 — LANDING PAGES (Week 2-3) — Main SEO Traffic Source

Ye pages Google aur AI search dono ke liye critical hain. Har page = dedicated URL, unique H1, FAQ, Schema.

### 3.1 Page Structure Template

Har landing page is format mein banana:

```tsx
// app/eggless-cake-vadodara/page.tsx (example)
import { Metadata } from 'next'
import FAQSchema from '@/components/schema/FAQSchema'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import ProductListings from '@/components/ProductListings'

export const metadata: Metadata = {
  title: 'Eggless Cake Delivery in Vadodara | Same Day | CakeConnection',
  description: 'Order 100% eggless cakes online in Vadodara. Same-day delivery in 3 hours. Birthday, anniversary, designer eggless cakes. Fresh & custom made.',
  alternates: {
    canonical: 'https://cakeconnection.in/eggless-cake-vadodara',
  },
  openGraph: {
    title: 'Eggless Cake Delivery Vadodara | CakeConnection',
    description: '100% eggless cakes delivered same day in Vadodara.',
    url: 'https://cakeconnection.in/eggless-cake-vadodara',
    images: [{ url: '/images/eggless-cake-vadodara.jpg', width: 1200, height: 630 }],
  },
}

const faqs = [
  {
    question: "Do you deliver eggless cakes in Vadodara?",
    answer: "Yes, CakeConnection delivers 100% eggless cakes across all areas of Vadodara including Manjalpur, Alkapuri, Fatehgunj, Gotri, Waghodia Road, and 500+ pincodes. Same-day delivery available within 3 hours of ordering."
  },
  {
    question: "Are all CakeConnection cakes eggless?",
    answer: "Yes, all cakes at CakeConnection are 100% eggless. We specialize in eggless baking and do not use eggs in any of our products, making them suitable for vegetarians."
  },
  {
    question: "What flavors of eggless cakes are available?",
    answer: "We offer eggless cakes in 15+ flavors including chocolate, red velvet, black forest, butterscotch, truffle, pineapple, vanilla, strawberry, mango, fruit, white forest, Kit Kat, and Oreo."
  },
  {
    question: "Can I order a custom eggless cake in Vadodara?",
    answer: "Yes, we make custom eggless cakes for any occasion. Share your design, theme, message or photo on WhatsApp at +91 7203824012 and we'll create it fresh."
  },
  {
    question: "What is the minimum order for eggless cake delivery?",
    answer: "Minimum order starts from 500g cakes. We deliver from a single kg cake to multi-tier wedding cakes across Vadodara."
  }
]

export default function EgglessCakeVadodara() {
  return (
    <>
      <FAQSchema faqs={faqs} />
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://cakeconnection.in' },
        { name: 'Eggless Cake Vadodara', url: 'https://cakeconnection.in/eggless-cake-vadodara' },
      ]} />
      
      <main>
        {/* H1 — Primary keyword — NEVER "Home" or empty */}
        <h1>Eggless Cake Delivery in Vadodara</h1>
        
        {/* AEO Answer Block — 60-80 words answering "What is this page?" */}
        <p>
          CakeConnection delivers 100% fresh eggless cakes across Vadodara within 3 hours. 
          Choose from 15+ flavors — chocolate, red velvet, black forest, truffle, and more. 
          Order birthday cakes, anniversary cakes, photo cakes, or custom designer cakes online. 
          All products are vegetarian-friendly and made fresh to order. 
          Serving 500+ pincodes in Vadodara, Surat, and Ahmedabad.
        </p>

        {/* Product Listings Component */}
        <ProductListings category="eggless" />

        {/* Why Section — GEO Trust Signals */}
        <section>
          <h2>Why Choose CakeConnection for Eggless Cakes?</h2>
          <ul>
            <li>100% eggless — every product guaranteed</li>
            <li>Same-day delivery in 3 hours</li>
            <li>5000+ happy customers</li>
            <li>Custom designs on WhatsApp</li>
            <li>International payments accepted (CCAvenue)</li>
          </ul>
        </section>

        {/* FAQ Section — AEO Block */}
        <section>
          <h2>Frequently Asked Questions</h2>
          {faqs.map((faq, i) => (
            <div key={i}>
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </div>
          ))}
        </section>

        {/* Local Area Coverage — Local SEO */}
        <section>
          <h2>Eggless Cake Delivery Areas in Vadodara</h2>
          <p>
            We deliver to Manjalpur, Alkapuri, Fatehgunj, Gotri, Waghodia Road, 
            Karelibaug, Vasna, Makarpura, Nizampura, Subhanpura, Harni, and all 
            major areas of Vadodara. Check pincode availability at checkout.
          </p>
        </section>
      </main>
    </>
  )
}
```

### 3.2 All Landing Pages to Create

| URL | Target Keyword | Priority |
|-----|----------------|----------|
| `/eggless-cake-vadodara` | eggless cake vadodara | P0 |
| `/birthday-cake-vadodara` | birthday cake vadodara | P0 |
| `/same-day-cake-delivery-vadodara` | same day cake delivery vadodara | P0 |
| `/anniversary-cake-vadodara` | anniversary cake vadodara | P1 |
| `/photo-cake-vadodara` | photo cake vadodara | P1 |
| `/designer-cake-vadodara` | designer cake vadodara | P1 |
| `/chocolate-cake-vadodara` | chocolate cake vadodara | P1 |
| `/custom-cake-vadodara` | custom cake vadodara | P2 |
| `/online-cake-delivery-vadodara` | online cake delivery vadodara | P0 |
| `/flower-delivery-vadodara` | flower delivery vadodara | P2 |
| `/delivery-areas` | cake delivery areas vadodara | P2 |
| `/about` | about cakeconnection vadodara | P1 |
| `/faq` | cake delivery faq vadodara | P1 |

---

## PHASE 4 — AEO CONTENT (Week 3) — Answer Engine Optimization

AI aur Google ko answers do — wo tumhara brand cite karenge.

### 4.1 Homepage AEO Blocks

Homepage mein ye sections add karo (visible content):

```tsx
// Homepage mein — Answer blocks visible content

// Block 1: Direct Answer to "best eggless cake vadodara"
<section id="about">
  <h2>Vadodara's Online Eggless Cake Shop</h2>
  <p>
    CakeConnection is Vadodara's trusted online bakery offering 100% eggless cakes, 
    flowers, and gifts. Founded in Manjalpur, we deliver fresh custom cakes to 
    500+ pincodes across Vadodara, Surat, and Ahmedabad. Same-day delivery within 
    3 hours, custom designs on WhatsApp, and international payment accepted.
  </p>
</section>

// Block 2: How It Works — Process AEO
<section id="how-it-works">
  <h2>How to Order Cake Online in Vadodara</h2>
  <ol>
    <li>Browse our cake collection or WhatsApp your design</li>
    <li>Select size, flavor, and delivery time slot</li>
    <li>Pay securely via UPI, card, or net banking</li>
    <li>Fresh cake delivered to your door within 3 hours</li>
  </ol>
</section>

// Block 3: Service Areas — Local AEO
<section id="delivery-areas">
  <h2>Cake Delivery Areas in Vadodara</h2>
  <p>We deliver to all major areas of Vadodara including Alkapuri, 
  Fatehgunj, Manjalpur, Gotri, Vasna, Karelibaug, Nizampura, Makarpura, 
  Waghodia Road, Harni, Subhanpura, Akota, and 500+ pincodes.</p>
</section>
```

### 4.2 FAQ Page — `/faq/page.tsx`

Ye page "People Also Ask" mein aayega:

```tsx
// Core questions to answer — all with 40-80 word direct answers
const allFAQs = [
  // Delivery
  "How fast is cake delivery in Vadodara?",
  "Do you deliver cakes to all areas of Vadodara?",
  "What is the minimum order for cake delivery?",
  "Can I track my cake delivery?",
  // Eggless
  "Are your cakes really 100% eggless?",
  "What eggless cake flavors are available?",
  // Custom
  "Can I order a custom cake in Vadodara?",
  "How do I order a photo cake online?",
  "How early do I need to order a custom cake?",
  // Payment
  "What payment methods do you accept?",
  "Do you accept international payments?",
  // Quality
  "Are the cakes fresh?",
  "Do you use preservatives?",
  // Occasions
  "Do you make wedding cakes in Vadodara?",
  "Can I order a cake for midnight delivery?",
]
```

---

## PHASE 5 — GEO (Week 3-4) — AI Citation Worthiness

GEO = AI systems aapko cite karein kyunki aap trustworthy + specific source ho.

### 5.1 About Page — Entity Page `/about/page.tsx`

```tsx
export const metadata: Metadata = {
  title: 'About CakeConnection — Vadodara\'s Online Eggless Bakery',
  description: 'CakeConnection is Vadodara\'s leading online eggless bakery. Founded in Manjalpur, serving 5000+ customers. Same-day delivery of cakes, flowers & gifts.',
}

// Content structure (visible page content):
// H1: About CakeConnection
// Para: Who we are (entity clarity)
// Section: Our Story (founding, location, mission)
// Section: What We Offer (products, services)
// Section: Service Areas (Vadodara, Surat, Ahmedabad)
// Section: Our Promise (eggless guarantee, freshness, delivery)
// Section: Customer Reviews (social proof)
// CTA: Order Now / WhatsApp
```

**Schema for About page:**
```tsx
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://cakeconnection.in/about/#founder",
  "name": "Founder Name", // Add actual founder name
  "jobTitle": "Founder",
  "worksFor": { "@id": "https://cakeconnection.in/#organization" },
  "url": "https://cakeconnection.in/about"
}
```

### 5.2 GEO Content Rules — Apply Everywhere

Har page pe GEO rules follow karo:

```
✅ DO:
- Specific numbers ("3 hours delivery", "500+ pincodes", "5000+ customers")
- Original claims backed by actual business data
- Named location ("Manjalpur, Vadodara")
- Founder/expert identity visible
- Trust proof (reviews, years in business, certifications)
- Comparison content ("Why choose us vs other bakeries")
- Fresh dates (updated content)

❌ DON'T:
- Generic "best quality guaranteed"
- Keyword stuffing
- Fake reviews or inflated numbers
- Copied competitor content
- Vague claims without proof
```

---

## PHASE 6 — TECHNICAL SEO (Week 1) — Next.js Specific

### 6.1 Image Optimization — `next.config.ts`

```ts
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    remotePatterns: [
      { protocol: 'https', hostname: 'cakeconnection.in' },
      // Add Supabase storage URL
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
  // Canonical URL
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ]
  },
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ]
  },
}

export default nextConfig
```

### 6.2 Always Use `next/image` for Product Images

```tsx
import Image from 'next/image'

// Product card example
<Image
  src={product.imageUrl}
  alt={`${product.name} — Eggless Cake Delivery Vadodara`} // Descriptive alt text!
  width={400}
  height={300}
  priority={isAboveFold}  // true for first 3 products
  loading={isAboveFold ? 'eager' : 'lazy'}
/>
```

### 6.3 Dynamic Metadata for Product Pages

```tsx
// app/product/[slug]/page.tsx
import { Metadata } from 'next'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct(params.slug) // fetch from Supabase/MongoDB
  
  return {
    title: `${product.name} | Order Online | CakeConnection Vadodara`,
    description: `Order ${product.name} online in Vadodara. ${product.shortDescription}. Same-day delivery available. ₹${product.price} onwards.`,
    alternates: {
      canonical: `https://cakeconnection.in/product/${params.slug}`,
    },
    openGraph: {
      title: `${product.name} | CakeConnection`,
      description: product.shortDescription,
      images: [{ url: product.imageUrl, width: 800, height: 600 }],
    },
  }
}

export async function generateStaticParams() {
  const products = await getAllProducts()
  return products.map(p => ({ slug: p.slug }))
}
```

### 6.4 Category Pages Metadata

```tsx
// app/Products-category/[category]/page.tsx
const categoryMetadata: Record<string, { title: string; description: string }> = {
  'cake': {
    title: 'Order Cakes Online in Vadodara | CakeConnection',
    description: 'Shop 100+ eggless cakes online in Vadodara. Birthday, anniversary, designer cakes. Same-day delivery in 3 hours.',
  },
  'birthday-cake': {
    title: 'Birthday Cake Delivery in Vadodara | Same Day | CakeConnection',
    description: 'Order fresh birthday cakes in Vadodara online. 50+ designs, eggless, custom message. Delivered in 3 hours.',
  },
  'anniversary-cake': {
    title: 'Anniversary Cake Delivery Vadodara | CakeConnection',
    description: 'Surprise your partner with a fresh anniversary cake in Vadodara. Heart cakes, couple cakes, photo cakes. Same-day delivery.',
  },
  // Add all categories
}
```

---

## PHASE 7 — LOCAL SEO (Week 2) — Google Map Pack

### 7.1 Google Business Profile — Immediate Actions

```
Priority Actions (Do This Week):
1. Primary Category: "Bakery" → "Online Bakery" + add "Cake Shop", "Dessert Shop"
2. Services list update:
   - Birthday Cake Delivery
   - Anniversary Cake Delivery
   - Eggless Cakes
   - Photo Cakes
   - Designer Cakes
   - Flower Delivery
   - Same Day Delivery
   - Custom Cake Orders
3. Website link: https://cakeconnection.in?utm_source=google&utm_medium=organic&utm_campaign=gbp
4. WhatsApp button link: https://wa.me/917203824012?utm_source=gbp
5. Upload 10+ photos: storefront, cakes, delivery, team, packaging
6. Add Q&A:
   - "Do you deliver same day in Vadodara?" → "Yes, within 3 hours"
   - "Are all cakes eggless?" → "Yes, 100% eggless guaranteed"
   - "Which areas do you cover?" → List top 10 areas
7. Weekly GBP Posts: new product, offer, occasion reminder
```

### 7.2 NAP Consistency Check

Everywhere same format:
```
Name: CakeConnection
Address: Exit Gate, GF9 RutuPlatina Complex, Eva Mall Rd, opp. Union Bank, Manjalpur, Vadodara, Gujarat 390011
Phone: +91 7203824012
Website: https://cakeconnection.in
```

---

## PHASE 8 — REVIEW & REPUTATION SYSTEM (Week 3-4) — GEO Trust

### 8.1 Post-Delivery WhatsApp Review Request

```
Message Template (send 2 hours after delivery):
---
Hi [Name] 😊

Hope your [product name] was fresh and delicious!

We'd love your feedback. It takes just 30 seconds:

⭐ Google Review: [GBP direct link]
⭐ Zomato Review: [Zomato link]

Your review helps other Vadodara families find us! 🙏

— Team CakeConnection
```

### 8.2 Reviews Component on Website — Trust Signals

```tsx
// components/ReviewsSection.tsx
// Fetch real reviews from Google/Supabase and display with:
// - Customer name (first name only)
// - Star rating (visual stars)
// - Review text
// - Product ordered
// - Date
// Schema: AggregateRating on organization
```

---

## PHASE 9 — CONTENT CALENDAR — Topical Authority

### Blog/Guide Pages to Create (After core pages done)

| URL | Title | AEO Purpose |
|-----|-------|-------------|
| `/blog/best-birthday-cakes-vadodara` | Best Birthday Cakes in Vadodara 2025 | "best birthday cake vadodara" |
| `/blog/eggless-vs-regular-cake` | Eggless Cake vs Regular Cake — What's the Difference? | "are eggless cakes good" |
| `/blog/custom-cake-guide-vadodara` | How to Order a Custom Cake in Vadodara | "custom cake order guide" |
| `/blog/cake-delivery-areas-vadodara` | Complete List of Cake Delivery Areas in Vadodara | local authority |
| `/blog/anniversary-cake-ideas` | 10 Anniversary Cake Ideas for Couples in Vadodara | "anniversary cake ideas vadodara" |

---

## TRACKING SETUP — Week 1 (Without This, Nothing is Measurable)

```
1. Google Search Console
   - Property: https://cakeconnection.in
   - Submit sitemap: https://cakeconnection.in/sitemap.xml
   - Already verified (k1iIk0gWj_4hbe-y6xqfTCU_8wLvJcGDs67kttncJYw)

2. Google Analytics 4
   - Install via next-ga4 or script in layout.tsx
   - Track: add_to_cart, purchase, whatsapp_click, phone_click

3. Page Speed
   - Target: LCP < 2.5s, FID < 100ms, CLS < 0.1
   - Use next/image everywhere
   - Enable Next.js font optimization
   - Minimize GSAP/Framer Motion on mobile
```

---

## IMPLEMENTATION PRIORITY ORDER

```
Week 1 (Foundation — Deploy ke saath):
✅ layout.tsx metadata (correct title + meta desc)
✅ OrganizationSchema + LocalBusiness schema
✅ sitemap.ts + robots.ts
✅ next.config.ts (images, headers)
✅ GSC sitemap submit

Week 2 (Landing Pages):
✅ /eggless-cake-vadodara
✅ /birthday-cake-vadodara  
✅ /same-day-cake-delivery-vadodara
✅ /online-cake-delivery-vadodara
✅ Dynamic product page metadata

Week 3 (AEO + GEO):
✅ FAQ page + FAQSchema on all category pages
✅ About page (entity SEO)
✅ Homepage AEO answer blocks
✅ GBP optimization

Week 4 (Reviews + Content):
✅ Reviews section + AggregateRating schema
✅ Post-delivery review request system
✅ First 2 blog posts
✅ 10 directory citations (JustDial, Sulekha, IndiaMart)
```

---

*Generated by Beyond SEO Framework + Claude AI*  
*CakeConnection.in | Vadodara | June 2025*
