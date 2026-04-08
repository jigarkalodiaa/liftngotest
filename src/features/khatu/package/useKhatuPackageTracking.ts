'use client';

import { useCallback, useMemo, useState } from 'react';
import type { KhatuDriverDetails, KhatuTrackingStatus } from './types';

const TRACKING_STEPS: KhatuTrackingStatus[] = [
  'BOOKING_CONFIRMED',
  'DRIVER_ASSIGNED',
  'EN_ROUTE_PICKUP',
  'ARRIVED_PICKUP_RINGAS',
  'PICKUP_COMPLETED',
  'ON_THE_WAY_KHATU',
  'DARSHAN_ONGOING',
  'RETURN_TRIP',
  'TRIP_COMPLETED',
];

const STATUS_LABELS: Record<KhatuTrackingStatus, string> = {
  BOOKING_CONFIRMED: 'Booking confirmed',
  DRIVER_ASSIGNED: 'Driver assigned',
  EN_ROUTE_PICKUP: 'En route to pickup',
  ARRIVED_PICKUP_RINGAS: 'Arrived at pickup (Ringas)',
  PICKUP_COMPLETED: 'Pickup completed',
  ON_THE_WAY_KHATU: 'On the way to Khatu',
  DARSHAN_ONGOING: 'Darshan ongoing',
  RETURN_TRIP: 'Return trip',
  TRIP_COMPLETED: 'Trip completed',
};

const STATUS_ETAS: Partial<Record<KhatuTrackingStatus, number | null>> = {
  DRIVER_ASSIGNED: 14,
  EN_ROUTE_PICKUP: 9,
  ARRIVED_PICKUP_RINGAS: 3,
  PICKUP_COMPLETED: 0,
  ON_THE_WAY_KHATU: 52,
  DARSHAN_ONGOING: null,
  RETURN_TRIP: 58,
};

const MOCK_DRIVER: KhatuDriverDetails = {
  name: 'Khatu Travel Expert',
  phone: '8588808581',
  vehicle: 'Liftngo Partner Desk',
  etaMinutes: 14,
};

export function useKhatuPackageTracking() {
  const [statusIndex, setStatusIndex] = useState(0);

  const status = TRACKING_STEPS[statusIndex];

  const nextStatus = useCallback(() => {
    setStatusIndex((prev) => Math.min(prev + 1, TRACKING_STEPS.length - 1));
  }, []);

  const previousStatus = useCallback(() => {
    setStatusIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const resetStatus = useCallback(() => {
    setStatusIndex(0);
  }, []);

  const timeline = useMemo(
    () =>
      TRACKING_STEPS.map((step, idx) => ({
        key: step,
        label: STATUS_LABELS[step],
        done: idx < statusIndex,
        active: idx === statusIndex,
      })),
    [statusIndex],
  );

  const driverDetails = useMemo(() => {
    const etaValue = STATUS_ETAS[status];
    return {
      ...MOCK_DRIVER,
      etaMinutes: typeof etaValue === 'number' ? etaValue : null,
    };
  }, [status]);

  return {
    status,
    statusLabel: STATUS_LABELS[status],
    statusIndex,
    timeline,
    driverDetails,
    isCompleted: status === 'TRIP_COMPLETED',
    nextStatus,
    previousStatus,
    resetStatus,
  };
}
