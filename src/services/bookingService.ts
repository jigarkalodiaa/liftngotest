/**
 * Booking-related API endpoints (TRD §5).
 * Service layer isolates business-specific API logic.
 */

import apiClient from './apiClient';
import { API_PATHS } from '@/config/api';
import type { DefaultTrip, SavedLocation, PersonDetails } from '@/types/booking';

export interface CreateBookingPayload {
  pickup: SavedLocation;
  drop: SavedLocation;
  sender: PersonDetails;
  receiver: PersonDetails;
  serviceId: string;
  goodTypeId?: string;
  weightKg?: number;
  packages?: number;
  gstin?: string;
  businessName?: string;
}

export interface BookingResponse {
  id: string;
  status: string;
  estimatedFare?: number;
  estimatedArrival?: string;
}

export async function createBooking(payload: CreateBookingPayload): Promise<BookingResponse> {
  const { data } = await apiClient.post<BookingResponse>(API_PATHS.bookings, payload);
  return data;
}

export async function getBooking(bookingId: string): Promise<BookingResponse> {
  const { data } = await apiClient.get<BookingResponse>(API_PATHS.bookingById(bookingId));
  return data;
}

export async function cancelBooking(bookingId: string, reason?: string): Promise<void> {
  await apiClient.post(API_PATHS.bookingCancel(bookingId), { reason });
}

/** Estimate fare for a trip (for display before booking) */
export async function estimateFare(params: {
  pickup: SavedLocation;
  drop: SavedLocation;
  serviceId: string;
}): Promise<{ amount: number; currency: string }> {
  const { data } = await apiClient.post<{ amount: number; currency: string }>(API_PATHS.bookingEstimate, params);
  return data;
}
