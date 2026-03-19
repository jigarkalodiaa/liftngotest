/**
 * Environment and runtime config.
 * Sensitive data must never be exposed in frontend code (TRD §13).
 */

function getEnv(key: string, fallback: string = ''): string {
  if (typeof process === 'undefined') return fallback;
  const value = process.env[key];
  return typeof value === 'string' ? value : fallback;
}

/** Base URL for backend API. Use NEXT_PUBLIC_API_URL in .env.local */
export const API_BASE_URL = getEnv('NEXT_PUBLIC_API_URL', '');

/** Google Maps key for maps/places. Use NEXT_PUBLIC_GOOGLE_MAP_KEY in .env.local */
export const GOOGLE_MAP_KEY = getEnv('NEXT_PUBLIC_GOOGLE_MAP_KEY', '');

/** API request timeout in ms. Use NEXT_PUBLIC_API_TIMEOUT_MS in .env.local (default 20000). */
export const API_TIMEOUT_MS = Math.max(5000, parseInt(getEnv('NEXT_PUBLIC_API_TIMEOUT_MS', '20000'), 10) || 20000);

export const IS_DEV = getEnv('NODE_ENV', 'development') === 'development';

/** Demo OTP for local/dev login. Use NEXT_PUBLIC_DEMO_OTP in .env.local; never commit real secrets. */
export const DEMO_OTP = getEnv('NEXT_PUBLIC_DEMO_OTP', '');

/** Demo/support phone for placeholders and contact links. Use NEXT_PUBLIC_SUPPORT_PHONE in .env.local. */
export const SUPPORT_PHONE = getEnv('NEXT_PUBLIC_SUPPORT_PHONE', '');

/** Twitter handle for meta (e.g. @liftngo). Use NEXT_PUBLIC_TWITTER_HANDLE in .env.local. */
export const TWITTER_HANDLE = getEnv('NEXT_PUBLIC_TWITTER_HANDLE', '@liftngo');

/** Social links (optional). Use NEXT_PUBLIC_SOCIAL_TWITTER, NEXT_PUBLIC_SOCIAL_LINKEDIN, NEXT_PUBLIC_SOCIAL_INSTAGRAM. */
export const SOCIAL_LINKS = {
  twitter: getEnv('NEXT_PUBLIC_SOCIAL_TWITTER', 'https://twitter.com'),
  linkedin: getEnv('NEXT_PUBLIC_SOCIAL_LINKEDIN', 'https://linkedin.com'),
  instagram: getEnv('NEXT_PUBLIC_SOCIAL_INSTAGRAM', 'https://instagram.com'),
} as const;
