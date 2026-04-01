import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  async rewrites() {
    return [{ source: '/.well-known/llms.txt', destination: '/llms.txt' }];
  },
  async redirects() {
    return [
      { source: '/delivery-khatu', destination: '/khatu-shyam-logistics', permanent: true },
      /** SEO aliases — one canonical URL per topic (sitelinks + crawl clarity). */
      { source: '/b2b-logistics', destination: '/b2b-transport', permanent: true },
      { source: '/khatu-delivery', destination: '/khatu-shyam-logistics', permanent: true },
      { source: '/b2b-logistics-noida', destination: '/noida-b2b-logistics', permanent: true },
      { source: '/food-menu', destination: '/find-restaurant', permanent: false },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    /** Longer cache for `/_next/image` optimized URLs (seconds). */
    minimumCacheTTL: 60 * 60 * 24 * 30,
    /**
     * Unsplash is served via imgix. Allow main host + subdomains so `/ _next/image` never
     * fails host matching (some CDNs redirect or use alternate hostnames).
     */
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "plus.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "media.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "picsum.photos", pathname: "/**" },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self)',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
