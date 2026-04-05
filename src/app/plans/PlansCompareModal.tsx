'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import {
  SUBSCRIPTION_PACKS_3W,
  formatSubscriptionRupee,
  subscriptionPackPriceNote,
  subscriptionPackSavingsLabel,
  type SubscriptionPack,
} from '@/lib/pricing/subscriptionPacks';
import { INDICATIVE_PRICING_FOOTNOTE } from '@/lib/pricing/subscriptionDisclosures';
import { Check, X, Star } from 'lucide-react';

function orderedFeatureRows(packs: readonly SubscriptionPack[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const p of packs) {
    for (const f of p.features) {
      if (!seen.has(f)) {
        seen.add(f);
        out.push(f);
      }
    }
  }
  return out;
}

type PlansCompareModalProps = {
  open: boolean;
  onClose: () => void;
  onLockPlan: (packName: string) => void;
};

export default function PlansCompareModal({ open, onClose, onLockPlan }: PlansCompareModalProps) {
  const packs = SUBSCRIPTION_PACKS_3W;
  const featureRows = useMemo(() => orderedFeatureRows(packs), []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-end justify-center sm:items-center sm:p-4" role="presentation">
      <button
        type="button"
        className="absolute inset-0 z-0 bg-slate-900/45 backdrop-blur-[2px]"
        aria-label="Close comparison"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="plans-compare-title"
        className="relative z-10 flex max-h-[min(92vh,100dvh)] w-full max-w-5xl flex-col overflow-hidden rounded-t-[1.35rem] bg-white shadow-2xl ring-1 ring-slate-900/[0.06] sm:max-h-[min(90vh,900px)] sm:rounded-2xl"
      >
        <div className="flex shrink-0 justify-center pt-2.5 sm:hidden" aria-hidden>
          <div className="h-1 w-11 rounded-full bg-slate-200/90" />
        </div>
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-slate-100 bg-gradient-to-br from-slate-50 via-white to-[var(--color-primary)]/[0.06] px-4 pb-3 pt-2 sm:px-5 sm:pb-4 sm:pt-4">
          <div className="min-w-0 pt-0.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">Trip packs · 3W</p>
            <h2 id="plans-compare-title" className="mt-0.5 text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
              Compare plans
            </h2>
            <p className="mt-1 text-[11px] leading-snug text-slate-600 sm:text-xs">
              Same vehicle class and in-pack rules; tiers differ by volume, support, and per-trip rate. Numbers are
              directional.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-slate-200/80 bg-white text-slate-500 shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800"
            aria-label="Close"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-x-auto overflow-y-auto overscroll-contain">
          <table className="w-full min-w-[640px] border-collapse text-left text-[11px] sm:min-w-0 sm:text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/90">
                <th className="sticky left-0 z-[1] min-w-[140px] bg-slate-50/95 px-3 py-3 font-semibold text-slate-700 backdrop-blur-sm sm:px-4">
                  &nbsp;
                </th>
                {packs.map((p) => (
                  <th key={p.id} className="px-2 py-3 align-bottom font-bold text-slate-900 sm:px-3">
                    <div className="flex flex-col gap-1">
                      {p.popular ? (
                        <span className="inline-flex w-fit items-center gap-0.5 rounded-full bg-[var(--color-primary)] px-2 py-px text-[8px] font-bold uppercase tracking-wide text-white">
                          <Star className="h-2 w-2 fill-white" strokeWidth={2} aria-hidden /> Popular
                        </span>
                      ) : null}
                      {p.offer && !p.popular ? (
                        <span className="inline-flex w-fit rounded-full bg-amber-500 px-2 py-px text-[8px] font-bold uppercase text-white">
                          Best value
                        </span>
                      ) : null}
                      <span>{p.name}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <th className="sticky left-0 z-[1] bg-white px-3 py-2.5 text-left font-semibold text-slate-600 backdrop-blur-sm sm:px-4">
                  Pack price
                </th>
                {packs.map((p) => (
                  <td key={p.id} className="px-2 py-2.5 font-bold tabular-nums text-slate-900 sm:px-3">
                    {formatSubscriptionRupee(p.total)}
                  </td>
                ))}
              </tr>
              <tr className="bg-slate-50/40">
                <th className="sticky left-0 z-[1] bg-slate-50/90 px-3 py-2.5 text-left font-semibold text-slate-600 backdrop-blur-sm sm:px-4">
                  Per trip
                </th>
                {packs.map((p) => (
                  <td key={p.id} className="px-2 py-2.5 tabular-nums text-slate-800 sm:px-3">
                    {formatSubscriptionRupee(p.perTrip)}
                  </td>
                ))}
              </tr>
              <tr>
                <th className="sticky left-0 z-[1] bg-white px-3 py-2.5 text-left font-semibold text-slate-600 backdrop-blur-sm sm:px-4">
                  Trips / window
                </th>
                {packs.map((p) => (
                  <td key={p.id} className="px-2 py-2.5 text-slate-800 sm:px-3">
                    {p.trips} trips · 30-day validity
                  </td>
                ))}
              </tr>
              <tr className="bg-slate-50/40">
                <th className="sticky left-0 z-[1] bg-slate-50/90 px-3 py-2.5 text-left font-semibold text-slate-600 backdrop-blur-sm sm:px-4">
                  vs ad-hoc anchor
                </th>
                {packs.map((p) => (
                  <td key={p.id} className="px-2 py-2.5 text-slate-700 sm:px-3">
                    <span className="line-through tabular-nums text-slate-400">
                      {formatSubscriptionRupee(p.payPerUse * p.trips)}
                    </span>
                    <span className="mt-0.5 block text-emerald-700">{subscriptionPackSavingsLabel(p)}</span>
                  </td>
                ))}
              </tr>
              <tr>
                <th className="sticky left-0 z-[1] bg-white px-3 py-2.5 text-left font-semibold text-slate-600 backdrop-blur-sm sm:px-4">
                  Best for
                </th>
                {packs.map((p) => (
                  <td key={p.id} className="max-w-[11rem] px-2 py-2.5 leading-snug text-slate-700 sm:px-3">
                    {p.bestFor}
                  </td>
                ))}
              </tr>
              {featureRows.map((feature, idx) => {
                const rowBg = idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/55';
                return (
                  <tr key={feature} className={rowBg}>
                    <th
                      className={`sticky left-0 z-[1] px-3 py-2 text-left font-medium text-slate-600 shadow-[1px_0_0_0_rgba(226,232,240,0.9)] backdrop-blur-sm sm:px-4 ${rowBg}`}
                    >
                      {feature}
                    </th>
                    {packs.map((p) => {
                      const has = p.features.includes(feature);
                      return (
                        <td key={p.id} className={`px-2 py-2 text-center sm:px-3 ${rowBg}`}>
                          {has ? (
                            <Check className="mx-auto h-4 w-4 text-emerald-600" strokeWidth={2.5} aria-label="Included" />
                          ) : (
                            <span className="inline-flex text-slate-300" aria-label="Not included">
                              <X className="mx-auto h-4 w-4" strokeWidth={2} />
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="shrink-0 space-y-2 border-t border-slate-100 bg-slate-50/80 px-3 py-3 sm:px-5">
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {packs.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => onLockPlan(p.name)}
                className={`flex min-h-10 flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-2 text-center text-[10px] font-bold transition-all active:scale-[0.98] sm:min-h-11 sm:text-xs ${
                  p.popular
                    ? 'bg-[var(--color-primary)] text-white shadow-sm hover:opacity-95'
                    : 'border border-slate-200 bg-white text-slate-900 shadow-sm hover:border-teal-200/80 hover:bg-teal-50/30'
                }`}
              >
                Lock {p.name}
                <span className="hidden font-normal text-[9px] opacity-90 sm:inline">{subscriptionPackPriceNote(p)}</span>
              </button>
            ))}
          </div>
          <p className="text-[10px] leading-snug text-slate-500 sm:text-[11px]">{INDICATIVE_PRICING_FOOTNOTE}</p>
          <Link
            href="/terms"
            onClick={onClose}
            className="inline-block text-[10px] font-semibold text-[var(--color-primary)] underline-offset-2 hover:underline sm:text-xs"
          >
            Terms of Service
          </Link>
        </div>
      </div>
    </div>
  );
}
