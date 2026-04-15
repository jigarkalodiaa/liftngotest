'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation, ChevronLeft, ShieldCheck, MapPin, Phone, Star, Check, Clock, Truck } from 'lucide-react';
import {
  useCoconutCartStore,
  coconutCartSubtotal,
} from '@/features/noida/coconut/coconutCartStore';
import { COCONUT_VENDOR } from '@/features/noida/coconut/products';
import { useRazorpay } from '@/lib/razorpay';
import { paymentResultFailureHref, paymentResultSuccessHref } from '@/lib/paymentResultUrl';
import { trackBookingCompleted, trackCheckoutStarted, trackFunnelStep } from '@/lib/analytics';
import { trackEvent } from '@/lib/posthogAnalytics';
import { getBookingUserType } from '@/lib/posthog/bookingUserType';

// CSS Styles
const checkoutStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
  
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-4px); }
  }
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.03); }
  }
  @keyframes shine {
    0% { left: -80%; }
    100% { left: 120%; }
  }
  @keyframes slidein {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes glow {
    0%, 100% { box-shadow: 0 0 0 0 rgba(255, 140, 0, 0.4); }
    50% { box-shadow: 0 0 12px 8px rgba(255, 140, 0, 0.15); }
  }
  @keyframes badgepop {
    from { transform: scale(0.85); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
  .checkout-float { animation: float 2.5s ease-in-out infinite; }
  .checkout-pulse { animation: pulse 2s ease-in-out infinite; }
  .checkout-slidein { animation: slidein 0.4s ease forwards; }
  .checkout-glow { animation: glow 2s ease-in-out infinite; }
  .checkout-badgepop { animation: badgepop 0.3s ease forwards; }
  .checkout-shine {
    position: relative;
    overflow: hidden;
  }
  .checkout-shine::after {
    content: '';
    position: absolute;
    top: 0;
    left: -80%;
    width: 60%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent);
    transform: skewX(-20deg);
    animation: shine 3s ease-in-out infinite;
    pointer-events: none;
  }
  .checkout-hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .checkout-hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
`;

type OrderState = { stage: 'checkout' } | { stage: 'placing' };
type RecentAddress = { flat: string; location: string };

const COCONUT_PHONE_COOKIE_KEY = 'liftngo_coconut_phone';
const COCONUT_RECENT_LOCATIONS_COOKIE_KEY = 'liftngo_coconut_recent_locations';

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const cookie = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`));
  if (!cookie) return null;
  return decodeURIComponent(cookie.slice(name.length + 1));
}

function setCookie(name: string, value: string, maxAgeSeconds: number): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=${encodeURIComponent(value)};path=/;max-age=${maxAgeSeconds};SameSite=Lax`;
}

function normalizeIndianPhone(input: string): string {
  const digits = input.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith('0')) return digits.slice(1);
  if (digits.length >= 10) return digits.slice(-10);
  return digits;
}

function maskPhone(phone: string): string {
  if (phone.length !== 10) return phone;
  return `${phone.slice(0, 2)}******${phone.slice(-2)}`;
}

function pickPhoneFromObject(obj: unknown): string | null {
  if (typeof obj === 'string') {
    const normalized = normalizeIndianPhone(obj);
    return /^[6-9]\d{9}$/.test(normalized) ? normalized : null;
  }
  if (Array.isArray(obj)) {
    for (const v of obj) {
      const p = pickPhoneFromObject(v);
      if (p) return p;
    }
    return null;
  }
  if (obj && typeof obj === 'object') {
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      const key = k.toLowerCase();
      if (key.includes('phone') || key.includes('mobile') || key.includes('contact')) {
        const p = pickPhoneFromObject(v);
        if (p) return p;
      }
      if (v && typeof v === 'object') {
        const nested = pickPhoneFromObject(v);
        if (nested) return nested;
      }
    }
  }
  return null;
}

function parseRecentAddressesCookie(raw: string | null): RecentAddress[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    const list = parsed
      .map((item) => {
        if (!item || typeof item !== 'object') return null;
        const o = item as Record<string, unknown>;
        const flat = typeof o.flat === 'string' ? o.flat.trim() : '';
        const location = typeof o.location === 'string' ? o.location.trim() : '';
        if (!flat) return null;
        return { flat, location };
      })
      .filter((v): v is RecentAddress => Boolean(v));
    const seen = new Set<string>();
    return list.filter((addr) => {
      const key = `${addr.flat.toLowerCase()}|${addr.location.toLowerCase()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  } catch {
    return [];
  }
}

function formatRecentAddress(addr: RecentAddress): string {
  return `${addr.flat}${addr.location ? `, ${addr.location}` : ''}`;
}

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

  const [flatAddress, setFlatAddress] = useState('');
  const [locationAddress, setLocationAddress] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [savedPhoneOption, setSavedPhoneOption] = useState<string | null>(null);
  const [recentAddresses, setRecentAddresses] = useState<RecentAddress[]>([]);
  const address = `${flatAddress}${locationAddress ? ', ' + locationAddress : ''}`;

  const validatePhone = (value: string) => {
    const digits = value.replace(/\D/g, '');
    
    // Only allow digits
    if (digits.length === 0) {
      setPhoneError('');
      return '';
    }
    
    // First digit must be 6-9 for Indian numbers
    if (digits.length >= 1 && !/^[6-9]/.test(digits)) {
      setPhoneError('Indian mobile numbers start with 6, 7, 8, or 9');
      return contactPhone; // Don't update
    }
    
    // Max 10 digits
    if (digits.length > 10) {
      return digits.slice(0, 10);
    }
    
    // Validate complete number
    if (digits.length === 10) {
      setPhoneError('');
    } else if (digits.length > 0) {
      setPhoneError(`Enter ${10 - digits.length} more digit${10 - digits.length > 1 ? 's' : ''}`);
    }
    
    return digits;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const validated = validatePhone(e.target.value);
    setContactPhone(validated);
  };

  const isPhoneValid = contactPhone.length === 10 && /^[6-9]\d{9}$/.test(contactPhone);
  const [order, setOrder] = useState<OrderState>({ stage: 'checkout' });
  const [payError, setPayError] = useState<string | null>(null);
  const [fetchingLocation, setFetchingLocation] = useState(false);
  // Calculate initial timer value with seconds
  const getTimerText = () => {
    const now = new Date();
    const end = new Date();
    end.setHours(23, 59, 59, 0);
    const diff = Math.max(0, Math.floor((end.getTime() - now.getTime()) / 1000));
    const h = Math.floor(diff / 3600);
    const m = Math.floor((diff % 3600) / 60);
    const s = diff % 60;
    return `${h}h ${m}m ${s}s`;
  };

  const [timerText, setTimerText] = useState(getTimerText);

  // Countdown timer - updates every second
  useEffect(() => {
    const updateTimer = () => {
      setTimerText(getTimerText());
    };
    
    // Update immediately on mount
    updateTimer();
    
    // Set interval to update every second
    const interval = setInterval(updateTimer, 1000);
    
    // Cleanup on unmount
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const cookiePhone = normalizeIndianPhone(getCookie(COCONUT_PHONE_COOKIE_KEY) ?? '');
    const genericCookiePhone =
      normalizeIndianPhone(getCookie('phone') ?? '') ||
      normalizeIndianPhone(getCookie('mobile') ?? '') ||
      normalizeIndianPhone(getCookie('contactPhone') ?? '');

    const localStoragePhoneCandidates = [
      localStorage.getItem('phone'),
      localStorage.getItem('mobile'),
      localStorage.getItem('contactPhone'),
      localStorage.getItem('liftngo_phone'),
    ]
      .filter(Boolean)
      .map((v) => normalizeIndianPhone(v ?? ''))
      .filter((v) => /^[6-9]\d{9}$/.test(v));

    let ooCaStoragePhone: string | null = null;
    try {
      const raw = localStorage.getItem('oocastorage');
      if (raw) {
        const parsed = JSON.parse(raw) as unknown;
        ooCaStoragePhone = pickPhoneFromObject(parsed);
      }
    } catch {
      ooCaStoragePhone = null;
    }

    const sessionPhone = normalizeIndianPhone(sessionStorage.getItem('phone') ?? '');
    const allCandidates = [cookiePhone, genericCookiePhone, sessionPhone, ooCaStoragePhone, ...localStoragePhoneCandidates].filter(
      (v): v is string => Boolean(v && /^[6-9]\d{9}$/.test(v)),
    );
    const bestPhone = allCandidates[0] ?? null;
    if (bestPhone) {
      setSavedPhoneOption(bestPhone);
      if (!contactPhone) setContactPhone(bestPhone);
    }

    const recent = parseRecentAddressesCookie(getCookie(COCONUT_RECENT_LOCATIONS_COOKIE_KEY));
    setRecentAddresses(recent.slice(0, 3));
  }, [mounted, contactPhone]);

  useEffect(() => {
    if (!mounted) return;
    if (!isPhoneValid) return;
    setCookie(COCONUT_PHONE_COOKIE_KEY, contactPhone, 60 * 60 * 24 * 90);
    try {
      localStorage.setItem('liftngo_phone', contactPhone);
    } catch {
      // ignore
    }
  }, [mounted, contactPhone, isPhoneValid]);

  const saveRecentAddress = useCallback((flatRaw: string, locationRaw: string) => {
    const flat = flatRaw.trim();
    const location = locationRaw.trim();
    if (flat.length < 5) return;

    const next: RecentAddress = { flat, location };
    setRecentAddresses((prev) => {
      const key = `${next.flat.toLowerCase()}|${next.location.toLowerCase()}`;
      const deduped = prev.filter((item) => `${item.flat.toLowerCase()}|${item.location.toLowerCase()}` !== key);
      const merged = [next, ...deduped].slice(0, 3);
      setCookie(COCONUT_RECENT_LOCATIONS_COOKIE_KEY, JSON.stringify(merged), 60 * 60 * 24 * 30);
      return merged;
    });
  }, []);

  // Original delivery price for savings calculation
  const originalDelivery = 29;

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setPayError('Geolocation not supported');
      return;
    }
    setFetchingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await response.json();
          if (data.display_name) {
            setLocationAddress(data.display_name);
          }
        } catch {
          setLocationAddress(`Lat: ${position.coords.latitude.toFixed(6)}, Lng: ${position.coords.longitude.toFixed(6)}`);
        }
        setFetchingLocation(false);
      },
      () => {
        setPayError('Unable to get location. Please enter manually.');
        setFetchingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

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

  // Calculate real savings
  // Pack of 4 at ₹299 vs 4 singles at ₹79 each = ₹316, so pack saves ₹17
  // Free delivery saves ₹29
  const packSavings = items.reduce((total, item) => {
    if (item.name.includes('×') || item.quantity >= 4) {
      return total + 17; // ₹17 saved per pack
    }
    return total;
  }, 0);
  const deliverySavings = delivery === 0 ? originalDelivery : 0;
  const savings = packSavings + deliverySavings;

  const placeOrder = useCallback(async () => {
    setPayError(null);
    saveRecentAddress(flatAddress, locationAddress);
    setOrder({ stage: 'placing' });
    trackCheckoutStarted('noida_coconut_razorpay', grand);

    openPayment({
      amountInr: grand,
      receipt: `coconut_${Date.now()}`,
      description: `Coconut order — ${items.length} item(s)`,
      notes: {
        flow: 'noida_coconut',
        address: address.slice(0, 250),
      },
      prefill: { contact: contactPhone ? `+91${contactPhone.replace(/\D/g, '')}` : undefined },
      onSuccess: ({ paymentId }) => {
        try {
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

          // Build order data for WhatsApp notification
          const orderData = {
            items: items.map((i) => ({ name: i.name, qty: i.quantity, price: i.price * i.quantity })),
            subtotal,
            delivery,
            platformFee: platformFee,
            handlingCharge: handlingCharge,
            total: grand,
            flat: flatAddress,
            area: locationAddress,
            phone: contactPhone,
            paymentId,
          };

          // Send WhatsApp notification to business
          const sendWhatsAppNotification = (data: typeof orderData) => {
            const msg = `
🥥 *NEW ORDER RECEIVED*
━━━━━━━━━━━━━━━━
📦 *Order Details*
${data.items.map(item => `• ${item.name} × ${item.qty} — ₹${item.price}`).join('\n')}

💰 *Bill Summary*
Subtotal: ₹${data.subtotal}
Delivery: ${data.delivery === 0 ? 'FREE' : '₹' + data.delivery}
Handling: ₹${data.handlingCharge}
Platform fee: ₹${data.platformFee}
*Total Paid: ₹${data.total}*

📍 *Delivery Address*
${data.flat}, ${data.area}

📞 *Customer Phone:* +91${data.phone}

💳 *Payment ID:* ${data.paymentId}
✅ *Status:* PAID via Razorpay

⏰ *Time:* ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
━━━━━━━━━━━━━━━━
🚚 Delivered by LiftNGo Logistics
            `.trim();

            const encoded = encodeURIComponent(msg);
            const waUrl = `https://wa.me/918588808581?text=${encoded}`;
            window.open(waUrl, '_blank');
          };

          sendWhatsAppNotification(orderData);

          // Clear cart
          clear();

          // Redirect to success page after small delay
          setTimeout(() => {
            router.replace(
              `/noida/coconut/order-success?paymentId=${paymentId}&total=${grand}&items=${items.length}&phone=${contactPhone}`
            );
          }, 500);

        } catch (err) {
          console.error('Post-payment error:', err);
          clear();
          router.replace(`/noida/coconut/order-success?paymentId=${paymentId}&total=${grand}&items=${items.length}&phone=${contactPhone}`);
        }
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
  }, [address, clear, contactPhone, delivery, flatAddress, grand, handlingCharge, items, locationAddress, openPayment, platformFee, router, saveRecentAddress, subtotal]);

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
  const itemCount = items.reduce((n, i) => n + i.quantity, 0);

  return (
    <div className="min-h-screen pb-[100px]" style={{ background: '#F0FAF4', fontFamily: 'Nunito, sans-serif' }}>
      <style>{checkoutStyles}</style>

      {/* HEADER - Liftngo Theme */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-4 py-3" style={{ background: '#2C2D5B' }}>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push('/noida/coconut')}
            className="flex h-8 w-8 items-center justify-center rounded-full"
            style={{ background: 'rgba(255,255,255,0.15)' }}
          >
            <ChevronLeft className="h-5 w-5 text-white" strokeWidth={2.5} />
          </button>
          <h1 className="text-base text-white" style={{ fontWeight: 900 }}>Checkout</h1>
        </div>
        <div className="flex items-center gap-1.5 rounded-[20px] px-3 py-1" style={{ background: 'rgba(255,255,255,0.12)' }}>
          <ShieldCheck className="h-3.5 w-3.5" style={{ color: '#A5B4FC' }} strokeWidth={2.5} />
          <span className="text-[11px]" style={{ color: '#A5B4FC', fontWeight: 700 }}>100% Secure</span>
        </div>
      </header>

      {/* OFFER BANNER */}
      <div className="flex items-center justify-between gap-2 px-4 py-2.5" style={{ background: '#10B981' }}>
        <span className="shrink-0 rounded-[20px] px-2.5 py-1 text-[10px]" style={{ background: '#fff', color: '#059669', fontWeight: 900 }}>
          FREE DELIVERY
        </span>
        <span className="flex-1 text-[12px]" style={{ color: '#fff', fontWeight: 700 }}>
          You unlocked free delivery! Save ₹29
        </span>
        <span id="checkoutTimer" className="shrink-0 rounded-[20px] border px-2 py-1 text-[10px]" style={{ background: 'rgba(255,255,255,0.2)', borderColor: 'rgba(255,255,255,0.3)', color: '#fff', fontWeight: 700 }}>
          {timerText}
        </span>
      </div>

      {/* SAVINGS STRIP */}
      <div className="checkout-hide-scrollbar flex gap-2 overflow-x-auto px-4 py-2.5" style={{ background: '#ECFDF5', borderBottom: '1px solid #C6E8D2' }}>
        {[
          { icon: <Star className="h-3 w-3" />, text: `You saved ₹${savings} today` },
          { icon: <Check className="h-3 w-3" />, text: 'Counter price ₹79' },
          { icon: <Truck className="h-3 w-3" />, text: 'Delivered by LiftNGo' },
          { icon: <Clock className="h-3 w-3" />, text: '15–25 min delivery' },
        ].map((pill, i) => (
          <span key={i} className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-[20px] border bg-white px-3 py-1.5 text-[11px]" style={{ borderColor: '#C6E8D2', color: '#1B6B3A', fontWeight: 700 }}>
            {pill.icon}
            {pill.text}
          </span>
        ))}
      </div>

      <div className="mx-auto max-w-xl sm:max-w-2xl">
        {/* ORDER SUMMARY SECTION */}
        <div className="checkout-slidein mx-3 mt-3 rounded-[18px] border bg-white" style={{ borderColor: '#E5F0EA', animationDelay: '0.05s' }}>
          {/* Section Header */}
          <div className="flex items-center justify-between border-b px-4 py-3" style={{ borderColor: '#F0FAF4' }}>
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: '#E8F5EC' }}>
                <svg className="h-4 w-4" style={{ color: '#1B6B3A' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              </div>
              <span className="text-[13px] tracking-wide" style={{ color: '#1B6B3A', fontWeight: 800, letterSpacing: '0.5px' }}>ORDER SUMMARY</span>
            </div>
            <span className="text-[12px]" style={{ color: '#6B7280' }}>{itemCount} items</span>
          </div>

          {/* Order Items */}
          {items.map((item, idx) => {
            const isPack = item.name.includes('×') || item.quantity >= 4;
            return (
              <div key={item.productId} className="flex gap-3 border-b px-4 py-3.5" style={{ borderColor: '#F7FDF9' }}>
                <div className="checkout-float flex h-14 w-14 shrink-0 items-center justify-center rounded-xl" style={{ background: '#E8F5EC' }}>
                  {isPack ? (
                    <div className="grid grid-cols-2 gap-0.5">
                      {[1, 2, 3, 4].map((i) => (
                        <img key={i} src="/images/coconut/nariyal-pani.png" alt="" className="h-6 w-6 object-contain" />
                      ))}
                    </div>
                  ) : (
                    <img src="/images/coconut/nariyal-pani.png" alt="" className="h-11 w-11 object-contain" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px]" style={{ color: '#1A1A1A', fontWeight: 800 }}>{item.name}</p>
                  <p className="text-[11px]" style={{ color: '#6B7280' }}>
                    {isPack ? '4 fresh green coconuts with straw' : 'Fresh green tender coconut with straw'}
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {isPack ? (
                      <>
                        <span className="checkout-badgepop rounded-[20px] px-2 py-0.5 text-[9.5px]" style={{ background: '#FEF3C7', color: '#92400E', fontWeight: 800 }}>Best value</span>
                        <span className="checkout-badgepop rounded-[20px] px-2 py-0.5 text-[9.5px]" style={{ background: '#D1FAE5', color: '#065F46', fontWeight: 800, animationDelay: '0.1s' }}>Free delivery</span>
                        <span className="checkout-badgepop rounded-[20px] px-2 py-0.5 text-[9.5px]" style={{ background: '#CCFBF1', color: '#0F766E', fontWeight: 800, animationDelay: '0.2s' }}>₹74.75/coconut</span>
                      </>
                    ) : (
                      <>
                        <span className="checkout-badgepop rounded-[20px] px-2 py-0.5 text-[9.5px]" style={{ background: '#D1FAE5', color: '#065F46', fontWeight: 800 }}>Popular</span>
                        <span className="checkout-badgepop rounded-[20px] px-2 py-0.5 text-[9.5px]" style={{ background: '#FEF3C7', color: '#92400E', fontWeight: 800, animationDelay: '0.1s' }}>Counter price</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-[18px]" style={{ color: '#1B6B3A', fontWeight: 900 }}>₹{item.price * item.quantity}</p>
                  {isPack && (
                    <>
                      <p className="text-[11px] line-through" style={{ color: '#9CA3AF' }}>₹316</p>
                      <p className="text-[11px]" style={{ color: '#059669', fontWeight: 700 }}>Save ₹17</p>
                    </>
                  )}
                </div>
              </div>
            );
          })}

          {/* LiftNGo Delivery Bar */}
          <div className="mx-4 my-3 flex items-center justify-between rounded-[12px] px-3.5 py-2.5" style={{ background: '#2C2D5B' }}>
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4" style={{ color: '#10B981' }} />
              <span className="text-[11.5px]" style={{ color: '#E0E7FF', fontWeight: 700 }}>Delivered by LiftNGo · GPS tracked</span>
            </div>
            <span className="rounded-[12px] px-2 py-0.5 text-[10px]" style={{ background: '#10B981', color: '#fff', fontWeight: 900 }}>FREE</span>
          </div>

          {/* Bill Details */}
          <div className="space-y-2 px-4 pb-4">
            <div className="flex justify-between text-[12px]" style={{ color: '#6B7280' }}>
              <span>Subtotal</span>
              <span style={{ color: '#1A1A1A' }}>₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-[12px]" style={{ color: '#6B7280' }}>
              <span>Delivery fee</span>
              <span className="flex items-center gap-1.5">
                <span className="line-through">₹{originalDelivery}</span>
                <span style={{ color: '#059669', fontWeight: 700 }}>FREE</span>
              </span>
            </div>
            <div className="flex justify-between text-[12px]" style={{ color: '#6B7280' }}>
              <span>Handling charge</span>
              <span style={{ color: '#1A1A1A' }}>₹{handlingCharge}</span>
            </div>
            <div className="flex justify-between text-[12px]" style={{ color: '#6B7280' }}>
              <span>Platform fee</span>
              <span style={{ color: '#1A1A1A' }}>₹{platformFee}</span>
            </div>
            <div className="flex justify-between text-[12px]" style={{ color: '#6B7280' }}>
              <span>Surge charge</span>
              <span style={{ color: '#1A1A1A' }}>₹0</span>
            </div>
            <div className="flex justify-between text-[12px]" style={{ color: '#059669', fontWeight: 700 }}>
              <span>You saved</span>
              <span>₹{savings} total</span>
            </div>
            <div className="border-t border-dashed pt-3" style={{ borderColor: '#D1FAE5' }}>
              <div className="flex items-center justify-between rounded-xl px-3.5 py-3" style={{ background: '#F0FDF4' }}>
                <div>
                  <p className="text-[13px]" style={{ color: '#1B6B3A', fontWeight: 800 }}>Total to Pay</p>
                  <p className="text-[11px]" style={{ color: '#3B8A5A' }}>incl. all taxes & fees</p>
                </div>
                <p className="text-[24px]" style={{ color: '#1B6B3A', fontWeight: 900 }}>₹{grand}</p>
              </div>
            </div>
            {savings > 0 && (
              <div className="flex items-center gap-2 rounded-[10px] px-3.5 py-2" style={{ background: '#D1FAE5' }}>
                <Star className="h-4 w-4 shrink-0" style={{ color: '#065F46' }} />
                <span className="text-[12px]" style={{ color: '#065F46', fontWeight: 800 }}>
                  You saved ₹{savings} {deliverySavings > 0 && packSavings > 0 ? '(pack + free delivery)' : deliverySavings > 0 ? '(free delivery)' : '(pack deal)'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* DELIVERY ADDRESS SECTION */}
        <div className="checkout-slidein mx-3 mt-3 rounded-[18px] border bg-white" style={{ borderColor: '#E5F0EA', animationDelay: '0.15s' }}>
          <div className="flex items-center justify-between border-b px-4 py-3" style={{ borderColor: '#F0FAF4' }}>
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: '#E8F5EC' }}>
                <MapPin className="h-4 w-4" style={{ color: '#1B6B3A' }} />
              </div>
              <span className="text-[13px] tracking-wide" style={{ color: '#1B6B3A', fontWeight: 800, letterSpacing: '0.5px' }}>DELIVERY ADDRESS</span>
            </div>
            <button
              type="button"
              onClick={getCurrentLocation}
              disabled={fetchingLocation}
              className="flex items-center gap-1 rounded-[20px] px-2.5 py-1 text-[11px]"
              style={{ background: '#E8F5EC', color: '#1B6B3A', fontWeight: 800 }}
            >
              <Navigation className="h-3 w-3" strokeWidth={2} />
              {fetchingLocation ? 'Getting...' : 'GPS'}
            </button>
          </div>
          <div className="space-y-3 px-4 py-3">
            {recentAddresses.length > 0 && (
              <div>
                <p className="text-[11px]" style={{ color: '#6B7280', fontWeight: 700 }}>Recent location</p>
                <div className="mt-2 space-y-2">
                  {recentAddresses.map((item) => (
                    <button
                      key={formatRecentAddress(item)}
                      type="button"
                      onClick={() => {
                        setFlatAddress(item.flat);
                        setLocationAddress(item.location);
                      }}
                      className="w-full rounded-[12px] border px-3 py-2.5 text-left transition-colors hover:bg-white"
                      style={{ borderColor: '#C6E8D2', background: '#F8FDF9', color: '#1B6B3A' }}
                    >
                      <div className="flex items-start gap-2">
                        <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: '#1B6B3A' }} />
                        <div className="min-w-0">
                          <p className="truncate text-[12px]" style={{ fontWeight: 800 }}>
                            {item.flat}
                          </p>
                          {item.location ? (
                            <p className="truncate text-[11px]" style={{ color: '#4B5563', fontWeight: 600 }}>
                              {item.location}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div>
              <label className="text-[13px]" style={{ color: '#1B6B3A', fontWeight: 800 }} htmlFor="co-flat">
                Flat / Building <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                id="co-flat"
                type="text"
                value={flatAddress}
                onChange={(e) => setFlatAddress(e.target.value)}
                placeholder="e.g. Flat 001, XYZ Building"
                className="mt-1.5 w-full rounded-xl border px-3.5 py-3 text-[14px] outline-none transition-colors focus:bg-white"
                style={{ background: '#F8FDF9', borderColor: '#C6E8D2', borderWidth: '1.5px' }}
              />
            </div>
            <div>
              <label className="text-[13px]" style={{ color: '#1B6B3A', fontWeight: 800 }} htmlFor="co-location">
                Area / Landmark
              </label>
              <input
                id="co-location"
                type="text"
                value={locationAddress}
                onChange={(e) => setLocationAddress(e.target.value)}
                placeholder="Sector, area, landmark"
                className="mt-1.5 w-full rounded-xl border px-3.5 py-3 text-[14px] outline-none transition-colors focus:bg-white"
                style={{ background: '#F8FDF9', borderColor: '#C6E8D2', borderWidth: '1.5px' }}
              />
              <button
                type="button"
                onClick={getCurrentLocation}
                disabled={fetchingLocation}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-[12px] border px-3 py-2.5 text-[12px] transition-colors disabled:opacity-50"
                style={{ background: '#EDF2FA', borderColor: '#C7D8F0', color: '#2C2D5B', fontWeight: 700 }}
              >
                <Navigation className="h-4 w-4" strokeWidth={2} />
                {fetchingLocation ? 'Getting location...' : 'Use Current Location'}
              </button>
            </div>
            {/* LiftNGo Live Track Bar - Light Blue */}
            <div className="flex items-center gap-2.5 rounded-[14px] border px-3.5 py-2.5" style={{ background: '#EDF2FA', borderColor: '#C7D8F0' }}>
              <span className="rounded-lg border bg-white px-2 py-1 text-[11px]" style={{ borderColor: '#C7D8F0', color: '#2C2D5B', fontWeight: 900 }}>LiftNGo</span>
              <span className="flex-1 text-[11.5px]" style={{ color: '#2C2D5B', fontWeight: 700 }}>GPS tracked from store to door</span>
              <span className="rounded-[20px] px-2.5 py-1 text-[9px]" style={{ background: '#2C2D5B', color: '#fff', fontWeight: 800 }}>Live track</span>
            </div>
          </div>
        </div>

        {/* CONTACT NUMBER SECTION */}
        <div className="checkout-slidein mx-3 mt-3 rounded-[18px] border bg-white" style={{ borderColor: '#E5F0EA', animationDelay: '0.22s' }}>
          <div className="flex items-center gap-2.5 border-b px-4 py-3" style={{ borderColor: '#F0FAF4' }}>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: '#E8F5EC' }}>
              <Phone className="h-4 w-4" style={{ color: '#1B6B3A' }} />
            </div>
            <span className="text-[13px] tracking-wide" style={{ color: '#1B6B3A', fontWeight: 800, letterSpacing: '0.5px' }}>CONTACT NUMBER</span>
          </div>
          <div className="px-4 py-3">
            {savedPhoneOption && contactPhone !== savedPhoneOption && (
              <button
                type="button"
                onClick={() => {
                  const next = validatePhone(savedPhoneOption);
                  setContactPhone(next);
                }}
                className="mb-2 w-full rounded-[10px] border px-3 py-2 text-left text-[12px] transition-colors hover:bg-white"
                style={{ borderColor: '#C6E8D2', background: '#F8FDF9', color: '#1B6B3A', fontWeight: 700 }}
              >
                Use my number: +91 {maskPhone(savedPhoneOption)}
              </button>
            )}
            <div className="flex items-center gap-2">
              <span className="text-[14px]" style={{ color: '#6B7280', fontWeight: 600 }}>+91</span>
              <input
                id="co-phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                maxLength={10}
                value={contactPhone}
                onChange={handlePhoneChange}
                placeholder="10-digit mobile"
                className="flex-1 rounded-xl border px-3.5 py-3 text-[14px] outline-none transition-colors focus:bg-white"
                style={{ background: '#F8FDF9', borderColor: phoneError ? '#FCA5A5' : '#C6E8D2', borderWidth: '1.5px' }}
              />
            </div>
            {phoneError && <p className="mt-1.5 text-[11px]" style={{ color: '#EF4444' }}>{phoneError}</p>}
            {isPhoneValid && <p className="mt-1.5 text-[11px]" style={{ color: '#059669', fontWeight: 600 }}>✓ Valid number</p>}
            <p className="mt-2 text-[11px]" style={{ color: '#6B7280', fontWeight: 600 }}>We&apos;ll send delivery updates on WhatsApp</p>
          </div>
        </div>

        {/* TRUST SECTION */}
        <div className="checkout-slidein mx-3 mt-3 mb-24 rounded-[18px] border bg-white" style={{ borderColor: '#E5F0EA', animationDelay: '0.28s' }}>
          {/* Trust Pills */}
          <div className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1 px-3 py-2.5">
            {[
              { icon: <ShieldCheck className="h-3 w-3" />, text: 'Secure payment' },
              { icon: <Check className="h-3 w-3" />, text: '100% fresh' },
              { icon: <Star className="h-3 w-3" />, text: '4.9★ rated' },
              { icon: <Clock className="h-3 w-3" />, text: '15–25 min' },
            ].map((item, i) => (
              <span key={i} className="flex items-center gap-1 text-[10px]" style={{ color: '#3B8A5A', fontWeight: 700 }}>
                <span style={{ color: '#1B6B3A' }}>{item.icon}</span>
                {item.text}
                {i < 3 && <span className="ml-0.5" style={{ color: '#C6E8D2' }}>·</span>}
              </span>
            ))}
          </div>
          {/* Razorpay Strip */}
          <div className="flex items-center justify-center gap-1.5 border-t px-3 py-2" style={{ borderColor: '#F0FAF4' }}>
            <svg className="h-3.5 w-3.5" style={{ color: '#6B7280' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2" strokeWidth="2"/><line x1="1" y1="10" x2="23" y2="10" strokeWidth="2"/></svg>
            <span className="text-[10px]" style={{ color: '#6B7280' }}>Secured by</span>
            <span className="rounded border px-1 py-0.5 text-[9px]" style={{ background: '#EFF6FF', color: '#3B82F6', borderColor: '#BFDBFE', fontWeight: 800 }}>Razorpay</span>
            <span className="text-[9px]" style={{ color: '#9CA3AF' }}>· UPI · Cards · NetBanking</span>
          </div>
        </div>

        {payError && (
          <div className="mx-3 mt-3 rounded-xl px-4 py-3 text-[12px]" style={{ background: '#FEF2F2', color: '#DC2626' }}>
            {payError}
          </div>
        )}
      </div>

      {/* PAY BUTTON */}
      <div className="fixed inset-x-0 bottom-0 z-30 px-3 pb-3 pt-1" style={{ background: 'linear-gradient(to top, #F0FAF4 90%, transparent)' }}>
        <div
          className="checkout-glow checkout-shine mx-auto max-w-xl rounded-2xl p-4 sm:max-w-2xl"
          style={{ background: '#2C2D5B' }}
        >
          <button
            type="button"
            disabled={order.stage === 'placing' || flatAddress.trim().length < 5 || !isPhoneValid}
            onClick={() => void placeOrder()}
            className="flex w-full items-center justify-between disabled:opacity-50"
          >
            <div className="text-left">
              <p className="text-[12px]" style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>{itemCount} items{savings > 0 ? ` · You save ₹${savings}` : ''}</p>
              <p className="text-[22px] text-white" style={{ fontWeight: 900 }}>₹{grand}</p>
            </div>
            <span
              className="checkout-pulse flex items-center gap-1 rounded-[12px] px-5 py-3 text-[15px]"
              style={{ background: '#fff', color: '#2C2D5B', fontWeight: 900 }}
            >
              {order.stage === 'placing' ? 'Opening…' : 'Pay Now →'}
            </span>
          </button>
        </div>
        <p className="mt-2 text-center text-[11px]" style={{ color: '#9CA3AF', fontWeight: 600 }}>
          Fresh from farm · Delivered by LiftNGo · Powered by Razorpay
        </p>
      </div>
    </div>
  );
}
