// Types
export * from './types';

// Data
export { getSeoPageData, getAllSeoPageSlugs, isValidSeoPage, getAllSeoPages, getSeoPageConfigs } from './data';

// Components (Server)
export {
  SeoPageTemplate,
  SeoHero,
  SeoStats,
  SeoCoverage,
  SeoProse,
  SeoUseCases,
  SeoBenefits,
  SeoHowItWorks,
  SeoFaqs,
  SeoInternalLinks,
  SeoCta,
} from './components';

// Components (Client - Conversion)
export { StickyCta, WhatsAppTrigger, PageAnalytics } from './components';

// Hooks
export { useSeoPageData, useStructuredData, useInternalLinks, usePageAnalytics } from './hooks';

// Utils
export { getIcon, ICON_MAP } from './utils/iconMap';
export { buildServiceSchema, buildBreadcrumbSchema, buildFaqSchema, buildAllSchemas } from './utils/schemaBuilder';
export { getRelatedLinks, getDefaultLinks, getAllSeoPageSlugs as getAvailableSlugs } from './utils/internalLinks';
export {
  trackEvent,
  trackPageView,
  trackWhatsAppClick,
  trackPhoneClick,
  trackCtaClick,
  trackScrollDepth,
  trackTimeOnPage,
} from './utils/analytics';
