/**
 * Wizard / docs use `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`; older snippets use `NEXT_PUBLIC_POSTHOG_KEY`.
 * Accept either so init + `trackEvent` stay aligned.
 */
export function getPostHogPublicToken(): string | undefined {
  const t =
    process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN?.trim() ||
    process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim();
  return t || undefined;
}

export function isPostHogConfiguredClient(): boolean {
  return Boolean(getPostHogPublicToken());
}

/**
 * Override ingestion base URL:
 * - unset in production: use first-party `/ingest` rewrite
 * - unset in development: use direct US cloud (avoids local `/ingest` → 308 redirect loops on some Next setups)
 * - set explicitly: e.g. `https://eu.i.posthog.com` or `/ingest`
 */
export function getPostHogApiHost(): string {
  const explicit =
    process.env.NEXT_PUBLIC_POSTHOG_HOST?.trim() ||
    process.env.NEXT_PUBLIC_POSTHOG_API_HOST?.trim();
  if (explicit) return explicit;
  if (process.env.NODE_ENV === 'development') {
    return 'https://us.i.posthog.com';
  }
  return '/ingest';
}
