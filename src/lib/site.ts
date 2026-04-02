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

/** Meta title — target ~50–60 chars (Semrush / SERP tooling). */
export const META_TITLE = 'Khatu Delivery Service | Liftngo Logistics';

/** Meta description — target ~100–130 chars. */
export const SITE_DESCRIPTION =
  'Khatu delivery & logistics: ₹50 fixed delivery, 15–25 min ETA, no app. B2B for hotels, restaurants & suppliers — book on WhatsApp or online.';

/** Short description (footer, cards, manifest). */
export const SHORT_DESCRIPTION =
  'Khatu delivery & logistics: ₹50 fixed, 15–25 min, no app. B2B partner for hotels, restaurants & suppliers in Khatu and Delhi NCR.';

/** OG title (can match or complement META_TITLE). */
export const OG_TITLE = 'Khatu’s fastest delivery network — Liftngo';

/** OG description — aligned length with SITE_DESCRIPTION. */
export const OG_DESCRIPTION =
  'Khatu logistics & delivery: fixed ₹50, 15–25 minutes, no app. Hotels, restaurants & suppliers — partner with Liftngo.';

/** Twitter card title. */
export const TWITTER_TITLE = OG_TITLE;

/** Twitter card description. */
export const TWITTER_DESCRIPTION = OG_DESCRIPTION;

/** Hero / marketing tagline. */
export const SITE_TAGLINE = 'Smart Logistics for Everyday Transport';

/** One-line product pitch. */
export const ONE_LINE_PITCH =
  'Liftngo is a digital logistics platform that connects customers with drivers for seamless, affordable, and efficient goods transportation.';

export const SEO_KEYWORDS = [
  'khatu delivery',
  'khatu logistics',
  'hotel delivery khatu',
  'logistics in khatu shyam ji',
  'delivery service khatu',
  'local delivery khatu',
  'temple logistics khatu',
  'goods transport khatu',
  'b2b logistics noida',
  'logistics company delhi ncr',
  'corporate delivery solutions',
  'bulk delivery services noida',
  'warehouse logistics delhi ncr',
  'hyperlocal logistics india',
  'last mile delivery solutions',
  'EV cargo delivery',
  'business logistics platform',
  'logistics in Khatu',
  'goods transport near me',
  'B2B logistics India',
  'hyperlocal delivery service',
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
  'Liftngo is a reliable goods transport platform serving Khatu Shyam Ji and Delhi NCR. We provide hyperlocal delivery for vendors, food outlets, and shops around the Khatu Shyam Ji temple corridor, and dedicated B2B logistics across Noida, Gurugram, and the wider NCR region. Choose from bike, auto, or mini truck with upfront pricing, verified drivers, and real-time tracking. Businesses benefit from recurring routes, GST invoicing, and digital proof of delivery.';

/** Mission & vision (for About and structured data). */
export const MISSION =
  'Make local goods movement dependable for businesses: honest pricing, EV-first short-haul capacity, and drivers who are incentivised around punctuality and completions—so every handoff protects your reputation.';

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
