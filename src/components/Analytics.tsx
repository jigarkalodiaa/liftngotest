'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import { GA_ID, pageview } from '@/lib/gtag';

/**
 * Tracks SPA route changes by firing a `config` hit on every pathname / search-params change.
 * Wrapped in `<Suspense>` because `useSearchParams()` requires it in App Router.
 */
function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!GA_ID) return;
    const url = searchParams.size
      ? `${pathname}?${searchParams.toString()}`
      : pathname;
    pageview(url);
  }, [pathname, searchParams]);

  return null;
}

/**
 * Google Analytics 4 — load only when `NEXT_PUBLIC_GA_ID` is set.
 * Uses `afterInteractive` for reliable event capture.
 * `send_page_view: false` — page views are tracked manually by `PageViewTracker`.
 */
export default function GoogleAnalytics() {
  if (!GA_ID) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga4-config" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { send_page_view: false, anonymize_ip: true });
        `}
      </Script>
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
    </>
  );
}
