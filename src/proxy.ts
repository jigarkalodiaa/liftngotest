import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

/**
 * Normalize URLs for crawl clarity: lowercase path, single slashes, no trailing slash (except `/`).
 * Skips `/_next`, `/api`, and common static assets.
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/proxy
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname.startsWith('/manifest.json')
  ) {
    return NextResponse.next();
  }

  if (/\.[a-z0-9]{2,5}$/i.test(pathname)) {
    return NextResponse.next();
  }

  let normalized = pathname.replace(/\/+/g, '/');
  if (normalized.length > 1 && normalized.endsWith('/')) {
    normalized = normalized.slice(0, -1);
  }
  const target = normalized.toLowerCase();

  if (target !== pathname) {
    const url = request.nextUrl.clone();
    url.pathname = target;
    url.search = search;
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:ico|png|jpg|jpeg|gif|webp|svg|txt|xml|webmanifest|json)$).*)',
  ],
};
