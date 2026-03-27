'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Restaurant } from '@/data/restaurantsKhatushyam';
import { parsePrice, RESTAURANT_OWNER_WHATSAPP } from '@/data/restaurantsKhatushyam';
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
const FoodCurryBowl = ({ className = 'w-full h-full' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 45 Q12 28 40 28 Q68 28 68 45 L68 52 Q68 62 40 62 Q12 62 12 52 Z" fill="#FFFBF7" stroke="#E8E0D5" strokeWidth="1.5" />
    <ellipse cx="40" cy="42" rx="22" ry="8" fill="#C45C26" opacity="0.95" />
    <path d="M28 32 Q32 26 36 32" stroke="#D4C4B0" strokeWidth="1.5" fill="none" opacity="0.8" strokeLinecap="round" />
    <path d="M40 26 Q44 20 48 26" stroke="#D4C4B0" strokeWidth="1.5" fill="none" opacity="0.8" strokeLinecap="round" />
    <path d="M52 32 Q56 26 60 32" stroke="#D4C4B0" strokeWidth="1.5" fill="none" opacity="0.8" strokeLinecap="round" />
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

function MenuItemThumb({
  item,
  category,
}: {
  item: { name: string; image?: string };
  category: string;
}) {
  if (item.image) {
    return (
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-[4.5rem] sm:w-[4.5rem]">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 64px, 72px"
        />
      </div>
    );
  }
  return (
    <div
      className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[var(--landing-primary)]/10 text-[var(--landing-primary)] sm:h-[4.5rem] sm:w-[4.5rem]"
      aria-hidden
    >
      <span className="scale-110">{getCategoryIcon(category)}</span>
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
  /** Unlocks "Book delivery boy" only after user taps Send order via WhatsApp (same session). */
  const [whatsappOpened, setWhatsappOpened] = useState(() => loadDraftForRestaurant(restaurant.id).whatsappOpened);

  useEffect(() => {
    if (cart.length === 0) setWhatsappOpened(false);
  }, [cart.length]);

  useEffect(() => {
    if (cart.length === 0 && !whatsappOpened) {
      clearFoodOrderCartDraft();
      return;
    }
    setFoodOrderCartDraft({
      restaurantId: restaurant.id,
      items: cart,
      whatsappOpened,
    });
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

  return (
    <main className="flex-1 min-h-screen bg-[var(--landing-bg)]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <Link
          href="/find-restaurant"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 mb-6 -mt-2"
          aria-label="Back to restaurants"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>

        <div
          className="rounded-2xl border overflow-hidden flex flex-col"
          style={{
            borderColor: 'var(--landing-primary)',
            borderWidth: '1px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            boxShadow: '0 4px 24px -4px rgba(44, 45, 91, 0.15)',
          }}
        >
          <div className="flex items-center gap-3 p-5 sm:p-6 border-b border-[var(--landing-primary)]/20 bg-gradient-to-r from-[var(--landing-bg)]/90 to-white">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[var(--landing-primary)]/15 text-[var(--landing-primary)] shrink-0">
              <FoodCurryBowl className="w-7 h-7" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{restaurant.name}</h1>
              <p className="text-sm text-gray-600 mt-0.5">Menu · Khatushyam Ji</p>
            </div>
          </div>

          <div className="p-5 sm:p-8 space-y-6">
            <div className="w-full space-y-5">
              {Object.entries(groupedMenu).map(([category, items]) => (
                <div
                  key={category}
                  className="rounded-xl border border-[var(--landing-primary)]/15 p-4 sm:p-5 bg-white/90"
                  style={{ boxShadow: '0 2px 12px -4px rgba(44, 45, 91, 0.08)' }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-10 h-10 rounded-xl flex items-center justify-center text-[var(--landing-primary)] bg-[var(--landing-primary)]/10">
                      {getCategoryIcon(category)}
                    </span>
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--landing-primary)]">{category}</h2>
                  </div>
                  <ul className="space-y-2.5">
                    {items.map((item) => {
                      const inCart = cart.find((c) => c.name === item.name);
                      return (
                        <li
                          key={item.name}
                          className="flex flex-wrap items-center gap-3 rounded-xl border border-[var(--landing-primary)]/10 bg-[var(--landing-bg)]/60 py-2.5 ps-2 pe-3 sm:gap-4 sm:px-4"
                        >
                          <MenuItemThumb item={item} category={category} />
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-col gap-0.5 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-2">
                              <span className="text-sm font-medium text-gray-900">{item.name}</span>
                              <span className="whitespace-nowrap text-sm font-semibold text-[var(--landing-primary)]">
                                {item.price}
                              </span>
                            </div>
                          </div>
                          <div className="flex shrink-0 items-center gap-1 sm:ms-auto">
                            {inCart ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => removeFromOrder(item.name)}
                                  className="w-8 h-8 rounded-lg bg-gray-200 text-gray-700 flex items-center justify-center text-lg font-medium hover:bg-gray-300 transition-colors"
                                  aria-label={`Remove one ${item.name}`}
                                >
                                  −
                                </button>
                                <span className="w-8 text-center text-sm font-semibold text-gray-900">{inCart.quantity}</span>
                                <button
                                  type="button"
                                  onClick={() => addToOrder(item.name, item.price)}
                                  className="w-8 h-8 rounded-lg bg-[var(--color-primary)] text-white flex items-center justify-center text-lg font-medium hover:opacity-90 transition-opacity"
                                  aria-label={`Add one ${item.name}`}
                                >
                                  +
                                </button>
                              </>
                            ) : (
                              <button
                                type="button"
                                onClick={() => addToOrder(item.name, item.price)}
                                className="rounded-lg bg-[var(--color-primary)] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 transition-opacity"
                              >
                                Add
                              </button>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>

            {/* Order summary & cumulative total */}
            {cart.length > 0 && (
              <div className="p-4 sm:p-5 rounded-xl border border-[var(--landing-primary)]/20 bg-white/90">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-4 text-[var(--landing-primary)]">
                  <IconCart className="w-5 h-5" />
                  Your order
                </h3>
                <ul className="space-y-2.5 mb-4">
                  {cart.map((item) => (
                    <li key={item.name} className="flex justify-between items-center text-sm">
                      <span className="text-gray-700">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="font-semibold text-[var(--landing-primary)]">
                        ₹{parsePrice(item.price) * item.quantity}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="flex justify-between items-center pt-3 border-t border-gray-200 text-base font-bold text-gray-900">
                  Total
                  <span className="text-lg text-[var(--landing-primary)]">₹{totalAmount}</span>
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
                    className="mt-4 w-full rounded-xl py-3.5 text-sm font-semibold text-white flex items-center justify-center gap-2 transition-opacity hover:opacity-90 bg-[var(--whatsapp-green)] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--whatsapp-green)]"
                  >
                    <IconWhatsApp className="w-5 h-5" />
                    Send order via WhatsApp
                  </a>
                )}
              </div>
            )}

            {cart.length > 0 && (
              <p className="text-xs sm:text-sm text-gray-600 bg-[var(--landing-primary)]/5 rounded-xl px-4 py-3 border border-[var(--landing-primary)]/10 leading-relaxed">
                <strong className="text-gray-800">Next:</strong> Tap <strong className="text-[var(--landing-primary)]">Send order via WhatsApp</strong> first (this unlocks delivery). Pay the restaurant, then use <strong className="text-[var(--landing-primary)]">Book delivery boy</strong>. You&apos;ll only add your drop address next.
              </p>
            )}

            <div className="p-4 sm:p-5 rounded-xl border border-[var(--landing-primary)]/20 bg-white/90">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2 text-[var(--landing-primary)]">
                <IconDelivery className="w-5 h-5" />
                Book delivery
              </h3>
              <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                Pickup is <strong className="text-gray-800">{restaurant.name}</strong>. After you&apos;ve paid the restaurant, we&apos;ll ask for <strong className="text-gray-800">your delivery address</strong> in the next step.
              </p>
              {cart.length === 0 && (
                <p className="text-xs text-gray-500 mb-3">Add items to your order to continue.</p>
              )}
              {cart.length > 0 && !whatsappOpened && (
                <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200/80 rounded-lg px-3 py-2 mb-3">
                  Tap <strong>Send order via WhatsApp</strong> above to unlock booking.
                </p>
              )}
              <button
                type="button"
                onClick={handleBookDeliveryClick}
                disabled={!canBookDelivery}
                aria-disabled={!canBookDelivery}
                className="w-full rounded-xl bg-[var(--color-primary)] py-3.5 text-sm font-semibold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 disabled:opacity-45 disabled:pointer-events-none disabled:cursor-not-allowed"
              >
                <IconDelivery className="w-5 h-5" />
                Book delivery boy
              </button>
            </div>
          </div>

          {/* Mandatory payment confirmation before book delivery */}
          {showPaymentConfirm && (
            <>
              <div
                className="fixed inset-0 bg-black/50 z-[100]"
                onClick={() => setShowPaymentConfirm(false)}
                aria-hidden
              />
              <div
                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-[calc(100%-2rem)] max-w-sm rounded-2xl bg-white p-5 shadow-xl border border-gray-200"
                role="dialog"
                aria-modal="true"
                aria-labelledby="payment-confirm-title"
                aria-describedby="payment-confirm-desc"
              >
                <h2 id="payment-confirm-title" className="text-lg font-bold text-gray-900 mb-1">
                  Confirm payment
                </h2>
                <p id="payment-confirm-desc" className="text-sm text-gray-600 mb-5">
                  Have you paid <strong>{restaurant.name}</strong> for your order? We&apos;ll then ask for your <strong>delivery address</strong> and complete the booking.
                </p>
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={handlePaymentConfirmed}
                    className="w-full rounded-xl bg-[var(--color-primary)] py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                  >
                    Yes, I&apos;ve paid — Book delivery
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPaymentConfirm(false)}
                    className="w-full rounded-xl border border-gray-300 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    No, not yet
                  </button>
                </div>
              </div>
            </>
          )}

          <div className="p-5 sm:p-6 border-t border-[var(--landing-primary)]/15 bg-[var(--landing-bg)]/50 space-y-3">
            {restaurant.phone && (
              <a
                href={`tel:${restaurant.phone.replace(/\s/g, '')}`}
                className="w-full rounded-xl bg-[var(--color-primary)] py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-primary)]"
              >
                <IconPhone className="w-4 h-4 opacity-90" />
                Call to order
              </a>
            )}
            <Link
              href="/find-restaurant"
              className="w-full rounded-xl border border-[var(--landing-primary)]/25 bg-white py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
            >
              All restaurants
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
