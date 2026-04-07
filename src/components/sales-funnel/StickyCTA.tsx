'use client';

import CTAButton from '@/components/sales-funnel/CTAButton';
import { MessageCircle } from 'lucide-react';

type Props = {
  bookHref: string;
  contactHref: string;
  whatsappHref?: string | null;
  bookSource?: string;
  contactSource?: string;
  waSource?: string;
};

/**
 * Thumb-friendly sticky bar — one primary action + optional WhatsApp; “Talk to expert” = contact.
 */
export default function StickyCTA({
  bookHref,
  contactHref,
  whatsappHref,
  bookSource = 'noida_b2b_sticky_book',
  contactSource = 'noida_b2b_sticky_expert',
  waSource = 'noida_b2b_sticky_whatsapp',
}: Props) {
  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] pt-2 sm:px-4"
      role="region"
      aria-label="Quick actions"
    >
      <div className="pointer-events-auto mx-auto flex max-w-lg flex-col gap-2 rounded-2xl border border-gray-200/80 bg-white/95 p-3 shadow-xl shadow-gray-900/15 backdrop-blur-md lg:max-w-2xl lg:flex-row lg:items-stretch lg:gap-3 lg:p-2">
        <CTAButton href={bookHref} variant="primary" trackAs="book_now_click" trackSource={bookSource} className="lg:min-w-[9.5rem] lg:flex-1">
          Book now
        </CTAButton>
        {whatsappHref ? (
          <CTAButton
            href={whatsappHref}
            variant="whatsapp"
            trackAs="whatsapp_click"
            trackSource={waSource}
            className="lg:min-w-[10rem] lg:flex-1"
          >
            <span className="flex items-center justify-center gap-2">
              <MessageCircle className="h-5 w-5 shrink-0" aria-hidden />
              WhatsApp
            </span>
          </CTAButton>
        ) : null}
        <CTAButton
          href={contactHref}
          variant="secondary"
          trackAs="cta_click"
          trackSource={contactSource}
          className="text-sm lg:min-w-[10rem] lg:flex-1"
        >
          Talk to an expert
        </CTAButton>
      </div>
    </div>
  );
}
