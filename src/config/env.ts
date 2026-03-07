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

export const IS_DEV = getEnv('NODE_ENV', 'development') === 'development';
