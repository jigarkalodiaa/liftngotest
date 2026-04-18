'use client';

import { useEffect, useRef } from 'react';
import { trackPageView, trackScrollDepth, trackTimeOnPage } from '../utils/analytics';

interface UsePageAnalyticsOptions {
  pageSlug: string;
  pageTitle: string;
  trackScroll?: boolean;
  trackTime?: boolean;
}

/**
 * Hook for tracking page analytics
 * Tracks page views, scroll depth, and time on page
 */
export function usePageAnalytics({
  pageSlug,
  pageTitle,
  trackScroll = true,
  trackTime = true,
}: UsePageAnalyticsOptions): void {
  const startTime = useRef<number>(Date.now());
  const maxScrollDepth = useRef<number>(0);
  const scrollMilestones = useRef<Set<number>>(new Set());

  useEffect(() => {
    // Track page view
    trackPageView(`/${pageSlug}`, pageTitle);

    // Track scroll depth
    if (trackScroll) {
      const handleScroll = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = Math.round((scrollTop / docHeight) * 100);

        if (scrollPercent > maxScrollDepth.current) {
          maxScrollDepth.current = scrollPercent;

          // Track milestones: 25%, 50%, 75%, 100%
          const milestones = [25, 50, 75, 100];
          milestones.forEach((milestone) => {
            if (scrollPercent >= milestone && !scrollMilestones.current.has(milestone)) {
              scrollMilestones.current.add(milestone);
              trackScrollDepth(pageSlug, milestone);
            }
          });
        }
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [pageSlug, pageTitle, trackScroll]);

  // Track time on page when leaving
  useEffect(() => {
    if (!trackTime) return;

    const handleBeforeUnload = () => {
      const timeSpent = Math.round((Date.now() - startTime.current) / 1000);
      trackTimeOnPage(pageSlug, timeSpent);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [pageSlug, trackTime]);
}
