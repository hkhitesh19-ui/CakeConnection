// imageUrl.ts — Normalize WP legacy URLs to local-relative paths
const WP_ORIGIN = 'https://cakeconnection.in';
const FALLBACK = '/images/hero-cake.png';

export function normalizeImageUrl(url?: string | null, fallback = FALLBACK): string {
  if (!url) return fallback;
  // Strip domain prefix → turns full WP URL into a relative path Next.js can serve
  if (url.startsWith(WP_ORIGIN + '/wp-content/')) {
    return url.slice(WP_ORIGIN.length); // → /wp-content/uploads/...
  }
  return url || fallback;
}
