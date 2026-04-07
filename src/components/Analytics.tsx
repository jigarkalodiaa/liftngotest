'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import { GA_ID, pageview } from '@/lib/gtag';

/**
 * Tracks SPA route changes by firing a page_view on every pathname / search-params change.
 * Wrapped in `<Suspense>` because `useSearchParams()` requires it in App Router.
 */
function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = searchParams.size
      ? `${pathname}?${searchParams.toString()}`
      : pathname;
    pageview(url);
  }, [pathname, searchParams]);

  return null;
}

/**
 * Google Analytics 4 — ALWAYS renders. No conditional guards.
 * Hardcoded fallback in gtag.ts guarantees GA_ID is never empty.
 *
 * The initial `gtag('config')` sends the first page_view automatically.
 * `PageViewTracker` handles subsequent SPA navigations.
 */
export default function GoogleAnalytics() {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-config" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { anonymize_ip: true });
          console.log('[GA4] Loaded — ID:', '${GA_ID}');
        `}
      </Script>
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
    </>
  );
}
