/** Khatu / food-delivery feature: URLs, copy, and static config. */

export const KHATUSHYAM_JI_ADDRESS_SUFFIX = ', Khatushyam Ji' as const;

export const GOOGLE_MAPS_KHATUSHYAM_URL =
  'https://www.google.com/maps/search/?api=1&query=' +
  encodeURIComponent('Khatu Shyam Ji Temple, Khatu, Sikar, Rajasthan, India');

export const FOOD_LISTING_HERO_IMAGE =
  'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&w=1400&q=88&fit=crop';

export const FOOD_DELIVERY_MICRO_TRUST = [
  'Verified by Liftngo',
  'Trusted food partners',
  'Fresh & hygienic',
] as const;

/** Single-line trust strip on listing (joined with middot). */
export const FOOD_LISTING_MICRO_TRUST_LINE = FOOD_DELIVERY_MICRO_TRUST.join(' · ');

export const FOOD_RESTAURANT_CARD_TAGS = ['Fresh Food', 'Fast Delivery', 'Near Temple'] as const;
