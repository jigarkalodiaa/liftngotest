'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/constants';
import { LEASE_PLANS, type LeasePlan } from '@/lib/pricing/leasePlans';
import PlansSubPageShell from '../PlansSubPageShell';
import { trackPlanSelected, trackCheckoutStarted } from '@/lib/analytics';
import ConsultantTrustCta from '@/components/plans/ConsultantTrustCta';
import { ArrowRight, TrendingUp, Shield, Wrench, Info, X, Check } from 'lucide-react';

type LeaseInfoOpen = null | { kind: 'platform_earn' } | { kind: 'plan'; plan: LeasePlan };

export default function LeasePage() {
  const router = useRouter();
  const [infoOpen, setInfoOpen] = useState<LeaseInfoOpen>(null);

  useEffect(() => {
    if (!infoOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setInfoOpen(null);
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [infoOpen]);

  return (
    <PlansSubPageShell
      title="Lease a vehicle"
      subtitle="6 or 12 month terms · full-term prepay excl. GST + 18% GST at checkout · tap ⓘ on a card for ROI, inclusions, and notes."
      badge="Long-term lease"
      contentClassName="-mt-6"
    >
      <div className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2.5 shadow-lg shadow-slate-900/[0.06] ring-1 ring-slate-900/[0.06] md:gap-3 md:px-4 md:py-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-violet-100/90 text-violet-700">
          <TrendingUp className="h-4 w-4" strokeWidth={2} aria-hidden />
        </div>
        <p className="min-w-0 flex-1 text-[11px] leading-snug text-slate-600 md:text-xs">
          Indicative platform earning can offset lease cost. Bands vary by vehicle and demand — not a guarantee of income.
        </p>
        <button
          type="button"
          onClick={() => setInfoOpen({ kind: 'platform_earn' })}
          className="grid h-8 w-8 shrink-0 place-items-center text-slate-500 transition-colors hover:text-slate-700 md:h-9 md:w-9"
          aria-label="How platform earning relates to lease cost"
        >
          <Info className="h-3.5 w-3.5 md:h-4 md:w-4" strokeWidth={2} aria-hidden />
        </button>
      </div>

      <div className="mt-4 grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {LEASE_PLANS.map((plan) => {
          const roi12 = plan.earning - plan.term12;
          return (
            <div
              key={plan.vehicle}
              className="flex min-w-0 flex-col rounded-2xl bg-white p-3 shadow-lg shadow-slate-900/[0.06] ring-1 ring-slate-900/[0.06] transition-all duration-200 hover:shadow-xl md:p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-sm font-bold leading-tight text-slate-900 md:text-base">{plan.vehicle}</h2>
                <button
                  type="button"
                  onClick={() => setInfoOpen({ kind: 'plan', plan })}
                  className="grid h-8 w-8 shrink-0 place-items-center text-slate-500 transition-colors hover:text-slate-700"
                  aria-label={`${plan.vehicle}: monthly ROI, what’s included, and billing notes`}
                >
                  <Info className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
                </button>
              </div>

              <div className="mt-2.5 grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-slate-50/90 px-2 py-2 text-center ring-1 ring-slate-100/90">
                  <p className="text-[9px] font-bold uppercase tracking-wide text-slate-500">6 mo</p>
                  <p className="mt-0.5 text-base font-extrabold tabular-nums tracking-tight text-slate-900">
                    ₹{plan.term6.toLocaleString('en-IN')}
                  </p>
                  <p className="text-[9px] text-slate-500">/mo excl. GST</p>
                </div>
                <div className="rounded-xl bg-violet-50/90 px-2 py-2 text-center ring-1 ring-violet-100/90">
                  <p className="text-[9px] font-bold uppercase tracking-wide text-violet-700">12 mo</p>
                  <p className="mt-0.5 text-base font-extrabold tabular-nums tracking-tight text-violet-900">
                    ₹{plan.term12.toLocaleString('en-IN')}
                  </p>
                  <p className="text-[9px] text-violet-600">/mo · best rate</p>
                </div>
              </div>

              <p className="mt-2 line-clamp-2 rounded-xl bg-emerald-50/90 px-2 py-1.5 text-[10px] font-medium leading-snug text-emerald-950/90 ring-1 ring-emerald-100/80">
                Indicative net ~₹{roi12.toLocaleString('en-IN')}/mo at 12-mo lease rate (earning − lease).
              </p>

              <div className="mt-3 flex min-w-0 flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => {
                    trackPlanSelected(plan.vehicle, 'lease');
                    trackCheckoutStarted('lease', plan.term12);
                    router.push(
                      `${ROUTES.PLANS_LEASE_CHECKOUT}?vehicle=${encodeURIComponent(plan.vehicle)}&term=12`,
                    );
                  }}
                  className="flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-xl bg-[var(--color-primary)] py-2.5 text-xs font-bold text-white shadow-sm transition-all active:scale-[0.98] md:min-h-12 md:text-sm"
                >
                  Lease now
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 md:h-4 md:w-4" aria-hidden />
                </button>
                <ConsultantTrustCta layout="compact" analyticsSource="lease_page_card" className="flex-1 sm:flex-none sm:min-w-[12.5rem]" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        <Link
          href="/terms"
          className="inline-flex min-h-10 items-center rounded-xl px-3 py-2 text-[11px] font-semibold text-[var(--color-primary)] underline-offset-2 hover:underline"
        >
          Terms of Service
        </Link>
        <span className="text-slate-300" aria-hidden>
          ·
        </span>
        <Link
          href="/privacy"
          className="inline-flex min-h-10 items-center rounded-xl px-3 py-2 text-[11px] font-semibold text-[var(--color-primary)] underline-offset-2 hover:underline"
        >
          Privacy
        </Link>
      </div>

      {infoOpen ? (
        <div className="fixed inset-0 z-[110] flex items-end justify-center sm:items-center sm:p-4" role="presentation">
          <button
            type="button"
            className="absolute inset-0 z-0 bg-slate-900/45 backdrop-blur-[2px]"
            aria-label="Close"
            onClick={() => setInfoOpen(null)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="lease-info-title"
            className="relative z-10 flex max-h-[min(88vh,100dvh)] w-full max-w-md flex-col overflow-hidden rounded-t-[1.35rem] bg-white shadow-2xl ring-1 ring-slate-900/[0.06] sm:max-h-[min(92vh,820px)] sm:rounded-2xl"
          >
            <div className="flex shrink-0 justify-center pt-2.5 sm:hidden" aria-hidden>
              <div className="h-1 w-11 rounded-full bg-slate-200/90" />
            </div>
            <div className="flex shrink-0 items-start justify-between gap-3 border-b border-slate-100 px-4 pb-3 pt-2 sm:px-5 sm:pb-4 sm:pt-4">
              <h2 id="lease-info-title" className="pr-2 text-base font-bold tracking-tight text-slate-900 sm:text-lg">
                {infoOpen.kind === 'platform_earn' && 'Platform earning & lease'}
                {infoOpen.kind === 'plan' && `${infoOpen.plan.vehicle} — details`}
              </h2>
              <button
                type="button"
                onClick={() => setInfoOpen(null)}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-slate-200/80 bg-white text-slate-500 shadow-sm hover:bg-slate-50"
                aria-label="Close"
              >
                <X className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-3 sm:px-5 sm:py-4">
              {infoOpen.kind === 'platform_earn' ? (
                <div className="space-y-3">
                  <p className="text-[12px] leading-relaxed text-slate-700 sm:text-[13px]">
                    Many partners use Liftngo&apos;s demand to run trips on a leased vehicle. Illustrative earning bands
                    shown on this page (e.g. ₹35k–₹85k/month before costs) are not guaranteed — they depend on lanes,
                    utilisation, incentives, and your operational choices.
                  </p>
                  <ul className="space-y-2">
                    {[
                      'Lease rates are for the vehicle access in the agreement — not per-trip fares.',
                      'Checkout shows the prepaid term total excl. GST plus 18% GST; invoicing follows confirmation.',
                      'Use ROI report or support for a scenario tailored to your city and vehicle.',
                    ].map((line, i) => (
                      <li key={i} className="flex gap-2 text-[11px] leading-relaxed text-slate-700 sm:text-xs">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" strokeWidth={2.25} aria-hidden />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {infoOpen.kind === 'plan' ? (
                <div className="space-y-4">
                  <div className="rounded-xl border border-emerald-100 bg-emerald-50/80 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-800">
                      Indicative monthly math (12-month rate)
                    </p>
                    <div className="mt-2 space-y-1 text-[12px]">
                      <div className="flex justify-between gap-2">
                        <span className="text-slate-600">Earning (illustrative)</span>
                        <span className="font-semibold tabular-nums text-slate-900">
                          ₹{infoOpen.plan.earning.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="flex justify-between gap-2">
                        <span className="text-slate-600">Lease / month excl. GST</span>
                        <span className="font-semibold tabular-nums text-red-600">
                          −₹{infoOpen.plan.term12.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="flex justify-between gap-2 border-t border-emerald-200/80 pt-1.5">
                        <span className="font-bold text-emerald-900">Net (indicative)</span>
                        <span className="text-base font-extrabold tabular-nums text-emerald-700">
                          ₹{(infoOpen.plan.earning - infoOpen.plan.term12).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                    <p className="mt-2 text-[10px] leading-snug text-emerald-900/80">
                      6-month pricing is higher per month on purpose; checkout lets you pick the term and shows GST on the
                      full prepaid amount.
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">What&apos;s included</p>
                    <ul className="mt-2 space-y-2">
                      {infoOpen.plan.responsibilities.map((r) => (
                        <li key={r} className="flex items-start gap-2 text-[12px] leading-snug text-slate-700">
                          {r.toLowerCase().includes('your end') ? (
                            <Wrench className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" strokeWidth={2} aria-hidden />
                          ) : (
                            <Shield className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" strokeWidth={2} aria-hidden />
                          )}
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <p className="rounded-lg bg-slate-100/90 px-2.5 py-2 text-[10px] leading-snug text-slate-600 sm:text-[11px]">
                    Full lease scope, maintenance split, and activation steps are in the agreement after you confirm payment.
                    Refunds and disputes follow the Terms and your payment method rules.
                  </p>
                  <Link
                    href="/terms"
                    onClick={() => setInfoOpen(null)}
                    className="inline-block text-[11px] font-semibold text-[var(--color-primary)] underline-offset-2 hover:underline"
                  >
                    Terms of Service
                  </Link>
                </div>
              ) : null}

              <button
                type="button"
                onClick={() => setInfoOpen(null)}
                className="mt-4 w-full rounded-xl bg-[var(--color-primary)] py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-95"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </PlansSubPageShell>
  );
}
