'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useMenu } from './PageWrapper';
import HeroPickupAutocomplete from './HeroPickupAutocomplete';
import { getLandingPickupLocation, setLandingPickupLocation, setPostLoginPath } from '@/lib/storage';
import { ROUTES } from '@/lib/constants';

/** Hero: ₹0 DELIVERY FEE, pickup input, Use my current location, illustration. */
export default function Hero() {
  const { openLogin } = useMenu();
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  /** Keep landing draft in sync while typing so login always sees the latest address. */
  useEffect(() => {
    const trimmed = location.trim();
    if (!trimmed) return;
    const t = window.setTimeout(() => setLandingPickupLocation(trimmed), 400);
    return () => window.clearTimeout(t);
  }, [location]);

  const handleUseCurrentLocation = async () => {
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
  };

  const handleContinue = () => {
    const fromInput = location.trim();
    const fromDraft = getLandingPickupLocation()?.trim() ?? '';
    const merged = fromInput || fromDraft;
    setLandingPickupLocation(merged || null);
    setPostLoginPath(ROUTES.PICKUP_LOCATION);
    openLogin();
  };

  return (
    <section className="relative bg-[var(--landing-bg)] pt-6 sm:pt-8 pb-12 lg:pb-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl sm:text-4xl lg:text-6xl font-bold tracking-tight mb-1 pt-6">
            <span className="text-[var(--landing-orange)]">₹0 DELIVERY FEE</span>
          </h1>
          <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 pt-2 sm:pt-4">ON FIRST ORDER</p>
          <p className="text-sm text-gray-400 mb-14 ">*Other fees apply</p>

          <div className="relative z-10 mx-auto max-w-md text-left">
            <div className="flex h-14 items-center gap-2 rounded-2xl border border-gray-200 bg-white px-2 shadow-sm">
              <span className="flex flex-shrink-0 items-center pl-3 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1112 6a2.5 2.5 0 010 5.5z"/>
                </svg>
              </span>
              <HeroPickupAutocomplete
                value={location}
                disabled={isLoading}
                onChange={(v) => {
                  setLocation(v);
                  if (!v.trim()) setLandingPickupLocation(null);
                }}
                onPickSuggestion={(desc) => setLandingPickupLocation(desc)}
              />
              <button
                type="button"
                onClick={handleContinue}
                disabled={isLoading}
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:h-11 sm:w-11"
                aria-label="Continue"
              >
                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                disabled={isLoading}
                className="flex h-8 items-center justify-center gap-2 rounded-lg bg-white px-6 py-3.5 text-base font-small text-gray-800 shadow-sm transition-colors hover:bg-gray-50 disabled:opacity-50"
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

          <div className="mt-10 sm:mt-12 flex justify-center">
            <div className="relative w-full max-w-lg h-52 sm:h-64 lg:h-72">
              <Image
                src="/icons/fooddelivery.png"
                alt="Delivery – on-demand logistics"
                fill
                className="object-contain"
                priority
                sizes="(max-width: 1024px) 100vw, 512px"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
