/**
 * Booking / trip service.
 * The canonical implementation is in `tripService.ts`.
 * These re-exports maintain backward compatibility.
 */

export {
  createTrip as createBooking,
  getTrip as getBooking,
  cancelTrip as cancelBooking,
  type CreateTripPayload as CreateBookingPayload,
  type TripResponse as BookingResponse,
} from './tripService';
