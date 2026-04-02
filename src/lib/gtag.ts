/**
 * GA4 low-level helpers.
 * Single source of truth for the measurement ID and raw gtag calls.
 *
 * Every other file (Analytics.tsx, analytics.ts) imports from here
 * so the env-var name and safety checks live in exactly one place.
 */

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? '';

const isBrowser = typeof window !== 'undefined';

if (isBrowser && !GA_ID) {
  console.warn(
    '[GA4] NEXT_PUBLIC_GA_ID is not set — analytics will not fire. ' +
      'Add it to .env.local (dev) or Vercel Environment Variables (production).',
  );
}

/** Send a page_view config hit for SPA navigations. */
export function pageview(url: string): void {
  if (!isBrowser || !GA_ID || typeof window.gtag !== 'function') return;
  window.gtag('config', GA_ID, { page_path: url });
}

/** Send a custom GA4 event. */
export function event(
  action: string,
  params?: Record<string, string | number | boolean>,
): void {
  if (!isBrowser || typeof window.gtag !== 'function') return;
  window.gtag('event', action, params ?? {});
}
