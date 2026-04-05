'use client';

import { useMemo, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import { useRazorpay } from '@/lib/razorpay';
import { leasePlanByVehicle } from '@/lib/pricing/leasePlans';
import { INDICATIVE_PRICING_FOOTNOTE } from '@/lib/pricing/subscriptionDisclosures';
import PlansSubPageShell from '../../PlansSubPageShell';
import ConsultantTrustCta from '@/components/plans/ConsultantTrustCta';
import { PrepayLegalDeclaration, buildPrepayLegalRazorpayNotes } from '@/lib/legal/PrepayLegalDeclaration';
import { LeasePrepayConsentSummary, leasePrepayConsentPlainText } from '@/lib/legal/LeasePrepayConsentSummary';
import { trackBookingCompleted, trackCheckoutStarted } from '@/lib/analytics';
import { paymentResultFailureHref, paymentResultSuccessHref } from '@/lib/paymentResultUrl';
import { ChevronLeft, CreditCard, Loader2 } from 'lucide-react';

const GST_RATE = 0.18;
const CONSENT_VERSION = 'lease_checkout_v2_term_total';

export default function LeaseCheckoutClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const vehicleQ = searchParams.get('vehicle');
  const termRaw = searchParams.get('term');
  const termMonths: 6 | 12 = termRaw === '6' ? 6 : 12;

  const plan = useMemo(() => (vehicleQ ? leasePlanByVehicle(vehicleQ) : undefined), [vehicleQ]);

  const [payError, setPayError] = useState<string | null>(null);
  const [payBusy, setPayBusy] = useState(false);
  const [acceptLegal, setAcceptLegal] = useState(false);
  const { openPayment } = useRazorpay();

  /** Per-month lease fee (excl. GST) for the chosen term band. */
  const monthlyExclGst = plan ? (termMonths === 6 ? plan.term6 : plan.term12) : 0;
  /** Full term upfront: monthly × number of months (excl. GST). */
  const termSubtotalExclGst = monthlyExclGst * termMonths;
  const gst =
    termSubtotalExclGst > 0 ? Math.round(termSubtotalExclGst * GST_RATE) : 0;
  const totalInclGst = termSubtotalExclGst + gst;

  useEffect(() => {
    if (!plan) return;
    trackCheckoutStarted('lease_razorpay', totalInclGst);
  }, [plan, totalInclGst]);

  /** Re-show unchecked consent when URL or pricing inputs change so text always matches payment. */
  useEffect(() => {
    setAcceptLegal(false);
  }, [vehicleQ, termMonths]);

  if (!vehicleQ || !plan) {
    return (
      <PlansSubPageShell
        title="Lease checkout"
        subtitle="Choose a plan on the lease page first."
        badge="Lease"
        contentClassName="-mt-6"
      >
        <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
          <p className="text-sm text-gray-600">Invalid or missing vehicle.</p>
          <Link
            href={ROUTES.PLANS_LEASE}
            className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-primary)] underline-offset-2 hover:underline"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
            Back to lease plans
          </Link>
        </div>
      </PlansSubPageShell>
    );
  }

  const handlePay = () => {
    setPayError(null);
    if (!acceptLegal) {
      setPayError('Please confirm the declaration below to continue.');
      return;
    }
    setPayBusy(true);
    openPayment({
      amountInr: totalInclGst,
      receipt: `lease_${termMonths}m_${Date.now()}`,
      description: `Lease term prepaid — ${plan.vehicle} · ${termMonths} mo × ₹${monthlyExclGst}/mo + GST`,
      notes: {
        product: 'lease',
        vehicle: plan.vehicle,
        term_months: String(termMonths),
        monthly_excl_gst_inr: String(monthlyExclGst),
        term_subtotal_excl_gst_inr: String(termSubtotalExclGst),
        gst_18pct_inr: String(gst),
        total_incl_gst_inr: String(totalInclGst),
        lease_consent_snapshot: leasePrepayConsentPlainText({
          vehicle: plan.vehicle,
          termMonths,
          monthlyExclGst,
          termSubtotalExclGst,
          gst,
          totalInclGst,
        }),
        ...buildPrepayLegalRazorpayNotes(CONSENT_VERSION),
      },
      onSuccess: ({ paymentId }) => {
        setPayBusy(false);
        trackBookingCompleted({ flow: 'lease', vehicle: plan.vehicle });
        const retryPath = `${ROUTES.PLANS_LEASE_CHECKOUT}?vehicle=${encodeURIComponent(plan.vehicle)}&term=${termMonths}`;
        router.replace(
          paymentResultSuccessHref({
            flow: 'lease',
            paymentId,
            amountInr: totalInclGst,
            title: `${plan.vehicle} · ${termMonths}-month lease`,
            subtitle: 'Full term prepaid · incl. 18% GST',
            lines: [
              `₹${monthlyExclGst.toLocaleString('en-IN')}/mo × ${termMonths} mo (excl. GST): ₹${termSubtotalExclGst.toLocaleString('en-IN')}`,
              `GST 18%: ₹${gst.toLocaleString('en-IN')} · Total: ₹${totalInclGst.toLocaleString('en-IN')}`,
            ],
            retryPath,
          }),
        );
      },
      onError: (err) => {
        setPayBusy(false);
        if (err === 'Payment cancelled') return;
        const retryPath = `${ROUTES.PLANS_LEASE_CHECKOUT}?vehicle=${encodeURIComponent(plan.vehicle)}&term=${termMonths}`;
        router.push(
          paymentResultFailureHref({
            flow: 'lease',
            title: `Lease · ${plan.vehicle}`,
            message: err,
            amountInr: totalInclGst,
            retryPath,
          }),
        );
      },
    });
  };

  return (
    <PlansSubPageShell
      title={`Lease · ${plan.vehicle}`}
      subtitle={`${termMonths}-month lease · you pay all ${termMonths} months upfront (monthly rate × ${termMonths}, excl. GST + 18%).`}
      badge="Checkout"
      contentClassName="-mt-6"
    >
      <Link
        href={ROUTES.PLANS_LEASE}
        className="mb-4 inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-primary)] underline-offset-2 hover:underline md:text-sm"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden />
        Back to lease plans
      </Link>

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-2 border-b border-gray-100 pb-4 sm:flex-row sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-gray-500">Full term due now</p>
            <p className="text-lg font-bold text-gray-900">
              ₹{monthlyExclGst.toLocaleString('en-IN')}/mo × {termMonths} months
            </p>
          </div>
          <p className="text-2xl font-extrabold text-[var(--color-primary)] sm:text-right">
            ₹{totalInclGst.toLocaleString('en-IN')}
            <span className="mt-1 block text-xs font-normal text-gray-500">Incl. 18% GST on full term amount</span>
          </p>
        </div>

        <div className="mt-4 space-y-1.5 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Monthly rate (excl. GST)</span>
            <span className="tabular-nums text-gray-900">₹{monthlyExclGst.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>
              × {termMonths} months (subtotal excl. GST)
            </span>
            <span className="tabular-nums text-gray-900">₹{termSubtotalExclGst.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>GST 18% on subtotal</span>
            <span className="tabular-nums text-gray-900">₹{gst.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between border-t border-gray-100 pt-2 font-semibold text-gray-900">
            <span>Total payable</span>
            <span className="tabular-nums text-[var(--color-primary)]">₹{totalInclGst.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <p className="mt-4 rounded-lg border border-amber-100 bg-amber-50/90 p-2.5 text-[11px] text-amber-950">
          {INDICATIVE_PRICING_FOOTNOTE}
        </p>

        <div className="mt-4 flex gap-2">
          {([6, 12] as const).map((t) => (
            <Link
              key={t}
              href={`${ROUTES.PLANS_LEASE_CHECKOUT}?vehicle=${encodeURIComponent(plan.vehicle)}&term=${t}`}
              className={`flex-1 rounded-lg border py-2 text-center text-xs font-bold ${
                termMonths === t ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]' : 'border-gray-200 text-gray-600'
              }`}
            >
              {t} months
            </Link>
          ))}
        </div>

        <div className="mt-5" aria-live="polite" aria-atomic="true">
          <PrepayLegalDeclaration
            checked={acceptLegal}
            onCheckedChange={setAcceptLegal}
            productSummary={
              <LeasePrepayConsentSummary
                vehicle={plan.vehicle}
                termMonths={termMonths}
                monthlyExclGst={monthlyExclGst}
                termSubtotalExclGst={termSubtotalExclGst}
                gst={gst}
                totalInclGst={totalInclGst}
              />
            }
          />
        </div>

        {payError ? (
          <p className="mt-3 text-sm text-red-600" role="alert">
            {payError}
          </p>
        ) : null}

        <ConsultantTrustCta
          layout="checkout"
          analyticsSource="lease_checkout"
          amountHint={`₹${totalInclGst.toLocaleString('en-IN')} incl. GST`}
        />

        <button
          type="button"
          disabled={payBusy || !acceptLegal}
          onClick={handlePay}
          className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-3 text-sm font-bold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-55"
        >
          {payBusy ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
              Opening Razorpay…
            </>
          ) : (
            <>
              <CreditCard className="h-5 w-5" aria-hidden />
              Pay ₹{totalInclGst.toLocaleString('en-IN')}
            </>
          )}
        </button>
      </div>
    </PlansSubPageShell>
  );
}
