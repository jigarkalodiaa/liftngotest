'use client';

import { memo } from 'react';
import type { KhatuDriverDetails } from './types';

type Props = {
  driver: KhatuDriverDetails;
};

function KhatuPackageTrackingCard({ driver }: Props) {
  return (
    <section className="rounded-xl border border-stone-200/80 bg-white p-3 shadow-sm sm:p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--khatu-saffron)]">Agent-assisted status</p>
          <p className="mt-1 text-sm font-bold text-[var(--khatu-stone)]">How your trip will be shaped</p>
          <p className="mt-1 text-xs text-stone-500">Each step is managed by your assigned travel agent partner.</p>
        </div>
        <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700">
          Agent managing
        </span>
      </div>

      <div className="mt-3 rounded-lg border border-stone-100 bg-stone-50/70 p-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-stone-500">Assigned travel agent</p>
        <p className="mt-1 text-sm font-semibold text-stone-700">{driver.name}</p>
        <p className="mt-0.5 text-xs text-stone-500">{driver.vehicle}</p>
        <a className="mt-1 inline-block text-xs font-semibold text-[var(--color-primary)]" href={`tel:${driver.phone}`}>
          Call agent: {driver.phone}
        </a>
      </div>

      <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-2 text-xs text-amber-900">
        Your Khatu trip coordination and status updates are handled by your travel agent partner.
      </p>

    </section>
  );
}

export default memo(KhatuPackageTrackingCard);
