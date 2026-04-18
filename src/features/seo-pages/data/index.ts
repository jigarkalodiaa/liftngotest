import { SeoPageData } from '../types';
import { hyperlocalDeliveryData } from './hyperlocal';
import { restaurantDeliveryData } from './restaurant';
import { hotelLogisticsData } from './hotel';
import { buildAllSchemas } from '../utils/schemaBuilder';

// Registry of all SEO pages
const SEO_PAGES_REGISTRY: Record<string, SeoPageData> = {
  'hyperlocal-delivery-service': hyperlocalDeliveryData,
  'restaurant-delivery-partner': restaurantDeliveryData,
  'hotel-logistics-partner': hotelLogisticsData,
};

/**
 * Get SEO page data by slug
 * Returns null if page doesn't exist
 */
export function getSeoPageData(slug: string): SeoPageData | null {
  const data = SEO_PAGES_REGISTRY[slug];
  
  if (!data) {
    return null;
  }
  
  // Build schemas dynamically
  const schemas = buildAllSchemas(data);
  
  return {
    ...data,
    schema: schemas,
  };
}

/**
 * Get all SEO page slugs
 */
export function getAllSeoPageSlugs(): string[] {
  return Object.keys(SEO_PAGES_REGISTRY);
}

/**
 * Check if a slug is a valid SEO page
 */
export function isValidSeoPage(slug: string): boolean {
  return slug in SEO_PAGES_REGISTRY;
}

/**
 * Get all SEO pages for sitemap generation
 */
export function getAllSeoPages(): SeoPageData[] {
  return Object.values(SEO_PAGES_REGISTRY).map((data) => ({
    ...data,
    schema: buildAllSchemas(data),
  }));
}

/**
 * Get SEO page configs for sitemap
 */
export function getSeoPageConfigs(): Array<{
  slug: string;
  path: string;
  priority: number;
  changeFrequency: 'daily' | 'weekly' | 'monthly';
}> {
  return Object.entries(SEO_PAGES_REGISTRY).map(([slug, data]) => ({
    slug,
    path: data.seo.path,
    priority: 0.85,
    changeFrequency: 'weekly' as const,
  }));
}

// Re-export individual page data for direct imports if needed
export { hyperlocalDeliveryData } from './hyperlocal';
export { restaurantDeliveryData } from './restaurant';
export { hotelLogisticsData } from './hotel';
