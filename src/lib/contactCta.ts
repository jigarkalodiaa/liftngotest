/**
 * Tel / WhatsApp links for CTAs. Uses public env at build time.
 */

import { SUPPORT_PHONE } from '@/config/env';

/** E.164-style `tel:` for support / sales (India +91). */
export function getSupportTelHref(): string {
  const d = SUPPORT_PHONE.replace(/\D/g, '');
  if (d.length >= 10) return `tel:+91${d.slice(-10)}`;
  return 'tel:+919065847341';
}
