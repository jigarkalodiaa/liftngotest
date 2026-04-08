'use client';

import Image from '@/components/OptimizedImage';
import { useEffect, useState } from 'react';
import { Building2, Zap } from 'lucide-react';
import type { ServiceId } from '@/types/booking';
import { PageContainer } from '@/components/ui';
import { BookingHistory, type KhatuBookingRecord, getKhatuBookings } from '@/components/khatu/booking';
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
  onFlagshipBookNow,
  onOpenChooseTrip,
}: KhatuDashboardProps) {
  const [bookings, setBookings] = useState<KhatuBookingRecord[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);

  useEffect(() => {
    setBookings(getKhatuBookings());
    setBookingsLoading(false);
    const onFocus = () => setBookings(getKhatuBookings());
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  return (
    <PageContainer className="relative z-0 pt-2 sm:pt-3" stack={false}>
      <div className="flex min-w-0 flex-col gap-3 sm:gap-4 lg:gap-5 pb-6 sm:pb-8">
        {/* Header — white bar, same feel on mobile + desktop */}
        <header className="sticky top-2 z-30 overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-sm shadow-stone-900/[0.06] sm:rounded-3xl sm:top-3">
          <div className="flex min-w-0 items-center justify-between gap-3 px-3 py-2.5 sm:gap-4 sm:px-5 sm:py-3">
            <Image
              src={LOGO_PATH}
              alt={`${SITE_NAME} — Khatu`}
              width={200}
              height={56}
              className="h-7 w-auto max-w-[min(48vw,170px)] shrink-0 object-contain sm:h-8 sm:max-w-[190px] lg:h-9"
              priority
            />
            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={openLocationModal}
                className="flex max-w-[6rem] items-center gap-1 truncate rounded-full border border-stone-200/90 bg-white px-2.5 py-2 text-[11px] font-medium text-[var(--khatu-stone)] shadow-sm transition-colors hover:bg-stone-50/90 sm:max-w-none sm:text-xs"
              >
                <Building2 className="h-3.5 w-3.5 shrink-0 text-[var(--khatu-stone-muted)]" strokeWidth={1.5} aria-hidden />
                <span className="truncate">{dashboardLocation?.city?.trim() || 'Khatu'}</span>
              </button>
              <button
                type="button"
                onClick={() => setIsMenuOpen(true)}
                aria-label="Open menu"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-amber-900 transition-colors hover:bg-amber-50 sm:h-10 sm:w-10"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Desktop: greeting + pickup left, hero right · Mobile: stacked */}
        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-12 lg:gap-6 xl:gap-8">
          <div className="flex min-w-0 flex-col gap-3 lg:col-span-5 lg:gap-3.5">
            <h1
              className="break-words text-xl font-bold leading-tight tracking-tight sm:text-2xl lg:text-3xl"
              style={{ color: theme.colors.gray800 }}
            >
              Hi, {userName}
            </h1>

            <button
              type="button"
              onClick={() => router.push(ROUTES.PICKUP_LOCATION)}
              className="flex min-h-[3rem] min-w-0 w-full items-center gap-3 rounded-xl border border-stone-200/90 bg-white px-4 py-3 text-left shadow-sm transition-colors hover:border-amber-200/90 hover:bg-amber-50/40 sm:rounded-2xl"
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
          </div>

          <div className="min-w-0 lg:col-span-7">
            <KhatuHeroOffer onBookNow={onFlagshipBookNow} />
          </div>
        </div>

        <KhatuServicesGrid />

        <button
          type="button"
          onClick={onOpenChooseTrip}
          className="group flex w-full min-w-0 flex-row items-center gap-3 rounded-2xl bg-white px-3.5 py-3.5 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:gap-4 sm:px-4 sm:py-4 md:gap-5 md:px-5 md:py-5"
          aria-label="Open quick book and saved places"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center self-center rounded-xl bg-emerald-50 text-emerald-500 sm:h-11 sm:w-11">
            <Zap className="h-[1.05rem] w-[1.05rem] sm:h-5 sm:w-5" strokeWidth={1.5} aria-hidden />
          </span>
          <div className="min-w-0 flex-1 self-center text-left">
            <p className="text-xs font-semibold leading-snug text-gray-900 sm:text-sm md:text-base">Quick book &amp; saved places</p>
            <p className="mt-1 line-clamp-2 text-[9px] leading-snug text-gray-500 sm:mt-1 sm:text-[11px] md:text-xs">
              Frequent routes · 1-tap repeat
            </p>
          </div>
          <span className="flex min-h-10 shrink-0 items-center justify-center self-center rounded-xl bg-[var(--color-primary)] px-3 py-2.5 text-[9px] font-semibold text-white shadow-sm transition-all group-hover:shadow-md sm:min-h-11 sm:px-3.5 sm:py-3 sm:text-[10px]">
            Open
          </span>
        </button>

        <BookingHistory bookings={bookings} loading={bookingsLoading} />

        <div className="text-center">
          <p className="text-lg font-semibold tracking-tight text-gray-800">Goods Time Pe</p>
          <p className="text-sm font-medium text-gray-400">Business Prime Pe</p>
          <p className="mt-1.5 text-[11px] text-gray-300">Trusted by businesses · Transparent pricing</p>
        </div>
      </div>
    </PageContainer>
  );
}
