'use client';

import { useState, useCallback } from 'react';

interface GeolocationResult {
  latitude: number;
  longitude: number;
  address: string;
  shortAddress: string;
}

interface UseGeolocationReturn {
  isLoading: boolean;
  error: string;
  getLocation: () => Promise<GeolocationResult | null>;
}

export function useGeolocation(): UseGeolocationReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const getLocation = useCallback(async (): Promise<GeolocationResult | null> => {
    setError('');
    setIsLoading(true);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setIsLoading(false);
      return null;
    }

    return new Promise((resolve) => {
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
              setIsLoading(false);
              resolve({
                latitude,
                longitude,
                address: data.display_name,
                shortAddress,
              });
            } else {
              setIsLoading(false);
              resolve({
                latitude,
                longitude,
                address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
                shortAddress: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
              });
            }
          } catch {
            setIsLoading(false);
            resolve({
              latitude,
              longitude,
              address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
              shortAddress: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
            });
          }
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
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  }, []);

  return { isLoading, error, getLocation };
}
