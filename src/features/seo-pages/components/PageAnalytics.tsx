'use client';

import { usePageAnalytics } from '../hooks/usePageAnalytics';

interface PageAnalyticsProps {
  pageSlug: string;
  pageTitle: string;
}

/**
 * Client component for page analytics tracking
 * Renders nothing, just tracks analytics
 */
export function PageAnalytics({ pageSlug, pageTitle }: PageAnalyticsProps) {
  usePageAnalytics({
    pageSlug,
    pageTitle,
    trackScroll: true,
    trackTime: true,
  });

  return null;
}
