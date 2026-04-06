'use client';

import { useMemo, useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  BadgeCheck,
  Calculator,
  Car,
  ChevronRight,
  FileText,
  Info,
  KeyRound,
  LayoutDashboard,
  Package,
  PiggyBank,
  ShieldCheck,
  Sparkles,
  Star,
  Store,
  Truck,
  X,
  Zap,
  Check,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { navigateToProductPath } from '@/lib/auth/productGate';
import { ROUTES } from '@/lib/constants';
import { NOIDA_QUICK_FARE_MODAL_ENTRIES } from '@/lib/pricing/noidaQuickFareCopy';
import { LEASE_PLANS } from '@/lib/pricing/leasePlans';
import {
  INDICATIVE_PRICING_FOOTNOTE,
  SUBSCRIPTION_COMPLIANCE_BULLETS,
  SUBSCRIPTION_HUB_CARD_ESSENTIAL_SHORT,
  SUBSCRIPTION_PACK_BENEFITS,
  TOLL_CHARGES_SEPARATE_NOTE,
} from '@/lib/pricing/subscriptionDisclosures';
import {
  SUBSCRIPTION_NOIDA_STRIP_PLANS,
  formatSubscriptionRupee,
  subscriptionHighlighted3WPack,
  subscriptionPackById,
} from '@/lib/pricing/subscriptionPacks';
import {
  trackBookNowClick,
  trackFunnelStep,
  trackModalClose,
  trackModalOpen,
  trackSelectContent,
  trackViewPlan,
  trackEvent as gaTrack,
} from '@/lib/analytics';
import { trackEvent as phCapture } from '@/lib/posthogAnalytics';
import Image from '@/components/OptimizedImage';

export const NOIDA_PRODUCT_TARGETS = {
  subscription: ROUTES.PLANS_SUBSCRIPTION,
  lease: ROUTES.PLANS_LEASE,
  withDriver: ROUTES.PICKUP_LOCATION,
  withoutDriver: ROUTES.PLANS_RENT,
  vendor: ROUTES.GROW_WITH_LIFTNGO,
} as const;

export type NoidaProductKey = keyof typeof NOIDA_PRODUCT_TARGETS;

type ServiceTile = {
  key: NoidaProductKey;
  title: string;
  bullets: readonly string[];
  icon: LucideIcon;
};

const HIGHLIGHT_3W = subscriptionHighlighted3WPack();
const PACK_4W = subscriptionPackById('4w-growth');

const SERVICE_TILES: ServiceTile[] = [
  {
    key: 'subscription',
    title: 'Subscription',
    icon: Package,
    bullets: ['Prepaid 3W trip packs · locked in-pack per-trip rates', 'Save vs ad hoc on recurring lanes'],
  },
  {
    key: 'lease',
    title: 'Lease',
    icon: KeyRound,
    bullets: ['6 / 12 month dedicated vehicle', 'Monthly figures match /plans/lease checkout'],
  },
  {
    key: 'withDriver',
    title: 'With driver (on-demand)',
    icon: Truck,
    bullets: ['Per-trip booking · 2W / 3W / 4W', 'Live quote before you pay'],
  },
  {
    key: 'withoutDriver',
    title: 'Without driver (rental)',
    icon: Car,
    bullets: ['Daily · weekly · monthly self-drive blocks', 'Toggle options on the rent page'],
  },
  {
    key: 'vendor',
    title: 'Vendor verified',
    icon: Store,
    bullets: ['Partner onboarding · verified network', 'For suppliers listing on Liftngo'],
  },
];

const FLEET_PREVIEW: { src: string; label: string; hint: string }[] = [
  { src: '/dashboard/goods-two-wheeler.svg', label: '2W (EV)', hint: 'Docs · light parcels' },
  { src: '/dashboard/goods-three-wheeler.svg', label: '3W cargo', hint: 'Retail · industrial lanes' },
  { src: '/dashboard/goods-four-wheeler.svg', label: '4W / mini truck', hint: 'Bulk · hub transfers' },
];

function leaseVehicleArtSrc(vehicle: string): string {
  if (vehicle.includes('2-Wheeler')) return '/dashboard/goods-two-wheeler.svg';
  if (vehicle.includes('3-Wheeler')) return '/dashboard/goods-three-wheeler.svg';
  return '/dashboard/goods-four-wheeler.svg';
}

const USE_CASE_CHIPS: { id: string; label: string; suggest: NoidaProductKey }[] = [
  { id: 'daily', label: 'Daily deliveries', suggest: 'subscription' },
  { id: 'bulk', label: 'Bulk / transfers', suggest: 'lease' },
  { id: 'onetime', label: 'One-off load', suggest: 'withDriver' },
  { id: 'selfdrive', label: 'Self-drive block', suggest: 'withoutDriver' },
  { id: 'partner', label: 'Sell as partner', suggest: 'vendor' },
];

const BENEFITS: { icon: LucideIcon; title: string; line: string }[] = [
  { icon: PiggyBank, title: 'Cost control', line: 'Packs and leases cap unit economics vs pure ad hoc.' },
  { icon: ShieldCheck, title: 'Reliability', line: 'Verified drivers and clear vehicle class per booking.' },
  { icon: Zap, title: 'Speed', line: 'Same-day goods lanes · priority on higher subscription tiers.' },
];

const CARD =
  'rounded-2xl border border-gray-200/90 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--color-primary)]/25 hover:shadow-md sm:p-6';

const DASHBOARD_EXTRAS: { label: string; hint: string; href: string; icon: LucideIcon }[] = [
  { label: 'GST billing', hint: 'Tax-ready invoices', href: ROUTES.PLANS_GST, icon: FileText },
  { label: 'Noida dashboard', hint: 'Same home as /noida', href: ROUTES.NOIDA, icon: LayoutDashboard },
  { label: 'Own fleet', hint: 'Assign & track', href: ROUTES.NOIDA_FLEET_TECH, icon: Truck },
];

export function NoidaB2bProductHeroActions() {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <button
        type="button"
        onClick={() => navigateToProductPath(router, ROUTES.PLANS)}
        className="inline-flex min-h-11 items-center justify-center rounded-xl border-2 border-white/50 bg-white/10 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-white/15 active:scale-[0.99]"
      >
        Choose plan
      </button>
      <button
        type="button"
        onClick={() => {
          trackBookNowClick('noida_b2b_product_hero_book');
          navigateToProductPath(router, ROUTES.PICKUP_LOCATION);
        }}
        className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[var(--color-primary)] px-6 py-3.5 text-sm font-bold text-white shadow-sm transition-opacity hover:opacity-90 active:scale-[0.99]"
      >
        Book ride
      </button>
      <button
        type="button"
        onClick={() => {
          gaTrack('cta_click', { source: 'noida_b2b_hero_contact' });
          phCapture('cta_clicked', {
            source: 'noida_b2b_hero_contact',
            page: 'noida_b2b_logistics',
          });
          navigateToProductPath(router, ROUTES.CONTACT);
        }}
        className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/35 bg-transparent px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-white/10 active:scale-[0.99]"
      >
        Contact
      </button>
    </div>
  );
}

function goService(router: ReturnType<typeof useRouter>, key: NoidaProductKey) {
  if (key === 'withDriver') trackBookNowClick(`noida_b2b_product_${key}`);
  navigateToProductPath(router, NOIDA_PRODUCT_TARGETS[key]);
}

export function NoidaB2bProductMirrorBody() {
  const router = useRouter();
  const [useCase, setUseCase] = useState<string | null>(null);
  const [subscriptionStripInfoOpen, setSubscriptionStripInfoOpen] = useState(false);
  const suggested = useMemo(() => USE_CASE_CHIPS.find((c) => c.id === useCase)?.suggest ?? null, [useCase]);

  return (
    <>
      <section className="scroll-mt-24" aria-labelledby="benefits-heading">
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
            <ShieldCheck className="h-4 w-4" strokeWidth={2} aria-hidden />
          </span>
          <h2 id="benefits-heading" className="text-lg font-bold text-gray-900 sm:text-xl">
            Why Noida teams use Liftngo
          </h2>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {BENEFITS.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.title}
                className="rounded-2xl border border-gray-200/90 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <h3 className="mt-3 text-sm font-bold text-gray-900 sm:text-base">{b.title}</h3>
                <p className="mt-1 text-xs text-gray-600 sm:text-sm">{b.line}</p>
              </div>
            );
          })}
        </div>
        <p className="mt-4 flex flex-wrap items-center gap-2 text-xs text-gray-500 sm:text-sm">
          <BadgeCheck className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
          Verified partners · GST invoicing on applicable charges · Noida zone in the app
        </p>
      </section>

      <section className="pt-10" aria-labelledby="fleet-preview-heading">
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] ring-1 ring-[var(--color-primary)]/15">
            <Truck className="h-4 w-4" strokeWidth={2} aria-hidden />
          </span>
          <h2 id="fleet-preview-heading" className="text-lg font-bold text-gray-900 sm:text-xl">
            Fleet classes in the app
          </h2>
        </div>
        <p className="mt-1 text-sm text-gray-600">Same silhouettes as booking—icons below are product art, not stock photos.</p>
        <div className="mt-4 grid grid-cols-3 gap-3 sm:gap-4">
          {FLEET_PREVIEW.map((v) => (
            <div
              key={v.src}
              className="flex flex-col items-center rounded-2xl border border-gray-200/90 bg-gradient-to-b from-white to-gray-50/80 px-3 py-4 text-center shadow-sm ring-1 ring-gray-900/[0.03] sm:py-5"
            >
              <div className="relative h-16 w-full max-w-[100px] sm:h-20 sm:max-w-[120px]">
                <Image src={v.src} alt="" fill className="object-contain" sizes="120px" unoptimized />
              </div>
              <p className="mt-2 text-xs font-bold text-gray-900 sm:text-sm">{v.label}</p>
              <p className="mt-0.5 text-[10px] text-gray-500 sm:text-xs">{v.hint}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="services" aria-labelledby="selector-heading" className="scroll-mt-24 pt-10">
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-700 ring-1 ring-teal-100">
            <Package className="h-4 w-4" strokeWidth={2} aria-hidden />
          </span>
          <h2 id="selector-heading" className="text-lg font-bold text-gray-900 sm:text-xl">
            Pick how you want to move goods
          </h2>
        </div>
        <p className="mt-1 text-sm text-gray-600">Same destinations as the Noida dashboard—sign in if prompted.</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {SERVICE_TILES.map((s) => {
            const active = suggested === s.key;
            const TileIcon = s.icon;
            return (
              <div
                key={s.key}
                role="button"
                tabIndex={0}
                onClick={() => goService(router, s.key)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    goService(router, s.key);
                  }
                }}
                className={`${CARD} cursor-pointer ${active ? 'ring-2 ring-[var(--funnel-action)] ring-offset-2' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)]/[0.08] text-[var(--color-primary)] ring-1 ring-[var(--color-primary)]/12">
                    <TileIcon className="h-5 w-5" strokeWidth={2} aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900">{s.title}</h3>
                    <ul className="mt-2 space-y-1.5 text-sm text-gray-700">
                      {s.bullets.map((line) => (
                        <li key={line} className="flex gap-2">
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--color-primary)]" aria-hidden />
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[var(--color-primary)]">
                      Continue
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 rounded-2xl border border-gray-100 bg-gray-50/90 p-4 sm:p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-gray-500">Also in your dashboard</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {DASHBOARD_EXTRAS.map((x) => {
              const Icon = x.icon;
              return (
                <button
                  key={x.href}
                  type="button"
                  onClick={() => navigateToProductPath(router, x.href)}
                  className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-left text-xs font-semibold text-gray-900 shadow-sm transition-all hover:border-[var(--color-primary)]/30 hover:shadow md:text-sm"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-700">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <span>
                    {x.label}
                    <span className="mt-0.5 block text-[10px] font-normal text-gray-500 sm:text-xs">{x.hint}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mt-14 scroll-mt-24" aria-labelledby="plans-data-heading">
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-700 ring-1 ring-violet-100">
            <Calculator className="h-4 w-4" strokeWidth={2} aria-hidden />
          </span>
          <h2 id="plans-data-heading" className="text-lg font-bold text-gray-900 sm:text-xl">
            Real plan numbers (in-app)
          </h2>
        </div>
        <p className="mt-1 text-sm text-gray-600">Same tiles as the signed-in Noida dashboard—pulled from live configs.</p>

        {/* Subscription strip — mirrors NoidaDashboard */}
        <section
          className="mt-8 scroll-mt-20 rounded-2xl p-2.5 shadow-sm ring-1 ring-stone-200/65 sm:p-3 md:p-4"
          style={{
            background: 'linear-gradient(165deg, #faf9f7 0%, #ffffff 40%, rgba(240,253,250,0.4) 100%)',
          }}
          aria-labelledby="subscription-plans-noida-b2b"
        >
          <div className="mb-1.5 flex items-start justify-between gap-2 px-0.5 sm:mb-2 sm:items-center">
            <div className="min-w-0 flex-1">
              <h3
                id="subscription-plans-noida-b2b"
                className="flex flex-wrap items-center gap-2 text-sm font-semibold tracking-tight text-stone-900 md:text-base"
              >
                <Package className="h-4 w-4 shrink-0 text-teal-600" strokeWidth={2} aria-hidden />
                <span>Subscription · trip packs (3W + 4W)</span>
              </h3>
              <p className="mt-0.5 text-[9px] font-medium text-stone-500 sm:text-[10px]">
                Pack pricing · detail &amp; compliance in ⓘ
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
              <button
                type="button"
                onClick={() => {
                  trackModalOpen('noida_b2b_subscription_pack_info', 'subscription_strip');
                  setSubscriptionStripInfoOpen(true);
                }}
                className="grid h-7 w-7 place-items-center rounded-full border border-stone-200/90 bg-white text-stone-500 shadow-sm transition-colors hover:bg-stone-50 hover:text-stone-800 sm:h-8 sm:w-8"
                aria-label="Subscription packs: benefits, validity, and terms"
              >
                <Info className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2} aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => {
                  trackViewPlan('plans_hub', 'noida_b2b_subscription_strip');
                  navigateToProductPath(router, ROUTES.PLANS);
                }}
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
                    onClick={() => navigateToProductPath(router, plan.lockHref)}
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
          <p className="mt-3 text-[11px] leading-snug text-stone-600 sm:text-xs">
            Highlights: 4W Growth pack (
            {PACK_4W ? `${formatSubscriptionRupee(PACK_4W.perTrip)}/trip × ${PACK_4W.trips} trips` : 'see subscription'}) on{' '}
            <button
              type="button"
              onClick={() => navigateToProductPath(router, ROUTES.PLANS_SUBSCRIPTION)}
              className="font-semibold text-[var(--color-primary)] underline-offset-2 hover:underline"
            >
              subscription
            </button>
            . Entry 3W reference ~₹299/trip before add-ons; Growth locks {formatSubscriptionRupee(HIGHLIGHT_3W.perTrip)}/trip in-pack.
          </p>
          <button
            type="button"
            onClick={() => navigateToProductPath(router, ROUTES.PLANS_SUBSCRIPTION)}
            className="mt-3 text-sm font-bold text-[var(--color-primary)] underline-offset-2 hover:underline"
          >
            Open subscription →
          </button>
        </section>

        {/* Lease strip — same shell + card grid as subscription */}
        <section
          className="mt-8 scroll-mt-20 rounded-2xl p-2.5 shadow-sm ring-1 ring-stone-200/65 sm:p-3 md:p-4"
          style={{
            background: 'linear-gradient(165deg, #faf9f7 0%, #ffffff 40%, rgba(240,253,250,0.4) 100%)',
          }}
          aria-labelledby="lease-plans-noida-b2b"
        >
          <div className="mb-2 px-0.5">
            <h3
              id="lease-plans-noida-b2b"
              className="flex flex-wrap items-center gap-2 text-sm font-semibold tracking-tight text-stone-900 md:text-base"
            >
              <KeyRound className="h-4 w-4 shrink-0 text-amber-700" strokeWidth={2} aria-hidden />
              <span>Lease · monthly</span>
            </h3>
            <p className="mt-0.5 text-[9px] font-medium text-stone-500 sm:text-[10px]">
              6 or 12 month terms · prepay + GST at checkout (same as /plans/lease).
            </p>
          </div>
          <div className="grid min-w-0 grid-cols-1 gap-1.5 sm:grid-cols-3 sm:gap-2 md:gap-2.5">
            {LEASE_PLANS.map((row) => (
              <div
                key={row.vehicle}
                className="relative flex w-full min-w-0 flex-col rounded-xl border border-stone-200/70 bg-white/90 p-2.5 text-center shadow-sm ring-1 ring-stone-100/60 transition-all duration-200 hover:-translate-y-px hover:shadow-md sm:p-3"
              >
                <div className="relative mx-auto mt-1 h-14 w-full max-w-[88px] sm:h-16 sm:max-w-[100px]">
                  <Image
                    src={leaseVehicleArtSrc(row.vehicle)}
                    alt=""
                    fill
                    className="object-contain"
                    sizes="100px"
                    unoptimized
                  />
                </div>
                <p className="mt-1 text-[8px] font-semibold uppercase tracking-wide text-stone-500 sm:text-[9px]">{row.vehicle}</p>
                <p className="mt-1 text-xs font-bold tabular-nums text-stone-900 sm:text-sm">
                  {formatSubscriptionRupee(row.term12)}
                  <span className="block text-[8px] font-medium text-stone-500 sm:text-[9px]">12 mo / mo</span>
                </p>
                <p className="mt-2 text-[10px] tabular-nums text-stone-600 sm:text-xs">
                  {formatSubscriptionRupee(row.term6)}
                  <span className="block text-[8px] font-normal text-stone-400">6 mo / mo</span>
                </p>
                <button
                  type="button"
                  onClick={() => navigateToProductPath(router, ROUTES.PLANS_LEASE)}
                  className="mt-2.5 w-full min-h-9 rounded-lg border border-stone-200/90 bg-white px-2 py-2 text-[9px] font-semibold text-stone-800 shadow-sm transition-all duration-200 hover:border-teal-200/80 hover:bg-teal-50/30 active:scale-[0.98] sm:min-h-10 sm:text-[10px]"
                >
                  Open lease
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => navigateToProductPath(router, ROUTES.PLANS_LEASE)}
            className="mt-3 text-sm font-bold text-[var(--color-primary)] underline-offset-2 hover:underline"
          >
            Open lease →
          </button>
        </section>
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
            aria-labelledby="noida-b2b-subscription-info-title"
            className="relative z-10 flex max-h-[min(88vh,100dvh)] w-full max-w-md flex-col overflow-hidden rounded-t-[1.35rem] bg-white shadow-2xl ring-1 ring-slate-900/[0.06] sm:max-h-[min(92vh,880px)] sm:rounded-2xl"
          >
            <div className="flex shrink-0 justify-center pt-2.5 sm:hidden" aria-hidden>
              <div className="h-1 w-11 rounded-full bg-slate-200/90" />
            </div>
            <div className="flex shrink-0 items-start justify-between gap-3 border-b border-slate-100 bg-gradient-to-br from-slate-50 via-white to-[var(--color-primary)]/[0.04] px-4 pb-3 pt-2 sm:px-5 sm:pb-4 sm:pt-4">
              <div className="min-w-0 pt-0.5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">Noida · Trip packs</p>
                <h2 id="noida-b2b-subscription-info-title" className="mt-0.5 text-lg font-bold tracking-tight text-slate-900">
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
                  Tiles are summaries. Trip counts, per-trip averages, and pack price are confirmed when you lock a plan on the subscription flow —
                  subject to eligibility, vehicle class, and your order confirmation.
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
                  <button
                    type="button"
                    onClick={() => {
                      setSubscriptionStripInfoOpen(false);
                      navigateToProductPath(router, ROUTES.PLANS_SUBSCRIPTION);
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-center text-xs font-semibold text-white shadow-sm transition-opacity hover:opacity-95"
                  >
                    Open subscription page
                    <ArrowRight className="h-3.5 w-3.5 shrink-0" strokeWidth={2} aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSubscriptionStripInfoOpen(false);
                      router.push('/terms');
                    }}
                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-center text-xs font-semibold text-slate-800 transition-colors hover:bg-slate-50"
                  >
                    Terms of Service
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <section className="mt-14 scroll-mt-24" aria-labelledby="use-case-heading">
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-800 ring-1 ring-amber-100">
            <Zap className="h-4 w-4" strokeWidth={2} aria-hidden />
          </span>
          <h2 id="use-case-heading" className="text-lg font-bold text-gray-900 sm:text-xl">
            What are you solving?
          </h2>
        </div>
        <p className="mt-1 text-sm text-gray-600">Highlights the matching model above.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {USE_CASE_CHIPS.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                trackSelectContent('noida_b2b_use_case', c.id);
                setUseCase(c.id);
              }}
              className={`min-h-10 rounded-full border px-4 py-2 text-xs font-bold transition-all sm:text-sm ${
                useCase === c.id
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white shadow-sm'
                  : 'border-gray-200 bg-white text-gray-800 hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
        {suggested ? (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/90 px-4 py-3 text-sm text-emerald-950">
            <span className="font-semibold">Suggested:</span>{' '}
            {SERVICE_TILES.find((t) => t.key === suggested)?.title ?? suggested}
            <button
              type="button"
              onClick={() => {
                trackFunnelStep('noida_b2b', 'use_case_suggested_continue', suggested);
                goService(router, suggested);
              }}
              className="ml-2 font-bold text-[var(--color-primary)] underline underline-offset-2 hover:opacity-80"
            >
              Continue →
            </button>
          </div>
        ) : null}
      </section>

      <section className="mt-14 scroll-mt-24" aria-labelledby="pricing-heading">
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-700 ring-1 ring-sky-100">
            <Sparkles className="h-4 w-4" strokeWidth={2} aria-hidden />
          </span>
          <h2 id="pricing-heading" className="text-lg font-bold text-gray-900 sm:text-xl">
            Pricing snapshot
          </h2>
          <PricingFareModal />
        </div>
        <p className="mt-1 text-sm text-gray-600">Indicative anchors—confirm live quote in flow.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {NOIDA_QUICK_FARE_MODAL_ENTRIES.map((e) => (
            <span
              key={e.title}
              className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-900 shadow-sm sm:text-sm"
            >
              <span className="text-gray-500">{e.title.split('—')[0].trim()}:</span>
              <span className="ml-1.5 text-[var(--color-primary)]">{e.kicker}</span>
            </span>
          ))}
          <span className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-900 shadow-sm sm:text-sm">
            <span className="text-gray-500">3W Growth (ex.):</span>
            <span className="ml-1.5 text-[var(--color-primary)]">{formatSubscriptionRupee(HIGHLIGHT_3W.perTrip)}/trip in-pack</span>
          </span>
        </div>
        <p className="mt-3 text-xs text-gray-500">{INDICATIVE_PRICING_FOOTNOTE}</p>
      </section>

      <section className="mt-14 rounded-2xl bg-[#1A1D3A] px-6 py-10 text-center text-white" aria-labelledby="final-cta-heading">
        <h2 id="final-cta-heading" className="text-xl font-bold sm:text-2xl">
          Start in Noida on Liftngo
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-white/80">Book a ride, lock a pack, or talk to us for lane design.</p>
        <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => {
              trackBookNowClick('noida_b2b_product_footer_book');
              navigateToProductPath(router, ROUTES.PICKUP_LOCATION);
            }}
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-[#1A1D3A] transition-colors hover:bg-gray-100 active:scale-[0.99]"
          >
            Book ride
          </button>
          <button
            type="button"
            onClick={() => {
              trackViewPlan('plans_hub', 'noida_b2b_footer');
              navigateToProductPath(router, ROUTES.PLANS);
            }}
            className="inline-flex min-h-11 items-center justify-center rounded-xl border-2 border-white/60 px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-white/10 active:scale-[0.99]"
          >
            Choose plan
          </button>
          <button
            type="button"
            onClick={() => {
              gaTrack('cta_click', { source: 'noida_b2b_footer_contact' });
              phCapture('cta_clicked', {
                source: 'noida_b2b_footer_contact',
                page: 'noida_b2b_logistics',
              });
              navigateToProductPath(router, ROUTES.CONTACT);
            }}
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/35 bg-white/10 px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-white/15 active:scale-[0.99]"
          >
            Contact
          </button>
        </div>
      </section>
    </>
  );
}

function PricingFareModal() {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    const onClose = () => trackModalClose('noida_b2b_fare_explainer');
    d.addEventListener('close', onClose);
    return () => d.removeEventListener('close', onClose);
  }, []);

  return (
    <>
      <button
        type="button"
        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition-colors hover:bg-gray-50 active:scale-95"
        aria-label="Fare and distance details"
        onClick={() => {
          trackModalOpen('noida_b2b_fare_explainer', 'pricing_snapshot');
          ref.current?.showModal();
        }}
      >
        <Info className="h-4 w-4" aria-hidden />
      </button>
      <dialog
        ref={ref}
        className="w-[calc(100%-2rem)] max-w-lg rounded-2xl border border-gray-200 bg-white p-0 text-gray-900 shadow-2xl backdrop:bg-black/40 open:flex open:flex-col"
        onClick={(e) => {
          if (e.target === ref.current) ref.current?.close();
        }}
      >
        <div className="flex items-start justify-between gap-3 border-b border-gray-100 px-4 py-3 sm:px-5">
          <h3 className="text-base font-bold">How fares work</h3>
          <button
            type="button"
            className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-100"
            aria-label="Close"
            onClick={() => ref.current?.close()}
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>
        <div className="max-h-[min(75vh,32rem)] overflow-y-auto px-4 py-4 text-sm leading-relaxed text-gray-700 sm:px-5">
          <ul className="list-inside list-disc space-y-2">
            {NOIDA_QUICK_FARE_MODAL_ENTRIES.map((e) => (
              <li key={e.title}>
                <strong className="text-gray-900">{e.kicker}</strong> — {e.body}
              </li>
            ))}
          </ul>
          <div className="mt-4 border-t border-gray-100 pt-4">
            <p className="text-xs font-semibold text-gray-900">Pack distance (3W)</p>
            <ul className="mt-2 space-y-1 text-xs text-gray-600">
              {SUBSCRIPTION_HUB_CARD_ESSENTIAL_SHORT.map((row) => (
                <li key={row.label}>
                  <span className="font-medium text-gray-800">{row.label}:</span> {row.value}
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-4 text-xs text-gray-600">{TOLL_CHARGES_SEPARATE_NOTE}</p>
          <p className="mt-2 text-xs text-gray-600">
            Standard loading / unloading at your premises is included; long waits or extra labour may need a separate quote (plan terms).
          </p>
          <p className="mt-4 text-xs text-gray-500">{INDICATIVE_PRICING_FOOTNOTE}</p>
        </div>
      </dialog>
    </>
  );
}
