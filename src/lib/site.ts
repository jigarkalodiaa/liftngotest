/**
 * Liftngo – central brand and site configuration.
 * Single source of truth for URL, SEO, and copy.
 */

export const SITE_URL = 'https://liftngo.com';
export const SITE_NAME = 'Liftngo';

/** Primary mark served from `/public` (PNG — official Liftngo Logistics artwork). */
export const LOGO_PATH = '/logo.png';
/** Absolute URL for JSON-LD, manifests, and share metadata. */
export const LOGO_URL = `${SITE_URL}${LOGO_PATH}`;

/** Meta title (browser tab / search results). */
export const META_TITLE =
  'Liftngo | Logistics in Khatu Shyam Ji & B2B Delivery in Noida / Delhi NCR';

/** Meta description (search results / snippets). */
export const SITE_DESCRIPTION =
  'Liftngo is the logistics platform for Khatu Shyam Ji (Rajasthan) and for B2B in Noida & Delhi NCR: food & shop delivery near the temple, multi-vehicle booking (2W–4W), verified partners. Not pan-India—focused operating areas.';

/** Short description (footer, cards, manifest). */
export const SHORT_DESCRIPTION =
  'Hyperlocal logistics in Khatu Shyam Ji and B2B logistics in Noida & Delhi NCR—multi-vehicle goods transport with upfront pricing.';

/** OG title — B2B-first; cargo / logistics only (not passenger or generic megacity app). */
export const OG_TITLE =
  'Liftngo | B2B & Hyperlocal Goods Logistics — Khatu Shyam Ji & Noida / Delhi NCR';

/** OG description. */
export const OG_DESCRIPTION =
  'B2B logistics in Noida & Delhi NCR and hyperlocal goods delivery in Khatu Shyam Ji: multi-vehicle cargo (2W–4W), verified partners, warehouse and corporate lanes—not passenger transport or pan-India sprawl.';

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
 * Default share image (OG / Twitter / JSON-LD). Ship a 1200×630 PNG/WebP at `/og-image.png` in production;
 * until then we use the hero illustration so crawlers resolve a real URL.
 */
export const OG_IMAGE_PATH = '/hero-delivery.svg';

/** Absolute URL for default OG/Twitter image. */
export const DEFAULT_OG_IMAGE = `${SITE_URL}${OG_IMAGE_PATH}`;

/** Full project description (About, structured data). */
export const PROJECT_DESCRIPTION =
  'Liftngo is a focused logistics platform—not pan-India. We operate hyperlocal goods transport around Khatu Shyam Ji (Rajasthan) for vendors, food outlets, shops, and temple-corridor runs, and we are building B2B logistics in Noida and Delhi NCR with multi-vehicle booking (2W, 3W, 4W), verified partners, and corporate-friendly handoffs. EV cargo is used where lanes fit; the product emphasises upfront fares, repeat routes, and completion-based incentives rather than passenger-style rides.';

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
