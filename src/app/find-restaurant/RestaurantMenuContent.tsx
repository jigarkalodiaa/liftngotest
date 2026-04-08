'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Image from '@/components/OptimizedImage';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Restaurant } from '@/data/restaurantsKhatushyam';
import { parsePrice } from '@/data/restaurantsKhatushyam';
import { Leaf, Star } from 'lucide-react';
import { setFoodOrderCartDraft, getFoodOrderCartDraft, clearFoodOrderCartDraft } from '@/lib/storage';
import { ROUTES } from '@/lib/constants';
import { FOOD_CART_ITEM_ADDED, FOOD_CART_UPDATED } from '@/lib/foodCartEvents';

const MENU_DISCLAIMER_BULLETS = [
  'Menu prices may vary at the outlet; the restaurant partner decides the final bill.',
  'Nutritional information is indicative only and not verified or updated by Liftngo.',
  'Daily calorie allowances vary by person; consult a professional for medical diets.',
  'Some descriptions may be partner- or AI-assisted; tell us if anything looks wrong.',
] as const;

type CartItem = { name: string; price: string; quantity: number };

const IconPlate = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" />
  </svg>
);
const IconCurry = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L4 6v4c0 5.5 3.8 10.7 8 12 4.2-1.3 8-6.5 8-12V6l-8-4z" />
  </svg>
);
const IconSnack = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="8" width="18" height="10" rx="2" />
    <path d="M7 8V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
  </svg>
);
const IconBeverage = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 2h8v4H8V2z" /><path d="M6 6h12l-1 14H7L6 6z" /><path d="M9 10h6" />
  </svg>
);
const IconRice = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3c-2 2-4 5-4 8 0 3 2 6 4 8 2-2 4-5 4-8s-2-6-4-8z" /><path d="M8 11c0 2 1.5 4 4 4s4-2 4-4" />
  </svg>
);
const IconBread = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="8" /><path d="M12 4v16M4 12h16" />
  </svg>
);
const IconSweet = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" /><path d="M8 12h8M12 8v8" />
  </svg>
);
const IconPrasad = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" />
  </svg>
);
const CATEGORY_ICONS: Record<string, React.ReactElement> = {
  Thali: <IconPlate />, Rajasthani: <IconPlate />, Main: <IconCurry />, Snacks: <IconSnack />,
  'North Indian': <IconCurry />, Beverages: <IconBeverage />, Paratha: <IconBread />, Curry: <IconCurry />,
  Bread: <IconBread />, Prasad: <IconPrasad />, Sweet: <IconSweet />, Breakfast: <IconSnack />,
  Rice: <IconRice />, Dal: <IconCurry />, Other: <IconPlate />,
};
function getCategoryIcon(category: string) {
  return CATEGORY_ICONS[category] ?? <IconPlate />;
}

/** Indian vegetarian mark — green square with inner circle */
function VegMark() {
  return (
    <span
      className="inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[3px] border border-emerald-600 bg-white sm:h-4 sm:w-4"
      aria-label="Vegetarian"
    >
      <span className="h-2 w-2 rounded-full bg-emerald-600" />
    </span>
  );
}

function restaurantMetaLine(r: Restaurant): string {
  const eta = r.listingEta?.trim();
  const dist = r.listingDistance?.trim();
  if (eta && dist) return `${eta}   ${dist}`;
  if (eta) return eta;
  if (dist) return dist;
  const est = r.deliveryEstimate?.replace(/^Est\.\s*delivery\s*/i, '').trim();
  return [est, r.distanceLabel].filter(Boolean).join('   ') || '';
}

function restaurantNearTemple(r: Restaurant): boolean {
  return (
    r.nearTemple ??
    (/temple|khatushyam/i.test(r.distanceLabel ?? '') || /temple|khatushyam/i.test(r.listingTags ?? ''))
  );
}

function RecommendedDishCard({
  item,
  category,
  showVegMark,
  inCart,
  onAdd,
  onRemove,
}: {
  item: { name: string; price: string; image?: string };
  category: string;
  showVegMark: boolean;
  inCart?: { quantity: number };
  onAdd: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-sm">
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-t-2xl bg-neutral-100">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 45vw, 280px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-neutral-100 text-[var(--color-primary)] [&_svg]:h-10 [&_svg]:w-10">
            {getCategoryIcon(category)}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-2.5 sm:p-3">
        <div className="flex items-start gap-1.5">
          {showVegMark ? <VegMark /> : <span className="w-3.5 shrink-0 sm:w-4" aria-hidden />}
          <span className="min-w-0 flex-1 text-sm font-medium leading-snug text-neutral-900">{item.name}</span>
        </div>
        <div className="mt-2 flex items-end justify-between gap-2">
          <span className="text-sm font-bold tabular-nums text-neutral-900">{item.price}</span>
          {inCart ? (
            <div className="flex shrink-0 items-center gap-0.5 rounded-lg border border-[var(--color-primary)]/40 bg-white px-0.5 py-0.5">
              <button
                type="button"
                onClick={onRemove}
                className="flex h-7 w-7 items-center justify-center rounded-md text-base font-medium text-neutral-700 transition-colors hover:bg-neutral-100"
                aria-label={`Remove one ${item.name}`}
              >
                −
              </button>
              <span className="min-w-[1.25rem] text-center text-xs font-bold text-neutral-900">{inCart.quantity}</span>
              <button
                type="button"
                onClick={onAdd}
                className="flex h-7 w-7 items-center justify-center rounded-md text-base font-medium text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary)]/5"
                aria-label={`Add one ${item.name}`}
              >
                +
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onAdd}
              className="shrink-0 rounded-lg border border-[var(--color-primary)] bg-white px-2.5 py-1 text-xs font-semibold text-[var(--color-primary)] shadow-sm transition-colors hover:bg-[var(--color-primary)]/[0.06] sm:px-3 sm:text-[13px]"
            >
              + Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const IconCart = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

function loadDraftForRestaurant(restaurantId: string): CartItem[] {
  if (typeof window === 'undefined') return [];
  const d = getFoodOrderCartDraft();
  if (d?.restaurantId !== restaurantId) return [];
  return d.items;
}

export default function RestaurantMenuContent({ restaurant }: { restaurant: Restaurant }) {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>(() => loadDraftForRestaurant(restaurant.id));
  const [orderDrawerOpen, setOrderDrawerOpen] = useState(false);
  const prevCartQtyRef = useRef(cart.reduce((s, i) => s + i.quantity, 0));

  useEffect(() => {
    if (cart.length === 0) {
      clearFoodOrderCartDraft();
      prevCartQtyRef.current = 0;
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(FOOD_CART_UPDATED));
      }
      return;
    }
    const totalQty = cart.reduce((s, i) => s + i.quantity, 0);
    const prev = prevCartQtyRef.current;
    setFoodOrderCartDraft({
      restaurantId: restaurant.id,
      items: cart,
      whatsappOpened: false,
    });
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(FOOD_CART_UPDATED));
      if (totalQty > prev) {
        window.dispatchEvent(new CustomEvent(FOOD_CART_ITEM_ADDED));
      }
    }
    prevCartQtyRef.current = totalQty;
  }, [cart, restaurant.id]);

  const recommendedItems = useMemo(
    () =>
      restaurant.menu.map((item) => ({
        item,
        category: item.category || 'Other',
      })),
    [restaurant.menu],
  );

  const pureVegRestaurant = restaurant.pureVeg ?? /veg|vegetarian/i.test(restaurant.description);
  const nearTemple = restaurantNearTemple(restaurant);
  const listingMeta = restaurantMetaLine(restaurant);
  const ratingLabel = restaurant.rating != null ? restaurant.rating.toFixed(1) : null;

  const addToOrder = (name: string, price: string) => {
    setCart((prev) => {
      const i = prev.findIndex((x) => x.name === name);
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], quantity: next[i].quantity + 1 };
        return next;
      }
      return [...prev, { name, price, quantity: 1 }];
    });
  };

  const removeFromOrder = (name: string) => {
    setCart((prev) => {
      const i = prev.findIndex((x) => x.name === name);
      if (i < 0) return prev;
      const next = [...prev];
      if (next[i].quantity <= 1) return next.filter((_, j) => j !== i);
      next[i] = { ...next[i], quantity: next[i].quantity - 1 };
      return next;
    });
  };

  const totalAmount = useMemo(() => {
    return cart.reduce((sum, item) => sum + parsePrice(item.price) * item.quantity, 0);
  }, [cart]);

  const cartItemCount = useMemo(() => cart.reduce((n, item) => n + item.quantity, 0), [cart]);

  return (
    <main className="relative min-h-screen flex-1 bg-white pb-28 sm:pb-32">
      <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3 sm:max-w-6xl sm:px-6">
          <Link
            href="/find-restaurant"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-neutral-200 bg-white text-neutral-800 shadow-sm transition-colors hover:bg-neutral-50"
            aria-label="Back to Food"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-lg font-bold tracking-tight text-neutral-900 sm:text-xl">Food</h1>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 pb-6 pt-4 sm:max-w-6xl sm:px-6 sm:pb-8 sm:pt-5">
        <div className="flex flex-wrap gap-2">
          {pureVegRestaurant ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-900 ring-1 ring-emerald-100 sm:text-xs">
              <Leaf className="h-3 w-3 shrink-0 text-emerald-600" strokeWidth={2} aria-hidden />
              Pure Veg restaurant
            </span>
          ) : null}
          {nearTemple ? (
            <span className="rounded-full bg-amber-50 px-2 py-1 text-[11px] font-semibold text-amber-900/90 ring-1 ring-amber-100/90 sm:text-xs">
              Near Temple
            </span>
          ) : null}
        </div>

        <div className="mt-3 flex items-start justify-between gap-3">
          <h2 className="text-pretty text-xl font-bold leading-tight text-neutral-900 sm:text-2xl">{restaurant.name}</h2>
          {ratingLabel ? (
            <span className="inline-flex shrink-0 items-center gap-0.5 rounded-md bg-emerald-500 px-2 py-1 text-xs font-semibold tabular-nums text-white shadow-sm sm:text-sm">
              <Star className="h-3.5 w-3.5 fill-white text-white" strokeWidth={0} aria-hidden />
              {ratingLabel}
            </span>
          ) : null}
        </div>
        {listingMeta ? <p className="mt-2 text-xs font-medium text-neutral-500 sm:text-sm">{listingMeta}</p> : null}

        <section className="mt-6" aria-labelledby="recommended-heading">
          <h3 id="recommended-heading" className="text-base font-bold text-neutral-900 sm:text-lg">
            Recommended for you
          </h3>
          <ul className="mt-3 grid grid-cols-2 gap-3 sm:mt-4 sm:gap-4" role="list">
            {recommendedItems.map(({ item, category }) => {
              const inCart = cart.find((c) => c.name === item.name);
              return (
                <li key={item.name} className="h-full">
                  <RecommendedDishCard
                    item={item}
                    category={category}
                    showVegMark={pureVegRestaurant}
                    inCart={inCart}
                    onAdd={() => addToOrder(item.name, item.price)}
                    onRemove={() => removeFromOrder(item.name)}
                  />
                </li>
              );
            })}
          </ul>
        </section>

        <div id="menu" className="space-y-6">
          {cart.length > 0 && (
            <div
              id="your-order"
              className="scroll-mt-24 rounded-2xl border border-[var(--landing-primary)]/15 bg-gradient-to-br from-white to-amber-50/30 p-4 shadow-[0_4px_24px_-10px_rgba(44,45,91,0.15)] sm:p-5"
            >
              <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-[var(--color-primary)]">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 [&_svg]:h-5 [&_svg]:w-5 [&_svg]:min-h-5 [&_svg]:min-w-5 [&_svg]:max-h-5 [&_svg]:max-w-5">
                  <IconCart className="text-[var(--color-primary)]" />
                </span>
                Your order
              </h3>
              <ul className="mb-4 space-y-2.5">
                {cart.map((item) => (
                  <li key={item.name} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-bold text-[var(--color-primary)]">₹{parsePrice(item.price) * item.quantity}</span>
                  </li>
                ))}
              </ul>
              <p className="flex items-center justify-between border-t border-gray-200/80 pt-3 text-base font-bold text-gray-900">
                Subtotal
                <span className="text-lg text-[var(--color-primary)]">₹{totalAmount}</span>
              </p>
              <Link
                href={ROUTES.FIND_RESTAURANT_CART}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#1A1D3A] py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-95"
              >
                View cart &amp; pay
              </Link>
            </div>
          )}

          <div className="rounded-2xl border border-[var(--landing-primary)]/10 bg-gradient-to-br from-[#FFF9F4] to-white p-4 sm:p-5">
            <Link
              href="/find-restaurant"
              className="flex w-full items-center justify-center rounded-xl border-2 border-[var(--landing-primary)]/20 bg-white py-3 text-sm font-semibold text-gray-800 transition-colors hover:bg-[var(--landing-bg)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
            >
              Browse more restaurants
            </Link>
          </div>
        </div>

        <footer className="mt-8 -mx-4 border-t border-neutral-200/80 bg-[#F8F8F8] px-4 py-6 sm:-mx-6 sm:px-6 sm:py-8">
          <h3 className="text-sm font-bold text-neutral-800">Disclaimer</h3>
          <ul className="mt-3 list-disc space-y-2 pl-4 text-xs leading-relaxed text-neutral-500 sm:text-[13px]">
            {MENU_DISCLAIMER_BULLETS.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <h3 className="mt-6 text-sm font-bold text-neutral-800">Address</h3>
          <p className="mt-2 text-xs leading-relaxed text-neutral-500 sm:text-[13px]">
            {restaurant.address ?? 'Contact the restaurant or Liftngo support for the full address.'}
          </p>
        </footer>
      </div>

      {/* Order summary drawer (same pattern as /find-restaurant listing) */}
      <div
        className={`fixed inset-0 z-[60] bg-black/40 transition-opacity duration-300 ${
          orderDrawerOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden={!orderDrawerOpen}
        onClick={() => setOrderDrawerOpen(false)}
      />
      <div
        className={`fixed inset-x-0 bottom-0 z-[65] max-h-[min(72vh,30rem)] rounded-t-2xl border border-[var(--landing-primary)]/10 bg-white shadow-[0_-8px_40px_rgba(0,0,0,0.1)] transition-transform duration-300 ease-out ${
          orderDrawerOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Your order summary"
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
          <div>
            <span className="font-bold text-gray-900">Your list</span>
            {cart.length > 0 && (
              <p className="text-xs text-gray-600">
                {cartItemCount} item{cartItemCount === 1 ? '' : 's'} · ₹{totalAmount} total
              </p>
            )}
          </div>
          <button
            type="button"
            className="min-h-11 min-w-11 rounded-full text-gray-500 hover:bg-gray-100"
            onClick={() => setOrderDrawerOpen(false)}
            aria-label="Close"
          >
            <span className="text-xl leading-none">×</span>
          </button>
        </div>
        <div className="max-h-[46vh] overflow-y-auto px-4 py-3">
          {cart.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-600">Nothing yet—add dishes from the menu above.</p>
          ) : (
            <ul className="space-y-2">
              {cart.map((item) => (
                <li key={item.name} className="flex justify-between gap-2 text-sm">
                  <span className="text-gray-800">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="shrink-0 font-semibold text-[var(--color-primary)]">
                    ₹{parsePrice(item.price) * item.quantity}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        {cart.length > 0 ? (
          <div className="space-y-2 border-t border-gray-100 p-4">
            <Link
              href={ROUTES.FIND_RESTAURANT_CART}
              onClick={() => setOrderDrawerOpen(false)}
              className="flex w-full items-center justify-center rounded-xl bg-[#1A1D3A] py-3 text-sm font-semibold text-white transition-opacity hover:opacity-95"
            >
              View cart &amp; pay
            </Link>
          </div>
        ) : null}
      </div>

      <div
        id="sticky-menu-cta"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--landing-primary)]/12 bg-white/95 px-2 py-3 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] backdrop-blur-md sm:px-4"
        style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
      >
        <div className="mx-auto flex max-w-2xl items-center gap-2 sm:gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-white shadow-sm">
            <IconCart className="h-5 w-5 shrink-0" aria-hidden />
          </div>
          <button
            type="button"
            onClick={() => (cart.length > 0 ? router.push(ROUTES.FIND_RESTAURANT_CART) : setOrderDrawerOpen(true))}
            className="flex min-h-[3.25rem] min-w-0 flex-1 flex-col items-center justify-center rounded-xl border border-[var(--landing-primary)]/25 bg-white px-2 text-center transition hover:bg-[var(--landing-bg)] sm:flex-row sm:gap-2 sm:px-3"
          >
            <span className="text-xs font-bold text-[var(--color-primary)] sm:text-sm">Your list</span>
            <span className="text-[0.6875rem] text-gray-600 sm:text-sm">
              {cart.length > 0 ? `${cartItemCount} item${cartItemCount === 1 ? '' : 's'} · ₹${totalAmount}` : 'Empty'}
            </span>
          </button>
          {cart.length === 0 ? (
            <span
              className="inline-flex min-h-[3.25rem] flex-[1.25] cursor-not-allowed items-center justify-center rounded-xl bg-gray-200 px-3 text-center text-xs font-bold text-gray-500 sm:text-sm"
              aria-disabled="true"
            >
              Cart &amp; pay
            </span>
          ) : (
            <button
              type="button"
              onClick={() => router.push(ROUTES.FIND_RESTAURANT_CART)}
              className="inline-flex min-h-[3.25rem] flex-[1.25] items-center justify-center rounded-xl bg-[#1A1D3A] px-3 text-center text-xs font-bold text-white shadow-md transition hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1D3A] focus-visible:ring-offset-2 sm:text-sm"
            >
              Cart &amp; pay
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
