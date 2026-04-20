/**
 * Liftngo – central brand and site configuration.
 * Single source of truth for URL, SEO, and copy.
 */

function stripTrailingSlashes(url: string): string {
  return url.replace(/\/+$/, '');
}

/**
 * Canonical site origin for metadata, JSON-LD, sitemap, and OG URLs.
 * Set `NEXT_PUBLIC_SITE_URL` in production (e.g. https://www.goliftngo.com) so share cards match the live domain.
 */
export const SITE_URL = stripTrailingSlashes(
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'https://www.goliftngo.com'
);
export const SITE_NAME = 'Liftngo';

/**
 * Browser / Google SERP favicon (square, ≥48×48; PNG in `/public`).
 * Distinct from header logo (`LOGO_PATH`).
 */
export const FAVICON_PATH = '/favicon.png';

/** Primary mark served from `/public` (PNG — official Liftngo Logistics artwork). */
export const LOGO_PATH = '/logo.png';
/** Absolute URL for JSON-LD, manifests, and share metadata. */
export const LOGO_URL = `${SITE_URL}${LOGO_PATH}`;

/** Pixel dimensions of `LOGO_PATH` for Schema.org `logo` (Google prefers width + height). Update if the file changes. */
export const LOGO_IMAGE_WIDTH = 1024;
export const LOGO_IMAGE_HEIGHT = 1024;

/** Meta title — target ~50–60 chars (Semrush / SERP tooling). B2B-first for NCR commercial intent. */
export const META_TITLE = 'Liftngo — Instant Goods Transport in Noida | Auto, Mini Truck, Tempo';

/** Meta description — target ~150–160 chars where useful; primary B2B hooks + Khatu corridor. */
export const SITE_DESCRIPTION =
  'Liftngo offers instant pickup and delivery services in Noida — auto, mini trucks, tempos, and 2W delivery. Book home shifting, packers and movers, and goods transport near you. Same day delivery with live tracking.';

/** Short description (footer, cards, manifest). */
export const SHORT_DESCRIPTION =
  'B2B logistics in Noida & Delhi NCR—subscription, lease, GST billing, and fleet-ready delivery. Hyperlocal goods transport in Khatu Shyam Ji with upfront pricing.';

/** OG title (can match or complement META_TITLE). */
export const OG_TITLE = 'Liftngo — Noida\'s Fastest Goods Transport & Delivery Service';

/** OG description — aligned with SITE_DESCRIPTION for share previews. */
export const OG_DESCRIPTION =
  'Book auto, mini truck, tempo or 2W delivery instantly in Noida & Delhi NCR. Home shifting, packers and movers, same day delivery with verified drivers and live tracking.';

/** Twitter card title. */
export const TWITTER_TITLE = OG_TITLE;

/** Twitter card description. */
export const TWITTER_DESCRIPTION = OG_DESCRIPTION;

/** Hero / marketing tagline — single source of identity. */
export const SITE_TAGLINE = 'Goods Time Pe, Business Prime Pe';

/** One-line product pitch. */
export const ONE_LINE_PITCH =
  'Liftngo is a digital logistics platform for goods transport—strong on B2B subscription, lease, and GST-ready delivery in Noida & NCR, plus hyperlocal booking in Khatu Shyam Ji.';

export const SEO_KEYWORDS = [
  // Core service keywords
  'goods transport services',
  'delivery transport',
  'transportation services near me',
  'pick up and drop service',
  'material shifting',
  'courier service',
  'parcel delivery app',
  'tempo booking',
  'mini truck booking',
  'bike delivery service',
  // Home shifting keywords
  'packers and movers',
  'packers and movers near me',
  'home shifting services',
  'house shifting services',
  'packing and moving services',
  // Vehicle keywords
  '2 wheeler delivery',
  '3 wheeler cargo',
  'mini truck booking service',
  'tempo booking service',
  // City keywords
  'goods transport noida',
  'delivery service noida',
  'logistics noida',
  'goods transport delhi',
  'logistics delhi ncr',
  'delivery service gurgaon',
  // Partner keywords
  'delivery partner',
  'driver partner app',
  'delivery jobs',
  // Intent keywords
  'same day delivery',
  'express delivery',
  'instant delivery service',
  'on-demand goods delivery',
  'local delivery service',
  // Brand
  'liftngo',
  'liftngo logistics',
  'liftngo noida',
];

/**
 * Default share asset (OG / Twitter / `generatePageMetadata`).
 * Raster only (JPG/PNG/WebP). Source: branded “B2B Logistics Simplified” banner in `/public`.
 */
export const OG_IMAGE_PATH = '/og-image.jpg';

/** Bump when replacing the file so Facebook/WhatsApp invalidate cached previews. */
export const OG_IMAGE_CACHE_VERSION = '3';

/** Actual dimensions of `/public/og-image.jpg` (update if you replace the file). */
export const OG_IMAGE_WIDTH = 1024;
export const OG_IMAGE_HEIGHT = 682;

export const OG_IMAGE_ALT =
  'LiftnGo Logistics — B2B Logistics Simplified for Khatu Shyam Ji and Delhi NCR; delivery partner illustration.';

/** Absolute URL for default OG/Twitter image (includes cache-buster query). */
export const DEFAULT_OG_IMAGE = `${SITE_URL}${OG_IMAGE_PATH}?v=${OG_IMAGE_CACHE_VERSION}`;

/** Resolve a root-relative image path or absolute URL for Open Graph / Twitter. */
export function absoluteShareImageUrl(imagePathOrUrl: string): string {
  if (imagePathOrUrl.startsWith('http://') || imagePathOrUrl.startsWith('https://')) {
    return /[?&]v=/.test(imagePathOrUrl)
      ? imagePathOrUrl
      : `${imagePathOrUrl}${imagePathOrUrl.includes('?') ? '&' : '?'}v=${OG_IMAGE_CACHE_VERSION}`;
  }
  const path = imagePathOrUrl.startsWith('/') ? imagePathOrUrl : `/${imagePathOrUrl}`;
  const base = `${SITE_URL}${path}`;
  return /[?&]v=/.test(base) ? base : `${base}${base.includes('?') ? '&' : '?'}v=${OG_IMAGE_CACHE_VERSION}`;
}

/** Full project description (About, structured data). */
export const PROJECT_DESCRIPTION =
  'Liftngo is a digital goods transport platform for businesses and local commerce: in Noida and Delhi NCR we focus on B2B subscription packs, dedicated vehicle options, long-term lease, GST-ready invoicing, and multi-vehicle (2W–4W) coordination with upfront pricing and tracking. In Khatu Shyam Ji we provide hyperlocal delivery for vendors, food outlets, and shops around the temple corridor with verified drivers and real-time visibility.';

/** Mission & vision (for About and structured data). */
export const MISSION =
  'Make B2B and local goods movement dependable: honest pricing, EV-first short-haul where it fits, and drivers incentivised around punctuality and completions—so every handoff protects your reputation.';

export const VISION =
  'Become the default goods transport partner in Khatu Shyam Ji and a trusted B2B logistics brand in Noida and Delhi NCR—deep density in each city before expanding further.';

/** Brand object for shared use. */
export const BRAND = {
  name: SITE_NAME,
  url: SITE_URL,
  logoUrl: LOGO_URL,
  logoPath: LOGO_PATH,
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
