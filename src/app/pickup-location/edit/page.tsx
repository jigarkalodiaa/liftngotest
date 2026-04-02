'use client';

import { Suspense, useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useGeolocation } from '@/hooks';
import { RECENT_SEARCHES } from '@/data/mockLocations';
import {
  setPickupLocation,
  setDropLocation,
  setSenderDetails,
  setReceiverDetails,
  getPickupLocation,
  getDropLocation,
  savedLocationHasAddress,
} from '@/lib/storage';
import { ROUTES } from '@/lib/constants';
import type { SavedLocation } from '@/types/booking';
import PickupAuthGuard from '@/components/auth/PickupAuthGuard';
import { geocodeAddress } from '@/utils/geocode';

type RecentItem = SavedLocation & { id: string };

function EditPickupLocationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get('type') === 'drop' ? 'drop' : 'pickup';
  const rawReturnTo = searchParams.get('returnTo');
  const returnTo = rawReturnTo && rawReturnTo.startsWith('/') && !rawReturnTo.startsWith('//') ? rawReturnTo : null;
  const emptyDraft = searchParams.get('empty') === '1';
  const { isLoading, error, getLocation } = useGeolocation();
  const [searchValue, setSearchValue] = useState('');
  const [recentItems, setRecentItems] = useState<RecentItem[]>(() => [...RECENT_SEARCHES]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (emptyDraft) {
      setSearchValue('');
      return;
    }
    if (type === 'drop') {
      const d = getDropLocation();
      setSearchValue(savedLocationHasAddress(d) ? d.address : '');
    } else {
      const p = getPickupLocation();
      setSearchValue(savedLocationHasAddress(p) ? p.address : '');
    }
  }, [type, emptyDraft]);

  useEffect(() => {
    const id = window.setTimeout(() => searchInputRef.current?.focus(), 60);
    return () => clearTimeout(id);
  }, [type]);

  const typedAddressOk = searchValue.trim().length >= 5;

  const goAfterSave = () => {
    if (returnTo) router.push(returnTo);
    else router.back();
  };

  const [isSaving, setIsSaving] = useState(false);

  const handleConfirmTypedAddress = async () => {
    if (!typedAddressOk || isSaving) return;
    setIsSaving(true);
    try {
      const addr = searchValue.trim();
      const name =
        addr.split(/[,\n]/)[0]?.trim().slice(0, 80) ||
        (type === 'drop' ? 'Drop location' : 'Pickup location');
      const coords = await geocodeAddress(addr);
      const loc: SavedLocation = { name, address: addr, contact: '', ...coords };
      if (type === 'drop') setDropLocation(loc);
      else setPickupLocation(loc);
      goAfterSave();
    } finally {
      setIsSaving(false);
    }
  };

  const handleUseCurrentLocation = async () => {
    const result = await getLocation();
    if (result) {
      const locationData: SavedLocation = {
        name: 'Current Location',
        address: result.shortAddress,
        contact: '',
        latitude: result.latitude,
        longitude: result.longitude,
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

  const handleSelectLocation = async (item: RecentItem) => {
    const coords = await geocodeAddress(item.address);
    const loc: SavedLocation = { name: item.name, address: item.address, contact: item.contact, ...coords };
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

  const switchType = (next: 'pickup' | 'drop') => {
    if (type === next) return;
    const params = new URLSearchParams({ type: next });
    if (returnTo) params.set('returnTo', returnTo);
    if (emptyDraft) params.set('empty', '1');
    router.replace(`${ROUTES.PICKUP_LOCATION_EDIT}?${params.toString()}`);
  };

  const title = type === 'drop' ? 'Drop location' : 'Pickup location';
  const subtitle = 'Search, use GPS, or pick a recent place';

  return (
    <div className="relative flex min-h-dvh flex-col overflow-x-hidden bg-gradient-to-b from-[var(--color-primary)]/[0.06] via-white to-white">
      <div className="mx-auto flex w-full max-w-[520px] flex-1 flex-col px-4 pb-[calc(6.5rem+env(safe-area-inset-bottom,0px))] pt-[max(0.75rem,env(safe-area-inset-top,0px))] sm:px-5 sm:pb-[calc(7rem+env(safe-area-inset-bottom,0px))]">
        <header className="shrink-0 pb-4 pt-2 sm:pt-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => (returnTo ? router.push(returnTo) : router.back())}
              aria-label="Back"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-gray-200/80 bg-white/80 shadow-sm backdrop-blur-sm"
            >
              <svg className="h-5 w-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="min-w-0 flex-1 text-center pe-10 sm:pe-11">
              <h1 className="text-[18px] font-semibold leading-tight text-gray-900 sm:text-[20px]">{title}</h1>
              <p className="mt-0.5 text-[12px] text-gray-500">{subtitle}</p>
            </div>
          </div>
        </header>

        <div className="rounded-2xl border border-white/80 bg-white/50 p-4 shadow-[0_8px_32px_rgba(15,23,42,0.08)] backdrop-blur-md sm:p-5">
          <label htmlFor="location-search" className="mb-1.5 block text-[12px] font-medium text-gray-600">
            {type === 'drop' ? 'Drop address' : 'Pickup address'}
          </label>
          <div className="flex min-h-[52px] items-center gap-3 rounded-xl border border-gray-200 bg-white/90 px-3 shadow-[0_2px_12px_rgba(15,23,42,0.04)] focus-within:ring-2 focus-within:ring-[var(--color-primary)]/20">
            <span className="shrink-0 text-[var(--color-primary)]" aria-hidden>
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
              </svg>
            </span>
            <input
              id="location-search"
              ref={searchInputRef}
              type="search"
              enterKeyHint="search"
              autoComplete="street-address"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && typedAddressOk) {
                  e.preventDefault();
                  void handleConfirmTypedAddress();
                }
              }}
              placeholder={type === 'drop' ? 'Enter drop location' : 'Enter pickup location'}
              className="min-h-[48px] w-full flex-1 bg-transparent py-2 text-[15px] text-gray-900 placeholder:text-gray-400 outline-none sm:text-[14px]"
            />
          </div>
          {!typedAddressOk && searchValue.length > 0 ? (
            <p className="mt-1.5 text-[11px] text-gray-400">At least 5 characters to confirm</p>
          ) : null}
        </div>

        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={isLoading}
          className="mt-4 flex w-full min-h-[56px] items-center justify-between gap-3 rounded-2xl border border-[var(--color-primary)]/15 bg-gradient-to-br from-[var(--color-primary)]/10 via-[var(--landing-orange)]/8 to-white/90 px-4 text-left shadow-[0_4px_20px_rgba(15,23,42,0.06)] ring-1 ring-black/[0.04] backdrop-blur-sm transition hover:border-[var(--color-primary)]/25 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/90 text-[var(--color-primary)] shadow-sm">
              {isLoading ? (
                <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden>
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </div>
            <div className="min-w-0">
              <div className="text-[14px] font-semibold text-gray-900">
                {isLoading ? 'Getting your location…' : 'Use my current location'}
              </div>
              <div className="mt-0.5 text-[11px] text-gray-500">Fastest when you’re on-site</div>
            </div>
          </div>
          <svg className="h-5 w-5 shrink-0 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {error ? (
          <p className="mt-3 rounded-xl border border-red-200 bg-red-50/90 px-3 py-2 text-[13px] text-red-600" role="alert">
            {error}
          </p>
        ) : null}

        <div className="mt-6 flex min-h-[40px] items-center justify-between gap-3">
          <h2 className="text-[13px] font-semibold text-gray-800">
            {type === 'drop' ? 'Recent drop places' : 'Recent pickup places'}
          </h2>
          {recentItems.length > 0 ? (
            <button
              type="button"
              onClick={() => setRecentItems([])}
              className="min-h-[36px] shrink-0 rounded-lg px-2 text-[12px] font-semibold text-[var(--color-primary)]"
            >
              Clear all
            </button>
          ) : null}
        </div>

        {recentItems.length === 0 ? (
          <p className="mt-2 rounded-xl border border-dashed border-gray-200/90 bg-white/40 px-4 py-6 text-center text-[13px] text-gray-500 backdrop-blur-sm">
            No saved places yet — type an address or use GPS above.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {recentItems.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className="flex w-full min-h-[56px] items-start gap-3 rounded-xl border border-white/80 bg-white/50 px-3 py-3 text-left shadow-[0_2px_16px_rgba(15,23,42,0.05)] backdrop-blur-sm transition hover:border-[var(--color-primary)]/20 hover:shadow-[0_6px_24px_rgba(15,23,42,0.08)]"
                  onClick={() => handleSelectLocation(item)}
                >
                  <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[14px] font-semibold text-gray-900">{item.name}</span>
                    <span className="mt-0.5 block text-[12px] leading-snug text-gray-500">{item.address}</span>
                    {item.contact ? (
                      <span className="mt-1 block text-[11px] text-gray-400">{item.contact}</span>
                    ) : null}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-8 flex flex-col items-center gap-2 pb-2">
          <span className="text-[11px] font-medium uppercase tracking-wide text-gray-400">Editing</span>
          <div className="flex items-center gap-6">
            <button
              type="button"
              aria-pressed={type === 'pickup'}
              aria-label="Edit pickup location"
              onClick={() => switchType('pickup')}
              className="flex flex-col items-center gap-1.5 rounded-xl p-1 outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/30"
            >
              <span
                className={`h-3 w-3 rounded-full transition-transform ${
                  type === 'pickup' ? 'scale-125 bg-[var(--color-primary)]' : 'bg-gray-300'
                }`}
              />
              <span className={`text-[11px] font-medium ${type === 'pickup' ? 'text-[var(--color-primary)]' : 'text-gray-400'}`}>
                Pickup
              </span>
            </button>
            <button
              type="button"
              aria-pressed={type === 'drop'}
              aria-label="Edit drop location"
              onClick={() => switchType('drop')}
              className="flex flex-col items-center gap-1.5 rounded-xl p-1 outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/30"
            >
              <span
                className={`h-3 w-3 rounded-full transition-transform ${
                  type === 'drop' ? 'scale-125 bg-[var(--color-primary)]' : 'bg-gray-300'
                }`}
              />
              <span className={`text-[11px] font-medium ${type === 'drop' ? 'text-[var(--color-primary)]' : 'text-gray-400'}`}>
                Drop
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-white/60 bg-white/85 shadow-[0_-8px_32px_rgba(15,23,42,0.08)] backdrop-blur-md supports-[backdrop-filter]:bg-white/70">
        <div className="mx-auto w-full max-w-[520px] px-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] pt-3 sm:px-5">
          <button
            type="button"
            disabled={!typedAddressOk || isSaving}
            onClick={() => { void handleConfirmTypedAddress(); }}
            className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 text-[16px] font-semibold text-white shadow-[0_4px_16px_rgba(15,23,42,0.12)] disabled:cursor-not-allowed disabled:opacity-45"
          >
            {isSaving ? 'Locating…' : type === 'drop' ? 'Use this drop address' : 'Use this pickup address'}
          </button>
        </div>
      </div>
    </div>
  );
}

function EditLocationLoading() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-gradient-to-b from-[var(--color-primary)]/[0.06] via-white to-white p-6">
      <div className="h-10 w-10 animate-pulse rounded-2xl border border-white/80 bg-white/60 shadow-lg backdrop-blur-md" />
    </div>
  );
}

export default function EditPickupLocationPage() {
  return (
    <Suspense fallback={<EditLocationLoading />}>
      <PickupAuthGuard>
        <EditPickupLocationContent />
      </PickupAuthGuard>
    </Suspense>
  );
}
