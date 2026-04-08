/**
 * API path constants.
 * Use these instead of hardcoded strings for consistency and easier versioning.
 */

export const API_PATHS = {
  /** Driver presence — PATCH body `{ isOnline: boolean }`. Resolves to `{API_BASE}/drivers/online` (plural) when base is e.g. `http://localhost:3001/api/v1`. */
  driverOnline: '/drivers/online',
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
