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
import { DashboardLocationProvider, useDashboardLocation } from '@/features/location';
import LocationModal from '@/components/location/LocationModal';
import { KhatuDashboard } from '@/features/khatu';
import { NoidaDashboard } from '@/features/noida';
import DefaultDashboardView from './DefaultDashboardView';

export default function DashboardPage() {
  return (
    <DashboardLocationProvider>
      <DashboardPageContent />
      <LocationModal />
    </DashboardLocationProvider>
  );
}

function DashboardPageContent() {
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