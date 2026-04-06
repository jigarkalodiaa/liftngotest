import posthog from 'posthog-js';

/**
 * PostHog is initialised once in `instrumentation-client.ts` (Next.js 15.3+).
 * This no-op is kept for backward compatibility with existing call-sites.
 */
export function initPosthog(): void {}

export { posthog };
