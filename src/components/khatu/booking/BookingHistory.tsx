'use client';

import { memo } from 'react';
import type { KhatuBookingRecord } from './types';
import BookingCard from './BookingCard';

type Props = {
  bookings: KhatuBookingRecord[];
  loading?: boolean;
};

function BookingHistory({ bookings, loading = false }: Props) {
  return (
    <section className="rounded-2xl border border-stone-200/80 bg-white p-3.5 shadow-sm sm:p-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-bold text-[var(--khatu-stone)] sm:text-base">My Khatu Bookings</h2>
        <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-semibold text-stone-600">
          {bookings.length}
        </span>
      </div>
      {loading ? (
        <div className="mt-3 space-y-2.5">
          {[0, 1].map((idx) => (
            <div key={idx} className="animate-pulse rounded-2xl border border-stone-200/80 bg-white p-3">
              <div className="h-3 w-28 rounded bg-stone-200" />
              <div className="mt-2 h-4 w-40 rounded bg-stone-200" />
              <div className="mt-2 h-3 w-full rounded bg-stone-100" />
            </div>
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <p className="mt-2 rounded-xl border border-dashed border-stone-200 bg-stone-50 px-3 py-3 text-xs text-stone-500">
          No Khatu bookings yet. Plan your first package from "Khatu Yatra package" to see it here.
        </p>
      ) : (
        <div className="mt-3 space-y-2.5">
          {bookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      )}
    </section>
  );
}

export default memo(BookingHistory);
