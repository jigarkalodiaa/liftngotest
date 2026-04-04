'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/constants';
import { trackPlanSelected, trackCheckoutStarted } from '@/lib/analytics';
import { Check, ArrowRight, User, Settings } from 'lucide-react';
import PlansSubPageShell from '../PlansSubPageShell';

type RentOption = {
  vehicle: string;
  withDriver: { daily: number; weekly: number; monthly: number };
  withoutDriver: { daily: number; weekly: number; monthly: number };
  bestFor: string;
};

const RENT_OPTIONS: RentOption[] = [
  {
    vehicle: '2-Wheeler',
    withDriver: { daily: 1200, weekly: 7000, monthly: 25000 },
    withoutDriver: { daily: 600, weekly: 3500, monthly: 12000 },
    bestFor: 'Documents, parcels, small packages',
  },
  {
    vehicle: '3-Wheeler',
    withDriver: { daily: 1800, weekly: 11000, monthly: 38000 },
    withoutDriver: { daily: 900, weekly: 5500, monthly: 18000 },
    bestFor: 'Medium cargo, retail, e-commerce',
  },
  {
    vehicle: '4-Wheeler',
    withDriver: { daily: 3500, weekly: 22000, monthly: 55000 },
    withoutDriver: { daily: 2000, weekly: 12000, monthly: 35000 },
    bestFor: 'Heavy cargo, warehouse transfers, bulk goods',
  },
];

export default function RentPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'withDriver' | 'withoutDriver'>('withDriver');
  const [duration, setDuration] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  return (
    <PlansSubPageShell
      title="Rent a vehicle"
      subtitle="Flexible daily, weekly, or monthly rentals — with or without a driver."
      badge="Dedicated vehicle"
      contentClassName="-mt-6"
    >
      <div className="flex min-w-0 gap-1 rounded-2xl border border-gray-200 bg-white p-1 shadow-sm">
        <button
          type="button"
          onClick={() => setMode('withDriver')}
          className={`flex min-h-12 min-w-0 flex-1 items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold transition-all sm:text-sm ${
            mode === 'withDriver' ? 'bg-[var(--color-primary)] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <User className="h-4 w-4 shrink-0" /> With driver
        </button>
        <button
          type="button"
          onClick={() => setMode('withoutDriver')}
          className={`flex min-h-12 min-w-0 flex-1 items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold transition-all sm:text-sm ${
            mode === 'withoutDriver' ? 'bg-[var(--color-primary)] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Settings className="h-4 w-4 shrink-0" /> Self drive
        </button>
      </div>
      <div className="mt-3 grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
        {(['daily', 'weekly', 'monthly'] as const).map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setDuration(d)}
            className={`min-h-11 rounded-xl py-2.5 text-xs font-bold uppercase tracking-wide transition-all ${
              duration === d ? 'bg-gray-900 text-white shadow-sm' : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      <div className="mt-6 grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {RENT_OPTIONS.map((opt) => {
          const price = opt[mode][duration];
          return (
            <div
              key={opt.vehicle}
              className="flex min-w-0 flex-col rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md md:p-5"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <h2 className="text-base font-bold text-gray-900 md:text-lg">{opt.vehicle}</h2>
                  <p className="mt-0.5 text-xs text-gray-500">{opt.bestFor}</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-xl font-extrabold text-[var(--color-primary)] md:text-2xl">
                    ₹{price.toLocaleString('en-IN')}
                  </p>
                  <p className="text-[10px] font-medium uppercase text-gray-400">
                    per {duration === 'daily' ? 'day' : duration === 'weekly' ? 'week' : 'month'}
                  </p>
                </div>
              </div>

              {mode === 'withDriver' && (
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">Driver included</span>
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600">Fuel included</span>
                </div>
              )}

              <ul className="mt-3 flex-1 space-y-1.5">
                {['Insurance covered', mode === 'withDriver' ? 'Verified driver assigned' : 'Valid DL required', 'Flexible extensions'].map(
                  (f) => (
                    <li key={f} className="flex items-center gap-1.5 text-xs text-gray-600">
                      <Check className="h-3.5 w-3.5 shrink-0 text-emerald-500" strokeWidth={2.5} />
                      {f}
                    </li>
                  ),
                )}
              </ul>

              <button
                type="button"
                onClick={() => {
                  trackPlanSelected(`${opt.vehicle}_${mode}_${duration}`, 'rent');
                  trackCheckoutStarted('rent', price);
                  router.push(ROUTES.CONTACT);
                }}
                className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] py-3.5 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:opacity-90 active:scale-[0.98] md:min-h-11 md:py-3"
              >
                Book vehicle
                <ArrowRight className="h-4 w-4 shrink-0" />
              </button>
            </div>
          );
        })}
      </div>
    </PlansSubPageShell>
  );
}
