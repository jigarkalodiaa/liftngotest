/**
 * App-wide constants: storage keys, routes, and config.
 * Avoids magic strings and centralizes configuration.
 * Demo OTP: set NEXT_PUBLIC_DEMO_OTP in .env.local for local/dev; never commit real secrets.
 */

export const STORAGE_KEYS = {
  PICKUP_LOCATION: 'pickup_location',
  DROP_LOCATION: 'drop_location',
  STOP_LOCATION: 'stop_location',
  SENDER_DETAILS: 'sender_details',
  RECEIVER_DETAILS: 'receiver_details',
  STOP_DETAILS: 'stop_details',
  LANDING_PICKUP_LOCATION: 'landing_pickup_location',
  LOGGED_IN: 'liftngo_logged_in',
  AUTH_TOKEN: 'liftngo_auth_token',
  PHONE: 'liftngo_phone',
  SELECTED_SERVICE: 'selected_service',
  DELIVERY_GOODS_DESCRIPTION: 'delivery_goods_description',
  /** User-added entries from dashboard “Add More Default Location”. */
  CUSTOM_DEFAULT_TRIPS: 'custom_default_trips',
  /** Menu → My Details: name, phones, emergency contact, AC no, address */
  USER_PROFILE: 'liftngo_user_profile',
  /** Persisted food menu cart while browsing / after login (keyed by `restaurantId`). */
  FOOD_ORDER_CART_DRAFT: 'liftngo_food_order_cart_draft',
} as const;

/** sessionStorage — cleared when the tab closes; not shared across tabs. */
export const SESSION_KEYS = {
  /**
   * After OTP success, navigate here (pathname + optional `?query`). Must stay under `/pickup-location` only.
   */
  POST_LOGIN_PATH: 'liftngo_post_login_path',
  /** One-shot banner copy on /login (e.g. “Please login to continue…”). */
  LOGIN_CONTINUATION_MESSAGE: 'liftngo_login_continuation_message',
} as const;

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  MY_DETAILS: '/my-details',
  PICKUP_LOCATION: '/pickup-location',
  PICKUP_LOCATION_EDIT: '/pickup-location/edit',
  TRIP_OPTIONS: '/trip-options',
  SCHEDULE_LATER: '/schedule-later',
  ADD_STOP: '/add-stop',
  PAYMENT: '/payment',
  BOOKING: '/booking',
  TRIP_COMPLETE: '/trip-complete',
  ABOUT: '/about',
  /** SEO / marketing: B2B delivery positioning (linked from About highlights). */
  ABOUT_B2B_LOGISTICS: '/about/b2b-logistics',
  /** Three-wheel cargo: EV + CNG/diesel/petrol (About highlight). */
  ABOUT_THREE_WHEEL_CARGO: '/about/electric-three-wheel-cargo',
  /** Khatu Shyam Ji corridor: supply chain + trusted discovery (About highlight). */
  ABOUT_KHATU_SUPPLY_CHAIN: '/about/khatu-supply-chain',
  /** SEO / conversion landing pages. */
  LOGISTICS_KHATU: '/logistics-khatu',
  B2B_TRANSPORT: '/b2b-transport',
  BOOK_DELIVERY: '/book-delivery',
  /** Location SEO: hyperlocal Khatu Shyam Ji */
  KHATU_SHYAM_LOGISTICS: '/khatu-shyam-logistics',
  /** Location SEO: B2B Noida & Delhi NCR */
  NOIDA_B2B_LOGISTICS: '/noida-b2b-logistics',
  HISTORY: '/history',
  FIND_RESTAURANT: '/find-restaurant',
  /** Dedicated login screen (food booking & guarded flows redirect here). */
  LOGIN: '/login',
  /** Marketing alias → restaurant discovery (see next.config redirect). */
  FOOD_MENU: '/food-menu',
} as const;

/** `?mode=` on `/pickup-location` — dashboard “Add more default location” (pickup → drop, then trip options). */
export const PICKUP_LOCATION_MODE_DEFAULTS = 'defaults';

import { DEMO_OTP, SUPPORT_PHONE } from '@/config/env';

/** Demo/dev OTP – use NEXT_PUBLIC_DEMO_OTP in .env.local; fallback only for local dev. */
export function getValidOtp(): string {
  if (DEMO_OTP) return DEMO_OTP;
  return '4768'; // dev fallback only when env not set
}

/** Placeholder for phone input (demo only). Driven by NEXT_PUBLIC_SUPPORT_PHONE when set. */
export const CURRENT_MOBILE_PLACEHOLDER = SUPPORT_PHONE || '9065847341';
export const MOBILE_LENGTH = 10;
