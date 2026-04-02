/**
 * OTP / auth API base for the browser. Read via `process.env.NEXT_PUBLIC_*` so Next inlines
 * into the client bundle. Used inside request hooks so we never freeze an empty baseURL at cold load.
 */
export function getPublicAuthApiBase(): string {
  if (typeof process === 'undefined') return '';
  const primary = process.env.NEXT_PUBLIC_API_BASE_URL;
  const fallback = process.env.NEXT_PUBLIC_API_URL;
  const raw = (typeof primary === 'string' && primary.trim() ? primary : fallback) ?? '';
  return String(raw).trim().replace(/\/$/, '');
}
