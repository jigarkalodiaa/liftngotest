'use client';

import Image from 'next/image';
import { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import MobileMenu from '@/components/landing/MobileMenu';
import { useRouter, useSearchParams } from 'next/navigation';
import type { ServiceId, DefaultTrip } from '@/types/booking';
import {
  getPickupLocation,
  getSenderDetails,
  getSelectedService,
  setPickupLocation,
  setDropLocation,
  setSenderDetails,
  setReceiverDetails,
  setSelectedService,
  getLoggedIn,
  getCustomDefaultTrips,
} from '@/lib/storage';
import { ROUTES, PICKUP_LOCATION_MODE_DEFAULTS } from '@/lib/constants';
import { LOGO_PATH, SITE_NAME } from '@/lib/site';
import { getGreetingDisplayName } from '@/lib/greeting';
import { DEFAULT_TRIPS } from '@/data/defaultTrips';
import { PageContainer } from '@/components/ui';
import { theme } from '@/config/theme';

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [pickup, setPickup] = useState<{ name: string; address: string } | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [activeService, setActiveService] = useState<ServiceId>('walk');
  const [isChooseTripOpen, setIsChooseTripOpen] = useState(false);
  const [showDefaultAddedToast, setShowDefaultAddedToast] = useState(false);
  const [customDefaultTrips, setCustomDefaultTrips] = useState<DefaultTrip[]>([]);
  /** Which trip cards have pickup/drop swapped for display and Book Now */
  const [swappedTripIds, setSwappedTripIds] = useState<Record<string, boolean>>({});

  const syncPickupFromStorage = useCallback(() => {
    const loc = getPickupLocation();
    setPickup(loc);
  }, []);

  const syncUserName = useCallback(() => {
    setUserName(getGreetingDisplayName());
  }, []);

  const syncCustomDefaultTrips = useCallback(() => {
    setCustomDefaultTrips(getCustomDefaultTrips());
  }, []);

  useEffect(() => {
    syncUserName();
  }, [syncUserName]);

  useEffect(() => {
    syncPickupFromStorage();
    syncCustomDefaultTrips();
  }, [syncPickupFromStorage, syncCustomDefaultTrips]);

  useEffect(() => {
    const stored = getSelectedService();
    if (stored) setActiveService(stored);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!getLoggedIn()) {
      router.replace(ROUTES.HOME);
      return;
    }
  }, [router]);

  useEffect(() => {
    const onFocus = () => {
      syncPickupFromStorage();
      syncUserName();
      syncCustomDefaultTrips();
      const stored = getSelectedService();
      if (stored) setActiveService(stored);
    };
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [syncPickupFromStorage, syncUserName, syncCustomDefaultTrips]);

  const services = useMemo(
    () => [
      { id: 'walk' as const, label: 'Walk', image: '/dashboard/service-walk.png' },
      { id: 'twoWheeler' as const, label: '2 Wheeler', image: '/dashboard/service-2wheeler.png' },
      { id: 'threeWheeler' as const, label: '3 Wheeler', image: '/dashboard/service-3wheeler.png' },
      { id: 'fourWheeler' as const, label: '4 Wheeler', image: '/services/four-wheeler.svg' },
    ],
    []
  );

  const defaultTrips = useMemo(() => [...customDefaultTrips, ...DEFAULT_TRIPS], [customDefaultTrips]);

  useEffect(() => {
    if (searchParams.get('defaultAdded') !== '1') return;
    setIsChooseTripOpen(true);
    setShowDefaultAddedToast(true);
    syncCustomDefaultTrips();
    router.replace(ROUTES.DASHBOARD);
  }, [searchParams, router, syncCustomDefaultTrips]);

  useEffect(() => {
    if (!showDefaultAddedToast) return;
    const id = window.setTimeout(() => setShowDefaultAddedToast(false), 3000);
    return () => window.clearTimeout(id);
  }, [showDefaultAddedToast]);

  const handleBookNow = useCallback(
    (trip: DefaultTrip) => {
      const swapped = swappedTripIds[trip.id];
      const pickupData = swapped ? { name: trip.toName, address: trip.toAddress, contact: `${trip.contactName} | ${trip.contactPhone}` } : { name: trip.fromName, address: trip.fromAddress, contact: `${trip.contactName} | ${trip.contactPhone}` };
      const dropData = swapped ? { name: trip.fromName, address: trip.fromAddress, contact: `${trip.contactName} | ${trip.contactPhone}` } : { name: trip.toName, address: trip.toAddress, contact: `${trip.contactName} | ${trip.contactPhone}` };
      setPickupLocation(pickupData);
      setDropLocation(dropData);
      setSenderDetails({ name: trip.contactName, mobile: trip.contactPhone });
      setReceiverDetails({ name: trip.contactName, mobile: trip.contactPhone });
      setSelectedService(activeService);
      setIsChooseTripOpen(false);
      router.push(ROUTES.TRIP_OPTIONS);
    },
    [activeService, router, swappedTripIds]
  );

  const handleSwapTrip = useCallback((tripId: string) => {
    setSwappedTripIds((prev) => ({ ...prev, [tripId]: !prev[tripId] }));
  }, []);

  const closeChooseTrip = useCallback(() => setIsChooseTripOpen(false), []);

  useEffect(() => {
    if (!isChooseTripOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeChooseTrip();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isChooseTripOpen, closeChooseTrip]);

  const chooseTripPanelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!isChooseTripOpen || !chooseTripPanelRef.current) return;
    const panel = chooseTripPanelRef.current;
    const focusables = panel.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusables[0];
    if (first) first.focus();
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || focusables.length === 0) return;
      const last = focusables[focusables.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    panel.addEventListener('keydown', handleTab);
    return () => panel.removeEventListener('keydown', handleTab);
  }, [isChooseTripOpen]);

  const handleAddMoreDefaultLocation = useCallback(() => {
    setIsChooseTripOpen(false);
    router.push(`${ROUTES.PICKUP_LOCATION}?step=1&mode=${PICKUP_LOCATION_MODE_DEFAULTS}`);
  }, [router]);

  const handleSelectService = useCallback((id: ServiceId) => {
    setActiveService(id);
    setSelectedService(id);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Dim overlay when menu open */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity ${
          isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* Choose trip – bottom sheet (only mounted when open so a hidden layer never blocks taps) */}
      {isChooseTripOpen ? (
      <div
        className="fixed inset-0 z-[80] transition-opacity opacity-100"
        role="dialog"
        aria-modal="true"
        aria-label="Choose trip"
      >
        <div className="absolute inset-0 bg-black/40" onClick={closeChooseTrip} />
        <div className="absolute inset-x-0 bottom-0 top-[10%] flex flex-col pt-10">
          <div
            ref={chooseTripPanelRef}
            className="flex flex-col flex-1 min-h-0 w-full max-w-[520px] mx-auto rounded-t-3xl bg-white shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex-shrink-0 flex items-center justify-between px-5 pt-4 pb-3 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Choose trip</h2>
              <button
                type="button"
                onClick={closeChooseTrip}
                aria-label="Close"
                className="h-10 w-10 rounded-full grid place-items-center hover:bg-gray-100 transition-colors"
                style={{ color: theme.colors.gray600 }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4">
              {showDefaultAddedToast && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-[13px] font-medium text-emerald-700">
                  Default location added successfully.
                </div>
              )}

              {/* Trip cards */}
              <div className="mt-4 space-y-4 ">
                {defaultTrips.map((trip) => {
                  const swapped = swappedTripIds[trip.id];
                  const pickupName = swapped ? trip.toName : trip.fromName;
                  const pickupAddress = swapped ? trip.toAddress : trip.fromAddress;
                  const dropName = swapped ? trip.fromName : trip.toName;
                  const dropAddress = swapped ? trip.fromAddress : trip.toAddress;
                  return (
                  <div
                    key={trip.id}
                    className="rounded-2xl border border-gray-200 bg-white p-4"
                  >
                    <div className="flex gap-3">
                      {/* Timeline: green dot, line, red pin */}
                      <div className="flex flex-col items-center flex-shrink-0 pt-0.5">
                        <div className="h-3 w-3 rounded-full flex-shrink-0" style={{ backgroundColor: theme.colors.success }} />
                        <div className="w-px flex-1 min-h-[24px] my-1 flex-shrink-0" style={{ backgroundColor: theme.colors.border }} />
                        <svg className="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" style={{ color: theme.colors.error }}>
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                        </svg>
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col justify-center items-right align-center">
                        {/* Pickup row */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="font-bold" style={{ fontSize: theme.fontSizes.md, color: theme.colors.gray900 }}>{pickupName}</div>
                            <div className="mt-0.5" style={{ fontSize: theme.fontSizes.sm, color: theme.colors.gray500 }}>{pickupAddress}</div>
                            <div className="mt-1" style={{ fontSize: theme.fontSizes.xs, color: theme.colors.gray400 }}>
                              {trip.contactName} | {trip.contactPhone}
                            </div>
                          </div>
                          <button
                            type="button"
                            aria-label="Edit pickup"
                            onClick={() => {
                              handleBookNow(trip);
                              router.push(ROUTES.PICKUP_LOCATION_EDIT);
                            }}
                            className="h-9 w-9 flex-shrink-0 rounded-full grid place-items-center hover:bg-gray-100 transition-colors align-center"
                            style={{ color: theme.colors.textMuted }}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 3.487a2.25 2.25 0 013.182 3.182L7.5 19.213 3 21l1.787-4.5L16.862 3.487z" />
                            </svg>
                          </button>
                        </div>

                        {/* Swap button – between pickup and drop */}
                        <div className="flex justify-end py-1">
                          <button
                            type="button"
                            aria-label="Swap locations"
                            onClick={() => handleSwapTrip(trip.id)}
                            className="h-9 w-9 rounded-full grid place-items-center text-white flex-shrink-0"
                            style={{ backgroundColor: theme.colors.primary }}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
                            </svg>
                          </button>
                        </div>

                        {/* Drop row */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="font-bold" style={{ fontSize: theme.fontSizes.md, color: theme.colors.gray900 }}>{dropName}</div>
                            <div className="mt-0.5" style={{ fontSize: theme.fontSizes.sm, color: theme.colors.gray500 }}>{dropAddress}</div>
                            <div className="mt-1" style={{ fontSize: theme.fontSizes.xs, color: theme.colors.gray400 }}>
                              {trip.contactName} | {trip.contactPhone}
                            </div>
                          </div>
                          <button
                            type="button"
                            aria-label="Edit drop"
                            onClick={() => {
                              handleBookNow(trip);
                              router.push(ROUTES.PICKUP_LOCATION_EDIT);
                            }}
                            className="h-9 w-9 flex-shrink-0 rounded-full grid place-items-center hover:bg-gray-100 transition-colors"
                            style={{ color: theme.colors.textMuted }}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 3.487a2.25 2.25 0 013.182 3.182L7.5 19.213 3 21l1.787-4.5L16.862 3.487z" />
                            </svg>
                          </button>
                        </div>

                        {/* Card Book Now → */}
                        <button
                          type="button"
                          onClick={() => handleBookNow(trip)}
                          className="mt-4 w-full rounded-xl border bg-white py-3 px-4 flex items-center justify-center gap-2 font-medium hover:bg-gray-50 transition-colors"
                          style={{ borderColor: theme.colors.border, color: theme.colors.textPrimary, fontSize: theme.fontSizes.md }}
                        >
                          Book Now
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5} style={{ color: theme.colors.textPrimary }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>

              {/* Add More Default Location – primary */}
              <button
                type="button"
                onClick={handleAddMoreDefaultLocation}
                className="mt-5 w-full rounded-xl py-4 px-4 flex items-center justify-center gap-2 font-semibold hover:opacity-95 transition-opacity"
                style={{ backgroundColor: theme.colors.primary, color: theme.colors.white, fontSize: theme.fontSizes.lg }}
              >
                Add More Default Location
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5} style={{ color: theme.colors.white }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      ) : null}

      <PageContainer className="relative z-0 pb-10 pt-3 sm:pt-4">
        {/* Header – glass bar matches marketing Header; sticky + full-bleed within viewport */}
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

        {/* Greeting */}
        <h1
          className="break-words text-2xl font-bold leading-tight sm:text-3xl"
          style={{ color: theme.colors.gray800 }}
        >
          Hi, {userName}
        </h1>

        {/* Pickup location – large white input with pin */}
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

        {/* Instant Delivery – card: light grey bg, shadow, primary CTA, illustration */}
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
                Instant Delivery
              </h2>
              <p
                className="mt-1 font-normal pb-6"
                style={{ fontSize: theme.fontSizes.sm, fontWeight: 800, color: theme.colors.gray600 }}
              >
                Book a vehicle in a second
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

        {/* Find Restaurant & Food – same design as Instant Delivery */}
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
              <svg className="w-full h-full max-h-[100px] sm:max-h-[140px] text-[var(--landing-primary)] opacity-90" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <ellipse cx="60" cy="58" rx="42" ry="14" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.5" />
                <ellipse cx="60" cy="54" rx="35" ry="11" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1" />
                <ellipse cx="40" cy="52" rx="10" ry="4" fill="currentColor" fillOpacity="0.35" />
                <ellipse cx="60" cy="50" rx="10" ry="4" fill="currentColor" fillOpacity="0.4" />
                <ellipse cx="80" cy="52" rx="10" ry="4" fill="currentColor" fillOpacity="0.35" />
                <ellipse cx="60" cy="48" rx="12" ry="5" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeOpacity="0.2" strokeWidth="0.8" />
              </svg>
            </div>
          </div>
        </div>

        {/* Choose service — walk → 4W */}
        <h2 className="mt-8 text-center font-normal" style={{ fontSize: theme.fontSizes.lg, color: theme.colors.gray800 }}>Choose service</h2>
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
                <div className="mt-2 font-medium" style={{ fontSize: theme.fontSizes.sm, color: theme.colors.gray800 }}>{s.label}</div>
              </button>
            );
          })}
        </div>

        {/* Bottom hero – same animated asset as landing Hero */}
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

        {/* Tagline – light grey, two lines */}
        <p
          className="mt-6 text-center text-2xl font-bold leading-tight tracking-tight sm:text-left sm:text-3xl md:text-4xl"
          style={{ color: theme.colors.gray400 }}
        >
          Goods time pe
          <br />
          <span style={{ color: theme.colors.gray500 }}>Business prime pe</span>
        </p>
      </PageContainer>
    </div>
  );
}