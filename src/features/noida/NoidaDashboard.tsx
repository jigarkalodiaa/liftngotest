'use client';

import Image from '@/components/OptimizedImage';
import { Building2, MapPin, Truck, Package, Shield, Clock, FileText, BarChart3, ChevronRight, Star, Zap, Users, ArrowRight } from 'lucide-react';
import type { ServiceId } from '@/types/booking';
import { PageContainer } from '@/components/ui';
import { LOGO_PATH, SITE_NAME } from '@/lib/site';
import { theme } from '@/config/theme';
import { ROUTES } from '@/lib/constants';
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

const VALUE_CHIPS = [
  { label: 'GST Invoice', icon: FileText },
  { label: 'Live Tracking', icon: MapPin },
  { label: 'Fixed-cost Plans', icon: BarChart3 },
  { label: 'Dedicated Driver', icon: Users },
  { label: 'Same-day SLA', icon: Clock },
] as const;

type CoreService = { icon: typeof Truck; title: string; subtitle: string; cta: string; href: string; badge?: string; accent?: string };
const CORE_SERVICES: CoreService[] = [
  { icon: Truck, title: 'Book a Delivery', subtitle: 'On-demand 2W · 3W · 4W with driver', cta: 'Book now', href: ROUTES.PICKUP_LOCATION, accent: 'bg-blue-500' },
  { icon: Package, title: 'Subscription Plans', subtitle: 'Fixed trips. Predictable cost.', cta: 'View plans', badge: 'SAVE 30%', href: ROUTES.CONTACT, accent: 'bg-emerald-500' },
  { icon: Shield, title: 'Dedicated Vehicle', subtitle: '8 hrs/day · ₹25k–₹55k/month', cta: 'Enquire', badge: 'HIGH VALUE', href: ROUTES.CONTACT, accent: 'bg-violet-500' },
  { icon: BarChart3, title: 'Business Account', subtitle: 'GST billing · Reports · Manager', cta: 'Get started', href: ROUTES.CONTACT, accent: 'bg-amber-500' },
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
  { icon: FileText, label: 'GST Invoice', sub: 'Every single trip' },
  { icon: Clock, label: 'Same-day SLA', sub: 'Guaranteed delivery' },
  { icon: MapPin, label: 'Live GPS', sub: 'Real-time tracking' },
  { icon: Users, label: 'Dedicated POC', sub: 'Account manager' },
] as const;

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
  return (
    <PageContainer className="relative z-0 pb-28 pt-3 sm:pt-4">

      {/* ── Header ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 -mx-4 mb-4 border-b border-gray-100 bg-white/80 px-4 py-3 backdrop-blur-xl sm:-mx-5 sm:px-5">
        <div className="flex items-center justify-between gap-3">
          <Image
            src={LOGO_PATH}
            alt={`${SITE_NAME} — NCR`}
            width={200}
            height={56}
            className="h-8 w-auto max-w-[160px] object-contain sm:h-9 sm:max-w-[200px]"
            priority
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openLocationModal}
              className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100"
            >
              <Building2 className="h-3.5 w-3.5 text-[var(--color-primary)]" strokeWidth={2} />
              {dashboardLocation?.city || 'Noida'}
            </button>
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open menu"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full transition-colors hover:bg-gray-100"
            >
              <svg className="h-5 w-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero Section ───────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1e1f4b] via-[#2C2D5B] to-[#3d3f7a] p-6 text-white shadow-xl sm:p-8">
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/5 blur-2xl" />
        <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-blue-400/10 blur-3xl" />
        <div className="relative z-10">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white/90 backdrop-blur-sm">
            <Zap className="h-3 w-3" />
            NCR Business Zone
          </div>
          <h1 className="text-2xl font-extrabold leading-[1.15] tracking-tight sm:text-3xl">
            Move Anything,{'\n'}Anytime
            <span className="block text-blue-300">with Liftngo</span>
          </h1>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/70">
            Fast, reliable logistics across Noida &amp; NCR. Book in seconds.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => router.push(ROUTES.PICKUP_LOCATION)}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#2C2D5B] shadow-lg shadow-black/20 transition-all duration-200 hover:shadow-xl hover:brightness-105 active:scale-[0.98]"
            >
              <Truck className="h-4 w-4" />
              Book Delivery
            </button>
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('pricing-plans');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20 active:scale-[0.98]"
            >
              View Plans
            </button>
          </div>
        </div>
        <div className="pointer-events-none absolute bottom-0 right-0 hidden h-32 w-32 opacity-20 sm:block">
          <Image src="/hero-delivery.svg" alt="" width={128} height={128} className="h-full w-full object-contain" />
        </div>
      </section>

      {/* ── Location Input ──────────────────────────────────── */}
      <section className="mt-5">
        <button
          type="button"
          onClick={() => router.push(ROUTES.PICKUP_LOCATION)}
          className="group flex min-h-[56px] w-full items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-left shadow-sm transition-all duration-200 hover:border-[var(--color-primary)]/30 hover:shadow-md"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[var(--color-primary)] transition-colors group-hover:bg-blue-100">
            <MapPin className="h-5 w-5" strokeWidth={2} />
          </span>
          <span className="min-w-0 flex-1">
            <span
              className="block text-sm font-semibold leading-snug line-clamp-1"
              style={{ color: pickup?.name || pickup?.address ? theme.colors.gray900 : theme.colors.gray400 }}
            >
              {pickup?.name || pickup?.address || 'Enter pickup location'}
            </span>
            <span className="mt-0.5 block text-xs text-gray-400">
              {pickup?.address ? pickup.address : 'Search address, building, or landmark'}
            </span>
          </span>
          <ChevronRight className="h-5 w-5 shrink-0 text-gray-300 transition-colors group-hover:text-[var(--color-primary)]" />
        </button>
      </section>

      {/* ── Value Chips ─────────────────────────────────────── */}
      <section className="mt-5 -mx-4 px-4 sm:-mx-5 sm:px-5">
        <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
          {VALUE_CHIPS.map((chip) => {
            const Icon = chip.icon;
            return (
              <span key={chip.label} className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3.5 py-2 text-xs font-medium text-gray-700 shadow-sm transition-all duration-200 hover:border-[var(--color-primary)]/30 hover:shadow-md">
                <Icon className="h-3.5 w-3.5 text-[var(--color-primary)]" strokeWidth={2} />
                {chip.label}
              </span>
            );
          })}
        </div>
      </section>

      {/* ── Subscription Hero ───────────────────────────────── */}
      <section className="mt-6">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-5 shadow-xl sm:p-6">
          <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-yellow-400/10 blur-2xl" />
          <div className="absolute bottom-0 left-0 h-20 w-40 bg-gradient-to-r from-emerald-400/5 to-transparent blur-xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-yellow-400/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-yellow-300">
                <Star className="h-3 w-3 fill-yellow-300" /> Most Popular
              </span>
              <span className="rounded-full bg-emerald-400/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                Save ₹4,000
              </span>
            </div>
            <p className="mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              50 trips @ ₹20,000
            </p>
            <p className="mt-1 text-sm text-white/60">
              ₹400/trip · 3W with driver · 30 days validity
            </p>
            <button
              type="button"
              onClick={() => router.push(ROUTES.CONTACT)}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-gray-900 shadow-lg transition-all duration-200 hover:shadow-xl active:scale-[0.98]"
            >
              Get This Plan
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ── Core Services ───────────────────────────────────── */}
      <section className="mt-8">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">Core Services</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4">
          {CORE_SERVICES.map((svc) => {
            const Icon = svc.icon;
            return (
              <button
                key={svc.title}
                type="button"
                onClick={() => router.push(svc.href)}
                className="group relative flex flex-col items-start rounded-2xl border border-gray-100 bg-white p-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg sm:p-5"
              >
                {svc.badge && (
                  <span className="absolute right-3 top-3 rounded-md bg-emerald-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-emerald-600">
                    {svc.badge}
                  </span>
                )}
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl text-white ${svc.accent}`}>
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </span>
                <p className="mt-3 text-sm font-bold text-gray-900">{svc.title}</p>
                <p className="mt-1 text-[11px] leading-snug text-gray-500">{svc.subtitle}</p>
                <p className="mt-auto flex items-center gap-1 pt-3 text-xs font-semibold text-[var(--color-primary)] transition-all duration-200 group-hover:gap-2">
                  {svc.cta}
                  <ChevronRight className="h-3.5 w-3.5" />
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Order Fresh & Local ─────────────────────────────── */}
      <section className="mt-8">
        <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-400">
          <span>🥥</span> Order Fresh &amp; Local
        </h2>
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-none">
          {ORDER_FRESH_LOCAL.map((item) => (
            <div
              key={item.name}
              className={`flex w-44 shrink-0 flex-col rounded-2xl border p-4 transition-all duration-200 ${
                item.available
                  ? 'border-gray-100 bg-white shadow-sm hover:-translate-y-0.5 hover:shadow-lg'
                  : 'border-dashed border-gray-200 bg-gray-50/60'
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-50 to-emerald-100 text-2xl">
                  {item.emoji}
                </span>
                {item.tag && (
                  <span className="rounded-md bg-orange-50 px-2 py-0.5 text-[9px] font-bold uppercase text-orange-600">
                    {item.tag}
                  </span>
                )}
              </div>
              <p className="mt-3 text-sm font-bold leading-snug text-gray-900">{item.name}</p>
              {item.sub && <p className="mt-0.5 text-[11px] text-gray-500">{item.sub}</p>}
              {item.available && item.href ? (
                <button
                  type="button"
                  onClick={() => router.push(item.href!)}
                  className="mt-auto flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all duration-200 hover:bg-emerald-600 active:scale-[0.97] mt-3"
                >
                  Order Now
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              ) : (
                <>
                  <p className="mt-2 text-[11px] font-medium italic text-gray-400">Coming soon</p>
                  <button type="button" className="mt-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-[11px] font-semibold text-gray-600 transition-all duration-200 hover:bg-gray-50 hover:border-gray-300">
                    Notify me
                  </button>
                </>
              )}
            </div>
          ))}

          <div className="flex w-44 shrink-0 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/60 p-4 text-center">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-dashed border-gray-300 text-gray-400">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </span>
            <p className="mt-3 text-sm font-bold text-gray-900">List your product</p>
            <p className="mt-1 text-[11px] text-gray-500">Sell on Liftngo</p>
            <button
              type="button"
              onClick={() => router.push(ROUTES.CONTACT)}
              className="mt-3 rounded-xl bg-[var(--color-primary)] px-4 py-2 text-[11px] font-bold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.97]"
            >
              Apply now
            </button>
          </div>
        </div>
      </section>

      {/* ── Vehicle Selection ───────────────────────────────── */}
      <section className="mt-8">
        <h2 className="text-center text-sm font-bold uppercase tracking-wider text-gray-400">Choose Vehicle</h2>
        <div className="relative z-10 mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {services.map((s) => {
            const active = s.id === activeService;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => handleSelectService(s.id)}
                className={`group rounded-2xl bg-white px-3 pt-4 pb-3 text-center transition-all duration-200 border-2 ${
                  active
                    ? 'border-[var(--color-primary)] bg-blue-50/50 shadow-lg shadow-blue-900/10 scale-[1.02]'
                    : 'border-transparent shadow-sm hover:shadow-md hover:-translate-y-0.5'
                }`}
              >
                <div className={`relative mx-auto h-[72px] w-[80px] pointer-events-none transition-transform duration-200 ${active ? 'scale-110' : 'group-hover:scale-105'}`}>
                  <Image src={s.image} alt={s.label} fill className="object-contain" sizes="80px" />
                </div>
                <div className={`mt-2 text-sm font-semibold transition-colors ${active ? 'text-[var(--color-primary)]' : 'text-gray-700'}`}>
                  {s.label}
                </div>
                {active && (
                  <div className="mx-auto mt-1.5 h-1 w-6 rounded-full bg-[var(--color-primary)]" />
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Saved trips ─────────────────────────────────────── */}
      <div className="mt-6 flex justify-center">
        <button
          type="button"
          onClick={onOpenChooseTrip}
          className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-800 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98]"
        >
          More trips &amp; saved places
          <ChevronRight className="h-4 w-4 text-gray-400" />
        </button>
      </div>

      {/* ── Subscription Plans ──────────────────────────────── */}
      <section id="pricing-plans" className="mt-10 scroll-mt-20">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">Subscription Plans</h2>
        <p className="mt-1 text-xs text-gray-500">Pick the plan that fits your delivery volume</p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {SUBSCRIPTION_PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border p-4 text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
                plan.popular
                  ? 'border-[var(--color-primary)] bg-gradient-to-b from-blue-50 to-white shadow-lg shadow-blue-900/10 ring-1 ring-[var(--color-primary)]/20'
                  : plan.offer
                    ? 'border-orange-200 bg-gradient-to-b from-orange-50/50 to-white shadow-sm'
                    : 'border-gray-100 bg-white shadow-sm'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-[var(--color-primary)] px-3 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-sm">
                  <Star className="h-2.5 w-2.5 fill-white" /> Popular
                </span>
              )}
              {plan.offer && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-orange-500 px-3 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-sm">
                  Best Value
                </span>
              )}
              <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">{plan.name}</p>
              <p className="mt-2 text-sm font-bold text-gray-900">{plan.trips}</p>
              <p className="mt-0.5 text-[10px] text-gray-400 line-through">{plan.perTrip}</p>
              <p className="mt-1 text-xl font-extrabold text-[var(--color-primary)]">{plan.price}</p>
              {plan.savings && (
                <span className="mx-auto mt-2 inline-block rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600">
                  {plan.savings}
                </span>
              )}
              <button
                type="button"
                onClick={() => router.push(ROUTES.CONTACT)}
                className={`mt-3 w-full rounded-xl py-2.5 text-xs font-bold transition-all duration-200 active:scale-[0.97] ${
                  plan.popular
                    ? 'bg-[var(--color-primary)] text-white shadow-sm hover:opacity-90'
                    : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Get Plan
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── Why Liftngo ─────────────────────────────────────── */}
      <section className="mt-10">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">Why Liftngo</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {WHY_LIFTNGO.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex flex-col items-center rounded-2xl border border-gray-100 bg-white p-4 text-center shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[var(--color-primary)]">
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </span>
                <p className="mt-3 text-sm font-bold text-gray-900">{item.label}</p>
                <p className="mt-0.5 text-[11px] text-gray-500">{item.sub}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Partner CTA ─────────────────────────────────────── */}
      <section className="mt-10">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#2C2D5B] to-[#3d3f7a] p-6 text-white shadow-xl">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/5 blur-2xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                <Users className="h-6 w-6" />
              </span>
              <div>
                <h3 className="text-base font-bold">Become a Partner</h3>
                <p className="text-xs text-white/70">Vendor · Driver · Referral</p>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              Earn more with flexible work. List products, join as driver, or refer businesses for incentives.
            </p>
            <button
              type="button"
              onClick={() => router.push(ROUTES.BECOME_DRIVER)}
              className="mt-4 flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#2C2D5B] shadow-lg transition-all duration-200 hover:shadow-xl active:scale-[0.98]"
            >
              Join Now
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ── Free Route Analysis ─────────────────────────────── */}
      <section className="mt-6">
        <div className="rounded-2xl border border-gray-100 bg-gradient-to-br from-gray-50 to-white p-5 shadow-sm">
          <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900">
            <BarChart3 className="h-4 w-4 text-[var(--color-primary)]" />
            Free Route Analysis
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-gray-500">
            We&apos;ll map your routes for efficiency &amp; cost savings.
          </p>
          <div className="mt-3 flex gap-2">
            <input
              type="tel"
              placeholder="Your WhatsApp number"
              className="min-h-[44px] flex-1 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 placeholder:text-gray-400 transition-all duration-200 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
            />
            <button
              type="button"
              onClick={() => router.push(ROUTES.CONTACT)}
              className="shrink-0 rounded-xl bg-[var(--color-primary)] px-5 py-2.5 text-sm font-bold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.97]"
            >
              Request
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <section className="mt-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-blue-50 to-gray-50 px-4 pt-6 pb-6">
          <div className="relative mx-auto h-[min(44vw,220px)] w-full max-w-[300px] sm:h-[240px]">
            <Image
              src="/hero-delivery.svg"
              alt="LiftnGo — NCR logistics"
              width={400}
              height={300}
              className="h-full w-full object-contain object-center"
              sizes="(max-width: 640px) 44vw, 300px"
            />
          </div>
        </div>
        <p className="mt-5 text-center text-base font-bold tracking-tight text-gray-800">
          Your NCR logistics partner
        </p>
        <p className="mt-1 text-center text-xs text-gray-400">
          On-demand · subscription · dedicated fleet
        </p>
      </section>

      {/* ── Sticky Bottom CTA ───────────────────────────────── */}
      <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-gray-100 bg-white/95 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[520px] items-center gap-3 px-4">
          <button
            type="button"
            onClick={() => router.push(ROUTES.PICKUP_LOCATION)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] py-3.5 text-sm font-bold text-white shadow-lg shadow-[var(--color-primary)]/20 transition-all duration-200 hover:shadow-xl active:scale-[0.98]"
          >
            <Truck className="h-4 w-4" />
            Book Now
          </button>
          {/* Bottom nav icons */}
          {[
            { label: 'Home', icon: 'M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3m8 0h3a1 1 0 001-1V10', href: ROUTES.DASHBOARD },
            { label: 'History', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', href: ROUTES.HISTORY },
            { label: 'Account', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', href: ROUTES.MY_DETAILS },
          ].map((tab) => (
            <button
              key={tab.label}
              type="button"
              onClick={() => router.push(tab.href)}
              className="flex w-12 flex-col items-center gap-0.5 py-1 text-[10px] font-medium text-gray-400 transition-colors hover:text-[var(--color-primary)]"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
              </svg>
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
