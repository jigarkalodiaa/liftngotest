import posthog from 'posthog-js';
import { getPostHogApiHost, getPostHogPublicToken } from '@/lib/posthogEnv';

const token = getPostHogPublicToken();
const apiHost = getPostHogApiHost();

if (token) {
  posthog.init(token, {
    api_host: apiHost,
    ui_host: 'https://us.posthog.com',
    // Required by PostHog for consistent default behaviour
    defaults: '2026-01-30',
    capture_exceptions: true,
    debug: process.env.NODE_ENV === 'development',
  });

  // DevTools: `window.posthog.capture('test_event')` (the SDK does not set this by default)
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    (window as Window & { posthog?: typeof posthog }).posthog = posthog;
  }
} else if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.warn(
    '[PostHog] No client token: set NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN (or NEXT_PUBLIC_POSTHOG_KEY) in .env.local',
  );
}
