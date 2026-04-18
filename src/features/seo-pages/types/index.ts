import { LucideIcon } from 'lucide-react';

export interface SeoPageHero {
  badge: string;
  badgeIcon: string;
  title: string;
  subtitle?: string;
  description: string;
  highlightText?: string;
  gradient?: string;
}

export interface SeoPageStat {
  value: string;
  label: string;
}

export interface SeoPageBenefit {
  icon: string;
  title: string;
  description: string;
}

export interface SeoPageStep {
  step: number;
  title: string;
  description: string;
}

export interface SeoPageFaq {
  question: string;
  answer: string;
}

export interface SeoPageCoverageArea {
  area: string;
  time: string;
}

export interface SeoPageInternalLink {
  href: string;
  label: string;
  icon: string;
}

export interface SeoPageUseCase {
  icon: string;
  title: string;
  description: string;
}

export interface SeoPageCta {
  title: string;
  description: string;
  whatsappText: string;
  footerText?: string;
  bgColor?: string;
}

export interface SeoPageSchema {
  service: Record<string, unknown>;
  breadcrumb: Record<string, unknown>;
  faq: Record<string, unknown>;
}

export interface SeoPageProseSection {
  heading: string;
  headingLevel: 2 | 3;
  content?: string;
  list?: string[];
}

export interface SeoPageData {
  // Core identifiers
  slug: string;
  keyword: string;
  city?: string;
  intent: 'transactional' | 'informational' | 'navigational';
  
  // SEO metadata
  seo: {
    title: string;
    description: string;
    keywords: string[];
    path: string;
  };
  
  // Page sections
  hero: SeoPageHero;
  stats: SeoPageStat[];
  benefits: SeoPageBenefit[];
  useCases?: SeoPageUseCase[];
  howItWorks: SeoPageStep[];
  coverageAreas?: SeoPageCoverageArea[];
  prose?: SeoPageProseSection[];
  faqs: SeoPageFaq[];
  internalLinks: SeoPageInternalLink[];
  cta: SeoPageCta;
  
  // Structured data
  schema: SeoPageSchema;
  
  // Theme
  theme: {
    primary: string;
    accent: string;
    gradient: string;
  };
}

export interface SeoPageConfig {
  slug: string;
  enabled: boolean;
  priority: number;
  changeFrequency: 'daily' | 'weekly' | 'monthly';
}

export type IconName = 
  | 'Zap' | 'Clock' | 'Shield' | 'MapPin' | 'Phone' | 'CheckCircle'
  | 'ArrowRight' | 'Package' | 'IndianRupee' | 'MessageCircle'
  | 'Timer' | 'Bike' | 'Truck' | 'Target' | 'Building2' | 'Utensils'
  | 'Hotel' | 'Store' | 'Palette' | 'Star' | 'Users' | 'Calendar';
