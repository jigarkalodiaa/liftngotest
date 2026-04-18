/**
 * Public indexable paths for sitemap — extend when launching new marketing pages.
 * Keep transactional shells (`/booking`, plan checkouts, etc.) out; they live in `robots` disallow.
 *
 * Priority guide (0–1): primary conversion & hub URLs highest; legal/policy lowest.
 * City landings (`/khatu-goods-transport`, etc.) are merged in `sitemap.ts` from `SEO_CITIES`.
 * Khatu hotel detail URLs (`/khatu/hotels/[id]`) and marketplace shops are appended in `sitemap.ts` from data files.
 */

export const MARKETING_PATHS: { path: string; priority: number; changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' }[] = [
  { path: '/', priority: 1.0, changeFrequency: 'weekly' },
  { path: '/fare-calculator', priority: 0.92, changeFrequency: 'weekly' },
  { path: '/fleet-branding', priority: 0.91, changeFrequency: 'weekly' },
  { path: '/book-delivery', priority: 0.95, changeFrequency: 'weekly' },
  { path: '/khatu-shyam-logistics', priority: 0.96, changeFrequency: 'weekly' },
  { path: '/noida-b2b-logistics', priority: 0.96, changeFrequency: 'weekly' },
  { path: '/logistics-khatu', priority: 0.94, changeFrequency: 'weekly' },
  { path: '/khatu/hotels', priority: 0.91, changeFrequency: 'weekly' },
  { path: '/khatu/travel', priority: 0.91, changeFrequency: 'weekly' },
  { path: '/khatu/marketplace', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/khatu/guide', priority: 0.87, changeFrequency: 'weekly' },
  { path: '/b2b-transport', priority: 0.89, changeFrequency: 'weekly' },
  { path: '/services', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/services/3-wheeler', priority: 0.82, changeFrequency: 'monthly' },
  { path: '/services/4-wheeler', priority: 0.81, changeFrequency: 'monthly' },
  { path: '/services/2-wheeler', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/services/walk', priority: 0.79, changeFrequency: 'monthly' },
  { path: '/about', priority: 0.88, changeFrequency: 'monthly' },
  { path: '/about/khatu-supply-chain', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/about/b2b-logistics', priority: 0.81, changeFrequency: 'monthly' },
  { path: '/about/electric-three-wheel-cargo', priority: 0.76, changeFrequency: 'monthly' },
  { path: '/faq', priority: 0.84, changeFrequency: 'weekly' },
  { path: '/blog', priority: 0.76, changeFrequency: 'weekly' },
  { path: '/plans', priority: 0.93, changeFrequency: 'weekly' },
  { path: '/plans/subscription', priority: 0.92, changeFrequency: 'weekly' },
  { path: '/plans/rent', priority: 0.88, changeFrequency: 'weekly' },
  { path: '/plans/lease', priority: 0.86, changeFrequency: 'weekly' },
  { path: '/plans/custom', priority: 0.85, changeFrequency: 'weekly' },
  { path: '/plans/gst', priority: 0.84, changeFrequency: 'weekly' },
  { path: '/noida/coconut', priority: 0.82, changeFrequency: 'weekly' },
  /** Logged-in Noida hub — indexable for local “logistics Noida” intent (metadata + JSON-LD on layout). */
  { path: '/noida', priority: 0.91, changeFrequency: 'weekly' },
  /** Fleet-owner B2B explainer — complements /noida-b2b-logistics. */
  { path: '/noida/fleet-tech', priority: 0.84, changeFrequency: 'monthly' },
  { path: '/find-restaurant', priority: 0.74, changeFrequency: 'weekly' },
  { path: '/careers', priority: 0.68, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.72, changeFrequency: 'monthly' },
  { path: '/why-liftngo', priority: 0.74, changeFrequency: 'monthly' },
  { path: '/grow-with-liftngo', priority: 0.73, changeFrequency: 'monthly' },
  { path: '/become-driver', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/promotions', priority: 0.64, changeFrequency: 'monthly' },
  { path: '/privacy', priority: 0.25, changeFrequency: 'yearly' },
  { path: '/terms', priority: 0.25, changeFrequency: 'yearly' },
  { path: '/search', priority: 0.5, changeFrequency: 'monthly' },
  // New SEO landing pages
  { path: '/b2b-logistics-rajasthan', priority: 0.88, changeFrequency: 'weekly' },
  { path: '/same-day-delivery-khatu', priority: 0.87, changeFrequency: 'weekly' },
  { path: '/hotel-logistics-partner', priority: 0.85, changeFrequency: 'weekly' },
  { path: '/restaurant-delivery-partner', priority: 0.85, changeFrequency: 'weekly' },
  { path: '/whatsapp-delivery-service', priority: 0.86, changeFrequency: 'weekly' },
  { path: '/fleet-branding-rajasthan', priority: 0.84, changeFrequency: 'weekly' },
  { path: '/hyperlocal-delivery-service', priority: 0.86, changeFrequency: 'weekly' },
];
