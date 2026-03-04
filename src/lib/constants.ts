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
  PHONE: 'liftngo_phone',
  SELECTED_SERVICE: 'selected_service',
} as const;

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  PICKUP_LOCATION: '/pickup-location',
  PICKUP_LOCATION_EDIT: '/pickup-location/edit',
  TRIP_OPTIONS: '/trip-options',
  ADD_STOP: '/add-stop',
  PAYMENT: '/payment',
  BOOKING: '/booking',
  TRIP_COMPLETE: '/trip-complete',
  ABOUT: '/about',
  HISTORY: '/history',
} as const;

/** Demo/dev OTP – use env NEXT_PUBLIC_DEMO_OTP in .env.local; fallback only for local dev. */
export function getValidOtp(): string {
  if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_DEMO_OTP) {
    return process.env.NEXT_PUBLIC_DEMO_OTP;
  }
  return '4768'; // dev fallback only
}

/** Placeholder for phone input (demo only). */
export const CURRENT_MOBILE_PLACEHOLDER = '9065847341';
export const MOBILE_LENGTH = 10;
