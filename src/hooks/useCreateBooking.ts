'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBooking, type CreateBookingPayload } from '@/services/bookingService';

/** Query key factory for bookings */
export const bookingKeys = {
  all: ['bookings'] as const,
  detail: (id: string) => ['bookings', id] as const,
};

/**
 * Create a booking via API. Uses mutation; invalidates booking list on success (TRD §6).
 */
export function useCreateBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateBookingPayload) => createBooking(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.all });
    },
  });
}
