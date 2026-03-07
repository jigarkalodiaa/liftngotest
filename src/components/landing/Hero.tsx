'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useMenu } from './PageWrapper';
import { setLandingPickupLocation } from '@/lib/storage';

/** Hero: ₹0 DELIVERY FEE, pickup input, Use my current location, illustration. */
export default function Hero() {
  const { openLogin } = useMenu();
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          if (data.display_name) {
            const parts = data.display_name.split(',');
            setLocation(parts.slice(0, 3).join(',').trim());
          } else {
            setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          }
        } catch {
          setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        }
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
    setLandingPickupLocation(location.trim() || null);
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

          <div className="max-w-md mx-auto text-left">
            <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white h-14 px-2 shadow-sm">
              <span className="pl-3 flex items-center text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1112 6a2.5 2.5 0 010 5.5z"/>
                </svg>
              </span>
              <input
                type="text"
                placeholder="Enter Pickup Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="flex-1 min-w-0 bg-transparent text-gray-900 placeholder:text-gray-400 outline-none text-base pl-4"
                aria-label="Pickup location"
              />
              <button
                onClick={handleContinue}
                className="h-10 w-10 sm:h-11 sm:w-11 flex-shrink-0 rounded-full bg-[var(--color-primary)] flex items-center justify-center hover:opacity-90 transition-opacity"
                aria-label="Continue"
              >
                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleUseCurrentLocation}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 rounded-lg  bg-white px-6 py-3.5 text-base font-small text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 transition-colors h-8"
              >
              {isLoading ? (
                <svg className="w-5 h-5 animate-spin text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" aria-hidden>
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
              {isLoading ? 'Getting location...' : 'Use my current location'}
            </button>
            </div>
            {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
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
