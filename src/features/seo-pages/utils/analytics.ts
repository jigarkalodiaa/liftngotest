/**
 * Analytics utility for SEO page conversion tracking
 * Integrates with Google Analytics 4 and custom tracking
 */

export interface TrackEventParams {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

/**
 * Track an event to analytics platforms
 */
export function trackEvent({ action, category, label, value }: TrackEventParams): void {
  // Google Analytics 4
  if (typeof window !== 'undefined' && 'gtag' in window) {
    (window as Window & { gtag: (...args: unknown[]) => void }).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }

  // Console log in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics]', { action, category, label, value });
  }
}

/**
 * Track page view
 */
export function trackPageView(path: string, title: string): void {
  if (typeof window !== 'undefined' && 'gtag' in window) {
    (window as Window & { gtag: (...args: unknown[]) => void }).gtag('event', 'page_view', {
      page_path: path,
      page_title: title,
    });
  }
}

/**
 * Track WhatsApp click conversion
 */
export function trackWhatsAppClick(pageSlug: string, location: string): void {
  trackEvent({
    action: 'whatsapp_click',
    category: 'conversion',
    label: `${pageSlug}_${location}`,
  });
}

/**
 * Track phone call conversion
 */
export function trackPhoneClick(pageSlug: string, location: string): void {
  trackEvent({
    action: 'phone_click',
    category: 'conversion',
    label: `${pageSlug}_${location}`,
  });
}

/**
 * Track CTA button click
 */
export function trackCtaClick(pageSlug: string, ctaType: string): void {
  trackEvent({
    action: 'cta_click',
    category: 'conversion',
    label: `${pageSlug}_${ctaType}`,
  });
}

/**
 * Track scroll depth
 */
export function trackScrollDepth(pageSlug: string, depth: number): void {
  trackEvent({
    action: 'scroll_depth',
    category: 'engagement',
    label: pageSlug,
    value: depth,
  });
}

/**
 * Track time on page
 */
export function trackTimeOnPage(pageSlug: string, seconds: number): void {
  trackEvent({
    action: 'time_on_page',
    category: 'engagement',
    label: pageSlug,
    value: seconds,
  });
}
