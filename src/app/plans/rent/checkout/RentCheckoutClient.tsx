'use client';

import { useMemo, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import { useRazorpay } from '@/lib/razorpay';
import { rentPriceFor, type RentDuration, type RentMode } from '@/lib/pricing/rentCatalog';
import { INDICATIVE_PRICING_FOOTNOTE } from '@/lib/pricing/subscriptionDisclosures';
import PlansSubPageShell from '../../PlansSubPageShell';
import { PrepayLegalDeclaration, buildPrepayLegalRazorpayNotes } from '@/lib/legal/PrepayLegalDeclaration';
import { trackBookingCompleted, trackCheckoutStarted } from '@/lib/analytics';
import { trackEvent } from '@/lib/posthogAnalytics';
import { getBookingUserType } from '@/lib/posthog/bookingUserType';
import { paymentResultFailureHref, paymentResultSuccessHref } from '@/lib/paymentResultUrl';
import { ChevronLeft, CreditCard, Loader2 } from 'lucide-react';

const GST_RATE = 0.18;
const CONSENT_VERSION = 'rent_checkout_v1';

function parseMode(s: string | null): RentMode {
  return s === 'withoutDriver' ? 'withoutDriver' : 'withDriver';
}

function parseDuration(s: string | null): RentDuration {
  if (s === 'weekly' || s === 'monthly') return s;
  return 'daily';
}

export default function RentCheckoutClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const vehicleQ = searchParams.get('vehicle');
  const mode = parseMode(searchParams.get('mode'));
  const duration = parseDuration(searchParams.get('duration'));

  const resolved = useMemo(
    () => (vehicleQ ? rentPriceFor(vehicleQ, mode, duration) : undefined),
    [vehicleQ, mode, duration],
  );

  const [payError, setPayError] = useState<string | null>(null);
  const [payBusy, setPayBusy] = useState(false);
  const [acceptLegal, setAcceptLegal] = useState(false);
  const { openPayment } = useRazorpay();

  const periodExcl = resolved?.price ?? 0;
  const gst = periodExcl > 0 ? Math.round(periodExcl * GST_RATE) : 0;
  const totalInclGst = periodExcl + gst;

  useEffect(() => {
    if (!resolved) return;
    trackCheckoutStarted('rent_razorpay', totalInclGst);
  }, [resolved, totalInclGst]);

  if (!vehicleQ || !resolved) {
    return (
      <PlansSubPageShell
        title="Rent checkout"
        subtitle="Choose a vehicle and term on the rent page first."
        badge="Rent"
        contentClassName="-mt-6"
      >
        <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
          <p className="text-sm text-gray-600">Invalid rental selection.</p>
          <Link
            href={ROUTES.PLANS_RENT}
            className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-primary)] underline-offset-2 hover:underline"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
            Back to rent
          </Link>
        </div>
      </PlansSubPageShell>
    );
  }

  const { opt } = resolved;
  const modeLabel = mode === 'withDriver' ? 'With driver' : 'Self drive';
  const durationLabel = duration === 'daily' ? 'day' : duration === 'weekly' ? 'week' : 'month';

  const handlePay = () => {
    setPayError(null);
    if (!acceptLegal) {
      setPayError('Please confirm the declaration below to continue.');
      return;
    }
    setPayBusy(true);
    openPayment({
      amountInr: totalInclGst,
      receipt: `rent_${duration}_${Date.now()}`,
      description: `Vehicle rent — ${opt.vehicle} · ${duration} · ${modeLabel}`,
      notes: {
        product: 'rent',
        vehicle: opt.vehicle,
        mode,
        duration,
        period_excl_gst_inr: String(periodExcl),
        gst_18pct_inr: String(gst),
        total_incl_gst_inr: String(totalInclGst),
        ...buildPrepayLegalRazorpayNotes(CONSENT_VERSION),
      },
      onSuccess: ({ paymentId }) => {
        setPayBusy(false);
        trackEvent('ride_booked', {
          amount: totalInclGst,
          vehicle_type: opt.vehicle,
          distance_km: null,
          user_type: getBookingUserType(),
          flow: 'rent',
        });
        trackBookingCompleted({ flow: 'rent', vehicle: opt.vehicle });
        const retryPath = `${ROUTES.PLANS_RENT_CHECKOUT}?vehicle=${encodeURIComponent(opt.vehicle)}&mode=${mode}&duration=${duration}`;
        router.replace(
          paymentResultSuccessHref({
            flow: 'rent',
            paymentId,
            amountInr: totalInclGst,
            title: `${opt.vehicle} · ${modeLabel}`,
            subtitle: `One ${durationLabel} · incl. 18% GST`,
            lines: [
              `Rental (excl. GST): ₹${periodExcl.toLocaleString('en-IN')} · GST: ₹${gst.toLocaleString('en-IN')}`,
              `Total: ₹${totalInclGst.toLocaleString('en-IN')}`,
            ],
            retryPath,
          }),
        );
      },
      onError: (err) => {
        setPayBusy(false);
        if (err === 'Payment cancelled') return;
        const retryPath = `${ROUTES.PLANS_RENT_CHECKOUT}?vehicle=${encodeURIComponent(opt.vehicle)}&mode=${mode}&duration=${duration}`;
        router.push(
          paymentResultFailureHref({
            flow: 'rent',
            title: `Rent · ${opt.vehicle}`,
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
      title={`Rent · ${opt.vehicle}`}
      subtitle={`${modeLabel} · per ${durationLabel} · excl. GST + 18% for this checkout.`}
      badge="Checkout"
      contentClassName="-mt-6"
    >
      <Link
        href={ROUTES.PLANS_RENT}
        className="mb-4 inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-primary)] underline-offset-2 hover:underline md:text-sm"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden />
        Back to rent plans
      </Link>

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
        <p className="text-sm text-gray-600">{opt.bestFor}</p>
        <div className="mt-3 flex flex-col gap-2 border-b border-gray-100 pb-4 sm:flex-row sm:justify-between">
          <p className="text-lg font-bold text-gray-900 capitalize">
            {duration} rate ({modeLabel})
          </p>
          <p className="text-2xl font-extrabold text-[var(--color-primary)] sm:text-right">
            ₹{totalInclGst.toLocaleString('en-IN')}
            <span className="mt-1 block text-xs font-normal text-gray-500">Incl. 18% GST</span>
          </p>
        </div>
        <div className="mt-4 space-y-1.5 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Rental (excl. GST)</span>
            <span className="tabular-nums text-gray-900">₹{periodExcl.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>GST 18%</span>
            <span className="tabular-nums text-gray-900">₹{gst.toLocaleString('en-IN')}</span>
          </div>
        </div>
        <p className="mt-4 rounded-lg border border-amber-100 bg-amber-50/90 p-2.5 text-[11px] text-amber-950">
          {INDICATIVE_PRICING_FOOTNOTE}
        </p>

        <PrepayLegalDeclaration
          className="mt-5"
          checked={acceptLegal}
          onCheckedChange={setAcceptLegal}
          productSummary={
            <>
              I confirm this payment is for <strong className="font-semibold">vehicle rental</strong> —{' '}
              <strong className="font-semibold">{opt.vehicle}</strong>, <strong className="font-semibold">{modeLabel}</strong>, billed for{' '}
              <strong className="font-semibold">one {durationLabel}</strong> at{' '}
              <strong className="font-semibold">₹{periodExcl.toLocaleString('en-IN')} excl. GST</strong>, plus{' '}
              <strong className="font-semibold">18% GST (₹{gst.toLocaleString('en-IN')})</strong>, total{' '}
              <strong className="font-semibold">₹{totalInclGst.toLocaleString('en-IN')} incl. GST</strong>. Scope, deposit,
              and agreement follow your written confirmation and the Terms.
            </>
          }
        />

        {payError ? (
          <p className="mt-3 text-sm text-red-600" role="alert">
            {payError}
          </p>
        ) : null}

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
