/**
 * About page — remote images (Unsplash).
 *
 * `images.unsplash.com` must stay in `next.config` → `images.remotePatterns`.
 * Swap URLs here only; components import these constants.
 *
 * @see https://unsplash.com/license
 */

export type AboutFleetImage = {
  /** CDN URL (e.g. images.unsplash.com/photo-…?w=&q=) */
  src: string;
  alt: string;
  label: string;
  /** Original Unsplash page (attribution / when the asset was chosen) */
  sourceUrl?: string;
};

/** Hero banner — warehouse / logistics */
export const ABOUT_HERO_IMAGE = {
  src: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1600&q=80',
  alt: 'Warehouse and logistics — goods transport',
} as const;

/** Fleet strip: walk, two wheeler, three wheeler (order matches UI). */
export const ABOUT_FLEET_IMAGES: readonly AboutFleetImage[] = [
  {
    src: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=900&q=85',
    label: 'Walk & light cargo',
    alt: 'Parcels and boxes for light cargo delivery',
  },
  {
    src: 'https://images.unsplash.com/photo-1587476351660-e9fa4bb8b26c?w=900&q=85',
    label: 'Two wheeler',
    alt: 'Rider in helmet on a motorbike — two wheeler delivery',
    sourceUrl: 'https://unsplash.com/photos/man-in-green-and-black-jacket-wearing-black-helmet-62JneRv7jW4',
  },
  {
    src: 'https://images.unsplash.com/photo-1768063988641-46b21236bd86?w=900&q=85',
    label: 'Three wheeler',
    alt: 'Blue three-wheeled truck carrying cargo',
    sourceUrl:
      'https://unsplash.com/photos/a-blue-three-wheeled-truck-filled-with-sand-in-autumn-park-v9ylnfHtQoA',
  },
];
