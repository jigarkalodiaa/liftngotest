/**
 * Restaurants in Khatushyam Ji area – for Find Restaurant page.
 * Replace with real data/API when available.
 */

import { indiaPhotoFoodTable, indiaPhotoRetailMarketGoods } from '@/config/indiaLogisticsImages';

const FOOD_COVER = indiaPhotoFoodTable(800);
const MKT_COVER = indiaPhotoRetailMarketGoods(800);
const FOOD_DISH = indiaPhotoFoodTable(400);
const MKT_DISH = indiaPhotoRetailMarketGoods(400);

export interface MenuItem {
  name: string;
  price: string;
  category?: string;
  /** Dish photo (optimized URL, e.g. Unsplash). Shown on restaurant menu. */
  image?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  address?: string;
  phone?: string;
  menu: MenuItem[];
  /** Hero image on find-restaurant cards (falls back to first menu photo). */
  coverImage?: string;
  /** Short badge line e.g. "Fast delivery · Pure veg · Near temple" */
  listingTags?: string;
  rating?: number;
  /** e.g. "~3 min from temple" */
  distanceLabel?: string;
  /** Typical delivery window copy for listing cards */
  deliveryEstimate?: string;
  /** Listing card ETA line, e.g. "10 - 15 Min" */
  listingEta?: string;
  /** Listing card distance, e.g. "2.7 km" */
  listingDistance?: string;
  /** Show "Pure Veg" pill on listing card */
  pureVeg?: boolean;
  /** Show "Near Temple" pill on listing card */
  nearTemple?: boolean;
}

export const RESTAURANTS_KHATUSHYAM: Restaurant[] = [
  {
    id: 'shyam-bhojanalay',
    name: 'Shyam Bhojanalay',
    description: 'Pure veg restaurant near Khatushyam Ji temple. North Indian & Rajasthani thalis.',
    address: 'Near Khatushyam Ji Temple, Khatushyam Ji',
    phone: '+91 98291 12345',
    coverImage: FOOD_COVER,
    listingTags: 'Fast pickup · Pure veg · Near temple',
    rating: 4.9,
    distanceLabel: '~2 min from temple',
    deliveryEstimate: 'Est. delivery 25–40 min',
    listingEta: '10 - 15 Min',
    listingDistance: '2.7 km',
    pureVeg: true,
    nearTemple: true,
    menu: [
      {
        name: 'Rajasthani Thali',
        price: '₹120',
        category: 'Thali',
        image: FOOD_DISH,
      },
      {
        name: 'Dal Bati Churma',
        price: '₹100',
        category: 'Rajasthani',
        image: MKT_DISH,
      },
      {
        name: 'Kadi Chawal',
        price: '₹80',
        category: 'Main',
        image: FOOD_DISH,
      },
      {
        name: 'Pav Bhaji',
        price: '₹60',
        category: 'Snacks',
        image: MKT_DISH,
      },
      {
        name: 'Chole Bhature',
        price: '₹70',
        category: 'North Indian',
        image: FOOD_DISH,
      },
      {
        name: 'Lassi',
        price: '₹30',
        category: 'Beverages',
        image: MKT_DISH,
      },
    ],
  },
  {
    id: 'baba-ka-dhaba',
    name: 'Baba Ka Dhaba',
    description: 'Classic dhaba-style vegetarian food. Quick service for pilgrims.',
    address: 'Main Road, Khatushyam Ji',
    phone: '+91 98291 23456',
    coverImage: MKT_COVER,
    listingTags: 'Quick service · Pure veg · Pilgrim favourite',
    rating: 4.8,
    distanceLabel: 'Main road · Temple lane',
    deliveryEstimate: 'Est. delivery 20–35 min',
    listingEta: '15 - 25 Min',
    listingDistance: '3.1 km',
    pureVeg: true,
    nearTemple: false,
    menu: [
      {
        name: 'Rajma Chawal',
        price: '₹70',
        category: 'Main',
        image: MKT_DISH,
      },
      {
        name: 'Aloo Paratha',
        price: '₹50',
        category: 'Paratha',
        image: FOOD_DISH,
      },
      {
        name: 'Mix Veg',
        price: '₹90',
        category: 'Main',
        image: MKT_DISH,
      },
      {
        name: 'Paneer Butter Masala',
        price: '₹130',
        category: 'Curry',
        image: FOOD_DISH,
      },
      {
        name: 'Roti',
        price: '₹10',
        category: 'Bread',
        image: MKT_DISH,
      },
      {
        name: 'Chai',
        price: '₹15',
        category: 'Beverages',
        image: FOOD_DISH,
      },
    ],
  },
  {
    id: 'shyam-prasad',
    name: 'Shyam Prasad',
    description: 'Prasad & meals for devotees. Simple, hygienic vegetarian meals.',
    address: 'Temple Road, Khatushyam Ji',
    phone: '+91 98291 34567',
    coverImage: FOOD_COVER,
    listingTags: 'Prasad & meals · Hygienic · Temple road',
    rating: 4.9,
    distanceLabel: '~4 min walk',
    deliveryEstimate: 'Est. delivery 30–45 min',
    listingEta: '12 - 20 Min',
    listingDistance: '1.4 km',
    pureVeg: true,
    nearTemple: true,
    menu: [
      {
        name: 'Prasad Thali',
        price: '₹80',
        category: 'Prasad',
        image: FOOD_DISH,
      },
      {
        name: 'Halwa',
        price: '₹40',
        category: 'Sweet',
        image: MKT_DISH,
      },
      {
        name: 'Puri Sabzi',
        price: '₹60',
        category: 'Breakfast',
        image: FOOD_DISH,
      },
      {
        name: 'Rice Dal',
        price: '₹55',
        category: 'Main',
        image: MKT_DISH,
      },
      {
        name: 'Gulab Jamun',
        price: '₹35',
        category: 'Sweet',
        image: FOOD_DISH,
      },
      {
        name: 'Sharbat',
        price: '₹25',
        category: 'Beverages',
        image: MKT_DISH,
      },
    ],
  },
  {
    id: 'maharaj-restaurant',
    name: 'Maharaj Restaurant',
    description: 'Multi-cuisine veg restaurant. Comfortable seating for families.',
    address: 'Near Bus Stand, Khatushyam Ji',
    phone: '+91 98291 45678',
    coverImage: MKT_COVER,
    listingTags: 'Family friendly · Pure veg · Near bus stand',
    rating: 4.7,
    distanceLabel: '~6 min from temple',
    deliveryEstimate: 'Est. delivery 35–50 min',
    listingEta: '20 - 30 Min',
    listingDistance: '4.2 km',
    pureVeg: true,
    nearTemple: false,
    menu: [
      {
        name: 'Veg Biryani',
        price: '₹110',
        category: 'Rice',
        image: FOOD_DISH,
      },
      {
        name: 'Pav Bhaji',
        price: '₹65',
        category: 'Snacks',
        image: MKT_DISH,
      },
      {
        name: 'Veg Pulao',
        price: '₹85',
        category: 'Rice',
        image: FOOD_DISH,
      },
      {
        name: 'Dal Fry',
        price: '₹75',
        category: 'Dal',
        image: MKT_DISH,
      },
      {
        name: 'Veg Fried Rice',
        price: '₹95',
        category: 'Rice',
        image: FOOD_DISH,
      },
      {
        name: 'Cold Coffee',
        price: '₹45',
        category: 'Beverages',
        image: MKT_DISH,
      },
    ],
  },
];

const DEFAULT_RESTAURANT_COVER = FOOD_COVER;

export function getRestaurantCoverImage(r: Restaurant): string {
  if (r.coverImage) return r.coverImage;
  const first = r.menu.find((m) => m.image)?.image;
  return first ?? DEFAULT_RESTAURANT_COVER;
}

export function getRestaurantById(id: string): Restaurant | undefined {
  return RESTAURANTS_KHATUSHYAM.find((r) => r.id === id);
}

/** Parse price string (e.g. "₹120") to number for total calculation. */
export function parsePrice(priceStr: string): number {
  const num = parseInt(priceStr.replace(/\D/g, ''), 10);
  return Number.isNaN(num) ? 0 : num;
}

/** Restaurant owner WhatsApp number for order (as of now). Include country code for wa.me link. */
export const RESTAURANT_OWNER_WHATSAPP = '918588808581';
