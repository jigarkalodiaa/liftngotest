'use client';

import Image from 'next/image';
import { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import MobileMenu from '@/components/landing/MobileMenu';
import { useRouter } from 'next/navigation';
import type { ServiceId, DefaultTrip } from '@/types/booking';
import {
  getPickupLocation,
  getSenderDetails,
  setPickupLocation,
  setDropLocation,
  setSenderDetails,
  setReceiverDetails,
  setSelectedService,
  getLoggedIn,
} from '@/lib/storage';
import { ROUTES } from '@/lib/constants';
import { DEFAULT_TRIPS } from '@/data/defaultTrips';
import { PageContainer } from '@/components/ui';
import { theme } from '@/config/theme';

export default function DashboardPage() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [pickup, setPickup] = useState<{ name: string; address: string } | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [activeService, setActiveService] = useState<ServiceId>('walk');
  const [isChooseTripOpen, setIsChooseTripOpen] = useState(false);
  /** Which trip cards have pickup/drop swapped for display and Book Now */
  const [swappedTripIds, setSwappedTripIds] = useState<Record<string, boolean>>({});

  const syncPickupFromStorage = useCallback(() => {
    const loc = getPickupLocation();
    setPickup(loc);
  }, []);

  const syncUserName = useCallback(() => {
    const sender = getSenderDetails();
    setUserName(sender?.name?.trim() || 'there');
  }, []);

  useEffect(() => {
    syncUserName();
  }, [syncUserName]);

  useEffect(() => {
    syncPickupFromStorage();
  }, [syncPickupFromStorage]);

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
    };
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [syncPickupFromStorage, syncUserName]);

  const services = useMemo(
    () => [
      { id: 'walk' as const, label: 'Walk', image: '/dashboard/service-walk.png' },
      { id: 'twoWheeler' as const, label: '2 Wheeler', image: '/dashboard/service-2wheeler.png' },
      { id: 'threeWheeler' as const, label: '3 Wheeler', image: '/dashboard/service-3wheeler.png' },
    ],
    []
  );

  const defaultTrips = DEFAULT_TRIPS;

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
    router.push(ROUTES.TRIP_OPTIONS);
  }, [router]);

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

      {/* Choose trip – bottom sheet (scrollable) */}
      <div
        className={`fixed inset-0 z-[80] transition-opacity ${
          isChooseTripOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
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

              {/* Add More Default Location – primary blue */}
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

      <PageContainer className="pb-10">
        {/* Header – LiftnGo LOGISTICS logo + hamburger */}
        <header className="pt-4 pb-2">
          <div className="flex items-center justify-between">
            <Image
              src="/logo.png"
              alt="LiftnGo Logistics – Goods transport & last-mile delivery"
              width={160}
              height={48}
              className="h-9 w-auto"
              priority
            />
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open menu"
              className="h-10 w-10 rounded-full border border-gray-200 bg-white shadow-sm grid place-items-center hover:bg-gray-50 transition-colors"
            >
              <svg className="h-5 w-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </header>

        {/* Greeting */}
        <h1 className="font-bold mt-2" style={{ fontSize: theme.fontSizes['3xl'], color: theme.colors.gray800 }}>
          Hi, {userName}
        </h1>

        {/* Pickup location – large white input with pin */}
        <button
          type="button"
          onClick={() => router.push(ROUTES.PICKUP_LOCATION)}
          className="mt-4 w-full rounded-2xl border border-gray-200 bg-white px-4 py-4 shadow-sm text-left flex items-center gap-3 hover:bg-gray-50/80 transition-colors"
        >
          <span className="flex h-5 w-5 shrink-0 text-gray-400" aria-hidden>
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s7-4.5 7-11a7 7 0 10-14 0c0 6.5 7 11 7 11z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </span>
          <span className={`font-medium ${pickup?.name || pickup?.address ? '' : ''}`} style={{ fontSize: theme.fontSizes.md, color: pickup?.name || pickup?.address ? theme.colors.gray900 : theme.colors.gray400 }}>
            {pickup?.name || pickup?.address || 'Enter Pickup Location'}
          </span>
        </button>

        {/* Instant Delivery – Figma card: light grey bg, shadow, blue button, illustration */}
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
                className="inline-flex items-center justify-center text-white font-medium hover:opacity-95 transition-opacity"
                style={{
                  backgroundColor: theme.colors.primary,
                  width: 134,
                  height: 44,
                  borderRadius: 10,
                  fontSize: theme.fontSizes.md,
                }}
              >
                Book Now
              </button>
            </div>
            <div className="relative h-[100px] w-full max-w-[140px] sm:h-[160px] sm:max-w-[220px] flex-shrink-0 mx-auto sm:mx-0 sm:ml-auto ">
              <Image
                src="/dashboard/dashboard.png"
                alt=""
                fill
                className="object-contain object-right"
                sizes="40px"
              />
            </div>
          </div>
        </div>

        {/* Choose service – heading + three cards */}
        <h2 className="mt-8 text-center font-normal" style={{ fontSize: theme.fontSizes.lg, color: theme.colors.gray800 }}>Choose service</h2>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {services.map((s) => {
            const active = s.id === activeService;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveService(s.id)}
                className={`rounded-2xl bg-white px-2 pt-4 pb-3 text-center transition-all border ${
                  active ? 'shadow-md ring-1' : 'border-gray-200 shadow-sm hover:shadow-md'
                }`}
                style={active ? { borderColor: `${theme.colors.primary}66`, boxShadow: `0 0 0 1px ${theme.colors.primary}33` } : undefined}
              >
                <div className="relative mx-auto h-[72px] w-[80px]">
                  <Image src={s.image} alt={s.label} fill className="object-contain" sizes="80px" />
                </div>
                <div className="mt-2 font-medium" style={{ fontSize: theme.fontSizes.sm, color: theme.colors.gray800 }}>{s.label}</div>
              </button>
            );
          })}
        </div>

        {/* Bottom hero – delivery person + tablet + pin */}
        <div className="relative mt-8 rounded-3xl bg-gradient-to-b from-gray-50 to-blue-50/30 px-4 pt-6 pb-6 overflow-hidden min-h-[200px]">
          <div className="relative mx-auto h-[200px] w-full max-w-[340px]">
            <Image
              src="/dashboard/hero-delivery.png"
              alt=""
              fill
              className="object-contain"
              sizes="(max-width: 340px) 100vw, 340px"
            />
          </div>
        </div>

        {/* Tagline – light grey, two lines */}
        <p className="mt-6 leading-[1.2] font-bold tracking-tight text-center sm:text-left" style={{ fontSize: theme.fontSizes['4xl'], color: theme.colors.gray400 }}>
          Goods time pe
          <br />
          <span style={{ color: theme.colors.gray500 }}>Business prime pe</span>
        </p>
      </PageContainer>
    </div>
  );
}