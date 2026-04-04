'use client';

import Image from '@/components/OptimizedImage';
import { Landmark } from 'lucide-react';
import type { ServiceId } from '@/types/booking';
import { PageContainer } from '@/components/ui';
import { LOGO_PATH, SITE_NAME } from '@/lib/site';
import { theme } from '@/config/theme';
import { ROUTES } from '@/lib/constants';
import type { StoredUserLocation } from '@/lib/utils/locationStorage';
import KhatuHeroOffer from './KhatuHeroOffer';
import KhatuServicesGrid from './KhatuServicesGrid';

type ServiceRow = { id: ServiceId; label: string; image: string };

export interface KhatuDashboardProps {
  userName: string;
  pickup: { name: string; address: string } | null;
  dashboardLocation: StoredUserLocation | null;
  openLocationModal: () => void;
  setIsMenuOpen: (open: boolean) => void;
  router: { push: (href: string) => void };
  services: ServiceRow[];
  activeService: ServiceId;
  handleSelectService: (id: ServiceId) => void;
  onFlagshipBookNow: () => void;
  onOpenChooseTrip: () => void;
}

export default function KhatuDashboard({
  userName,
  pickup,
  dashboardLocation,
  openLocationModal,
  setIsMenuOpen,
  router,
  services,
  activeService,
  handleSelectService,
  onFlagshipBookNow,
  onOpenChooseTrip,
}: KhatuDashboardProps) {
  return (
    <PageContainer className="relative z-0 pb-10 pt-3 sm:pt-4">
      <header className="sticky top-3 z-30 overflow-hidden rounded-3xl border border-amber-200/50 bg-gradient-to-r from-amber-50 via-white to-amber-50/90 page-card shadow-md shadow-amber-900/10">
        <div className="flex items-center justify-between gap-4 sm:gap-6">
          <Image
            src={LOGO_PATH}
            alt={`${SITE_NAME} — Khatu`}
            width={200}
            height={56}
            className="h-9 w-auto max-w-[200px] object-contain"
            priority
          />
          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open menu"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-amber-900 transition-colors hover:bg-amber-100"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      <div className="flex items-center justify-center gap-4 rounded-2xl border border-stone-200/80 bg-[var(--khatu-ivory)] page-card text-center text-xs font-medium text-[var(--khatu-stone-muted)] sm:gap-6">
        <Landmark className="h-4 w-4 shrink-0 text-[var(--khatu-saffron)]" strokeWidth={1.75} aria-hidden />
        <span>
          Khatu Shyam Ji zone · Temple & tourism
          {dashboardLocation?.city ? ` · ${dashboardLocation.city}` : ''}
        </span>
      </div>

      <h1
        className="break-words text-2xl font-bold leading-tight sm:text-3xl"
        style={{ color: theme.colors.gray800 }}
      >
        Hi, {userName}
      </h1>

      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
        <button
          type="button"
          onClick={openLocationModal}
          className="text-xs font-semibold text-amber-800 underline underline-offset-2"
        >
          Change service area
        </button>
      </div>

      <div className="mt-5">
        <KhatuHeroOffer onBookNow={onFlagshipBookNow} />
      </div>

      <button
        type="button"
        onClick={() => router.push(ROUTES.PICKUP_LOCATION)}
        className="mt-6 flex min-h-[3.5rem] min-w-0 w-full items-center gap-3.5 rounded-2xl border border-amber-200/80 bg-white px-5 py-4 text-left shadow-sm transition-colors hover:bg-amber-50/50"
      >
        <span className="flex h-5 w-5 shrink-0 text-amber-600" aria-hidden>
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

      <KhatuServicesGrid />

      <h2 className="text-center font-normal" style={{ fontSize: theme.fontSizes.lg, color: theme.colors.gray800 }}>
        Choose service
      </h2>
      <p className="mt-1 text-center text-xs text-[var(--khatu-stone-muted)]">
        Introductory two-wheeler slabs on your first ride — see offer above
      </p>

      <div className="relative z-10 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6">
        {services.map((s) => {
          const active = s.id === activeService;
          const launch = s.id === 'twoWheeler';
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => handleSelectService(s.id)}
              className={`rounded-2xl bg-white px-2 pt-4 pb-3 text-center transition-all border ${
                active ? 'shadow-md ring-1' : 'border-gray-200 shadow-sm hover:shadow-md'
              } ${launch ? 'ring-2 ring-amber-400/80' : ''}`}
              style={
                active ? { borderColor: `${theme.colors.primary}66`, boxShadow: `0 0 0 1px ${theme.colors.primary}33` } : undefined
              }
            >
              {launch ? (
                <span className="mb-1 inline-flex rounded-full bg-[var(--khatu-saffron)]/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[var(--khatu-saffron)]">
                  Launch fare
                </span>
              ) : (
                <span className="mb-1 block h-4" aria-hidden />
              )}
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

      <div className="flex justify-center">
        <button
          type="button"
          onClick={onOpenChooseTrip}
          className="min-h-[48px] rounded-2xl border-2 border-amber-300/70 bg-white px-8 py-3 text-sm font-bold text-amber-950 shadow-md hover:bg-amber-50"
        >
          More trips & saved places
        </button>
      </div>

      <div className="page-section relative overflow-hidden rounded-3xl border border-amber-200/50 bg-gradient-to-b from-amber-100/40 to-[var(--landing-bg)]/80 px-4">
        <div className="relative mx-auto h-[min(52vw,260px)] w-full max-w-[340px] sm:h-[280px]">
          <Image
            src="/hero-delivery.svg"
            alt="LiftnGo — Khatu logistics"
            width={400}
            height={300}
            className="h-full w-full object-contain object-center"
            sizes="(max-width: 640px) 52vw, 340px"
          />
        </div>
      </div>

      <p className="text-center text-base font-semibold leading-snug tracking-tight text-[var(--khatu-stone-muted)] sm:text-lg">
        Your Khatu companion
        <span className="mt-1 block text-sm font-normal text-[var(--khatu-stone-muted)]">
          Rides · food · stays · prasad & shops
        </span>
      </p>
    </PageContainer>
  );
}
