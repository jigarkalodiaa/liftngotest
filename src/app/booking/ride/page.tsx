'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import { ROUTES } from '@/lib/constants';
import { clearKhatuRideBooking, readKhatuRideBooking, type SavedKhatuRideBooking } from '@/lib/khatuSessionStorage';

export default function BookingRidePage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [data, setData] = useState<SavedKhatuRideBooking | null>(null);

  useEffect(() => {
    setData(readKhatuRideBooking());
    setReady(true);
  }, []);

  const continueFlow = () => {
    clearKhatuRideBooking();
    router.push(`${ROUTES.PICKUP_LOCATION}?step=1&from=khatu_ride`);
  };

  if (!ready) {
    return (
      <div className="min-h-screen bg-white px-4 pt-4">
        <PageHeader title="Ride booking" onBack={() => router.push(ROUTES.KHATU_TRAVEL)} />
        <p className="mt-6 text-center text-sm text-gray-600">Loading your quote…</p>
      </div>
    );
  }

  if (!data?.bookingRef) {
    return (
      <div className="min-h-screen bg-white px-4 pt-4">
        <PageHeader title="Ride booking" onBack={() => router.push(ROUTES.KHATU_TRAVEL)} />
        <div className="mx-auto mt-8 max-w-md rounded-2xl border border-amber-200 bg-amber-50/60 p-4 text-center text-sm text-amber-950">
          <p>No active ride quote. Start from the travel page to get a fresh estimate.</p>
          <Link
            href={ROUTES.KHATU_TRAVEL}
            className="mt-4 inline-block rounded-xl bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white"
          >
            Book a route
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/80 to-white pb-28">
      <div className="mx-auto max-w-lg px-4 pt-4">
        <PageHeader title="Ride saved" onBack={() => router.push(ROUTES.KHATU_TRAVEL)} />
        <div className="mt-4 rounded-2xl border border-amber-200/80 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-800/80">Reference</p>
          <p className="mt-1 font-mono text-lg font-bold text-amber-950">{data.bookingRef}</p>
          <p className="mt-3 text-sm text-amber-900/85">
            {data.route.label}: {data.route.from} → {data.route.to}
          </p>
          <p className="mt-1 text-sm text-amber-900/85">
            {data.vehicle.label} · {data.route.distanceKm} km · ~{data.route.typicalMinutes} min
          </p>
          <p className="mt-3 text-xl font-bold text-amber-950">Est. ₹{data.estimateInr}</p>
          <p className="mt-2 text-xs text-amber-900/65">
            Quote generated {new Date(data.savedAt).toLocaleString()}. Final fare may vary with traffic & tolls.
          </p>
        </div>
        <p className="mt-4 text-sm text-amber-900/80">
          Next, add exact pickup & drop on the map so we can match a driver. Your reference stays with our ops desk.
        </p>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-amber-200/80 bg-white/95 px-4 py-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg gap-3">
          <button
            type="button"
            onClick={() => router.push(ROUTES.DASHBOARD)}
            className="min-h-[48px] flex-1 rounded-xl border border-amber-200 py-3 text-center text-sm font-semibold text-amber-950"
          >
            Dashboard
          </button>
          <button
            type="button"
            onClick={continueFlow}
            className="min-h-[48px] flex-1 rounded-xl bg-[var(--color-primary)] py-3 text-center text-sm font-semibold text-white"
          >
            Add pickup / drop
          </button>
        </div>
      </div>
    </div>
  );
}
