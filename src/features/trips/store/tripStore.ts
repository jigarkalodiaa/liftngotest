'use client';

import { create } from 'zustand';
import { createJSONStorage, persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { logger } from '@/lib/logger';

// Types
export enum TripStatus {
  IDLE = 'IDLE',
  SEARCHING = 'SEARCHING',
  ASSIGNED = 'ASSIGNED',
  ARRIVING = 'ARRIVING',
  ARRIVED = 'ARRIVED',
  PICKED_UP = 'PICKED_UP',
  IN_TRANSIT = 'IN_TRANSIT',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
  FAILED = 'FAILED',
}

export type ConnectionState = 'CONNECTED' | 'CONNECTING' | 'RECONNECTING' | 'FAILED' | 'DISCONNECTED';

export interface Location {
  lat: number;
  lng: number;
  address?: string;
  timestamp?: number;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  photo?: string;
  rating?: number;
  vehicleNumber?: string;
  vehicleType?: string;
}

export interface Trip {
  id: string;
  status: TripStatus;
  pickup: Location;
  drop: Location;
  fare?: number;
  distance?: number;
  duration?: number;
  createdAt: string;
  updatedAt?: string;
}

interface TripState {
  // Core state
  currentTrip: Trip | null;
  status: TripStatus;
  driver: Driver | null;
  driverLocation: Location | null;
  
  // Connection state
  connectionState: ConnectionState;
  lastEventTimestamp: number;
  
  // UI state
  isSearching: boolean;
  hasHydrated: boolean;
  
  // Error handling
  error: string | null;
  retryCount: number;
}

interface TripActions {
  // Trip lifecycle
  startSearch: (trip: Trip) => void;
  assignDriver: (driver: Driver) => void;
  updateStatus: (status: TripStatus, timestamp?: number) => void;
  updateDriverLocation: (location: Location) => void;
  completeTrip: () => void;
  cancelTrip: (reason?: string) => void;
  resetTrip: () => void;
  
  // Hydration
  hydrateFromServer: (trip: Trip | null, driver?: Driver | null) => void;
  markHydrated: () => void;
  
  // Connection
  setConnectionState: (state: ConnectionState) => void;
  
  // Error handling
  setError: (error: string | null) => void;
  incrementRetry: () => void;
  resetRetry: () => void;
}

type TripStore = TripState & TripActions;

const INITIAL_STATE: TripState = {
  currentTrip: null,
  status: TripStatus.IDLE,
  driver: null,
  driverLocation: null,
  connectionState: 'DISCONNECTED',
  lastEventTimestamp: 0,
  isSearching: false,
  hasHydrated: false,
  error: null,
  retryCount: 0,
};

const MAX_RETRIES = 3;

/**
 * Map backend status to TripStatus enum
 */
export function mapTripStatus(status: string | undefined): TripStatus {
  if (!status) return TripStatus.IDLE;
  
  const normalized = status.toUpperCase().replace(/-/g, '_');
  
  const statusMap: Record<string, TripStatus> = {
    IDLE: TripStatus.IDLE,
    SEARCHING: TripStatus.SEARCHING,
    ASSIGNED: TripStatus.ASSIGNED,
    ARRIVING: TripStatus.ARRIVING,
    ARRIVED: TripStatus.ARRIVED,
    PICKED_UP: TripStatus.PICKED_UP,
    IN_PROGRESS: TripStatus.IN_TRANSIT,
    IN_TRANSIT: TripStatus.IN_TRANSIT,
    COMPLETED: TripStatus.COMPLETED,
    CANCELLED: TripStatus.CANCELLED,
    EXPIRED: TripStatus.EXPIRED,
    FAILED: TripStatus.FAILED,
  };
  
  return statusMap[normalized] ?? TripStatus.IDLE;
}

/**
 * Check if status transition is valid
 */
function isValidTransition(from: TripStatus, to: TripStatus): boolean {
  const validTransitions: Record<TripStatus, TripStatus[]> = {
    [TripStatus.IDLE]: [TripStatus.SEARCHING],
    [TripStatus.SEARCHING]: [TripStatus.ASSIGNED, TripStatus.CANCELLED, TripStatus.EXPIRED, TripStatus.FAILED],
    [TripStatus.ASSIGNED]: [TripStatus.ARRIVING, TripStatus.CANCELLED],
    [TripStatus.ARRIVING]: [TripStatus.ARRIVED, TripStatus.CANCELLED],
    [TripStatus.ARRIVED]: [TripStatus.PICKED_UP, TripStatus.CANCELLED],
    [TripStatus.PICKED_UP]: [TripStatus.IN_TRANSIT, TripStatus.CANCELLED],
    [TripStatus.IN_TRANSIT]: [TripStatus.COMPLETED, TripStatus.CANCELLED],
    [TripStatus.COMPLETED]: [],
    [TripStatus.CANCELLED]: [],
    [TripStatus.EXPIRED]: [],
    [TripStatus.FAILED]: [TripStatus.SEARCHING], // Allow retry
  };
  
  return validTransitions[from]?.includes(to) ?? false;
}

export const useTripStore = create<TripStore>()(
  subscribeWithSelector(
    persist(
      immer((set, get) => ({
        ...INITIAL_STATE,

        startSearch: (trip) => {
          const currentStatus = get().status;
          
          if (currentStatus !== TripStatus.IDLE && currentStatus !== TripStatus.FAILED) {
            logger.warn('Cannot start search: trip already in progress', { currentStatus });
            return;
          }
          
          logger.info('Starting trip search', { tripId: trip.id });
          
          set((state) => {
            state.currentTrip = trip;
            state.status = TripStatus.SEARCHING;
            state.isSearching = true;
            state.driver = null;
            state.driverLocation = null;
            state.error = null;
            state.retryCount = 0;
          });
        },

        assignDriver: (driver) => {
          const currentStatus = get().status;
          
          if (currentStatus !== TripStatus.SEARCHING) {
            logger.warn('Cannot assign driver: not searching', { currentStatus });
            return;
          }
          
          logger.info('Driver assigned', { driverId: driver.id });
          
          set((state) => {
            state.driver = driver;
            state.status = TripStatus.ASSIGNED;
            state.isSearching = false;
          });
        },

        updateStatus: (newStatus, timestamp) => {
          const currentStatus = get().status;
          
          // Validate transition
          if (!isValidTransition(currentStatus, newStatus)) {
            logger.warn('Invalid status transition', { from: currentStatus, to: newStatus });
            return;
          }
          
          // Prevent stale updates
          const eventTime = timestamp ?? Date.now();
          if (eventTime < get().lastEventTimestamp) {
            logger.debug('Ignoring stale status update', { eventTime, lastEvent: get().lastEventTimestamp });
            return;
          }
          
          logger.info('Trip status updated', { from: currentStatus, to: newStatus });
          
          set((state) => {
            state.status = newStatus;
            state.lastEventTimestamp = eventTime;
            state.isSearching = newStatus === TripStatus.SEARCHING;
            
            // Update trip status
            if (state.currentTrip) {
              state.currentTrip.status = newStatus;
              state.currentTrip.updatedAt = new Date().toISOString();
            }
          });
        },

        updateDriverLocation: (location) => {
          set((state) => {
            state.driverLocation = {
              ...location,
              timestamp: Date.now(),
            };
          });
        },

        completeTrip: () => {
          const currentStatus = get().status;
          
          if (currentStatus !== TripStatus.IN_TRANSIT) {
            logger.warn('Cannot complete trip: not in transit', { currentStatus });
            return;
          }
          
          logger.info('Trip completed');
          
          set((state) => {
            state.status = TripStatus.COMPLETED;
            state.isSearching = false;
            if (state.currentTrip) {
              state.currentTrip.status = TripStatus.COMPLETED;
              state.currentTrip.updatedAt = new Date().toISOString();
            }
          });
        },

        cancelTrip: (reason) => {
          const currentStatus = get().status;
          
          // Can't cancel completed or already cancelled trips
          if ([TripStatus.COMPLETED, TripStatus.CANCELLED, TripStatus.IDLE].includes(currentStatus)) {
            logger.warn('Cannot cancel trip', { currentStatus });
            return;
          }
          
          logger.info('Trip cancelled', { reason });
          
          set((state) => {
            state.status = TripStatus.CANCELLED;
            state.isSearching = false;
            if (state.currentTrip) {
              state.currentTrip.status = TripStatus.CANCELLED;
              state.currentTrip.updatedAt = new Date().toISOString();
            }
          });
        },

        resetTrip: () => {
          logger.info('Trip reset');
          
          set((state) => {
            state.currentTrip = null;
            state.status = TripStatus.IDLE;
            state.driver = null;
            state.driverLocation = null;
            state.isSearching = false;
            state.error = null;
            state.retryCount = 0;
            state.lastEventTimestamp = 0;
          });
        },

        hydrateFromServer: (trip, driver) => {
          logger.info('Hydrating from server', { tripId: trip?.id });
          
          set((state) => {
            if (!trip) {
              state.currentTrip = null;
              state.status = TripStatus.IDLE;
              state.driver = null;
              state.driverLocation = null;
              state.isSearching = false;
            } else {
              state.currentTrip = trip;
              state.status = mapTripStatus(trip.status as unknown as string);
              state.isSearching = state.status === TripStatus.SEARCHING;
              if (driver) {
                state.driver = driver;
              }
            }
            state.lastEventTimestamp = Date.now();
          });
        },

        markHydrated: () => {
          set((state) => {
            state.hasHydrated = true;
          });
        },

        setConnectionState: (connectionState) => {
          set((state) => {
            state.connectionState = connectionState;
          });
        },

        setError: (error) => {
          set((state) => {
            state.error = error;
          });
        },

        incrementRetry: () => {
          const currentRetry = get().retryCount;
          
          if (currentRetry >= MAX_RETRIES) {
            logger.error('Max retries exceeded');
            set((state) => {
              state.status = TripStatus.FAILED;
              state.isSearching = false;
              state.error = 'Failed after multiple attempts. Please try again.';
            });
            return;
          }
          
          set((state) => {
            state.retryCount = currentRetry + 1;
          });
        },

        resetRetry: () => {
          set((state) => {
            state.retryCount = 0;
          });
        },
      })),
      {
        name: 'liftngo_trip_store',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          currentTrip: state.currentTrip,
          status: state.status,
          driver: state.driver,
          driverLocation: state.driverLocation,
          lastEventTimestamp: state.lastEventTimestamp,
        }),
        onRehydrateStorage: () => (state) => {
          state?.markHydrated();
        },
      }
    )
  )
);

// Selectors for optimized re-renders
export const selectTrip = (state: TripStore) => state.currentTrip;
export const selectStatus = (state: TripStore) => state.status;
export const selectDriver = (state: TripStore) => state.driver;
export const selectDriverLocation = (state: TripStore) => state.driverLocation;
export const selectIsSearching = (state: TripStore) => state.isSearching;
export const selectConnectionState = (state: TripStore) => state.connectionState;
export const selectError = (state: TripStore) => state.error;

// Derived selectors
export const selectIsActive = (state: TripStore) => 
  ![TripStatus.IDLE, TripStatus.COMPLETED, TripStatus.CANCELLED, TripStatus.EXPIRED].includes(state.status);

export const selectCanCancel = (state: TripStore) =>
  ![TripStatus.IDLE, TripStatus.COMPLETED, TripStatus.CANCELLED, TripStatus.EXPIRED].includes(state.status);

export default useTripStore;
