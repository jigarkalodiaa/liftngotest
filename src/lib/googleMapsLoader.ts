/**
 * Load Google Maps JavaScript API with Places library (client-only).
 */

const SCRIPT_ID = 'liftngo-google-maps-js';

export function loadGoogleMapsPlaces(apiKey: string): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  const key = apiKey.trim();
  if (!key) return Promise.reject(new Error('Missing Google Maps API key'));

  if (window.google?.maps?.places) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      if (window.google?.maps?.places) {
        resolve();
        return;
      }
      let attempts = 0;
      const poll = window.setInterval(() => {
        if (window.google?.maps?.places) {
          window.clearInterval(poll);
          resolve();
        } else if (++attempts > 400) {
          window.clearInterval(poll);
          reject(new Error('Google Maps load timeout'));
        }
      }, 50);
      existing.addEventListener('error', () => {
        window.clearInterval(poll);
        reject(new Error('Google Maps script error'));
      });
      return;
    }

    const s = document.createElement('script');
    s.id = SCRIPT_ID;
    s.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&libraries=places`;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Failed to load Google Maps'));
    document.head.appendChild(s);
  });
}
