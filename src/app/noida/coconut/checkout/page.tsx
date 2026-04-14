'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader, Card } from '@/components/ui';
import {
  useCoconutCartStore,
  coconutCartSubtotal,
} from '@/features/noida/coconut/coconutCartStore';
import { COCONUT_VENDOR } from '@/features/noida/coconut/products';
import { useRazorpay } from '@/lib/razorpay';
import { PrepayLegalDeclaration, buildPrepayLegalRazorpayNotes } from '@/lib/legal/PrepayLegalDeclaration';
import { INDICATIVE_PRICING_FOOTNOTE } from '@/lib/pricing/subscriptionDisclosures';
import { paymentResultFailureHref, paymentResultSuccessHref } from '@/lib/paymentResultUrl';
import { trackBookingCompleted, trackCheckoutStarted, trackFunnelStep } from '@/lib/analytics';
import { trackEvent } from '@/lib/posthogAnalytics';
import { getBookingUserType } from '@/lib/posthog/bookingUserType';

const COCONUT_CHECKOUT_CONSENT_VERSION = 'noida_coconut_checkout_v1';

type OrderState = { stage: 'checkout' } | { stage: 'placing' };

export default function CoconutCheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const items = useCoconutCartStore((s) => s.items);
  const clear = useCoconutCartStore((s) => s.clear);

  useEffect(() => {
    if (items.length > 0) {
      trackFunnelStep('noida_coconut', 'checkout_page_view');
    }
  }, [items.length]);
  const { openPayment } = useRazorpay();

  const [address, setAddress] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [order, setOrder] = useState<OrderState>({ stage: 'checkout' });
  const [payError, setPayError] = useState<string | null>(null);
  const [acceptLegal, setAcceptLegal] = useState(false);

  useEffect(() => {
    if (!mounted) return;
    if (order.stage !== 'checkout' && order.stage !== 'placing') return;
    if (items.length === 0) {
      router.replace('/noida/coconut');
    }
  }, [mounted, items.length, router, order.stage]);

  const subtotal = coconutCartSubtotal(items);
  const delivery = COCONUT_VENDOR.deliveryFlatInr;
  const handlingCharge = COCONUT_VENDOR.handlingChargeInr ?? 0;
  const platformFee = COCONUT_VENDOR.platformFeeInr ?? 0;
  const grand = subtotal + delivery + handlingCharge + platformFee;

  const placeOrder = useCallback(async () => {
    setPayError(null);
    if (!acceptLegal) {
      setPayError('Please confirm the declaration below to pay.');
      return;
    }
    setOrder({ stage: 'placing' });
    trackCheckoutStarted('noida_coconut_razorpay', grand);

    openPayment({
      amountInr: grand,
      receipt: `coconut_${Date.now()}`,
      description: `Coconut order — ${items.length} item(s)`,
      notes: {
        flow: 'noida_coconut',
        address: address.slice(0, 250),
        ...buildPrepayLegalRazorpayNotes(COCONUT_CHECKOUT_CONSENT_VERSION),
      },
      prefill: { contact: contactPhone ? `+91${contactPhone.replace(/\D/g, '')}` : undefined },
      onSuccess: ({ paymentId }) => {
        trackEvent('ride_booked', {
          amount: grand,
          vehicle_type: 'noida_coconut',
          distance_km: null,
          user_type: getBookingUserType(),
          flow: 'noida_coconut',
          item_count: items.length,
          payment_id: paymentId,
        });
        trackBookingCompleted({
          flow: 'noida_coconut',
          amount: grand,
          item_count: items.length,
          payment_id: paymentId,
        });
        const itemLines = items.map((i) => `${i.name} × ${i.quantity}`);
        const addrLine = address.trim() ? `Deliver to: ${address.trim().slice(0, 120)}` : '';
        clear();
        router.replace(
          paymentResultSuccessHref({
            flow: 'coconut',
            paymentId,
            amountInr: grand,
            title: `${COCONUT_VENDOR.name} · Coconut order`,
            subtitle: `${items.length} line item(s) · ~${COCONUT_VENDOR.estimatedMinutes} min delivery zone`,
            lines: [
              `Subtotal ₹${subtotal.toLocaleString('en-IN')} · Delivery ₹${delivery.toLocaleString('en-IN')}`,
              ...itemLines.slice(0, 6),
              itemLines.length > 6 ? `+${itemLines.length - 6} more` : '',
              addrLine,
            ].filter(Boolean),
            retryPath: '/noida/coconut/checkout',
          }),
        );
      },
      onError: (err) => {
        setOrder({ stage: 'checkout' });
        if (err === 'Payment cancelled') return;
        router.push(
          paymentResultFailureHref({
            flow: 'coconut',
            title: 'Coconut checkout',
            message: err,
            amountInr: grand,
            retryPath: '/noida/coconut/checkout',
          }),
        );
      },
    });
  }, [acceptLegal, address, clear, delivery, grand, items, openPayment, router, subtotal]);

  if (!mounted) {
    return <div className="min-h-screen bg-gray-50" aria-busy="true" />;
  }

  /* ── Redirect when cart is empty ───────────────────────── */
  if (items.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 text-sm text-gray-500">
        Redirecting…
      </div>
    );
  }

  /* ── Checkout form ─────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-gray-50 px-4 pb-12 pt-4">
      <div className="mx-auto max-w-xl sm:max-w-2xl">
        <PageHeader title="Checkout" onBack={() => router.push('/noida/coconut')} />

        <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-gray-500">{COCONUT_VENDOR.name} · {COCONUT_VENDOR.area}</p>

        <Card className="mt-5 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">Order Summary</p>
          <ul className="mt-3 space-y-2 text-sm">
            {items.map((i) => (
              <li key={i.productId} className="flex justify-between gap-2 text-gray-900">
                <span className="min-w-0 truncate">{i.name} × {i.quantity}</span>
                <span className="shrink-0 tabular-nums">₹{i.price * i.quantity}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex justify-between border-t border-gray-200 pt-3 text-sm text-gray-500">
            <span>Subtotal</span>
            <span className="tabular-nums text-gray-900">₹{subtotal}</span>
          </div>
          <div className="mt-1 flex justify-between text-sm text-gray-500">
            <span>Delivery (Liftngo)</span>
            <span className="tabular-nums text-gray-900">₹{delivery}</span>
          </div>
          <div className="mt-2 flex justify-between text-base font-semibold text-gray-900">
            <span>Total</span>
            <span className="tabular-nums">₹{grand}</span>
          </div>
        </Card>

        <div className="mt-5 space-y-4">
          <label className="block text-sm font-medium text-gray-900" htmlFor="co-addr">
            Delivery Address
            <textarea
              id="co-addr"
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Flat / office, building, sector, landmark"
              className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
            />
          </label>
          <label className="block text-sm font-medium text-gray-900" htmlFor="co-phone">
            Contact Number
            <input
              id="co-phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="10-digit mobile"
              className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
            />
          </label>
        </div>

        <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2.5 text-xs text-blue-900">
          <strong>Payment:</strong> Secure online payment via Razorpay. UPI, cards, wallets & netbanking accepted.
        </div>

        <PrepayLegalDeclaration
          className="mt-5"
          checked={acceptLegal}
          onCheckedChange={setAcceptLegal}
          productSummary={
            <>
              I confirm this payment is for the <strong className="font-semibold">coconut retail order</strong> on this page
              — <strong className="font-semibold">{items.length} item(s)</strong>, subtotal ₹{subtotal.toLocaleString('en-IN')}
              , delivery ₹{delivery.toLocaleString('en-IN')}, total{' '}
              <strong className="font-semibold">₹{grand.toLocaleString('en-IN')}</strong>. {INDICATIVE_PRICING_FOOTNOTE}{' '}
            </>
          }
        />

        {payError && (
          <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-800">
            {payError}
          </div>
        )}

        <button
          type="button"
          disabled={
            order.stage === 'placing' ||
            !acceptLegal ||
            address.trim().length < 8 ||
            contactPhone.replace(/\D/g, '').length < 10
          }
          onClick={() => void placeOrder()}
          className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-[var(--color-primary)] text-sm font-semibold text-white disabled:opacity-50"
        >
          {order.stage === 'placing' ? 'Opening payment…' : `Pay ₹${grand}`}
        </button>

        {!acceptLegal ? (
          <p className="mt-3 text-center text-xs text-amber-800">Confirm the declaration above to enable Pay.</p>
        ) : null}
      </div>
    </div>
  );
}
