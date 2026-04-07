/**
 * Environment and runtime config.
 * Sensitive data must never be exposed in frontend code (TRD §13).
 */

function getEnv(key: string, fallback: string = ''): string {
  if (typeof process === 'undefined') return fallback;
  const value = process.env[key];
  if (typeof value !== 'string') return fallback;
  const t = value.trim();
  if (!t) return fallback;
  return t;
}

/**
 * Base URL for backend API.
 * Uses literal `process.env.NEXT_PUBLIC_*` so Next.js can inline into the client bundle.
 * Falls back to NEXT_PUBLIC_API_BASE_URL when NEXT_PUBLIC_API_URL isn't set.
 */
export const API_BASE_URL: string = (() => {
  const primary = typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_API_URL : undefined;
  const fallback = typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL : undefined;
  const raw = (typeof primary === 'string' && primary.trim()) ? primary : (fallback ?? '');
  return String(raw).trim();
})();

/**
 * Auth / OTP backend base URL including API prefix, e.g. `http://127.0.0.1:3001/api/v1`.
 * Prefer this for OTP when it differs from `NEXT_PUBLIC_API_URL`.
 */
export const API_AUTH_BASE_URL = getEnv(
  'NEXT_PUBLIC_API_BASE_URL',
  API_BASE_URL,
).replace(/\/$/, '');

/**
 * Server-side base URL for `authorize()` (verify OTP). Use `127.0.0.1` if the public URL uses `0.0.0.0`.
 */
export const API_AUTH_INTERNAL_BASE_URL = getEnv('API_INTERNAL_BASE_URL', API_AUTH_BASE_URL).replace(/\/$/, '');

/** POST path for verify OTP (appended to internal base). */
export const AUTH_VERIFY_OTP_PATH = getEnv('AUTH_VERIFY_OTP_PATH', '/auth/verify-otp');

/** Google Maps key for maps/places. Use NEXT_PUBLIC_GOOGLE_MAP_KEY in .env.local */
export const GOOGLE_MAP_KEY = getEnv('NEXT_PUBLIC_GOOGLE_MAP_KEY', '');

/** API request timeout in ms. Use NEXT_PUBLIC_API_TIMEOUT_MS in .env.local (default 20000). */
export const API_TIMEOUT_MS = Math.max(5000, parseInt(getEnv('NEXT_PUBLIC_API_TIMEOUT_MS', '20000'), 10) || 20000);

export const IS_DEV = getEnv('NODE_ENV', 'development') === 'development';
export const WS_URL = getEnv('NEXT_PUBLIC_WS_URL', 'http://localhost:3001');

/** Razorpay Key ID — safe for client-side (embedded in checkout.js). */
export const RAZORPAY_KEY_ID = getEnv('NEXT_PUBLIC_RAZORPAY_KEY_ID', '');

/** Demo OTP for local/dev login. Use NEXT_PUBLIC_DEMO_OTP in .env.local; never commit real secrets. */
export const DEMO_OTP = getEnv('NEXT_PUBLIC_DEMO_OTP', '');

/** Demo/support phone for placeholders and contact links. Use NEXT_PUBLIC_SUPPORT_PHONE in .env.local. */
export const SUPPORT_PHONE = getEnv('NEXT_PUBLIC_SUPPORT_PHONE', '');

/** Public support email for /contact and JSON-LD when set. */
export const SUPPORT_EMAIL = getEnv('NEXT_PUBLIC_SUPPORT_EMAIL', '');

/** Twitter handle for meta (e.g. @liftngo). Use NEXT_PUBLIC_TWITTER_HANDLE in .env.local. */
export const TWITTER_HANDLE = getEnv('NEXT_PUBLIC_TWITTER_HANDLE', '@liftngo');

/** Social profile URLs — defaults point to brand handles; override per env in production. */
export const SOCIAL_LINKS = {
  youtube: getEnv('NEXT_PUBLIC_SOCIAL_YOUTUBE', 'https://www.youtube.com/@liftngo'),
  facebook: getEnv(
    'NEXT_PUBLIC_SOCIAL_FACEBOOK',
    'https://www.facebook.com/profile.php?id=61578755032262',
  ),
  /** X (Twitter) — prefer NEXT_PUBLIC_SOCIAL_X, else legacy TWITTER key */
  x: getEnv(
    'NEXT_PUBLIC_SOCIAL_X',
    getEnv('NEXT_PUBLIC_SOCIAL_TWITTER', 'https://x.com/liftngo'),
  ),
  linkedin: getEnv(
    'NEXT_PUBLIC_SOCIAL_LINKEDIN',
    'https://www.linkedin.com/company/liftngo-logistics',
  ),
  instagram: getEnv(
    'NEXT_PUBLIC_SOCIAL_INSTAGRAM',
    'https://www.instagram.com/liftngo_goods_transfer/',
  ),
} as const;
