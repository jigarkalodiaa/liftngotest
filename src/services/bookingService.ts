/**
 * Booking-related API endpoints (TRD §5).
 * Service layer isolates business-specific API logic.
 */

import apiClient from './apiClient';
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
  const { data } = await apiClient.post<BookingResponse>('/bookings', payload);
  return data;
}

export async function getBooking(bookingId: string): Promise<BookingResponse> {
  const { data } = await apiClient.get<BookingResponse>(`/bookings/${bookingId}`);
  return data;
}

export async function cancelBooking(bookingId: string, reason?: string): Promise<void> {
  await apiClient.post(`/bookings/${bookingId}/cancel`, { reason });
}

/** Estimate fare for a trip (for display before booking) */
export async function estimateFare(params: {
  pickup: SavedLocation;
  drop: SavedLocation;
  serviceId: string;
}): Promise<{ amount: number; currency: string }> {
  const { data } = await apiClient.post<{ amount: number; currency: string }>('/bookings/estimate', params);
  return data;
}
