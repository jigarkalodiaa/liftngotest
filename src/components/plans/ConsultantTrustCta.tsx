'use client';

import Link from 'next/link';
import { Headphones, Phone } from 'lucide-react';
import { ROUTES } from '@/lib/constants';
import { trackViewPlan } from '@/lib/analytics';

type Layout = 'hub' | 'compact' | 'checkout';

type Props = {
  layout: Layout;
  /** Analytics segment, e.g. `plans_hub`, `lease_card`, `lease_checkout` */
  analyticsSource: string;
  className?: string;
  /** Shown on checkout layout — e.g. `₹3,39,840` */
  amountHint?: string;
};

/**
 * Prominent “talk to us before you pay” CTA for high-commitment flows (lease, volume, etc.).
 */
export default function ConsultantTrustCta({ layout, analyticsSource, className = '', amountHint }: Props) {
  const track = () => trackViewPlan('consultant_trust_cta', analyticsSource);

  if (layout === 'hub') {
    return (
      <div
        className={`mt-4 overflow-hidden rounded-2xl border-2 border-[var(--color-primary)]/25 bg-gradient-to-br from-white via-white to-[var(--color-primary)]/[0.06] p-4 shadow-[0_8px_30px_-12px_rgba(44,45,91,0.35)] ring-1 ring-slate-900/[0.04] sm:p-5 ${className}`}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-sm font-extrabold leading-tight tracking-tight text-[#1e1f4b] md:text-base">
              <span
                className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[var(--color-primary)]/12 text-[var(--color-primary)]"
                aria-hidden
              >
                <Headphones className="h-4 w-4" strokeWidth={2} />
              </span>
              Large payment? Talk to a consultant first.
            </p>
            <p className="mt-2 text-[11px] font-medium leading-relaxed text-slate-600 sm:text-xs">
              Lease and fleet-style commitments are often <strong className="font-semibold text-slate-800">lakhs upfront</strong>. Our
              team clarifies agreement scope, maintenance split, <strong className="font-semibold text-slate-800">GST and invoices</strong>,
              and what happens after you pay — <strong className="font-semibold text-slate-800">same-day callback</strong>, no obligation
              to complete checkout.
            </p>
          </div>
          <Link
            href={ROUTES.CONTACT}
            onClick={track}
            className="inline-flex min-h-[3.25rem] w-full shrink-0 flex-col items-center justify-center gap-0.5 rounded-2xl border-2 border-[var(--color-primary)]/50 bg-white px-5 py-3 text-center shadow-md transition-all duration-200 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/[0.07] hover:shadow-lg active:scale-[0.98] sm:w-auto sm:min-w-[240px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
          >
            <span className="flex items-center gap-2 text-sm font-bold text-[var(--color-primary)]">
              <Phone className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
              Reach sales &amp; partnerships
            </span>
            <span className="max-w-[16rem] text-[10px] font-medium leading-snug text-slate-500">
              Best for trust, billing questions, and custom terms before Razorpay
            </span>
          </Link>
        </div>
      </div>
    );
  }

  if (layout === 'compact') {
    return (
      <Link
        href={ROUTES.CONTACT}
        onClick={track}
        className={`flex min-h-11 flex-1 items-center gap-2 rounded-xl border-2 border-[var(--color-primary)]/35 bg-white px-3 py-2.5 shadow-md transition-all hover:border-[var(--color-primary)]/55 hover:bg-[var(--color-primary)]/[0.05] active:scale-[0.98] md:min-h-12 md:gap-2.5 md:px-4 ${className}`}
      >
        <span
          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
          aria-hidden
        >
          <Headphones className="h-4 w-4" strokeWidth={2} />
        </span>
        <span className="flex min-w-0 flex-col items-start text-left leading-tight">
          <span className="text-xs font-bold text-[var(--color-primary)] md:text-sm">Consultant before you pay</span>
          <span className="mt-0.5 text-[10px] font-medium text-slate-600 md:text-[11px]">
            Agreement, GST, ROI for your lane — free callback
          </span>
        </span>
      </Link>
    );
  }

  // checkout
  return (
    <div
      className={`mt-4 rounded-xl border border-emerald-200/90 bg-gradient-to-br from-emerald-50/95 to-white p-3.5 ring-1 ring-emerald-100/80 sm:p-4 ${className}`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <p className="text-xs font-bold text-emerald-950 sm:text-sm">Not sure yet? That&apos;s expected at this amount.</p>
          <p className="mt-1 text-[11px] leading-relaxed text-emerald-900/85 sm:text-xs">
            {amountHint ? (
              <>
                A prepay of <strong className="font-semibold tabular-nums">{amountHint}</strong> should feel right. A consultant can
                confirm line-items, contract timing, and support contacts{' '}
                <strong className="font-semibold">before</strong> you authorise Razorpay.
              </>
            ) : (
              <>
                A consultant can confirm line-items, contract timing, and support contacts{' '}
                <strong className="font-semibold">before</strong> you authorise Razorpay — same-day callback.
              </>
            )}
          </p>
        </div>
        <Link
          href={ROUTES.CONTACT}
          onClick={track}
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border-2 border-emerald-600/40 bg-white px-4 py-2.5 text-center text-xs font-bold text-emerald-900 shadow-sm transition-all hover:border-emerald-600 hover:bg-emerald-50/80 active:scale-[0.98] sm:min-w-[11rem] sm:text-sm"
        >
          <Phone className="h-4 w-4 shrink-0 text-emerald-700" strokeWidth={2} aria-hidden />
          Talk to a consultant
        </Link>
      </div>
    </div>
  );
}
