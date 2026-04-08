'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  getRestaurantById,
  parsePrice,
} from '@/data/restaurantsKhatushyam';
import {
  getFoodOrderCartDraft,
  setFoodOrderCartDraft,
  clearFoodOrderCartDraft,
  getDropLocation,
  getStoredPhone,
  getUserProfile,
  setPickupLocation,
  setDeliveryGoodsDescription,
  isUserAuthenticated,
  setPostLoginRedirect,
  setLoginContinuationMessage,
  savedLocationHasAddress,
} from '@/lib/storage';
import { normalizeLeadPhoneInput } from '@/lib/validations';
import { ROUTES, STORAGE_KEYS } from '@/lib/constants';
import { FOOD_CART_UPDATED } from '@/lib/foodCartEvents';
import { useRazorpay } from '@/lib/razorpay';
import { PrepayLegalDeclaration, buildPrepayLegalRazorpayNotes } from '@/lib/legal/PrepayLegalDeclaration';
import { paymentResultFailureHref, paymentResultSuccessHref } from '@/lib/paymentResultUrl';
import { trackCheckoutStarted, trackBookingCompleted } from '@/lib/analytics';
import { trackEvent } from '@/lib/posthogAnalytics';
import { getBookingUserType } from '@/lib/posthog/bookingUserType';
import { useGeolocation } from '@/hooks/location/useGeolocation';

const FOOD_MENU_CHECKOUT_CONSENT_VERSION = 'food_menu_checkout_v1';
const FOOD_CHECKOUT_RECENT_ADDRESSES_KEY = 'liftngo_food_checkout_recent_addresses_v1';
const MAX_RECENT_ADDRESSES = 5;

type CartLine = { name: string; price: string; quantity: number };
type RecentAddress = { line1: string; line2: string };

function VegMark() {
  return (
    <span
      className="inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[3px] border border-emerald-600 bg-white"
      aria-label="Vegetarian"
    >
      <span className="h-2 w-2 rounded-full bg-emerald-600" />
    </span>
  );
}

function computeTotals(subtotal: number) {
  const platformFee = 5;
  const gst = Math.max(0, Math.round(subtotal * 0.114));
  const grand = subtotal + gst + platformFee;
  return { subtotal, gst, platformFee, grand };
}

/** Labels each line so drivers see a clear structure (saved to Razorpay + delivery draft). */
function formatStructuredDropAddress(parts: {
  line1: string;
  line2: string;
}): string {
  const line1 = parts.line1.trim();
  const line2 = parts.line2.trim();
  const lines: string[] = [];
  if (line1) lines.push(`Address line 1: ${line1}`);
  if (line2) lines.push(`Address line 2: ${line2}`);
  return lines.join('\n');
}

type DropFormPersist = {
  restaurantId: string;
  customerName: string;
  customerPhone: string;
  addressLine1?: string;
  addressLine2?: string;
  flatNo?: string;
  building?: string;
  street?: string;
  landmark?: string;
  area?: string;
  city?: string;
  pincode?: string;
  dropAddress?: string;
};

function loadSavedDrop(restaurantId: string): {
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
} {
  const empty = { name: '', phone: '', addressLine1: '', addressLine2: '' };
  if (typeof window === 'undefined') return empty;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEYS.FOOD_CHECKOUT_DROP);
    if (!raw) return empty;
    const p = JSON.parse(raw) as DropFormPersist;
    if (p.restaurantId !== restaurantId) return empty;
    const legacy = typeof p.dropAddress === 'string' ? p.dropAddress.trim() : '';
    const legacyLine1 = [p.flatNo, p.building].filter((v): v is string => typeof v === 'string' && v.trim().length > 0).join(', ');
    const legacyLine2 = [p.street, p.landmark, p.area, p.city, p.pincode]
      .filter((v): v is string => typeof v === 'string' && v.trim().length > 0)
      .join(', ');
    return {
      name: typeof p.customerName === 'string' ? p.customerName : '',
      phone: typeof p.customerPhone === 'string' ? p.customerPhone : '',
      addressLine1: typeof p.addressLine1 === 'string' ? p.addressLine1 : legacyLine1,
      addressLine2:
        typeof p.addressLine2 === 'string'
          ? p.addressLine2
          : legacyLine2 || legacy,
    };
  } catch {
    return empty;
  }
}

function saveDropDraft(payload: DropFormPersist) {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(STORAGE_KEYS.FOOD_CHECKOUT_DROP, JSON.stringify(payload));
  } catch {
    /* ignore */
  }
}

function clearDropDraft() {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(STORAGE_KEYS.FOOD_CHECKOUT_DROP);
  } catch {
    /* ignore */
  }
}

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
    const raw = JSON.parse(sessionStorage.getItem(FOOD_CHECKOUT_RECENT_ADDRESSES_KEY) || 'null') as unknown;
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
      FOOD_CHECKOUT_RECENT_ADDRESSES_KEY,
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
  const line1 = parts.slice(0, 3).join(', ');
  const line2 = parts.slice(3).join(', ') || parts.slice(1).join(', ');
  return { line1, line2 };
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

/** Saved food recents + ride drop + Menu → My Details address so the picker is useful on first visit. */
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

export default function FoodMenuCartClient() {
  const router = useRouter();
  const { getLocation, isLoading: locating, error: locateError } = useGeolocation();
  const { openPayment } = useRazorpay();
  const [mounted, setMounted] = useState(false);
  const [lines, setLines] = useState<CartLine[]>([]);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [payError, setPayError] = useState<string | null>(null);
  const [acceptLegal, setAcceptLegal] = useState(false);
  const [paying, setPaying] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [recentAddresses, setRecentAddresses] = useState<RecentAddress[]>([]);

  const restaurant = restaurantId ? getRestaurantById(restaurantId) : undefined;
  const pureVegRestaurant =
    restaurant?.pureVeg ?? (restaurant ? /veg|vegetarian/i.test(restaurant.description) : false);

  const hydrate = useCallback(() => {
    const d = getFoodOrderCartDraft();
    if (!d?.items?.length) {
      setRestaurantId(null);
      setLines([]);
      return;
    }
    setRestaurantId(d.restaurantId);
    setLines(d.items.map((i) => ({ ...i })));
    const saved = loadSavedDrop(d.restaurantId);
    setCustomerName(saved.name);
    setCustomerPhone(saved.phone);
    setAddressLine1(saved.addressLine1);
    setAddressLine2(saved.addressLine2);
    setRecentAddresses(collectRecentAddressOptions());
  }, []);

  useEffect(() => {
    setMounted(true);
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    const onUpdate = () => hydrate();
    window.addEventListener(FOOD_CART_UPDATED, onUpdate);
    return () => window.removeEventListener(FOOD_CART_UPDATED, onUpdate);
  }, [hydrate]);

  const persist = useCallback(
    (next: CartLine[]) => {
      if (!restaurantId) return;
      setLines(next);
      if (next.length === 0) {
        clearFoodOrderCartDraft();
        window.dispatchEvent(new CustomEvent(FOOD_CART_UPDATED));
        return;
      }
      setFoodOrderCartDraft({ restaurantId, items: next, whatsappOpened: false });
      window.dispatchEvent(new CustomEvent(FOOD_CART_UPDATED));
    },
    [restaurantId],
  );

  /** Login session or stored OTP phone → 10 digits for “Use my number”. */
  const myPhone10 = useMemo(() => {
    if (!mounted) return '';
    return normalizeLeadPhoneInput(getStoredPhone());
  }, [mounted]);

  const subtotal = useMemo(
    () => lines.reduce((s, l) => s + parsePrice(l.price) * l.quantity, 0),
    [lines],
  );
  const { gst, platformFee, grand } = useMemo(() => computeTotals(subtotal), [subtotal]);

  const composedDropAddress = useMemo(
    () =>
      formatStructuredDropAddress({
        line1: addressLine1,
        line2: addressLine2,
      }),
    [addressLine1, addressLine2],
  );

  const dropValid = useMemo(() => {
    const name = customerName.trim();
    const phoneDigits = customerPhone.replace(/\D/g, '');
    return name.length >= 2 && phoneDigits.length === 10 && addressLine1.trim().length >= 3 && addressLine2.trim().length >= 3;
  }, [customerName, customerPhone, addressLine1, addressLine2]);

  useEffect(() => {
    if (!restaurantId) return;
    saveDropDraft({
      restaurantId,
      customerName,
      customerPhone,
      addressLine1,
      addressLine2,
    });
  }, [
    restaurantId,
    customerName,
    customerPhone,
    addressLine1,
    addressLine2,
  ]);

  const inc = (name: string) => {
    persist(lines.map((l) => (l.name === name ? { ...l, quantity: l.quantity + 1 } : l)));
  };

  const dec = (name: string) => {
    persist(
      lines
        .map((l) => (l.name === name ? { ...l, quantity: l.quantity - 1 } : l))
        .filter((l) => l.quantity > 0),
    );
  };

  useEffect(() => {
    if (!mounted) return;
    if (!restaurantId || lines.length === 0) {
      router.replace(ROUTES.FIND_RESTAURANT);
    }
  }, [mounted, restaurantId, lines.length, router]);

  const goBookNow = () => {
    if (restaurant) router.push(`/find-restaurant/${restaurant.id}`);
    else router.push(ROUTES.FIND_RESTAURANT);
  };

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

  const startPay = useCallback(async () => {
    if (!restaurant || !restaurantId || lines.length === 0) return;
    setPayError(null);
    if (!acceptLegal) {
      setPayError('Please agree to the terms below to pay.');
      return;
    }
    const name = customerName.trim();
    const phone = customerPhone.replace(/\D/g, '');
    const addr = composedDropAddress;
    if (name.length < 2) {
      setPayError('Please enter your full name.');
      return;
    }
    if (phone.length !== 10) {
      setPayError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (addressLine1.trim().length < 3) {
      setPayError('Enter address line 1.');
      return;
    }
    if (addressLine2.trim().length < 3) {
      setPayError('Enter address line 2.');
      return;
    }
    setPaying(true);
    trackCheckoutStarted('food_menu_razorpay', grand);

    const pickupUrl = `${ROUTES.PICKUP_LOCATION}?step=2&from=food&fresh=1`;
    const pickupAddress = restaurant.address?.trim() || restaurant.name;
    const compactAddress = `${addressLine1.trim()}, ${addressLine2.trim()}`.slice(0, 250);
    const prefillContact = phone ? `+91${phone}` : undefined;

    openPayment({
      amountInr: grand,
      receipt: `food_${restaurant.id}_${Date.now()}`,
      description: `${restaurant.name} — ${lines.length} item(s)`,
      notes: {
        flow: 'food_menu',
        restaurant_id: restaurantId,
        address: compactAddress,
        drop_name: name.slice(0, 80),
        drop_phone: phone,
        drop_address: addr.slice(0, 250),
        ...buildPrepayLegalRazorpayNotes(FOOD_MENU_CHECKOUT_CONSENT_VERSION),
      },
      prefill: { name, contact: prefillContact },
      onSuccess: ({ paymentId }) => {
        setPickupLocation({
          name: restaurant.name,
          address: pickupAddress,
          contact: restaurant.phone?.trim() ?? '',
        });
        setDeliveryGoodsDescription({
          restaurantName: restaurant.name,
          items: lines.map((c) => ({ name: c.name, quantity: c.quantity, price: c.price })),
          source: 'restaurant',
          dropContactName: name,
          dropContactPhone: phone,
          dropAddress: addr,
        });
        saveRecentAddress({ line1: addressLine1, line2: addressLine2 });
        setRecentAddresses(collectRecentAddressOptions());
        clearDropDraft();

        if (!isUserAuthenticated()) {
          clearFoodOrderCartDraft();
          window.dispatchEvent(new CustomEvent(FOOD_CART_UPDATED));
          setPostLoginRedirect(pickupUrl);
          setLoginContinuationMessage('Please login to continue your delivery booking.');
          setPaying(false);
          router.push(`${ROUTES.LOGIN}?from=food`);
          return;
        }

        trackEvent('ride_booked', {
          amount: grand,
          vehicle_type: 'food_delivery',
          distance_km: null,
          user_type: getBookingUserType(),
          flow: 'food_menu',
          item_count: lines.length,
          payment_id: paymentId,
        });
        trackBookingCompleted({
          flow: 'food_menu',
          amount: grand,
          item_count: lines.length,
          payment_id: paymentId,
        });

        const itemLines = lines.map((i) => `${i.name} × ${i.quantity}`);
        clearFoodOrderCartDraft();
        window.dispatchEvent(new CustomEvent(FOOD_CART_UPDATED));
        setPaying(false);
        router.replace(
          paymentResultSuccessHref({
            flow: 'food',
            paymentId,
            amountInr: grand,
            title: restaurant.name,
            subtitle: `${lines.length} item(s) · ₹${grand} paid`,
            lines: [
              `Items ₹${subtotal.toLocaleString('en-IN')} · GST ₹${gst} · Platform fee ₹${platformFee}`,
              `Deliver to: ${name} · ${phone}`,
              addr.length > 100 ? `${addr.slice(0, 100)}…` : addr,
              ...itemLines.slice(0, 8),
              itemLines.length > 8 ? `+${itemLines.length - 8} more` : '',
            ].filter(Boolean),
            retryPath: ROUTES.FIND_RESTAURANT_CART,
            continuePath: pickupUrl,
          }),
        );
      },
      onError: (err) => {
        setPaying(false);
        if (err === 'Payment cancelled') return;
        router.push(
          paymentResultFailureHref({
            flow: 'food',
            title: 'Food checkout',
            message: err,
            amountInr: grand,
            retryPath: ROUTES.FIND_RESTAURANT_CART,
          }),
        );
      },
    });
  }, [
    acceptLegal,
    addressLine1,
    addressLine2,
    composedDropAddress,
    customerName,
    customerPhone,
    grand,
    gst,
    lines,
    openPayment,
    platformFee,
    restaurant,
    restaurantId,
    router,
    subtotal,
  ]);

  if (!mounted || !restaurant || lines.length === 0) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-[#F8F9FA] text-sm text-neutral-500">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-28">
      <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white/95 backdrop-blur-md">
        <div className="relative mx-auto flex max-w-lg items-center justify-center px-4 py-3 sm:max-w-xl">
          <button
            type="button"
            onClick={() => router.push(`/find-restaurant/${restaurant.id}`)}
            className="absolute left-4 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-neutral-200 bg-white text-neutral-800 shadow-sm"
            aria-label="Back"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-bold text-neutral-900 sm:text-xl">Cart</h1>
        </div>
      </header>

      <div className="mx-auto max-w-lg space-y-5 px-4 py-5 sm:max-w-xl">
        <section>
          <p className="text-xs font-semibold text-neutral-500">Item</p>
          <div className="mt-2 rounded-xl border border-neutral-200/90 bg-white p-3 shadow-sm sm:p-4">
            <ul className="space-y-4">
              {lines.map((line) => (
                <li key={line.name} className="flex items-center gap-2">
                  {pureVegRestaurant ? <VegMark /> : <span className="w-3.5 shrink-0" />}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-neutral-900">{line.name}</p>
                    <p className="mt-0.5 text-xs font-semibold tabular-nums text-neutral-700">
                      ₹{parsePrice(line.price) * line.quantity}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center rounded-lg border border-neutral-200 bg-white">
                    <button
                      type="button"
                      className="grid h-8 w-8 place-items-center text-emerald-600 hover:bg-neutral-50"
                      onClick={() => dec(line.name)}
                      aria-label={`Remove ${line.name}`}
                    >
                      −
                    </button>
                    <span className="min-w-[1.5rem] text-center text-xs font-bold tabular-nums text-neutral-900">
                      {line.quantity}
                    </span>
                    <button
                      type="button"
                      className="grid h-8 w-8 place-items-center text-emerald-600 hover:bg-neutral-50"
                      onClick={() => inc(line.name)}
                      aria-label={`Add ${line.name}`}
                    >
                      +
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section>
          <p className="text-xs font-semibold text-neutral-500">Price details</p>
          <div className="mt-2 rounded-xl border border-neutral-200/90 bg-white p-3 shadow-sm sm:p-4">
            <div className="flex justify-between text-sm text-neutral-700">
              <span>Total MRP</span>
              <span className="tabular-nums font-medium text-neutral-900">₹{subtotal}</span>
            </div>
            <div className="mt-2 flex justify-between text-sm text-neutral-700">
              <span>GST</span>
              <span className="tabular-nums font-medium text-neutral-900">₹{gst}</span>
            </div>
            <div className="mt-2 flex justify-between text-sm text-neutral-700">
              <span>Platform fee</span>
              <span className="tabular-nums font-medium text-neutral-900">₹{platformFee}</span>
            </div>
            <div className="my-3 border-t border-neutral-200" />
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-bold text-neutral-900">Toatal Amount</span>
              <span className="text-lg font-bold tabular-nums text-neutral-900">₹{grand}</span>
            </div>
          </div>
        </section>

        <section>
          <p className="text-xs font-semibold text-neutral-500">Delivery details</p>
          <p className="mt-1 text-[11px] leading-snug text-neutral-500 sm:text-xs">
            Clear fields help the driver reach you without calling. All drop fields below are sent to the rider after payment.
          </p>
          <div className="mt-2 space-y-4 rounded-xl border-2 border-neutral-200 bg-white p-4 shadow-sm sm:p-5">
            <label className="block">
              <span className="text-sm font-medium text-neutral-800">Full name</span>
              <input
                type="text"
                name="customerName"
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
                    onClick={() => setCustomerPhone(myPhone10)}
                    className="text-xs font-semibold underline decoration-[#1A1D3A]/40 underline-offset-2 text-[#1A1D3A] hover:decoration-[#1A1D3A]"
                    aria-label="Fill mobile number from your logged-in account"
                  >
                    Use my number
                  </button>
                ) : null}
              </div>
              <input
                type="tel"
                name="customerPhone"
                inputMode="numeric"
                autoComplete="tel"
                maxLength={10}
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
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
                <label htmlFor="food-recent-address" className="sr-only">
                  Select from recent drop locations
                </label>
                <select
                  id="food-recent-address"
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
                {recentAddresses.length === 0 ? (
                  <p className="text-[11px] leading-snug text-neutral-500 sm:text-xs">
                    Saved after a successful payment, or use your ride drop / My Details address when available. Try{' '}
                    <strong className="font-medium text-neutral-700">Use current location</strong> above.
                  </p>
                ) : null}
              </div>
            </div>
            {locateError ? <p className="text-[11px] text-amber-700">{locateError}</p> : null}
            <label className="block">
              <span className="text-sm font-medium text-neutral-800">
                Address line 1 <span className="font-normal text-red-600">*</span>
              </span>
              <input
                type="text"
                name="addressLine1"
                autoComplete="address-line1"
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                placeholder="Flat / house no, building / society"
                className="mt-1.5 w-full rounded-lg border-2 border-neutral-300 bg-neutral-50 px-3 py-3 text-sm text-neutral-900 placeholder:text-neutral-500 shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:border-[#1A1D3A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A1D3A]/25"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-neutral-800">
                Address line 2 <span className="font-normal text-red-600">*</span>
              </span>
              <input
                type="text"
                name="addressLine2"
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
        </section>

        <p className="text-center text-[11px] leading-relaxed text-neutral-500 sm:text-xs">
          By placing the order, you agree to Liftngo{' '}
          <Link href={ROUTES.TERMS} className="font-medium text-blue-600 underline underline-offset-2">
            Term of use
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="font-medium text-blue-600 underline underline-offset-2">
            Privacy Policy
          </Link>
        </p>

        <PrepayLegalDeclaration
          className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm"
          checked={acceptLegal}
          onCheckedChange={setAcceptLegal}
          productSummary={
            <>
              I confirm this payment is for food from <strong className="font-semibold">{restaurant.name}</strong> —{' '}
              <strong className="font-semibold">{lines.length} line(s)</strong>, items ₹
              {subtotal.toLocaleString('en-IN')}, GST ₹{gst}, platform fee ₹{platformFee}, total{' '}
              <strong className="font-semibold">₹{grand.toLocaleString('en-IN')}</strong>.{' '}
            </>
          }
        />

        {payError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">{payError}</div>
        ) : null}

        {!dropValid && acceptLegal ? (
          <p className="text-center text-[11px] text-neutral-500 sm:text-xs">
            Complete name, mobile, and both address lines to pay.
          </p>
        ) : null}

        <div className="flex gap-3 pb-4">
          <button
            type="button"
            onClick={goBookNow}
            className="flex min-h-12 flex-1 items-center justify-center rounded-xl border border-neutral-300 bg-white text-sm font-semibold text-neutral-900 shadow-sm transition hover:bg-neutral-50"
          >
            Book Now
          </button>
          <button
            type="button"
            disabled={paying || !acceptLegal || !dropValid}
            onClick={() => void startPay()}
            className="flex min-h-12 flex-1 items-center justify-center gap-1 rounded-xl bg-[#1A1D3A] text-sm font-semibold text-white shadow-md transition hover:opacity-95 disabled:opacity-45"
          >
            {paying ? (
              'Opening…'
            ) : (
              <>
                Pay ₹{grand}
                <span aria-hidden>→</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
