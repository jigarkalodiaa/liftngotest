/**
 * GA4 event helpers — no-op until `window.gtag` exists (script loaded).
 * Never send PII in event params.
 *
 * Deduplication: rapid duplicate calls (same event + params within DEDUP_MS)
 * are silently dropped. Legitimate re-fires after the cooldown go through normally.
 */

import { event as gtagEvent } from '@/lib/gtag';

const DEDUP_MS = 2000;
const _lastFired = new Map<string, number>();

export type AnalyticsEventName =
  | 'book_now_click'
  | 'whatsapp_click'
  | 'form_submit'
  | 'cta_click'
  | 'login_click'
  | 'check_price_click'
  | 'pickup_location_entered'
  | 'drop_location_entered'
  | 'login_started'
  | 'otp_sent'
  | 'otp_verified'
  | 'booking_completed';

export function trackEvent(name: AnalyticsEventName, params?: Record<string, string | number | boolean>) {
  if (typeof window === 'undefined') return;

  const key = params ? `${name}:${JSON.stringify(params)}` : name;
  const now = Date.now();
  const last = _lastFired.get(key);
  if (last && now - last < DEDUP_MS) return;

  _lastFired.set(key, now);
  gtagEvent(name, params);
}

/* ─── existing helpers ─── */

export function trackBookNowClick(source: string) {
  trackEvent('book_now_click', { source });
}

export function trackWhatsAppClick(source: string) {
  trackEvent('whatsapp_click', { source });
}

export function trackFormSubmit(formName: string) {
  trackEvent('form_submit', { form_name: formName });
}

/* ─── business funnel helpers ─── */

export function trackCheckPriceClick(vehicleType: string) {
  trackEvent('check_price_click', { vehicle_type: vehicleType });
}

export function trackPickupLocationEntered(source: string) {
  trackEvent('pickup_location_entered', { source });
}

export function trackDropLocationEntered(source: string) {
  trackEvent('drop_location_entered', { source });
}

export function trackLoginStarted() {
  trackEvent('login_started');
}

export function trackOtpSent() {
  trackEvent('otp_sent');
}

export function trackOtpVerified() {
  trackEvent('otp_verified');
}

export function trackBookingCompleted(params?: Record<string, string | number | boolean>) {
  trackEvent('booking_completed', params);
}
