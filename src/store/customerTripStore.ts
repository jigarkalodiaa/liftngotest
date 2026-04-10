'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { CustomerTripStatus, type Driver, type Location, type Trip } from '@/types/customerTrip';

export type SocketConnectionState = 'CONNECTED' | 'CONNECTING' | 'RECONNECTING' | 'FAILED' | 'DISCONNECTED';

/** Valid state transitions to prevent out-of-sync updates */
const VALID_TRANSITIONS: Record<CustomerTripStatus, CustomerTripStatus[]> = {
  [CustomerTripStatus.IDLE]: [CustomerTripStatus.SEARCHING],
  [CustomerTripStatus.SEARCHING]: [CustomerTripStatus.ASSIGNED, CustomerTripStatus.CANCELLED, CustomerTripStatus.EXPIRED],
  [CustomerTripStatus.ASSIGNED]: [CustomerTripStatus.ARRIVING, CustomerTripStatus.CANCELLED],
  [CustomerTripStatus.ARRIVING]: [CustomerTripStatus.PICKED_UP, CustomerTripStatus.CANCELLED],
  [CustomerTripStatus.PICKED_UP]: [CustomerTripStatus.IN_TRANSIT, CustomerTripStatus.CANCELLED],
  [CustomerTripStatus.IN_TRANSIT]: [CustomerTripStatus.COMPLETED, CustomerTripStatus.CANCELLED],
  [CustomerTripStatus.COMPLETED]: [],
  [CustomerTripStatus.CANCELLED]: [],
  [CustomerTripStatus.EXPIRED]: [],
};

function isValidTransition(from: CustomerTripStatus, to: CustomerTripStatus): boolean {
  // Allow same status (idempotent)
  if (from === to) return true;
  // Allow any transition to terminal states for recovery
  if (to === CustomerTripStatus.CANCELLED || to === CustomerTripStatus.EXPIRED) return true;
  return VALID_TRANSITIONS[from]?.includes(to) ?? false;
}

type CustomerTripStoreState = {
  currentTrip: Trip | null;
  tripStatus: CustomerTripStatus;
  isSearching: boolean;
  driver: Driver | null;
  driverLocation: Location | null;
  lastEventTimestamp: number;
  connectionState: SocketConnectionState;
  hasHydrated: boolean;
  startSearching: (trip: Trip) => void;
  assignDriver: (driver: Driver | null) => void;
  updateStatus: (status: CustomerTripStatus, timestamp: number) => void;
  updateLocation: (location: Location) => void;
  resetTrip: () => void;
  hydrateFromServer: (trip: Trip | null) => void;
  setConnectionState: (state: SocketConnectionState) => void;
  markHydrated: (value: boolean) => void;
};

const INITIAL_STATE = {
  currentTrip: null,
  tripStatus: CustomerTripStatus.IDLE,
  isSearching: false,
  driver: null,
  driverLocation: null,
  lastEventTimestamp: 0,
  connectionState: 'DISCONNECTED' as SocketConnectionState,
  hasHydrated: false,
};

export const useCustomerTripStore = create<CustomerTripStoreState>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,
      startSearching: (trip) =>
        set({
          currentTrip: trip,
          tripStatus: CustomerTripStatus.SEARCHING,
          isSearching: true,
          driver: null,
          driverLocation: null,
        }),
      assignDriver: (driver) =>
        set({
          driver,
          isSearching: false,
        }),
      updateStatus: (status, timestamp) =>
        set((state) => {
          // Prevent stale updates
          if (timestamp < state.lastEventTimestamp) {
            if (process.env.NODE_ENV === 'development') {
              console.debug('[trip-store] Ignoring stale update', { status, timestamp, lastEvent: state.lastEventTimestamp });
            }
            return state;
          }
          // Validate transition
          if (!isValidTransition(state.tripStatus, status)) {
            if (process.env.NODE_ENV === 'development') {
              console.warn('[trip-store] Invalid transition', { from: state.tripStatus, to: status });
            }
            return state;
          }
          return {
            tripStatus: status,
            isSearching: status === CustomerTripStatus.SEARCHING,
            lastEventTimestamp: Math.max(state.lastEventTimestamp, timestamp),
          };
        }),
      updateLocation: (location) => set({ driverLocation: location }),
      resetTrip: () =>
        set({
          currentTrip: null,
          tripStatus: CustomerTripStatus.IDLE,
          isSearching: false,
          driver: null,
          driverLocation: null,
          lastEventTimestamp: 0,
        }),
      hydrateFromServer: (trip) =>
        set((state) => {
          if (!trip) {
            return {
              ...state,
              currentTrip: null,
              tripStatus: CustomerTripStatus.IDLE,
              isSearching: false,
              driver: null,
              driverLocation: null,
              lastEventTimestamp: Date.now(),
            };
          }
          const nextStatus = mapTripStatus(trip.status);
          return {
            ...state,
            currentTrip: trip,
            tripStatus: nextStatus,
            isSearching: nextStatus === CustomerTripStatus.SEARCHING,
            lastEventTimestamp: Date.now(),
          };
        }),
      setConnectionState: (connectionState) => set({ connectionState }),
      markHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: 'liftngo_customer_trip_store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentTrip: state.currentTrip,
        tripStatus: state.tripStatus,
        isSearching: state.isSearching,
        driver: state.driver,
        driverLocation: state.driverLocation,
        lastEventTimestamp: state.lastEventTimestamp,
      }),
      onRehydrateStorage: () => (state) => {
        state?.markHydrated(true);
      },
    },
  ),
);

export function mapTripStatus(status: string | CustomerTripStatus | undefined): CustomerTripStatus {
  const normalized = String(status ?? '').toUpperCase();
  switch (normalized) {
    case CustomerTripStatus.SEARCHING:
      return CustomerTripStatus.SEARCHING;
    case CustomerTripStatus.ASSIGNED:
      return CustomerTripStatus.ASSIGNED;
    case CustomerTripStatus.ARRIVING:
      return CustomerTripStatus.ARRIVING;
    case CustomerTripStatus.PICKED_UP:
      return CustomerTripStatus.PICKED_UP;
    case 'IN_PROGRESS':
    case CustomerTripStatus.IN_TRANSIT:
      return CustomerTripStatus.IN_TRANSIT;
    case CustomerTripStatus.COMPLETED:
      return CustomerTripStatus.COMPLETED;
    case CustomerTripStatus.CANCELLED:
      return CustomerTripStatus.CANCELLED;
    case CustomerTripStatus.EXPIRED:
      return CustomerTripStatus.EXPIRED;
    default:
      return CustomerTripStatus.IDLE;
  }
}
