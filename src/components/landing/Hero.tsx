'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useMenu } from './PageWrapper';

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
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleOpenLogin = () => {
    try {
      if (typeof window !== 'undefined') {
        const trimmed = location.trim();
        if (trimmed) {
          window.localStorage.setItem('landing_pickup_location', trimmed);
        } else {
          window.localStorage.removeItem('landing_pickup_location');
        }
      }
    } catch {
      // ignore storage errors
    }
    openLogin();
  };

  return (
    <section className="relative bg-gradient-to-b from-orange-50 to-white py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            <span className="text-orange-500">₹0 DELIVERY FEE</span>
            <br />
            <span className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-700">
              ON FIRST ORDER
            </span>
          </h1>
          <p className="text-gray-500 text-sm mb-8">*Other fees apply</p>

          <div className="max-w-md mx-auto">
            <div className="relative">
              <div className="flex items-center bg-white rounded-full shadow-lg border border-gray-200 p-2">
                <div className="flex items-center flex-1 px-4">
                  <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Enter Pickup Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="flex-1 outline-none text-gray-700 placeholder-gray-400"
                  />
                </div>
                <button 
                  onClick={handleOpenLogin}
                  className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors"
                >
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>

            <button
              onClick={handleUseCurrentLocation}
              disabled={isLoading}
              className="mt-4 flex items-center justify-center gap-2 text-orange-500 hover:text-orange-600 transition-colors mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
              <span className="text-sm font-medium">
                {isLoading ? 'Getting location...' : 'Use my current location'}
              </span>
            </button>

            {error && (
              <p className="mt-2 text-red-500 text-sm">{error}</p>
            )}
          </div>

          <div className="mt-12 flex justify-center">
            <div className="relative w-full max-w-lg h-64 sm:h-80">
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10" />
              <Image
                src="/hero-delivery.svg"
                alt="Delivery illustration"
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
