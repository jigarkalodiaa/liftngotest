/**
 * GA4 event helpers — no-op until `window.gtag` exists (script loaded).
 * Never send PII in event params.
 */

export type AnalyticsEventName =
  | 'book_now_click'
  | 'whatsapp_click'
  | 'form_submit'
  | 'cta_click'
  | 'login_click';

export function trackEvent(name: AnalyticsEventName, params?: Record<string, string | number | boolean>) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', name, params ?? {});
}

export function trackBookNowClick(source: string) {
  trackEvent('book_now_click', { source });
}

export function trackWhatsAppClick(source: string) {
  trackEvent('whatsapp_click', { source });
}

export function trackFormSubmit(formName: string) {
  trackEvent('form_submit', { form_name: formName });
}
