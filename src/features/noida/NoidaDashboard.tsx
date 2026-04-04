'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from '@/components/OptimizedImage';
import HeroPickupAutocomplete from '@/components/landing/HeroPickupAutocomplete';
import { Building2, MapPin, Truck, Package, Shield, Clock, FileText, BarChart3, ChevronRight, Star, Zap, Users, ArrowRight, Sun, CalendarDays, Handshake } from 'lucide-react';
import type { ServiceId } from '@/types/booking';
import { PageContainer } from '@/components/ui';
import { LOGO_PATH, SITE_NAME } from '@/lib/site';
import { ROUTES } from '@/lib/constants';
import { getLandingPickupLocation, setLandingPickupLocation, setPickupLocation } from '@/lib/storage';
import { trackBookNowClick } from '@/lib/analytics';
import type { StoredUserLocation } from '@/lib/utils/locationStorage';

type ServiceRow = { id: ServiceId; label: string; image: string };

export interface NoidaDashboardProps {
  userName: string;
  pickup: { name: string; address: string } | null;
  dashboardLocation: StoredUserLocation | null;
  openLocationModal: () => void;
  setIsMenuOpen: (open: boolean) => void;
  router: { push: (href: string) => void };
  services: ServiceRow[];
  activeService: ServiceId;
  handleSelectService: (id: ServiceId) => void;
  onOpenChooseTrip: () => void;
}

/* ── Data ─────────────────────────────────────────────────── */

const HERO_TRUST = [
  { label: 'Same-day delivery' },
  { label: 'GST invoices' },
  { label: 'Live tracking' },
  { label: '4.8★ rating' },
] as const;

type CoreService = {
  icon: typeof Truck;
  title: string;
  sub: string;
  cta: string;
  href: string;
  badge?: string;
  /** Main conversion path — filled brand CTA; others use quiet outline */
  primaryCta?: boolean;
};
const CORE_SERVICES: CoreService[] = [
  {
    icon: Truck,
    title: 'Book a Delivery',
    sub: 'Goods 2W · 3W · 4W · Same-day',
    cta: 'Book now',
    href: ROUTES.PICKUP_LOCATION,
    primaryCta: true,
  },
  {
    icon: Package,
    title: 'Subscription',
    sub: 'Fixed trips · Save up to 30%',
    cta: 'View plans',
    badge: 'Save 30%',
    href: ROUTES.PLANS_SUBSCRIPTION,
  },
  {
    icon: CalendarDays,
    title: 'Rent a vehicle',
    sub: 'Daily, weekly — 2W, 3W & 4W on demand',
    cta: 'Explore rentals',
    href: ROUTES.PLANS_RENT,
  },
  {
    icon: Handshake,
    title: 'Lease a vehicle',
    sub: 'Dedicated fleet — monthly plans up to 12 mo',
    cta: 'Explore leases',
    href: ROUTES.PLANS_LEASE,
  },
  {
    icon: BarChart3,
    title: 'GST Billing',
    sub: 'GST-ready invoices on every trip',
    cta: 'Enable billing',
    href: ROUTES.PLANS_GST,
  },
];

type SubPlan = { name: string; trips: string; perTrip: string; price: string; savings?: string; popular?: boolean; offer?: boolean };
const SUBSCRIPTION_PLANS: SubPlan[] = [
  { name: 'Starter', trips: '30 trips', perTrip: '₹450/trip', price: '₹13,500', savings: 'Save ₹1,500' },
  { name: 'Growth', trips: '50 trips', perTrip: '₹400/trip', price: '₹20,000', savings: 'Save ₹4,000', popular: true },
  { name: 'Scale', trips: '100 trips', perTrip: '₹360/trip', price: '₹36,000', savings: 'Save ₹14,000', offer: true },
  { name: '4W Growth', trips: '50 trips', perTrip: '₹600/trip', price: '₹30,000', savings: 'Save ₹5,000' },
];

type LocalProduct = { emoji: string; name: string; sub?: string; available: boolean; href?: string; tag?: string };
const ORDER_FRESH_LOCAL: LocalProduct[] = [
  { emoji: '🥥', name: 'Fresh Coconut Water', sub: 'Sector 18 · Noida', available: true, href: '/noida/coconut', tag: 'Popular' },
  { emoji: '🥟', name: 'Samosa & Snacks', available: false },
  { emoji: '🛒', name: 'Office Groceries', available: false },
];

const WHY_LIFTNGO = [
  { icon: FileText, label: 'GST Invoice', sub: 'Get GST invoice on every trip', bg: 'bg-blue-50', iconColor: 'text-blue-500' },
  { icon: Clock, label: 'Same-day SLA', sub: 'Guaranteed same-day delivery', bg: 'bg-amber-50', iconColor: 'text-amber-500' },
  { icon: MapPin, label: 'Live GPS', sub: 'Track your delivery in real-time', bg: 'bg-emerald-50', iconColor: 'text-emerald-500' },
  { icon: Users, label: 'Dedicated POC', sub: 'Personal account manager for support', bg: 'bg-violet-50', iconColor: 'text-violet-500' },
] as const;

const TRUST_STATS = [
  { value: '500+', label: 'businesses trust Liftngo' },
  { value: '15 min', label: 'average pickup time' },
  { value: '4.8★', label: 'customer rating' },
] as const;

const NOIDA_PICKUP_SENTINEL_ID = 'noida-dashboard-pickup-sentinel';
const NOIDA_SENTINEL_MOUNT_MAX_FRAMES = 90;

/** Keep in sync with `components/landing/Header.tsx` — reserves space under the fixed bar */
const NOIDA_HEADER_BAR_HEIGHT = 68;
const NOIDA_HEADER_TOP_GAP = 24;
const NOIDA_HEADER_TOTAL_HEIGHT = NOIDA_HEADER_TOP_GAP + NOIDA_HEADER_BAR_HEIGHT;

/* ── Component ────────────────────────────────────────────── */

export default function NoidaDashboard({
  userName,
  pickup,
  dashboardLocation,
  openLocationModal,
  setIsMenuOpen,
  router,
  services,
  activeService,
  handleSelectService,
  onOpenChooseTrip,
}: NoidaDashboardProps) {
  const pathname = usePathname();
  const homeHref = pathname === ROUTES.NOIDA ? ROUTES.NOIDA : ROUTES.DASHBOARD;
  const [activeWhyIdx, setActiveWhyIdx] = useState<number | null>(null);
  const [compactPickup, setCompactPickup] = useState(false);
  const [pickupDraft, setPickupDraft] = useState('');

  useEffect(() => {
    const next = pickup?.name?.trim() || pickup?.address?.trim() || '';
    if (next) setPickupDraft(next);
  }, [pickup?.name, pickup?.address]);

  const handleNoidaHeaderPickupContinue = useCallback(() => {
    trackBookNowClick('noida_header_pickup_continue');
    const merged = pickupDraft.trim() || getLandingPickupLocation()?.trim() || '';
    setLandingPickupLocation(merged || null);
    if (merged) {
      const name = merged.split(',')[0]?.trim() || 'Pickup location';
      setPickupLocation({ name, address: merged, contact: '' });
    }
    router.push(ROUTES.PICKUP_LOCATION);
  }, [pickupDraft, router]);

  useEffect(() => {
    let cancelled = false;
    let observer: IntersectionObserver | null = null;
    let frames = 0;

    const tryObserve = () => {
      if (cancelled) return;
      const el = document.getElementById(NOIDA_PICKUP_SENTINEL_ID);
      if (!el) {
        frames += 1;
        if (frames < NOIDA_SENTINEL_MOUNT_MAX_FRAMES) {
          requestAnimationFrame(tryObserve);
        }
        return;
      }
      observer = new IntersectionObserver(
        ([entry]) => {
          if (!cancelled) {
            setCompactPickup(!entry.isIntersecting);
          }
        },
        { root: null, threshold: 0, rootMargin: '0px' }
      );
      observer.observe(el);
    };

    tryObserve();

    return () => {
      cancelled = true;
      observer?.disconnect();
    };
  }, []);

  return (
    <PageContainer className="relative z-0 bg-gray-50/80 pb-24 pt-0" stack={false}>
      <div style={{ height: NOIDA_HEADER_TOTAL_HEIGHT }} aria-hidden className="shrink-0" />

      {/* ── Header — same glass bar + scroll pickup row as landing `Header.tsx` ─── */}
      <header
        className="pointer-events-none fixed left-0 right-0 top-0 z-50 px-4 pt-4 sm:px-6 sm:pt-5 md:pt-6"
        style={{ paddingBottom: 0 }}
      >
        <div
          className={`liftngo-header-glass pointer-events-auto mx-auto flex min-h-14 min-w-0 max-w-7xl items-center justify-between gap-2 rounded-full py-1.5 pe-2 sm:min-h-[3.5rem] sm:gap-2 sm:pe-2 md:pe-4 ${compactPickup ? 'ps-2 sm:ps-3' : 'ps-3 sm:ps-4'}`}
        >
          {!compactPickup && (
            <Link href={homeHref} className="inline-flex shrink-0 items-center" aria-label={`${SITE_NAME} home`}>
              <Image
                src={LOGO_PATH}
                alt="Liftngo — logistics and same-day delivery services in Noida and NCR"
                width={188}
                height={54}
                className="h-7 w-auto max-w-[min(40vw,200px)] object-contain object-left sm:h-8 md:h-9"
                priority
              />
            </Link>
          )}

          {compactPickup ? (
            <div className="flex min-h-10 min-w-0 flex-1 items-center gap-1.5 sm:gap-2">
              <div className="flex min-h-10 min-w-0 flex-1 items-center gap-1 rounded-xl border border-gray-200/90 bg-white/95 px-1.5 shadow-sm sm:min-h-11 sm:px-2">
                <span className="flex shrink-0 items-center ps-1 text-gray-400 sm:ps-1.5" aria-hidden>
                  <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1112 6a2.5 2.5 0 010 5.5z"
                    />
                  </svg>
                </span>
                <HeroPickupAutocomplete
                  value={pickupDraft}
                  onChange={setPickupDraft}
                  onPickSuggestion={(desc) => {
                    setPickupDraft(desc);
                    setLandingPickupLocation(desc);
                  }}
                />
                <button
                  type="button"
                  onClick={handleNoidaHeaderPickupContinue}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-white transition-opacity hover:opacity-90"
                  aria-label="Continue to book"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <div className="hidden min-w-0 flex-1 lg:block" aria-hidden />
          )}

          <div className={`flex shrink-0 items-center ${compactPickup ? '' : 'gap-2 sm:gap-3'}`}>
            {!compactPickup && (
              <button
                type="button"
                onClick={openLocationModal}
                className="flex max-w-[6rem] items-center gap-1 truncate rounded-full border border-gray-200/90 bg-white/90 px-2.5 py-2 text-[11px] font-medium text-[#1A1D3A] shadow-sm transition-colors hover:bg-white sm:max-w-none sm:text-xs"
              >
                <Building2 className="h-3.5 w-3.5 shrink-0 text-[#1A1D3A]/70" strokeWidth={1.5} />
                <span className="truncate">{dashboardLocation?.city || 'Noida'}</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open menu"
              className="rounded-full p-2 text-[#1A1D3A] transition-colors hover:bg-[#1A1D3A]/[0.08] sm:p-2.5"
            >
              <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div className="flex min-w-0 flex-col gap-3 sm:gap-5 md:gap-6">
      {/* ── HERO — radial glow, compact on mobile, tile-like CTAs ───────────────── */}
      <section
        className="w-full min-w-0 overflow-x-clip rounded-2xl bg-slate-900 p-3 text-white sm:p-5 md:rounded-3xl md:p-6 lg:p-8"
        style={{ background: 'radial-gradient(ellipse at top left, rgba(99,102,241,0.2), transparent 50%), radial-gradient(ellipse at bottom right, rgba(139,92,246,0.1), transparent 50%), #0f172a' }}
      >
        <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-medium text-slate-300 backdrop-blur-sm sm:px-2.5 sm:py-1 sm:text-[10px] md:text-xs">
          <Shield className="h-2.5 w-2.5 shrink-0 sm:h-3 sm:w-3" /> Trusted by 100+ Noida Businesses
        </div>
        <h1 className="mt-1.5 text-base font-semibold leading-tight tracking-tight text-white sm:mt-2 sm:text-lg md:mt-3 md:text-2xl lg:text-3xl">
          Logistics &amp; Delivery Services in Noida
        </h1>
        <h2 className="mt-1 text-[11px] font-medium text-slate-400 sm:text-xs md:mt-2 md:text-sm">Same Day Delivery in Noida</h2>
        <p className="mt-1.5 max-w-3xl text-[10px] leading-snug text-slate-400 sm:mt-2 sm:text-[11px] sm:leading-relaxed md:text-xs lg:text-sm">
          <span className="font-semibold text-white">Fast, reliable for your business</span> ·{' '}
          <span className="font-semibold text-white">Starting ₹40/trip</span> · Same-day · GST billing · Live tracking · 4.8★
        </p>
        <div className="mt-2.5 grid w-full min-w-0 grid-cols-2 gap-2 sm:mt-4 sm:flex sm:flex-row sm:flex-wrap sm:gap-3">
          <button
            type="button"
            onClick={() => router.push(ROUTES.PICKUP_LOCATION)}
            className="flex min-h-10 items-center justify-center gap-1.5 rounded-xl bg-white px-2 py-2 text-[11px] font-semibold text-slate-900 shadow-sm transition-all duration-200 hover:shadow-md active:scale-[0.98] sm:min-h-11 sm:gap-2 sm:px-5 sm:py-2.5 sm:text-sm md:w-auto md:px-6"
          >
            <Truck className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" /> <span className="leading-tight">Book Delivery</span>
          </button>
          <button
            type="button"
            onClick={() => router.push(ROUTES.PLANS)}
            className="flex min-h-10 items-center justify-center gap-1 rounded-xl border border-white/15 bg-white/5 px-2 py-2 text-[10px] font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/10 sm:min-h-11 sm:px-4 sm:py-2.5 sm:text-xs md:text-sm"
          >
            Plans &amp; Pricing
          </button>
        </div>
        <p className="mt-1.5 flex items-center gap-1 text-[9px] font-medium text-slate-500 sm:mt-2 sm:text-[10px] md:mt-3 md:text-xs">
          <Zap className="h-2.5 w-2.5 shrink-0 sm:h-3 sm:w-3" /> Get pickup in 15 mins
        </p>
      </section>
      <div id={NOIDA_PICKUP_SENTINEL_ID} className="h-px w-full" aria-hidden />

      {/* ── MOST POPULAR PLAN ────────────────────────────── */}
      <section aria-labelledby="affordable-transport-plans">
        <h2 id="affordable-transport-plans" className="mb-2 px-0.5 text-sm font-semibold text-gray-900 md:text-base lg:text-lg">
          Affordable Transport Plans
        </h2>
        <div className="rounded-2xl bg-white p-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg sm:p-4 md:p-5">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 md:gap-6">
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-200/50 bg-gradient-to-r from-amber-50 to-amber-100/70 px-3 py-1 text-xs font-medium text-amber-950 shadow-sm">
              <Star className="h-3 w-3 fill-amber-400 text-amber-500 drop-shadow-[0_0_1px_rgba(217,119,6,0.35)]" strokeWidth={1.5} /> Most Popular
            </span>
            <span className="rounded-full border border-amber-100/80 bg-amber-50/90 px-2.5 py-0.5 text-[10px] font-medium text-amber-900/90">
              Save ₹4,000
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2 sm:mt-3">
            <span className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">₹20,000</span>
            <span className="text-xs text-gray-400 line-through sm:text-sm">₹24,000</span>
          </div>
          <p className="mt-0.5 text-xs text-gray-500 sm:mt-1 sm:text-sm">50 trips · ₹400/trip · 3W with driver · 30 days</p>
          <p className="mt-1 text-[10px] font-medium text-amber-800/90 sm:mt-1.5 sm:text-xs">Best for daily business deliveries</p>
          <button
            type="button"
            onClick={() => router.push(ROUTES.PLANS_SUBSCRIPTION)}
            className="mt-3 flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] py-2.5 text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:shadow-md active:scale-[0.98] sm:mt-4 sm:min-h-12 sm:py-3.5 sm:text-sm md:min-h-11 md:py-3"
          >
            Get This Plan <ArrowRight className="h-4 w-4 shrink-0" />
          </button>
        </div>
      </section>

      {/* ── CUSTOM PLAN BUILDER — rich entry ────────────── */}
      <section aria-labelledby="our-fleet-noida">
        <h2 id="our-fleet-noida" className="mb-2 px-0.5 text-sm font-semibold text-gray-900 md:text-base lg:text-lg">
          Our Fleet in Noida
        </h2>
        <button
          type="button"
          onClick={() => router.push(ROUTES.PLANS_CUSTOM)}
          className="group w-full rounded-2xl bg-white p-3 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-4 md:p-5"
        >
          <span className="sr-only">Cargo and goods vehicles only. Passenger rides are not available.</span>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold text-gray-900 md:text-base">Build Your Custom Plan</h3>
              <p className="mt-0.5 text-xs text-gray-500">Mix 2W · 3W · 4W loads, set trips &amp; see live pricing</p>
              {/* Visual cargo lane — reads as “moving stock”, not rides */}
              <div className="mt-2.5 flex flex-wrap items-center gap-2">
                <div className="flex items-center">
                  <div className="flex -space-x-2">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 shadow-sm ring-2 ring-white"
                        aria-hidden
                      >
                        <Package className="h-3.5 w-3.5 text-slate-500" strokeWidth={2} />
                      </span>
                    ))}
                  </div>
                  <span className="ml-2 text-[10px] font-medium tracking-wide text-gray-400">→</span>
                  <span className="ml-1.5 flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--color-primary)]/10">
                    <Truck className="h-3.5 w-3.5 text-[var(--color-primary)]" strokeWidth={2} />
                  </span>
                </div>
                <span className="text-[10px] text-gray-400">Parcels · pallets · bulk</span>
              </div>
            </div>
            <span className="relative flex h-11 w-11 shrink-0 items-center justify-center self-end rounded-2xl bg-gradient-to-br from-[var(--color-primary)]/15 to-violet-100/80 text-[var(--color-primary)] transition-transform duration-200 group-hover:scale-105 sm:self-auto">
              <Truck className="h-5 w-5" strokeWidth={1.75} />
              <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-md bg-white shadow-md ring-1 ring-slate-100">
                <Package className="h-2.5 w-2.5 text-amber-600" strokeWidth={2.5} />
              </span>
            </span>
          </div>

          <div className="mt-3 grid min-w-0 grid-cols-3 gap-1.5 sm:mt-4 sm:gap-3 md:gap-4">
            {[
              {
                label: '2 Wheeler',
                price: '₹40',
                img: '/dashboard/goods-two-wheeler.svg',
                alt: 'Two-wheeler goods delivery vehicle for small packages in Noida — logistics service',
              },
              {
                label: '3 Wheeler',
                price: '₹120',
                img: '/dashboard/goods-three-wheeler.svg',
                alt: 'Three wheeler delivery vehicle in Noida for business cargo and same-day logistics',
              },
              {
                label: '4 Wheeler',
                price: '₹250',
                img: '/dashboard/goods-four-wheeler.svg',
                alt: 'Mini truck and four-wheeler goods transport in Noida — same day delivery',
              },
            ].map((v) => (
              <div
                key={v.label}
                className="flex min-w-0 flex-col items-center overflow-x-clip rounded-lg bg-gradient-to-b from-slate-50/90 to-white shadow-sm ring-1 ring-slate-900/[0.04] transition-all duration-150 group-hover:shadow-md group-hover:ring-slate-900/[0.06] sm:rounded-xl"
              >
                <div className="relative h-[3rem] w-full shrink-0 pointer-events-none sm:h-[4.25rem] md:h-[4.5rem]">
                  <Image src={v.img} alt={v.alt} fill className="object-contain object-bottom p-0.5 sm:p-1" sizes="(max-width:640px) 33vw, 120px" unoptimized />
                </div>
                <div className="w-full px-1 pb-1.5 pt-0 text-center sm:px-1.5 sm:pb-2.5 sm:pt-0.5">
                  <span className="text-[9px] font-semibold leading-tight text-gray-800 sm:text-[10px]">{v.label}</span>
                  <span className="mt-px block text-[7px] text-gray-400 sm:mt-0.5 sm:text-[8px]">from</span>
                  <span className="text-xs font-bold tabular-nums text-gray-900 sm:text-sm">{v.price}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-2 flex items-center justify-between gap-2 rounded-lg bg-[var(--color-primary)]/5 px-2.5 py-2 sm:mt-3 sm:rounded-xl sm:px-3.5 sm:py-2.5">
            <span className="min-w-0 text-[10px] font-medium leading-tight text-[var(--color-primary)] sm:text-xs">Custom price →</span>
            <span className="flex shrink-0 items-center gap-0.5 text-[9px] text-gray-400 sm:gap-1 sm:text-[10px]">
              <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3" /> 30 sec
            </span>
          </div>

          <p className="mt-1.5 text-center text-[8px] text-gray-400 sm:mt-2 sm:text-[9px]">
            *Prices vary by distance, vehicle &amp; plan type · <span className="underline">T&amp;C apply</span>
          </p>
        </button>

        <button
          type="button"
          onClick={onOpenChooseTrip}
          className="group flex w-full min-w-0 flex-row items-center gap-2.5 rounded-2xl bg-white p-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:gap-4 sm:p-4 md:gap-6 md:p-5"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-500 sm:h-10 sm:w-10 sm:rounded-xl">
            <Zap className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.5} />
          </span>
          <div className="min-w-0 flex-1 text-left">
            <p className="text-xs font-semibold text-gray-900 sm:text-sm md:text-base">Quick Book</p>
            <p className="mt-0.5 line-clamp-2 text-[9px] leading-snug text-gray-500 sm:text-[11px] md:text-xs">Frequent routes · 1-tap repeat</p>
          </div>
          <span className="flex min-h-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary)] px-2.5 py-2 text-[9px] font-semibold text-white shadow-sm transition-all group-hover:shadow-md sm:min-h-10 sm:px-3 sm:py-2 sm:text-[10px] md:min-h-0 md:py-1.5">
            Book
          </span>
        </button>
      </section>

      {/* ── CORE SERVICES — cream / teal theme, one accent ─ */}
      <section
        className="rounded-2xl p-3 shadow-sm ring-1 ring-stone-200/70 sm:p-4 md:p-5"
        style={{
          background: 'linear-gradient(165deg, #faf9f7 0%, #ffffff 38%, rgba(240,253,250,0.45) 100%)',
        }}
      >
        <div className="mb-1.5 px-0.5 sm:mb-2">
          <h2 className="text-sm font-semibold tracking-tight text-stone-800 md:text-base lg:text-lg">Our Services</h2>
          <p className="mt-0.5 text-[10px] font-medium text-stone-500">Calm, clear choices for your Noida ops</p>
        </div>
        <div className="grid min-w-0 grid-cols-2 gap-2 sm:gap-3 md:gap-4 lg:grid-cols-3 xl:grid-cols-5">
          {CORE_SERVICES.map((svc) => {
            const Icon = svc.icon;
            const isPrimary = svc.primaryCta === true;
            return (
              <button
                key={svc.title}
                type="button"
                onClick={() => router.push(svc.href)}
                className={`group flex h-full min-h-0 w-full flex-col gap-2 rounded-xl border p-2.5 text-left transition-all duration-300 sm:gap-3 sm:p-3 md:gap-4 md:p-4 ${
                  isPrimary
                    ? 'border-teal-200/60 bg-white/90 shadow-[0_6px_24px_-10px_rgba(15,118,110,0.18)] hover:-translate-y-0.5 hover:border-teal-300/50 hover:shadow-[0_10px_28px_-12px_rgba(15,118,110,0.22)]'
                    : 'border-stone-200/60 bg-white/70 hover:-translate-y-0.5 hover:border-stone-300/70 hover:bg-white hover:shadow-sm'
                }`}
              >
                <div className="flex min-h-0 items-start gap-1.5 sm:gap-2">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-teal-50/90 text-teal-700 ring-1 ring-teal-100/60 transition-colors duration-300 group-hover:bg-teal-100/80 sm:h-9 sm:w-9 sm:rounded-lg">
                    <Icon className="h-4 w-4 sm:h-[17px] sm:w-[17px]" strokeWidth={1.5} />
                  </span>
                  <div className="min-w-0 flex-1 pt-px">
                    <div className="flex flex-col gap-0.5">
                      <p className="text-[10px] font-semibold leading-tight text-stone-800 sm:text-[11px] md:text-xs">{svc.title}</p>
                      {svc.badge ? (
                        <span className="w-fit rounded-full bg-amber-50 px-1 py-px text-[7px] font-medium text-amber-900/80 ring-1 ring-amber-100/80 sm:px-1.5 sm:text-[8px]">
                          {svc.badge}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-0.5 line-clamp-2 text-[8px] leading-snug text-stone-500 sm:mt-1 sm:text-[9px] md:text-[10px]">{svc.sub}</p>
                  </div>
                </div>
                <span
                  className={`mt-auto flex min-h-8 w-full items-center justify-center gap-0.5 rounded-md py-1.5 text-[8px] font-semibold tracking-wide transition-all duration-200 sm:min-h-9 sm:gap-1 sm:rounded-lg sm:py-2 sm:text-[9px] md:min-h-10 md:text-[10px] ${
                    isPrimary
                      ? 'bg-[var(--color-primary)] text-white shadow-sm hover:opacity-90 active:scale-[0.98]'
                      : 'border border-stone-200/90 bg-stone-50/50 text-stone-700 hover:border-teal-200/50 hover:bg-teal-50/40 hover:text-teal-900 active:scale-[0.98]'
                  }`}
                >
                  {svc.cta}
                  <ArrowRight className="h-2.5 w-2.5 opacity-80 sm:h-3 sm:w-3" strokeWidth={2} />
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── ORDER FRESH & LOCAL — compact summer card ────── */}
      <section
        className="rounded-2xl p-3 shadow-sm ring-1 ring-sky-100/90 sm:p-4 md:p-5"
        style={{
          background: 'linear-gradient(160deg, rgba(224,242,254,0.75) 0%, #fff 50%, rgba(254,252,232,0.35) 100%)',
        }}
      >
        <div className="px-0.5">
          <h2 className="text-sm font-semibold text-slate-900 md:text-base lg:text-lg">Order Fresh &amp; Local</h2>
          <p className="mt-0.5 flex items-center gap-1 text-[9px] font-medium leading-tight text-sky-700">
            <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
              <Sun className="h-2.5 w-2.5" strokeWidth={2.5} />
            </span>
            Chilled nariyal pani · Noida
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.push('/noida/coconut')}
          className="group mt-2 flex w-full min-w-0 flex-row items-stretch overflow-x-clip rounded-xl bg-white text-left shadow-md ring-1 ring-sky-100/70 transition-all duration-200 hover:-translate-y-px hover:shadow-lg hover:ring-amber-200/50"
          style={{ boxShadow: '0 4px 18px -6px rgba(14,165,233,0.2), 0 0 0 1px rgba(255,255,255,0.8) inset' }}
        >
          <div className="relative h-[4.25rem] w-[4.25rem] shrink-0 overflow-hidden bg-gradient-to-br from-sky-200/90 to-cyan-100 sm:h-[5.25rem] sm:w-[5.25rem] md:h-[5.75rem] md:w-[5.75rem]">
            <Image
              src="/noida/coconut-summer-hero.png"
              alt="Fresh coconut water delivery in Noida Sector 18 — Liftngo local marketplace"
              fill
              className="scale-[1.12] object-cover object-[50%_42%] brightness-[1.06] contrast-[1.04] saturate-[1.12] transition-transform duration-300 group-hover:scale-[1.2] sm:scale-[1.18] sm:group-hover:scale-[1.24]"
              sizes="(max-width:640px) 68px, 92px"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/25 via-transparent to-amber-400/20 mix-blend-soft-light"
              aria-hidden
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-sky-950/15 to-transparent" aria-hidden />
          </div>
          <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5 px-2 py-2 sm:gap-2 sm:px-3 sm:py-2.5 md:py-3">
            <div className="flex flex-wrap items-center gap-1">
              <span className="rounded-full bg-sky-100 px-1.5 py-px text-[8px] font-semibold text-sky-800 sm:px-2 sm:text-[9px]">Popular</span>
              <span className="rounded-full bg-emerald-100 px-1.5 py-px text-[8px] font-semibold text-emerald-800 sm:px-2 sm:text-[9px]">Live</span>
            </div>
            <div>
              <p className="text-xs font-semibold leading-tight tracking-tight text-slate-900 sm:text-[13px]">Fresh Coconut Water</p>
              <p className="mt-0.5 text-[9px] leading-snug text-slate-500 sm:text-[10px]">Sector 18 · ~30 min · Ice-cold</p>
            </div>
            <span className="inline-flex min-h-9 w-full max-w-[10rem] items-center justify-center gap-1 rounded-lg bg-gradient-to-r from-sky-500 via-sky-500 to-cyan-500 py-2 text-[10px] font-semibold text-white shadow-sm transition-all duration-200 group-hover:from-sky-600 group-hover:to-cyan-500 group-hover:shadow-md active:scale-[0.99] sm:min-h-10 sm:max-w-[11rem] sm:text-[11px] md:min-h-0 md:py-1.5">
              Order now
              <ArrowRight className="h-2.5 w-2.5 shrink-0 sm:h-3 sm:w-3" strokeWidth={2.5} />
            </span>
          </div>
        </button>

        <p className="mt-1.5 text-center text-[8px] leading-tight text-sky-600/75">Combos &amp; secure pay — tap the card</p>

        <div className="mt-2 grid min-w-0 grid-cols-3 gap-1.5 sm:flex sm:flex-nowrap sm:gap-2 sm:overflow-x-auto sm:pb-px sm:scrollbar-none">
          {ORDER_FRESH_LOCAL.filter((i) => !i.available).map((item) => (
            <div
              key={item.name}
              className="flex min-w-0 flex-col rounded-lg border border-sky-100/90 bg-white/95 p-1.5 shadow-sm sm:w-[6.5rem] sm:shrink-0 sm:rounded-xl sm:p-2"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-sky-50 text-sm sm:h-7 sm:w-7 sm:rounded-lg sm:text-base">{item.emoji}</span>
              <p className="mt-1 line-clamp-2 text-[8px] font-semibold leading-tight text-slate-800 sm:mt-1.5 sm:text-[9px]">{item.name}</p>
              <p className="text-[6px] text-slate-400 sm:text-[7px]">Soon</p>
              <button
                type="button"
                className="mt-1 w-full rounded-md border border-sky-300/90 bg-sky-50 py-1 text-[7px] font-semibold text-sky-900 transition-colors hover:bg-sky-100 sm:mt-1.5 sm:rounded-lg sm:py-1.5 sm:text-[8px]"
              >
                Notify
              </button>
            </div>
          ))}
          <div className="flex min-w-0 flex-col items-center justify-center rounded-lg border border-dashed border-sky-200/90 bg-white/80 p-1.5 text-center shadow-sm sm:w-[6.5rem] sm:shrink-0 sm:rounded-xl sm:p-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-100 text-sky-600">
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </span>
            <p className="mt-1 text-[9px] font-semibold text-slate-700">List product</p>
            <p className="text-[7px] text-slate-400">Sellers</p>
            <button
              type="button"
              onClick={() => router.push(ROUTES.CONTACT)}
              className="mt-1.5 w-full rounded-lg bg-[var(--color-primary)] py-1.5 text-[8px] font-semibold text-white shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
            >
              Apply
            </button>
          </div>
        </div>
      </section>

      {/* ── WHY LIFTNGO + TRUST — compact, interactive ───── */}
      <section>
        <div className="mb-1.5 flex items-end justify-between gap-4 px-0.5 sm:gap-6">
          <div>
            <h2 className="text-sm font-semibold text-gray-900 md:text-base lg:text-lg">Why Businesses Choose Liftngo</h2>
            <p className="text-[9px] text-gray-400">Tap a point to highlight · Same trust as the rest of the app</p>
          </div>
        </div>
        <div className="rounded-2xl bg-white p-1.5 shadow-sm ring-1 ring-slate-900/[0.04] sm:p-2">
          <div className="grid grid-cols-2 gap-2 sm:gap-4 md:gap-6">
            {WHY_LIFTNGO.map((item, i) => {
              const Icon = item.icon;
              const active = activeWhyIdx === i;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setActiveWhyIdx(active ? null : i)}
                  className={`flex w-full min-w-0 items-start gap-1.5 rounded-lg p-2 text-left transition-all duration-200 active:scale-[0.98] sm:gap-2 sm:rounded-xl sm:p-3 md:p-2.5 ${
                    active
                      ? 'bg-[var(--color-primary)]/[0.06] ring-1 ring-[var(--color-primary)]/25 shadow-sm'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md sm:h-8 sm:w-8 sm:rounded-lg ${item.bg} ${item.iconColor}`}>
                    <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={1.75} />
                  </span>
                  <div className="min-w-0 pt-px sm:pt-0.5">
                    <p className="text-[10px] font-semibold leading-tight text-gray-900 sm:text-[11px]">{item.label}</p>
                    <p className={`mt-0.5 text-[8px] leading-snug text-gray-500 sm:text-[9px] ${active ? '' : 'line-clamp-2'}`}>{item.sub}</p>
                  </div>
                </button>
              );
            })}
          </div>
          <div className="mt-1.5 flex items-stretch rounded-lg bg-slate-50 px-0.5 py-1.5 sm:mt-2 sm:rounded-xl sm:px-1 sm:py-2">
            {TRUST_STATS.map((stat, i) => (
              <div
                key={stat.label}
                className={`flex min-w-0 flex-1 flex-col items-center justify-center px-0.5 text-center sm:px-1 ${i > 0 ? 'border-l border-gray-200/80' : ''}`}
              >
                <p className="text-xs font-bold tabular-nums text-gray-900 sm:text-sm">{stat.value}</p>
                <p className="mt-0.5 line-clamp-2 text-[6px] leading-tight text-gray-400 sm:text-[7px]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ALL PLANS — dense strip, snap on mobile ─────── */}
      <section id="pricing-plans" className="scroll-mt-20" aria-labelledby="subscription-plans-noida">
        <div className="mb-1.5 flex items-center justify-between px-0.5">
          <div>
            <h3 id="subscription-plans-noida" className="text-sm font-semibold text-gray-900 md:text-base">
              Subscription plans in Noida
            </h3>
            <p className="text-[9px] text-gray-400">Part of affordable transport · swipe on mobile</p>
          </div>
          <button
            type="button"
            onClick={() => router.push(ROUTES.PLANS)}
            className="shrink-0 rounded-lg px-2 py-1 text-[10px] font-semibold text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary)]/5"
          >
            View all <ChevronRight className="mb-px inline h-3 w-3" />
          </button>
        </div>
        <div className="grid min-w-0 grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4 lg:gap-4 xl:gap-6">
          {SUBSCRIPTION_PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex w-full min-w-0 flex-col rounded-xl bg-white p-2.5 text-center shadow-sm ring-1 ring-slate-900/[0.04] transition-all duration-200 hover:-translate-y-px hover:shadow-md sm:p-3 md:p-4 ${
                plan.popular ? 'ring-2 ring-[var(--color-primary)]/25' : ''
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-2 left-1/2 z-[1] -translate-x-1/2 whitespace-nowrap rounded-full border border-amber-200/50 bg-gradient-to-r from-amber-50 to-amber-100/80 px-2 py-px text-[8px] font-semibold text-amber-950 shadow-sm">
                  <Star className="mb-px inline h-2 w-2 fill-amber-400 text-amber-500" strokeWidth={1.5} /> Popular
                </span>
              )}
              {plan.offer && !plan.popular ? (
                <span className="absolute -top-2 left-1/2 z-[1] -translate-x-1/2 whitespace-nowrap rounded-full border border-amber-200/45 bg-gradient-to-r from-amber-50/95 to-amber-100/70 px-2 py-px text-[8px] font-semibold text-amber-950 shadow-sm">
                  <Star className="mb-px inline h-2 w-2 fill-amber-400 text-amber-500" strokeWidth={1.5} /> Best value
                </span>
              ) : null}
              <p className={`text-[8px] font-semibold uppercase tracking-wide text-gray-400 sm:text-[9px] ${plan.popular || plan.offer ? 'mt-1.5 sm:mt-2' : ''}`}>{plan.name}</p>
              <p className="mt-0.5 text-sm font-bold tabular-nums text-gray-900 sm:text-base md:text-lg">{plan.price}</p>
              <p className="text-[8px] text-gray-500 sm:text-[10px]">{plan.trips}</p>
              {plan.savings ? (
                <span className="mx-auto mt-0.5 inline-block max-w-full truncate rounded-full border border-amber-100/70 bg-amber-50/80 px-1.5 py-px text-[7px] font-medium text-amber-900/85 sm:mt-1 sm:px-2 sm:text-[8px]">
                  {plan.savings}
                </span>
              ) : null}
              <button
                type="button"
                onClick={() => router.push(ROUTES.PLANS_SUBSCRIPTION)}
                className={`mt-1.5 w-full min-h-8 rounded-md py-1.5 text-[8px] font-semibold transition-all duration-200 sm:mt-2 sm:min-h-9 sm:rounded-lg sm:py-2 sm:text-[9px] md:min-h-10 md:text-[10px] lg:min-h-0 lg:py-2 ${
                  plan.popular
                    ? 'bg-[var(--color-primary)] text-white shadow-sm hover:shadow-md active:scale-[0.98]'
                    : plan.offer
                      ? 'border border-amber-200/60 bg-gradient-to-b from-amber-50 to-amber-100/50 text-amber-950 shadow-sm hover:border-amber-300/70 hover:shadow-sm active:scale-[0.98]'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200 active:scale-[0.98]'
                }`}
              >
                Get plan
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── VENDOR + ROUTE — compact, same system as Plans/Why ─ */}
      <section className="space-y-4 sm:space-y-6">
        <div className="mb-1 px-0.5">
          <p className="text-[9px] text-gray-400">Partners · Grow with Liftngo</p>
        </div>

        <div className="group rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-900/[0.04] transition-all duration-200 hover:-translate-y-px hover:shadow-md sm:p-4 md:p-5">
          <div className="flex items-start gap-2.5 sm:gap-4 md:gap-6">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] transition-transform duration-200 group-hover:scale-105 sm:h-9 sm:w-9 sm:rounded-xl">
              <Package className="h-4 w-4 sm:h-[18px] sm:w-[18px]" strokeWidth={1.75} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <h3 className="text-xs font-semibold text-gray-900 sm:text-sm">Sell on Liftngo</h3>
                <span className="rounded-full bg-gray-100 px-1.5 py-px text-[7px] font-semibold text-gray-700 sm:px-2 sm:text-[8px]">Verified only</span>
              </div>
              <p className="mt-0.5 text-[9px] leading-snug text-gray-500 sm:text-[10px]">Products · Noida &amp; NCR reach</p>
            </div>
          </div>

          <div className="mt-2 grid min-w-0 grid-cols-2 gap-2 sm:gap-3 md:gap-4">
            {[
              { label: 'Instant storefront', icon: '🏪' },
              { label: 'Weekly payouts', icon: '💰' },
              { label: 'Delivery handled by us', icon: '🚚' },
              { label: 'Premium customer base', icon: '👥' },
            ].map((v) => (
              <div
                key={v.label}
                className="flex items-center gap-1 rounded-md bg-slate-50 px-1.5 py-1 ring-1 ring-slate-900/[0.03] sm:gap-1.5 sm:rounded-lg sm:px-2 sm:py-1.5"
              >
                <span className="text-xs leading-none sm:text-sm">{v.icon}</span>
                <span className="line-clamp-2 text-[8px] font-medium leading-tight text-gray-700 sm:text-[9px]">{v.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-1.5 flex items-center gap-1 rounded-md bg-green-50 px-1.5 py-1 ring-1 ring-green-100/80 sm:mt-2 sm:gap-1.5 sm:rounded-lg sm:px-2 sm:py-1.5">
            <span className="text-xs leading-none sm:text-sm">📈</span>
            <p className="text-[8px] font-semibold leading-tight text-green-800 sm:text-[9px]">Top vendors ₹50k+ / mo</p>
          </div>

          <div className="mt-2 flex min-w-0 flex-row gap-2 sm:mt-2.5 sm:gap-3 md:gap-4">
            <button
              type="button"
              onClick={() => router.push(ROUTES.CONTACT)}
              className="inline-flex min-h-10 min-w-0 flex-1 items-center justify-center gap-1 rounded-lg bg-[var(--color-primary)] px-2 py-2 text-[9px] font-semibold text-white shadow-sm transition-all hover:shadow-md active:scale-[0.98] sm:min-h-11 sm:gap-1.5 sm:py-2.5 sm:text-[10px] md:text-[11px]"
            >
              Apply
              <ArrowRight className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" strokeWidth={2.5} />
            </button>
            <button
              type="button"
              onClick={() => router.push(ROUTES.CONTACT)}
              className="flex min-h-10 min-w-0 flex-1 items-center justify-center rounded-lg border border-gray-200 bg-white px-2 py-2 text-[9px] font-semibold text-gray-800 shadow-sm transition-all hover:bg-gray-50 active:scale-[0.98] sm:min-h-11 sm:py-2.5 sm:text-[10px] md:text-[11px]"
            >
              Requirements
            </button>
          </div>

          <div className="mt-2 flex items-center justify-center gap-1 text-[8px] text-gray-400">
            <Shield className="h-2.5 w-2.5 shrink-0" strokeWidth={2} />
            <span>Only verified vendors onboarded after approval</span>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-900/[0.04] transition-all duration-200 hover:-translate-y-px hover:shadow-md sm:p-4 md:p-5">
          <div className="flex items-center gap-2.5 sm:gap-4 md:gap-6">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-600 sm:h-8 sm:w-8 sm:rounded-lg">
              <BarChart3 className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={1.75} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-gray-900 sm:text-sm">Free route analysis</p>
              <p className="text-[8px] text-gray-400 sm:text-[9px]">WhatsApp · Savings estimate</p>
            </div>
          </div>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3 md:gap-6">
            <input
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              placeholder="WhatsApp number"
              className="min-h-9 w-full flex-1 rounded-lg border border-transparent bg-slate-50 px-2.5 text-[11px] text-gray-900 placeholder:text-gray-400 focus:border-[var(--color-primary)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/15 sm:min-h-[38px] sm:px-3 sm:text-xs"
            />
            <button
              type="button"
              onClick={() => router.push(ROUTES.CONTACT)}
              className="w-full shrink-0 rounded-lg bg-[var(--color-primary)] px-3 py-2 text-[10px] font-semibold text-white shadow-sm transition-all hover:shadow-md active:scale-[0.98] sm:w-auto sm:min-w-[5rem] sm:py-2.5 sm:text-[11px]"
            >
              Request
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer tagline ────────────────────────────────── */}
      <div className="text-center">
        <p className="text-lg font-semibold tracking-tight text-gray-800">Goods Time Pe</p>
        <p className="text-sm font-medium text-gray-400">Business Prime Pe</p>
        <p className="mt-1.5 text-[11px] text-gray-300">Used by 100+ Noida businesses · Transparent pricing</p>
      </div>
      </div>

      {/* ── Sticky Bottom CTA ─────────────────────────────── */}
      <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-gray-100/80 bg-white/95 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-4px_24px_rgba(0,0,0,0.05)] backdrop-blur-xl">
        <div className="mx-auto flex min-w-0 max-w-6xl flex-col gap-2 px-4 md:flex-row md:items-center md:gap-3 md:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => router.push(ROUTES.PICKUP_LOCATION)}
            className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-primary)] py-3.5 text-sm font-semibold text-white shadow-[0_4px_14px_-4px_rgba(15,23,42,0.35)] transition-all hover:shadow-md active:scale-[0.98] md:min-h-12 md:flex-1 md:py-3"
          >
            <Truck className="h-4 w-4 shrink-0" strokeWidth={2} /> Book Now
          </button>
          <div className="flex min-w-0 items-stretch gap-2 md:w-auto md:shrink-0 md:items-center md:gap-2.5">
            <button
              type="button"
              onClick={() => router.push(ROUTES.PLANS)}
              className="flex min-h-[48px] min-w-0 flex-1 items-center justify-center gap-1 rounded-2xl border border-amber-200/55 bg-gradient-to-b from-amber-50 via-amber-50 to-amber-100/40 px-3 py-3 text-xs font-semibold text-amber-950 shadow-sm ring-1 ring-amber-100/60 transition-all hover:border-amber-300/70 hover:shadow-md active:scale-[0.98] md:min-h-12 md:flex-initial md:px-4"
            >
              <Star className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-500 drop-shadow-[0_0_1px_rgba(180,83,9,0.35)]" strokeWidth={1.5} />
              Best Plan
            </button>
            {[
              { label: 'Home', icon: 'M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3m8 0h3a1 1 0 001-1V10', href: homeHref },
              { label: 'History', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', href: ROUTES.HISTORY },
            ].map((tab) => (
              <button
                key={tab.label}
                type="button"
                onClick={() => router.push(tab.href)}
                className="flex min-h-[48px] min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl py-1 text-[9px] font-medium text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-800 active:scale-[0.98] md:min-h-12 md:w-14 md:flex-none md:flex-initial"
              >
                <svg className="h-[18px] w-[18px] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
                </svg>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
