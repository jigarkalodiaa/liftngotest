'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useGeolocation } from '@/hooks';
import { RECENT_SEARCHES } from '@/data/mockLocations';
import { setPickupLocation, setDropLocation, setSenderDetails, setReceiverDetails } from '@/lib/storage';
import { ROUTES } from '@/lib/constants';
import type { SavedLocation } from '@/types/booking';

function EditPickupLocationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get('type') === 'drop' ? 'drop' : 'pickup';
  const rawReturnTo = searchParams.get('returnTo');
  const returnTo = rawReturnTo && rawReturnTo.startsWith('/') && !rawReturnTo.startsWith('//') ? rawReturnTo : null;
  const { isLoading, error, getLocation } = useGeolocation();
  const [searchValue, setSearchValue] = useState('');

  const handleUseCurrentLocation = async () => {
    const result = await getLocation();
    if (result) {
      const locationData: SavedLocation = {
        name: 'Current Location',
        address: result.shortAddress,
        contact: '',
      };
      if (type === 'drop') {
        setDropLocation(locationData);
      } else {
        setPickupLocation(locationData);
      }
      setSearchValue(result.shortAddress);
      if (returnTo) {
        router.push(returnTo);
      } else {
        router.push(ROUTES.HOME);
      }
    }
  };

  const handleSelectLocation = (item: SavedLocation & { id: string }) => {
    const loc: SavedLocation = { name: item.name, address: item.address, contact: item.contact };
    if (type === 'drop') {
      setDropLocation(loc);
      if (item.contact) {
        const parts = item.contact.split('|').map((p) => p.trim());
        const mobile = (parts[1] || '').replace(/\D/g, '').slice(0, 10);
        setReceiverDetails({ name: parts[0] || '', mobile });
      }
    } else {
      setPickupLocation(loc);
      if (item.contact) {
        const parts = item.contact.split('|').map((p) => p.trim());
        const mobile = (parts[1] || '').replace(/\D/g, '').slice(0, 10);
        setSenderDetails({ name: parts[0] || '', mobile });
      }
    }
    if (returnTo) {
      router.push(returnTo);
    } else {
      router.back();
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-[520px] px-4 pb-6 pt-6">
        {/* Header search bar */}
        <header className="pt-4 pb-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => (returnTo ? router.push(returnTo) : router.back())}
              aria-label="Back"
              className="h-9 w-9 rounded-full border border-gray-200 bg-white grid place-items-center"
            >
              <svg className="h-5 w-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex-1">
              <div className="rounded-2xl border border-gray-300 bg-white px-4 py-2.5">
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder={type === 'drop' ? 'Enter Drop Location' : 'Enter Pick Location'}
                  className="w-full bg-transparent text-[14px] text-gray-900 placeholder:text-gray-500 outline-none"
                />
              </div>
            </div>
            <div className="w-4" />
          </div>
        </header>

        {/* Use my current location */}
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={isLoading}
          className="flex w-full items-center justify-between border-b border-gray-200 py-3 text-left disabled:opacity-50"
        >
          <div className="flex items-center gap-2">
            {isLoading ? (
              <svg className="h-4 w-4 animate-spin text-gray-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
            <span className="text-[14px] text-gray-800">
              {isLoading ? 'Getting location...' : 'Use my current location'}
            </span>
          </div>
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

        {/* Recent search */}
        <div className="mt-3 flex items-center justify-between">
          <div className="text-[13px] font-semibold text-gray-700">
            {type === 'drop' ? 'Recent Drop Locations' : 'Recent Pickup Locations'}
          </div>
          <button type="button" className="text-[12px] font-medium text-blue-500">
            Clear All
          </button>
        </div>

        <div className="mt-3 divide-y divide-gray-200 border-t border-b border-gray-200">
          {RECENT_SEARCHES.map((item) => (
            <button
              key={item.id}
              type="button"
              className="flex w-full items-start gap-3 px-1 py-3 text-left"
              onClick={() => handleSelectLocation(item)}
            >
              <span className="mt-1">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l2.5 2.5" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4a8 8 0 100 16 8 8 0 000-16z" />
                </svg>
              </span>
              <span>
                <div className="text-[14px] font-semibold text-gray-900">{item.name}</div>
                <div className="mt-1 text-[12px] text-gray-500">{item.address}</div>
                <div className="mt-1 text-[11px] text-gray-400">{item.contact}</div>
              </span>
            </button>
          ))}
        </div>

        {/* Pickup / Drop dots toggle */}
        <div className="mt-5 flex justify-center gap-2">
          <button
            type="button"
            aria-label="Pickup location"
            onClick={() => {
              if (type !== 'pickup') {
                const params = new URLSearchParams({ type: 'pickup' });
                if (returnTo) params.set('returnTo', returnTo);
                router.replace(`${ROUTES.PICKUP_LOCATION_EDIT}?${params.toString()}`);
              }
            }}
            className={`h-2.5 w-2.5 rounded-full transition-colors ${
              type === 'pickup' ? 'bg-[var(--color-primary)]' : 'bg-gray-300'
            }`}
          />
          <button
            type="button"
            aria-label="Drop location"
            onClick={() => {
              if (type !== 'drop') {
                const params = new URLSearchParams({ type: 'drop' });
                if (returnTo) params.set('returnTo', returnTo);
                router.replace(`${ROUTES.PICKUP_LOCATION_EDIT}?${params.toString()}`);
              }
            }}
            className={`h-2.5 w-2.5 rounded-full transition-colors ${
              type === 'drop' ? 'bg-[var(--color-primary)]' : 'bg-gray-300'
            }`}
          />
        </div>
      </div>
    </div>
  );
}

export default function EditPickupLocationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center p-4">Loading...</div>}>
      <EditPickupLocationContent />
    </Suspense>
  );
}

