'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useMenu } from './PageWrapper';
import { setLandingPickupLocation } from '@/lib/storage';

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
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          if (data.display_name) {
            const parts = data.display_name.split(',');
            const shortAddress = parts.slice(0, 3).join(',').trim();
            setLocation(shortAddress);
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
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError('Location permission denied. Please enable it in your browser settings.');
            break;
          case err.POSITION_UNAVAILABLE:
            setError('Location information is unavailable.');
            break;
          case err.TIMEOUT:
            setError('Location request timed out.');
            break;
          default:
            setError('An unknown error occurred.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleOpenLogin = () => {
    setLandingPickupLocation(location.trim() || null);
    openLogin();
  };

  return (
    <section className="relative bg-[var(--landing-bg)] pt-8 sm:pt-10 lg:pt-12 pb-12 lg:pb-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Offer: ₹0 DELIVERY FEE (orange), ON FIRST ORDER (dark), Other fees apply (grey) */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-1">
            <span className="text-[var(--landing-orange)]">₹0 DELIVERY FEE</span>
          </h1>
          <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1">ON FIRST ORDER</p>
          <p className="text-sm text-gray-500 mb-8">*Other fees apply</p>

          <div className="max-w-md mx-auto text-left">
            {/* Pickup input: white bg, light grey border, location pin, circular primary button */}
            <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white p-2 shadow-sm">
              <svg
                className="h-5 w-5 flex-shrink-0 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <input
                type="text"
                placeholder="Enter Pickup Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="min-h-[48px] flex-1 bg-transparent text-gray-900 placeholder:text-gray-400 outline-none"
                aria-label="Pickup location"
              />
              <button
                onClick={handleOpenLogin}
                className="h-10 w-10 sm:h-11 sm:w-11 flex-shrink-0 rounded-full bg-[var(--color-primary)] flex items-center justify-center hover:opacity-90 transition-opacity"
                aria-label="Continue"
              >
                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>

            {/* Use my current location – small dark grey with icon */}
            <button
              onClick={handleUseCurrentLocation}
              disabled={isLoading}
              className="mt-4 flex items-center justify-center gap-2 text-gray-700 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium mx-auto"
            >
              {isLoading ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden>
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
              {isLoading ? 'Getting location...' : 'Use my current location'}
            </button>

            {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
          </div>

          {/* Hero illustration – delivery driver + customer */}
          <div className="mt-10 sm:mt-12 flex justify-center">
            <div className="relative w-full max-w-lg h-52 sm:h-64 lg:h-72">
              <Image
                src="/hero-delivery.svg"
                alt="Delivery – on-demand logistics"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
