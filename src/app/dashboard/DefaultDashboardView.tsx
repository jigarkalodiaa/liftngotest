'use client';

import Image from '@/components/OptimizedImage';
import { MapPin, Truck, ChevronRight, ArrowRight } from 'lucide-react';
import type { ServiceId } from '@/types/booking';
import { PageContainer } from '@/components/ui';
import { LOGO_PATH, SITE_NAME } from '@/lib/site';
import { theme } from '@/config/theme';
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
      <header className="sticky top-0 z-30 -mx-4 mb-5 border-b border-gray-100 bg-white/80 px-4 py-3 backdrop-blur-xl sm:-mx-5 sm:px-5">
        <div className="flex items-center justify-between gap-3">
          <Image
            src={LOGO_PATH}
            alt={`${SITE_NAME} — logistics`}
            width={200}
            height={56}
            className="h-8 w-auto max-w-[160px] object-contain sm:h-9 sm:max-w-[200px]"
            priority
          />
          <div className="flex items-center gap-2">
            {dashboardLocation?.city && (
              <button
                type="button"
                onClick={openLocationModal}
                className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100"
              >
                <MapPin className="h-3.5 w-3.5 text-[var(--color-primary)]" strokeWidth={2} />
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
      <h1 className="break-words text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl" style={{ color: theme.colors.gray800 }}>
        Hi, {userName}
      </h1>

      {zoneConfig.zoneBanner ? (
        <div className="mt-3 rounded-2xl border border-blue-100 bg-blue-50/50 px-4 py-3 text-sm leading-snug text-[var(--color-primary)]">
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
          className="text-xs font-semibold text-[var(--color-primary)] underline underline-offset-2"
        >
          Change service area
        </button>
      </div>

      {/* ── Pickup Input ───────────────────────────────────── */}
      <button
        type="button"
        onClick={() => router.push(ROUTES.PICKUP_LOCATION)}
        className="group mt-5 flex min-h-[56px] w-full items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-left shadow-sm transition-all duration-200 hover:border-[var(--color-primary)]/30 hover:shadow-md sm:mt-6"
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

      {/* ── Flagship card ──────────────────────────────────── */}
      <div className="mt-6 overflow-hidden rounded-2xl bg-gradient-to-br from-[#1e1f4b] via-[#2C2D5B] to-[#3d3f7a] p-5 text-white shadow-xl sm:p-6">
        <div className="flex flex-row items-center gap-4 flex-wrap sm:flex-nowrap sm:gap-6">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-extrabold leading-tight tracking-tight sm:text-2xl">
              {zoneConfig.instantTitle}
            </h2>
            <p className="mt-1.5 text-sm text-white/70">
              {zoneConfig.instantSubtitle}
            </p>
            <button
              type="button"
              onClick={() => setIsChooseTripOpen(true)}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#2C2D5B] shadow-lg transition-all duration-200 hover:shadow-xl active:scale-[0.98]"
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
        <div className="mt-4 overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md sm:p-6">
          <div className="flex flex-row items-center gap-4 flex-wrap sm:flex-nowrap sm:gap-6">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-extrabold leading-tight tracking-tight" style={{ color: theme.colors.textPrimary }}>
                Find Restaurant &amp; Food
              </h2>
              <p className="mt-1.5 text-sm text-gray-500">
                Order food and get it delivered
              </p>
              <button
                type="button"
                onClick={() => router.push(ROUTES.FIND_RESTAURANT)}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-3 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
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

      {/* ── Vehicle Selection ───────────────────────────────── */}
      <h2 className="mt-8 text-center text-sm font-bold uppercase tracking-wider text-gray-400">
        Choose service
      </h2>
      {zoneConfig.incentivesNote ? (
        <p className="mt-1 text-center text-xs text-gray-500 max-w-md mx-auto">{zoneConfig.incentivesNote}</p>
      ) : null}
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

      {/* ── Footer ──────────────────────────────────────────── */}
      <div className="relative mt-10 overflow-hidden rounded-3xl bg-gradient-to-b from-gray-50 to-blue-50/30 px-4 pt-6 pb-6">
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

      <p className="mt-5 text-center text-xl font-extrabold leading-tight tracking-tight text-gray-800 sm:text-2xl">
        Goods time pe
      </p>
      <p className="mt-1 text-center text-lg font-bold text-gray-400 sm:text-xl">
        Business prime pe
      </p>
    </PageContainer>
  );
}
