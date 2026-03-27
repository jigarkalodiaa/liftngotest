/**
 * Restaurants in Khatushyam Ji area – for Find Restaurant page.
 * Replace with real data/API when available.
 */

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
}

export const RESTAURANTS_KHATUSHYAM: Restaurant[] = [
  {
    id: 'shyam-bhojanalay',
    name: 'Shyam Bhojanalay',
    description: 'Pure veg restaurant near Khatushyam Ji temple. North Indian & Rajasthani thalis.',
    address: 'Near Khatushyam Ji Temple, Khatushyam Ji',
    phone: '+91 98291 12345',
    menu: [
      {
        name: 'Rajasthani Thali',
        price: '₹120',
        category: 'Thali',
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&w=400&q=80&fit=crop',
      },
      {
        name: 'Dal Bati Churma',
        price: '₹100',
        category: 'Rajasthani',
        image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&w=400&q=80&fit=crop',
      },
      {
        name: 'Kadi Chawal',
        price: '₹80',
        category: 'Main',
        image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&w=400&q=80&fit=crop',
      },
      {
        name: 'Pav Bhaji',
        price: '₹60',
        category: 'Snacks',
        image: 'https://images.unsplash.com/photo-1567188049369-95dc7f684b4d?auto=format&w=400&q=80&fit=crop',
      },
      {
        name: 'Chole Bhature',
        price: '₹70',
        category: 'North Indian',
        image: 'https://images.unsplash.com/photo-1626082895609-733e665fbcdb?auto=format&w=400&q=80&fit=crop',
      },
      {
        name: 'Lassi',
        price: '₹30',
        category: 'Beverages',
        image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&w=400&q=80&fit=crop',
      },
    ],
  },
  {
    id: 'baba-ka-dhaba',
    name: 'Baba Ka Dhaba',
    description: 'Classic dhaba-style vegetarian food. Quick service for pilgrims.',
    address: 'Main Road, Khatushyam Ji',
    phone: '+91 98291 23456',
    menu: [
      {
        name: 'Rajma Chawal',
        price: '₹70',
        category: 'Main',
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&w=400&q=80&fit=crop',
      },
      {
        name: 'Aloo Paratha',
        price: '₹50',
        category: 'Paratha',
        image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&w=400&q=80&fit=crop',
      },
      {
        name: 'Mix Veg',
        price: '₹90',
        category: 'Main',
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&w=400&q=80&fit=crop',
      },
      {
        name: 'Paneer Butter Masala',
        price: '₹130',
        category: 'Curry',
        image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&w=400&q=80&fit=crop',
      },
      {
        name: 'Roti',
        price: '₹10',
        category: 'Bread',
        image: 'https://images.unsplash.com/photo-1626074353765-517a6e2c7f92?auto=format&w=400&q=80&fit=crop',
      },
      {
        name: 'Chai',
        price: '₹15',
        category: 'Beverages',
        image: 'https://images.unsplash.com/photo-1564890369479-cbc89a1260e0?auto=format&w=400&q=80&fit=crop',
      },
    ],
  },
  {
    id: 'shyam-prasad',
    name: 'Shyam Prasad',
    description: 'Prasad & meals for devotees. Simple, hygienic vegetarian meals.',
    address: 'Temple Road, Khatushyam Ji',
    phone: '+91 98291 34567',
    menu: [
      {
        name: 'Prasad Thali',
        price: '₹80',
        category: 'Prasad',
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&w=400&q=80&fit=crop',
      },
      {
        name: 'Halwa',
        price: '₹40',
        category: 'Sweet',
        image: 'https://images.unsplash.com/photo-1579958261526-e0576f5a7df9?auto=format&w=400&q=80&fit=crop',
      },
      {
        name: 'Puri Sabzi',
        price: '₹60',
        category: 'Breakfast',
        image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&w=400&q=80&fit=crop',
      },
      {
        name: 'Rice Dal',
        price: '₹55',
        category: 'Main',
        image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&w=400&q=80&fit=crop',
      },
      {
        name: 'Gulab Jamun',
        price: '₹35',
        category: 'Sweet',
        image: 'https://images.unsplash.com/photo-1598215439218-f658ebe1e47b?auto=format&w=400&q=80&fit=crop',
      },
      {
        name: 'Sharbat',
        price: '₹25',
        category: 'Beverages',
        image: 'https://images.unsplash.com/photo-1546171753-97d7676e4602?auto=format&w=400&q=80&fit=crop',
      },
    ],
  },
  {
    id: 'maharaj-restaurant',
    name: 'Maharaj Restaurant',
    description: 'Multi-cuisine veg restaurant. Comfortable seating for families.',
    address: 'Near Bus Stand, Khatushyam Ji',
    phone: '+91 98291 45678',
    menu: [
      {
        name: 'Veg Biryani',
        price: '₹110',
        category: 'Rice',
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&w=400&q=80&fit=crop',
      },
      {
        name: 'Pav Bhaji',
        price: '₹65',
        category: 'Snacks',
        image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&w=400&q=80&fit=crop',
      },
      {
        name: 'Veg Pulao',
        price: '₹85',
        category: 'Rice',
        image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&w=400&q=80&fit=crop',
      },
      {
        name: 'Dal Fry',
        price: '₹75',
        category: 'Dal',
        image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&w=400&q=80&fit=crop',
      },
      {
        name: 'Veg Fried Rice',
        price: '₹95',
        category: 'Rice',
        image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&w=400&q=80&fit=crop',
      },
      {
        name: 'Cold Coffee',
        price: '₹45',
        category: 'Beverages',
        image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&w=400&q=80&fit=crop',
      },
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
