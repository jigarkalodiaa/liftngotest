'use client';

import { useMemo, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import { useRazorpay } from '@/lib/razorpay';
import { subscriptionPackByName, subscriptionPackCheckoutHref, subscriptionPackLockHref } from '@/lib/pricing/subscriptionPacks';
import {
  INDICATIVE_PRICING_FOOTNOTE,
  PACK_VALIDITY_FULL,
  TOLL_CHARGES_SEPARATE_NOTE,
} from '@/lib/pricing/subscriptionDisclosures';
import PlansSubPageShell from '../../PlansSubPageShell';
import { PrepayLegalDeclaration, buildPrepayLegalRazorpayNotes } from '@/lib/legal/PrepayLegalDeclaration';
import { trackBookingCompleted, trackCheckoutStarted } from '@/lib/analytics';
import { trackEvent } from '@/lib/posthogAnalytics';
import { getBookingUserType } from '@/lib/posthog/bookingUserType';
import { paymentResultFailureHref, paymentResultSuccessHref } from '@/lib/paymentResultUrl';
import { Check, ChevronLeft, CreditCard, Loader2, Building2 } from 'lucide-react';
import { getSenderDetails, getStoredPhone } from '@/lib/storage';
import { addGstSchema, normalizeGstInput } from '@/lib/validations';

/** GST rate applied on checkout; pack.total and per-trip figures are excl. GST. */
const GST_RATE = 0.18;

const LEGAL_CONSENTS_VERSION = 'subscription_checkout_v2_single_checkbox';

export default function SubscriptionCheckoutClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tierParam = searchParams.get('tier');
  const pack = useMemo(() => (tierParam ? subscriptionPackByName(tierParam) : undefined), [tierParam]);

  const [payError, setPayError] = useState<string | null>(null);
  const [payBusy, setPayBusy] = useState(false);
  const [gstinInput, setGstinInput] = useState('');
  const [legalNameInput, setLegalNameInput] = useState('');
  const [gstFieldErrors, setGstFieldErrors] = useState<{ gstin?: string; legalName?: string }>({});
  const [acceptLegalDeclarations, setAcceptLegalDeclarations] = useState(false);
  const { openPayment } = useRazorpay();

  const packSubtotalExclGst = pack?.total ?? 0;
  const gstOnPack = packSubtotalExclGst > 0 ? Math.round(packSubtotalExclGst * GST_RATE) : 0;
  const grandTotalInclGst = packSubtotalExclGst + gstOnPack;

  useEffect(() => {
    if (!pack) return;
    trackCheckoutStarted('subscription_razorpay', grandTotalInclGst);
  }, [pack, grandTotalInclGst]);

  if (!tierParam || !pack) {
    return (
      <PlansSubPageShell
        title="Checkout"
        subtitle="Pick a plan from the subscription page to continue."
        badge="Subscription"
        contentClassName="-mt-6"
      >
        <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
          <p className="text-sm text-gray-600">That plan link is invalid or expired.</p>
          <Link
            href={ROUTES.PLANS_SUBSCRIPTION}
            className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-primary)] underline-offset-2 hover:underline"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
            Back to subscription plans
          </Link>
        </div>
      </PlansSubPageShell>
    );
  }

  const backHref = subscriptionPackLockHref(pack);

  const handlePay = () => {
    setPayError(null);
    setGstFieldErrors({});

    if (!acceptLegalDeclarations) {
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

    setPayBusy(true);
    const sender = getSenderDetails();
    const phone = getStoredPhone();
    const digits = phone.replace(/\D/g, '').slice(-10);

    openPayment({
      amountInr: grandTotalInclGst,
      receipt: `sub_${pack.id}_${Date.now()}`,
      description: `${pack.name} pack · ${pack.trips} trips · pack excl. GST + 18%`,
      notes: {
        product: 'subscription_pack',
        packId: pack.id,
        packName: pack.name,
        pricing_model: 'pack_excl_gst_plus_18',
        pack_subtotal_excl_gst_inr: String(packSubtotalExclGst),
        gst_18pct_inr: String(gstOnPack),
        total_payable_incl_gst_inr: String(grandTotalInclGst),
        gst_details_provided: wantsGstRecord ? 'yes' : 'no',
        ...buildPrepayLegalRazorpayNotes(LEGAL_CONSENTS_VERSION),
        ...gstNotes,
      },
      prefill: {
        name: sender?.name,
        contact: digits.length === 10 ? digits : undefined,
      },
      onSuccess: ({ paymentId }) => {
        setPayBusy(false);
        trackEvent('ride_booked', {
          amount: grandTotalInclGst,
          vehicle_type: 'subscription_pack',
          distance_km: null,
          user_type: getBookingUserType(),
          flow: 'subscription_pack',
          pack: pack.name,
        });
        trackBookingCompleted({
          flow: 'subscription_pack',
          pack: pack.name,
        });
        const retryPath = subscriptionPackCheckoutHref(pack.name);
        router.replace(
          paymentResultSuccessHref({
            flow: 'subscription',
            paymentId,
            amountInr: grandTotalInclGst,
            title: `${pack.name} subscription pack`,
            subtitle: `${pack.trips} trips · ${pack.group === '4w' ? '4W' : '3W'} with driver`,
            lines: [
              `Total incl. GST: ₹${grandTotalInclGst.toLocaleString('en-IN')}`,
              `Pack subtotal (excl. GST): ₹${packSubtotalExclGst.toLocaleString('en-IN')} · GST 18%: ₹${gstOnPack.toLocaleString('en-IN')}`,
              `Per trip (excl. GST): ₹${pack.perTrip}`,
            ],
            retryPath,
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
            flow: 'subscription',
            title: `${pack.name} pack`,
            message: err,
            amountInr: grandTotalInclGst,
            retryPath: subscriptionPackCheckoutHref(pack.name),
          }),
        );
      },
    });
  };

  return (
    <PlansSubPageShell
      title={`Confirm ${pack.name}`}
      subtitle="Per-trip and pack subtotal are excl. GST. You pay pack subtotal + 18% GST. Add GSTIN if you need an invoice for ITC."
      badge="Checkout"
      contentClassName="-mt-6"
    >
      <Link
        href={backHref}
        className="mb-4 inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-primary)] underline-offset-2 hover:underline md:text-sm"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden />
        Change pack
      </Link>

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-1 border-b border-gray-100 pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Trip pack</p>
            <p className="text-lg font-bold text-gray-900">{pack.name}</p>
            <p className="mt-0.5 text-sm text-gray-600">{pack.tagline}</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-2xl font-extrabold tabular-nums text-[var(--color-primary)] sm:text-3xl">
              ₹{grandTotalInclGst.toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-gray-500">
              Incl. 18% GST · ₹{pack.perTrip}/trip excl. GST · {pack.trips} trips ·{' '}
              {pack.group === '4w' ? '4W' : '3W'} with driver
            </p>
          </div>
        </div>

        <ul className="mt-4 space-y-2">
          {pack.features.map((f) => (
            <li key={f} className="flex gap-2 text-xs leading-snug text-gray-700 sm:text-sm">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" strokeWidth={2.25} aria-hidden />
              {f}
            </li>
          ))}
        </ul>

        <div className="mt-5 space-y-1.5 rounded-xl border border-slate-200 bg-slate-50/80 p-3 text-sm sm:p-4">
          <div className="flex justify-between gap-4 text-slate-600">
            <span>Pack subtotal (excl. GST)</span>
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
            ₹{pack.perTrip}/trip and the pack line above are <strong className="font-medium text-slate-800">exclusive of GST</strong>.
            Your issued invoice will show CGST/SGST or IGST as applicable.
          </p>
        </div>

        <div className="mt-5 rounded-xl border border-slate-200 bg-white p-3 sm:p-4">
          <div className="flex items-start gap-2">
            <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-slate-600" aria-hidden />
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-slate-900">GST details for invoice &amp; ITC (optional)</h3>
              <p className="mt-1 text-[11px] leading-snug text-slate-600 sm:text-xs">
                Payment is always the total payable (incl. GST) below. Add these only if you want the invoice in your
                company name for ITC — both fields are required if you start filling either one.
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <label htmlFor="sub-checkout-gstin" className="mb-1 block text-xs font-medium text-slate-700">
                GSTIN <span className="font-normal text-slate-500">(optional)</span>
              </label>
              <input
                id="sub-checkout-gstin"
                type="text"
                autoComplete="off"
                placeholder="15-character GSTIN if you need a tax invoice"
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
              <label htmlFor="sub-checkout-legal" className="mb-1 block text-xs font-medium text-slate-700">
                Legal / trade name <span className="font-normal text-slate-500">(optional)</span>
              </label>
              <input
                id="sub-checkout-legal"
                type="text"
                autoComplete="organization"
                placeholder="As on GST certificate — same as GSTIN above"
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
          <p className="mt-2 text-amber-950/85">{TOLL_CHARGES_SEPARATE_NOTE}</p>
        </div>

        <PrepayLegalDeclaration
          className="mt-5"
          checked={acceptLegalDeclarations}
          onCheckedChange={setAcceptLegalDeclarations}
          productSummary={
            <>
              I confirm I am purchasing the <strong className="font-semibold">{pack.name}</strong> pack (
              <strong className="font-semibold">{pack.trips} trips</strong>) for pack subtotal{' '}
              <strong className="font-semibold">₹{packSubtotalExclGst.toLocaleString('en-IN')} excl. GST</strong> plus{' '}
              <strong className="font-semibold">18% GST (₹{gstOnPack.toLocaleString('en-IN')})</strong>, total{' '}
              <strong className="font-semibold">₹{grandTotalInclGst.toLocaleString('en-IN')} incl. GST</strong>. I understand{' '}
              {PACK_VALIDITY_FULL} In-pack limits and exclusions follow the Terms. {TOLL_CHARGES_SEPARATE_NOTE}{' '}
              {INDICATIVE_PRICING_FOOTNOTE}{' '}
            </>
          }
        />

        {payError ? (
          <p className="mt-4 text-sm text-red-600" role="alert">
            {payError}
          </p>
        ) : null}

        <button
          type="button"
          disabled={payBusy || !acceptLegalDeclarations}
          onClick={handlePay}
          className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-55"
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

        {!acceptLegalDeclarations ? (
          <p className="mt-2 text-center text-[11px] text-amber-800 sm:text-xs">
            Tick the declaration above to unlock payment.
          </p>
        ) : null}
        <p className="mt-3 text-center text-[10px] text-gray-500 sm:text-xs">
          You will complete payment in Razorpay&apos;s secure window. After success you&apos;ll see a confirmation with
          plan details and a shortcut to your dashboard.
        </p>
      </div>
    </PlansSubPageShell>
  );
}
