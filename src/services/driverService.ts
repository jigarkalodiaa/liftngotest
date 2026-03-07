/**
 * Driver-related API endpoints (TRD §5).
 * Used for driver assignment, location, and trip status.
 */

import apiClient from './apiClient';

export interface DriverInfo {
  id: string;
  name: string;
  mobile: string;
  vehicleNumber: string;
  vehicleName: string;
  rating?: number;
  photoUrl?: string;
}

export interface TripDriverStatus {
  status: 'searching' | 'assigned' | 'arrived' | 'in_progress' | 'completed' | 'cancelled';
  driver?: DriverInfo;
  etaMinutes?: number;
  distanceMeters?: number;
}

export async function getTripDriverStatus(bookingId: string): Promise<TripDriverStatus> {
  const { data } = await apiClient.get<TripDriverStatus>(`/bookings/${bookingId}/driver`);
  return data;
}

export async function getDriverLocation(bookingId: string): Promise<{ lat: number; lng: number }> {
  const { data } = await apiClient.get<{ lat: number; lng: number }>(`/bookings/${bookingId}/driver/location`);
  return data;
}
