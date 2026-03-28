'use client';

import { Bike, MapPin, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui';

const SLABS = [
  { range: 'Up to 2 km', price: '₹49' },
  { range: '2 – 4 km', price: '₹69' },
  { range: '4 – 6 km', price: '₹89' },
  { range: '6 – 8 km', price: '₹99' },
] as const;

interface KhatuHeroOfferProps {
  onBookNow: () => void;
}

export default function KhatuHeroOffer({ onBookNow }: KhatuHeroOfferProps) {
  return (
    <Card
      variant="khatu"
      className="relative overflow-hidden border-[var(--khatu-saffron)]/15 bg-gradient-to-br from-[var(--khatu-ivory)] via-amber-50/40 to-[var(--khatu-cream)]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(194,65,12,0.08),transparent_50%)]" />
      <div className="pointer-events-none absolute -right-12 top-0 h-40 w-40 rounded-full bg-[var(--khatu-saffron)]/[0.06] blur-3xl" />

      <div className="relative px-4 py-5 sm:px-6 sm:py-6">
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--khatu-stone-muted)]">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-2.5 py-1 text-[var(--khatu-stone)] ring-1 ring-stone-200/80">
            <Bike className="h-3.5 w-3.5 text-[var(--khatu-saffron)]" strokeWidth={2} aria-hidden />
            2W corridor
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-2.5 py-1 text-[var(--khatu-stone)] ring-1 ring-stone-200/80">
            <MapPin className="h-3.5 w-3.5 text-[var(--khatu-saffron)]" strokeWidth={2} aria-hidden />
            Khatu
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--khatu-saffron)]/10 px-2.5 py-1 text-[var(--khatu-saffron)] ring-1 ring-[var(--khatu-saffron)]/20">
            <Sparkles className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
            Launch
          </span>
        </div>

        <h2 className="mt-4 text-balance text-2xl font-semibold leading-tight tracking-tight text-[var(--khatu-stone)] sm:text-[1.65rem]">
          Khatu Launch Exclusive
        </h2>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-[var(--khatu-stone-muted)] sm:text-[0.95rem]">
          Start your journey with Liftngo at an introductory fare — simple slabs, no surprises on your first booking.
        </p>

        <div className="mt-5 overflow-hidden rounded-2xl ring-1 ring-stone-200/90">
          <div className="grid grid-cols-2 gap-px bg-stone-200/90 sm:grid-cols-4">
            {SLABS.map((row) => (
              <div
                key={row.range}
                className="bg-white px-3 py-3 text-center sm:px-4 sm:py-3.5"
              >
                <p className="text-lg font-semibold tabular-nums text-[var(--khatu-stone)] sm:text-xl">
                  {row.price}
                </p>
                <p className="mt-0.5 text-[10px] font-medium leading-snug text-[var(--khatu-stone-muted)] sm:text-[11px]">
                  {row.range}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3 flex flex-col gap-1 text-[11px] leading-snug text-[var(--khatu-stone-muted)]">
          <p>Applicable on first ride only.</p>
          <p>Valid for two-wheeler rides within the campaign zone.</p>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={onBookNow}
            className="min-h-[48px] w-full rounded-2xl bg-[var(--khatu-saffron)] px-6 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-[var(--khatu-saffron)]/25 transition hover:bg-[var(--khatu-saffron-soft)] sm:w-auto sm:min-w-[220px]"
          >
            Book Your First Ride
          </button>
          <p className="text-center text-[11px] text-[var(--khatu-stone-muted)] sm:text-left">
            Temple-route rides · upfront estimate on next step
          </p>
        </div>
      </div>
    </Card>
  );
}
