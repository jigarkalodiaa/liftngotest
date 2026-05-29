/** B2B launch offer — site-wide conversion + dedicated landing page. */
export const B2B_OFFER_WHATSAPP_DIGITS = '918580584898';

export const B2B_OFFER_PHONE_DISPLAY = '8580584898';

export const B2B_OFFER_WHATSAPP_PREFILL =
  'Hi LiftnGo Team, I am interested in the First Business Delivery Free offer.';

export const B2B_OFFER_LANDING_PATH = '/offers/first-business-delivery-free';

/** Current session flag — bump suffix if dismiss logic changes. */
export const B2B_OFFER_POPUP_DISMISSED_KEY = 'liftngo_b2b_offer_popup_v2_dismissed';

export const B2B_OFFER_POPUP_DELAY_MS = 4_000;

/** Promo creative (`/public/images/coconut/offer.png`). */
export const B2B_OFFER_IMAGE_PATH = '/images/coconut/offer.png';

export function getB2bOfferWhatsAppUrl(): string {
  return `https://wa.me/${B2B_OFFER_WHATSAPP_DIGITS}?text=${encodeURIComponent(B2B_OFFER_WHATSAPP_PREFILL)}`;
}

export function getB2bOfferTelHref(): string {
  return `tel:+${B2B_OFFER_WHATSAPP_DIGITS}`;
}

export function isB2bOfferLandingPath(pathname: string | null): boolean {
  if (!pathname) return false;
  const normalized = pathname.replace(/\/+$/, '') || '/';
  return normalized === B2B_OFFER_LANDING_PATH;
}

export function shouldShowB2bOfferPopup(pathname: string | null): boolean {
  return !isB2bOfferLandingPath(pathname);
}

export function isB2bOfferPopupDismissed(): boolean {
  try {
    return sessionStorage.getItem(B2B_OFFER_POPUP_DISMISSED_KEY) === '1';
  } catch {
    return false;
  }
}

export function setB2bOfferPopupDismissed(): void {
  try {
    sessionStorage.setItem(B2B_OFFER_POPUP_DISMISSED_KEY, '1');
  } catch {
    /* private mode */
  }
}
