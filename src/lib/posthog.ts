import posthog from 'posthog-js';
import { getPostHogApiHost, getPostHogPublicToken } from '@/lib/posthogEnv';

/**
 * PostHog init with idempotent guard.
 */
let _initDone = false;
export function initPosthog(): void {
  if (_initDone) return;
  if (typeof window === 'undefined') return;
  const token = getPostHogPublicToken();
  if (!token) return;
  posthog.init(token, {
    api_host: getPostHogApiHost(),
    capture_pageview: false,
    capture_pageleave: true,
    person_profiles: 'identified_only',
  });
  _initDone = true;
}

export { posthog };
