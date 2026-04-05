'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import { trackPlanSelected, trackCheckoutStarted } from '@/lib/analytics';
import { Check, ArrowRight, User, Settings, ChevronDown, FileText } from 'lucide-react';
import PlansSubPageShell from '../PlansSubPageShell';
import {
  RENT_PAGE_SUMMARY_STRIP,
  RENT_CARD_FEATURES_WITH_DRIVER,
  RENT_CARD_FEATURES_SELF_DRIVE,
  RENT_CONDITION_SECTIONS,
} from '@/lib/pricing/rentDisclosures';
import { RENT_CATALOG } from '@/lib/pricing/rentCatalog';

export default function RentPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'withDriver' | 'withoutDriver'>('withDriver');
  const [duration, setDuration] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  return (
    <PlansSubPageShell
      title="Rent a vehicle"
      subtitle="Flexible daily, weekly, or monthly rentals — with or without a driver. Confirm scope, km, and taxes in writing before dispatch."
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

      <p className="mt-4 rounded-xl border border-amber-100 bg-amber-50/90 px-3 py-2.5 text-[11px] leading-relaxed text-amber-950 md:text-xs">
        {RENT_PAGE_SUMMARY_STRIP}{' '}
        <Link href={ROUTES.PLANS_GST} className="font-semibold underline decoration-amber-700/50 underline-offset-2 hover:decoration-amber-900">
          GST and invoicing options
        </Link>
        .
      </p>

      <div className="mt-6 grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {RENT_CATALOG.map((opt) => {
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

              <div className="mt-3 flex flex-wrap gap-2">
                {mode === 'withDriver' ? (
                  <>
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-800">Driver — agreed duty</span>
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800">Fuel — normal scope</span>
                  </>
                ) : (
                  <>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-800">DL + KYC</span>
                    <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-900">Deposit may apply</span>
                  </>
                )}
              </div>

              <ul className="mt-3 flex-1 space-y-1.5">
                {(mode === 'withDriver' ? RENT_CARD_FEATURES_WITH_DRIVER : RENT_CARD_FEATURES_SELF_DRIVE).map((f) => (
                  <li key={f} className="flex items-start gap-1.5 text-xs text-gray-600">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" strokeWidth={2.5} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => {
                  trackPlanSelected(`${opt.vehicle}_${mode}_${duration}`, 'rent');
                  trackCheckoutStarted('rent', price);
                  router.push(
                    `${ROUTES.PLANS_RENT_CHECKOUT}?vehicle=${encodeURIComponent(opt.vehicle)}&mode=${mode}&duration=${duration}`,
                  );
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

      <details className="group mt-8 min-w-0 rounded-2xl border border-gray-200 bg-white shadow-sm">
        <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3.5 text-left transition-colors hover:bg-gray-50 md:px-5 md:py-4 [&::-webkit-details-marker]:hidden">
          <FileText className="h-4 w-4 shrink-0 text-[var(--color-primary)]" aria-hidden />
          <span className="min-w-0 flex-1 text-sm font-bold text-gray-900">Full rental conditions — scope, taxes, insurance, disputes</span>
          <ChevronDown className="h-4 w-4 shrink-0 text-gray-500 transition-transform group-open:rotate-180" aria-hidden />
        </summary>
        <div className="border-t border-gray-100 px-4 pb-4 pt-1 md:px-5 md:pb-5">
          <p className="text-[11px] leading-relaxed text-gray-500 md:text-xs">
            Read this before booking. It does not replace your signed agreement; it reduces grey areas (km, tolls, cancellations, cargo, deposits).
          </p>
          <div className="mt-4 space-y-5">
            {RENT_CONDITION_SECTIONS.map((section) => (
              <section key={section.title} className="min-w-0">
                <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500">{section.title}</h3>
                <ul className="mt-2 space-y-1.5">
                  {section.lines.map((line) => (
                    <li key={line} className="text-[11px] leading-relaxed text-gray-700 md:text-xs">
                      {line}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </details>
    </PlansSubPageShell>
  );
}
