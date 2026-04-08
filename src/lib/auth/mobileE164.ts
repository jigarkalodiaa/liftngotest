import { normalizePhoneInput } from '@/lib/validations';

/** Normalizes to 10-digit Indian mobile, then `+91...` for backend OTP APIs. */
export function toIndianE164(rawPhone: string): string {
  const digits = normalizePhoneInput(rawPhone);
  return `+91${digits}`;
}

/** Mask for display: +91 ••••••1234 */
export function maskIndianMobile(rawPhone: string): string {
  const digits = normalizePhoneInput(rawPhone);
  if (digits.length < 10) return `+91 ••••••••••`;
  const last4 = digits.slice(-4);
  return `+91 ••••••${last4}`;
}
