'use client';

import Link from 'next/link';
import { Store } from 'lucide-react';
import { useKhatuShops } from '@/hooks/useKhatuData';
import { ROUTES } from '@/lib/constants';
import { SectionHeader } from '@/components/ui';
import KhatuScreenShell from '@/features/khatu/common/KhatuScreenShell';
import ShopCard from '@/features/khatu/marketplace/ShopCard';

export default function MarketplaceLanding() {
  const { data, isLoading, isError, refetch } = useKhatuShops();

  return (
    <KhatuScreenShell title="Marketplace" eyebrow="Prasad & pūjā supply">
      <SectionHeader
        title="Verified shops near Khatu Temple"
        description="Browse trusted vendors for prasad, religious items, and local temple offerings — not restaurant food. Delivery by Liftngo riders."
      />

      <div className="mt-2 flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-xs text-[var(--khatu-stone-muted)]">
        <Store className="h-4 w-4 shrink-0 text-[var(--khatu-saffron)]" strokeWidth={1.75} aria-hidden />
        One shop per order — your cart clears automatically if you switch stores (we&apos;ll confirm first).
      </div>

      <div className="mt-6 space-y-4">
        {isLoading ? <p className="text-center text-sm text-[var(--khatu-stone-muted)]">Loading shops…</p> : null}
        {isError ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-center text-sm text-rose-900">
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
        {data?.shops.map((s, i) => <ShopCard key={s.id} shop={s} imagePriority={i === 0} />)}
      </div>

      <p className="mt-8 text-center text-sm text-[var(--khatu-stone-muted)]">
        Planning darshan transport?{' '}
        <Link href={ROUTES.KHATU_TRAVEL} className="font-semibold text-[var(--khatu-saffron)] underline-offset-2 hover:underline">
          Book a corridor ride
        </Link>
      </p>
    </KhatuScreenShell>
  );
}
