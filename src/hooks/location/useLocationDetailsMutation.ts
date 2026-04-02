'use client';

import { useMutation } from '@tanstack/react-query';
import { fetchLocationDetails } from '@/api/services/locationService';

/** Resolve lat/lng → city/state/zone via `/api/get-location-details`. */
export function useLocationDetailsMutation() {
  return useMutation({
    mutationFn: ({ lat, lng }: { lat: number; lng: number }) => fetchLocationDetails(lat, lng),
  });
}
