'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageCircle, X } from 'lucide-react';
import { trackEvent } from '../utils/analytics';

interface StickyCtaProps {
  whatsappLink: string;
  message?: string;
  showAfterScroll?: number;
  pageSlug: string;
}

export function StickyCta({
  whatsappLink,
  message = 'Book Now',
  showAfterScroll = 300,
  pageSlug,
}: StickyCtaProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > showAfterScroll && !isDismissed) {
        setIsVisible(true);
      } else if (window.scrollY <= showAfterScroll) {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showAfterScroll, isDismissed]);

  const handleClick = () => {
    trackEvent({
      action: 'sticky_cta_click',
      category: 'conversion',
      label: pageSlug,
    });
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
    trackEvent({
      action: 'sticky_cta_dismiss',
      category: 'conversion',
      label: pageSlug,
    });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white p-4 shadow-lg sm:hidden">
      <div className="flex items-center gap-3">
        <Link
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          className="flex-1 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-green-500 px-6 text-base font-bold text-white shadow-lg transition-all hover:bg-green-600"
        >
          <MessageCircle className="h-5 w-5" />
          {message}
        </Link>
        <button
          onClick={handleDismiss}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
          aria-label="Dismiss"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
