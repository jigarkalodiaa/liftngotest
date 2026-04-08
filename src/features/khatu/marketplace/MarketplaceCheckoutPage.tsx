'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useKhatuOrderMutation } from '@/hooks/useKhatuData';
import { useGeolocation } from '@/hooks/location/useGeolocation';
import { normalizeLeadPhoneInput } from '@/lib/validations';
import { ROUTES, STORAGE_KEYS } from '@/lib/constants';
import { appendMarketplaceHistoryFromCheckout, getDropLocation, getStoredPhone, getUserProfile, savedLocationHasAddress } from '@/lib/storage';
import { Card, PageHeader } from '@/components/ui';
import {
  MARKETPLACE_DELIVERY_FLAT_INR,
  marketplaceCartSubtotal,
  useMarketplaceCartStore,
} from '@/features/khatu/marketplace/cartStore';

const CHECKOUT_RECENT_ADDRESSES_KEY = 'liftngo_marketplace_checkout_recent_addresses_v1';
const MAX_RECENT_ADDRESSES = 5;

type RecentAddress = { line1: string; line2: string };

function normalizeRecentAddress(v: unknown): RecentAddress | null {
  if (typeof v !== 'object' || v === null) return null;
  const o = v as Partial<RecentAddress>;
  const line1 = typeof o.line1 === 'string' ? o.line1.trim() : '';
  const line2 = typeof o.line2 === 'string' ? o.line2.trim() : '';
  if (!line1 || !line2) return null;
  return { line1, line2 };
}

function getRecentAddresses(): RecentAddress[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = JSON.parse(sessionStorage.getItem(CHECKOUT_RECENT_ADDRESSES_KEY) || 'null') as unknown;
    if (!Array.isArray(raw)) return [];
    return raw.map(normalizeRecentAddress).filter((x): x is RecentAddress => Boolean(x));
  } catch {
    return [];
  }
}

function saveRecentAddress(next: RecentAddress): void {
  if (typeof window === 'undefined') return;
  const n: RecentAddress = { line1: next.line1.trim(), line2: next.line2.trim() };
  if (!n.line1 || !n.line2) return;
  try {
    const prev = getRecentAddresses();
    const deduped = prev.filter(
      (item) =>
        item.line1.toLowerCase() !== n.line1.toLowerCase() ||
        item.line2.toLowerCase() !== n.line2.toLowerCase(),
    );
    sessionStorage.setItem(
      CHECKOUT_RECENT_ADDRESSES_KEY,
      JSON.stringify([n, ...deduped].slice(0, MAX_RECENT_ADDRESSES)),
    );
  } catch {
    // ignore
  }
}

function splitAddressToTwoLines(raw: string): RecentAddress {
  const parts = raw
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length === 0) return { line1: '', line2: '' };
  if (parts.length === 1) return { line1: parts[0], line2: parts[0] };
  return {
    line1: parts.slice(0, 3).join(', '),
    line2: parts.slice(3).join(', ') || parts.slice(1).join(', '),
  };
}

function dedupeRecentAddresses(list: RecentAddress[]): RecentAddress[] {
  const seen = new Set<string>();
  const out: RecentAddress[] = [];
  for (const item of list) {
    const line1 = item.line1.trim();
    const line2 = item.line2.trim();
    if (line1.length < 2 || line2.length < 2) continue;
    const key = `${line1.toLowerCase()}|${line2.toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ line1, line2 });
    if (out.length >= MAX_RECENT_ADDRESSES) break;
  }
  return out;
}

function collectRecentAddressOptions(): RecentAddress[] {
  if (typeof window === 'undefined') return [];
  const candidates: RecentAddress[] = [...getRecentAddresses()];
  const drop = getDropLocation();
  if (savedLocationHasAddress(drop)) {
    const n = drop.name?.trim() ?? '';
    const a = drop.address.trim();
    if (n && a) candidates.push({ line1: n, line2: a });
    else if (a) candidates.push(splitAddressToTwoLines(a));
  }
  const profile = getUserProfile();
  const profileAddr = profile?.address?.trim();
  if (profileAddr) candidates.push(splitAddressToTwoLines(profileAddr));
  return dedupeRecentAddresses(candidates);
}

function formatStructuredDropAddress(parts: { line1: string; line2: string }): string {
  const line1 = parts.line1.trim();
  const line2 = parts.line2.trim();
  const lines: string[] = [];
  if (line1) lines.push(`Address line 1: ${line1}`);
  if (line2) lines.push(`Address line 2: ${line2}`);
  return lines.join('\n');
}

export default function MarketplaceCheckoutPage() {
  const router = useRouter();
  const { getLocation, isLoading: locating, error: locateError } = useGeolocation();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const shopId = useMarketplaceCartStore((s) => s.shopId);
  const shopName = useMarketplaceCartStore((s) => s.shopName);
  const items = useMarketplaceCartStore((s) => s.items);
  const clear = useMarketplaceCartStore((s) => s.clear);
  const mutation = useKhatuOrderMutation();

  const [customerName, setCustomerName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [recentAddresses, setRecentAddresses] = useState<RecentAddress[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [placed, setPlaced] = useState<{ orderId: string } | null>(null);

  useEffect(() => {
    if (!mounted) return;
    setRecentAddresses(collectRecentAddressOptions());
  }, [mounted]);

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
  const composedDropAddress = useMemo(
    () => formatStructuredDropAddress({ line1: addressLine1, line2: addressLine2 }),
    [addressLine1, addressLine2],
  );
  const myPhone10 = useMemo(() => (mounted ? normalizeLeadPhoneInput(getStoredPhone()) : ''), [mounted]);
  const dropValid = useMemo(() => {
    const name = customerName.trim();
    const phoneDigits = contactPhone.replace(/\D/g, '');
    return name.length >= 2 && phoneDigits.length === 10 && addressLine1.trim().length >= 3 && addressLine2.trim().length >= 3;
  }, [customerName, contactPhone, addressLine1, addressLine2]);

  const applyRecentAddress = (index: number) => {
    const hit = recentAddresses[index];
    if (!hit) return;
    setAddressLine1(hit.line1);
    setAddressLine2(hit.line2);
  };

  const fillCurrentLocation = useCallback(async () => {
    const loc = await getLocation();
    if (!loc) return;
    const lines = splitAddressToTwoLines(loc.address || loc.shortAddress);
    setAddressLine1(lines.line1);
    setAddressLine2(lines.line2);
    saveRecentAddress(lines);
    setRecentAddresses(collectRecentAddressOptions());
  }, [getLocation]);

  const placeOrder = async () => {
    const sid = shopId;
    if (!sid || items.length === 0) return;
    setFormError(null);
    const name = customerName.trim();
    const phone = contactPhone.replace(/\D/g, '');
    if (name.length < 2) {
      setFormError('Please enter your full name.');
      return;
    }
    if (phone.length !== 10) {
      setFormError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (addressLine1.trim().length < 3 || addressLine2.trim().length < 3) {
      setFormError('Please complete both address lines.');
      return;
    }
    const displayShopName = shopName?.trim() ? shopName : 'Marketplace shop';
    try {
      const res = await mutation.mutateAsync({
        shopId: sid,
        items: items.map((i) => ({ id: i.productId, quantity: i.quantity })),
        totalAmount: grand,
        address: composedDropAddress,
        contactPhone: phone,
      });
      appendMarketplaceHistoryFromCheckout({
        orderRef: res.orderId,
        shopName: displayShopName,
        shopId: sid,
        summaryLines: items.map((i) => ({ name: i.name, quantity: i.quantity })),
        totalDisplay: `₹${grand.toLocaleString('en-IN')}`,
        deliveryAddress: composedDropAddress,
      });
      saveRecentAddress({ line1: addressLine1, line2: addressLine2 });
      setRecentAddresses(collectRecentAddressOptions());
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

        <div className="mt-5">
          <p className="text-xs font-semibold text-neutral-500">Delivery details</p>
          <div className="mt-2 space-y-4 rounded-xl border-2 border-neutral-200 bg-white p-4 shadow-sm sm:p-5">
            <label className="block">
              <span className="text-sm font-medium text-neutral-800">Full name</span>
              <input
                type="text"
                autoComplete="name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="As on phone / ID"
                className="mt-1.5 w-full rounded-lg border-2 border-neutral-300 bg-neutral-50 px-3 py-3 text-sm text-neutral-900 placeholder:text-neutral-500 shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:border-[#1A1D3A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A1D3A]/25"
              />
            </label>
            <label className="block">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <span className="text-sm font-medium text-neutral-800">Mobile number</span>
                {myPhone10.length === 10 ? (
                  <button
                    type="button"
                    onClick={() => setContactPhone(myPhone10)}
                    className="text-xs font-semibold underline decoration-[#1A1D3A]/40 underline-offset-2 text-[#1A1D3A]"
                  >
                    Use my number
                  </button>
                ) : null}
              </div>
              <input
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                maxLength={10}
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="10-digit mobile"
                className="mt-1.5 w-full rounded-lg border-2 border-neutral-300 bg-neutral-50 px-3 py-3 text-sm text-neutral-900 placeholder:text-neutral-500 shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:border-[#1A1D3A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A1D3A]/25"
              />
            </label>

            <div className="border-t border-neutral-200 pt-4">
              <p className="text-sm font-semibold text-neutral-900">Drop location</p>
              <p className="mt-0.5 text-[11px] text-neutral-500">Only 2 fields. Keep it short and clear for the driver.</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-stretch">
              <button
                type="button"
                onClick={() => void fillCurrentLocation()}
                disabled={locating}
                className="min-h-11 w-full rounded-lg border-2 border-neutral-300 bg-neutral-50 px-4 py-2.5 text-sm font-semibold text-neutral-900 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)] hover:bg-white disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-[10rem]"
              >
                {locating ? 'Fetching current location...' : 'Use current location'}
              </button>
              <div className="flex w-full min-w-0 flex-1 flex-col gap-1 sm:max-w-md">
                <select
                  aria-label="Select from recent drop locations"
                  disabled={recentAddresses.length === 0}
                  className="min-h-11 w-full cursor-pointer rounded-lg border-2 border-neutral-300 bg-neutral-50 px-3 py-2.5 text-sm font-medium text-neutral-900 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)] disabled:cursor-not-allowed disabled:text-neutral-400 focus:border-[#1A1D3A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A1D3A]/25"
                  defaultValue=""
                  onChange={(e) => {
                    const raw = e.target.value;
                    if (raw === '') return;
                    const idx = Number(raw);
                    if (!Number.isInteger(idx) || idx < 0 || idx >= recentAddresses.length) return;
                    applyRecentAddress(idx);
                    e.currentTarget.value = '';
                  }}
                >
                  <option value="" disabled>
                    {recentAddresses.length === 0 ? 'No saved addresses yet' : 'Recent drop locations'}
                  </option>
                  {recentAddresses.map((item, idx) => (
                    <option key={`${item.line1}-${item.line2}-${idx}`} value={String(idx)}>
                      {item.line1.length > 40 ? `${item.line1.slice(0, 40)}...` : item.line1}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {locateError ? <p className="text-[11px] text-amber-700">{locateError}</p> : null}
            <label className="block">
              <span className="text-sm font-medium text-neutral-800">Address line 1</span>
              <input
                type="text"
                autoComplete="address-line1"
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                placeholder="Flat / house no, building / society"
                className="mt-1.5 w-full rounded-lg border-2 border-neutral-300 bg-neutral-50 px-3 py-3 text-sm text-neutral-900 placeholder:text-neutral-500 shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:border-[#1A1D3A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A1D3A]/25"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-neutral-800">Address line 2</span>
              <input
                type="text"
                autoComplete="address-line2"
                value={addressLine2}
                onChange={(e) => setAddressLine2(e.target.value)}
                placeholder="Street, landmark, area, city, PIN"
                className="mt-1.5 w-full rounded-lg border-2 border-neutral-300 bg-neutral-50 px-3 py-3 text-sm text-neutral-900 placeholder:text-neutral-500 shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:border-[#1A1D3A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A1D3A]/25"
              />
            </label>

            {composedDropAddress.trim() ? (
              <div className="rounded-lg border border-dashed border-neutral-300 bg-neutral-50/80 px-3 py-2.5">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">Driver preview</p>
                <pre className="mt-1 whitespace-pre-wrap break-words text-xs leading-relaxed text-neutral-800">{composedDropAddress}</pre>
              </div>
            ) : null}
          </div>
        </div>

        {formError ? (
          <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-900 ring-1 ring-rose-200">{formError}</p>
        ) : null}
        {mutation.isError ? (
          <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-900 ring-1 ring-rose-200">
            {mutation.error instanceof Error ? mutation.error.message : 'Could not place order.'}
          </p>
        ) : null}

        <button
          type="button"
          disabled={mutation.isPending || !dropValid}
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
