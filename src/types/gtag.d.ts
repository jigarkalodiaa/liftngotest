/** GA4 gtag.js — injected by `components/Analytics.tsx` when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set. */
export {};

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}
