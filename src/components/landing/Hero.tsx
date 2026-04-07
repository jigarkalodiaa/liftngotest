'use client';

import { useState, useEffect, useCallback, memo } from 'react';
import { useMenu, useLandingPickup } from './PageWrapper';
import HeroPickupAutocomplete from './HeroPickupAutocomplete';
import { getLandingPickupLocation, setLandingPickupLocation, setPostLoginPath } from '@/lib/storage';
import { ROUTES } from '@/lib/constants';
import { trackBookNowClick } from '@/lib/analytics';

export type HeroProps = {
  /** Use `h2` when the page already has a primary `h1` (e.g. city SEO landings). */
  heroTitleLevel?: 'h1' | 'h2';
  /** PostHog `booking_started.source` for the hero pickup field (once per mount, user focus only). */
  pickupBookingSource?: 'homepage' | 'landing';
};

/** Hero: ₹0 DELIVERY FEE, pickup input, Use my current location, illustration. */
function Hero({ heroTitleLevel = 'h1', pickupBookingSource }: HeroProps) {
  const { openLogin } = useMenu();
  const { pickupDraft: location, setPickupDraft: setLocation } = useLandingPickup();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUseCurrentLocation = useCallback(async () => {
    setError('');
    setIsLoading(true);
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setIsLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const coordsFallback = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
        let resolved = coordsFallback;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          if (data.display_name) {
            const parts = data.display_name.split(',');
            resolved = parts.slice(0, 3).join(',').trim();
          }
        } catch {
          resolved = coordsFallback;
        }
        setLandingPickupLocation(resolved);
        setLocation(resolved);
        setIsLoading(false);
      },
      (err) => {
        setIsLoading(false);
        setError(
          err.code === err.PERMISSION_DENIED
            ? 'Location permission denied. Enable it in browser settings.'
            : 'Location unavailable.'
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, [setLocation]);

  const handleContinue = useCallback(() => {
    trackBookNowClick('hero_pickup_continue');
    const fromInput = location.trim();
    const fromDraft = getLandingPickupLocation()?.trim() ?? '';
    const merged = fromInput || fromDraft;
    setLandingPickupLocation(merged || null);
    setPostLoginPath(ROUTES.PICKUP_LOCATION);
    openLogin();
  }, [location, openLogin]);

  const TitleTag = heroTitleLevel === 'h2' ? 'h2' : 'h1';
  const titleClass =
    'text-balance text-[clamp(1.25rem,4.2vw,2.75rem)] font-bold leading-tight tracking-tight text-gray-900 sm:text-3xl lg:text-5xl max-w-4xl mx-auto';

  return (
    <section className="page-section relative bg-[var(--landing-bg)]">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="text-center">
          <TitleTag className={titleClass}>
            Goods Time Pe, Business Prime Pe
          </TitleTag>
          <p className="mt-2 text-[clamp(1.35rem,5.5vw,3.75rem)] font-bold leading-tight text-[var(--landing-orange)] sm:text-4xl lg:text-6xl max-w-4xl mx-auto">
            ₹0 delivery fee on first order
          </p>
          <p className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-1 pt-3 sm:pt-4 px-1">
            Multi-vehicle logistics · Khatu &amp; NCR · EV, CNG, Diesel, Petrol
          </p>
          <p className="text-sm text-gray-400 mb-10 sm:mb-14">*Other fees apply</p>

          <div className="relative z-10 mx-auto w-full max-w-lg text-left">
            <div className="flex min-h-14 min-w-0 items-center gap-2 rounded-2xl border border-gray-200 bg-white px-2 py-1 shadow-sm sm:h-14 sm:py-0">
              <span className="flex flex-shrink-0 items-center pl-3 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1112 6a2.5 2.5 0 010 5.5z"/>
                </svg>
              </span>
              <HeroPickupAutocomplete
                bookingSource={pickupBookingSource}
                value={location}
                disabled={isLoading}
                onChange={(v) => {
                  setLocation(v);
                  if (!v.trim()) setLandingPickupLocation(null);
                }}
                onPickSuggestion={(desc) => {
                  setLocation(desc);
                  setLandingPickupLocation(desc);
                }}
              />
              <button
                type="button"
                onClick={handleContinue}
                disabled={isLoading}
                className="flex h-11 w-11 min-h-[44px] min-w-[44px] flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:h-11 sm:w-11"
                aria-label="Continue"
              >
                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
            <div className="mt-4 flex justify-stretch sm:justify-end">
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                disabled={isLoading}
                className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-medium text-gray-800 shadow-sm transition-colors hover:bg-gray-50 disabled:opacity-50 sm:w-auto sm:px-6 sm:text-base"
              >
                {isLoading ? (
                  <svg className="h-5 w-5 animate-spin text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" aria-hidden>
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
                {isLoading ? 'Getting location...' : 'Use my current location'}
              </button>
            </div>
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          </div>

          {/* Header compact pickup appears only after everything above has scrolled out (see Header). */}
          <div
            id="landing-hero-pickup-end-sentinel"
            className="pointer-events-none mx-auto h-px w-full max-w-lg shrink-0"
            aria-hidden
          />

          <div className="mt-10 sm:mt-12 flex justify-center px-1">
            <div className="relative mx-auto aspect-square w-full max-w-md min-w-0 sm:max-w-lg">
              {/* Hero illustration — replaceable asset in /public */}
              <img
                src="/images/liftngohero.gif"
                alt="Liftngo — food and goods delivery"
                width={1024}
                height={1024}
                className="h-full w-full object-contain object-center"
                sizes="(max-width: 640px) 100vw, 28rem"
                fetchPriority="high"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default memo(Hero);
