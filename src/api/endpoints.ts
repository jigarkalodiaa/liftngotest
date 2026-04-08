/**
 * API route constants — use instead of string literals.
 * - `EXTERNAL_*`: appended to configured external base (except `/api/*`, which stay on this app).
 * - `NEXT_*`: same-origin Next.js Route Handlers.
 */

export { API_PATHS } from '@/config/api';

/** Next.js `app/api/*` routes (relative, same origin). */
export const NEXT_API = {
  getLocationDetails: '/api/get-location-details',
  khatuHotels: '/api/khatu/hotels',
  khatuHotelById: (id: string) => `/api/khatu/hotels/${encodeURIComponent(id)}`,
  khatuShops: '/api/khatu/shops',
  khatuShopById: (id: string) => `/api/khatu/shops/${encodeURIComponent(id)}`,
  khatuOrder: '/api/khatu/order',
  bookRide: '/api/book-ride',
  chatLog: '/api/chat/log',
  leads: '/api/leads',
} as const;

export const USER_API = {
  me: '/users/me',
} as const;
