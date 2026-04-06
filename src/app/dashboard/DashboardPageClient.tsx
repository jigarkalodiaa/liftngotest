'use client';

import { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import MobileMenu from '@/components/landing/MobileMenu';
import { useRouter, useSearchParams } from 'next/navigation';
import type { ServiceId, DefaultTrip } from '@/types/booking';
import {
  getPickupLocation,
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
import { getGreetingDisplayName } from '@/lib/greeting';
import { DEFAULT_TRIPS } from '@/data/defaultTrips';
import { theme } from '@/config/theme';
import { Info } from 'lucide-react';
import { useDashboardLocation } from '@/features/location';
import { KhatuDashboard } from '@/features/khatu';
import { NoidaDashboard } from '@/features/noida';
import { trackEvent } from '@/lib/posthogAnalytics';
import DefaultDashboardView from './DefaultDashboardView';

export interface DashboardPageClientProps {
  /** Used after `?defaultAdded=1` cleanup — keep user on `/noida` vs `/dashboard`. */
  dashboardPath?: string;
}

export function DashboardPageClient({ dashboardPath = ROUTES.DASHBOARD }: DashboardPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { zoneConfig, location: dashboardLocation, openLocationModal } = useDashboardLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [pickup, setPickup] = useState<{ name: string; address: string } | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [activeService, setActiveService] = useState<ServiceId>('walk');
  const [isChooseTripOpen, setIsChooseTripOpen] = useState(false);
  const [showDefaultAddedToast, setShowDefaultAddedToast] = useState(false);
  const [customDefaultTrips, setCustomDefaultTrips] = useState<DefaultTrip[]>([]);
  const [swappedTripIds, setSwappedTripIds] = useState<Record<string, boolean>>({});
  const [routeDetailTripId, setRouteDetailTripId] = useState<string | null>(null);

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
    if (!zoneConfig.allowedServices.includes(activeService)) {
      const fallback = zoneConfig.allowedServices[0] ?? 'walk';
      setActiveService(fallback);
      setSelectedService(fallback);
    }
  }, [zoneConfig.allowedServices, activeService]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!getLoggedIn()) {
      router.replace(ROUTES.HOME);
    }
  }, [router]);

  useEffect(() => {
    const zone = dashboardLocation?.zone ?? 'default';
    trackEvent('page_viewed', {
      page: 'dashboard',
      zone,
      path: dashboardPath,
    });
  }, [dashboardLocation?.zone, dashboardPath]);

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

  const allServices = useMemo(
    () => [
      { id: 'walk' as const, label: 'Walk', image: '/dashboard/service-walk.png' },
      { id: 'twoWheeler' as const, label: '2 Wheeler', image: '/dashboard/service-2wheeler.png' },
      { id: 'threeWheeler' as const, label: '3 Wheeler', image: '/dashboard/service-3wheeler.png' },
      { id: 'fourWheeler' as const, label: '4 Wheeler', image: '/services/four-wheeler.svg' },
    ],
    [],
  );

  const services = useMemo(
    () => allServices.filter((s) => zoneConfig.allowedServices.includes(s.id)),
    [allServices, zoneConfig.allowedServices],
  );

  const defaultTrips = useMemo(() => {
    const merged = [...customDefaultTrips, ...DEFAULT_TRIPS];
    const seen = new Set<string>();
    const out: DefaultTrip[] = [];
    for (const t of merged) {
      const key = `${t.fromName.trim()}|${t.fromAddress.trim()}|${t.toName.trim()}|${t.toAddress.trim()}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(t);
    }
    return out;
  }, [customDefaultTrips]);

  useEffect(() => {
    if (searchParams.get('defaultAdded') !== '1') return;
    setIsChooseTripOpen(true);
    setShowDefaultAddedToast(true);
    syncCustomDefaultTrips();
    router.replace(dashboardPath);
  }, [searchParams, router, syncCustomDefaultTrips, dashboardPath]);

  useEffect(() => {
    if (!showDefaultAddedToast) return;
    const id = window.setTimeout(() => setShowDefaultAddedToast(false), 3000);
    return () => window.clearTimeout(id);
  }, [showDefaultAddedToast]);

  const handleBookNow = useCallback(
    (trip: DefaultTrip) => {
      trackEvent('booking_started', { source: 'landing' });
      const swapped = swappedTripIds[trip.id];
      const pickupData = swapped
        ? { name: trip.toName, address: trip.toAddress, contact: `${trip.contactName} | ${trip.contactPhone}` }
        : { name: trip.fromName, address: trip.fromAddress, contact: `${trip.contactName} | ${trip.contactPhone}` };
      const dropData = swapped
        ? { name: trip.fromName, address: trip.fromAddress, contact: `${trip.contactName} | ${trip.contactPhone}` }
        : { name: trip.toName, address: trip.toAddress, contact: `${trip.contactName} | ${trip.contactPhone}` };
      setPickupLocation(pickupData);
      setDropLocation(dropData);
      setSenderDetails({ name: trip.contactName, mobile: trip.contactPhone });
      setReceiverDetails({ name: trip.contactName, mobile: trip.contactPhone });
      setSelectedService(activeService);
      setIsChooseTripOpen(false);
      router.push(ROUTES.TRIP_OPTIONS);
    },
    [activeService, router, swappedTripIds],
  );

  const handleSwapTrip = useCallback((tripId: string) => {
    setSwappedTripIds((prev) => ({ ...prev, [tripId]: !prev[tripId] }));
  }, []);

  const closeChooseTrip = useCallback(() => {
    setRouteDetailTripId(null);
    setIsChooseTripOpen(false);
  }, []);

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
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
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
      } else if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
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

  const currentZone = dashboardLocation?.zone ?? 'default';
  const isKhatuZone = currentZone === 'khatu';
  const isNoidaZone = currentZone === 'noida';

  const onFlagshipBookNow = useCallback(() => {
    setActiveService('twoWheeler');
    setSelectedService('twoWheeler');
    router.push(ROUTES.PICKUP_LOCATION);
  }, [router]);

  const bgClass = isKhatuZone
    ? 'bg-gradient-to-b from-amber-50/90 via-orange-50/30 to-white'
    : isNoidaZone
      ? 'bg-gradient-to-b from-blue-50/80 via-white to-white'
      : 'bg-white';

  return (
    <div className={`min-h-screen ${bgClass}`}>
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity ${
          isMenuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {isChooseTripOpen ? (
        <div className="fixed inset-0 z-[80] opacity-100 transition-opacity" role="dialog" aria-modal="true" aria-label="Choose trip">
          <div className="absolute inset-0 bg-black/40" onClick={closeChooseTrip} />
          <div className="absolute inset-x-0 bottom-0 top-[6%] flex flex-col sm:top-[10%] sm:pt-6">
            <div
              ref={chooseTripPanelRef}
              className="relative mx-auto flex min-h-0 w-full max-w-[440px] flex-1 flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:max-w-[480px] sm:rounded-2xl"
            >
              {routeDetailTripId ? (
                <div className="absolute inset-0 z-20 flex flex-col bg-white">
                  <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-4 py-2.5">
                    <h3 className="text-sm font-bold text-gray-900">Full route</h3>
                    <button
                      type="button"
                      onClick={() => setRouteDetailTripId(null)}
                      className="grid h-9 w-9 place-items-center rounded-full text-gray-500 hover:bg-gray-100"
                      aria-label="Back"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3 text-[13px] leading-relaxed text-gray-700">
                    {(() => {
                      const trip = defaultTrips.find((t) => t.id === routeDetailTripId);
                      if (!trip) return null;
                      const swapped = swappedTripIds[trip.id];
                      const pName = swapped ? trip.toName : trip.fromName;
                      const pAddr = swapped ? trip.toAddress : trip.fromAddress;
                      const dName = swapped ? trip.fromName : trip.toName;
                      const dAddr = swapped ? trip.fromAddress : trip.toAddress;
                      const contact = [trip.contactName, trip.contactPhone].filter(Boolean).join(' · ');
                      return (
                        <div className="space-y-4">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-700">Pickup</p>
                            <p className="mt-1 font-semibold text-gray-900">{pName}</p>
                            <p className="mt-0.5 text-gray-600">{pAddr}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wide text-red-700">Drop</p>
                            <p className="mt-1 font-semibold text-gray-900">{dName}</p>
                            <p className="mt-0.5 text-gray-600">{dAddr}</p>
                          </div>
                          {contact ? <p className="text-xs text-gray-500">Contact: {contact}</p> : null}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              ) : null}

              <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-4 pb-2.5 pt-3">
                <h2 className="text-base font-bold text-gray-900 sm:text-lg">Choose trip</h2>
                <button
                  type="button"
                  onClick={closeChooseTrip}
                  aria-label="Close"
                  className="grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-gray-100"
                  style={{ color: theme.colors.gray600 }}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
                {showDefaultAddedToast && (
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-xs font-medium text-emerald-800">
                    Default location added successfully.
                  </div>
                )}

                <div className={`space-y-2.5 ${showDefaultAddedToast ? 'mt-2.5' : ''}`}>
                  {defaultTrips.map((trip) => {
                    const swapped = swappedTripIds[trip.id];
                    const pickupName = swapped ? trip.toName : trip.fromName;
                    const pickupAddress = swapped ? trip.toAddress : trip.fromAddress;
                    const dropName = swapped ? trip.fromName : trip.toName;
                    const dropAddress = swapped ? trip.fromAddress : trip.toAddress;
                    const contactLine = [trip.contactName, trip.contactPhone].filter(Boolean).join(' · ');
                    return (
                      <div
                        key={trip.id}
                        className="rounded-xl border border-gray-200/90 bg-gray-50/30 p-2.5 shadow-sm sm:p-3"
                      >
                        <div className="flex gap-2.5">
                          <div className="relative flex w-6 shrink-0 flex-col items-center pt-0.5">
                            <div
                              className="h-2.5 w-2.5 shrink-0 rounded-full"
                              style={{ backgroundColor: theme.colors.success }}
                              aria-hidden
                            />
                            <div
                              className="relative my-0.5 min-h-[32px] w-px flex-1"
                              style={{ backgroundColor: theme.colors.border }}
                              aria-hidden
                            />
                            <button
                              type="button"
                              aria-label="Swap pickup and drop"
                              onClick={() => handleSwapTrip(trip.id)}
                              className="absolute left-1/2 top-[42%] z-[1] grid h-7 w-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-white shadow-md"
                              style={{ backgroundColor: theme.colors.primary }}
                            >
                              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
                              </svg>
                            </button>
                            <svg
                              className="h-4 w-4 shrink-0"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                              style={{ color: theme.colors.error }}
                              aria-hidden
                            >
                              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                            </svg>
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-1.5">
                              <p className="text-[13px] font-bold leading-tight text-gray-900">{pickupName}</p>
                              <div className="flex shrink-0 items-center gap-0.5">
                                <button
                                  type="button"
                                  aria-label="Full address and route"
                                  onClick={() => setRouteDetailTripId(trip.id)}
                                  className="grid h-8 w-8 place-items-center rounded-full text-gray-500 transition-colors hover:bg-white"
                                >
                                  <Info className="h-4 w-4" strokeWidth={2} aria-hidden />
                                </button>
                                <button
                                  type="button"
                                  aria-label="Edit pickup"
                                  onClick={() => {
                                    handleBookNow(trip);
                                    router.push(ROUTES.PICKUP_LOCATION_EDIT);
                                  }}
                                  className="grid h-8 w-8 place-items-center rounded-full text-gray-500 transition-colors hover:bg-white"
                                >
                                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M16.862 3.487a2.25 2.25 0 013.182 3.182L7.5 19.213 3 21l1.787-4.5L16.862 3.487z"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </div>
                            <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-gray-500">{pickupAddress}</p>

                            <div className="my-2 h-px bg-gray-200/80" aria-hidden />

                            <div className="flex items-start justify-between gap-1.5">
                              <p className="text-[13px] font-bold leading-tight text-gray-900">{dropName}</p>
                              <button
                                type="button"
                                aria-label="Edit drop-off"
                                onClick={() => {
                                  handleBookNow(trip);
                                  router.push(ROUTES.PICKUP_LOCATION_EDIT);
                                }}
                                className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-gray-500 transition-colors hover:bg-white"
                              >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M16.862 3.487a2.25 2.25 0 013.182 3.182L7.5 19.213 3 21l1.787-4.5L16.862 3.487z"
                                  />
                                </svg>
                              </button>
                            </div>
                            <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-gray-500">{dropAddress}</p>

                            {contactLine ? (
                              <p className="mt-1.5 truncate text-[10px] text-gray-400">{contactLine}</p>
                            ) : null}

                            <button
                              type="button"
                              onClick={() => handleBookNow(trip)}
                              className="mt-2.5 flex h-10 w-full items-center justify-center gap-1.5 rounded-lg border bg-white text-sm font-semibold transition-colors hover:bg-gray-50"
                              style={{ borderColor: theme.colors.border, color: theme.colors.textPrimary }}
                            >
                              Book now
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={handleAddMoreDefaultLocation}
                  className="mt-4 flex h-11 w-full items-center justify-center gap-1.5 rounded-lg px-3 text-sm font-semibold transition-opacity hover:opacity-95"
                  style={{ backgroundColor: theme.colors.primary, color: theme.colors.white }}
                >
                  Add default location
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5} style={{ color: theme.colors.white }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {isKhatuZone ? (
        <KhatuDashboard
          userName={userName}
          pickup={pickup}
          dashboardLocation={dashboardLocation}
          openLocationModal={openLocationModal}
          setIsMenuOpen={setIsMenuOpen}
          router={router}
          services={services}
          activeService={activeService}
          handleSelectService={handleSelectService}
          onFlagshipBookNow={onFlagshipBookNow}
          onOpenChooseTrip={() => setIsChooseTripOpen(true)}
        />
      ) : isNoidaZone ? (
        <NoidaDashboard
          userName={userName}
          pickup={pickup}
          dashboardLocation={dashboardLocation}
          openLocationModal={openLocationModal}
          setIsMenuOpen={setIsMenuOpen}
          router={router}
          services={services}
          activeService={activeService}
          handleSelectService={handleSelectService}
          onOpenChooseTrip={() => setIsChooseTripOpen(true)}
        />
      ) : (
        <DefaultDashboardView
          userName={userName}
          pickup={pickup}
          zoneConfig={zoneConfig}
          dashboardLocation={dashboardLocation}
          openLocationModal={openLocationModal}
          setIsMenuOpen={setIsMenuOpen}
          router={router}
          setIsChooseTripOpen={setIsChooseTripOpen}
          services={services}
          activeService={activeService}
          handleSelectService={handleSelectService}
        />
      )}
    </div>
  );
}
