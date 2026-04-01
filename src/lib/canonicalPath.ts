/**
 * Normalizes path segments for canonical URLs and middleware redirects.
 * - Leading slash
 * - Collapsed slashes
 * - No trailing slash (except root)
 * - Lowercase (App Router paths are case-insensitive; avoids duplicate URLs)
 */
export function normalizeCanonicalPath(path: string): string {
  if (path == null || path === '') return '';
  let p = path.trim();
  if (!p.startsWith('/')) p = `/${p}`;
  p = p.replace(/\/+/g, '/');
  if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
  return p.toLowerCase();
}
