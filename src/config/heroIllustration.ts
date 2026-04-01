/**
 * Lightweight hero illustration (SVG in `/public`) — avoids multi‑MB GIF LCP cost on mobile.
 * Replace asset here if branding updates.
 */
export const HERO_ILLUSTRATION = {
  src: '/hero-delivery.svg' as const,
  width: 400,
  height: 300,
} as const;
