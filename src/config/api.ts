/**
 * API path constants.
 * Use these instead of hardcoded strings for consistency and easier versioning.
 */

export const API_PATHS = {
  trips: '/trips',
  tripsActive: '/trips/active',
  tripById: (id: string) => `/trips/${id}`,
  tripCancel: (id: string) => `/trips/${id}/cancel`,
  tripDirections: '/trips/directions',
  tripDriver: (id: string) => `/trips/${id}/driver`,
  tripDriverLocation: (id: string) => `/trips/${id}/driver/location`,
  /** @deprecated Use `trips` instead. */
  bookings: '/trips',
  /** @deprecated Use `tripById` instead. */
  bookingById: (id: string) => `/trips/${id}`,
  /** @deprecated Use `tripCancel` instead. */
  bookingCancel: (id: string) => `/trips/${id}/cancel`,
  /** @deprecated */
  bookingEstimate: '/trips/directions',
  /** @deprecated Use `tripDriver` instead. */
  bookingDriver: (id: string) => `/trips/${id}/driver`,
  /** @deprecated Use `tripDriverLocation` instead. */
  bookingDriverLocation: (id: string) => `/trips/${id}/driver/location`,
} as const;
