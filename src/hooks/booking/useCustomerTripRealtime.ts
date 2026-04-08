'use client';

import { useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
  cancelTripPatch,
  createTrip,
  type CreateTripPayload,
  type TripResponse,
} from '@/api/services/tripService';
import { customerTripLifecycle } from '@/services/customerTripLifecycle';
import { useCustomerTripStore } from '@/store/customerTripStore';
import { CustomerTripStatus } from '@/types/customerTrip';

export function useCustomerTripRealtime(userId: string | null | undefined) {
  const { connectionState, currentTrip, tripStatus, isSearching, driver, driverLocation, hasHydrated } =
    useCustomerTripStore((state) => ({
      connectionState: state.connectionState,
      currentTrip: state.currentTrip,
      tripStatus: state.tripStatus,
      isSearching: state.isSearching,
      driver: state.driver,
      driverLocation: state.driverLocation,
      hasHydrated: state.hasHydrated,
    }));

  useEffect(() => {
    if (!userId) return;
    customerTripLifecycle.start(userId);
    return () => customerTripLifecycle.stop();
  }, [userId]);

  const createTripMutation = useMutation<TripResponse, Error, CreateTripPayload>({
    mutationFn: createTrip,
    onMutate: (payload) => {
      const optimisticTrip = {
        id: `temp-${Date.now()}`,
        status: CustomerTripStatus.SEARCHING,
        originAddress: payload.origin.address,
        destinationAddress: payload.destination.address,
      };
      customerTripLifecycle.markTripCreated(optimisticTrip);
    },
    onSuccess: (trip) => {
      customerTripLifecycle.markTripCreated({
        ...trip,
        status: CustomerTripStatus.SEARCHING,
      });
    },
    onError: () => {
      useCustomerTripStore.getState().resetTrip();
    },
  });

  const cancelTripMutation = useMutation<void, Error, { tripId: string; reason?: string }>({
    mutationFn: ({ tripId, reason }) => cancelTripPatch(tripId, reason),
    onSettled: () => {
      useCustomerTripStore.getState().resetTrip();
    },
  });

  return {
    connectionState,
    currentTrip,
    tripStatus,
    isSearching,
    driver,
    driverLocation,
    hasHydrated,
    createTripMutation,
    cancelTripMutation,
    syncActiveTrip: () => customerTripLifecycle.syncActiveTrip(),
  };
}
