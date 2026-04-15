'use client';

import { useRouter } from 'next/navigation';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, MapPin, Clock, Leaf, ShieldCheck, Check, Truck, ThermometerSun } from 'lucide-react';
import { trackEvent as trackGaEvent, trackWhatsAppClick } from '@/lib/analytics';
import { trackEvent as trackPosthogEvent } from '@/lib/posthogAnalytics';
import { COCONUT_PRODUCTS, COCONUT_VENDOR } from '@/features/noida/coconut/products';
import CoconutProductCard from '@/features/noida/coconut/CoconutProductCard';
import CoconutCartBar from '@/features/noida/coconut/CoconutCartBar';
import { useCoconutCartStore } from '@/features/noida/coconut/coconutCartStore';

const OPEN_METEO =
  'https://api.open-meteo.com/v1/forecast?latitude=28.5355&longitude=77.3910&current_weather=true';

const HEALTH_PILLS = [
  '⚡ Natural electrolytes',
  '🫀 0 added sugar',
  '💧 95% water content',
  '🧴 Better than any energy drink',
  '🌿 100% natural — no preservatives',
] as const;

const MARQUEE_REVIEWS = [
  '⭐⭐⭐⭐⭐ "Bilkul fresh, counter jaisa!" — Rahul, Sec 53',
  '⭐⭐⭐⭐⭐ "Office mein sab ne order kiya" — Sneha, Sec 62',
  '⭐⭐⭐⭐⭐ "15 min mein aa gaya!" — Arjun, Sec 44',
  '⭐⭐⭐⭐⭐ "Price same as market, ghar pe delivery!" — Meera',
  '⭐⭐⭐⭐⭐ "Bachcho ko bahut pasand aaya 🥥" — Kavita, Sec 50',
] as const;

const TICKER_MESSAGES = [
  { text: '🟢 Amit from Sector 50 just ordered Nariyal Pani — 2 min ago', initials: 'A' },
  { text: '🟢 Office group in Sector 62 ordered ×4 pack — 5 min ago', initials: 'O' },
  { text: '🟢 Priya from Sector 44 just added to cart — just now', initials: 'P' },
  { text: '🟢 Delivery reaching Sector 53 in 8 min 🛵', initials: 'L' },
  { text: "🟢 Rohit, Sector 58 — 'Ekdum fresh tha!' ⭐⭐⭐⭐⭐", initials: 'R' },
] as const;

/** Common first-name initials (Noida / India) — shuffled on each visit for variety. */
const SOCIAL_INITIAL_POOL = [
  'A', 'R', 'P', 'S', 'K', 'M', 'N', 'V', 'D', 'H', 'J', 'T', 'Y', 'B', 'G', 'L', 'I', 'E', 'C', 'F',
] as const;

const SOCIAL_AVATAR_COUNT = 6;

/** Navy / teal brand palette (matches LiftNGo tokens). */
const BRAND_AVATAR_COLORS = [
  '#2C2D5B',
  '#0d9488',
  '#23243d',
  '#14b8a6',
  '#3730a3',
  '#115e59',
  '#312e81',
  '#047857',
] as const;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickSocialAvatars(): { initial: string; color: string }[] {
  const letters = shuffle([...SOCIAL_INITIAL_POOL]).slice(0, SOCIAL_AVATAR_COUNT);
  const colors = shuffle([...BRAND_AVATAR_COLORS]);
  return letters.map((initial, i) => ({
    initial,
    color: colors[i % colors.length],
  }));
}

const REFERRAL_LINK_DISPLAY = 'goliftngo.com/noida/coconut?ref=YOU';
const REFERRAL_LINK_FULL = `https://${REFERRAL_LINK_DISPLAY}`;
const REFERRAL_WA_SHARE =
  'https://wa.me/?text=Bhai%20try%20kar%20yeh%20%E2%80%94%20Noida%20mein%20fresh%20nariyal%20pani%20ghar%20pe%20deliver%20hota%20hai%20sirf%20%E2%82%B979%20mein!%20goliftngo.com%2Fnoida%2Fcoconut';
const SUBSCRIBE_WA =
  'https://wa.me/918580584898?text=Hi%2C%20I%20want%20to%20subscribe%20to%20daily%20coconut%20delivery%20in%20Noida.%20Please%20share%20best%20offers.';

const REFER_SESSION_KEY = 'liftngo_coconut_refer_trust_count';

const REFER_STEPS = [
  { n: 1 as const, icon: '\u{1F4E4}', label: 'Share your link with friends' },
  { n: 2 as const, icon: '\u{1F965}', label: 'They order their first nariyal' },
  { n: 3 as const, icon: '\u{1F381}', label: 'You get 1 FREE coconut credited' },
] as const;

const COCONUT_LEAF_WATERMARK = '\u{1F965}\u{1F33F}';

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clampInt(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function getPackDynamicsProfile(date = new Date()): {
  stockMin: number;
  stockMax: number;
  viewerMin: number;
  viewerMax: number;
} {
  const hour = date.getHours();
  if (hour >= 7 && hour < 11) return { stockMin: 11, stockMax: 19, viewerMin: 5, viewerMax: 12 };
  if (hour >= 11 && hour < 16) return { stockMin: 8, stockMax: 15, viewerMin: 6, viewerMax: 14 };
  if (hour >= 16 && hour < 22) return { stockMin: 6, stockMax: 13, viewerMin: 8, viewerMax: 18 };
  return { stockMin: 9, stockMax: 17, viewerMin: 3, viewerMax: 9 };
}

function nextPackStock(prev?: number): number {
  const { stockMin, stockMax } = getPackDynamicsProfile();
  if (prev == null) return randomInt(stockMin, stockMax);

  const roll = Math.random();
  const drift = roll < 0.58 ? -1 : roll < 0.82 ? 0 : roll < 0.96 ? -2 : 1;
  const candidate = clampInt(prev + drift, stockMin, stockMax);
  return candidate < stockMin ? stockMin : candidate;
}

function nextPackViewers(prev?: number): number {
  const { viewerMin, viewerMax } = getPackDynamicsProfile();
  if (prev == null) return randomInt(viewerMin, viewerMax);

  const targetMid = Math.round((viewerMin + viewerMax) / 2);
  const pull = prev < targetMid ? 1 : prev > targetMid ? -1 : 0;
  const noise = randomInt(-2, 2);
  return clampInt(prev + pull + noise, viewerMin, viewerMax);
}

function ReferEarnSection() {
  const rootRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [referTrustCount, setReferTrustCount] = useState<number | null>(null);

  useEffect(() => {
    try {
      const existing = sessionStorage.getItem(REFER_SESSION_KEY);
      if (existing != null) {
        const n = Number.parseInt(existing, 10);
        if (!Number.isNaN(n)) {
          setReferTrustCount(n);
          return;
        }
      }
      const n = 40 + Math.floor(Math.random() * 26);
      sessionStorage.setItem(REFER_SESSION_KEY, String(n));
      setReferTrustCount(n);
    } catch {
      setReferTrustCount(47);
    }
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) setInView(true);
      },
      { threshold: 0.12, rootMargin: '0px 0px -5% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const shareNative = useCallback(async () => {
    const shareData = {
      title: 'LiftNGo Nariyal',
      text: 'Bhai try kar — Noida mein fresh nariyal pani ghar pe deliver hota hai!',
      url: REFERRAL_LINK_FULL,
    };
    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share(shareData);
      }
    } catch {
      /* user cancelled or unsupported */
    }
  }, []);

  return (
    <section
      ref={rootRef}
      className="mx-3 mt-6 w-full max-w-full rounded-2xl border-t-[3px] border-[#4CAF50] px-5 py-6"
      style={{ background: 'linear-gradient(180deg, #F1F8E9 0%, #E8F5E9 100%)' }}
    >
      <div className={inView ? 'refer-section-animate' : 'pointer-events-none opacity-0'}>
        <div className="text-center">
          <p className="text-3xl leading-none" aria-hidden>
            {'\u{1F965}'}
          </p>
          <h2 className="mt-2 text-[20px] font-bold leading-tight" style={{ color: '#2E7D32' }}>
            Refer 3 Friends, Get 1 FREE Coconut
          </h2>
          <p className="mx-auto mt-2 max-w-md text-[12px] leading-relaxed sm:text-[13px]" style={{ color: '#555' }}>
            Share LiftNGo with friends in your society or office. When 3 of them order — your next nariyal is on us.
          </p>
          <p className="mt-1 text-[12px] font-semibold" style={{ color: '#6D4C41' }}>
            Apne dosto ko batao — sab hydrate rahen, saath mein!
          </p>
        </div>

        <div className="mt-5 flex flex-col items-center md:hidden">
          {REFER_STEPS.map((step, i) => (
            <div key={step.n} className="flex w-full max-w-[280px] flex-col items-center">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-black text-white"
                style={{ background: '#4CAF50' }}
              >
                {step.n}
              </div>
              <span className="mt-1 text-2xl" aria-hidden>
                {step.icon}
              </span>
              <p className="mt-1 text-center text-[12px] leading-snug" style={{ color: '#444' }}>
                {step.label}
              </p>
              {i < 2 ? (
                <span className="py-2 text-xl font-bold" style={{ color: '#4CAF50' }} aria-hidden>
                  {'\u2193'}
                </span>
              ) : null}
            </div>
          ))}
        </div>

        <div className="mt-6 hidden w-full items-start justify-center px-1 md:flex">
          {REFER_STEPS.map((step, i) => (
            <Fragment key={step.n}>
              <div className="flex w-[30%] max-w-[220px] min-w-0 flex-col items-center text-center">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-black text-white"
                  style={{ background: '#4CAF50' }}
                >
                  {step.n}
                </div>
                <span className="mt-1 text-2xl" aria-hidden>
                  {step.icon}
                </span>
                <p className="mt-1 text-[12px] leading-snug" style={{ color: '#444' }}>
                  {step.label}
                </p>
              </div>
              {i < 2 ? (
                <div className="mx-1 flex min-w-[32px] flex-1 items-center self-start pt-4" aria-hidden>
                  <div className="h-0 w-full border-t-2 border-dashed border-[#4CAF50]" />
                </div>
              ) : null}
            </Fragment>
          ))}
        </div>

        <div className="mt-6 rounded-xl border bg-white/90 p-3 shadow-sm" style={{ borderColor: '#C8E6C9' }}>
          <p className="text-[11px] font-bold uppercase tracking-wide" style={{ color: '#888' }}>
            YOUR REFERRAL LINK
          </p>
          <div className="mt-2">
            {/* <input
              readOnly
              value={REFERRAL_LINK_DISPLAY}
              className="min-h-[48px] w-full rounded-[10px] border bg-[#FAFAFA] px-3 text-[12px] font-semibold outline-none ring-[#4CAF50] focus:ring-2"
              style={{ borderColor: '#E0E0E0', color: '#333' }}
              aria-label="Your referral link"
            /> */}
          </div>

          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <a
              href={REFERRAL_WA_SHARE}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[48px] flex-1 items-center justify-center rounded-[10px] text-[13px] font-extrabold text-white"
              style={{ background: '#25D366' }}
            >
              Share on WhatsApp
            </a>
            <button
              type="button"
              onClick={shareNative}
              className="min-h-[48px] flex-1 rounded-[10px] bg-gray-100 text-[13px] font-extrabold text-gray-800"
            >
              More options
            </button>
          </div>
        </div>

        <p className="mt-4 text-center text-[13px] italic leading-relaxed" style={{ color: '#666' }}>
          <span aria-hidden>{'\u{1F3AF}'}</span>{' '}
          {referTrustCount != null ? (
            <>{referTrustCount} people have already referred friends this week</>
          ) : (
            <>Loading…</>
          )}
        </p>
      </div>
    </section>
  );
}

function CoconutSubscriptionSection() {
  const rootRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) setInView(true);
      },
      { threshold: 0.1, rootMargin: '0px 0px -5% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const benefits = [
    'Lowest price — locked in forever',
    'Skip or pause anytime — no lock-in',
    'Priority delivery — you come first',
    'Free home delivery every day',
    'Dedicated delivery slot — morning/evening',
    'Monthly GST invoice for office orders',
  ] as const;

  return (
    <section
      ref={rootRef}
      className="relative mx-3 mt-4 w-full max-w-full overflow-hidden rounded-2xl px-4 py-6 text-white sm:px-5 sm:py-7"
      style={{ background: '#1B5E20' }}
    >
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl text-left opacity-[0.05] select-none"
        aria-hidden
        style={{
          fontSize: '64px',
          lineHeight: 1.1,
          wordBreak: 'break-all',
          color: '#fff',
        }}
      >
        {COCONUT_LEAF_WATERMARK.repeat(48)}
      </div>

      <div
        className={`relative z-[1] ${inView ? 'subscription-section-animate' : 'opacity-0'}`}
        style={inView ? undefined : { pointerEvents: 'none' }}
      >
        <div className="text-center">
          <span
            className="inline-block rounded-[20px] px-3 py-1 text-[11px] font-extrabold"
            style={{ background: '#FFD700', color: '#1B5E20' }}
          >
            {'\u{1F4B0}'} BEST SAVINGS
          </span>
          <p className="mt-3 text-[14px] font-extrabold leading-snug text-[#C8E6C9]">
            Daily Fresh. Never Run Out. Save Big. {'\u{1F33F}'}
          </p>
          <h2 className="mt-2 text-[20px] font-bold leading-tight sm:text-[22px]">Subscribe &amp; Save Every Day</h2>
          <p className="mx-auto mt-2 max-w-md text-[12px] leading-relaxed sm:text-[13px]" style={{ color: '#A5D6A7' }}>
            Daily fresh nariyal delivered to your door. No calls. No waiting. Just pure hydration — every day.
          </p>
        </div>

        <ul className="relative z-[1] mt-5 grid grid-cols-1 gap-2 border-t border-white/15 pt-4 sm:grid-cols-2 sm:gap-x-4">
          {benefits.map((line) => (
            <li
              key={line}
              className="flex gap-2 border-b border-white/10 pb-2 text-[13px] leading-snug sm:border-0 sm:pb-0"
            >
              <span className="shrink-0 font-bold" style={{ color: '#4CAF50' }}>
                {'\u2705'}
              </span>
              <span>{line}</span>
            </li>
          ))}
        </ul>

        <div className="relative z-[1] mt-5">
          <p className="mb-2 text-center text-[11px] font-bold uppercase tracking-wide opacity-80 md:hidden">
            Swipe for plans →
          </p>
          <div
            className="hide-scrollbar -mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 pl-1 pr-4 pt-1 md:mx-0 md:grid md:grid-cols-3 md:gap-3 md:overflow-visible md:px-0"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            <div
              className="min-w-[156px] shrink-0 snap-start rounded-xl bg-white px-3 py-4 text-center shadow-md md:min-w-0"
              style={{ color: '#2E7D32' }}
            >
              <p className="text-[14px] font-bold">Daily</p>
              <p className="mt-0.5 text-[12px]" style={{ color: '#666' }}>
                1 coconut / day
              </p>
              <p className="mt-2 text-[22px] font-black" style={{ color: '#2E7D32' }}>
                ₹69/day
              </p>
              <p className="mt-1 text-[11px] font-bold" style={{ color: '#4CAF50' }}>
                Save ₹10 vs counter
              </p>
              <p className="mt-2 text-[11px] font-extrabold" style={{ color: '#E65100' }}>
                Most Popular {'\u{1F525}'}
              </p>
            </div>
            <div
              className="min-w-[156px] shrink-0 snap-start rounded-xl bg-white px-3 py-4 text-center shadow-md ring-2 ring-[#FFD700] md:min-w-0"
              style={{ color: '#2E7D32' }}
            >
              <p className="text-[14px] font-bold">Family Pack</p>
              <p className="mt-0.5 text-[12px]" style={{ color: '#666' }}>
                4 coconuts / day
              </p>
              <p className="mt-2 text-[22px] font-black" style={{ color: '#2E7D32' }}>
                ₹249/day
              </p>
              <p className="mt-1 text-[11px] font-bold" style={{ color: '#4CAF50' }}>
                Save ₹67 vs buying single
              </p>
              <p className="mt-2 text-[11px] font-extrabold" style={{ color: '#B8860B' }}>
                {'\u2B50'} Best Value
              </p>
            </div>
            <div
              className="min-w-[156px] shrink-0 snap-start rounded-xl bg-white px-3 py-4 text-center shadow-md md:min-w-0"
              style={{ color: '#2E7D32' }}
            >
              <p className="text-[14px] font-bold">Office Pack</p>
              <p className="mt-0.5 text-[12px]" style={{ color: '#666' }}>
                10 coconuts / day
              </p>
              <p className="mt-2 text-[22px] font-black" style={{ color: '#2E7D32' }}>
                Call us
              </p>
              <p className="mt-1 text-[11px] font-bold" style={{ color: '#4CAF50' }}>
                Custom pricing for bulk
              </p>
              <p className="mt-2 text-[11px] font-extrabold" style={{ color: '#37474F' }}>
                {'\u{1F3E2}'} For Teams
              </p>
            </div>
          </div>
        </div>

        <a
          href="tel:8580584898"
          className="subscribe-cta-pulse relative z-[1] mt-5 flex min-h-[48px] w-full items-center justify-center rounded-xl text-[16px] font-extrabold no-underline"
          style={{ background: '#FFD700', color: '#1B5E20', padding: '16px' }}
        >
          {'\u{1F4DE}'} Call to Subscribe — 8580584898
        </a>
        <p className="relative z-[1] mt-2 text-center text-[12px]" style={{ color: '#A5D6A7' }}>
          Or WhatsApp us for best offers &amp; custom plans
        </p>
        <a
          href={SUBSCRIBE_WA}
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-[1] mt-2.5 flex min-h-[48px] w-full items-center justify-center rounded-xl border-2 bg-transparent text-[13px] font-extrabold text-white no-underline"
          style={{ borderColor: '#fff' }}
        >
          {'\u{1F4AC}'} WhatsApp for Subscription Plans
        </a>

        <p className="relative z-[1] mt-4 text-center text-[12px] font-semibold italic" style={{ color: '#FFD700' }}>
          {'\u26A1'} Limited slots available for daily subscription in Sector 53
        </p>

        <p
          className="relative z-[1] mt-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-[12px]"
          style={{ color: '#A5D6A7' }}
        >
          <span>{'\u{1F512}'} No lock-in</span>
          <span className="hidden sm:inline">·</span>
          <span>{'\u23F8\uFE0F'} Pause anytime</span>
          <span className="hidden sm:inline">·</span>
          <span>{'\u{1F4E6}'} Free delivery</span>
          <span className="hidden sm:inline">·</span>
          <span>{'\u{1F9FE}'} GST invoice</span>
        </p>
      </div>
    </section>
  );
}

function timeOfDayMessage(): string {
  const h = new Date().getHours();
  if (h >= 6 && h < 11) return 'Start your day right 🌅 — Natural hydration before the heat hits';
  if (h >= 11 && h < 16) return 'Peak heat hours ☀️ — Your body is losing electrolytes right now';
  if (h >= 16 && h < 20) return 'Post-work recovery 🧘 — Rehydrate naturally after a long day';
  return 'Late night craving? 🌙 — Light, natural, guilt-free';
}

const menuStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-4px); }
  }
  @keyframes slidein {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes livePulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  @keyframes thermoPulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.08); opacity: 0.92; }
  }
  @keyframes heatShimmer {
    0% { background-position: 0% 50%; }
    100% { background-position: 100% 50%; }
  }
  @keyframes heatWave {
    0%, 100% { transform: translateY(0) scaleY(1); opacity: 0.06; }
    50% { transform: translateY(-3px) scaleY(1.02); opacity: 0.12; }
  }
  @keyframes marqueeCoconut {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes tickerSlideIn {
    from { opacity: 0; transform: translate(-12px, 12px); }
    to { opacity: 1; transform: translate(0, 0); }
  }
  .menu-slidein { animation: slidein 0.4s ease forwards; }
  .menu-float { animation: float 2.5s ease-in-out infinite; }
  .live-dot { animation: livePulse 1.5s ease-in-out infinite; }
  .thermo-pulse { animation: thermoPulse 2.2s ease-in-out infinite; }
  .hero-heat-bg {
    position: relative;
    overflow: hidden;
    background: linear-gradient(180deg, #FFF3E0 0%, #FFE0B2 100%);
  }
  .hero-heat-bg::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      110deg,
      transparent 0%,
      rgba(255, 255, 255, 0.35) 45%,
      transparent 55%
    );
    background-size: 220% 100%;
    animation: heatShimmer 7s ease-in-out infinite;
    pointer-events: none;
  }
  .hero-heat-bg::after {
    content: '';
    position: absolute;
    left: 0; right: 0; bottom: 0; height: 42%;
    background: repeating-linear-gradient(
      90deg,
      transparent,
      transparent 12px,
      rgba(44, 45, 91, 0.06) 12px,
      rgba(44, 45, 91, 0.06) 14px
    );
    animation: heatWave 5s ease-in-out infinite;
    pointer-events: none;
  }
  .marquee-track {
    display: flex;
    width: max-content;
    animation: marqueeCoconut 38s linear infinite;
  }
  .marquee-inner {
    display: flex;
    gap: 3rem;
    padding-right: 3rem;
  }
  .ticker-card {
    animation: tickerSlideIn 0.45s ease-out forwards;
  }
  @keyframes referSectionFade {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes subscriptionSectionUp {
    from { opacity: 0; transform: translateY(28px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes subscribeCtaPulse {
    0%, 100% { transform: scale(1); }
    8%, 16% { transform: scale(1.02); }
    24% { transform: scale(1); }
  }
  .refer-section-animate {
    animation: referSectionFade 0.65s ease-out forwards;
  }
  .subscription-section-animate {
    animation: subscriptionSectionUp 0.7s ease-out forwards;
  }
  .subscribe-cta-pulse {
    animation: subscribeCtaPulse 3s ease-in-out infinite;
  }
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
`;

export default function CoconutMenuPage() {
  const router = useRouter();
  const cartItems = useCoconutCartStore((s) => s.items);
  const cartCount = cartItems.reduce((n, i) => n + i.quantity, 0);

  const [tempC, setTempC] = useState<number | null>(null);
  const [tempBannerExtra, setTempBannerExtra] = useState<string | null>(null);
  const [peopleOrdered, setPeopleOrdered] = useState(47);
  const [lastOrderMins, setLastOrderMins] = useState(3);
  const [packStock, setPackStock] = useState(8);
  const [packViewers, setPackViewers] = useState(3);
  const [tickerPayload, setTickerPayload] = useState<{ text: string; initials: string } | null>(null);
  const [wellnessLine, setWellnessLine] = useState(() => timeOfDayMessage());
  const [socialAvatars, setSocialAvatars] = useState<{ initial: string; color: string }[]>([]);

  const promoEndTimeRef = useRef(Date.now() + 60 * 60 * 1000);
  const [timerText, setTimerText] = useState('');
  const tickerTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const singles = COCONUT_PRODUCTS.filter((p) => !p.combo);
  const combos = COCONUT_PRODUCTS.filter((p) => p.combo);

  const scrollToProducts = useCallback(() => {
    document.getElementById('coconut-products')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(OPEN_METEO);
        if (!res.ok) throw new Error('weather');
        const data = (await res.json()) as { current_weather?: { temperature?: number } };
        const t = data.current_weather?.temperature;
        if (cancelled || typeof t !== 'number' || Number.isNaN(t)) throw new Error('bad temp');
        setTempC(Math.round(t));
        if (t > 38) setTempBannerExtra(' Extreme heat alert — Doctors recommend 3L+ water today');
        else if (t > 35) setTempBannerExtra('☀️ It\'s very hot in Noida today — Perfect time for nariyal pani');
        else setTempBannerExtra(null);
      } catch {
        if (!cancelled) {
          setTempC(null);
          setTempBannerExtra(null);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setLastOrderMins(Math.floor(Math.random() * 7) + 2);
    setPeopleOrdered(Math.floor(Math.random() * 13) + 40);
    setSocialAvatars(pickSocialAvatars());
  }, []);

  /** Social counter: bump totals once per hour while the tab is open. */
  useEffect(() => {
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout>;
    const HOUR_MS = 60 * 60 * 1000;
    const scheduleHourlyBump = () => {
      timeoutId = setTimeout(() => {
        if (cancelled) return;
        setPeopleOrdered((p) => p + Math.floor(Math.random() * 5) + 2);
        scheduleHourlyBump();
      }, HOUR_MS);
    };
    scheduleHourlyBump();
    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    const tick = setInterval(() => {
      setLastOrderMins((m) => m + 1);
    }, 60000);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    const schedule = () => {
      const wait = Math.floor(Math.random() * 180000) + 240000;
      timeoutId = setTimeout(() => {
        setLastOrderMins(Math.floor(Math.random() * 3) + 1);
        schedule();
      }, wait);
    };
    schedule();
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    let cancelled = false;
    let stockT: ReturnType<typeof setTimeout>;
    let viewT: ReturnType<typeof setTimeout>;
    const scheduleStock = () => {
      stockT = setTimeout(() => {
        if (cancelled) return;
        setPackStock((prev) => nextPackStock(prev));
        scheduleStock();
      }, Math.floor(Math.random() * 35000) + 40000);
    };
    const scheduleViewers = () => {
      viewT = setTimeout(() => {
        if (cancelled) return;
        setPackViewers((prev) => nextPackViewers(prev));
        scheduleViewers();
      }, Math.floor(Math.random() * 12000) + 18000);
    };
    setPackStock(nextPackStock());
    setPackViewers(nextPackViewers());
    scheduleStock();
    scheduleViewers();
    return () => {
      cancelled = true;
      clearTimeout(stockT);
      clearTimeout(viewT);
    };
  }, []);

  useEffect(() => {
    const id = setInterval(() => setWellnessLine(timeOfDayMessage()), 60000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const clearAll = () => {
      tickerTimeoutsRef.current.forEach(clearTimeout);
      tickerTimeoutsRef.current = [];
    };

    let msgIndex = 0;
    const runCycle = (isFirst: boolean) => {
      const delayBeforeShow = isFirst ? 3000 : 30000 + Math.random() * 15000;
      const t1 = setTimeout(() => {
        const entry = TICKER_MESSAGES[msgIndex];
        msgIndex = (msgIndex + 1) % TICKER_MESSAGES.length;
        setTickerPayload({ text: entry.text, initials: entry.initials });
        const t2 = setTimeout(() => {
          setTickerPayload(null);
          const t3 = setTimeout(() => runCycle(false), 0);
          tickerTimeoutsRef.current.push(t3);
        }, 4000);
        tickerTimeoutsRef.current.push(t2);
      }, delayBeforeShow);
      tickerTimeoutsRef.current.push(t1);
    };

    runCycle(true);
    return () => clearAll();
  }, []);

  useEffect(() => {
    const updateTimer = () => {
      const diff = Math.max(0, Math.floor((promoEndTimeRef.current - Date.now()) / 1000));
      const h = Math.floor(diff / 3600);
      const m = Math.floor((diff % 3600) / 60);
      const s = diff % 60;
      setTimerText(`${h}h ${m}m ${s}s`);
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    trackGaEvent('funnel_step', { flow: 'noida_coconut', step: 'menu_view' });
    trackPosthogEvent('funnel_step', { flow: 'noida_coconut', step: 'menu_view' });
  }, []);

  const heroHeadline =
    tempC != null
      ? `It's ${tempC}°C in Noida. Your body needs this.`
      : "It's hot in Noida today. Your body needs this.";

  const tempLine =
    tempC != null
      ? `Noida is ${tempC}°C right now — Stay hydrated`
      : "It's hot in Noida today — Stay hydrated";

  const moreLastHour = Math.max(peopleOrdered - SOCIAL_AVATAR_COUNT, 0);

  return (
    <div
      className={cartCount === 0 ? 'min-h-screen pb-44' : 'min-h-screen pb-36'}
      style={{ background: '#FFFDE7', fontFamily: 'Nunito, sans-serif' }}
    >
      <style>{menuStyles}</style>

      {/* TRIGGER 1 — Live temperature (first paint, above header) */}
      <div
        className="relative z-[45] px-3 py-2.5 text-center text-[12px] font-bold leading-snug text-white shadow-sm"
        style={{
          background: 'linear-gradient(90deg, var(--color-primary) 0%, #0d9488 100%)',
        }}
      >
        <span className="thermo-pulse inline-flex items-center justify-center align-middle" aria-hidden>
          <ThermometerSun className="mx-0.5 inline h-4 w-4 shrink-0 text-white" strokeWidth={2.4} />
        </span>
        <span> {tempLine}</span>
        {tempBannerExtra ? (
          <div className="mt-1 text-[11px] font-extrabold leading-snug opacity-95">{tempBannerExtra}</div>
        ) : null}
      </div>

      <header className="sticky top-0 z-40 flex items-center justify-between px-4 py-3" style={{ background: '#2C2D5B' }}>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              trackGaEvent('cta_click', { cta_name: 'coconut_back', source: 'noida_coconut_menu' });
              trackPosthogEvent('coconut_back_clicked', { source: 'noida_coconut_menu' });
              router.push('/dashboard');
            }}
            className="flex h-8 w-8 items-center justify-center rounded-full"
            style={{ background: 'rgba(255,255,255,0.15)' }}
          >
            <ChevronLeft className="h-5 w-5 text-white" strokeWidth={2.5} />
          </button>
          <h1
            className="text-base text-white sm:text-lg"
            style={{ fontFamily: 'Inter, Segoe UI, Roboto, Arial, sans-serif', fontWeight: 700, letterSpacing: '-0.01em' }}
          >
            {COCONUT_VENDOR.name}
          </h1>
        </div>
        <div className="flex items-center gap-1.5 rounded-[12px] border px-3 py-1" style={{ background: '#ECFDF5', borderColor: '#86EFAC' }}>
          <ShieldCheck className="h-3.5 w-3.5" style={{ color: '#15803D' }} strokeWidth={2.5} />
          <span className="text-[11px]" style={{ color: '#15803D', fontWeight: 700 }}>
            Verified Vendor
          </span>
        </div>
      </header>

      <div className="flex items-center justify-between gap-2 px-4 py-2.5" style={{ background: '#10B981' }}>
        <span className="shrink-0 rounded-[12px] px-2.5 py-1 text-[10px]" style={{ background: '#fff', color: '#059669', fontWeight: 900 }}>
          LOWEST PRICE
        </span>
        <span className="flex-1 text-[12px]" style={{ color: '#fff', fontWeight: 700 }}>
          ₹79 only · Zero markup
        </span>
        <span
          className="shrink-0 rounded-[12px] border px-2 py-1 text-[10px]"
          style={{
            background: 'rgba(255,255,255,0.2)',
            borderColor: 'rgba(255,255,255,0.3)',
            color: '#fff',
            fontWeight: 700,
          }}
        >
          {timerText}
        </span>
      </div>

      <div
        className="grid grid-cols-4 gap-1.5 px-3 py-2 sm:gap-2 sm:px-4 sm:py-2.5"
        style={{ background: '#ECFDF5', borderBottom: '1px solid #C6E8D2' }}
      >
        {[
          { icon: <Leaf className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" />, text: '100% Fresh' },
          { icon: <Check className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" />, text: 'Counter price' },
          { icon: <Truck className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" />, text: 'Free delivery' },
          { icon: <Clock className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" />, text: '15–25 min' },
        ].map((pill, i) => (
          <span
            key={i}
            className="flex min-w-0 flex-col items-center justify-center gap-0.5 rounded-[10px] border bg-white px-1 py-1.5 text-center sm:flex-row sm:gap-1.5 sm:rounded-[12px] sm:px-2.5 sm:py-1.5"
            style={{ borderColor: '#C6E8D2', color: '#1B6B3A', fontWeight: 700 }}
          >
            {pill.icon}
            <span className="text-[9px] leading-tight sm:text-[11px]">{pill.text}</span>
          </span>
        ))}
      </div>

      <div className="mx-auto max-w-xl sm:max-w-2xl">
        <div
          className="menu-slidein hero-heat-bg relative z-0 mx-3 mt-2 rounded-2xl border p-3 sm:mt-3 sm:p-4"
          style={{ borderColor: '#F5D4A8', animationDelay: '0.05s' }}
        >
          <div className="relative z-[1] mb-1.5 flex flex-wrap items-center gap-1.5 sm:mb-2 sm:gap-2">
            <div
              className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.04em]"
              style={{ borderColor: '#B7E4CF', color: '#166534', fontWeight: 800, background: 'rgba(255,255,255,0.75)' }}
            >
              <Leaf className="h-3 w-3" strokeWidth={2.2} />
              Summer hydration
            </div>
            <span
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-extrabold text-white shadow-sm"
              style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
            >
              📍 Sector 53&apos;s #1 ordered item this week
            </span>
          </div>
          <h2 className="relative z-[1] text-base leading-tight text-gray-900 sm:text-lg" style={{ fontWeight: 900 }}>
            {heroHeadline}
          </h2>
          <p className="relative z-[1] mt-0.5 text-xs leading-snug text-gray-700 sm:mt-1 sm:text-sm" style={{ fontWeight: 700 }}>
            Natural electrolytes. Instant cooling. Delivered in 15 min.
          </p>
          <p className="relative z-[1] mt-0.5 text-[11px] leading-snug text-gray-600 sm:mt-1 sm:text-xs">
            No hidden charges — what you see is what you pay.
          </p>
        </div>

        <div className="menu-slidein mx-3 mt-2 flex items-center gap-2 rounded-[12px] border bg-white p-2.5 sm:mt-3 sm:gap-3 sm:p-3"
          style={{ borderColor: '#E5F0EA', animationDelay: '0.1s' }}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] sm:h-11 sm:w-11" style={{ background: '#E8F5EC' }}>
            <MapPin className="h-5 w-5" style={{ color: '#1B6B3A' }} strokeWidth={2} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm" style={{ color: '#1A1A1A', fontWeight: 800 }}>
              {COCONUT_VENDOR.area}
            </p>
            <p className="truncate text-[11px]" style={{ color: '#6B7280' }}>
              {COCONUT_VENDOR.pickupAddress}
            </p>
            <div className="mt-1 flex items-center gap-1">
              <Truck className="h-3 w-3" style={{ color: '#1B6B3A' }} />
              <span className="text-[10px]" style={{ color: '#1B6B3A', fontWeight: 700 }}>
                Delivered by LiftNGo
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 rounded-[12px] px-2.5 py-1.5" style={{ background: '#D1FAE5' }}>
            <Clock className="h-3.5 w-3.5" style={{ color: '#065F46' }} strokeWidth={2} />
            <span className="text-[11px]" style={{ color: '#065F46', fontWeight: 800 }}>
              {COCONUT_VENDOR.estimatedMinutes} min
            </span>
          </div>
        </div>

        <div id="coconut-products" className="mx-3 mt-2 space-y-2 scroll-mt-24 sm:mt-3 sm:scroll-mt-28 sm:space-y-3">
          <div className="space-y-2 sm:space-y-3">
            {singles.map((p) => (
              <CoconutProductCard key={p.id} product={p} isFeatured />
            ))}
            {combos.map((p) => (
              <CoconutProductCard key={p.id} product={p} isPack packStockLeft={packStock} packViewers={packViewers} />
            ))}
          </div>
        </div>

        <a
          href="https://chat.whatsapp.com/L2L11ZBkjIWGcA6M3kdQ2B"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackWhatsAppClick('noida_coconut_menu')}
          className="menu-slidein mx-3 mt-4 flex items-center justify-center gap-2 rounded-[12px] border p-3 transition-colors hover:bg-white"
          style={{ background: '#ECFDF5', borderColor: '#C6E8D2', animationDelay: '0.35s' }}
        >
          <svg className="h-5 w-5" style={{ color: '#1B6B3A' }} viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          <span className="text-[12px]" style={{ color: '#1B6B3A', fontWeight: 800 }}>
            Need help? Chat with us on WhatsApp
          </span>
        </a>

        {/* Health + reviews + ORS tip — below menu so both Add buttons land above the fold on mobile */}
        <div className="menu-slidein mx-3 mt-5" style={{ animationDelay: '0.12s' }}>
          <p className="mb-2.5 text-center text-[11px] font-extrabold uppercase tracking-wide sm:mb-3 sm:text-[12px]" style={{ color: '#2E7D32' }}>
            Why your body loves this
          </p>
          <div
            className="hide-scrollbar -mx-1 overflow-x-auto pb-2"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            <div className="flex w-max min-w-full gap-2.5 px-1.5">
              {HEALTH_PILLS.map((label) => (
                <span
                  key={label}
                  className="shrink-0 rounded-full border bg-white px-2.5 py-1 text-[11px] font-bold shadow-sm sm:px-3 sm:py-1.5 sm:text-[12px]"
                  style={{ borderColor: '#4CAF50', color: '#1B5E20' }}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="menu-slidein mx-3 mt-3 overflow-hidden rounded-xl border bg-white py-2.5 sm:mt-4 sm:py-3" style={{ borderColor: '#C8E6C9' }}>
          <div className="marquee-track">
            <div className="marquee-inner">
              {MARQUEE_REVIEWS.map((r) => (
                <span key={r} className="whitespace-nowrap text-[10px] font-bold sm:text-[11px]" style={{ color: '#37474F' }}>
                  {r}
                </span>
              ))}
            </div>
            <div className="marquee-inner" aria-hidden>
              {MARQUEE_REVIEWS.map((r) => (
                <span key={`${r}-dup`} className="whitespace-nowrap text-[10px] font-bold sm:text-[11px]" style={{ color: '#37474F' }}>
                  {r}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div
          className="menu-slidein mx-3 mt-3 rounded-[12px] border px-3 py-3 sm:mt-4 sm:px-4 sm:py-3.5"
          style={{ background: '#F1F8E9', borderColor: '#C5E1A5', animationDelay: '0.15s' }}
        >
          <p className="text-center text-[12px] font-semibold italic leading-relaxed sm:text-[13px]" style={{ color: '#33691E' }}>
            <span className="not-italic">💬 🍃</span> &quot;Coconut water is nature&apos;s ORS — perfect for summer dehydration&quot; — General
            wellness tip
          </p>
        </div>

        <div
          className="mx-3 mt-3.5 rounded-xl border px-3 py-3 text-center text-[12px] font-bold leading-snug sm:mt-4 sm:px-4 sm:py-3 sm:text-[13px]"
          style={{ background: '#E8F5E9', borderColor: '#A5D6A7', color: '#1B5E20' }}
        >
          {wellnessLine}
        </div>

        <div
          className="mx-3 mt-4 rounded-2xl border bg-white p-4 shadow-sm sm:mt-4 sm:p-5"
          style={{ borderColor: '#FFE0B2', background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF8E7 100%)' }}
        >
          <p className="text-center text-sm font-black leading-tight text-[var(--color-primary)] sm:text-[15px]">
             {peopleOrdered} people from Sector 53 and nearby ordered in the last hour
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:mt-4 sm:gap-2.5">
            <div className="flex -space-x-2">
              {socialAvatars.length === 0
                ? Array.from({ length: SOCIAL_AVATAR_COUNT }, (_, i) => (
                    <div
                      key={`avatar-skel-${i}`}
                      className="h-8 w-8 shrink-0 animate-pulse rounded-full bg-gray-200 ring-2 ring-white sm:h-9 sm:w-9"
                      aria-hidden
                    />
                  ))
                : socialAvatars.map((a, i) => (
                    <div
                      key={`${a.initial}-${i}-${a.color}`}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-black text-white ring-2 ring-white sm:h-9 sm:w-9 sm:text-[12px]"
                      style={{ backgroundColor: a.color }}
                    >
                      {a.initial}
                    </div>
                  ))}
            </div>
            <span className="text-[11px] font-bold text-gray-700 sm:text-[12px]">+{moreLastHour} more in the last hour</span>
          </div>
          <p className="mt-2.5 text-center text-[12px] font-bold text-gray-600 sm:mt-3 sm:text-[13px]">
            ⏱️ Last order: {lastOrderMins} minute{lastOrderMins === 1 ? '' : 's'} ago
            <span className="live-dot ml-1.5 inline-block h-2 w-2 rounded-full" style={{ background: '#EF4444' }} />
          </p>
        </div>

        <div className="menu-slidein mx-3 mt-4 rounded-[12px] border bg-white" style={{ borderColor: '#E5F0EA', animationDelay: '0.3s' }}>
          <div className="flex items-center justify-between rounded-[12px] p-3" style={{ background: '#2C2D5B', margin: '8px' }}>
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4" style={{ color: '#10B981' }} />
              <span className="text-[11.5px]" style={{ color: '#E0E7FF', fontWeight: 700 }}>
                4-pack · One dispatch · GPS tracked
              </span>
            </div>
            <span className="rounded-[12px] px-2 py-0.5 text-[10px]" style={{ background: '#10B981', color: '#fff', fontWeight: 900 }}>
              LIVE
            </span>
          </div>
          <div className="flex items-center justify-between px-4 pb-3">
            <span className="text-[11px]" style={{ color: '#6B7280', fontWeight: 600 }}>
              Delivered by our trusted partner
            </span>
            <div className="flex items-center gap-1">
              <span className="text-[10px]" style={{ color: '#2C2D5B', fontWeight: 700 }}>
                Powered by LiftNGo
              </span>
            </div>
          </div>
        </div>

        <ReferEarnSection />
        <CoconutSubscriptionSection />


      </div>

      {tickerPayload ? (
        <div
          className="ticker-card fixed bottom-24 left-3 z-[55] max-w-[min(92vw,340px)] rounded-xl border border-gray-100 bg-white py-2.5 pl-3 pr-3 shadow-lg"
          style={{ borderLeftWidth: 3, borderLeftColor: '#4CAF50' }}
          role="status"
        >
          <div className="flex gap-2">
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-black text-white"
              style={{ background: '#2E7D32' }}
            >
              {tickerPayload.initials}
            </div>
            <p className="min-w-0 flex-1 text-[11px] font-bold leading-snug text-gray-800">{tickerPayload.text}</p>
          </div>
        </div>
      ) : null}

      {cartCount === 0 ? (
        <div
          className="fixed inset-x-0 bottom-0 z-[50] border-t border-amber-100 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2"
          style={{ background: 'linear-gradient(to top, #FFFDE7 95%, transparent)' }}
        >
          <button
            type="button"
            onClick={scrollToProducts}
            className="flex w-full min-h-[48px] items-center justify-center gap-2 rounded-[12px] bg-[var(--color-primary)] text-sm font-extrabold text-white shadow-md transition-transform hover:scale-[1.02] hover:bg-[var(--color-primary-hover)]"
          >
            Order now
          </button>
          <p className="mt-1 text-center text-[10px] font-semibold text-gray-500">15–25 min · Sector 53</p>
        </div>
      ) : null}

      <CoconutCartBar onCheckout={() => router.push('/noida/coconut/checkout')} />
    </div>
  );
}
