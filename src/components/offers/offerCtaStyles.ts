/** Shared CTA classes — matches `CTAButton` / landing funnel. */
export const offerCtaBase =
  'funnel-cta-press inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold shadow-sm sm:min-h-12 sm:px-6 sm:text-base';

export const offerCtaPrimary = `${offerCtaBase} bg-[var(--color-primary)] text-white hover:opacity-[0.92]`;

export const offerCtaWhatsapp = `${offerCtaBase} bg-[var(--whatsapp-green)] text-white hover:opacity-95`;

export const offerCtaSecondary = `${offerCtaBase} border-2 border-gray-300 bg-white text-gray-900 hover:bg-gray-50`;
