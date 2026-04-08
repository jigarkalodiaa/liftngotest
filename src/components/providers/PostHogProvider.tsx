'use client';

import { PostHogProvider } from 'posthog-js/react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, type ReactNode } from 'react';
import { initPosthog, posthog } from '@/lib/posthog';
import { isPostHogConfiguredClient } from '@/lib/posthogEnv';

/**
 * Fires `$pageview` on the full URL for every App Router navigation (incl. query changes).
 * Renders inside Suspense because `useSearchParams()` requires it in the App Router.
 */
function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isPostHogConfiguredClient()) return;
    initPosthog();
    const qs = searchParams.toString();
    const url = `${window.location.origin}${pathname}${qs ? `?${qs}` : ''}`;
    posthog.capture('$pageview', { $current_url: url });
  }, [pathname, searchParams]);

  return null;
}

/**
 * Client-only PostHog: init + SPA pageviews + session recording (see `posthog.init` in `lib/posthog.ts`).
 * If `NEXT_PUBLIC_POSTHOG_KEY` is unset, this renders children only (no PostHog).
 */
export default function PostHogAnalyticsProvider({ children }: { children: ReactNode }) {
  const enabled = isPostHogConfiguredClient();

  useEffect(() => {
    initPosthog();
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const onError = (event: ErrorEvent) => {
      posthog.captureException(event.error ?? new Error(event.message || 'window_error'));
    };
    const onRejection = (event: PromiseRejectionEvent) => {
      const reason =
        event.reason instanceof Error ? event.reason : new Error(String(event.reason ?? 'unhandled_rejection'));
      posthog.captureException(reason);
    };
    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onRejection);
    return () => {
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onRejection);
    };
  }, [enabled]);

  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <PostHogProvider client={posthog}>
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      {children}
    </PostHogProvider>
  );
}
