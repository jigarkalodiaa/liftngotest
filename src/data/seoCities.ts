/**
 * City-based SEO landing pages (TRD §9).
 * Slugs and metadata for organic search: e.g. /khatu-goods-transport, /delhi-mini-truck-booking.
 */

export const SEO_CITIES = [
  { slug: 'khatu-goods-transport', name: 'Khatu', region: 'Rajasthan', title: 'Goods Transport in Khatu | Mini Truck & Last-Mile Delivery' },
  { slug: 'delhi-mini-truck-booking', name: 'Delhi', region: 'NCR', title: 'Mini Truck Booking in Delhi | Goods Transport & Delivery' },
  { slug: 'noida-last-mile-delivery', name: 'Noida', region: 'NCR', title: 'Last-Mile Delivery in Noida | Goods Transport & Mini Truck' },
] as const;

export type CitySlug = (typeof SEO_CITIES)[number]['slug'];

export function getCityBySlug(slug: string): (typeof SEO_CITIES)[number] | null {
  return SEO_CITIES.find((c) => c.slug === slug) ?? null;
}

export function getCityDescription(name: string, region: string): string {
  return `Book goods transport and last-mile delivery in ${name}, ${region}. Liftngo connects you with verified drivers for mini truck booking, parcel delivery, and reliable logistics.`;
}
