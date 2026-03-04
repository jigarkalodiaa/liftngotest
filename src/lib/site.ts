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
  'Liftngo is a technology-driven logistics and goods transportation platform designed to simplify last-mile delivery for businesses and individuals. The platform connects customers with nearby drivers and fleet operators to provide fast, reliable, and affordable goods transport services within cities and local regions. Liftngo focuses on organizing the traditionally unstructured local transport ecosystem by introducing a digital booking system, transparent pricing, and efficient driver management. The platform enables customers to book vehicles for transporting goods such as parcels, retail inventory, groceries, and commercial materials with ease. Through its smart logistics infrastructure, Liftngo supports real-time booking, route optimization, and delivery tracking while creating consistent earning opportunities for drivers and fleet owners. The system is designed to scale across multiple cities while maintaining operational efficiency and service reliability. Liftngo aims to empower small businesses, local merchants, and independent drivers by providing them with an accessible logistics network that improves delivery efficiency and reduces operational friction.';

/** Mission & vision (for About and structured data). */
export const MISSION =
  'Liftngo’s mission is to organize the unstructured local goods transportation market by providing technology-driven logistics solutions that are affordable, reliable, and accessible for everyone.';

export const VISION =
  'Liftngo aims to become a trusted logistics infrastructure for local transport ecosystems, empowering drivers, supporting small businesses, and simplifying goods movement through technology.';

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
