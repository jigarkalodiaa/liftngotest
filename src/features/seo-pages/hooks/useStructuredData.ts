import { useMemo } from 'react';
import { SeoPageData } from '../types';
import { buildAllSchemas } from '../utils/schemaBuilder';

/**
 * Hook to generate structured data for SEO pages
 */
export function useStructuredData(data: SeoPageData) {
  return useMemo(() => {
    if (!data) return null;
    return buildAllSchemas(data);
  }, [data]);
}
