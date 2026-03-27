import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  async redirects() {
    return [
      { source: '/delivery-khatu', destination: '/khatu-shyam-logistics', permanent: true },
      { source: '/b2b-logistics-noida', destination: '/noida-b2b-logistics', permanent: true },
      { source: '/food-menu', destination: '/find-restaurant', permanent: false },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'picsum.photos', pathname: '/**' },
    ],
  },
  async headers() {
    return [
      {
        source: '/hero-liftngo-landing.jpg',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/og-image.jpg',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=86400' }],
      },
      {
        source: '/images/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=2592000, stale-while-revalidate=86400' }],
      },
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
