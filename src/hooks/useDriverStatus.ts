'use client';

import { useQuery } from '@tanstack/react-query';
import { getTripDriverStatus } from '@/services/driverService';

/** Query key factory for driver/booking (TRD §6: use query keys for caching) */
export const driverKeys = {
  status: (bookingId: string) => ['driver', 'status', bookingId] as const,
};

/**
 * Fetch driver status for a booking. No direct API calls in components – use this hook (TRD §6).
 */
export function useDriverStatus(bookingId: string | null, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: driverKeys.status(bookingId ?? ''),
    queryFn: () => getTripDriverStatus(bookingId!),
    enabled: Boolean(bookingId && (options?.enabled !== false)),
  });
}
