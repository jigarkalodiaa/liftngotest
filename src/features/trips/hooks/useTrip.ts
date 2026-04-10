'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useTripStore, selectTrip, selectStatus, selectDriver, selectIsActive, TripStatus } from '../store';
import { tripService } from '../services/tripService';
import { useMutation } from '@/shared/hooks';
import { logger } from '@/lib/logger';
import type { Location } from '../store';

interface UseTripOptions {
  /** Auto-fetch active trip on mount */
  autoFetch?: boolean;
  /** Poll interval for trip updates (ms) */
  pollInterval?: number;
}

/**
 * Hook for trip management with edge case handling
 */
export function useTrip(options: UseTripOptions = {}) {
  const { autoFetch = true, pollInterval = 5000 } = options;
  
  // Store selectors
  const trip = useTripStore(selectTrip);
  const status = useTripStore(selectStatus);
  const driver = useTripStore(selectDriver);
  const isActive = useTripStore(selectIsActive);
  const hasHydrated = useTripStore((s) => s.hasHydrated);
  const error = useTripStore((s) => s.error);
  
  // Store actions
  const {
    startSearch,
    assignDriver,
    updateStatus,
    completeTrip,
    cancelTrip: storeCancelTrip,
    resetTrip,
    hydrateFromServer,
    setError,
    incrementRetry,
    resetRetry,
  } = useTripStore();

  // Refs for cleanup
  const pollRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  // Create trip mutation
  const createTripMutation = useMutation(
    async (data: { pickup: Location; drop: Location }) => {
      const response = await tripService.createTrip(data);
      startSearch(response.trip);
      return response;
    },
    {
      onError: (err) => {
        setError(err.message);
        incrementRetry();
      },
      onSuccess: () => {
        resetRetry();
      },
    }
  );

  // Cancel trip mutation
  const cancelTripMutation = useMutation(
    async (reason?: string) => {
      if (!trip) throw new Error('No active trip');
      await tripService.cancelTrip({ tripId: trip.id, reason });
      storeCancelTrip(reason);
    },
    {
      onError: (err) => {
        setError(err.message);
      },
    }
  );

  // Fetch active trip
  const fetchActiveTrip = useCallback(async () => {
    if (!isMountedRef.current) return;
    
    try {
      const response = await tripService.getActiveTrip();
      
      if (!isMountedRef.current) return;
      
      if (response) {
        hydrateFromServer(response.trip, response.driver);
      } else if (status !== TripStatus.IDLE) {
        // No active trip but store has one - sync
        resetTrip();
      }
    } catch (err) {
      logger.error('Failed to fetch active trip', { error: err });
    }
  }, [hydrateFromServer, resetTrip, status]);

  // Poll for updates when trip is active
  useEffect(() => {
    if (!isActive || !trip) {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
      return;
    }

    const poll = async () => {
      if (!isMountedRef.current || !trip) return;
      
      try {
        const response = await tripService.getTripDetails(trip.id);
        
        if (!isMountedRef.current) return;
        
        // Update status if changed
        const newStatus = response.trip.status;
        if (newStatus !== status) {
          updateStatus(newStatus as TripStatus);
        }
        
        // Update driver if assigned
        if (response.driver && !driver) {
          assignDriver(response.driver);
        }
      } catch (err) {
        logger.error('Failed to poll trip', { error: err });
      }
    };

    pollRef.current = setInterval(poll, pollInterval);

    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [isActive, trip, status, driver, pollInterval, updateStatus, assignDriver]);

  // Auto-fetch on mount
  useEffect(() => {
    isMountedRef.current = true;
    
    if (autoFetch && hasHydrated) {
      void fetchActiveTrip();
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [autoFetch, hasHydrated, fetchActiveTrip]);

  // Create trip with duplicate click prevention
  const createTrip = useCallback(
    async (pickup: Location, drop: Location) => {
      // Prevent duplicate clicks
      if (createTripMutation.isLoading) {
        logger.debug('Create trip already in progress');
        return null;
      }
      
      // Prevent creating if already active
      if (isActive) {
        logger.warn('Cannot create trip: already active');
        setError('You already have an active trip');
        return null;
      }
      
      return createTripMutation.mutate({ pickup, drop });
    },
    [createTripMutation, isActive, setError]
  );

  // Cancel with duplicate click prevention
  const cancelTrip = useCallback(
    async (reason?: string) => {
      if (cancelTripMutation.isLoading) {
        logger.debug('Cancel already in progress');
        return;
      }
      
      if (!trip) {
        logger.warn('No trip to cancel');
        return;
      }
      
      await cancelTripMutation.mutate(reason);
    },
    [cancelTripMutation, trip]
  );

  return {
    // State
    trip,
    status,
    driver,
    isActive,
    error,
    
    // Loading states
    isCreating: createTripMutation.isLoading,
    isCancelling: cancelTripMutation.isLoading,
    
    // Actions
    createTrip,
    cancelTrip,
    resetTrip,
    refresh: fetchActiveTrip,
  };
}

export default useTrip;
