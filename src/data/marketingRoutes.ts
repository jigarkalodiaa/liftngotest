/**
 * Public indexable paths for sitemap — extend when launching new marketing pages.
 * Keep transactional shells (`/booking`, etc.) out; they live in `robots` disallow.
 */

export const MARKETING_PATHS: { path: string; priority: number; changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' }[] = [
  { path: '/', priority: 1, changeFrequency: 'weekly' },
  { path: '/khatu-shyam-logistics', priority: 0.98, changeFrequency: 'weekly' },
  { path: '/khatu/hotels', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/khatu/travel', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/khatu/marketplace', priority: 0.88, changeFrequency: 'weekly' },
  { path: '/khatu/guide', priority: 0.86, changeFrequency: 'weekly' },
  { path: '/noida-b2b-logistics', priority: 0.98, changeFrequency: 'weekly' },
  { path: '/logistics-khatu', priority: 0.95, changeFrequency: 'weekly' },
  { path: '/b2b-transport', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/book-delivery', priority: 0.92, changeFrequency: 'weekly' },
  { path: '/faq', priority: 0.82, changeFrequency: 'weekly' },
  { path: '/about', priority: 0.85, changeFrequency: 'monthly' },
  { path: '/about/b2b-logistics', priority: 0.75, changeFrequency: 'monthly' },
  { path: '/about/electric-three-wheel-cargo', priority: 0.72, changeFrequency: 'monthly' },
  { path: '/about/khatu-supply-chain', priority: 0.78, changeFrequency: 'monthly' },
  { path: '/services', priority: 0.85, changeFrequency: 'weekly' },
  { path: '/services/walk', priority: 0.75, changeFrequency: 'monthly' },
  { path: '/services/2-wheeler', priority: 0.75, changeFrequency: 'monthly' },
  { path: '/services/3-wheeler', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/services/4-wheeler', priority: 0.78, changeFrequency: 'monthly' },
  { path: '/blog', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/careers', priority: 0.65, changeFrequency: 'monthly' },
  { path: '/promotions', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/find-restaurant', priority: 0.55, changeFrequency: 'weekly' },
  { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/terms', priority: 0.3, changeFrequency: 'yearly' },
];
