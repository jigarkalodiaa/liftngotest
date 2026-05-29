'use client';

import { trackWhatsAppClick } from '@/lib/analytics';
import { getB2bOfferWhatsAppUrl } from '@/lib/b2bOffer';
import { MessageCircle } from 'lucide-react';
import type { ReactNode } from 'react';

type Props = {
  trackSource: string;
  className: string;
  children: ReactNode;
};

export default function OfferWhatsAppLink({ trackSource, className, children }: Props) {
  return (
    <a
      href={getB2bOfferWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackWhatsAppClick(trackSource)}
      className={className}
    >
      {children}
    </a>
  );
}

export function OfferWhatsAppIcon() {
  return <MessageCircle className="h-5 w-5 shrink-0" aria-hidden />;
}
