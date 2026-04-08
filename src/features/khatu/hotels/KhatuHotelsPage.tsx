'use client';

import { useMemo } from 'react';
import { useKhatuHotels } from '@/hooks/useKhatuData';
import KhatuScreenShell from '@/features/khatu/common/KhatuScreenShell';
import HotelCard from '@/features/khatu/hotels/HotelCard';
import type { KhatuHotel } from '@/types/khatu';

export default function KhatuHotelsPage() {
  const { data, isLoading, isError, refetch } = useKhatuHotels({});

  const sorted = useMemo(() => {
    if (!data?.hotels) return [];
    return [...data.hotels].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
  }, [data?.hotels]);

  return (
    <>
      <KhatuScreenShell title="Hotels & guest houses">
        <div className="mt-1">
          <h2 className="text-[1.6rem] font-bold tracking-tight text-[var(--khatu-stone)]">All hotels</h2>
          <p className="mt-0.5 text-xs text-[var(--khatu-stone-muted)]">Trusted stays near Khatu Shyam Ji</p>
        </div>

        <div className="mt-4 space-y-4">
          {isLoading ? (
            <p className="text-center text-sm text-[var(--khatu-stone-muted)]">Loading stays…</p>
          ) : null}
          {isError ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-4 text-center text-sm text-rose-900">
              Could not load hotels.
              <button
                type="button"
                className="mt-2 block w-full rounded-xl bg-rose-700 py-2 text-sm font-semibold text-white"
                onClick={() => refetch()}
              >
                Retry
              </button>
            </div>
          ) : null}
          {!isLoading && !isError && sorted.length === 0 ? (
            <p className="rounded-2xl border border-stone-200 bg-white p-4 text-center text-sm text-[var(--khatu-stone-muted)]">
              No hotels available right now. Please try again shortly.
            </p>
          ) : null}
          {sorted.map((h, i) => (
            <HotelCard key={h.id} hotel={h} imagePriority={i === 0} />
          ))}
        </div>
      </KhatuScreenShell>
    </>
  );
}
