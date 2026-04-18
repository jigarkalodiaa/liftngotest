import { SeoPageInternalLink } from '../types';
import { ROUTES } from '@/lib/constants';

// Define all available SEO pages for internal linking
const ALL_SEO_PAGES: Record<string, { href: string; label: string; icon: string; keywords: string[] }> = {
  'hyperlocal-delivery-service': {
    href: '/hyperlocal-delivery-service',
    label: 'Hyperlocal Delivery',
    icon: 'Zap',
    keywords: ['hyperlocal', 'fast', 'quick', '15 minute', 'instant'],
  },
  'same-day-delivery-khatu': {
    href: '/same-day-delivery-khatu',
    label: 'Same Day Delivery Khatu',
    icon: 'Clock',
    keywords: ['same day', 'khatu', 'delivery', 'today'],
  },
  'whatsapp-delivery-service': {
    href: '/whatsapp-delivery-service',
    label: 'WhatsApp Delivery',
    icon: 'MessageCircle',
    keywords: ['whatsapp', 'booking', 'easy', 'simple'],
  },
  'hotel-logistics-partner': {
    href: '/hotel-logistics-partner',
    label: 'Hotel Logistics Partner',
    icon: 'Hotel',
    keywords: ['hotel', 'hospitality', 'supplies', 'linen'],
  },
  'restaurant-delivery-partner': {
    href: '/restaurant-delivery-partner',
    label: 'Restaurant Delivery',
    icon: 'Utensils',
    keywords: ['restaurant', 'food', 'kitchen', 'delivery'],
  },
  'fleet-branding-rajasthan': {
    href: '/fleet-branding-rajasthan',
    label: 'Fleet Branding Rajasthan',
    icon: 'Palette',
    keywords: ['branding', 'fleet', 'advertising', 'vehicle'],
  },
  'b2b-logistics-rajasthan': {
    href: '/b2b-logistics-rajasthan',
    label: 'B2B Logistics Rajasthan',
    icon: 'Building2',
    keywords: ['b2b', 'business', 'wholesale', 'commercial'],
  },
  'khatu-shyam-logistics': {
    href: ROUTES.KHATU_SHYAM_LOGISTICS,
    label: 'Khatu Shyam Logistics',
    icon: 'MapPin',
    keywords: ['khatu', 'temple', 'shyam', 'pilgrimage'],
  },
  'fare-calculator': {
    href: ROUTES.FARE_CALCULATOR,
    label: 'Calculate Fare',
    icon: 'IndianRupee',
    keywords: ['fare', 'price', 'cost', 'estimate'],
  },
};

/**
 * Get related internal links for a given page slug
 * Uses keyword matching to find relevant pages
 */
export function getRelatedLinks(
  currentSlug: string,
  pageKeywords: string[],
  limit: number = 4
): SeoPageInternalLink[] {
  const otherPages = Object.entries(ALL_SEO_PAGES)
    .filter(([slug]) => slug !== currentSlug);
  
  // Score each page based on keyword overlap
  const scored = otherPages.map(([slug, page]) => {
    const score = page.keywords.reduce((acc, keyword) => {
      const matches = pageKeywords.some(pk => 
        pk.toLowerCase().includes(keyword.toLowerCase()) ||
        keyword.toLowerCase().includes(pk.toLowerCase())
      );
      return acc + (matches ? 1 : 0);
    }, 0);
    
    return { slug, page, score };
  });
  
  // Sort by score (highest first), then take top N
  const topPages = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
  
  return topPages.map(({ page }) => ({
    href: page.href,
    label: page.label,
    icon: page.icon,
  }));
}

/**
 * Get default internal links if no keyword matching needed
 */
export function getDefaultLinks(currentSlug: string, limit: number = 4): SeoPageInternalLink[] {
  return Object.entries(ALL_SEO_PAGES)
    .filter(([slug]) => slug !== currentSlug)
    .slice(0, limit)
    .map(([, page]) => ({
      href: page.href,
      label: page.label,
      icon: page.icon,
    }));
}

/**
 * Get all SEO page slugs for sitemap generation
 */
export function getAllSeoPageSlugs(): string[] {
  return Object.keys(ALL_SEO_PAGES);
}

/**
 * Check if a slug is a valid SEO page
 */
export function isValidSeoPageSlug(slug: string): boolean {
  return slug in ALL_SEO_PAGES;
}
