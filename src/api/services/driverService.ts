/**
 * Driver / trip status — external backend (`API_PATHS`).
 */

import apiClient from '@/api/client';
import { API_PATHS } from '@/api/endpoints';

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
  return apiClient.get<TripDriverStatus>(API_PATHS.bookingDriver(bookingId));
}

export async function getDriverLocation(bookingId: string): Promise<{ lat: number; lng: number }> {
  return apiClient.get<{ lat: number; lng: number }>(API_PATHS.bookingDriverLocation(bookingId));
}
