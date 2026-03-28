'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useKhatuHotels } from '@/hooks/useKhatuData';
import type { KhatuHotelListQuery } from '@/lib/api/khatu';
import { ROUTES } from '@/lib/constants';
import { SUPPORT_PHONE } from '@/config/env';
import { SectionHeader } from '@/components/ui';
import KhatuScreenShell from '@/features/khatu/common/KhatuScreenShell';
import HotelCard from '@/features/khatu/hotels/HotelCard';
import HotelFilters from '@/features/khatu/hotels/HotelFilters';
import type { KhatuHotel } from '@/types/khatu';

const SUPPORT_TEL = SUPPORT_PHONE
  ? `tel:+91${SUPPORT_PHONE.replace(/\D/g, '').slice(-10)}`
  : 'tel:+919065847341';

export type HotelSort = 'popular' | 'price_asc' | 'distance';

function sortHotels(list: KhatuHotel[], sort: HotelSort): KhatuHotel[] {
  const next = [...list];
  if (sort === 'price_asc') next.sort((a, b) => a.pricePerNight - b.pricePerNight);
  else if (sort === 'distance') next.sort((a, b) => a.distanceKmFromTemple - b.distanceKmFromTemple);
  else next.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
  return next;
}

export default function KhatuHotelsPage() {
  const [filters, setFilters] = useState<KhatuHotelListQuery>({});
  const [sort, setSort] = useState<HotelSort>('popular');

  const stableQuery = useMemo(() => ({ ...filters }), [filters]);
  const { data, isLoading, isError, refetch } = useKhatuHotels(stableQuery);

  const sorted = useMemo(() => {
    if (!data?.hotels) return [];
    return sortHotels(data.hotels, sort);
  }, [data?.hotels, sort]);

  return (
    <>
      <KhatuScreenShell title="Hotels & guest houses" eyebrow="Verified stays">
        <SectionHeader
          title="Trusted stays near Khatu Temple"
          description="Verified by Liftngo for a comfortable stay — clear distance, honest amenities, and support if plans change."
        />

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0 flex-1">
            <HotelFilters value={filters} onChange={setFilters} />
          </div>
        </div>

        <div className="mt-4">
          <label className="text-[11px] font-semibold uppercase tracking-wide text-[var(--khatu-stone-muted)]" htmlFor="hotel-sort">
            Sort by
          </label>
          <select
            id="hotel-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as HotelSort)}
            className="mt-1.5 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm font-medium text-[var(--khatu-stone)] shadow-sm focus:border-[var(--khatu-saffron)] focus:outline-none focus:ring-2 focus:ring-[var(--khatu-saffron)]/20 sm:max-w-xs"
          >
            <option value="popular">Popular (rating)</option>
            <option value="price_asc">Price: low to high</option>
            <option value="distance">Distance from temple</option>
          </select>
        </div>

        <div className="mt-6 space-y-5">
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
              No stays match these filters — try widening distance or budget.
            </p>
          ) : null}
          {sorted.map((h, i) => (
            <HotelCard key={h.id} hotel={h} imagePriority={i === 0} />
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-[var(--khatu-stone-muted)]">
          Need intercity transport?{' '}
          <Link href={ROUTES.KHATU_TRAVEL} className="font-semibold text-[var(--khatu-saffron)] underline-offset-2 hover:underline">
            Salasar & Ringus rides
          </Link>
        </p>
      </KhatuScreenShell>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-stone-200/90 bg-white/95 px-4 py-3 shadow-[0_-8px_30px_rgba(28,25,23,0.06)] backdrop-blur-md">
        <div className="mx-auto flex max-w-xl items-center gap-3 sm:max-w-2xl">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-[var(--khatu-stone)]">Group or special darshan stay?</p>
            <p className="text-[11px] text-[var(--khatu-stone-muted)]">Our team coordinates with on-ground partners.</p>
          </div>
          <a
            href={SUPPORT_TEL}
            className="shrink-0 rounded-xl bg-[var(--khatu-saffron)] px-4 py-2.5 text-sm font-semibold text-white"
          >
            Call us
          </a>
        </div>
      </div>
    </>
  );
}
