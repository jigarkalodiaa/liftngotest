/**
 * Trip service — directions + booking via `POST /trips`.
 */

import apiClient from '@/api/client';
import { API_PATHS } from '@/api/endpoints';

/* ── Vehicle type mapping ── */

export type ApiVehicleType = 'BIKE' | 'AUTO' | 'MINI_TRUCK' | 'TRUCK';

const SERVICE_TO_VEHICLE: Record<string, ApiVehicleType> = {
  walk: 'BIKE',
  twoWheeler: 'BIKE',
  threeWheeler: 'AUTO',
  fourWheeler: 'MINI_TRUCK',
};

export function toApiVehicleType(serviceId: string): ApiVehicleType {
  return SERVICE_TO_VEHICLE[serviceId] ?? 'BIKE';
}

/* ── Directions / fare calculator ── */

export interface DirectionsRequest {
  origin: { latitude: number; longitude: number };
  destination: { latitude: number; longitude: number };
}

export interface VehicleFares {
  bike: number;
  auto: number;
  miniTruck: number;
  truck: number;
}

export interface DirectionsRoute {
  duration: number;
  durationFormatted: string;
  distance: number;
  distanceFormatted: string;
  vehicleFares: VehicleFares;
  currency: string;
  polyline: string;
  summary: string;
}

export interface DirectionsWaypoint {
  name: string;
  location: [number, number];
  distance: number;
}

export interface DirectionsResponse {
  code: string;
  routes: DirectionsRoute[];
  waypoints: DirectionsWaypoint[];
}

export async function getDirections(
  payload: DirectionsRequest,
): Promise<DirectionsResponse> {
  return apiClient.post<DirectionsResponse>(API_PATHS.tripDirections, payload);
}

/* ── Create trip (booking) ── */

export interface CreateTripPayload {
  origin: {
    address: string;
    latitude: number;
    longitude: number;
  };
  destination: {
    address: string;
    latitude: number;
    longitude: number;
  };
  vehicleType: ApiVehicleType;
  sender: {
    name: string;
    mobile: string;
  };
  receiver: {
    name: string;
    mobile: string;
  };
  packageDescription?: string;
  packageWeight?: number;
  specialInstructions?: string;
  gstin?: string;
  couponCode?: string;
  scheduledAt?: string;
}

export interface TripResponse {
  id: string;
  tripCode: string;
  customerId: string;
  vehicleType: ApiVehicleType;
  status: string;
  originAddress: string;
  originLatitude: number;
  originLongitude: number;
  destinationAddress: string;
  destinationLatitude: number;
  destinationLongitude: number;
  distanceMeters: number;
  durationSeconds: number;
  estimatedFare: number;
  currency: string;
  packageDescription: string | null;
  packageWeight: number | null;
  specialInstructions: string | null;
  senderName: string;
  senderMobile: string;
  receiverName: string;
  receiverMobile: string;
  gstin: string | null;
  couponCode: string | null;
  couponDiscount: number;
  gstAmount: number;
  platformFee: number;
  totalAmount: number;
  scheduledAt: string | null;
  driverId: string | null;
  actualFare: number | null;
  acceptedAt: string | null;
  pickedUpAt: string | null;
  deliveredAt: string | null;
  cancelledAt: string | null;
  cancellationReason: string | null;
  createdAt: string;
  updatedAt: string;
}

export async function createTrip(payload: CreateTripPayload): Promise<TripResponse> {
  return apiClient.post<TripResponse>(API_PATHS.trips, payload);
}

export async function getTrip(tripId: string): Promise<TripResponse> {
  return apiClient.get<TripResponse>(API_PATHS.tripById(tripId));
}

export async function cancelTrip(tripId: string, reason?: string): Promise<void> {
  return apiClient.post(API_PATHS.tripCancel(tripId), { reason });
}

export async function getActiveTrip(): Promise<TripResponse | null> {
  return apiClient.get<TripResponse | null>(API_PATHS.tripsActive);
}

/** Contract-specific cancel endpoint: PATCH `/trips/:id/cancel`. */
export async function cancelTripPatch(tripId: string, reason?: string): Promise<void> {
  return apiClient.patch(API_PATHS.tripCancel(tripId), { reason });
}
