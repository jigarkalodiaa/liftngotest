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
} as const;

/** sessionStorage — cleared when the tab closes; not shared across tabs. */
export const SESSION_KEYS = {
  /** After OTP success, navigate here if set (e.g. landing “Enter pickup” → /pickup-location). */
  POST_LOGIN_PATH: 'liftngo_post_login_path',
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
  HISTORY: '/history',
  FIND_RESTAURANT: '/find-restaurant',
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
