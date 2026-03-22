/**
 * API path constants.
 * Use these instead of hardcoded strings for consistency and easier versioning.
 */

export const API_PATHS = {
  bookings: '/bookings',
  bookingById: (id: string) => `/bookings/${id}`,
  bookingCancel: (id: string) => `/bookings/${id}/cancel`,
  bookingEstimate: '/bookings/estimate',
  bookingDriver: (id: string) => `/bookings/${id}/driver`,
  bookingDriverLocation: (id: string) => `/bookings/${id}/driver/location`,
} as const;
