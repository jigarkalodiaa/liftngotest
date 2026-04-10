/**
 * Trip Service - API calls for trip management
 */

import { apiClient } from '@/lib/api';
import { logger } from '@/lib/logger';
import type { Trip, Driver, Location } from '../store';

// API Response types
interface CreateTripRequest {
  pickup: Location;
  drop: Location;
  vehicleType?: string;
  paymentMethod?: string;
}

interface CreateTripResponse {
  trip: Trip;
  estimatedFare: number;
  estimatedDuration: number;
  estimatedDistance: number;
}

interface TripDetailsResponse {
  trip: Trip;
  driver: Driver | null;
  driverLocation: Location | null;
}

interface CancelTripRequest {
  tripId: string;
  reason?: string;
}

// Endpoints
const ENDPOINTS = {
  createTrip: '/trips',
  getTrip: (id: string) => `/trips/${id}`,
  cancelTrip: (id: string) => `/trips/${id}/cancel`,
  rateTrip: (id: string) => `/trips/${id}/rate`,
  getActiveTrip: '/trips/active',
  getTripHistory: '/trips/history',
} as const;

/**
 * Create a new trip
 */
export async function createTrip(data: CreateTripRequest): Promise<CreateTripResponse> {
  logger.info('Creating trip', { pickup: data.pickup.address, drop: data.drop.address });
  
  const response = await apiClient.post<CreateTripResponse>(ENDPOINTS.createTrip, data);
  
  logger.info('Trip created', { tripId: response.trip.id });
  
  return response;
}

/**
 * Get trip details
 */
export async function getTripDetails(tripId: string): Promise<TripDetailsResponse> {
  logger.debug('Fetching trip details', { tripId });
  
  return apiClient.get<TripDetailsResponse>(ENDPOINTS.getTrip(tripId));
}

/**
 * Get active trip (if any)
 */
export async function getActiveTrip(): Promise<TripDetailsResponse | null> {
  logger.debug('Fetching active trip');
  
  try {
    return await apiClient.get<TripDetailsResponse>(ENDPOINTS.getActiveTrip);
  } catch (error) {
    // 404 means no active trip - not an error
    if ((error as { status?: number }).status === 404) {
      return null;
    }
    throw error;
  }
}

/**
 * Cancel a trip
 */
export async function cancelTrip(data: CancelTripRequest): Promise<void> {
  logger.info('Cancelling trip', { tripId: data.tripId, reason: data.reason });
  
  await apiClient.post(ENDPOINTS.cancelTrip(data.tripId), { reason: data.reason });
  
  logger.info('Trip cancelled', { tripId: data.tripId });
}

/**
 * Rate a completed trip
 */
export async function rateTrip(tripId: string, rating: number, feedback?: string): Promise<void> {
  logger.info('Rating trip', { tripId, rating });
  
  await apiClient.post(ENDPOINTS.rateTrip(tripId), { rating, feedback });
}

/**
 * Get trip history
 */
export async function getTripHistory(params?: {
  page?: number;
  limit?: number;
}): Promise<{ trips: Trip[]; total: number }> {
  logger.debug('Fetching trip history', params);
  
  return apiClient.get(ENDPOINTS.getTripHistory, params);
}

export const tripService = {
  createTrip,
  getTripDetails,
  getActiveTrip,
  cancelTrip,
  rateTrip,
  getTripHistory,
};

export default tripService;
