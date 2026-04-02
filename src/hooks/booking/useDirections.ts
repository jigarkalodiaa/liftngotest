'use client';

import { useQuery } from '@tanstack/react-query';
import { getDirections, type DirectionsResponse } from '@/api/services/tripService';

export const directionsKeys = {
  route: (
    oLat: number, oLng: number,
    dLat: number, dLng: number,
  ) => ['directions', oLat, oLng, dLat, dLng] as const,
};

/**
 * Fetch route directions + vehicle fares for a pickup/drop pair.
 * Only fires when both origin and destination have valid coordinates.
 */
export function useDirections(
  origin: { latitude?: number; longitude?: number } | null,
  destination: { latitude?: number; longitude?: number } | null,
) {
  const oLat = origin?.latitude;
  const oLng = origin?.longitude;
  const dLat = destination?.latitude;
  const dLng = destination?.longitude;
  const hasCoords =
    typeof oLat === 'number' && typeof oLng === 'number' &&
    typeof dLat === 'number' && typeof dLng === 'number';

  return useQuery<DirectionsResponse>({
    queryKey: directionsKeys.route(oLat ?? 0, oLng ?? 0, dLat ?? 0, dLng ?? 0),
    queryFn: () =>
      getDirections({
        origin: { latitude: oLat!, longitude: oLng! },
        destination: { latitude: dLat!, longitude: dLng! },
      }),
    enabled: hasCoords,
    staleTime: 5 * 60 * 1000,
  });
}
