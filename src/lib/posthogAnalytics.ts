import { posthog } from '@/lib/posthog';
import { isPostHogConfiguredClient } from '@/lib/posthogEnv';

/**
 * PostHog product analytics — client-only, snake_case events.
 * GA4 stays in `@/lib/analytics`; never import GA `trackEvent` here.
 */
export function trackEvent(eventName: string, properties?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  if (!isPostHogConfiguredClient()) return;
  posthog.capture(eventName, properties);
}

export function identifyUser(userId: string, traits?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  if (!isPostHogConfiguredClient()) return;
  posthog.identify(userId, traits);
  posthog.capture('user_identified', { method: 'otp' });
}
