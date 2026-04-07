import { getLoggedIn, getStoredPhone } from '@/lib/storage';

/** For conversion analysis at checkout — guest vs signed-in session. */
export function getBookingUserType(): 'new' | 'returning' {
  if (typeof window === 'undefined') return 'new';
  return getLoggedIn() || Boolean(getStoredPhone()?.trim()) ? 'returning' : 'new';
}
