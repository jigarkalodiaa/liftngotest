'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconButton, BackIcon, Button, PageContainer } from '@/components/ui';
import { ROUTES } from '@/lib/constants';
import {
  getDropLocation,
  getPickupLocation,
  getSelectedService,
  setDropLocation,
  setPickupLocation,
} from '@/lib/storage';
import { theme } from '@/config/theme';

const DRIVER_NAME = 'RAMESH PATEL';

type TimingKey = 'early_morning' | 'morning' | 'afternoon' | 'evening' | 'night';

const TIMINGS: Array<{
  key: TimingKey;
  label: string;
  range: string;
}> = [
  { key: 'early_morning', label: 'Early Morning', range: '06:00 AM - 08:00 AM' },
  { key: 'morning', label: 'Morning', range: '08:00 AM - 11:00 AM' },
  { key: 'afternoon', label: 'Afternoon', range: '12:00 PM - 03:00 PM' },
  { key: 'evening', label: 'Evening', range: '04:00 PM - 07:00 PM' },
  { key: 'night', label: 'Night', range: '08:00 PM - 11:00 PM' },
];

function formatShortDate(d: Date) {
  const day = d.getDate();
  const mon = d.toLocaleString('en-IN', { month: 'short' });
  return `${day} ${mon}`;
}

export default function ScheduleLaterPage() {
  const router = useRouter();

  // Avoid hydration mismatch: localStorage isn't available during SSR.
  // We render placeholders on first paint, then populate values on mount.
  const [pickupState, setPickupState] = useState<ReturnType<typeof getPickupLocation> | null>(null);
  const [dropState, setDropState] = useState<ReturnType<typeof getDropLocation> | null>(null);
  const [serviceState, setServiceState] = useState<ReturnType<typeof getSelectedService> | null>(null);

  useEffect(() => {
    setPickupState(getPickupLocation());
    setDropState(getDropLocation());
    setServiceState(getSelectedService());
  }, []);

  // Date selection: show a simple rolling list + highlight; UI resembles Figma without heavy calendar logic.
  const now = useMemo(() => new Date(), []);
  const dateOptions = useMemo(() => Array.from({ length: 21 }, (_, i) => new Date(now.getTime() + i * 86400000)), [now]);

  const [selectedDate, setSelectedDate] = useState<Date>(dateOptions[2] ?? now);
  const [selectedTiming, setSelectedTiming] = useState<TimingKey>('morning');

  const amountPayable = useMemo(() => {
    // Mirrors trip-options pricing for visual consistency
    switch (serviceState) {
      case 'walk':
        return 75;
      case 'twoWheeler':
        return 160;
      case 'threeWheeler':
        return 450;
      default:
        return 400;
    }
  }, [serviceState]);

  const timingMeta = TIMINGS.find((t) => t.key === selectedTiming) ?? TIMINGS[1];
  const isNight = selectedTiming === 'night';

  const returnTo = ROUTES.SCHEDULE_LATER;
  const editPickup = () =>
    router.push(
      `${ROUTES.PICKUP_LOCATION_EDIT}?type=pickup&step=1&returnTo=${encodeURIComponent(returnTo)}`,
    );
  const editDrop = () =>
    router.push(
      `${ROUTES.PICKUP_LOCATION_EDIT}?type=drop&step=2&returnTo=${encodeURIComponent(returnTo)}`,
    );

  const handleSwapLocations = () => {
    if (!pickupState || !dropState) return;
    // Swap pickup/drop in storage and in local UI immediately.
    setPickupLocation(dropState);
    setDropLocation(pickupState);
    const nextPickup = dropState;
    const nextDrop = pickupState;
    // Update displayed state immediately.
    setPickupState(nextPickup);
    setDropState(nextDrop);
  };

  return (
    <div className="min-h-screen bg-white">
      <PageContainer className="pt-5 pb-28">
        <div className="flex items-center gap-3">
          <IconButton aria-label="Back" onClick={() => router.push(ROUTES.TRIP_OPTIONS)} className="h-10 w-10">
            <BackIcon />
          </IconButton>
          <div className="flex-1">
            <div className="text-[18px] font-semibold text-gray-900">Schedule later</div>
            <div className="text-[12px] text-gray-500">Choose date and timing</div>
          </div>
          <div className="w-10" aria-hidden />
        </div>

        {/* 4 UI blocks: Location, Date, Timing, Booking */}
        <div className="mt-5 space-y-4">
          {/* Location */}
          <details open className="rounded-2xl border border-gray-100 bg-white shadow-sm">
            <summary className="cursor-pointer px-4 py-3 flex items-center justify-between">
              <span className="text-[14px] font-semibold text-gray-900">Location</span>
              <span className="text-gray-400" aria-hidden>⌄</span>
            </summary>
            <div className="px-4 pb-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500" aria-hidden />
                    <div className="min-w-0">
                      <div className="text-[13px] font-semibold text-gray-900 truncate">
                        {pickupState?.name ?? 'Pickup'}
                      </div>
                      <div className="text-[12px] text-gray-500 truncate">{pickupState?.address ?? ''}</div>
                    </div>
                  </div>

                  <button
                    type="button"
                    aria-label="Edit pickup"
                    onClick={editPickup}
                    className="h-9 w-9 rounded-full border border-gray-200 bg-white grid place-items-center hover:bg-gray-50 transition-colors flex-shrink-0"
                  >
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 3.487a2.25 2.25 0 013.182 3.182L7.5 19.213 3 21l1.787-4.5L16.862 3.487z"
                      />
                    </svg>
                  </button>
                </div>

                <div className="flex justify-center py-1">
                  <button
                    type="button"
                    aria-label="Swap pickup and drop"
                    onClick={handleSwapLocations}
                    className="h-10 w-10 rounded-full bg-[var(--color-primary)] grid place-items-center text-white flex-shrink-0"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                  </button>
                </div>

                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-red-500" aria-hidden />
                    <div className="min-w-0">
                      <div className="text-[13px] font-semibold text-gray-900 truncate">
                        {dropState?.name ?? 'Drop'}
                      </div>
                      <div className="text-[12px] text-gray-500 truncate">{dropState?.address ?? ''}</div>
                    </div>
                  </div>

                  <button
                    type="button"
                    aria-label="Edit drop"
                    onClick={editDrop}
                    className="h-9 w-9 rounded-full border border-gray-200 bg-white grid place-items-center hover:bg-gray-50 transition-colors flex-shrink-0"
                  >
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 3.487a2.25 2.25 0 013.182 3.182L7.5 19.213 3 21l1.787-4.5L16.862 3.487z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </details>

          {/* Date */}
          <details open className="rounded-2xl border border-gray-100 bg-white shadow-sm">
            <summary className="cursor-pointer px-4 py-3 flex items-center justify-between">
              <span className="text-[14px] font-semibold text-gray-900">Date</span>
              <span className="text-gray-400" aria-hidden>⌄</span>
            </summary>
            <div className="px-4 pb-4">
              <div className="text-[12px] text-gray-500 mb-3">{selectedDate.toLocaleString('en-IN', { month: 'long', year: 'numeric' })}</div>
              <div className="grid grid-cols-7 gap-2">
                {dateOptions.slice(0, 21).map((d) => {
                  const active = d.toDateString() === selectedDate.toDateString();
                  return (
                    <button
                      key={d.toISOString()}
                      type="button"
                      onClick={() => setSelectedDate(d)}
                      className={`h-9 rounded-lg text-[12px] font-semibold transition-colors ${
                        active ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {d.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>
          </details>

          {/* Timing */}
          <details open className="rounded-2xl border border-gray-100 bg-white shadow-sm">
            <summary className="cursor-pointer px-4 py-3 flex items-center justify-between">
              <span className="text-[14px] font-semibold text-gray-900">Timing</span>
              <span className="text-gray-400" aria-hidden>⌄</span>
            </summary>
            <div className="px-4 pb-4">
              <div className="space-y-3">
                {TIMINGS.map((t) => {
                  const active = t.key === selectedTiming;
                  return (
                    <button
                      key={t.key}
                      type="button"
                      onClick={() => setSelectedTiming(t.key)}
                      className={`w-full rounded-xl border px-3 py-3 text-left transition-colors ${
                        active ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5' : 'border-gray-100 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="min-w-0">
                          <div className="text-[13px] font-semibold text-gray-900">{t.label}</div>
                          <div className="text-[12px] text-gray-500">{t.range}</div>
                        </div>
                        <div className={`h-5 w-5 rounded-full border ${active ? 'bg-[var(--color-primary)] border-[var(--color-primary)]' : 'bg-white border-gray-300'}`} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </details>

          {/* Booking */}
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[13px] font-semibold text-gray-900">Booking</div>
                <div className="mt-1 text-[12px] text-gray-500">
                  {formatShortDate(selectedDate)} • {timingMeta.label}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[20px] font-bold text-gray-900">₹{amountPayable}</div>
                <div className="text-[12px] text-gray-500">Pay later</div>
              </div>
            </div>

            <div className="mt-3 rounded-xl bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/10 px-3 py-2">
              <div className="text-[12px] text-[var(--color-primary)] font-semibold">NOTE</div>
              <div className="text-[12px] text-gray-600 mt-0.5">
                {isNight ? 'You saved up to 10% by booking at night.' : 'Book at night & save up to 10%.'}
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <div className="text-[12px] text-gray-500">
                Rate your Driver, <span className="font-semibold text-gray-700">{DRIVER_NAME}</span>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>

      {/* Bottom CTA */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-gray-100 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto max-w-[520px] px-4 py-3">
          <Button
            fullWidth
            className="rounded-xl py-3.5"
            onClick={() => router.push(ROUTES.PAYMENT)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

