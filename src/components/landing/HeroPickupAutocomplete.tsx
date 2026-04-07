'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { loadGoogleMapsPlaces } from '@/lib/googleMapsLoader';
import { GOOGLE_MAP_KEY } from '@/config/env';
import { trackEvent } from '@/lib/posthogAnalytics';

const MAX_SUGGESTIONS = 5;
const MIN_CHARS = 2;
const DEBOUNCE_MS = 300;

type Prediction = google.maps.places.AutocompletePrediction;

interface HeroPickupAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onPickSuggestion?: (description: string) => void;
  disabled?: boolean;
  /** First user focus/click on this field captures `posthog` `booking_started` once. */
  bookingSource?: 'homepage' | 'landing';
}

/**
 * Landing hero pickup field with Google Places Autocomplete (up to 5 suggestions).
 * Falls back to a plain input when NEXT_PUBLIC_GOOGLE_MAP_KEY is unset or load fails.
 */
export default function HeroPickupAutocomplete({
  value,
  onChange,
  onPickSuggestion,
  disabled = false,
  bookingSource,
}: HeroPickupAutocompleteProps) {
  const apiKey = GOOGLE_MAP_KEY.trim();
  const listId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [mapsReady, setMapsReady] = useState(false);
  /** No key, script failed, or Places unavailable — plain text input only. */
  const [placesUnavailable, setPlacesUnavailable] = useState(() => !GOOGLE_MAP_KEY.trim());
  const serviceRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const seqRef = useRef(0);
  const mapsLoadStartedRef = useRef(false);
  const bookingStartedFiredRef = useRef(false);

  /** Defer Maps until interaction so first paint / LCP is not competing with ~100KB+ Places JS. */
  const ensureMapsLoaded = useCallback(() => {
    if (!apiKey || mapsLoadStartedRef.current) return;
    mapsLoadStartedRef.current = true;
    loadGoogleMapsPlaces(apiKey)
      .then(() => {
        if (!window.google?.maps?.places) return;
        serviceRef.current = new google.maps.places.AutocompleteService();
        setMapsReady(true);
        setPlacesUnavailable(false);
      })
      .catch(() => setPlacesUnavailable(true));
  }, [apiKey]);

  const fetchPredictions = useCallback(
    (input: string) => {
      const trimmed = input.trim();
      if (!mapsReady || !serviceRef.current || trimmed.length < MIN_CHARS) {
        setSuggestions([]);
        setLoading(false);
        return;
      }

      const seq = ++seqRef.current;
      setLoading(true);

      serviceRef.current.getPlacePredictions(
        {
          input: trimmed,
          types: ['geocode', 'establishment'],
          componentRestrictions: { country: 'in' },
        },
        (predictions, status) => {
          if (seq !== seqRef.current) return;
          setLoading(false);
          if (status !== google.maps.places.PlacesServiceStatus.OK || !predictions?.length) {
            setSuggestions([]);
            return;
          }
          setSuggestions(predictions.slice(0, MAX_SUGGESTIONS));
        }
      );
    },
    [mapsReady]
  );

  useEffect(() => {
    if (!open || placesUnavailable) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchPredictions(value);
    }, DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value, open, fetchPredictions, placesUnavailable]);

  useEffect(() => {
    const onDocMouseDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocMouseDown);
    return () => document.removeEventListener('mousedown', onDocMouseDown);
  }, []);

  const handleSelect = (p: Prediction) => {
    const text = p.description;
    onChange(text);
    onPickSuggestion?.(text);
    setSuggestions([]);
    setOpen(false);
    inputRef.current?.blur();
  };

  const showList = open && !placesUnavailable && mapsReady && (suggestions.length > 0 || loading);

  return (
    <div ref={wrapRef} className="relative min-w-0 flex-1">
      <input
        ref={inputRef}
        type="text"
        role="combobox"
        aria-expanded={showList}
        aria-controls={showList ? listId : undefined}
        aria-autocomplete="list"
        aria-haspopup="listbox"
        placeholder="Enter Pickup Location"
        value={value}
        disabled={disabled}
        onChange={(e) => {
          const v = e.target.value;
          onChange(v);
          setOpen(true);
        }}
        onFocus={(e) => {
          if (
            bookingSource &&
            !bookingStartedFiredRef.current &&
            e.nativeEvent.isTrusted
          ) {
            bookingStartedFiredRef.current = true;
            trackEvent('booking_started', { source: bookingSource });
          }
          setOpen(true);
          ensureMapsLoaded();
        }}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            setOpen(false);
            setSuggestions([]);
          }
        }}
        className="w-full min-w-0 bg-transparent pl-4 text-base text-gray-900 outline-none placeholder:text-gray-400"
        aria-label="Pickup location"
        autoComplete="off"
      />

      {showList && (
        <ul
          id={listId}
          role="listbox"
          className="scrollbar-hide absolute left-0 right-0 top-full z-[60] mt-1 max-h-60 overflow-auto rounded-xl border border-gray-200 bg-white py-1 shadow-lg"
        >
          {loading && suggestions.length === 0 && (
            <li className="px-3 py-2 text-sm text-gray-500">Searching…</li>
          )}
          {suggestions.map((p) => (
            <li key={p.place_id} role="presentation">
              <button
                type="button"
                role="option"
                className="flex w-full flex-col gap-0.5 px-3 py-2.5 text-left text-sm hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(p)}
              >
                <span className="font-medium text-gray-900">{p.structured_formatting.main_text}</span>
                {p.structured_formatting.secondary_text ? (
                  <span className="text-xs text-gray-500">{p.structured_formatting.secondary_text}</span>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
