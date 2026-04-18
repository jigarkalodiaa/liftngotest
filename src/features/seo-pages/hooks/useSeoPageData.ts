import { useMemo } from 'react';
import { SeoPageData } from '../types';
import { getSeoPageData } from '../data';

/**
 * Hook to get SEO page data by slug
 * Memoizes the result to prevent unnecessary re-renders
 */
export function useSeoPageData(slug: string): SeoPageData | null {
  return useMemo(() => getSeoPageData(slug), [slug]);
}
