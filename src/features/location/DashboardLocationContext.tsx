'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { DashboardZone } from '@/config/khatuZone';
import { SESSION_KEYS } from '@/lib/constants';
import {
  getUserLocation,
  saveUserLocation,
  type StoredUserLocation,
} from '@/lib/utils/locationStorage';
import { fetchLocationDetails } from '@/features/location/locationService';
import { getDashboardZoneUi, type DashboardZoneUiConfig } from '@/features/location/dashboardZoneUi';

export interface DashboardLocationContextValue {
  location: StoredUserLocation | null;
  zoneConfig: DashboardZoneUiConfig;
  showLocationModal: boolean;
  isLocating: boolean;
  locationError: string | null;
  requestBrowserLocation: () => void;
  skipLocationPrompt: () => void;
  setZoneManual: (zone: DashboardZone) => void;
  clearLocationError: () => void;
  openLocationModal: () => void;
}

const DashboardLocationContext = createContext<DashboardLocationContextValue | null>(null);

function toStoredWithTime(next: Omit<StoredUserLocation, 'updatedAt'> & { updatedAt?: string }): StoredUserLocation {
  return {
    ...next,
    updatedAt: next.updatedAt ?? new Date().toISOString(),
  };
}

export function DashboardLocationProvider({
  children,
  pinZone,
}: {
  children: ReactNode;
  /** When set (e.g. `/noida` route), persist this zone after hydrate so the correct dashboard UI loads. */
  pinZone?: DashboardZone;
}) {
  const [location, setLocation] = useState<StoredUserLocation | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    const stored = getUserLocation();
    setLocation(stored);
    setShowLocationModal(!stored);
    setHydrated(true);
  }, []);

  const zoneConfig = useMemo(
    () => getDashboardZoneUi(location?.zone ?? 'default'),
    [location?.zone],
  );

  const persist = useCallback((next: Omit<StoredUserLocation, 'updatedAt'> & { updatedAt?: string }) => {
    const full = toStoredWithTime(next);
    saveUserLocation(full);
    setLocation(full);
  }, []);

  const skipLocationPrompt = useCallback(() => {
    persist({ city: '', state: '', zone: 'default', source: 'skipped' });
    setShowLocationModal(false);
    setLocationError(null);
    try {
      sessionStorage.setItem(SESSION_KEYS.DASHBOARD_LOCATION_PROMPT_DISMISSED, '1');
    } catch {
      /* ignore */
    }
  }, [persist]);

  const requestBrowserLocation = useCallback(() => {
    setLocationError(null);
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setLocationError('Geolocation is not supported in this browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const details = await fetchLocationDetails(latitude, longitude);
          persist({
            city: details.city,
            state: details.state,
            zone: details.zone,
            lat: latitude,
            lng: longitude,
            source: 'geolocation',
          });
          setShowLocationModal(false);
        } catch (e) {
          setLocationError(e instanceof Error ? e.message : 'Could not resolve location.');
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        setIsLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          setLocationError(
            'Location permission denied. Choose your area below, or skip for the default experience.',
          );
        } else {
          setLocationError('Location unavailable. Retry or choose your area below.');
        }
      },
      { enableHighAccuracy: false, timeout: 15_000, maximumAge: 60_000 },
    );
  }, [persist]);

  const setZoneManual = useCallback(
    (zone: DashboardZone) => {
      const manualDefaults: Record<DashboardZone, { city: string; state: string }> = {
        khatu: { city: 'Khatu area', state: 'Rajasthan' },
        noida: { city: 'Noida', state: 'Uttar Pradesh' },
        default: { city: '', state: '' },
      };
      const { city, state } = manualDefaults[zone];
      persist({ city, state, zone, source: 'manual' });
      setShowLocationModal(false);
      setLocationError(null);
    },
    [persist],
  );

  useEffect(() => {
    if (!hydrated || !pinZone) return;
    setZoneManual(pinZone);
  }, [hydrated, pinZone, setZoneManual]);

  const clearLocationError = useCallback(() => setLocationError(null), []);

  const openLocationModal = useCallback(() => {
    setShowLocationModal(true);
    setLocationError(null);
  }, []);

  const value = useMemo(
    (): DashboardLocationContextValue => ({
      location,
      zoneConfig,
      showLocationModal: hydrated && showLocationModal,
      isLocating,
      locationError,
      requestBrowserLocation,
      skipLocationPrompt,
      setZoneManual,
      clearLocationError,
      openLocationModal,
    }),
    [
      location,
      zoneConfig,
      hydrated,
      showLocationModal,
      isLocating,
      locationError,
      requestBrowserLocation,
      skipLocationPrompt,
      setZoneManual,
      clearLocationError,
      openLocationModal,
    ],
  );

  return (
    <DashboardLocationContext.Provider value={value}>{children}</DashboardLocationContext.Provider>
  );
}

export function useDashboardLocation(): DashboardLocationContextValue {
  const ctx = useContext(DashboardLocationContext);
  if (!ctx) {
    throw new Error('useDashboardLocation must be used within DashboardLocationProvider');
  }
  return ctx;
}
