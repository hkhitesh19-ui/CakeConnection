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
