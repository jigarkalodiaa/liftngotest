'use client';

import Image from 'next/image';
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
      <header className="liftngo-header-glass sticky top-3 z-30 mb-6 rounded-full px-4 py-2.5 sm:px-5 sm:py-3">
        <div className="flex items-center justify-between gap-3">
          <Image
            src={LOGO_PATH}
            alt={`${SITE_NAME} — logistics`}
            width={200}
            height={56}
            className="h-9 w-auto max-w-[200px] object-contain"
            priority
          />
          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open menu"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-[#1A1D3A] transition-colors hover:bg-[#1A1D3A]/[0.08]"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      <h1
        className="break-words text-2xl font-bold leading-tight sm:text-3xl"
        style={{ color: theme.colors.gray800 }}
      >
        Hi, {userName}
      </h1>

      {zoneConfig.zoneBanner ? (
        <div
          className="mt-3 rounded-2xl border px-4 py-3 text-sm leading-snug"
          style={{
            borderColor: `${theme.colors.primary}44`,
            backgroundColor: theme.colors.primaryTint,
            color: theme.colors.textPrimary,
          }}
        >
          {zoneConfig.zoneBanner}
          {dashboardLocation?.city ? (
            <span className="mt-1 block text-xs opacity-80">
              Area: {dashboardLocation.city}
              {dashboardLocation.state ? `, ${dashboardLocation.state}` : ''}
            </span>
          ) : null}
        </div>
      ) : null}

      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
        <button
          type="button"
          onClick={openLocationModal}
          className="text-xs font-semibold text-[var(--color-primary)] underline underline-offset-2"
        >
          Change service area
        </button>
      </div>

      <button
        type="button"
        onClick={() => router.push(ROUTES.PICKUP_LOCATION)}
        className="mt-5 flex min-h-[3.5rem] min-w-0 w-full items-center gap-3.5 rounded-2xl border border-gray-200 bg-white px-5 py-4 text-left shadow-sm transition-colors hover:bg-gray-50/80 sm:mt-6"
      >
        <span className="flex h-5 w-5 shrink-0 text-gray-400" aria-hidden>
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s7-4.5 7-11a7 7 0 10-14 0c0 6.5 7 11 7 11z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </span>
        <span
          className="min-w-0 flex-1 text-left font-medium leading-snug line-clamp-2"
          style={{
            fontSize: theme.fontSizes.md,
            color: pickup?.name || pickup?.address ? theme.colors.gray900 : theme.colors.gray400,
          }}
        >
          {pickup?.name || pickup?.address || 'Enter Pickup Location'}
        </span>
      </button>

      <div
        className="mt-6 rounded-2xl overflow-hidden p-5 sm:p-6"
        style={{
          backgroundColor: theme.colors.surface,
          boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04)',
        }}
      >
        <div className="flex flex-row items-center gap-4 flex-wrap sm:flex-nowrap sm:gap-6">
          <div className="flex-1 min-w-0">
            <h2
              className="font-bold leading-tight"
              style={{ fontSize: theme.fontSizes['2xl'], color: theme.colors.textPrimary }}
            >
              {zoneConfig.instantTitle}
            </h2>
            <p
              className="mt-1 font-normal pb-6"
              style={{ fontSize: theme.fontSizes.sm, fontWeight: 800, color: theme.colors.gray600 }}
            >
              {zoneConfig.instantSubtitle}
            </p>
            <button
              type="button"
              onClick={() => setIsChooseTripOpen(true)}
              className="inline-flex min-h-11 w-full max-w-[10.5rem] items-center justify-center px-6 text-sm font-medium text-white transition-opacity hover:opacity-95 sm:w-auto sm:text-base"
              style={{
                backgroundColor: theme.colors.primary,
                borderRadius: theme.radius.standard,
              }}
            >
              Book Now
            </button>
          </div>
          <div className="relative h-[100px] w-full max-w-[140px] sm:h-[160px] sm:max-w-[220px] flex-shrink-0 mx-auto sm:mx-0 sm:ml-auto ">
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
        <div
          className="mt-5 rounded-2xl overflow-hidden p-5 sm:p-6"
          style={{
            backgroundColor: theme.colors.surface,
            boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          <div className="flex flex-row items-center gap-4 flex-wrap sm:flex-nowrap sm:gap-6">
            <div className="flex-1 min-w-0">
              <h2
                className="font-bold leading-tight"
                style={{ fontSize: theme.fontSizes['2xl'], color: theme.colors.textPrimary }}
              >
                Find Restaurant & Food
              </h2>
              <p
                className="mt-1 font-normal pb-6"
                style={{ fontSize: theme.fontSizes.sm, fontWeight: 800, color: theme.colors.gray600 }}
              >
                Order food and get it delivered
              </p>
              <button
                type="button"
                onClick={() => router.push(ROUTES.FIND_RESTAURANT)}
                className="inline-flex min-h-11 w-full max-w-[10.5rem] items-center justify-center px-6 text-sm font-medium text-white transition-opacity hover:opacity-95 sm:w-auto sm:text-base"
                style={{
                  backgroundColor: theme.colors.primary,
                  borderRadius: theme.radius.standard,
                }}
              >
                Order food
              </button>
            </div>
            <div className="relative h-[100px] w-full max-w-[140px] sm:h-[160px] sm:max-w-[220px] flex-shrink-0 mx-auto sm:mx-0 sm:ml-auto flex items-center justify-end">
              <svg
                className="w-full h-full max-h-[100px] sm:max-h-[140px] text-[var(--landing-primary)] opacity-90"
                viewBox="0 0 120 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <ellipse
                  cx="60"
                  cy="58"
                  rx="42"
                  ry="14"
                  fill="currentColor"
                  fillOpacity="0.12"
                  stroke="currentColor"
                  strokeOpacity="0.25"
                  strokeWidth="1.5"
                />
                <ellipse
                  cx="60"
                  cy="54"
                  rx="35"
                  ry="11"
                  fill="currentColor"
                  fillOpacity="0.08"
                  stroke="currentColor"
                  strokeOpacity="0.2"
                  strokeWidth="1"
                />
                <ellipse cx="40" cy="52" rx="10" ry="4" fill="currentColor" fillOpacity="0.35" />
                <ellipse cx="60" cy="50" rx="10" ry="4" fill="currentColor" fillOpacity="0.4" />
                <ellipse cx="80" cy="52" rx="10" ry="4" fill="currentColor" fillOpacity="0.35" />
                <ellipse
                  cx="60"
                  cy="48"
                  rx="12"
                  ry="5"
                  fill="currentColor"
                  fillOpacity="0.1"
                  stroke="currentColor"
                  strokeOpacity="0.2"
                  strokeWidth="0.8"
                />
              </svg>
            </div>
          </div>
        </div>
      ) : null}

      <h2 className="mt-8 text-center font-normal" style={{ fontSize: theme.fontSizes.lg, color: theme.colors.gray800 }}>
        Choose service
      </h2>
      {zoneConfig.incentivesNote ? (
        <p className="mt-1 text-center text-xs text-gray-500 max-w-md mx-auto">{zoneConfig.incentivesNote}</p>
      ) : null}
      <div className="relative z-10 mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {services.map((s) => {
          const active = s.id === activeService;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => handleSelectService(s.id)}
              className={`rounded-2xl bg-white px-2 pt-4 pb-3 text-center transition-all border ${
                active ? 'shadow-md ring-1' : 'border-gray-200 shadow-sm hover:shadow-md'
              }`}
              style={active ? { borderColor: `${theme.colors.primary}66`, boxShadow: `0 0 0 1px ${theme.colors.primary}33` } : undefined}
            >
              <div className="relative mx-auto h-[72px] w-[80px] pointer-events-none">
                <Image src={s.image} alt={s.label} fill className="object-contain" sizes="80px" />
              </div>
              <div className="mt-2 font-medium" style={{ fontSize: theme.fontSizes.sm, color: theme.colors.gray800 }}>
                {s.label}
              </div>
            </button>
          );
        })}
      </div>

      <div className="relative mt-8 rounded-3xl bg-gradient-to-b from-gray-50 to-[var(--landing-bg)]/60 px-4 pt-6 pb-6 overflow-hidden">
        <div className="relative mx-auto h-[min(52vw,260px)] w-full max-w-[340px] sm:h-[280px]">
          <img
            src="/images/liftngohero.gif"
            alt="LiftNGo — goods logistics and delivery"
            width={1024}
            height={1024}
            className="h-full w-full object-contain object-center"
            decoding="async"
          />
        </div>
      </div>

      <p
        className="mt-6 text-center text-2xl font-bold leading-tight tracking-tight sm:text-left sm:text-3xl md:text-4xl"
        style={{ color: theme.colors.gray400 }}
      >
        Goods time pe
        <br />
        <span style={{ color: theme.colors.gray500 }}>Business prime pe</span>
      </p>
    </PageContainer>
  );
}
