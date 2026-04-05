'use client';

import { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import { computeBulkPlanQuote } from '@/lib/pricing/bulkPlanQuote';
import { clearCustomPlanSession, loadCustomPlanSession, type CustomPlanConfigSnapshot } from '@/lib/customPlanCheckoutSession';
import PlansSubPageShell from '../../PlansSubPageShell';
import { PrepayLegalDeclaration, buildPrepayLegalRazorpayNotes } from '@/lib/legal/PrepayLegalDeclaration';
import {
  INDICATIVE_PRICING_FOOTNOTE,
  TOLL_CHARGES_SEPARATE_NOTE,
} from '@/lib/pricing/subscriptionDisclosures';
import { useRazorpay } from '@/lib/razorpay';
import { paymentResultFailureHref, paymentResultSuccessHref } from '@/lib/paymentResultUrl';
import { trackBookingCompleted, trackCheckoutStarted } from '@/lib/analytics';
import { getSenderDetails, getStoredPhone } from '@/lib/storage';
import { addGstSchema, normalizeGstInput } from '@/lib/validations';
import ConsultantTrustCta from '@/components/plans/ConsultantTrustCta';
import { Check, ChevronLeft, CreditCard, Loader2, Building2 } from 'lucide-react';

const GST_RATE = 0.18;
const LEGAL_VERSION = 'custom_plan_checkout_v1';

const VEHICLE_LABEL: Record<string, string> = { '2W': '2-Wheeler', '3W': '3-Wheeler', '4W': '4-Wheeler' };

export default function CustomPlanCheckoutClient() {
  const router = useRouter();
  const [configs, setConfigs] = useState<CustomPlanConfigSnapshot[] | null>(null);

  useEffect(() => {
    const s = loadCustomPlanSession();
    if (!s) {
      router.replace(ROUTES.PLANS_CUSTOM);
      return;
    }
    setConfigs(s.configs);
  }, [router]);

  const quote = useMemo(() => (configs ? computeBulkPlanQuote(configs) : null), [configs]);

  const packSubtotalExclGst = quote?.payTotal ?? 0;
  const gstOnPack = packSubtotalExclGst > 0 ? Math.round(packSubtotalExclGst * GST_RATE) : 0;
  const grandTotalInclGst = packSubtotalExclGst + gstOnPack;

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [gstinInput, setGstinInput] = useState('');
  const [legalNameInput, setLegalNameInput] = useState('');
  const [gstFieldErrors, setGstFieldErrors] = useState<{ gstin?: string; legalName?: string }>({});
  const [acceptLegal, setAcceptLegal] = useState(false);
  const [payBusy, setPayBusy] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  const { openPayment } = useRazorpay();

  useEffect(() => {
    const sender = getSenderDetails();
    if (sender?.name) setCustomerName(sender.name);
  }, []);

  useEffect(() => {
    if (!quote) return;
    trackCheckoutStarted('custom_plan_razorpay', grandTotalInclGst);
  }, [quote, grandTotalInclGst]);

  if (!configs || !quote) {
    return (
      <PlansSubPageShell
        title="Checkout"
        subtitle="Preparing your custom plan…"
        badge="Custom plan"
        contentClassName="-mt-6"
      >
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
          Loading your plan…
        </div>
      </PlansSubPageShell>
    );
  }

  const handlePay = () => {
    setPayError(null);
    setGstFieldErrors({});
    if (!customerName.trim()) {
      setPayError('Please enter your name or company contact name.');
      return;
    }
    if (!acceptLegal) {
      setPayError('Please confirm the declaration below to continue to payment.');
      return;
    }

    const gstinNorm = normalizeGstInput(gstinInput);
    const legalTrim = legalNameInput.trim();
    const wantsGstRecord = gstinNorm.length > 0 || legalTrim.length > 0;
    let gstNotes: Record<string, string> = {};
    if (wantsGstRecord) {
      const gstParsed = addGstSchema.safeParse({
        gstNumber: gstinInput,
        businessName: legalNameInput,
      });
      if (!gstParsed.success) {
        const flat = gstParsed.error.flatten().fieldErrors;
        setGstFieldErrors({
          gstin: flat.gstNumber?.[0],
          legalName: flat.businessName?.[0],
        });
        return;
      }
      gstNotes = {
        gstin_for_invoice: gstParsed.data.gstNumber,
        legal_name: gstParsed.data.businessName,
      };
    }

    const phone = getStoredPhone();
    const digits = phone.replace(/\D/g, '').slice(-10);

    const linesNote = quote.lines
      .map((l) => `${l.vehicle}:${l.trips}trips@${l.distanceKm}km`)
      .join(';')
      .slice(0, 500);

    setPayBusy(true);
    openPayment({
      amountInr: grandTotalInclGst,
      receipt: `custom_plan_${Date.now()}`,
      description: `Custom plan · ${quote.totalTrips} trips/mo · subtotal excl. GST + 18%`,
      notes: {
        product: 'custom_plan',
        customer_name: customerName.trim().slice(0, 120),
        customer_email: customerEmail.trim().slice(0, 120),
        total_trips: String(quote.totalTrips),
        plan_subtotal_excl_gst_inr: String(packSubtotalExclGst),
        gst_18pct_inr: String(gstOnPack),
        total_payable_incl_gst_inr: String(grandTotalInclGst),
        line_summary: linesNote,
        gst_details_provided: wantsGstRecord ? 'yes' : 'no',
        ...buildPrepayLegalRazorpayNotes(LEGAL_VERSION),
        ...gstNotes,
      },
      prefill: {
        name: customerName.trim(),
        email: customerEmail.trim() || undefined,
        contact: digits.length === 10 ? digits : undefined,
      },
      onSuccess: ({ paymentId }) => {
        setPayBusy(false);
        trackBookingCompleted({ flow: 'custom_plan', trips: quote.totalTrips });
        clearCustomPlanSession();
        const detailLines = quote.lines.map(
          (l) =>
            `${VEHICLE_LABEL[l.vehicle]} · ${l.trips} trips × ~${l.distanceKm} km · line ₹${l.linePayTotal.toLocaleString('en-IN')} (calculator, excl. GST)`,
        );
        router.replace(
          paymentResultSuccessHref({
            flow: 'custom',
            paymentId,
            amountInr: grandTotalInclGst,
            title: 'Custom multi-vehicle plan',
            subtitle: `${quote.totalTrips} trips/month · ${customerName.trim()}`,
            lines: [
              `Plan subtotal (excl. GST): ₹${packSubtotalExclGst.toLocaleString('en-IN')}`,
              `GST 18%: ₹${gstOnPack.toLocaleString('en-IN')}`,
              ...detailLines.slice(0, 4),
            ],
            retryPath: ROUTES.PLANS_CUSTOM,
          }),
        );
      },
      onError: (err) => {
        setPayBusy(false);
        if (err === 'Payment cancelled') {
          setPayError(null);
          return;
        }
        router.push(
          paymentResultFailureHref({
            flow: 'custom',
            title: 'Custom plan payment',
            message: err,
            amountInr: grandTotalInclGst,
            retryPath: ROUTES.PLANS_CUSTOM_CHECKOUT,
          }),
        );
      },
    });
  };

  return (
    <PlansSubPageShell
      title="Confirm custom plan"
      subtitle="Your calculator mix is locked for this payment. Add billing contact details, then pay subtotal + 18% GST."
      badge="Checkout"
      contentClassName="-mt-6"
    >
      <Link
        href={ROUTES.PLANS_CUSTOM}
        className="mb-4 inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-primary)] underline-offset-2 hover:underline md:text-sm"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden />
        Back to calculator
      </Link>

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="border-b border-gray-100 pb-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Plan mix</p>
          <p className="mt-1 text-lg font-bold text-gray-900">Monthly estimate (calculator)</p>
          <p className="mt-0.5 text-sm text-gray-600">
            {configs.length} vehicle line{configs.length === 1 ? '' : 's'} · {quote.totalTrips} total trips
          </p>
        </div>

        <ul className="mt-4 space-y-2">
          {quote.lines.map((l, i) => (
            <li key={`${l.vehicle}-${i}`} className="flex gap-2 text-xs leading-snug text-gray-700 sm:text-sm">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" strokeWidth={2.25} aria-hidden />
              <span>
                <strong className="font-semibold text-gray-900">{VEHICLE_LABEL[l.vehicle]}</strong> — {l.trips} trips × ~{l.distanceKm} km · ₹{l.perTripDisplay}/trip · line ₹{l.linePayTotal.toLocaleString('en-IN')}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-5 space-y-1.5 rounded-xl border border-slate-200 bg-slate-50/80 p-3 text-sm sm:p-4">
          <div className="flex justify-between gap-4 text-slate-600">
            <span>Plan subtotal (excl. GST)</span>
            <span className="tabular-nums text-slate-900">₹{packSubtotalExclGst.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between gap-4 text-slate-600">
            <span>GST 18%</span>
            <span className="tabular-nums text-slate-900">₹{gstOnPack.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between gap-4 border-t border-slate-200 pt-2 font-semibold text-slate-900">
            <span>Total payable (incl. GST)</span>
            <span className="tabular-nums text-[var(--color-primary)]">₹{grandTotalInclGst.toLocaleString('en-IN')}</span>
          </div>
          <p className="text-[11px] leading-snug text-slate-600 sm:text-xs">
            Calculator totals are treated as <strong className="font-medium text-slate-800">exclusive of GST</strong> for this
            checkout; your invoice will show taxes as applicable. {TOLL_CHARGES_SEPARATE_NOTE}
          </p>
        </div>

        <div className="mt-5 rounded-xl border border-slate-200 bg-white p-3 sm:p-4">
          <h3 className="text-sm font-semibold text-slate-900">Billing contact</h3>
          <p className="mt-1 text-[11px] text-slate-600 sm:text-xs">Used for Razorpay prefill and follow-up on this custom plan.</p>
          <div className="mt-4 space-y-3">
            <div>
              <label htmlFor="custom-checkout-name" className="mb-1 block text-xs font-medium text-slate-700">
                Full name <span className="text-red-500">*</span>
              </label>
              <input
                id="custom-checkout-name"
                type="text"
                autoComplete="name"
                placeholder="Your name or main contact"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
              />
            </div>
            <div>
              <label htmlFor="custom-checkout-email" className="mb-1 block text-xs font-medium text-slate-700">
                Email <span className="font-normal text-slate-500">(optional)</span>
              </label>
              <input
                id="custom-checkout-email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
              />
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-slate-200 bg-white p-3 sm:p-4">
          <div className="flex items-start gap-2">
            <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-slate-600" aria-hidden />
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-slate-900">GST for invoice (optional)</h3>
              <p className="mt-1 text-[11px] leading-snug text-slate-600 sm:text-xs">
                Add both fields if you want a company invoice — same rules as subscription checkout.
              </p>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            <div>
              <label htmlFor="custom-checkout-gstin" className="mb-1 block text-xs font-medium text-slate-700">
                GSTIN <span className="font-normal text-slate-500">(optional)</span>
              </label>
              <input
                id="custom-checkout-gstin"
                type="text"
                autoComplete="off"
                placeholder="15-character GSTIN"
                value={gstinInput}
                onChange={(e) => {
                  setGstinInput(normalizeGstInput(e.target.value));
                  setGstFieldErrors((p) => ({ ...p, gstin: undefined }));
                }}
                className={`h-11 w-full rounded-lg border bg-white px-3 font-mono text-sm uppercase text-slate-900 outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 ${
                  gstFieldErrors.gstin ? 'border-red-400' : 'border-slate-300'
                }`}
                maxLength={15}
              />
              {gstFieldErrors.gstin ? (
                <p className="mt-1 text-[11px] text-red-600">{gstFieldErrors.gstin}</p>
              ) : null}
            </div>
            <div>
              <label htmlFor="custom-checkout-legal" className="mb-1 block text-xs font-medium text-slate-700">
                Legal / trade name <span className="font-normal text-slate-500">(optional)</span>
              </label>
              <input
                id="custom-checkout-legal"
                type="text"
                autoComplete="organization"
                placeholder="As on GST certificate"
                value={legalNameInput}
                onChange={(e) => {
                  setLegalNameInput(e.target.value);
                  setGstFieldErrors((p) => ({ ...p, legalName: undefined }));
                }}
                className={`h-11 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 ${
                  gstFieldErrors.legalName ? 'border-red-400' : 'border-slate-300'
                }`}
              />
              {gstFieldErrors.legalName ? (
                <p className="mt-1 text-[11px] text-red-600">{gstFieldErrors.legalName}</p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-amber-100 bg-amber-50/90 px-3 py-2.5 text-[11px] leading-relaxed text-amber-950 sm:text-xs">
          <p className="font-semibold text-amber-900">Before you pay</p>
          <p className="mt-1 text-amber-950/90">{INDICATIVE_PRICING_FOOTNOTE}</p>
        </div>

        <PrepayLegalDeclaration
          className="mt-5"
          checked={acceptLegal}
          onCheckedChange={setAcceptLegal}
          productSummary={
            <>
              I confirm this payment is for my <strong className="font-semibold">custom multi-vehicle monthly mix</strong> from the
              calculator — total trips <strong className="font-semibold">{quote.totalTrips}</strong>, plan subtotal{' '}
              <strong className="font-semibold">₹{packSubtotalExclGst.toLocaleString('en-IN')} excl. GST</strong> plus{' '}
              <strong className="font-semibold">18% GST (₹{gstOnPack.toLocaleString('en-IN')})</strong>, total{' '}
              <strong className="font-semibold">₹{grandTotalInclGst.toLocaleString('en-IN')} incl. GST</strong>. Billing contact:{' '}
              <strong className="font-semibold">{customerName.trim() || '—'}</strong>. Inclusions and SLA follow written
              confirmation and Terms. {TOLL_CHARGES_SEPARATE_NOTE} {INDICATIVE_PRICING_FOOTNOTE}{' '}
            </>
          }
        />

        {payError ? (
          <p className="mt-4 text-sm text-red-600" role="alert">
            {payError}
          </p>
        ) : null}

        <ConsultantTrustCta layout="card" analyticsSource="custom_plan_checkout" className="mt-5" />

        <button
          type="button"
          disabled={payBusy || !acceptLegal || !customerName.trim()}
          onClick={handlePay}
          className="mt-2 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-55"
        >
          {payBusy ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
              Opening Razorpay…
            </>
          ) : (
            <>
              <CreditCard className="h-5 w-5 shrink-0" aria-hidden />
              Pay ₹{grandTotalInclGst.toLocaleString('en-IN')} with Razorpay
            </>
          )}
        </button>

        <p className="mt-3 text-center text-[10px] text-gray-500 sm:text-xs">
          Payment opens in Razorpay&apos;s secure window. On success you&apos;ll see a receipt and a shortcut to your dashboard.
        </p>
      </div>
    </PlansSubPageShell>
  );
}
