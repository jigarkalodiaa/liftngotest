/**
 * GA4 event helpers — no-op until `window.gtag` exists (script loaded).
 * Never send PII in event params.
 *
 * Deduplication: rapid duplicate calls (same event + params within DEDUP_MS)
 * are silently dropped. Legitimate re-fires after the cooldown go through normally.
 */

import { dataLayerEvent, event as gtagEvent } from '@/lib/gtag';
import { trackEvent as phTrackEvent } from '@/lib/posthogAnalytics';

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
  | 'booking_completed'
  | 'view_plan_clicked'
  | 'calculator_used'
  | 'plan_selected'
  | 'checkout_started'
  /** GA4-style — FAQ accordions, plan tabs, carousel items */
  | 'select_content'
  | 'add_to_cart'
  | 'remove_from_cart'
  | 'view_cart'
  | 'chat_toggle'
  | 'tel_click'
  | 'email_click'
  | 'social_click'
  | 'outbound_click'
  /** Funnel / drop-off: booking, plans, coconut, etc. */
  | 'funnel_step'
  | 'modal_open'
  | 'modal_close'
  | 'file_download';

export function trackEvent(name: AnalyticsEventName, params?: Record<string, string | number | boolean>) {
  if (typeof window === 'undefined') return;

  const key = params ? `${name}:${JSON.stringify(params)}` : name;
  const now = Date.now();
  const last = _lastFired.get(key);
  if (last && now - last < DEDUP_MS) return;

  _lastFired.set(key, now);
  gtagEvent(name, params);
  dataLayerEvent(name, params);
}

/* ─── existing helpers ─── */

export function trackBookNowClick(source: string) {
  trackEvent('book_now_click', { source });
}

export function trackWhatsAppClick(source: string) {
  trackEvent('whatsapp_click', { source });
  phTrackEvent('whatsapp_clicked', { source });
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

/* ─── plan funnel helpers ─── */

export function trackViewPlan(planType: string, source: string) {
  trackEvent('view_plan_clicked', { plan_type: planType, source });
}

export function trackCalculatorUsed(params: Record<string, string | number | boolean>) {
  trackEvent('calculator_used', params);
}

export function trackPlanSelected(planName: string, planType: string) {
  trackEvent('plan_selected', { plan_name: planName, plan_type: planType });
}

export function trackCheckoutStarted(flow: string, amount?: number) {
  trackEvent('checkout_started', { flow, ...(amount != null && { amount }) });
}

/* ─── engagement & funnel (GA4-friendly param names) ─── */

export function trackSelectContent(
  contentType: string,
  itemId: string,
  extra?: Record<string, string | number | boolean>,
) {
  trackEvent('select_content', {
    content_type: contentType,
    item_id: itemId,
    ...extra,
  });
}

export function trackAddToCart(
  itemId: string,
  itemName: string,
  value: number,
  quantity: number,
  currency = 'INR',
) {
  trackEvent('add_to_cart', { item_id: itemId, item_name: itemName, value, quantity, currency });
}

export function trackRemoveFromCart(itemId: string, quantity: number, value?: number) {
  trackEvent('remove_from_cart', {
    item_id: itemId,
    quantity,
    ...(value != null && { value }),
  });
}

export function trackViewCart(itemCount: number, value: number, source: string) {
  trackEvent('view_cart', { item_count: itemCount, value, source });
}

export function trackChatToggle(state: 'open' | 'close') {
  trackEvent('chat_toggle', { state });
}

export function trackTelClick(source: string) {
  trackEvent('tel_click', { source });
  phTrackEvent('call_clicked', { source });
}

export function trackEmailClick(source: string) {
  trackEvent('email_click', { source });
}

export function trackSocialClick(network: string, source: string) {
  trackEvent('social_click', { network, source });
}

export function trackOutboundClick(destination: string, label: string, source?: string) {
  trackEvent('outbound_click', {
    destination: destination.slice(0, 200),
    label: label.slice(0, 120),
    ...(source && { source }),
  });
}

export function trackFunnelStep(flow: string, step: string, detail?: string) {
  trackEvent('funnel_step', {
    flow,
    step,
    ...(detail && { detail: detail.slice(0, 120) }),
  });
}

export function trackModalOpen(modalId: string, source?: string) {
  trackEvent('modal_open', { modal_id: modalId, ...(source && { source }) });
  phTrackEvent('modal_opened', { modal_id: modalId, ...(source && { source }) });
}

export function trackModalClose(modalId: string) {
  trackEvent('modal_close', { modal_id: modalId });
  phTrackEvent('modal_closed', { modal_id: modalId });
}

export function trackFileDownload(fileLabel: string, source: string) {
  trackEvent('file_download', { file_label: fileLabel, source });
}
