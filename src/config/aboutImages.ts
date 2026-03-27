/**
 * About page — Unsplash images from Indian logistics contexts.
 * `images.unsplash.com` → `next.config` → `images.remotePatterns`.
 */

import {
  indiaPhotoBangaloreLoadedTruck,
  indiaPhotoFreightBoxes,
  indiaPhotoDeliveryRiderGoods,
  indiaPhotoCargoBayLoading,
} from '@/config/indiaLogisticsImages';

export type AboutFleetImage = {
  src: string;
  alt: string;
  label: string;
  sourceUrl?: string;
};

export const ABOUT_HERO_IMAGE = {
  src: indiaPhotoBangaloreLoadedTruck(1600),
  alt: 'Loaded commercial goods truck — B2B logistics and cargo transport (not passenger service)',
} as const;

export const ABOUT_FLEET_IMAGES: readonly AboutFleetImage[] = [
  {
    src: indiaPhotoFreightBoxes(900),
    label: 'Walk & light parcels',
    alt: 'Cartons and freight sorting — light handoff and parcel logistics (no passenger vehicles)',
  },
  {
    src: indiaPhotoDeliveryRiderGoods(900),
    label: 'Two-wheeler goods',
    alt: 'Delivery professional with carry equipment — two-wheeler last-mile goods and food logistics',
  },
  {
    src: indiaPhotoCargoBayLoading(900),
    label: 'Three- & four-wheel cargo',
    alt: 'Packages staged at vehicle cargo bay — three- and four-wheeler commercial goods transport',
  },
];
