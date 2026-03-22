/**
 * Liftngo – central brand and site configuration.
 * Single source of truth for URL, SEO, and copy.
 */

export const SITE_URL = 'https://liftngo.com';
export const SITE_NAME = 'Liftngo';

/** Meta title (browser tab / search results). */
export const META_TITLE = 'Liftngo | Smart Logistics & Goods Transport Platform';

/** Meta description (search results / snippets). */
export const SITE_DESCRIPTION =
  'Liftngo is a technology-driven logistics platform that connects customers with verified drivers for fast, affordable, and reliable goods transportation and last-mile delivery services.';

/** Short description (footer, cards, manifest). */
export const SHORT_DESCRIPTION =
  'Liftngo is a logistics platform that connects customers with drivers to provide fast, affordable, and reliable goods transportation and last-mile delivery services.';

/** OG title. */
export const OG_TITLE = 'Liftngo | Smart Logistics Platform';

/** OG description. */
export const OG_DESCRIPTION =
  'Liftngo is a technology-enabled logistics platform providing fast and affordable goods transport and last-mile delivery services.';

/** Twitter card title. */
export const TWITTER_TITLE = 'Liftngo | Smart Logistics Platform';

/** Twitter card description. */
export const TWITTER_DESCRIPTION =
  'Liftngo connects customers with drivers for fast and affordable goods delivery services.';

/** Hero / marketing tagline. */
export const SITE_TAGLINE = 'Smart Logistics for Everyday Transport';

/** One-line product pitch. */
export const ONE_LINE_PITCH =
  'Liftngo is a digital logistics platform that connects customers with drivers for seamless, affordable, and efficient goods transportation.';

export const SEO_KEYWORDS = [
  'liftngo logistics',
  'goods transport platform',
  'last mile delivery service',
  'local logistics platform',
  'mini truck booking service',
  'on-demand goods delivery',
  'local transport service',
  'logistics technology platform',
  'driver network logistics',
];

/** Full URL for default OG/Twitter image (per spec). */
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

/** Full project description (About, structured data). */
export const PROJECT_DESCRIPTION =
  'Liftngo is a B2B-oriented, technology-driven logistics platform for sending and receiving goods: it connects businesses and teams with verified drivers and fleet operators for structured bookings, transparent pricing, and last-mile delivery within cities and local regions. The product follows a clear logistics pattern—pickup, transit, and handoff—rather than treating delivery as a generic add-on. Liftngo organizes the traditionally unstructured local transport ecosystem with digital booking, route-aware operations, and efficient partner management. Customers book vehicles for parcels, retail inventory, groceries, and commercial materials; the platform supports real-time booking, tracking, and scale across cities while empowering merchants and driver partners with a dependable service network.';

/** Mission & vision (for About and structured data). */
export const MISSION =
  'We exist so every business—from a corner store to a growing distributor—can ship goods with enterprise-grade confidence: clear pricing, verified partners, and live visibility from first pickup to final handoff.';

export const VISION =
  'A future where local goods movement runs on trust and data, not phone calls and guesswork—and where Liftngo is the quiet infrastructure behind every shipment that arrives exactly as promised.';

/** Brand object for shared use. */
export const BRAND = {
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  shortDescription: SHORT_DESCRIPTION,
  tagline: SITE_TAGLINE,
  pitch: ONE_LINE_PITCH,
  mission: MISSION,
  vision: VISION,
  projectDescription: PROJECT_DESCRIPTION,
  ogTitle: OG_TITLE,
  ogDescription: OG_DESCRIPTION,
  twitterTitle: TWITTER_TITLE,
  twitterDescription: TWITTER_DESCRIPTION,
} as const;
