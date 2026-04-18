import { useMemo } from 'react';
import { SeoPageInternalLink } from '../types';
import { getRelatedLinks, getDefaultLinks } from '../utils/internalLinks';

/**
 * Hook to get internal links for a page
 * Uses keyword matching to find relevant related pages
 */
export function useInternalLinks(
  currentSlug: string,
  keywords: string[] = [],
  limit: number = 4
): SeoPageInternalLink[] {
  return useMemo(() => {
    if (keywords.length > 0) {
      return getRelatedLinks(currentSlug, keywords, limit);
    }
    return getDefaultLinks(currentSlug, limit);
  }, [currentSlug, keywords, limit]);
}
