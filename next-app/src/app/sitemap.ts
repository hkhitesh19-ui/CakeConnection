import { MetadataRoute } from 'next'
import { getAllProducts } from '@/lib/db'

const BASE = 'https://cakeconnection.in'

// Vadodara localities — sync with data/localities.ts
const LOCALITY_SLUGS = [
  'alkapuri', 'gotri', 'manjalpur', 'akota', 'sayajigunj',
  'vadiwadi', 'fatehgunj', 'karelibaug', 'waghodia-road',
  'subhanpura', 'diwalipura', 'old-padra-road',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ✅ Fetch all products from DB for dynamic URLs
  const products = await getAllProducts()

  // Static priority pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/`,             priority: 1.0, changeFrequency: 'daily',   lastModified: new Date() },
    // Main city pages — highest money pages
    { url: `${BASE}/cakes/vadodara`,   priority: 0.95, changeFrequency: 'daily' },
    { url: `${BASE}/flowers/vadodara`, priority: 0.95, changeFrequency: 'daily' },
    // Category pages
    { url: `${BASE}/cakes`,        priority: 0.85, changeFrequency: 'daily' },
    { url: `${BASE}/flowers`,      priority: 0.85, changeFrequency: 'daily' },
    { url: `${BASE}/combos`,       priority: 0.80, changeFrequency: 'daily' },
    { url: `${BASE}/chocolates`,   priority: 0.75, changeFrequency: 'weekly' },
    { url: `${BASE}/sweets`,       priority: 0.75, changeFrequency: 'weekly' },
    { url: `${BASE}/dry-fruits`,   priority: 0.70, changeFrequency: 'weekly' },
    // Intent / landing pages (query fan-out coverage)
    { url: `${BASE}/midnight-cake-delivery-vadodara`,  priority: 0.90, changeFrequency: 'weekly' },
    { url: `${BASE}/eggless-cake-delivery-vadodara`,   priority: 0.90, changeFrequency: 'weekly' },
    { url: `${BASE}/same-day-cake-delivery-vadodara`,  priority: 0.90, changeFrequency: 'weekly' },
    { url: `${BASE}/birthday-cake-vadodara`,           priority: 0.85, changeFrequency: 'weekly' },
    { url: `${BASE}/anniversary-cake-vadodara`,        priority: 0.85, changeFrequency: 'weekly' },
    { url: `${BASE}/photo-cake-vadodara`,              priority: 0.85, changeFrequency: 'weekly' },
    { url: `${BASE}/designer-cake-vadodara`,           priority: 0.80, changeFrequency: 'weekly' },
    { url: `${BASE}/chocolate-cake-vadodara`,          priority: 0.80, changeFrequency: 'weekly' },
    { url: `${BASE}/red-velvet-cake-vadodara`,         priority: 0.80, changeFrequency: 'weekly' },
    // Hub + info pages
    { url: `${BASE}/delivery-areas`, priority: 0.80, changeFrequency: 'weekly' },
    { url: `${BASE}/about`,          priority: 0.60, changeFrequency: 'monthly' },
    { url: `${BASE}/contact`,        priority: 0.60, changeFrequency: 'monthly' },
    { url: `${BASE}/faq`,            priority: 0.65, changeFrequency: 'monthly' },
  ]

  // ✅ Locality pages — each Vadodara area gets its own indexed page
  const localityPages: MetadataRoute.Sitemap = LOCALITY_SLUGS.map(slug => ({
    url: `${BASE}/cakes/vadodara/${slug}`,
    priority: 0.80,
    changeFrequency: 'weekly' as const,
  }))

  // ✅ Dynamic product pages — all products from DB included in sitemap
  const productPages: MetadataRoute.Sitemap = products.map(p => ({
    url: `${BASE}/${p.category}/${p.slug}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
    priority: 0.90,
    changeFrequency: 'weekly' as const,
  }))

  return [...staticPages, ...localityPages, ...productPages]
}

