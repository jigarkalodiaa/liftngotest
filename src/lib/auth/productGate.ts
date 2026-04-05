import { ROUTES } from '@/lib/constants';
import { isUserAuthenticated, sanitizePostLoginRedirectTarget, setPostLoginRedirect } from '@/lib/storage';

/** Builds `/login?redirect=…` with an allowlisted path only (falls back to `/plans`). */
export function buildLoginUrlWithRedirect(targetPath: string): string {
  const safe = sanitizePostLoginRedirectTarget(targetPath);
  const path = safe ?? ROUTES.PLANS;
  return `${ROUTES.LOGIN}?redirect=${encodeURIComponent(path)}`;
}

/**
 * If logged in → product route. Else → login with `redirect` preserved for post-OTP navigation.
 */
export function navigateToProductPath(router: Pick<{ push: (href: string) => void }, 'push'>, targetPath: string): void {
  const safe = sanitizePostLoginRedirectTarget(targetPath);
  if (!safe) return;
  if (typeof window !== 'undefined' && isUserAuthenticated()) {
    router.push(safe);
    return;
  }
  setPostLoginRedirect(safe);
  router.push(buildLoginUrlWithRedirect(safe));
}
