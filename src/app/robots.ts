import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

/** Logged-in or transactional flows — keep out of index to avoid thin/duplicates. */
const DISALLOW_APP_SHELL = [
  '/api/',
  '/private/',
  '/_next/',
  '/dashboard',
  '/history',
  '/my-details',
  '/booking',
  '/payment',
  '/trip-options',
  '/trip-complete',
  '/add-stop',
  '/schedule-later',
  '/pickup-location',
  '/pickup-location/',
] as const;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [...DISALLOW_APP_SHELL],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
