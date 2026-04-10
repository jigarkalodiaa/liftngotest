/**
 * Next.js Middleware
 * 
 * NOTE: Auth is handled client-side via sessionStorage in this app.
 * This middleware only handles non-auth concerns like headers, redirects, etc.
 * 
 * Protected route checks are done in components using `isUserAuthenticated()` from @/lib/storage
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Allow all requests - auth is handled client-side
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Only run on specific paths if needed in future
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
