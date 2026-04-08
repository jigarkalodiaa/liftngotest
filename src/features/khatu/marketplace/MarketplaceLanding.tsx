'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Building2, Store } from 'lucide-react';
import { useKhatuShops } from '@/hooks/useKhatuData';
import { ROUTES } from '@/lib/constants';
import ContentLayout from '@/components/layout/ContentLayout';
import { BREADCRUMB_HOME } from '@/lib/breadcrumbsNav';
import { getUserLocation } from '@/lib/utils/locationStorage';
import ShopCard from '@/features/khatu/marketplace/ShopCard';

export default function MarketplaceLanding() {
  const { data, isLoading, isError, refetch } = useKhatuShops();
  const [areaLabel, setAreaLabel] = useState('Khatu Shyam Ji');

  useEffect(() => {
    const loc = getUserLocation();
    const city = loc?.city?.trim();
    setAreaLabel(city || 'Khatu Shyam Ji');
  }, []);

  return (
    <ContentLayout breadcrumbs={[BREADCRUMB_HOME, { name: 'Khatu marketplace', path: '/khatu/marketplace' }]} variant="app">
      <main className="relative flex min-h-0 flex-1 flex-col pb-10 sm:pb-14">
        <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white/95 backdrop-blur-md">
          <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3 sm:max-w-6xl sm:px-6">
            <Link
              href={ROUTES.DASHBOARD}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-neutral-200 bg-white text-neutral-800 shadow-sm transition-colors hover:bg-neutral-50"
              aria-label="Back to dashboard"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg font-bold tracking-tight text-neutral-900 sm:text-xl">Marketplace</h1>
            </div>
            <Link
              href={ROUTES.DASHBOARD}
              className="flex max-w-[45%] items-center gap-1 rounded-full border border-neutral-200/90 bg-neutral-50/90 px-2.5 py-1.5 text-[11px] font-medium text-neutral-800 shadow-sm transition-colors hover:bg-neutral-100 sm:max-w-[12rem] sm:text-xs"
              title="Service area"
            >
              <Building2 className="h-3.5 w-3.5 shrink-0 text-neutral-500" strokeWidth={1.5} aria-hidden />
              <span className="truncate">{areaLabel}</span>
            </Link>
          </div>
        </header>

        <div className="mx-auto w-full max-w-2xl flex-1 px-4 pt-4 sm:max-w-6xl sm:px-6 sm:pt-5">
          <section aria-labelledby="marketplace-shops-heading">
            <h2 id="marketplace-shops-heading" className="text-lg font-bold text-neutral-900 sm:text-xl">
              Prasad & religious shops
            </h2>
            <p className="mt-1 max-w-xl text-sm leading-snug text-neutral-500">
              Trusted local vendors for temple offerings, prasad, and pooja essentials.
            </p>

            <div className="mt-3 flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-xs text-neutral-600">
              <Store className="h-4 w-4 shrink-0 text-[var(--color-primary)]" strokeWidth={1.75} aria-hidden />
              One shop per order. Switching shop clears current cart after confirmation.
            </div>

            <ul className="mt-4 grid grid-cols-1 gap-3 sm:mt-5 sm:grid-cols-2 sm:gap-4" role="list">
              {data?.shops.map((s, i) => <ShopCard key={s.id} shop={s} imagePriority={i === 0} />)}
            </ul>

            {isLoading ? <p className="mt-5 text-center text-sm text-neutral-500">Loading shops…</p> : null}
            {isError ? (
              <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-center text-sm text-rose-900">
                Could not load shops.
                <button
                  type="button"
                  className="mt-2 block w-full rounded-xl bg-rose-700 py-2 text-sm font-semibold text-white"
                  onClick={() => refetch()}
                >
                  Retry
                </button>
              </div>
            ) : null}
          </section>
        </div>
      </main>
    </ContentLayout>
  );
}
