/**
 * Forward geocode an address string → { latitude, longitude } using Nominatim.
 * Returns null if geocoding fails (network, no results, etc.)
 * so callers can still proceed without coordinates.
 */
export async function geocodeAddress(
  address: string,
): Promise<{ latitude: number; longitude: number } | null> {
  if (!address || address.trim().length < 3) return null;
  try {
    const q = encodeURIComponent(address.trim());
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${q}&limit=1&countrycodes=in`,
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { lat?: string; lon?: string }[];
    const first = data?.[0];
    if (!first?.lat || !first?.lon) return null;
    return {
      latitude: parseFloat(first.lat),
      longitude: parseFloat(first.lon),
    };
  } catch {
    return null;
  }
}
