import type { NextConfig } from "next";

// Absolute path on C: drive â€” avoids slow F: drive for build cache
const FAST_CACHE_DIR = "C:/tmp/cakeconnection-next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['pdfkit'],
  // âœ… FIX: Redirect .next cache from slow F: drive â†’ fast C: drive
  distDir: ".next",
  turbopack: {},

  // âœ… FIX: Disable dev source maps to reduce FS write operations
  productionBrowserSourceMaps: false,

  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    remotePatterns: [
      { protocol: 'https', hostname: 'cakeconnection.in' },
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },

  // âœ… FIX: Webpack optimizations for slow drives
  webpack(config, { dev, isServer }) {
    if (dev) {
      // Reduce polling interval; use native FS events instead
      config.watchOptions = {
        poll: false,
        aggregateTimeout: 300,
        ignored: ['**/node_modules/**', '**/.git/**'],
      };
    }
    return config;
  },

  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/wp-content/uploads/:path*',
        destination: 'https://cakeconnection.in/wp-content/uploads/:path*',
      },
    ];
  },
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
    ];
  },
};

export default nextConfig;
