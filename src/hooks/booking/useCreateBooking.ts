'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTrip, type CreateTripPayload, type TripResponse } from '@/api/services/tripService';

export const bookingKeys = {
  all: ['bookings'] as const,
  detail: (id: string) => ['bookings', id] as const,
};

export function useCreateBooking() {
  const queryClient = useQueryClient();
  return useMutation<TripResponse, Error, CreateTripPayload>({
    mutationFn: (payload) => createTrip(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.all });
    },
  });
}
