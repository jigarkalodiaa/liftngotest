import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

/**
 * Logged-in or transactional flows — keep out of index to avoid thin/duplicates.
 * Do NOT disallow `/_next/` — Google must fetch JS/CSS/static chunks under `/_next/static/`
 * to render pages; blocking it creates hundreds of "blocked resource" crawl errors.
 */
const DISALLOW_APP_SHELL = [
  '/api/',
  '/private/',
  '/dashboard',
  '/history',
  '/my-details',
  '/login',
  '/booking',
  '/payment',
  '/trip-options',
  '/trip-complete',
  '/add-stop',
  '/schedule-later',
  '/pickup-location',
  '/pickup-location/',
  /** Transactional checkout — noindex in metadata; disallow saves crawl budget. */
  '/noida/coconut/checkout',
  '/plans/subscription/checkout',
  '/plans/rent/checkout',
  '/plans/lease/checkout',
  '/plans/custom/checkout',
] as const;

/**
 * Link-preview crawlers must be allowed to fetch HTML for `/dashboard` and other app shells,
 * or WhatsApp/Facebook show only the hostname with no `og:title` / `og:image`.
 * @see https://developers.facebook.com/docs/sharing/webmasters/web-crawlers
 */
const DISALLOW_FOR_SOCIAL_ONLY = ['/api/', '/private/'] as const;

const SOCIAL_AND_PREVIEW_USER_AGENTS = [
  'facebookexternalhit',
  'Facebot',
  'Twitterbot',
  'LinkedInBot',
  'Slackbot',
  'WhatsApp',
  'Pinterest',
  'Discordbot',
] as const;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: [...SOCIAL_AND_PREVIEW_USER_AGENTS],
        allow: '/',
        disallow: [...DISALLOW_FOR_SOCIAL_ONLY],
      },
      {
        userAgent: '*',
        allow: '/',
        disallow: [...DISALLOW_APP_SHELL],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
