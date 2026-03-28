'use client';

import { useEffect, useRef } from 'react';
import { useDashboardLocation } from '@/features/location';
import { theme } from '@/config/theme';

/**
 * Bottom-sheet style prompt for dashboard geolocation (non-intrusive on mobile).
 */
export default function LocationModal() {
  const {
    showLocationModal,
    isLocating,
    locationError,
    requestBrowserLocation,
    skipLocationPrompt,
    setZoneManual,
    clearLocationError,
  } = useDashboardLocation();

  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showLocationModal) return;
    const el = panelRef.current;
    if (!el) return;
    const first = el.querySelector<HTMLElement>('button:not([disabled])');
    first?.focus();
  }, [showLocationModal]);

  if (!showLocationModal) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col justify-end sm:items-center sm:justify-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="location-modal-title"
      aria-describedby="location-modal-desc"
    >
      <div className="absolute inset-0 bg-black/45 sm:bg-black/40" aria-hidden />
      <div
        ref={panelRef}
        className="relative w-full max-w-lg rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl sm:max-h-[90vh] overflow-hidden flex flex-col"
      >
        <div className="flex-shrink-0 px-5 pt-5 pb-3 border-b border-gray-100">
          <h2 id="location-modal-title" className="text-lg font-bold text-gray-900">
            Enable Location
          </h2>
          <p id="location-modal-desc" className="mt-2 text-sm text-gray-600 leading-relaxed">
            We need your location to show relevant services and pricing for your area.
          </p>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4 space-y-4">
          {locationError && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
              {locationError}
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    clearLocationError();
                    requestBrowserLocation();
                  }}
                  className="text-xs font-semibold text-amber-900 underline"
                >
                  Retry
                </button>
                <button type="button" onClick={clearLocationError} className="text-xs text-amber-800/80">
                  Dismiss message
                </button>
              </div>
            </div>
          )}

          {isLocating && (
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span
                className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-[var(--color-primary)]"
                aria-hidden
              />
              Finding your area…
            </div>
          )}

          <div className="flex flex-col gap-2">
            <button
              type="button"
              disabled={isLocating}
              onClick={requestBrowserLocation}
              className="flex min-h-[48px] w-full items-center justify-center rounded-xl px-4 text-base font-semibold text-white disabled:opacity-60"
              style={{ backgroundColor: theme.colors.primary }}
            >
              अनुमति दें — Allow location
            </button>
            <button
              type="button"
              disabled={isLocating}
              onClick={() => skipLocationPrompt()}
              className="min-h-[44px] w-full rounded-xl border border-gray-200 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
            >
              Skip for now
            </button>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Manual area</p>
            <p className="mt-1 text-xs text-gray-500">Near Khatu, Ringas, or Reengus? Pick below if GPS is off.</p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                disabled={isLocating}
                onClick={() => setZoneManual('khatu')}
                className="min-h-[44px] flex-1 rounded-xl border border-[var(--color-primary)]/40 bg-[var(--color-primary)]/5 px-3 text-sm font-semibold text-[var(--color-primary)] disabled:opacity-60"
              >
                Khatu / Ringas nearby
              </button>
              <button
                type="button"
                disabled={isLocating}
                onClick={() => setZoneManual('default')}
                className="min-h-[44px] flex-1 rounded-xl border border-gray-200 px-3 text-sm font-medium text-gray-800 disabled:opacity-60"
              >
                I&apos;m elsewhere
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
