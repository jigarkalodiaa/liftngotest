'use client';

import Image from '@/components/OptimizedImage';
import { MapPin, Truck, ChevronRight, ArrowRight } from 'lucide-react';
import type { ServiceId } from '@/types/booking';
import { PageContainer } from '@/components/ui';
import { LOGO_PATH, SITE_NAME } from '@/lib/site';
import { ROUTES } from '@/lib/constants';
import type { DashboardZoneUiConfig } from '@/features/location/dashboardZoneUi';
import type { StoredUserLocation } from '@/lib/utils/locationStorage';

type ServiceRow = { id: ServiceId; label: string; image: string };

export interface DefaultDashboardViewProps {
  userName: string;
  pickup: { name: string; address: string } | null;
  zoneConfig: DashboardZoneUiConfig;
  dashboardLocation: StoredUserLocation | null;
  openLocationModal: () => void;
  setIsMenuOpen: (open: boolean) => void;
  router: { push: (href: string) => void };
  setIsChooseTripOpen: (open: boolean) => void;
  services: ServiceRow[];
  activeService: ServiceId;
  handleSelectService: (id: ServiceId) => void;
}

export default function DefaultDashboardView({
  userName,
  pickup,
  zoneConfig,
  dashboardLocation,
  openLocationModal,
  setIsMenuOpen,
  router,
  setIsChooseTripOpen,
  services,
  activeService,
  handleSelectService,
}: DefaultDashboardViewProps) {
  return (
    <PageContainer className="relative z-0 pb-10 pt-3 sm:pt-4">

      {/* ── Header ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 w-full min-w-0 border-b border-gray-100 bg-white/80 py-3 backdrop-blur-xl supports-[backdrop-filter]:bg-white/70">
        <div className="flex items-center justify-between gap-4 sm:gap-6">
          <Image
            src={LOGO_PATH}
            alt={`${SITE_NAME} — logistics`}
            width={200}
            height={56}
            className="h-8 w-auto max-w-[160px] object-contain sm:h-9 sm:max-w-[200px]"
            priority
          />
          <div className="flex items-center gap-4 sm:gap-6">
            {dashboardLocation?.city && (
              <button
                type="button"
                onClick={openLocationModal}
                className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100"
              >
                <MapPin className="h-3.5 w-3.5 text-slate-500" strokeWidth={1.5} />
                {dashboardLocation.city}
              </button>
            )}
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

      {/* ── Greeting ───────────────────────────────────────── */}
      <h1 className="break-words text-2xl font-semibold leading-tight tracking-tight text-gray-900 sm:text-3xl">
        Hi, {userName}
      </h1>

      {zoneConfig.zoneBanner ? (
        <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50 page-card text-sm leading-snug text-gray-700">
          {zoneConfig.zoneBanner}
          {dashboardLocation?.city ? (
            <span className="mt-1 block text-xs opacity-80">
              Area: {dashboardLocation.city}
              {dashboardLocation.state ? `, ${dashboardLocation.state}` : ''}
            </span>
          ) : null}
        </div>
      ) : null}

      <div className="mt-2">
        <button
          type="button"
          onClick={openLocationModal}
          className="text-xs font-medium text-[var(--color-primary)] underline underline-offset-2 hover:opacity-80"
        >
          Change service area
        </button>
      </div>


      {/* ── Flagship card ──────────────────────────────────── */}
      <div className="overflow-hidden rounded-2xl bg-slate-900 page-card text-white">
        <div className="flex flex-row flex-wrap items-center gap-4 sm:flex-nowrap sm:gap-6">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-semibold leading-tight tracking-tight sm:text-2xl">
              {zoneConfig.instantTitle}
            </h2>
            <p className="mt-1.5 text-sm text-slate-400">
              {zoneConfig.instantSubtitle}
            </p>
            <button
              type="button"
              onClick={() => setIsChooseTripOpen(true)}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition-colors duration-150 hover:bg-gray-100"
            >
              <Truck className="h-4 w-4" />
              Book Now
            </button>
          </div>
          <div className="relative h-[100px] w-full max-w-[140px] sm:h-[160px] sm:max-w-[220px] flex-shrink-0 mx-auto sm:mx-0 sm:ml-auto">
            <Image
              src="/dashboard/dashboard.png"
              alt="Instant delivery — book a goods vehicle"
              fill
              priority
              className="object-contain object-right"
              sizes="(max-width: 640px) 140px, 220px"
            />
          </div>
        </div>
      </div>

      {zoneConfig.showFindRestaurant ? (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white page-card transition-shadow duration-150 hover:shadow-sm">
          <div className="flex flex-row flex-wrap items-center gap-4 sm:flex-nowrap sm:gap-6">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-semibold leading-tight tracking-tight text-gray-900">
                Find Restaurant &amp; Food
              </h2>
              <p className="mt-1.5 text-sm text-gray-500">
                Order food and get it delivered
              </p>
              <button
                type="button"
                onClick={() => router.push(ROUTES.FIND_RESTAURANT)}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white transition-opacity duration-150 hover:opacity-90"
            >
                Order Food
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <div className="relative h-[80px] w-full max-w-[120px] sm:h-[120px] sm:max-w-[180px] flex-shrink-0 mx-auto sm:mx-0 sm:ml-auto flex items-center justify-end">
              <span className="text-5xl sm:text-6xl" role="img" aria-label="Food">🍽️</span>
            </div>
          </div>
        </div>
      ) : null}

      {/* ── Fleet Strip (compact) ────────────────────────────── */}
      <section>
        <div className="rounded-xl border border-gray-200 bg-white page-card">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-medium uppercase tracking-wider text-gray-400">Our Fleet</h2>
            <button
              type="button"
              onClick={() => router.push(ROUTES.PICKUP_LOCATION)}
              className="flex items-center gap-1 text-xs font-medium text-[var(--color-primary)] transition-opacity hover:opacity-80"
            >
              Book now <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
          {zoneConfig.incentivesNote ? (
            <p className="mt-1 text-[11px] text-gray-500">{zoneConfig.incentivesNote}</p>
          ) : null}
          <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-none -mx-1 px-1 pb-1">
            {services.map((s) => {
              const active = s.id === activeService;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleSelectService(s.id)}
                  className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors duration-150 ${
                    active
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="relative h-7 w-8 shrink-0 pointer-events-none">
                    <Image src={s.image} alt={s.label} fill className="object-contain" sizes="32px" />
                  </div>
                  {s.label}
                </button>
              );
            })}
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {['CNG', 'Diesel', 'Petrol', 'EV'].map((fuel) => (
              <span key={fuel} className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-500">
                {fuel}
              </span>
            ))}
            <span className="rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-medium text-green-600">
              All fuel types available
            </span>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <div className="page-section relative overflow-hidden rounded-2xl bg-gray-50 px-4">
        <div className="relative mx-auto h-[min(48vw,240px)] w-full max-w-[320px] sm:h-[260px]">
          <Image
            src="/hero-delivery.svg"
            alt="LiftNGo — goods logistics and delivery"
            width={400}
            height={300}
            className="h-full w-full object-contain object-center"
            sizes="(max-width: 640px) 48vw, 320px"
          />
        </div>
      </div>

      <p className="text-center text-xl font-semibold leading-tight tracking-tight text-gray-800 sm:text-2xl">
        Goods time pe
      </p>
      <p className="mt-1 text-center text-lg font-medium text-gray-400 sm:text-xl">
        Business prime pe
      </p>
    </PageContainer>
  );
}
