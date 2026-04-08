'use client';

import { memo, useMemo } from 'react';
import type { KhatuBookingRecord } from './types';
import type { KhatuServiceKey } from '@/features/khatu/package/types';

const STATUS_CLASS: Record<KhatuBookingRecord['status'], string> = {
  PENDING: 'bg-amber-100 text-amber-800',
  CONFIRMED: 'bg-sky-100 text-sky-800',
  COMPLETED: 'bg-emerald-100 text-emerald-800',
};

const LABELS: Record<KhatuServiceKey, string> = {
  cab: 'Cab',
  hotel: 'Hotel',
  food: 'Food',
  guide: 'Guide',
  darshan: 'Darshan',
  waterPark: 'Water park',
  returnTrip: 'Return trip',
};

type Props = {
  booking: KhatuBookingRecord;
};

function BookingCard({ booking }: Props) {
  const selectedServices = useMemo(
    () =>
      (Object.keys(booking.services) as KhatuServiceKey[])
        .filter((key) => booking.services[key])
        .map((key) => LABELS[key]),
    [booking.services],
  );

  const dateLabel = useMemo(
    () => new Date(booking.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    [booking.date],
  );

  return (
    <article className="rounded-2xl border border-stone-200/80 bg-white p-3.5 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-semibold text-stone-700">Booking • {dateLabel}</p>
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_CLASS[booking.status]}`}>{booking.status}</span>
      </div>
      <p className="mt-1 text-base font-semibold text-stone-900">{booking.name}</p>
      <p className="text-xs text-stone-500">{selectedServices.join(', ') || 'No services selected'}</p>
      <div className="mt-2 flex items-end justify-between gap-2 rounded-xl bg-stone-50/90 px-3 py-2">
        <span className="text-xs font-medium text-stone-600">Total price</span>
        <span className="text-lg font-extrabold text-[var(--khatu-stone)]">₹{booking.totalPrice}</span>
      </div>
      <div className="mt-2 rounded-xl border border-stone-100 bg-stone-50 p-2.5">
        <p className="text-xs font-medium text-stone-700">Expert: {booking.expert.name}</p>
        <a
          href={`tel:${booking.expert.phone}`}
          className="mt-2 inline-flex min-h-9 items-center justify-center rounded-lg bg-[var(--color-primary)] px-3 text-xs font-semibold text-white"
        >
          Call expert ({booking.expert.phone})
        </a>
      </div>
    </article>
  );
}

export default memo(BookingCard);
