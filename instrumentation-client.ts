import posthog from 'posthog-js';
import { getPostHogApiHost, getPostHogPublicToken } from '@/lib/posthogEnv';

if (typeof window !== 'undefined') {
  // DevTools / production debugging — SDK instance is the module export.
  (window as Window & { posthog?: typeof posthog }).posthog = posthog;

  // TODO: remove after confirming Vercel env — verifies client bundle in production
  console.log('PostHog init', {
    key: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  });

  const token = getPostHogPublicToken();
  const apiHost = getPostHogApiHost();

  if (token) {
    posthog.init(token, {
      api_host: apiHost,
      ui_host: 'https://us.posthog.com',
      defaults: '2026-01-30',
      capture_exceptions: true,
      capture_pageview: true,
    });
  } else {
    console.warn(
      '[PostHog] Set NEXT_PUBLIC_POSTHOG_KEY (or NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN) and NEXT_PUBLIC_POSTHOG_HOST in Vercel — analytics will not send until the key is present at build time.',
    );
  }
}
