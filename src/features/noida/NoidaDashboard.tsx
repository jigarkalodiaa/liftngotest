'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from '@/components/OptimizedImage';
import HeroPickupAutocomplete from '@/components/landing/HeroPickupAutocomplete';
import {
  Building2, MapPin, Truck, Package, Shield, Clock, FileText, BarChart3, ChevronRight, Star, Zap,
  ArrowRight, Sun, CalendarDays, Handshake, Check, Info, X, Receipt, Sparkles,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ServiceId } from '@/types/booking';
import { PageContainer } from '@/components/ui';
import { LOGO_PATH, SITE_NAME } from '@/lib/site';
import { ROUTES } from '@/lib/constants';
import {
  INDICATIVE_PRICING_FOOTNOTE,
  SUBSCRIPTION_COMPLIANCE_BULLETS,
  SUBSCRIPTION_PACK_BENEFITS,
} from '@/lib/pricing/subscriptionDisclosures';
import { NOIDA_QUICK_FARE_MODAL_ENTRIES } from '@/lib/pricing/noidaQuickFareCopy';
import {
  SUBSCRIPTION_NOIDA_STRIP_PLANS,
  subscriptionHighlighted3WPack,
  formatSubscriptionRupee,
  subscriptionPackSavingsLabel,
  subscriptionPackLockHref,
} from '@/lib/pricing/subscriptionPacks';
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

const NOIDA_HIGHLIGHT_3W_PACK = subscriptionHighlighted3WPack();

type ServiceTileAccent = 'teal' | 'amber' | 'sky' | 'indigo' | 'emerald' | 'violet';

type CoreService = {
  icon: LucideIcon;
  title: string;
  sub: string;
  cta: string;
  href: string;
  badge?: string;
  accent: ServiceTileAccent;
  /** Main conversion path — filled brand CTA */
  primaryCta?: boolean;
};

/** Per-tile border / icon / outline CTA (primary tile uses `cardHero` + solid button). */
const SERVICE_TILE_STYLES: Record<
  ServiceTileAccent,
  { card: string; cardHero?: string; icon: string; ctaOutline: string }
> = {
  teal: {
    cardHero:
      'border-teal-200/60 bg-white/90 shadow-[0_6px_24px_-10px_rgba(15,118,110,0.18)] hover:-translate-y-0.5 hover:border-teal-300/50 hover:shadow-[0_10px_28px_-12px_rgba(15,118,110,0.22)]',
    card: 'border-teal-200/45 bg-white/80 ring-1 ring-teal-100/35 hover:-translate-y-0.5 hover:border-teal-300/50 hover:bg-white hover:shadow-[0_6px_22px_-14px_rgba(15,118,110,0.14)]',
    icon: 'bg-teal-50/90 text-teal-700 ring-teal-100/60 group-hover:bg-teal-100/80',
    ctaOutline:
      'border border-teal-200/85 bg-teal-50/45 text-teal-900 hover:border-teal-300/80 hover:bg-teal-50/75 hover:text-teal-950 active:scale-[0.98]',
  },
  amber: {
    card: 'border-amber-200/50 bg-white/80 ring-1 ring-amber-100/40 hover:-translate-y-0.5 hover:border-amber-300/55 hover:bg-white hover:shadow-[0_6px_22px_-14px_rgba(217,119,6,0.12)]',
    icon: 'bg-amber-50/95 text-amber-800 ring-amber-100/70 group-hover:bg-amber-100/80',
    ctaOutline:
      'border border-amber-200/90 bg-amber-50/50 text-amber-950 hover:border-amber-300 hover:bg-amber-50/80 active:scale-[0.98]',
  },
  sky: {
    card: 'border-sky-200/50 bg-white/80 ring-1 ring-sky-100/45 hover:-translate-y-0.5 hover:border-sky-300/55 hover:bg-white hover:shadow-[0_6px_22px_-14px_rgba(14,165,233,0.12)]',
    icon: 'bg-sky-50/95 text-sky-700 ring-sky-100/70 group-hover:bg-sky-100/80',
    ctaOutline:
      'border border-sky-200/90 bg-sky-50/45 text-sky-900 hover:border-sky-300/80 hover:bg-sky-50/75 active:scale-[0.98]',
  },
  indigo: {
    card: 'border-indigo-200/50 bg-white/80 ring-1 ring-indigo-100/40 hover:-translate-y-0.5 hover:border-indigo-300/55 hover:bg-white hover:shadow-[0_6px_22px_-14px_rgba(99,102,241,0.12)]',
    icon: 'bg-indigo-50/95 text-indigo-700 ring-indigo-100/70 group-hover:bg-indigo-100/80',
    ctaOutline:
      'border border-indigo-200/90 bg-indigo-50/45 text-indigo-900 hover:border-indigo-300/80 hover:bg-indigo-50/75 active:scale-[0.98]',
  },
  emerald: {
    card: 'border-emerald-200/50 bg-white/80 ring-1 ring-emerald-100/40 hover:-translate-y-0.5 hover:border-emerald-300/55 hover:bg-white hover:shadow-[0_6px_22px_-14px_rgba(16,185,129,0.12)]',
    icon: 'bg-emerald-50/95 text-emerald-700 ring-emerald-100/70 group-hover:bg-emerald-100/80',
    ctaOutline:
      'border border-emerald-200/90 bg-emerald-50/45 text-emerald-900 hover:border-emerald-300/80 hover:bg-emerald-50/75 active:scale-[0.98]',
  },
  violet: {
    card: 'border-violet-200/70 bg-white/85 ring-1 ring-violet-100/50 hover:-translate-y-0.5 hover:border-violet-300/60 hover:bg-white hover:shadow-sm',
    icon: 'bg-violet-50/95 text-violet-700 ring-violet-100/70 group-hover:bg-violet-100/80',
    ctaOutline:
      'border border-violet-200/90 bg-violet-50/80 text-violet-900 hover:border-violet-300 hover:bg-violet-100/70 active:scale-[0.98]',
  },
};

const CORE_SERVICES: CoreService[] = [
  {
    icon: Truck,
    title: 'Book a Delivery',
    sub: 'Goods 2W · 3W · 4W · Same-day',
    cta: 'Book now',
    href: ROUTES.PICKUP_LOCATION,
    accent: 'teal',
    primaryCta: true,
  },
  {
    icon: Package,
    title: 'Subscription',
    sub: 'Fixed trips · Save up to 30%',
    cta: 'View plans',
    badge: 'Save 30%',
    href: ROUTES.PLANS_SUBSCRIPTION,
    accent: 'amber',
  },
  {
    icon: CalendarDays,
    title: 'Rent a vehicle',
    sub: 'Daily, weekly — 2W, 3W & 4W on demand',
    cta: 'Explore rentals',
    href: ROUTES.PLANS_RENT,
    accent: 'sky',
  },
  {
    icon: Handshake,
    title: 'Lease a vehicle',
    sub: 'Dedicated fleet — monthly plans up to 12 mo',
    cta: 'Explore leases',
    href: ROUTES.PLANS_LEASE,
    accent: 'indigo',
  },
  {
    icon: BarChart3,
    title: 'GST Billing',
    sub: 'GST-ready invoices on every trip',
    cta: 'Enable billing',
    href: ROUTES.PLANS_GST,
    accent: 'emerald',
  },
  {
    icon: Building2,
    title: 'Own fleet?',
    sub: 'Assign trips to your vehicles · track with Liftngo tech',
    cta: 'How it works',
    href: ROUTES.NOIDA_FLEET_TECH,
    accent: 'violet',
  },
];

type LocalUpcomingAccent = 'amber' | 'emerald';

type LocalProduct = {
  emoji: string;
  name: string;
  sub?: string;
  available: boolean;
  href?: string;
  tag?: string;
  accent?: LocalUpcomingAccent;
};

/** Coming-soon row tiles — aligned with Our Services (border + chip + outline CTA). */
const LOCAL_UPCOMING_STYLES: Record<
  LocalUpcomingAccent,
  { card: string; icon: string; btn: string }
> = {
  amber: {
    card: 'border-amber-200/55 bg-white/88 ring-1 ring-amber-100/35 shadow-sm transition-all duration-200 hover:border-amber-300/50 hover:shadow-md',
    icon: 'bg-amber-50/95 text-amber-800 ring-1 ring-amber-100/75',
    btn: 'border border-amber-200/90 bg-amber-50/55 text-[9px] font-semibold text-amber-950 transition-colors hover:bg-amber-100/70 active:scale-[0.98] sm:text-[10px]',
  },
  emerald: {
    card: 'border-emerald-200/55 bg-white/88 ring-1 ring-emerald-100/35 shadow-sm transition-all duration-200 hover:border-emerald-300/50 hover:shadow-md',
    icon: 'bg-emerald-50/95 text-emerald-800 ring-1 ring-emerald-100/75',
    btn: 'border border-emerald-200/90 bg-emerald-50/55 text-[9px] font-semibold text-emerald-950 transition-colors hover:bg-emerald-100/70 active:scale-[0.98] sm:text-[10px]',
  },
};

const ORDER_FRESH_LOCAL: LocalProduct[] = [
  { emoji: '🥥', name: 'Fresh Coconut Water', sub: 'Sector 53 · Noida', available: true, href: '/noida/coconut', tag: 'Popular' },
  { emoji: '🥟', name: 'Samosa & Snacks', available: false, accent: 'amber' },
  { emoji: '🛒', name: 'Office Groceries', available: false, accent: 'emerald' },
];

/** Fleet strip inside “Build Your Custom Plan” — shared grid + info modal. */
const NOIDA_FLEET_TILES = [
  {
    label: '2 Wheeler',
    price: '₹39',
    img: '/dashboard/goods-two-wheeler.svg',
    alt: 'Two-wheeler goods delivery vehicle for small packages in Noida — logistics service',
  },
  {
    label: '3 Wheeler',
    price: '₹299',
    img: '/dashboard/goods-three-wheeler.svg',
    alt: 'Three wheeler delivery vehicle in Noida for business cargo and same-day logistics',
  },
  {
    label: '4 Wheeler',
    price: '₹250',
    img: '/dashboard/goods-four-wheeler.svg',
    alt: 'Mini truck and four-wheeler goods transport in Noida — same day delivery',
  },
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
  const [compactPickup, setCompactPickup] = useState(false);
  const [pickupDraft, setPickupDraft] = useState('');
  const [growthPlanDetailsOpen, setGrowthPlanDetailsOpen] = useState(false);
  const [heroPricingDetailsOpen, setHeroPricingDetailsOpen] = useState(false);
  const [fleetBuilderDetailsOpen, setFleetBuilderDetailsOpen] = useState(false);
  const [orderFreshLegalOpen, setOrderFreshLegalOpen] = useState(false);
  const [subscriptionStripInfoOpen, setSubscriptionStripInfoOpen] = useState(false);
  const anyDetailsModalOpen =
    growthPlanDetailsOpen ||
    heroPricingDetailsOpen ||
    fleetBuilderDetailsOpen ||
    orderFreshLegalOpen ||
    subscriptionStripInfoOpen;

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

  const goFleetCustomPlans = useCallback(() => router.push(ROUTES.PLANS_CUSTOM), [router]);

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

  useEffect(() => {
    if (!anyDetailsModalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setGrowthPlanDetailsOpen(false);
      setHeroPricingDetailsOpen(false);
      setFleetBuilderDetailsOpen(false);
      setOrderFreshLegalOpen(false);
      setSubscriptionStripInfoOpen(false);
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [anyDetailsModalOpen]);

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
      {/* Hero + pickup sentinel in one flex child avoids gap doubling (hero | spacer | section). */}
      <div className="flex min-w-0 flex-col">
      {/* ── HERO — radial glow, compact on mobile, tile-like CTAs ───────────────── */}
      <section
        className="relative w-full min-w-0 overflow-hidden rounded-2xl bg-slate-900 p-0 text-white md:rounded-3xl"
        style={{ background: 'radial-gradient(ellipse at top left, rgba(99,102,241,0.2), transparent 50%), radial-gradient(ellipse at bottom right, rgba(139,92,246,0.1), transparent 50%), #0f172a' }}
      >
        <div className="p-3 pt-3 sm:p-5 md:px-5 md:pb-6 md:pt-5 lg:px-6 lg:pt-6 lg:pb-7">
        <div className="relative z-0 w-full min-w-0">
          {/* ⓘ + trust chip: full-width row on desktop (justify-between) so copy uses horizontal space like the header — no narrow centered column. */}
          <div className="flex flex-col gap-2 min-[360px]:flex-row min-[360px]:items-start min-[360px]:justify-between min-[360px]:gap-3 md:gap-5 lg:gap-8">
            <h1 className="min-w-0 flex-1 text-base font-semibold leading-tight tracking-tight text-white sm:text-lg md:text-2xl lg:text-3xl xl:text-[2rem] xl:leading-tight">
              Logistics &amp; delivery for Noida businesses
            </h1>
            <div className="flex max-w-full shrink-0 items-start justify-end gap-1.5 self-end min-[360px]:self-start min-[360px]:pt-0.5">
              <button
                type="button"
                onClick={() => setHeroPricingDetailsOpen(true)}
                className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/15 sm:h-8 sm:w-8"
                aria-label="Pricing details, how it works, and terms"
              >
                <Info className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2} aria-hidden />
              </button>
              <span className="inline-flex max-w-[min(13.5rem,calc(100vw-5.5rem))] items-start gap-1 rounded-2xl border border-amber-200/55 bg-gradient-to-br from-amber-50 via-amber-50 to-amber-100/90 px-2 py-1.5 text-[8px] font-semibold text-amber-950 shadow-md sm:max-w-none sm:items-center sm:gap-1.5 sm:px-2.5 sm:py-2 sm:text-[9px] md:text-[10px]">
                <Shield className="mt-0.5 h-2.5 w-2.5 shrink-0 text-amber-700 sm:mt-0 sm:h-3 sm:w-3" strokeWidth={2} aria-hidden />
                <span className="min-w-0 leading-snug">
                  <span className="block sm:inline">Trusted by 100+</span>{' '}
                  <span className="block sm:inline">Noida businesses</span>
                </span>
              </span>
            </div>
          </div>
          {/* Mobile: single teaser; full subcopy only ≥ sm (detail lives in ⓘ modal). */}
          <p className="mt-2 text-[10px] leading-snug text-slate-400 sm:hidden">
            <span className="font-semibold text-white">₹39/trip</span>
            <span className="text-slate-500"> 2W · </span>
            <span className="font-semibold text-white">₹299/trip</span>
            <span className="text-slate-500"> 3W packs</span>
            <span className="mt-1 block text-[9px] leading-snug text-slate-500">
              GST · live GPS · base fares &amp; terms in ⓘ
            </span>
          </p>
          <div className="hidden sm:contents">
            <h2 className="mt-1 text-[11px] font-medium text-slate-400 sm:mt-1.5 sm:text-xs md:text-sm">
              Same-day goods transport · GST-ready invoices
            </h2>
            <p className="mt-1.5 text-[10px] leading-snug text-slate-300 sm:mt-2 sm:text-[11px] md:text-xs">
              <span className="font-semibold text-white">From ₹39/trip</span>
              <span className="text-slate-500"> · 2W ad hoc · short-distance base fare</span>
            </p>
            <p className="mt-1 text-[10px] leading-snug text-slate-300 sm:text-[11px] md:text-xs">
              <span className="font-semibold text-white">From ₹299/trip</span>
              <span className="text-slate-500"> · 3W packs · base fare starting</span>
            </p>
            <p className="mt-1 text-[9px] text-slate-500 sm:mt-1 sm:text-[10px] md:text-xs">
              Same-day dispatch · Live GPS · 4.8★ · ~15 min avg. pickup
            </p>
          </div>
        </div>

        <div className="mt-2.5 grid w-full min-w-0 grid-cols-2 gap-2 sm:mt-4 sm:flex sm:flex-row sm:flex-wrap sm:gap-3">
          <button
            type="button"
            onClick={() => router.push(ROUTES.PICKUP_LOCATION)}
            className="flex min-h-10 items-center justify-center gap-1.5 rounded-xl bg-white px-2 py-2 text-[11px] font-semibold text-slate-900 shadow-sm transition-all duration-200 hover:shadow-md active:scale-[0.98] sm:min-h-11 sm:gap-2 sm:px-5 sm:py-2.5 sm:text-sm md:w-auto md:px-6"
          >
            <Truck className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" strokeWidth={2} aria-hidden />{' '}
            <span className="leading-tight">Book Delivery</span>
          </button>
          <button
            type="button"
            onClick={() => router.push(ROUTES.PLANS)}
            className="flex min-h-10 items-center justify-center gap-1 rounded-xl border border-white/15 bg-white/5 px-2 py-2 text-[10px] font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/10 sm:min-h-11 sm:px-4 sm:py-2.5 sm:text-xs md:text-sm"
          >
            Plans &amp; Pricing
          </button>
        </div>
        </div>
      </section>
      <div id={NOIDA_PICKUP_SENTINEL_ID} className="h-px w-full shrink-0" aria-hidden />
      </div>

      {heroPricingDetailsOpen ? (
        <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-4" role="presentation">
          <button
            type="button"
            className="absolute inset-0 z-0 bg-slate-900/45 backdrop-blur-[2px] transition-opacity"
            aria-label="Close pricing details"
            onClick={() => setHeroPricingDetailsOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="hero-pricing-details-title"
            className="relative z-10 flex max-h-[min(88vh,100dvh)] w-full max-w-md flex-col overflow-hidden rounded-t-[1.35rem] bg-white shadow-2xl ring-1 ring-slate-900/[0.06] sm:max-h-[min(92vh,880px)] sm:rounded-2xl"
          >
            <div className="flex shrink-0 justify-center pt-2.5 sm:hidden" aria-hidden>
              <div className="h-1 w-11 rounded-full bg-slate-200/90" />
            </div>
            <div className="flex shrink-0 items-start justify-between gap-3 border-b border-slate-100 bg-gradient-to-br from-slate-50 via-white to-[var(--color-primary)]/[0.04] px-4 pb-3 pt-2 sm:px-5 sm:pb-4 sm:pt-4">
              <div className="min-w-0 pt-0.5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">Noida · B2B delivery</p>
                <h2 id="hero-pricing-details-title" className="mt-0.5 text-lg font-bold tracking-tight text-slate-900">
                  Pricing, savings &amp; terms
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setHeroPricingDetailsOpen(false)}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-slate-200/80 bg-white text-slate-500 shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800"
                aria-label="Close"
              >
                <X className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-gradient-to-b from-slate-50/90 to-white px-3 py-3 sm:px-4 sm:py-4">
              <div className="space-y-3 sm:space-y-3.5">
                <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-sm sm:hidden">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Overview</p>
                  <p className="mt-2 text-[12px] leading-relaxed text-slate-700">
                    Same-day goods transport · GST-ready invoices
                  </p>
                  <p className="mt-2 text-[12px] leading-relaxed text-slate-600">
                    <span className="font-semibold text-slate-900">From ₹39/trip</span> · 2W ad hoc · short-distance base fare.
                  </p>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-slate-600">
                    <span className="font-semibold text-slate-900">From ₹299/trip</span> · 3W packs · base fare starting.
                  </p>
                  <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
                    Same-day dispatch · Live GPS · 4.8★ rated · ~15 min avg. pickup in zone.
                  </p>
                </div>
                <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-2">
                  {NOIDA_QUICK_FARE_MODAL_ENTRIES.map((block) => (
                    <div
                      key={block.title}
                      className="rounded-2xl border border-slate-200/70 bg-white p-3.5 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.12)] sm:p-4"
                    >
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--color-primary)]">{block.kicker}</p>
                      <p className="mt-1 text-sm font-bold text-slate-900">{block.title}</p>
                      <p className="mt-2 text-[12px] leading-relaxed text-slate-600">{block.body}</p>
                    </div>
                  ))}
                </div>

                <p className="rounded-xl border border-slate-200/80 bg-slate-50 px-3 py-2.5 text-[11px] leading-relaxed text-slate-600">
                  <span className="font-semibold text-slate-800">Quick read:</span>{' '}
                  <span className="whitespace-nowrap">₹39</span> = short-distance{' '}
                  <span className="whitespace-nowrap">2W</span> ad hoc base;{' '}
                  <span className="whitespace-nowrap">₹299</span> = 3W pack base fare starting (tiers like Growth at ₹440 add more). One-off 3W is usually above pack base before tolls. Live quote before you pay.
                </p>

                <div className="rounded-2xl border border-emerald-100/80 bg-gradient-to-b from-emerald-50/40 to-white p-4 shadow-[0_8px_30px_-12px_rgba(5,150,105,0.12)]">
                  <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-emerald-900/75">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
                      <Handshake className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
                    </span>
                    Straightforward for both sides
                  </div>
                  <ul className="mt-3 space-y-2 text-[13px] leading-relaxed text-slate-700">
                    <li className="flex gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" strokeWidth={2.25} aria-hidden />
                      <span>
                        <strong className="text-slate-900">You</strong> choose flexibility (ad hoc) or savings and predictability (packs). No hidden demand multipliers on included pack trips within plan limits.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" strokeWidth={2.25} aria-hidden />
                      <span>
                        <strong className="text-slate-900">Liftngo</strong> can offer sharper pack rates when volume is committed — we stay transparent on tolls, validity, distance caps, and pass-throughs.
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.12)]">
                  <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                      <FileText className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
                    </span>
                    Policy summary (packs &amp; bookings)
                  </div>
                  <ul className="mt-3 space-y-2.5 text-[12px] leading-snug text-slate-600">
                    {SUBSCRIPTION_COMPLIANCE_BULLETS.map((line, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-400/80" aria-hidden />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl bg-slate-100/80 px-3 py-2.5 text-[11px] leading-snug text-slate-600">
                  {INDICATIVE_PRICING_FOOTNOTE}
                </div>

                <div className="flex flex-col gap-2 pb-1 sm:flex-row sm:flex-wrap">
                  <Link
                    href={ROUTES.PLANS}
                    onClick={() => setHeroPricingDetailsOpen(false)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-center text-xs font-semibold text-white shadow-sm transition-opacity hover:opacity-95"
                  >
                    View plans &amp; calculators
                    <ArrowRight className="h-3.5 w-3.5 shrink-0" strokeWidth={2} aria-hidden />
                  </Link>
                  <Link
                    href="/terms"
                    onClick={() => setHeroPricingDetailsOpen(false)}
                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-center text-xs font-semibold text-slate-800 transition-colors hover:bg-slate-50"
                  >
                    Full Terms of Service
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* ── MOST POPULAR PLAN — progressive disclosure (details in modal) ─ */}
      <section aria-labelledby="affordable-transport-plans">
        <h2 id="affordable-transport-plans" className="mb-2 px-0.5 text-sm font-semibold text-gray-900 md:text-base lg:text-lg">
          Affordable Transport Plans
        </h2>
        <div className="relative overflow-hidden rounded-2xl bg-white p-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg sm:p-4 md:p-5">
          <div className="absolute right-2 top-2 z-[1] flex max-w-[calc(100%-1rem)] items-start gap-1.5 sm:right-3 sm:top-3 md:right-4 md:top-4">
            <button
              type="button"
              onClick={() => setGrowthPlanDetailsOpen(true)}
              className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 shadow-sm transition-colors hover:bg-gray-100"
              aria-label="Plan details"
            >
              <Info className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
            </button>
            <div className="flex min-w-0 flex-col items-end gap-1">
              <span className="inline-flex items-center gap-0.5 rounded-full border border-amber-200/50 bg-gradient-to-r from-amber-50 to-amber-100/70 px-2 py-0.5 text-[9px] font-medium text-amber-950 shadow-sm sm:gap-1 sm:px-2.5 sm:text-[10px] md:text-xs">
                <Star className="h-2.5 w-2.5 shrink-0 fill-amber-400 text-amber-500 drop-shadow-[0_0_1px_rgba(217,119,6,0.35)] sm:h-3 sm:w-3" strokeWidth={1.5} aria-hidden /> Most Popular
              </span>
              <span className="rounded-full border border-amber-100/80 bg-amber-50/90 px-2 py-0.5 text-[9px] font-semibold text-amber-900/90 sm:text-[10px]">
                {subscriptionPackSavingsLabel(NOIDA_HIGHLIGHT_3W_PACK)}
              </span>
            </div>
          </div>

          <div className="relative z-0 pr-[7.5rem] sm:pr-40 md:pr-44">
            <div className="flex min-w-0 flex-wrap items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                {formatSubscriptionRupee(NOIDA_HIGHLIGHT_3W_PACK.total)}
              </span>
              <span className="text-xs text-gray-400 line-through sm:text-sm">
                {formatSubscriptionRupee(NOIDA_HIGHLIGHT_3W_PACK.payPerUse * NOIDA_HIGHLIGHT_3W_PACK.trips)}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-gray-500 sm:mt-1 sm:text-sm">
              {NOIDA_HIGHLIGHT_3W_PACK.trips} trips · {formatSubscriptionRupee(NOIDA_HIGHLIGHT_3W_PACK.perTrip)}/trip ·{' '}
              {NOIDA_HIGHLIGHT_3W_PACK.features[0]}
            </p>
            <p className="mt-2 text-[10px] font-medium text-amber-800/90 sm:mt-2 sm:text-xs">Best for daily business deliveries</p>
          </div>
          <button
            type="button"
            onClick={() => router.push(subscriptionPackLockHref(NOIDA_HIGHLIGHT_3W_PACK))}
            className="mt-3 flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] py-2.5 text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:shadow-md active:scale-[0.98] sm:mt-4 sm:min-h-12 sm:py-3.5 sm:text-sm md:min-h-11 md:py-3"
          >
            Lock {NOIDA_HIGHLIGHT_3W_PACK.name} plan <ArrowRight className="h-4 w-4 shrink-0" />
          </button>
        </div>

        {growthPlanDetailsOpen ? (
          <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-4" role="presentation">
            <button
              type="button"
              className="absolute inset-0 z-0 bg-slate-900/45 backdrop-blur-[2px] transition-opacity"
              aria-label="Close plan details"
              onClick={() => setGrowthPlanDetailsOpen(false)}
            />
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="growth-plan-details-title"
              className="relative z-10 flex max-h-[min(88vh,100dvh)] w-full max-w-md flex-col overflow-hidden rounded-t-[1.35rem] bg-white shadow-2xl ring-1 ring-slate-900/[0.06] sm:max-h-[min(92vh,880px)] sm:rounded-2xl"
            >
              <div className="flex shrink-0 justify-center pt-2.5 sm:hidden" aria-hidden>
                <div className="h-1 w-11 rounded-full bg-slate-200/90" />
              </div>
              <div className="flex shrink-0 items-start justify-between gap-3 border-b border-slate-100 bg-gradient-to-br from-slate-50 via-white to-[var(--color-primary)]/[0.04] px-4 pb-3 pt-2 sm:px-5 sm:pb-4 sm:pt-4">
                <div className="min-w-0 pt-0.5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    {NOIDA_HIGHLIGHT_3W_PACK.name} · 3W pack
                  </p>
                  <h3 id="growth-plan-details-title" className="mt-0.5 text-lg font-bold tracking-tight text-slate-900">
                    Plan Details
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setGrowthPlanDetailsOpen(false)}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-slate-200/80 bg-white text-slate-500 shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" strokeWidth={2} />
                </button>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-gradient-to-b from-slate-50/90 to-white px-3 py-3 sm:px-4 sm:py-4">
                <div className="space-y-3 sm:space-y-3.5">
                  <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.12)]">
                    <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                        <MapPin className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
                      </span>
                      Distance &amp; route
                    </div>
                    <ul className="mt-3 space-y-2 text-[13px] leading-relaxed text-slate-600">
                      <li className="flex gap-2">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--color-primary)]/50" aria-hidden />
                        Typical run: ~6–10 km/trip
                      </li>
                      <li className="flex gap-2">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--color-primary)]/50" aria-hidden />
                        Max: ~12 km/trip in-pack
                      </li>
                      <li className="flex gap-2">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--color-primary)]/50" aria-hidden />
                        Extra distance &amp; out-of-pack legs — quoted or billed separately
                      </li>
                    </ul>
                    <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-[11px] leading-snug text-slate-500">
                      Handoffs at your premises — loading / unloading timelines are on the client side unless your agreement defines otherwise.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.12)]">
                    <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                        <Receipt className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
                      </span>
                      Billing &amp; pass-throughs
                    </div>
                    <ul className="mt-3 space-y-2 text-[13px] leading-relaxed text-slate-600">
                      <li className="flex gap-2">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-emerald-500/60" aria-hidden />
                        GST-compliant invoicing on applicable charges
                      </li>
                      <li className="flex gap-2">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-emerald-500/60" aria-hidden />
                        Tolls, permits &amp; similar charges on actuals (incl. intra-state &amp; inter-state routes)
                      </li>
                    </ul>
                  </div>

                  <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.12)]">
                    <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-800">
                        <CalendarDays className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
                      </span>
                      Validity
                    </div>
                    <p className="mt-3 text-[13px] leading-relaxed text-slate-600">
                      30-day pack validity from activation — start date as in your order or agreement.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-emerald-100/80 bg-gradient-to-b from-emerald-50/50 to-white p-4 shadow-[0_8px_30px_-12px_rgba(5,150,105,0.15)]">
                    <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-emerald-900/70">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
                        <Sparkles className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
                      </span>
                      What&apos;s included upfront
                    </div>
                    <ul className="mt-3 space-y-2.5">
                      {SUBSCRIPTION_PACK_BENEFITS.map((line, i) => (
                        <li key={i} className="flex gap-2.5 rounded-xl bg-white/70 px-2.5 py-2 text-[13px] leading-snug text-slate-700 ring-1 ring-emerald-100/60">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" strokeWidth={2.25} aria-hidden />
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </section>

      {/* ── CUSTOM PLAN BUILDER — rich entry ────────────── */}
      <section className="flex flex-col gap-3 sm:gap-4" aria-labelledby="noida-fleet-card-title">
        <div
          role="button"
          tabIndex={0}
          aria-labelledby="noida-fleet-card-title"
          className="group relative w-full cursor-pointer rounded-2xl bg-white p-2.5 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md max-sm:pb-3 sm:p-3.5 md:p-4"
          onClick={goFleetCustomPlans}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              goFleetCustomPlans();
            }
          }}
        >
          <span className="sr-only">Cargo and goods vehicles only. Passenger rides are not available.</span>
          {/* Top-right cluster — same pattern as Growth tile; keeps body copy full-width without a tall header row. */}
          <div className="pointer-events-none absolute right-2 top-2 z-10 flex items-start gap-1 sm:right-3 sm:top-3 sm:gap-1.5 md:right-3.5 md:top-3.5">
            <button
              type="button"
              className="pointer-events-auto grid h-7 w-7 shrink-0 place-items-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition-colors hover:bg-gray-50 sm:h-8 sm:w-8"
              aria-label="How fleet pricing and the calculator work"
              onClick={(e) => {
                e.stopPropagation();
                setFleetBuilderDetailsOpen(true);
              }}
            >
              <Info className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2} aria-hidden />
            </button>
            <span
              className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-primary)]/15 to-violet-100/80 text-[var(--color-primary)] shadow-sm ring-1 ring-[var(--color-primary)]/10 transition-transform duration-200 group-hover:scale-[1.02] sm:h-11 sm:w-11 sm:rounded-2xl pointer-events-none"
              aria-hidden
            >
              <Truck className="h-3.5 w-3.5 sm:h-5 sm:w-5" strokeWidth={1.75} />
              <span className="absolute -right-px -top-px flex h-4 w-4 items-center justify-center rounded-full border border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100/90 shadow-md ring-1 ring-amber-100/80 sm:-right-0.5 sm:-top-0.5 sm:h-5 sm:w-5">
                <Package className="h-2 w-2 text-amber-800 sm:h-2.5 sm:w-2.5" strokeWidth={2.5} aria-hidden />
              </span>
            </span>
          </div>

          <div className="min-w-0 pr-[5.25rem] sm:pr-[6.75rem] md:pr-[7.25rem]">
            <h3 id="noida-fleet-card-title" className="text-sm font-semibold text-gray-900 md:text-base">
              Build Your Custom Plan
            </h3>
            <p className="mt-0.5 text-[11px] text-gray-500 sm:text-xs">
              <span className="sm:hidden">2W · 3W · 4W · parcels &amp; bulk</span>
              <span className="hidden sm:inline">Mix 2W · 3W · 4W — see totals before you book</span>
            </p>
            <div className="mt-1.5 hidden flex-wrap items-center gap-2 sm:mt-2 sm:flex">
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

          <div className="mt-2 grid min-w-0 grid-cols-3 gap-1 sm:mt-2 sm:gap-2 md:gap-2.5">
            {NOIDA_FLEET_TILES.map((v) => (
              <div
                key={v.label}
                className="flex min-w-0 flex-col items-center overflow-x-clip rounded-lg bg-gradient-to-b from-slate-50/90 to-white py-0 shadow-sm ring-1 ring-slate-900/[0.04] transition-all duration-150 group-hover:shadow-md group-hover:ring-slate-900/[0.06] sm:rounded-xl sm:py-px"
              >
                <div className="relative h-[2rem] w-full shrink-0 pointer-events-none sm:h-[2.875rem] md:h-[3.125rem]">
                  <Image
                    src={v.img}
                    alt={v.alt}
                    fill
                    className="object-contain object-bottom px-0.5 sm:px-1"
                    sizes="(max-width:640px) 34vw, 120px"
                    unoptimized
                  />
                </div>
                <div className="w-full space-y-0.5 px-0.5 pb-1 pt-0 text-center leading-none sm:space-y-1 sm:px-1 sm:pb-1.5 sm:pt-px">
                  <p className="text-[8px] font-semibold leading-none text-gray-800 sm:text-[10px]">{v.label}</p>
                  <p className="flex items-baseline justify-center gap-0.5 tabular-nums">
                    <span className="text-[7px] font-normal text-gray-400 sm:text-[8px]">from</span>
                    <span className="text-[10px] font-bold leading-none text-gray-900 sm:text-xs md:text-sm">{v.price}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-2 flex min-h-10 items-center justify-between gap-2 rounded-xl bg-[var(--color-primary)] px-2.5 py-2 text-white shadow-sm ring-1 ring-black/5 transition-[box-shadow] group-hover:shadow-md sm:mt-2.5 sm:min-h-11 sm:px-3.5 sm:py-2.5">
            <span className="min-w-0 text-xs font-semibold leading-tight tracking-tight sm:text-sm">
              Open calculator
            </span>
            <span className="flex shrink-0 items-center gap-1.5 text-white/95">
              <span className="inline-flex items-center gap-0.5 tabular-nums text-[10px] font-medium text-white/85 sm:gap-1 sm:text-[11px]">
                <Clock className="h-3 w-3 shrink-0 opacity-85 sm:h-3.5 sm:w-3.5" aria-hidden /> ~30 sec
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 sm:h-[1.125rem] sm:w-[1.125rem]" strokeWidth={2.25} aria-hidden />
            </span>
          </div>

          <p className="mt-2.5 text-center text-[8px] leading-snug text-gray-400 sm:mt-3 sm:text-[9px]">
            <span className="sm:hidden">Indicative “from” prices · full detail in ⓘ</span>
            <span className="hidden sm:inline">
              *Indicative “from” prices — vary by distance, vehicle &amp; plan ·{' '}
              <Link href="/terms" className="underline" onClick={(e) => e.stopPropagation()}>
                T&amp;C
              </Link>
            </span>
          </p>
        </div>

        {fleetBuilderDetailsOpen ? (
          <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-4" role="presentation">
            <button
              type="button"
              className="absolute inset-0 z-0 bg-slate-900/45 backdrop-blur-[2px]"
              aria-label="Close fleet pricing details"
              onClick={() => setFleetBuilderDetailsOpen(false)}
            />
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="fleet-builder-details-title"
              className="relative z-10 flex max-h-[min(88vh,100dvh)] w-full max-w-md flex-col overflow-hidden rounded-t-[1.35rem] bg-white shadow-2xl ring-1 ring-slate-900/[0.06] sm:max-h-[min(92vh,880px)] sm:rounded-2xl"
            >
              <div className="flex shrink-0 justify-center pt-2.5 sm:hidden" aria-hidden>
                <div className="h-1 w-11 rounded-full bg-slate-200/90" />
              </div>
              <div className="flex shrink-0 items-start justify-between gap-3 border-b border-slate-100 bg-gradient-to-br from-slate-50 via-white to-[var(--color-primary)]/[0.04] px-4 pb-3 pt-2 sm:px-5 sm:pb-4 sm:pt-4">
                <div className="min-w-0 pt-0.5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">Fleet calculator</p>
                  <h3 id="fleet-builder-details-title" className="mt-0.5 text-lg font-bold tracking-tight text-slate-900">
                    Custom plan &amp; pricing
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setFleetBuilderDetailsOpen(false)}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-slate-200/80 bg-white text-slate-500 shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" strokeWidth={2} />
                </button>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-gradient-to-b from-slate-50/90 to-white px-3 py-3 sm:px-4 sm:py-4">
                <div className="space-y-3">
                  <p className="text-[12px] leading-relaxed text-slate-600">
                    The calculator walks you through route, vehicle class, and trips — your total updates as you change inputs (~30 sec for most users).
                  </p>
                  <div className="rounded-2xl border border-slate-200/70 bg-white p-3.5 shadow-sm">
                    <p className="text-[11px] font-semibold text-slate-500">Indicative “from” (Noida)</p>
                    <ul className="mt-2 space-y-1.5 text-[13px] text-slate-700">
                      {NOIDA_FLEET_TILES.map((v) => (
                        <li key={v.label} className="flex justify-between gap-2">
                          <span>{v.label}</span>
                          <span className="font-semibold tabular-nums text-slate-900">from {v.price}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-2 text-[11px] leading-snug text-slate-500">
                      Shown amounts are entry points for short / typical lanes; tolls, distance, stops, and vehicle specifics change your live quote.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-emerald-100/80 bg-gradient-to-b from-emerald-50/40 to-white p-3.5">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-900/75">Why use the calculator</p>
                    <ul className="mt-2 space-y-2 text-[13px] leading-relaxed text-slate-700">
                      <li className="flex gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" strokeWidth={2.25} aria-hidden />
                        <span>
                          <strong className="text-slate-900">You</strong> see an itemized quote before you commit — fewer surprises and easier approvals.
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" strokeWidth={2.25} aria-hidden />
                        <span>
                          <strong className="text-slate-900">Liftngo</strong> matches the right vehicle class to your load so trips are priced fairly and routes stay efficient at volume.
                        </span>
                      </li>
                    </ul>
                  </div>
                  <p className="rounded-xl bg-slate-100/80 px-3 py-2.5 text-[11px] leading-snug text-slate-600">{INDICATIVE_PRICING_FOOTNOTE}</p>
                  <div className="flex flex-col gap-2 pb-1 sm:flex-row">
                    <Link
                      href={ROUTES.PLANS_CUSTOM}
                      onClick={() => setFleetBuilderDetailsOpen(false)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-center text-xs font-semibold text-white shadow-sm hover:opacity-95"
                    >
                      Open custom calculator
                      <ArrowRight className="h-3.5 w-3.5 shrink-0" strokeWidth={2} aria-hidden />
                    </Link>
                    <Link
                      href="/terms"
                      onClick={() => setFleetBuilderDetailsOpen(false)}
                      className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-center text-xs font-semibold text-slate-800 hover:bg-slate-50"
                    >
                      Terms of Service
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <button
          type="button"
          onClick={onOpenChooseTrip}
          className="group flex w-full min-w-0 flex-row items-center gap-3 rounded-2xl bg-white px-3.5 py-3.5 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:gap-4 sm:px-4 sm:py-4 md:gap-5 md:px-5 md:py-5"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center self-center rounded-xl bg-emerald-50 text-emerald-500 sm:h-11 sm:w-11">
            <Zap className="h-[1.05rem] w-[1.05rem] sm:h-5 sm:w-5" strokeWidth={1.5} />
          </span>
          <div className="min-w-0 flex-1 self-center text-left">
            <p className="text-xs font-semibold leading-snug text-gray-900 sm:text-sm md:text-base">Quick Book</p>
            <p className="mt-1 line-clamp-2 text-[9px] leading-snug text-gray-500 sm:mt-1 sm:text-[11px] md:text-xs">
              Frequent routes · 1-tap repeat
            </p>
          </div>
          <span className="flex min-h-10 shrink-0 items-center justify-center self-center rounded-xl bg-[var(--color-primary)] px-3 py-2.5 text-[9px] font-semibold text-white shadow-sm transition-all group-hover:shadow-md sm:min-h-11 sm:px-3.5 sm:py-3 sm:text-[10px]">
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
        <div className="grid min-w-0 grid-cols-2 gap-2 sm:gap-3 md:gap-4 lg:grid-cols-3 2xl:grid-cols-6">
          {CORE_SERVICES.map((svc) => {
            const Icon = svc.icon;
            const isPrimary = svc.primaryCta === true;
            const tile = SERVICE_TILE_STYLES[svc.accent];
            const cardSurface =
              isPrimary && tile.cardHero !== undefined ? tile.cardHero : tile.card;
            return (
              <button
                key={svc.title}
                type="button"
                onClick={() => router.push(svc.href)}
                className={`group flex h-full min-h-0 w-full flex-col gap-2 rounded-xl border p-2.5 text-left transition-all duration-300 sm:gap-3 sm:p-3 md:gap-4 md:p-4 ${cardSurface}`}
              >
                <div className="flex min-h-0 items-start gap-1.5 sm:gap-2">
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ring-1 transition-colors duration-300 sm:h-9 sm:w-9 sm:rounded-lg ${tile.icon}`}
                  >
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
                    isPrimary ? 'bg-[var(--color-primary)] text-white shadow-sm hover:opacity-90 active:scale-[0.98]' : tile.ctaOutline
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

        <div
          role="button"
          tabIndex={0}
          onClick={() => router.push('/noida/coconut')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              router.push('/noida/coconut');
            }
          }}
          className="group mt-2 flex w-full min-w-0 cursor-pointer flex-row items-center overflow-hidden rounded-xl border border-sky-200/55 bg-gradient-to-br from-white via-sky-50/50 to-cyan-50/35 text-left shadow-md ring-1 ring-sky-100/55 transition-all duration-200 hover:-translate-y-px hover:border-sky-300/60 hover:shadow-lg hover:ring-cyan-100/70 sm:rounded-2xl"
          style={{ boxShadow: '0 4px 20px -8px rgba(14,165,233,0.22)' }}
        >
          <div className="relative h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden bg-gradient-to-br from-sky-200/90 to-cyan-100 sm:h-[5.25rem] sm:w-[5.25rem] md:h-24 md:w-24">
            <Image
              src="/noida/coconut-summer-hero.png"
              alt="Fresh coconut water delivery in Noida Sector 53 — Liftngo local marketplace"
              fill
              className="scale-[1.12] object-cover object-[50%_42%] brightness-[1.06] contrast-[1.04] saturate-[1.12] transition-transform duration-300 group-hover:scale-[1.18] sm:scale-[1.15] sm:group-hover:scale-[1.22]"
              sizes="(max-width:640px) 72px, 112px"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/25 via-transparent to-amber-400/20 mix-blend-soft-light"
              aria-hidden
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-sky-950/15 to-transparent" aria-hidden />
          </div>
          <div className="flex min-h-0 min-w-0 flex-1 flex-col justify-center gap-1.5 py-2.5 pl-2.5 pr-2.5 sm:gap-2 sm:py-3 sm:pl-3 sm:pr-3 md:py-3.5">
            <div className="flex flex-wrap items-center gap-1">
              <span className="rounded-full bg-sky-100 px-1.5 py-px text-[8px] font-semibold text-sky-800 ring-1 ring-sky-200/60 sm:px-2 sm:text-[9px]">Popular</span>
              <span className="rounded-full bg-emerald-100 px-1.5 py-px text-[8px] font-semibold text-emerald-800 ring-1 ring-emerald-200/60 sm:px-2 sm:text-[9px]">Live</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold leading-tight tracking-tight text-slate-900 sm:text-[13px]">Fresh Coconut Water</p>
              <p className="mt-0.5 text-[9px] leading-snug text-slate-600 sm:text-[10px]">Sector 53 · ~30 min · Ice-cold</p>
            </div>
            <span className="mt-0.5 flex min-h-9 w-full items-center justify-center gap-1 rounded-lg bg-gradient-to-r from-sky-500 via-sky-500 to-cyan-500 py-2 text-[10px] font-semibold text-white shadow-sm transition-all duration-200 group-hover:from-sky-600 group-hover:to-cyan-500 group-hover:shadow-md active:scale-[0.99] sm:min-h-10 sm:text-[11px]">
              Order now
              <ArrowRight className="h-2.5 w-2.5 shrink-0 sm:h-3 sm:w-3" strokeWidth={2.5} />
            </span>
          </div>
        </div>

        <p className="mt-1.5 text-center text-[8px] leading-tight text-sky-600/75">Combos &amp; secure pay — tap the card</p>

        <div className="mt-2 grid min-w-0 grid-cols-2 gap-2 sm:mt-2.5 sm:gap-3">
          {ORDER_FRESH_LOCAL.filter((i) => !i.available).map((item) => {
            const accent: LocalUpcomingAccent = item.accent ?? 'amber';
            const st = LOCAL_UPCOMING_STYLES[accent];
            return (
              <div
                key={item.name}
                className={`flex min-h-0 min-w-0 flex-col rounded-xl border p-2 sm:p-2.5 ${st.card}`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-base sm:h-9 sm:w-9 sm:text-lg ${st.icon}`}
                    aria-hidden
                  >
                    {item.emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-[9px] font-semibold leading-tight text-slate-900 sm:text-[10px]">{item.name}</p>
                    <span className="mt-0.5 inline-flex rounded-full bg-slate-100/95 px-1.5 py-px text-[6px] font-semibold uppercase tracking-wide text-slate-500 ring-1 ring-slate-200/80 sm:text-[7px]">
                      Soon
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => router.push(ROUTES.CONTACT)}
                  className={`mt-2 w-full rounded-lg px-2 py-2 sm:mt-2.5 sm:py-2.5 ${st.btn}`}
                >
                  Notify
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-2.5 flex items-center justify-center gap-1.5 border-t border-sky-100/70 pt-2 sm:mt-3 sm:gap-2">
          <p className="text-center text-[8px] leading-snug text-sky-600/85 sm:text-[9px]">
            <span className="sm:hidden">Teasers aren&apos;t offers · ETAs &amp; terms in </span>
            <span className="hidden sm:inline">Availability &amp; pricing at checkout · terms in </span>
          </p>
          <button
            type="button"
            onClick={() => setOrderFreshLegalOpen(true)}
            className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-sky-200/90 bg-white text-sky-600 shadow-sm transition-colors hover:bg-sky-50 sm:h-7 sm:w-7"
            aria-label="Fresh and Local: availability, Notify, and terms"
          >
            <Info className="h-3 w-3 sm:h-3.5 sm:w-3.5" strokeWidth={2} aria-hidden />
          </button>
        </div>
      </section>

      {orderFreshLegalOpen ? (
        <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-4" role="presentation">
          <button
            type="button"
            className="absolute inset-0 z-0 bg-slate-900/45 backdrop-blur-[2px] transition-opacity"
            aria-label="Close Fresh and Local details"
            onClick={() => setOrderFreshLegalOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-fresh-legal-title"
            className="relative z-10 flex max-h-[min(88vh,100dvh)] w-full max-w-md flex-col overflow-hidden rounded-t-[1.35rem] bg-white shadow-2xl ring-1 ring-slate-900/[0.06] sm:max-h-[min(92vh,880px)] sm:rounded-2xl"
          >
            <div className="flex shrink-0 justify-center pt-2.5 sm:hidden" aria-hidden>
              <div className="h-1 w-11 rounded-full bg-slate-200/90" />
            </div>
            <div className="flex shrink-0 items-start justify-between gap-3 border-b border-slate-100 bg-gradient-to-br from-slate-50 via-white to-[var(--color-primary)]/[0.04] px-4 pb-3 pt-2 sm:px-5 sm:pb-4 sm:pt-4">
              <div className="min-w-0 pt-0.5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">Fresh &amp; local · Noida</p>
                <h2 id="order-fresh-legal-title" className="mt-0.5 text-lg font-bold tracking-tight text-slate-900">
                  What this section means
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setOrderFreshLegalOpen(false)}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-slate-200/80 bg-white text-slate-500 shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800"
                aria-label="Close"
              >
                <X className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-gradient-to-b from-slate-50/90 to-white px-3 py-3 sm:px-4 sm:py-4">
              <div className="space-y-3">
                <p className="text-[12px] leading-relaxed text-slate-600">
                  Local offers sit next to your logistics tools on this screen — the cards below spell out what is binding vs. what is only indicative.
                </p>
                <div className="rounded-2xl border border-emerald-100/80 bg-gradient-to-b from-emerald-50/40 to-white p-3.5 shadow-[0_8px_30px_-12px_rgba(5,150,105,0.12)]">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-900/75">Before you order</p>
                  <ul className="mt-2 space-y-2 text-[13px] leading-relaxed text-slate-700">
                    <li className="flex gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" strokeWidth={2.25} aria-hidden />
                      <span>
                        Teasers on this dashboard are <strong className="text-slate-900">not offers</strong>. Final availability, ETAs, and prices appear on the product page and at checkout.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" strokeWidth={2.25} aria-hidden />
                      <span>
                        <strong className="text-slate-900">&quot;Soon&quot;</strong> items are not sold here yet. <strong className="text-slate-900">Notify</strong> only records interest via contact — not a booking, reservation, or waitlist commitment.
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="rounded-2xl border border-slate-200/70 bg-white p-3.5 shadow-sm">
                  <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                      <FileText className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
                    </span>
                    Terms &amp; marketplace
                  </div>
                  <p className="mt-3 text-[13px] leading-relaxed text-slate-700">
                    Your use of Liftngo, including marketplace-style checkout flows, is governed by our{' '}
                    <Link
                      href="/terms"
                      onClick={() => setOrderFreshLegalOpen(false)}
                      className="font-semibold text-[var(--color-primary)] underline decoration-[var(--color-primary)]/30 underline-offset-2 hover:opacity-90"
                    >
                      Terms of Service
                    </Link>
                    .
                  </p>
                </div>
                <div className="flex flex-col gap-2 pb-1 sm:flex-row sm:flex-wrap">
                  <button
                    type="button"
                    onClick={() => setOrderFreshLegalOpen(false)}
                    className="inline-flex items-center justify-center rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-center text-xs font-semibold text-white shadow-sm transition-opacity hover:opacity-95"
                  >
                    Got it
                  </button>
                  <Link
                    href="/terms"
                    onClick={() => setOrderFreshLegalOpen(false)}
                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-center text-xs font-semibold text-slate-800 transition-colors hover:bg-slate-50"
                  >
                    Terms of Service
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* ── SUBSCRIPTION STRIP — consistent CTAs, centered badges, ⓘ policy modal ─ */}
      <section
        id="pricing-plans"
        className="scroll-mt-20 rounded-2xl p-2.5 shadow-sm ring-1 ring-stone-200/65 sm:p-3 md:p-4"
        style={{
          background: 'linear-gradient(165deg, #faf9f7 0%, #ffffff 40%, rgba(240,253,250,0.4) 100%)',
        }}
        aria-labelledby="subscription-plans-noida"
      >
        <div className="mb-1.5 flex items-start justify-between gap-2 px-0.5 sm:mb-2 sm:items-center">
          <div className="min-w-0 flex-1">
            <h3 id="subscription-plans-noida" className="text-sm font-semibold tracking-tight text-stone-900 md:text-base">
              Subscription plans in Noida
            </h3>
            <p className="mt-0.5 text-[9px] font-medium text-stone-500 sm:text-[10px]">
              Pack pricing · detail &amp; compliance in ⓘ
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
            <button
              type="button"
              onClick={() => setSubscriptionStripInfoOpen(true)}
              className="grid h-7 w-7 place-items-center rounded-full border border-stone-200/90 bg-white text-stone-500 shadow-sm transition-colors hover:bg-stone-50 hover:text-stone-800 sm:h-8 sm:w-8"
              aria-label="Subscription packs: benefits, validity, and terms"
            >
              <Info className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2} aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => router.push(ROUTES.PLANS)}
              className="rounded-lg border border-stone-200/80 bg-white px-2 py-1.5 text-[10px] font-semibold text-[var(--color-primary)] shadow-sm transition-colors hover:bg-stone-50 sm:px-2.5 sm:py-2"
            >
              View all <ChevronRight className="mb-px inline h-3 w-3" strokeWidth={2.25} aria-hidden />
            </button>
          </div>
        </div>
        <div className="grid min-w-0 grid-cols-2 gap-1.5 sm:gap-2 md:grid-cols-2 lg:grid-cols-4 lg:gap-2.5 xl:gap-3">
          {SUBSCRIPTION_NOIDA_STRIP_PLANS.map((plan) => {
            const hasRibbon = plan.popular === true || plan.offer === true;
            const btnPopular = plan.popular === true;
            return (
              <div
                key={plan.name}
                className={`relative flex w-full min-w-0 flex-col rounded-xl border bg-white/90 p-2 text-center shadow-sm transition-all duration-200 hover:-translate-y-px hover:shadow-md sm:p-2.5 md:p-3 ${
                  plan.popular
                    ? 'border-[var(--color-primary)]/35 ring-2 ring-[var(--color-primary)]/18'
                    : plan.offer
                      ? 'border-amber-200/55 ring-1 ring-amber-100/50'
                      : 'border-stone-200/70 ring-1 ring-stone-100/60'
                }`}
              >
                {plan.popular ? (
                  <span className="absolute -top-2 left-1/2 z-[1] -translate-x-1/2 whitespace-nowrap rounded-full border border-amber-200/50 bg-gradient-to-r from-amber-50 to-amber-100/80 px-2 py-px text-[8px] font-semibold text-amber-950 shadow-sm">
                    <Star className="mb-px inline h-2 w-2 fill-amber-400 text-amber-500" strokeWidth={1.5} aria-hidden /> Popular
                  </span>
                ) : null}
                {plan.offer && !plan.popular ? (
                  <span className="absolute -top-2 left-1/2 z-[1] -translate-x-1/2 whitespace-nowrap rounded-full border border-amber-200/45 bg-gradient-to-r from-amber-50/95 to-amber-100/70 px-2 py-px text-[8px] font-semibold text-amber-950 shadow-sm">
                    <Star className="mb-px inline h-2 w-2 fill-amber-400 text-amber-500" strokeWidth={1.5} aria-hidden /> Best value
                  </span>
                ) : null}
                <p
                  className={`text-[8px] font-semibold uppercase tracking-wide text-stone-500 sm:text-[9px] ${hasRibbon ? 'mt-2.5 sm:mt-3' : 'mt-0.5'}`}
                >
                  {plan.name}
                </p>
                <p className="mt-0.5 text-sm font-bold tabular-nums text-stone-900 sm:text-base">{plan.price}</p>
                <p className="text-[8px] text-stone-500 sm:text-[10px]">{plan.trips}</p>
                <p className="mt-0.5 text-[7px] tabular-nums text-stone-400 sm:text-[8px]">{plan.perTrip}</p>
                {plan.savings ? (
                  <span className="mx-auto mt-1 inline-flex max-w-full items-center justify-center truncate rounded-full border border-amber-100/80 bg-amber-50/90 px-1.5 py-px text-[7px] font-medium text-amber-950 sm:px-2 sm:text-[8px]">
                    {plan.savings}
                  </span>
                ) : null}
                <button
                  type="button"
                  onClick={() => router.push(plan.lockHref)}
                  className={`mt-2 w-full min-h-9 rounded-lg px-2 py-2 text-[9px] font-semibold transition-all duration-200 active:scale-[0.98] sm:min-h-10 sm:text-[10px] ${
                    btnPopular
                      ? 'bg-[var(--color-primary)] text-white shadow-sm hover:opacity-95'
                      : 'border border-stone-200/90 bg-white text-stone-800 shadow-sm hover:border-teal-200/80 hover:bg-teal-50/30'
                  }`}
                >
                  Lock plan
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {subscriptionStripInfoOpen ? (
        <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-4" role="presentation">
          <button
            type="button"
            className="absolute inset-0 z-0 bg-slate-900/45 backdrop-blur-[2px] transition-opacity"
            aria-label="Close subscription details"
            onClick={() => setSubscriptionStripInfoOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="subscription-strip-info-title"
            className="relative z-10 flex max-h-[min(88vh,100dvh)] w-full max-w-md flex-col overflow-hidden rounded-t-[1.35rem] bg-white shadow-2xl ring-1 ring-slate-900/[0.06] sm:max-h-[min(92vh,880px)] sm:rounded-2xl"
          >
            <div className="flex shrink-0 justify-center pt-2.5 sm:hidden" aria-hidden>
              <div className="h-1 w-11 rounded-full bg-slate-200/90" />
            </div>
            <div className="flex shrink-0 items-start justify-between gap-3 border-b border-slate-100 bg-gradient-to-br from-slate-50 via-white to-[var(--color-primary)]/[0.04] px-4 pb-3 pt-2 sm:px-5 sm:pb-4 sm:pt-4">
              <div className="min-w-0 pt-0.5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">Noida · Trip packs</p>
                <h2 id="subscription-strip-info-title" className="mt-0.5 text-lg font-bold tracking-tight text-slate-900">
                  Subscription pricing &amp; policy
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSubscriptionStripInfoOpen(false)}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-slate-200/80 bg-white text-slate-500 shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800"
                aria-label="Close"
              >
                <X className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-gradient-to-b from-slate-50/90 to-white px-3 py-3 sm:px-4 sm:py-4">
              <div className="space-y-3">
                <p className="text-[12px] leading-relaxed text-slate-600">
                  Tiles on the dashboard are summaries. Trip counts, per-trip averages, and pack price are confirmed when you lock a plan on the subscription flow — subject to eligibility, vehicle class, and your order confirmation.
                </p>
                <div className="rounded-2xl border border-emerald-100/80 bg-gradient-to-b from-emerald-50/40 to-white p-3.5 shadow-[0_8px_30px_-12px_rgba(5,150,105,0.12)]">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-900/75">Pack benefits (summary)</p>
                  <ul className="mt-2 space-y-2 text-[12px] leading-relaxed text-slate-700">
                    {SUBSCRIPTION_PACK_BENEFITS.map((line, i) => (
                      <li key={i} className="flex gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" strokeWidth={2.25} aria-hidden />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl border border-slate-200/70 bg-white p-3.5 shadow-sm">
                  <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                      <FileText className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
                    </span>
                    Before you buy
                  </div>
                  <ul className="mt-3 space-y-2.5 text-[12px] leading-snug text-slate-600">
                    {SUBSCRIPTION_COMPLIANCE_BULLETS.map((line, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-400/80" aria-hidden />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="rounded-xl bg-slate-100/80 px-3 py-2.5 text-[11px] leading-snug text-slate-600">{INDICATIVE_PRICING_FOOTNOTE}</p>
                <div className="flex flex-col gap-2 pb-1 sm:flex-row sm:flex-wrap">
                  <Link
                    href={ROUTES.PLANS_SUBSCRIPTION}
                    onClick={() => setSubscriptionStripInfoOpen(false)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-center text-xs font-semibold text-white shadow-sm transition-opacity hover:opacity-95"
                  >
                    Open subscription page
                    <ArrowRight className="h-3.5 w-3.5 shrink-0" strokeWidth={2} aria-hidden />
                  </Link>
                  <Link
                    href="/terms"
                    onClick={() => setSubscriptionStripInfoOpen(false)}
                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-center text-xs font-semibold text-slate-800 transition-colors hover:bg-slate-50"
                  >
                    Terms of Service
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* ── Trust & partners — compact bar, label + chevron inline (detail on marketing pages) ─ */}
      <nav
        className="overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-[0_6px_28px_-12px_rgba(28,25,23,0.18)] ring-1 ring-stone-900/[0.04]"
        aria-label="Why Liftngo, route analysis, and partner programs"
      >
        <div className="grid grid-cols-3 divide-x divide-stone-200/80">
          {(
            [
              {
                href: ROUTES.WHY_LIFTNGO,
                label: 'Why Liftngo',
                title: 'Why businesses choose Liftngo — open full page',
              },
              {
                href: `${ROUTES.GROW_WITH_LIFTNGO}#route-analysis`,
                label: 'Route optimization',
                title: 'Enter mobile — autonomous route report on grow-with-liftngo',
              },
              {
                href: ROUTES.GROW_WITH_LIFTNGO_BUSINESS_ENQUIRY,
                label: 'Sell & partners',
                title: 'Sell on Liftngo and partnership programs',
              },
            ] as const
          ).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              title={item.title}
              className="group flex min-h-[2.75rem] min-w-0 items-center justify-center gap-0.5 px-1.5 py-2 transition-[background-color,color] hover:bg-stone-50/95 active:bg-stone-100/80 sm:min-h-12 sm:gap-1 sm:px-3 sm:py-2.5"
            >
              <span className="max-w-[min(100%,11rem)] text-center text-[9px] font-semibold leading-tight tracking-tight text-stone-800 sm:max-w-none sm:text-[11px]">
                {item.label}
              </span>
              <ChevronRight
                className="h-3 w-3 shrink-0 text-stone-400 transition-[transform,color] group-hover:translate-x-0.5 group-hover:text-[var(--color-primary)] sm:h-3.5 sm:w-3.5"
                strokeWidth={2.5}
                aria-hidden
              />
            </Link>
          ))}
        </div>
      </nav>

      {/* ── Footer tagline ────────────────────────────────── */}
      <div className="text-center">
        <p className="text-lg font-semibold tracking-tight text-gray-800">Goods Time Pe</p>
        <p className="text-sm font-medium text-gray-400">Business Prime Pe</p>
        <p className="mt-1.5 text-[11px] text-gray-300">Used by 100+ Noida businesses · Transparent pricing</p>
      </div>
      </div>

      {/* ── Sticky Bottom CTA ─────────────────────────────── */}
      <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-gray-100/80 bg-white/95 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-4px_24px_rgba(0,0,0,0.05)] backdrop-blur-xl">
        <div className="mx-auto flex min-w-0 max-w-6xl justify-center px-4 md:px-6 lg:px-8">
          <div className="flex min-w-0 max-w-lg flex-1 items-stretch gap-2 sm:max-w-none sm:justify-center sm:gap-2.5 md:gap-3">
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
