/**
 * GA4 low-level helpers.
 * Single source of truth for the measurement ID and raw gtag calls.
 *
 * Every other file (Analytics.tsx, analytics.ts) imports from here
 * so the env-var name and safety checks live in exactly one place.
 *
 * Hardcoded fallback guarantees the tag always fires — even if the
 * Vercel env var is missing, misspelled, or scoped to the wrong environment.
 */

export const GA_ID: string =
  process.env.NEXT_PUBLIC_GA_ID || 'G-JKQ7E01B2T';
export const GTM_ID: string = process.env.NEXT_PUBLIC_GTM_ID || '';

/** Send a page_view config hit for SPA navigations. */
export function pageview(url: string): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('config', GA_ID, { page_path: url });
}

/** Send a custom GA4 event. */
export function event(
  action: string,
  params?: Record<string, string | number | boolean>,
): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', action, params ?? {});
}

/** Push a raw event into GTM/GA dataLayer for richer tag workflows. */
export function dataLayerEvent(
  action: string,
  params?: Record<string, string | number | boolean>,
): void {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: action, ...(params ?? {}) });
}
