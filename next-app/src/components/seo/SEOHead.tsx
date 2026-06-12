// ============================================
// SEO Head Component — Cake Connection
// ============================================

import { Helmet, HelmetProvider } from 'react-helmet-async';
import { siteConfig } from '@/config/site.config';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonicalUrl?: string;
  type?: 'website' | 'product' | 'article';
  noIndex?: boolean;
  schema?: Record<string, unknown>;
}

export function SEOHead({
  title,
  description,
  keywords,
  ogImage = '/og-image.jpg',
  canonicalUrl,
  type = 'website',
  noIndex = false,
  schema,
}: SEOHeadProps) {
  const fullTitle = title
    ? `${title} | ${siteConfig.name}`
    : `${siteConfig.name} | ${siteConfig.tagline}`;

  const metaDescription = description || siteConfig.description;
  const canonical = canonicalUrl || siteConfig.url;

  return (
    <HelmetProvider>
      <Helmet>
        <title>{fullTitle}</title>
        <meta name="description" content={metaDescription} />
        {keywords && <meta name="keywords" content={keywords} />}
        {noIndex && <meta name="robots" content="noindex, nofollow" />}

        {/* Open Graph */}
        <meta property="og:type" content={type} />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={canonical} />
        <meta property="og:site_name" content={siteConfig.name} />
        <meta property="og:locale" content={siteConfig.locale} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={fullTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={ogImage} />

        {/* Canonical */}
        <link rel="canonical" href={canonical} />

        {/* Schema */}
        {schema && (
          <script type="application/ld+json">
            {JSON.stringify(schema)}
          </script>
        )}
      </Helmet>
    </HelmetProvider>
  );
}
