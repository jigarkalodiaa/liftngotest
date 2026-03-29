'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useGeolocation } from '@/hooks';
import type { BookingStopWaypoint, SavedLocation } from '@/types/booking';
import { RECENT_SEARCHES } from '@/data/mockLocations';
import {
  getPickupLocation,
  getDropLocation,
  getStopWaypoints,
  getStoredPhone,
  setStopWaypoints,
  makeBookingStopId,
} from '@/lib/storage';
import { MOBILE_LENGTH, ROUTES } from '@/lib/constants';
import { validatePersonName } from '@/lib/validations';

type RecentItem = SavedLocation & { id: string };

function addressMinOk(value: string): boolean {
  return value.trim().length >= 5;
}

function buildStopSavedLocation(addressRaw: string, landmarkRaw: string): SavedLocation {
  const address = addressRaw.trim();
  const landmark = landmarkRaw.trim();
  const firstLine = address.split(/[,\n]/)[0]?.trim().slice(0, 80) || '';
  const name = landmark || firstLine || 'Stop';
  return { name, address, contact: '' };
}

function inferLandmarkForEdit(loc: SavedLocation): { address: string; landmark: string } {
  const address = loc.address;
  const firstLine = address.split(/[,\n]/)[0]?.trim().slice(0, 80) || '';
  const landmark = loc.name && loc.name !== firstLine && loc.name !== 'Stop' ? loc.name : '';
  return { address, landmark };
}

export default function AddStopPage() {
  const router = useRouter();
  const addressRef = useRef<HTMLTextAreaElement>(null);
  const landmarkRef = useRef<HTMLInputElement>(null);

  const [pickup, setPickup] = useState<SavedLocation | null>(null);
  const [drop, setDrop] = useState<SavedLocation | null>(null);
  const [stops, setStops] = useState<BookingStopWaypoint[]>([]);
  const [recentItems, setRecentItems] = useState<RecentItem[]>(() => [...RECENT_SEARCHES]);

  const [draftAddress, setDraftAddress] = useState('');
  const [draftLandmark, setDraftLandmark] = useState('');
  const [personName, setPersonName] = useState('');
  const [personMobile, setPersonMobile] = useState('');
  const [useCurrentMobile, setUseCurrentMobile] = useState(false);
  const [currentMobile, setCurrentMobile] = useState('');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [addressError, setAddressError] = useState('');
  const [nameError, setNameError] = useState('');
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const { isLoading: isGeoLoading, error: geoError, getLocation } = useGeolocation();

  const persist = useCallback((next: BookingStopWaypoint[]) => {
    setStops(next);
    setStopWaypoints(next);
  }, []);

  useEffect(() => {
    const p = getPickupLocation();
    const d = getDropLocation();
    if (p) setPickup(p);
    if (d) setDrop(d);
    setStops(getStopWaypoints());
    const storedPhone = getStoredPhone();
    setCurrentMobile(storedPhone);
    const id = window.setTimeout(() => addressRef.current?.focus(), 80);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (useCurrentMobile) {
      setPersonMobile(currentMobile.replace(/\D/g, '').slice(0, MOBILE_LENGTH));
    }
  }, [useCurrentMobile, currentMobile]);

  const isMobileValid = useMemo(() => {
    return personMobile.replace(/\D/g, '').length === MOBILE_LENGTH;
  }, [personMobile]);

  const showPhoneError = useMemo(
    () => (submitAttempted || personMobile.length > 0) && !isMobileValid,
    [submitAttempted, personMobile.length, isMobileValid]
  );

  const resetDraft = useCallback(() => {
    setDraftAddress('');
    setDraftLandmark('');
    setPersonName('');
    setPersonMobile('');
    setUseCurrentMobile(false);
    setEditingId(null);
    setAddressError('');
    setNameError('');
    setSubmitAttempted(false);
    window.setTimeout(() => addressRef.current?.focus(), 60);
  }, []);

  const validateDraft = useCallback(() => {
    let ok = true;
    if (!addressMinOk(draftAddress)) {
      setAddressError('Enter a full stop address (at least 5 characters).');
      ok = false;
    } else {
      setAddressError('');
    }
    const nameResult = validatePersonName(personName.trim());
    if (!nameResult.success) {
      setNameError(nameResult.error);
      ok = false;
    } else {
      setNameError('');
    }
    if (!isMobileValid) ok = false;
    return ok;
  }, [draftAddress, personName, isMobileValid]);

  const handleAddOrUpdateStop = useCallback(() => {
    setSubmitAttempted(true);
    if (!validateDraft()) return;
    const nameResult = validatePersonName(personName.trim());
    if (!nameResult.success) return;
    const loc = buildStopSavedLocation(draftAddress, draftLandmark);
    const contact = { name: nameResult.data, mobile: personMobile.replace(/\D/g, '') };
    if (editingId) {
      const next = stops.map((s) => (s.id === editingId ? { ...s, location: loc, contact } : s));
      persist(next);
    } else {
      persist([...stops, { id: makeBookingStopId(), location: loc, contact }]);
    }
    resetDraft();
  }, [validateDraft, draftAddress, draftLandmark, personName, personMobile, editingId, stops, persist, resetDraft]);

  const handleEditStop = useCallback((wp: BookingStopWaypoint) => {
    setEditingId(wp.id);
    const { address, landmark } = inferLandmarkForEdit(wp.location);
    setDraftAddress(address);
    setDraftLandmark(landmark);
    setPersonName(wp.contact.name);
    setPersonMobile(wp.contact.mobile.replace(/\D/g, '').slice(0, MOBILE_LENGTH));
    setUseCurrentMobile(Boolean(currentMobile && wp.contact.mobile.replace(/\D/g, '') === currentMobile.replace(/\D/g, '')));
    setAddressError('');
    setNameError('');
    setSubmitAttempted(false);
    window.setTimeout(() => addressRef.current?.focus(), 60);
  }, [currentMobile]);

  const handleRemoveStop = useCallback(
    (id: string) => {
      if (editingId === id) resetDraft();
      setRemovingId(id);
      window.setTimeout(() => {
        setStops((prev) => {
          const next = prev.filter((s) => s.id !== id);
          setStopWaypoints(next);
          return next;
        });
        setRemovingId(null);
      }, 160);
    },
    [editingId, resetDraft]
  );

  const handleUseCurrentLocation = async () => {
    const result = await getLocation();
    if (!result) return;
    setDraftAddress(result.shortAddress);
    setDraftLandmark('');
    setAddressError('');
    addressRef.current?.focus();
  };

  const handleRecentPick = (item: RecentItem) => {
    setDraftAddress(item.address);
    const fl = item.address.split(/[,\n]/)[0]?.trim() || '';
    setDraftLandmark(item.name && item.name !== fl ? item.name : '');
    if (item.contact) {
      const parts = item.contact.split('|').map((p) => p.trim());
      const mob = (parts[1] || '').replace(/\D/g, '').slice(0, MOBILE_LENGTH);
      setPersonName(parts[0] || '');
      setPersonMobile(mob);
      if (currentMobile && mob === currentMobile.replace(/\D/g, '').slice(0, MOBILE_LENGTH)) {
        setUseCurrentMobile(true);
      }
    }
    setAddressError('');
    addressRef.current?.focus();
  };

  return (
    <div className="relative flex min-h-dvh flex-col overflow-x-hidden bg-gradient-to-b from-[var(--color-primary)]/[0.06] via-white to-white">
      <div className="mx-auto flex w-full max-w-[520px] flex-1 flex-col px-4 pb-[calc(6.5rem+env(safe-area-inset-bottom,0px))] pt-[max(0.75rem,env(safe-area-inset-top,0px))] sm:px-5 sm:pb-[calc(7rem+env(safe-area-inset-bottom,0px))]">
        <header className="shrink-0 pb-4 pt-2 sm:pt-3">
          <button
            type="button"
            onClick={() => router.push(ROUTES.TRIP_OPTIONS)}
            className="mb-3 text-left text-[14px] font-semibold text-[var(--color-primary)] transition hover:opacity-90"
          >
            ← Back to Booking
          </button>
          <div className="text-center">
            <h1 className="text-[18px] font-semibold leading-tight text-gray-900 sm:text-[20px]">Add Stop</h1>
            <p className="mt-0.5 text-[12px] text-gray-500">Add an intermediate delivery location</p>
          </div>
        </header>

        {(pickup || drop) && (
          <div className="mb-4 rounded-xl border border-white/80 bg-white/45 px-3 py-3 text-[12px] text-gray-600 shadow-[0_4px_20px_rgba(15,23,42,0.06)] backdrop-blur-md">
            <div className="flex items-start gap-2">
              <span className="mt-0.5 shrink-0 text-[var(--color-primary)]" aria-hidden>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </span>
              <div className="min-w-0 flex-1 space-y-1.5">
                <div>
                  <span className="font-semibold text-gray-800">Pickup</span>
                  <span className="mt-0.5 block truncate text-gray-500">{pickup?.address ?? '—'}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-800">Drop</span>
                  <span className="mt-0.5 block truncate text-gray-500">{drop?.address ?? '—'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {stops.length > 0 && (
          <section className="mb-4" aria-label="Stops on this booking">
            <h2 className="mb-2 text-[13px] font-semibold text-gray-800">Stops on route</h2>
            <ul className="space-y-2">
              {stops.map((wp, index) => (
                <li
                  key={wp.id}
                  className={`rounded-2xl border border-white/80 bg-white/50 p-3 shadow-[0_6px_24px_rgba(15,23,42,0.07)] backdrop-blur-md transition-all duration-200 sm:p-4 ${
                    removingId === wp.id ? 'pointer-events-none scale-[0.98] opacity-40' : 'opacity-100'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex min-w-0 flex-1 gap-2">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </span>
                      <div className="min-w-0">
                        <div className="text-[14px] font-semibold text-gray-900">
                          Stop {index + 1}
                          <span className="mt-0.5 block truncate font-normal text-gray-600">{wp.location.address}</span>
                        </div>
                        {(wp.contact.name || wp.contact.mobile) && (
                          <div className="mt-1 text-[12px] text-gray-500">
                            {wp.contact.name}
                            {wp.contact.name && wp.contact.mobile ? ' · ' : ''}
                            {wp.contact.mobile}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <button
                        type="button"
                        onClick={() => handleEditStop(wp)}
                        className="min-h-[40px] min-w-[40px] rounded-xl px-2 text-[12px] font-semibold text-[var(--color-primary)]"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveStop(wp.id)}
                        aria-label={`Delete stop ${index + 1}`}
                        className="min-h-[40px] min-w-[40px] rounded-xl px-2 text-[12px] font-semibold text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        <button
          type="button"
          onClick={() => {
            resetDraft();
          }}
          className="mb-4 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--color-primary)]/35 bg-white/40 py-3 text-[14px] font-semibold text-[var(--color-primary)] shadow-[0_2px_12px_rgba(15,23,42,0.04)] backdrop-blur-sm transition hover:border-[var(--color-primary)]/50"
        >
          <span className="text-lg leading-none">+</span>
          Add another stop
        </button>

        <div className="rounded-2xl border border-white/80 bg-white/50 p-4 shadow-[0_8px_32px_rgba(15,23,42,0.08)] backdrop-blur-md sm:p-5">
          <h2 className="mb-3 text-[13px] font-semibold text-gray-800">{editingId ? 'Edit stop' : 'New stop'}</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="stop-address" className="mb-1.5 block text-[12px] font-medium text-gray-600">
                Stop address <span className="text-red-500">*</span>
              </label>
              <div
                className={`flex min-h-[56px] items-start gap-3 rounded-xl border bg-white/90 px-3 py-2.5 shadow-[0_2px_12px_rgba(15,23,42,0.04)] focus-within:ring-2 focus-within:ring-[var(--color-primary)]/20 ${
                  addressError ? 'border-red-300' : 'border-gray-200'
                }`}
              >
                <span className="mt-2 shrink-0 text-[var(--color-primary)]" aria-hidden>
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
                <textarea
                  id="stop-address"
                  ref={addressRef}
                  value={draftAddress}
                  onChange={(e) => {
                    setDraftAddress(e.target.value);
                    if (addressError) setAddressError('');
                  }}
                  onBlur={(e) => setDraftAddress(e.target.value.trim())}
                  rows={3}
                  placeholder="Enter stop location"
                  autoComplete="street-address"
                  className="w-full resize-none bg-transparent text-[15px] leading-snug text-gray-900 placeholder:text-gray-400 outline-none sm:text-[14px]"
                />
              </div>
              {addressError ? <p className="mt-1.5 text-[11px] text-red-500">{addressError}</p> : null}
            </div>

            <div>
              <label htmlFor="stop-landmark" className="mb-1.5 block text-[12px] font-medium text-gray-600">
                Landmark <span className="text-gray-400">(optional)</span>
              </label>
              <input
                id="stop-landmark"
                ref={landmarkRef}
                type="text"
                value={draftLandmark}
                onChange={(e) => setDraftLandmark(e.target.value)}
                onBlur={(e) => setDraftLandmark(e.target.value.trim())}
                placeholder="e.g. Near Metro Gate 2"
                className="h-12 w-full rounded-xl border border-gray-200 bg-white/90 px-3 text-[14px] text-gray-900 shadow-[0_2px_12px_rgba(15,23,42,0.04)] outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
              />
            </div>

            <div>
              <label htmlFor="stop-contact-name" className="mb-1.5 block text-[12px] font-medium text-gray-600">
                Contact name <span className="text-red-500">*</span>
              </label>
              <input
                id="stop-contact-name"
                type="text"
                value={personName}
                onChange={(e) => {
                  setPersonName(e.target.value);
                  if (nameError) setNameError('');
                }}
                onBlur={(e) => setPersonName(e.target.value.trim())}
                placeholder="Name at this stop"
                className={`h-12 w-full rounded-xl border bg-white/90 px-3 text-[14px] text-gray-900 shadow-[0_2px_12px_rgba(15,23,42,0.04)] outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 ${
                  nameError ? 'border-red-300' : 'border-gray-200'
                }`}
              />
              {nameError ? <p className="mt-1.5 text-[11px] text-red-500">{nameError}</p> : null}
            </div>

            <div>
              <label htmlFor="stop-phone" className="mb-1.5 block text-[12px] font-medium text-gray-600">
                Phone number <span className="text-red-500">*</span>
              </label>
              <input
                id="stop-phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                value={personMobile}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, '').slice(0, MOBILE_LENGTH);
                  setPersonMobile(digits);
                  if (digits !== currentMobile.replace(/\D/g, '').slice(0, MOBILE_LENGTH)) setUseCurrentMobile(false);
                }}
                placeholder="10-digit mobile"
                className={`h-12 w-full rounded-xl border bg-white/90 px-3 text-[14px] text-gray-900 shadow-[0_2px_12px_rgba(15,23,42,0.04)] outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 ${
                  showPhoneError ? 'border-red-300' : 'border-gray-200'
                }`}
              />
              {showPhoneError ? (
                <p className="mt-1.5 text-[11px] text-red-500">Enter a valid 10-digit mobile number.</p>
              ) : null}
            </div>

            <label className="flex min-h-[44px] cursor-pointer items-center gap-2 text-[12px] text-gray-600">
              <input
                type="checkbox"
                checked={useCurrentMobile}
                onChange={(e) => {
                  const c = e.target.checked;
                  setUseCurrentMobile(c);
                  if (!c) setPersonMobile('');
                }}
                className="h-4 w-4 rounded border-gray-300 text-[var(--color-primary)]"
              />
              <span>
                Use my current number:{' '}
                <span className="font-semibold text-gray-800">{currentMobile || '—'}</span>
              </span>
            </label>

            <button
              type="button"
              onClick={handleAddOrUpdateStop}
              className="h-12 w-full rounded-xl bg-[var(--color-primary)]/12 text-[14px] font-semibold text-[var(--color-primary)] ring-1 ring-[var(--color-primary)]/25 transition hover:bg-[var(--color-primary)]/18"
            >
              {editingId ? 'Update stop' : 'Add to route'}
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={isGeoLoading}
          className="mt-4 flex w-full min-h-[56px] items-center justify-between gap-3 rounded-2xl border border-[var(--color-primary)]/15 bg-gradient-to-br from-[var(--color-primary)]/10 via-[var(--landing-orange)]/8 to-white/90 px-4 text-left shadow-[0_4px_20px_rgba(15,23,42,0.06)] ring-1 ring-black/[0.04] backdrop-blur-sm transition hover:border-[var(--color-primary)]/25 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/90 text-[var(--color-primary)] shadow-sm">
              {isGeoLoading ? (
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
                {isGeoLoading ? 'Getting your location…' : 'Use my current location'}
              </div>
              <div className="mt-0.5 text-[11px] text-gray-500">Fills the stop address field</div>
            </div>
          </div>
          <svg className="h-5 w-5 shrink-0 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {geoError ? (
          <p className="mt-3 rounded-xl border border-red-200 bg-red-50/90 px-3 py-2 text-[13px] text-red-600" role="alert">
            {geoError}
          </p>
        ) : null}

        <div className="mt-6 flex min-h-[40px] items-center justify-between gap-3">
          <h2 className="text-[13px] font-semibold text-gray-800">Recent places</h2>
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
            No recent rows — use the form above or GPS.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {recentItems.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className="flex w-full min-h-[56px] items-start gap-3 rounded-xl border border-white/80 bg-white/50 px-3 py-3 text-left shadow-[0_2px_16px_rgba(15,23,42,0.05)] backdrop-blur-sm transition hover:border-[var(--color-primary)]/20 hover:shadow-[0_6px_24px_rgba(15,23,42,0.08)]"
                  onClick={() => handleRecentPick(item)}
                >
                  <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </span>
                  <span className="min-w-0 flex-1 text-left">
                    <span className="block text-[14px] font-semibold text-gray-900">{item.name}</span>
                    <span className="mt-0.5 block text-[12px] leading-snug text-gray-500">{item.address}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-white/60 bg-white/85 shadow-[0_-8px_32px_rgba(15,23,42,0.08)] backdrop-blur-md supports-[backdrop-filter]:bg-white/70">
        <div className="mx-auto w-full max-w-[520px] px-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] pt-3 sm:px-5">
          <button
            type="button"
            disabled={stops.length === 0}
            onClick={() => {
              setStopWaypoints(stops);
              router.push(ROUTES.TRIP_OPTIONS);
            }}
            className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 text-[16px] font-semibold text-white shadow-[0_4px_16px_rgba(15,23,42,0.12)] disabled:cursor-not-allowed disabled:opacity-45"
          >
            Save stop
          </button>
        </div>
      </div>
    </div>
  );
}
