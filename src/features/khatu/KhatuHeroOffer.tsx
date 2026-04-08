'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Bike, X } from 'lucide-react';
import { ROUTES } from '@/lib/constants';

interface KhatuHeroOfferProps {
  onBookNow: () => void;
}

export default function KhatuHeroOffer({ onBookNow }: KhatuHeroOfferProps) {
  const [fareInfoOpen, setFareInfoOpen] = useState(false);

  return (
    <>
    <div className="rounded-xl border border-stone-200/50 bg-[var(--khatu-hero-card)] p-4 shadow-[0_4px_28px_-10px_rgba(28,25,23,0.12)] sm:rounded-2xl sm:p-5 lg:p-5">
      {/* Top row — scooter | ₹49 + sublabel | T&C */}
      <div className="flex items-center justify-between gap-2 sm:gap-3">
        <span className="shrink-0 text-stone-900" aria-hidden>
          <Bike className="h-8 w-8 sm:h-9 sm:w-9" strokeWidth={2} aria-hidden />
        </span>
        <div className="min-w-0 flex-1 text-center">
          <p className="text-[1.65rem] font-bold tabular-nums leading-none tracking-tight text-[var(--khatu-stone)] sm:text-3xl">
            ₹49
          </p>
          <p className="mt-1 text-xs font-medium text-[var(--khatu-stone-muted)] sm:text-sm">Up to 2 km</p>
        </div>
        <button
          type="button"
          onClick={() => setFareInfoOpen(true)}
          className="flex shrink-0 items-center gap-0.5 text-xs font-semibold text-blue-600 underline underline-offset-2 transition hover:text-blue-700 sm:gap-1 sm:text-sm"
          aria-label="Open fare details and terms"
        >
          <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center text-[11px] font-bold leading-none" aria-hidden>
            i
          </span>
          T&amp;C
        </button>
      </div>

      <h2 className="mt-5 text-balance text-lg font-bold leading-tight text-[var(--khatu-stone)] sm:mt-6 sm:text-xl">
        Khatu Launch Exclusive
      </h2>
      <p className="mt-2 max-w-xl text-xs leading-relaxed text-[var(--khatu-stone-muted)] sm:text-sm">
        Start your journey with Liftngo at an introductory fare — simple slabs, no surprises on your first booking.
      </p>

      <button
        type="button"
        onClick={onBookNow}
        className="mt-5 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl border border-[#8c3719] bg-[#a3431f] px-5 py-3 text-center text-sm font-semibold text-white shadow-md shadow-[#a3431f]/25 transition hover:bg-[#8c3719] active:scale-[0.99] sm:mt-6 sm:min-h-[50px] sm:rounded-2xl sm:text-base"
      >
        Book Your First Ride
        <span className="text-base leading-none sm:text-lg" aria-hidden>
          →
        </span>
      </button>
    </div>
    {fareInfoOpen ? (
      <div className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center sm:p-4" role="presentation">
        <button
          type="button"
          onClick={() => setFareInfoOpen(false)}
          className="absolute inset-0 bg-black/45 backdrop-blur-[1px]"
          aria-label="Close fare details"
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="khatu-fare-info-title"
          className="relative z-10 w-full max-w-lg overflow-hidden rounded-t-2xl border border-stone-200 bg-white shadow-2xl sm:rounded-2xl"
        >
          <div className="flex items-center justify-between border-b border-stone-200 px-4 py-3 sm:px-5">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-stone-500">Fare details</p>
              <h3 id="khatu-fare-info-title" className="text-sm font-bold text-stone-900 sm:text-base">
                Launch and base prices
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setFareInfoOpen(false)}
              className="grid h-8 w-8 place-items-center rounded-full border border-stone-200 text-stone-600 hover:bg-stone-50"
              aria-label="Close"
            >
              <X className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>

          <div className="space-y-4 px-4 py-4 sm:px-5">
            <div>
              <p className="mb-2 text-xs font-semibold text-stone-800">First-ride 2-wheeler slabs</p>
              <div className="grid grid-cols-4 overflow-hidden rounded-xl border border-stone-200">
                {[
                  { price: '₹49', dist: 'Up to 2 km' },
                  { price: '₹69', dist: '2 – 4 km' },
                  { price: '₹89', dist: '4 – 6 km' },
                  { price: '₹99', dist: '6 – 8 km' },
                ].map((row, idx) => (
                  <div key={row.price} className={`px-2 py-2 text-center ${idx !== 3 ? 'border-r border-stone-200' : ''}`}>
                    <p className="text-base font-bold leading-none text-stone-900">{row.price}</p>
                    <p className="mt-1 text-[10px] text-stone-500">{row.dist}</p>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-[11px] leading-snug text-stone-500">
                Applicable on first ride only. Valid for two-wheeler rides within campaign zone.
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold text-stone-800">Other fleet base prices</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { fleet: 'Walk', price: '₹75' },
                  { fleet: '3 Wheeler', price: '₹450' },
                  { fleet: '4 Wheeler', price: '₹720' },
                ].map((row) => (
                  <div key={row.fleet} className="rounded-lg border border-stone-200 bg-stone-50 px-2.5 py-2 text-center">
                    <p className="text-[11px] font-semibold text-stone-700">{row.fleet}</p>
                    <p className="mt-1 text-base font-bold leading-none text-stone-900">{row.price}</p>
                    <p className="mt-1 text-[10px] text-stone-500">base fare</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between gap-2">
              <p className="text-[11px] text-stone-500">Final fare depends on route, time, and availability.</p>
              <Link href={ROUTES.TERMS} className="text-xs font-semibold text-blue-600 underline underline-offset-2">
                Full terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    ) : null}
    </>
  );
}
