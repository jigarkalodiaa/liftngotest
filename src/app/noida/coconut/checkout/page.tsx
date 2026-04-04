'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PageHeader, Card } from '@/components/ui';
import {
  useCoconutCartStore,
  coconutCartSubtotal,
} from '@/features/noida/coconut/coconutCartStore';
import { COCONUT_VENDOR } from '@/features/noida/coconut/products';
import { useRazorpay } from '@/lib/razorpay';

type OrderState =
  | { stage: 'checkout' }
  | { stage: 'placing' }
  | { stage: 'confirmed'; orderId: string; paymentId: string; eta: string; driverName: string; driverPhone: string };

export default function CoconutCheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const items = useCoconutCartStore((s) => s.items);
  const clear = useCoconutCartStore((s) => s.clear);
  const { openPayment } = useRazorpay();

  const [address, setAddress] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [order, setOrder] = useState<OrderState>({ stage: 'checkout' });
  const [payError, setPayError] = useState<string | null>(null);

  useEffect(() => {
    if (!mounted) return;
    if (order.stage !== 'checkout' && order.stage !== 'placing') return;
    if (items.length === 0) {
      router.replace('/noida/coconut');
    }
  }, [mounted, items.length, router, order.stage]);

  const subtotal = coconutCartSubtotal(items);
  const delivery = COCONUT_VENDOR.deliveryFlatInr;
  const grand = subtotal + delivery;

  const placeOrder = useCallback(async () => {
    setPayError(null);
    setOrder({ stage: 'placing' });

    openPayment({
      amountInr: grand,
      receipt: `coconut_${Date.now()}`,
      description: `Coconut order — ${items.length} item(s)`,
      notes: { flow: 'noida_coconut', address: address.slice(0, 250) },
      prefill: { contact: contactPhone ? `+91${contactPhone.replace(/\D/g, '')}` : undefined },
      onSuccess: ({ paymentId, orderId }) => {
        const localId = `NCO-${Date.now().toString(36).toUpperCase()}`;
        clear();
        setOrder({
          stage: 'confirmed',
          orderId: localId,
          paymentId,
          eta: COCONUT_VENDOR.estimatedMinutes,
          driverName: 'Ravi Kumar',
          driverPhone: '9876543210',
        });
      },
      onError: (err) => {
        setOrder({ stage: 'checkout' });
        if (err !== 'Payment cancelled') {
          setPayError(err);
        }
      },
    });
  }, [grand, items.length, address, contactPhone, clear, openPayment]);

  if (!mounted) {
    return <div className="min-h-screen bg-gray-50" aria-busy="true" />;
  }

  /* ── Order confirmed ───────────────────────────────────── */
  if (order.stage === 'confirmed') {
    return (
      <div className="min-h-screen bg-gray-50 px-4 pb-10 pt-4">
        <div className="mx-auto max-w-xl sm:max-w-2xl">
          <Card className="p-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">✅</div>
            <h1 className="mt-4 text-xl font-bold text-gray-900">Order Placed!</h1>
            <p className="mt-1 font-mono text-sm text-[var(--color-primary)]">{order.orderId}</p>
            <p className="mt-0.5 text-xs text-gray-500">Payment ID: {order.paymentId}</p>

            <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-4 text-left">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Delivery ETA</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{order.eta} min</p>
              <p className="mt-0.5 text-xs text-gray-500">A Liftngo rider has been assigned</p>
            </div>

            <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-4 text-left">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Driver Details</p>
              <div className="mt-2 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-[var(--color-primary)]">
                  {order.driverName.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{order.driverName}</p>
                  <a href={`tel:+91${order.driverPhone}`} className="text-xs text-[var(--color-primary)] underline">
                    +91 {order.driverPhone}
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-green-200 bg-green-50 p-4 text-left">
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500" />
                </span>
                <p className="text-sm font-semibold text-green-800">Captain is on the way</p>
              </div>
              <p className="mt-1 text-xs text-green-700">
                Your order will be picked up from {COCONUT_VENDOR.area} and delivered to your address.
              </p>
            </div>

            <Link
              href="/dashboard"
              className="mt-6 inline-flex min-h-[48px] items-center justify-center rounded-xl bg-[var(--color-primary)] px-6 text-sm font-semibold text-white"
            >
              Back to Dashboard
            </Link>
          </Card>
        </div>
      </div>
    );
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

        {payError && (
          <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-800">
            {payError}
          </div>
        )}

        <button
          type="button"
          disabled={order.stage === 'placing' || address.trim().length < 8 || contactPhone.replace(/\D/g, '').length < 10}
          onClick={() => void placeOrder()}
          className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-[var(--color-primary)] text-sm font-semibold text-white disabled:opacity-50"
        >
          {order.stage === 'placing' ? 'Opening payment…' : `Pay ₹${grand}`}
        </button>

        <p className="mt-4 text-center text-xs text-gray-500">
          By placing this order you agree to delivery via Liftngo riders.
        </p>
      </div>
    </div>
  );
}
