import { trackFormSubmit } from '@/lib/analytics';
import { trackEvent, identifyUser } from '@/lib/posthogAnalytics';
import { ROUTES } from '@/lib/constants';
import {
  clearDropLocation,
  clearPickupLocation,
  consumePostLoginRedirect,
  getLandingPickupLocation,
  getPickupLocation,
  savedLocationHasAddress,
  setAuthToken,
  setLandingPickupLocation,
  setLoggedIn,
  setPickupLocation,
  setStoredPhone,
} from '@/lib/storage';
import { normalizePhoneInput } from '@/lib/validations';

/**
 * Persist session after successful OTP and apply landing-pickup hydration rules.
 * @returns Next path for `router.push` / `router.replace` (includes query when set).
 */
export function finalizeLoginSessionAfterOtp(rawPhone: string): string {
  setLoggedIn(true);
  trackFormSubmit('login_otp_success');
  trackEvent('otp_success', { success: true });
  const phone = normalizePhoneInput(rawPhone);
  identifyUser(phone, { phone });
  setStoredPhone(phone);
  const dummyToken = `dummy_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  setAuthToken(dummyToken);

  const nextPath = consumePostLoginRedirect();
  const landingPickupValue = getLandingPickupLocation()?.trim() ?? '';
  const pathOnly = nextPath.split('?')[0];
  if (pathOnly === ROUTES.PICKUP_LOCATION || pathOnly === ROUTES.PICKUP_LOCATION_EDIT) {
    if (landingPickupValue) {
      const name = landingPickupValue.split(',')[0]?.trim() || 'Pickup location';
      setPickupLocation({ name, address: landingPickupValue, contact: '' });
    } else if (!savedLocationHasAddress(getPickupLocation())) {
      // Food flow (and others) may already have set pickup in localStorage before login.
      clearPickupLocation();
      clearDropLocation();
    }
  }
  setLandingPickupLocation(null);

  return nextPath;
}
