import { PostHog } from 'posthog-node';

let posthogClient: PostHog | null = null;

function getServerToken(): string | undefined {
  const t =
    process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim() ||
    process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN?.trim();
  return t || undefined;
}

function getServerHost(): string {
  return (
    process.env.NEXT_PUBLIC_POSTHOG_HOST?.trim() ||
    process.env.NEXT_PUBLIC_POSTHOG_API_HOST?.trim() ||
    'https://us.i.posthog.com'
  );
}

/** Returns null when no API token is configured (routes should skip capture). */
export function getPostHogClient(): PostHog | null {
  const token = getServerToken();
  if (!token) return null;
  if (!posthogClient) {
    posthogClient = new PostHog(token, {
      host: getServerHost(),
      flushAt: 1,
      flushInterval: 0,
    });
  }
  return posthogClient;
}

export async function shutdownPostHog(): Promise<void> {
  if (posthogClient) {
    await posthogClient.shutdown();
  }
}
