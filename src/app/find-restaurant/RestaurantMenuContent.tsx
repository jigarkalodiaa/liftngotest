'use client';

import type { ReactNode } from 'react';
import { useState, useMemo, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Restaurant } from '@/data/restaurantsKhatushyam';
import { getRestaurantCoverImage, parsePrice, RESTAURANT_OWNER_WHATSAPP } from '@/data/restaurantsKhatushyam';
import {
  setPickupLocation,
  setDeliveryGoodsDescription,
  setPostLoginRedirect,
  setLoginContinuationMessage,
  isUserAuthenticated,
  setFoodOrderCartDraft,
  getFoodOrderCartDraft,
  clearFoodOrderCartDraft,
} from '@/lib/storage';
import { ROUTES } from '@/lib/constants';
import { trackWhatsAppClick, trackBookNowClick } from '@/lib/analytics';
import { FOOD_CART_ITEM_ADDED, FOOD_CART_UPDATED } from '@/lib/foodCartEvents';

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
const IconPhone = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
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

/** Prevent flex layouts from inflating inline SVGs on mobile. */
function CategoryIconWrap({ children }: { children: ReactNode }) {
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] [&_svg]:h-5 [&_svg]:w-5 [&_svg]:min-h-5 [&_svg]:min-w-5 [&_svg]:max-h-5 [&_svg]:max-w-5 [&_svg]:shrink-0">
      {children}
    </span>
  );
}

function MenuItemThumb({
  item,
  category,
}: {
  item: { name: string; image?: string };
  category: string;
}) {
  if (item.image) {
    return (
      <div className="relative h-[4.25rem] w-[4.25rem] shrink-0 overflow-hidden rounded-xl bg-amber-50 ring-1 ring-[var(--landing-primary)]/10 sm:h-[4.75rem] sm:w-[4.75rem]">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover transition-transform duration-300 ease-out group-hover:scale-110"
          sizes="(max-width: 640px) 76px, 86px"
        />
      </div>
    );
  }
  return (
    <div
      className="flex h-[4.25rem] w-[4.25rem] shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-primary)]/10 to-amber-50 text-[var(--color-primary)] sm:h-[4.75rem] sm:w-[4.75rem] [&_svg]:h-7 [&_svg]:w-7 [&_svg]:min-h-7 [&_svg]:min-w-7 [&_svg]:max-h-7 [&_svg]:max-w-7 [&_svg]:shrink-0"
      aria-hidden
    >
      {getCategoryIcon(category)}
    </div>
  );
}

const IconWhatsApp = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const IconCart = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const IconDelivery = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" />
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

function loadDraftForRestaurant(restaurantId: string): { cart: CartItem[]; whatsappOpened: boolean } {
  if (typeof window === 'undefined') return { cart: [], whatsappOpened: false };
  const d = getFoodOrderCartDraft();
  if (d?.restaurantId !== restaurantId) return { cart: [], whatsappOpened: false };
  return { cart: d.items, whatsappOpened: d.whatsappOpened };
}

export default function RestaurantMenuContent({ restaurant }: { restaurant: Restaurant }) {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>(() => loadDraftForRestaurant(restaurant.id).cart);
  const [showPaymentConfirm, setShowPaymentConfirm] = useState(false);
  const [orderDrawerOpen, setOrderDrawerOpen] = useState(false);
  /** Unlocks "Book delivery boy" only after user taps Send order via WhatsApp (same session). */
  const [whatsappOpened, setWhatsappOpened] = useState(() => loadDraftForRestaurant(restaurant.id).whatsappOpened);
  const prevCartQtyRef = useRef(cart.reduce((s, i) => s + i.quantity, 0));

  useEffect(() => {
    if (cart.length === 0) setWhatsappOpened(false);
  }, [cart.length]);

  useEffect(() => {
    if (cart.length === 0 && !whatsappOpened) {
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
      whatsappOpened,
    });
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(FOOD_CART_UPDATED));
      if (totalQty > prev) {
        window.dispatchEvent(new CustomEvent(FOOD_CART_ITEM_ADDED));
      }
    }
    prevCartQtyRef.current = totalQty;
  }, [cart, whatsappOpened, restaurant.id]);

  const canBookDelivery = cart.length > 0 && whatsappOpened;

  const groupedMenu = restaurant.menu.reduce<Record<string, typeof restaurant.menu>>((acc, item) => {
    const cat = item.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

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

  const whatsappMessage = useMemo(() => {
    if (cart.length === 0) return '';
    const lines = [
      `Order for *${restaurant.name}*`,
      '————————————',
      ...cart.map((c) => `${c.name} x ${c.quantity} — ₹${parsePrice(c.price) * c.quantity}`),
      '————————————',
      `*Total: ₹${totalAmount}*`,
      '',
      'Please confirm. Thank you!',
    ];
    return lines.join('\n');
  }, [cart, restaurant.name, totalAmount]);

  const whatsappUrl =
    whatsappMessage.trim() !== ''
      ? `https://wa.me/${RESTAURANT_OWNER_WHATSAPP}?text=${encodeURIComponent(whatsappMessage)}`
      : null;

  const handleBookDeliveryClick = () => {
    trackBookNowClick('restaurant_menu_book_delivery');
    setShowPaymentConfirm(true);
  };

  const handlePaymentConfirmed = () => {
    trackBookNowClick('restaurant_menu_after_payment');
    const pickupUrl = `${ROUTES.PICKUP_LOCATION}?step=2&from=food&fresh=1`;
    const pickupAddress = restaurant.address?.trim() || restaurant.name;
    setPickupLocation({
      name: restaurant.name,
      address: pickupAddress,
      contact: restaurant.phone?.trim() ?? '',
    });
    setDeliveryGoodsDescription({
      restaurantName: restaurant.name,
      items: cart.map((c) => ({ name: c.name, quantity: c.quantity, price: c.price })),
    });

    if (!isUserAuthenticated()) {
      setPostLoginRedirect(pickupUrl);
      setLoginContinuationMessage('Please login to continue your booking.');
      setShowPaymentConfirm(false);
      router.push(`${ROUTES.LOGIN}?from=food`);
      return;
    }

    setShowPaymentConfirm(false);
    router.push(pickupUrl);
  };

  const heroImageSrc = getRestaurantCoverImage(restaurant);

  const handleStickyBookClick = () => {
    if (canBookDelivery) {
      handleBookDeliveryClick();
      return;
    }
    if (cart.length > 0) {
      setOrderDrawerOpen(true);
      document.getElementById('your-order')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <main className="relative min-h-screen flex-1 bg-gradient-to-b from-[#FFF9F4] via-[var(--landing-bg)] to-white pb-28 sm:pb-32">
      <div className="mx-auto max-w-2xl px-4 pb-8 pt-6 sm:px-6 sm:pt-8">
        <Link
          href="/find-restaurant"
          className="mb-5 inline-flex min-h-11 w-fit items-center gap-2 rounded-full border border-[var(--landing-primary)]/20 bg-white/90 px-4 py-2 text-sm font-semibold text-[var(--color-primary)] shadow-sm transition-colors hover:border-[var(--landing-primary)]/35"
          aria-label="Back to restaurants"
        >
          <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          All restaurants
        </Link>

        <header className="relative mb-8 min-h-[220px] overflow-hidden rounded-3xl border border-[var(--landing-primary)]/12 shadow-[0_8px_32px_-12px_rgba(245,158,11,0.2)] sm:min-h-[260px]">
          <Image
            src={heroImageSrc}
            alt={`${restaurant.name} — favourite dishes`}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 672px) 100vw, 672px"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary)]/92 via-[var(--color-primary)]/50 to-[var(--landing-orange)]/40"
            aria-hidden
          />
          <div className="relative z-10 flex min-h-[220px] flex-col justify-end p-5 sm:min-h-[260px] sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/90">Menu · Khatu Shyam Ji</p>
            <h1 className="mt-1 text-balance text-2xl font-bold leading-tight text-white sm:text-3xl">{restaurant.name}</h1>
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-white/90 sm:text-base">{restaurant.description}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(['Fresh food', 'Fast delivery', 'Near temple'] as const).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/35 bg-white/15 px-2.5 py-1 text-[0.6875rem] font-semibold text-white backdrop-blur-[2px]"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-white/95">
              <span className="rounded-full bg-white/15 px-2.5 py-1 font-medium backdrop-blur-[2px]">
                Verified by Liftngo
              </span>
              <span className="rounded-full bg-white/15 px-2.5 py-1 font-medium backdrop-blur-[2px]">
                Trusted food partner
              </span>
              <span className="rounded-full bg-white/15 px-2.5 py-1 font-medium backdrop-blur-[2px]">
                Fresh &amp; hygienic
              </span>
            </div>
            {(restaurant.rating != null || restaurant.deliveryEstimate) && (
              <div className="mt-4 flex flex-wrap gap-4 border-t border-white/20 pt-3 text-sm font-semibold text-white">
                {restaurant.rating != null && <span>★ {restaurant.rating.toFixed(1)}</span>}
                {restaurant.deliveryEstimate && <span>{restaurant.deliveryEstimate}</span>}
              </div>
            )}
          </div>
        </header>

        <div id="menu" className="space-y-6">
          {Object.entries(groupedMenu).map(([category, items]) => (
            <section
              key={category}
              className="rounded-2xl border border-[var(--landing-primary)]/12 bg-gradient-to-br from-white via-[#FFFCF8] to-amber-50/25 p-4 shadow-[0_4px_20px_-8px_rgba(44,45,91,0.12)] sm:p-5"
            >
              <div className="mb-4 flex items-center gap-3">
                <CategoryIconWrap>{getCategoryIcon(category)}</CategoryIconWrap>
                <h2 className="text-sm font-bold uppercase tracking-wide text-[var(--color-primary)]">{category}</h2>
              </div>
              <ul className="space-y-3">
                {items.map((item) => {
                  const inCart = cart.find((c) => c.name === item.name);
                  return (
                    <li
                      key={item.name}
                      className="group flex flex-wrap items-center gap-3 rounded-2xl border border-[var(--landing-primary)]/10 bg-white/90 py-2.5 ps-2 pe-3 shadow-sm transition-all duration-200 hover:border-[var(--landing-orange)]/35 hover:shadow-md sm:gap-4 sm:px-3"
                    >
                      <MenuItemThumb item={item} category={category} />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-0.5 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-2">
                          <span className="text-sm font-semibold text-gray-900">{item.name}</span>
                          <span className="whitespace-nowrap text-sm font-bold text-[var(--color-primary)]">{item.price}</span>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-1 sm:ms-auto">
                        {inCart ? (
                          <>
                            <button
                              type="button"
                              onClick={() => removeFromOrder(item.name)}
                              className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-lg font-medium text-gray-800 transition-colors hover:bg-gray-200"
                              aria-label={`Remove one ${item.name}`}
                            >
                              −
                            </button>
                            <span className="w-8 text-center text-sm font-bold text-gray-900">{inCart.quantity}</span>
                            <button
                              type="button"
                              onClick={() => addToOrder(item.name, item.price)}
                              className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-primary)] text-lg font-medium text-white transition-[transform,opacity] hover:opacity-90 active:scale-95"
                              aria-label={`Add one ${item.name}`}
                            >
                              +
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => addToOrder(item.name, item.price)}
                            className="rounded-xl bg-[var(--color-primary)] px-4 py-2 text-xs font-bold text-white shadow-sm transition-[transform,opacity] hover:opacity-95 active:scale-95"
                          >
                            Add
                          </button>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}

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
                Total
                <span className="text-lg text-[var(--color-primary)]">₹{totalAmount}</span>
              </p>
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    trackWhatsAppClick('restaurant_menu');
                    setWhatsappOpened(true);
                  }}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--whatsapp-green)] py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--whatsapp-green)] focus-visible:ring-offset-2"
                >
                  <IconWhatsApp className="h-5 w-5 shrink-0" />
                  Send order via WhatsApp
                </a>
              )}
            </div>
          )}

          {cart.length > 0 && (
            <p className="rounded-2xl border border-[var(--landing-primary)]/10 bg-[var(--color-primary)]/[0.04] px-4 py-3 text-xs leading-relaxed text-gray-700 sm:text-sm">
              <strong className="text-gray-900">Next:</strong> Tap <strong className="text-[var(--color-primary)]">Send order via WhatsApp</strong> first (unlocks delivery). Pay the restaurant, then{' '}
              <strong className="text-[var(--color-primary)]">Book delivery boy</strong>. You&apos;ll add your drop address next.
            </p>
          )}

          <div id="book-delivery-section" className="scroll-mt-24 rounded-2xl border border-[var(--landing-primary)]/12 bg-white/95 p-4 shadow-sm sm:p-5">
            <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-[var(--color-primary)]">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 [&_svg]:h-5 [&_svg]:w-5 [&_svg]:min-h-5 [&_svg]:min-w-5 [&_svg]:max-h-5 [&_svg]:max-w-5">
                <IconDelivery className="text-[var(--color-primary)]" />
              </span>
              Book delivery
            </h3>
            <p className="mb-3 text-sm leading-relaxed text-gray-600">
              Pickup stays at <strong className="text-gray-900">{restaurant.name}</strong>. After you&apos;ve paid the restaurant, we&apos;ll ask for{' '}
              <strong className="text-gray-900">your delivery address</strong>.
            </p>
            {cart.length === 0 && <p className="mb-3 text-xs text-gray-500">Add items above to build your order.</p>}
            {cart.length > 0 && !whatsappOpened && (
              <p className="mb-3 rounded-xl border border-amber-200/80 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                Tap <strong>Send order via WhatsApp</strong> above to unlock booking.
              </p>
            )}
            <button
              type="button"
              onClick={handleBookDeliveryClick}
              disabled={!canBookDelivery}
              aria-disabled={!canBookDelivery}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] py-3.5 text-sm font-bold text-white shadow-md transition-[opacity,transform] hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-45 active:enabled:scale-[0.99]"
            >
              <IconDelivery className="h-5 w-5 shrink-0" />
              Book delivery boy
            </button>
          </div>

          <div className="space-y-3 rounded-2xl border border-[var(--landing-primary)]/10 bg-gradient-to-br from-[#FFF9F4] to-white p-4 sm:p-5">
            {restaurant.phone && (
              <a
                href={`tel:${restaurant.phone.replace(/\s/g, '')}`}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] py-3 text-sm font-semibold text-white transition-opacity hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
              >
                <IconPhone className="h-4 w-4 shrink-0 opacity-90" />
                Call to order
              </a>
            )}
            <Link
              href="/find-restaurant"
              className="flex w-full items-center justify-center rounded-xl border-2 border-[var(--landing-primary)]/20 bg-white py-3 text-sm font-semibold text-gray-800 transition-colors hover:bg-[var(--landing-bg)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
            >
              Browse more restaurants
            </Link>
          </div>
        </div>
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
        {cart.length > 0 && whatsappUrl && (
          <div className="border-t border-gray-100 p-4 space-y-2">
            {!whatsappOpened && (
              <p className="text-center text-xs text-amber-900">
                Send your order on WhatsApp to unlock <strong>Book delivery boy</strong>.
              </p>
            )}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                trackWhatsAppClick('restaurant_menu_drawer');
                setWhatsappOpened(true);
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--whatsapp-green)] py-3 text-sm font-semibold text-white transition-opacity hover:opacity-95"
            >
              <IconWhatsApp className="h-5 w-5 shrink-0" />
              Send order via WhatsApp
            </a>
          </div>
        )}
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
            onClick={() => setOrderDrawerOpen(true)}
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
              Book delivery boy
            </span>
          ) : (
            <button
              type="button"
              onClick={handleStickyBookClick}
              className={`inline-flex min-h-[3.25rem] flex-[1.25] items-center justify-center rounded-xl px-3 text-center text-xs font-bold text-white shadow-md transition-[opacity,transform] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 sm:text-sm ${
                canBookDelivery
                  ? 'bg-[var(--color-primary)] hover:opacity-95 active:scale-[0.99]'
                  : 'bg-[var(--color-primary)]/85 hover:opacity-95 active:scale-[0.99]'
              }`}
            >
              {canBookDelivery ? 'Book delivery boy' : 'Next: WhatsApp'}
            </button>
          )}
        </div>
      </div>

      {showPaymentConfirm && (
        <>
          <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-[1px]" onClick={() => setShowPaymentConfirm(false)} aria-hidden />
          <div
            className="fixed left-1/2 top-1/2 z-[101] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[var(--landing-primary)]/15 bg-white p-6 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="payment-confirm-title"
            aria-describedby="payment-confirm-desc"
          >
            <h2 id="payment-confirm-title" className="mb-1 text-lg font-bold text-gray-900">
              Confirm payment
            </h2>
            <p id="payment-confirm-desc" className="mb-5 text-sm leading-relaxed text-gray-600">
              Have you paid <strong className="text-gray-900">{restaurant.name}</strong> for your order? We&apos;ll then ask for your <strong>delivery address</strong> and complete the booking.
            </p>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={handlePaymentConfirmed}
                className="w-full rounded-xl bg-[var(--color-primary)] py-3 text-sm font-semibold text-white transition-opacity hover:opacity-95"
              >
                Yes, I&apos;ve paid — Book delivery
              </button>
              <button
                type="button"
                onClick={() => setShowPaymentConfirm(false)}
                className="w-full rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                No, not yet
              </button>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
