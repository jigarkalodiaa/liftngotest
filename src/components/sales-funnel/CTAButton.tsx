'use client';

import TrackedLink from '@/components/TrackedLink';
import type { ComponentProps } from 'react';

type Variant = 'primary' | 'accent' | 'secondary' | 'whatsapp';

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  trackAs?: ComponentProps<typeof TrackedLink>['trackAs'];
  trackSource?: string;
  className?: string;
};

const base =
  'funnel-cta-press inline-flex min-h-11 items-center justify-center rounded-xl px-5 py-3 text-sm font-bold shadow-sm sm:min-h-12 sm:px-6 sm:text-base';

const variants: Record<Variant, string> = {
  primary: `${base} bg-[var(--color-primary)] text-white hover:opacity-[0.92]`,
  accent: `${base} bg-[var(--funnel-action)] text-white hover:bg-[var(--funnel-action-hover)]`,
  secondary: `${base} border-2 border-gray-300 bg-white text-gray-900 hover:bg-gray-50`,
  whatsapp: `${base} bg-[var(--whatsapp-green)] text-white hover:opacity-95`,
};

export default function CTAButton({
  href,
  children,
  variant = 'primary',
  trackAs = 'cta_click',
  trackSource = 'funnel',
  className = '',
}: Props) {
  return (
    <TrackedLink href={href} trackAs={trackAs} trackSource={trackSource} className={`${variants[variant]} ${className}`}>
      {children}
    </TrackedLink>
  );
}
