/**
 * Best-effort city/area from a free-text Indian address (often "… , Area , City").
 * Client-only usage; no PII beyond what is already in `location` strings.
 */
export function inferCityFromLocationText(address: string): string | null {
  const normalized = address.replace(/\s+/g, ' ').trim();
  if (!normalized) return null;
  const parts = normalized.split(',').map((p) => p.trim()).filter(Boolean);
  if (parts.length >= 2) return parts[parts.length - 1] ?? null;
  return null;
}
