'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useGeolocation } from '@/hooks';
import type { SavedLocation } from '@/types/booking';
import { RECENT_SEARCHES } from '@/data/mockLocations';
import {
  getPickupLocation,
  getDropLocation,
  getStopLocation,
  getStopDetails,
  getStoredPhone,
  setStopLocation,
  setStopDetails,
} from '@/lib/storage';
import { MOBILE_LENGTH, ROUTES } from '@/lib/constants';
import { validatePersonName } from '@/lib/validations';

export default function AddStopPage() {
  const router = useRouter();
  const [pickup, setPickup] = useState<SavedLocation | null>(null);
  const [drop, setDrop] = useState<SavedLocation | null>(null);
  const [stop, setStop] = useState<SavedLocation | null>(null);
  const [personName, setPersonName] = useState('');
  const [personMobile, setPersonMobile] = useState('');
  const [nameError, setNameError] = useState('');
  const [useCurrentMobile, setUseCurrentMobile] = useState(false);
  const [currentMobile, setCurrentMobile] = useState('');
  const { isLoading: isGeoLoading, error: geoError, getLocation } = useGeolocation();

  const handleUseCurrentLocation = async () => {
    const result = await getLocation();
    if (result) {
      const locationData: SavedLocation = {
        name: 'Current Location',
        address: result.shortAddress,
        contact: '',
      };
      setStop(locationData);
      setStopLocation(locationData);
    }
  };

  useEffect(() => {
    const storedPhone = getStoredPhone();
    setCurrentMobile(storedPhone);
    const p = getPickupLocation();
    if (p) setPickup(p);
    const d = getDropLocation();
    if (d) setDrop(d);
    const s = getStopLocation();
    if (s) setStop(s);
    const details = getStopDetails();
    if (details?.name) setPersonName(details.name);
    if (details?.mobile) {
      setPersonMobile(details.mobile);
      if (storedPhone && details.mobile === storedPhone) setUseCurrentMobile(true);
    }
  }, []);

  const handleSelectStop = (loc: SavedLocation) => {
    setStop(loc);
    setStopLocation(loc);
    if (loc.contact) {
      const parts = loc.contact.split('|').map((p) => p.trim());
      const name = parts[0] || '';
      const mobile = parts[1] || '';
      setPersonName(name);
      setPersonMobile(mobile);
      setStopDetails({ name, mobile });
      if (currentMobile && mobile === currentMobile) setUseCurrentMobile(true);
    }
  };

  useEffect(() => {
    if (useCurrentMobile) {
      setPersonMobile(currentMobile);
    }
  }, [useCurrentMobile]);

  const isMobileValid = useMemo(() => {
    const digits = personMobile.replace(/\D/g, '').trim();
    return digits.length === MOBILE_LENGTH;
  }, [personMobile]);

  const trimmedName = personName.trim();
  const isFormValid = useMemo(
    () => Boolean(stop && trimmedName && validatePersonName(trimmedName).success && isMobileValid),
    [stop, trimmedName, isMobileValid]
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-[520px] px-4 pb-6 pt-6">
        {/* Header */}
        <header className="pt-2 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push(ROUTES.TRIP_OPTIONS)}
              aria-label="Back to trip options"
              className="h-9 w-9 rounded-full border border-gray-200 bg-white grid place-items-center"
            >
              <svg className="h-5 w-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="text-[18px] font-semibold text-gray-900">Add Stop</div>
          </div>
        </header>

        {/* Stops list */}
        <div className="rounded-3xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="px-4 pt-4 pb-3 space-y-3">
            {/* Pickup row */}
            <div className="flex items-center gap-2">
              <div className="flex-1 rounded-xl border border-gray-300 bg-[#F5F7FF] px-3 py-2.5 text-[14px] text-gray-900">
                {pickup?.name || 'Pickup'}
              </div>
              <div className="h-7 w-7 rounded-full bg-gray-100 border border-gray-300 grid place-items-center text-gray-400 text-xs">
                ||
              </div>
            </div>

            {/* Add stop row */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="flex-1 rounded-xl border border-dashed border-gray-400 bg-white px-3 py-2.5 text-left text-[14px] text-gray-400"
              >
                {stop?.name || 'Add a Stop'}
              </button>
              {stop && (
                <button
                  type="button"
                  aria-label="Remove stop"
                  onClick={() => setStop(null)}
                  className="h-7 w-7 rounded-full border border-gray-300 grid place-items-center text-gray-500 text-sm"
                >
                  ×
                </button>
              )}
            </div>

            {/* Drop row */}
            <div className="flex items-center gap-2">
              <div className="flex-1 rounded-xl border border-gray-300 bg-[#F5F7FF] px-3 py-2.5 text-[14px] text-gray-900">
                {drop?.name || 'Drop'}
              </div>
              <button
                type="button"
                aria-label="Remove drop"
                className="h-7 w-7 rounded-full border border-gray-300 grid place-items-center text-gray-500 text-sm"
              >
                ×
              </button>
            </div>
          </div>
        </div>

        {/* Stop contact details */}
        <div className="mt-5 space-y-4">
          <div>
            <label className="mb-1 block text-[12px] font-medium text-gray-600">Stop person name</label>
            <input
              type="text"
              placeholder="Name at stop (min. 3 letters)"
              value={personName}
              onChange={(e) => {
                setPersonName(e.target.value);
                if (nameError) setNameError('');
              }}
              onBlur={(e) => setPersonName(e.target.value.trim())}
              className={`w-full h-14 rounded-xl border bg-white px-3 text-[14px] text-gray-900 placeholder:text-gray-400 outline-none ${
                nameError ? 'border-red-400' : 'border-gray-300'
              }`}
            />
            {nameError && <p className="mt-1 text-[11px] text-red-500">{nameError}</p>}
          </div>

          <div>
            <label className="mb-1 block text-[12px] font-medium text-gray-600">Stop Mobile Number</label>
            <input
              type="tel"
              placeholder="Mobile number at stop"
              value={personMobile}
              onChange={(e) => {
                const digits = e.target.value.trim().replace(/\D/g, '').slice(0, 10);
                setPersonMobile(digits);
                if (digits !== currentMobile) setUseCurrentMobile(false);
              }}
              className={`w-full h-14 rounded-xl border bg-white px-3 text-[14px] text-gray-900 placeholder:text-gray-400 outline-none ${
                personMobile && !isMobileValid ? 'border-red-400' : 'border-gray-300'
              }`}
            />
            {personMobile && !isMobileValid && (
              <p className="mt-1 text-[11px] text-red-500">Enter a valid 10-digit mobile number.</p>
            )}
          </div>

          <label className="mt-1 flex items-center gap-2 text-[12px] text-gray-600">
            <input
              type="checkbox"
              checked={useCurrentMobile}
              onChange={(e) => {
                const checked = e.target.checked;
                setUseCurrentMobile(checked);
                if (!checked) setPersonMobile('');
              }}
              className="h-4 w-4 rounded border-gray-300 text-[var(--color-primary)]"
            />
            <span>
              Use My current Mobile number : <span className="font-semibold text-gray-800">{currentMobile}</span>
            </span>
          </label>
        </div>

        {/* Recent search */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-[13px] font-semibold text-gray-700">Recent Search</div>
          <button type="button" className="text-[12px] font-medium text-[var(--color-primary)]">
            Clear All
          </button>
        </div>

        <div className="mt-3 divide-y divide-gray-200 border-t border-b border-gray-200">
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={isGeoLoading}
            className="flex w-full items-center justify-between px-1 py-3 text-left disabled:opacity-50"
          >
            <div className="flex items-center gap-2">
              {isGeoLoading ? (
                <svg className="h-4 w-4 animate-spin text-orange-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <svg className="h-4 w-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
              <span className="text-[13px] text-gray-800">
                {isGeoLoading ? 'Getting location...' : 'Use my current location'}
              </span>
            </div>
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          {geoError && <p className="px-1 py-2 text-sm text-red-500">{geoError}</p>}

          {RECENT_SEARCHES.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelectStop({ name: item.name, address: item.address, contact: item.contact })}
              className="flex w-full items-start gap-3 px-1 py-3 text-left"
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

        {/* Bottom confirm button */}
        <div className="mt-5">
          <button
            type="button"
            disabled={!isFormValid}
            onClick={() => {
              if (!isFormValid) return;
              const nameResult = validatePersonName(personName.trim());
              if (!nameResult.success) {
                setNameError(nameResult.error);
                return;
              }
              setNameError('');
              setStopDetails({ name: nameResult.data, mobile: personMobile });
              router.push(ROUTES.TRIP_OPTIONS);
            }}
            className="w-full rounded-2xl bg-[var(--color-primary)] py-3.5 text-[15px] font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm stop details
          </button>
        </div>
      </div>
    </div>
  );
}

