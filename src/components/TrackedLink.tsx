'use client';

import Link from 'next/link';
import type { ComponentProps } from 'react';
import { trackBookNowClick, trackWhatsAppClick, trackEvent, type AnalyticsEventName } from '@/lib/analytics';

type Props = Omit<ComponentProps<typeof Link>, 'onClick'> & {
  trackAs?: AnalyticsEventName;
  trackSource?: string;
  onClick?: ComponentProps<typeof Link>['onClick'];
};

export default function TrackedLink({ trackAs, trackSource = 'unknown', onClick, href, ...rest }: Props) {
  return (
    <Link
      href={href}
      {...rest}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        if (trackAs === 'book_now_click') trackBookNowClick(trackSource);
        else if (trackAs === 'whatsapp_click') trackWhatsAppClick(trackSource);
        else if (trackAs) trackEvent(trackAs, { source: trackSource });
      }}
    />
  );
}
