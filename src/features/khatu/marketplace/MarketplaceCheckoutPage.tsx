'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useKhatuOrderMutation } from '@/hooks/useKhatuData';
import { ROUTES } from '@/lib/constants';
import { Card, PageHeader } from '@/components/ui';
import {
  MARKETPLACE_DELIVERY_FLAT_INR,
  marketplaceCartSubtotal,
  useMarketplaceCartStore,
} from '@/features/khatu/marketplace/cartStore';

export default function MarketplaceCheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const shopId = useMarketplaceCartStore((s) => s.shopId);
  const shopName = useMarketplaceCartStore((s) => s.shopName);
  const items = useMarketplaceCartStore((s) => s.items);
  const clear = useMarketplaceCartStore((s) => s.clear);
  const mutation = useKhatuOrderMutation();

  const [address, setAddress] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [placed, setPlaced] = useState<{ orderId: string } | null>(null);

  useEffect(() => {
    if (!mounted) return;
    if (placed) return;
    if (!shopId || items.length === 0) {
      router.replace(ROUTES.KHATU_MARKETPLACE);
    }
  }, [mounted, placed, shopId, items.length, router]);

  useEffect(() => {
    if (placed) clear();
  }, [placed, clear]);

  const subtotal = marketplaceCartSubtotal(items);
  const grand = subtotal + MARKETPLACE_DELIVERY_FLAT_INR;

  const placeOrder = async () => {
    if (!shopId || items.length === 0) return;
    try {
      const res = await mutation.mutateAsync({
        shopId,
        items: items.map((i) => ({ id: i.productId, quantity: i.quantity })),
        totalAmount: grand,
        address: address.trim(),
        contactPhone: contactPhone.trim(),
      });
      setPlaced({ orderId: res.orderId });
    } catch {
      /* error below */
    }
  };

  if (!mounted) {
    return <div className="min-h-screen bg-[var(--khatu-cream)]" aria-busy="true" />;
  }

  if (placed) {
    return (
      <div className="min-h-screen bg-[var(--khatu-cream)] px-4 pb-10 pt-4">
        <div className="mx-auto max-w-xl sm:max-w-2xl">
          <Card className="p-6 text-center">
            <h1 className="text-lg font-semibold text-[var(--khatu-stone)]">Order placed</h1>
            <p className="mt-2 font-mono text-sm text-[var(--khatu-saffron)]">{placed.orderId}</p>
            <p className="mt-4 text-sm leading-relaxed text-[var(--khatu-stone-muted)]">
              Your order is logged for Liftngo delivery. A rider will be assigned from the nearest pool — keep your phone handy
              for handoff.
            </p>
            <Link
              href={ROUTES.KHATU_MARKETPLACE}
              className="mt-6 inline-flex min-h-[48px] items-center justify-center rounded-xl bg-[var(--color-primary)] px-6 text-sm font-semibold text-white"
            >
              Back to marketplace
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  if (!shopId || items.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--khatu-cream)] text-sm text-[var(--khatu-stone-muted)]">
        Redirecting…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--khatu-cream)] px-4 pb-12 pt-4">
      <div className="mx-auto max-w-xl sm:max-w-2xl">
        <PageHeader title="Checkout" onBack={() => router.push(ROUTES.KHATU_MARKETPLACE)} />

        <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-[var(--khatu-stone-muted)]">{shopName}</p>

        <Card className="mt-5 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--khatu-stone-muted)]">Order summary</p>
          <ul className="mt-3 space-y-2 text-sm">
            {items.map((i) => (
              <li key={i.productId} className="flex justify-between gap-2 text-[var(--khatu-stone)]">
                <span className="min-w-0 truncate">
                  {i.name} × {i.quantity}
                </span>
                <span className="shrink-0 tabular-nums">₹{i.price * i.quantity}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex justify-between border-t border-stone-200 pt-3 text-sm text-[var(--khatu-stone-muted)]">
            <span>Subtotal</span>
            <span className="tabular-nums text-[var(--khatu-stone)]">₹{subtotal}</span>
          </div>
          <div className="mt-1 flex justify-between text-sm text-[var(--khatu-stone-muted)]">
            <span>Delivery</span>
            <span className="tabular-nums text-[var(--khatu-stone)]">₹{MARKETPLACE_DELIVERY_FLAT_INR}</span>
          </div>
          <div className="mt-2 flex justify-between text-base font-semibold text-[var(--khatu-stone)]">
            <span>Total</span>
            <span className="tabular-nums">₹{grand}</span>
          </div>
        </Card>

        <div className="mt-5 space-y-4">
          <label className="block text-sm font-medium text-[var(--khatu-stone)]" htmlFor="khatu-co-addr">
            Delivery address
            <textarea
              id="khatu-co-addr"
              rows={4}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Hotel / landmark / full address in Khatu corridor"
              className="mt-1.5 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-[var(--khatu-stone)] placeholder:text-stone-400 focus:border-[var(--khatu-saffron)] focus:outline-none focus:ring-2 focus:ring-[var(--khatu-saffron)]/20"
            />
          </label>
          <label className="block text-sm font-medium text-[var(--khatu-stone)]" htmlFor="khatu-co-phone">
            Contact number
            <input
              id="khatu-co-phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="10-digit mobile"
              className="mt-1.5 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-[var(--khatu-stone)] placeholder:text-stone-400 focus:border-[var(--khatu-saffron)] focus:outline-none focus:ring-2 focus:ring-[var(--khatu-saffron)]/20"
            />
          </label>
        </div>

        {mutation.isError ? (
          <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-900 ring-1 ring-rose-200">
            {mutation.error instanceof Error ? mutation.error.message : 'Could not place order.'}
          </p>
        ) : null}

        <button
          type="button"
          disabled={mutation.isPending || address.trim().length < 8 || contactPhone.replace(/\D/g, '').length < 10}
          onClick={() => void placeOrder()}
          className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-[var(--color-primary)] text-sm font-semibold text-white disabled:opacity-50"
        >
          {mutation.isPending ? 'Placing…' : 'Place order'}
        </button>

        <p className="mt-4 text-center text-xs text-[var(--khatu-stone-muted)]">
          By placing this order you agree to handoff via Liftngo riders — same network as your delivery bookings.
        </p>
      </div>
    </div>
  );
}
