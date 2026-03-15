/**
 * Restaurants in Khatushyam Ji area – for Find Restaurant page.
 * Replace with real data/API when available.
 */

export interface MenuItem {
  name: string;
  price: string;
  category?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  address?: string;
  phone?: string;
  menu: MenuItem[];
}

export const RESTAURANTS_KHATUSHYAM: Restaurant[] = [
  {
    id: 'shyam-bhojanalay',
    name: 'Shyam Bhojanalay',
    description: 'Pure veg restaurant near Khatushyam Ji temple. North Indian & Rajasthani thalis.',
    address: 'Near Khatushyam Ji Temple, Khatushyam Ji',
    phone: '+91 98291 12345',
    menu: [
      { name: 'Rajasthani Thali', price: '₹120', category: 'Thali' },
      { name: 'Dal Bati Churma', price: '₹100', category: 'Rajasthani' },
      { name: 'Kadi Chawal', price: '₹80', category: 'Main' },
      { name: 'Pav Bhaji', price: '₹60', category: 'Snacks' },
      { name: 'Chole Bhature', price: '₹70', category: 'North Indian' },
      { name: 'Lassi', price: '₹30', category: 'Beverages' },
    ],
  },
  {
    id: 'baba-ka-dhaba',
    name: 'Baba Ka Dhaba',
    description: 'Classic dhaba-style vegetarian food. Quick service for pilgrims.',
    address: 'Main Road, Khatushyam Ji',
    phone: '+91 98291 23456',
    menu: [
      { name: 'Rajma Chawal', price: '₹70', category: 'Main' },
      { name: 'Aloo Paratha', price: '₹50', category: 'Paratha' },
      { name: 'Mix Veg', price: '₹90', category: 'Main' },
      { name: 'Paneer Butter Masala', price: '₹130', category: 'Curry' },
      { name: 'Roti', price: '₹10', category: 'Bread' },
      { name: 'Chai', price: '₹15', category: 'Beverages' },
    ],
  },
  {
    id: 'shyam-prasad',
    name: 'Shyam Prasad',
    description: 'Prasad & meals for devotees. Simple, hygienic vegetarian meals.',
    address: 'Temple Road, Khatushyam Ji',
    phone: '+91 98291 34567',
    menu: [
      { name: 'Prasad Thali', price: '₹80', category: 'Prasad' },
      { name: 'Halwa', price: '₹40', category: 'Sweet' },
      { name: 'Puri Sabzi', price: '₹60', category: 'Breakfast' },
      { name: 'Rice Dal', price: '₹55', category: 'Main' },
      { name: 'Gulab Jamun', price: '₹35', category: 'Sweet' },
      { name: 'Sharbat', price: '₹25', category: 'Beverages' },
    ],
  },
  {
    id: 'maharaj-restaurant',
    name: 'Maharaj Restaurant',
    description: 'Multi-cuisine veg restaurant. Comfortable seating for families.',
    address: 'Near Bus Stand, Khatushyam Ji',
    phone: '+91 98291 45678',
    menu: [
      { name: 'Veg Biryani', price: '₹110', category: 'Rice' },
      { name: 'Pav Bhaji', price: '₹65', category: 'Snacks' },
      { name: 'Veg Pulao', price: '₹85', category: 'Rice' },
      { name: 'Dal Fry', price: '₹75', category: 'Dal' },
      { name: 'Veg Fried Rice', price: '₹95', category: 'Rice' },
      { name: 'Cold Coffee', price: '₹45', category: 'Beverages' },
    ],
  },
];

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
