'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { trackWhatsAppClick } from '../utils/analytics';

interface WhatsAppTriggerProps {
  whatsappLink: string;
  pageSlug: string;
  showAfterSeconds?: number;
  position?: 'bottom-right' | 'bottom-left';
}

export function WhatsAppTrigger({
  whatsappLink,
  pageSlug,
  showAfterSeconds = 5,
  position = 'bottom-right',
}: WhatsAppTriggerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    // Show after delay
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, showAfterSeconds * 1000);

    // Start pulsing after additional delay
    const pulseTimer = setTimeout(() => {
      setIsPulsing(true);
    }, (showAfterSeconds + 3) * 1000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(pulseTimer);
    };
  }, [showAfterSeconds]);

  const handleClick = () => {
    trackWhatsAppClick(pageSlug, 'floating_button');
    setIsPulsing(false);
  };

  if (!isVisible) return null;

  const positionClasses = {
    'bottom-right': 'right-4 sm:right-6',
    'bottom-left': 'left-4 sm:left-6',
  };

  return (
    <Link
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={`fixed bottom-20 sm:bottom-6 ${positionClasses[position]} z-40 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-all hover:scale-110 hover:bg-green-600 ${
        isPulsing ? 'animate-pulse' : ''
      }`}
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-7 w-7" />
      {isPulsing && (
        <span className="absolute -right-1 -top-1 flex h-4 w-4">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex h-4 w-4 rounded-full bg-green-500" />
        </span>
      )}
    </Link>
  );
}
