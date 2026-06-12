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

  return [...staticPages]
}
