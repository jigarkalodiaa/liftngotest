'use client';

import { useQuery } from '@tanstack/react-query';
import { getTripDriverStatus } from '@/api/services/driverService';

export const driverKeys = {
  status: (bookingId: string) => ['driver', 'status', bookingId] as const,
};

export function useDriverStatus(bookingId: string | null, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: driverKeys.status(bookingId ?? ''),
    queryFn: () => getTripDriverStatus(bookingId!),
    enabled: Boolean(bookingId && (options?.enabled !== false)),
  });
}
