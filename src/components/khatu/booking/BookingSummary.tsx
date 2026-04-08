'use client';

import { memo, useMemo } from 'react';
import type { KhatuPackageServices, KhatuServiceKey } from '@/features/khatu/package/types';

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
  services: KhatuPackageServices;
  basePrice: number;
  addOnsTotal: number;
  totalPrice: number;
  sticky?: boolean;
};

function BookingSummary({ services, basePrice, addOnsTotal, totalPrice, sticky = false }: Props) {
  const selectedRows = useMemo(
    () => (Object.keys(services) as KhatuServiceKey[]).map((key) => ({ label: LABELS[key], selected: services[key] })),
    [services],
  );

  return (
    <section
      className={`rounded-2xl border border-stone-200/80 bg-white p-3.5 shadow-sm sm:p-4 ${
        sticky ? 'sticky top-3 z-20 sm:top-4' : ''
      }`}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--khatu-saffron)]">Price breakdown</p>
      <ul className="mt-2 grid grid-cols-2 gap-1.5">
        {selectedRows.map((row) => (
          <li key={row.label} className="rounded-lg bg-stone-50 px-2.5 py-1.5 text-xs text-stone-700">
            {row.label}: <span className="font-semibold">{row.selected ? 'Yes' : 'No'}</span>
          </li>
        ))}
      </ul>
      <div className="mt-3 space-y-1.5 text-sm text-stone-700">
        <div className="flex items-center justify-between">
          <span>Base price</span>
          <span className="font-semibold">₹{basePrice}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Add-ons</span>
          <span className="font-semibold">₹{addOnsTotal}</span>
        </div>
      </div>
      <div className="mt-2 border-t border-stone-200 pt-2">
        <div className="flex items-center justify-between text-lg font-extrabold text-[var(--khatu-stone)]">
          <span>Total</span>
          <span>₹{totalPrice}</span>
        </div>
      </div>
    </section>
  );
}

export default memo(BookingSummary);
