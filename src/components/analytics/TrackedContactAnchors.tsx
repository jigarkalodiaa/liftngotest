'use client';

import type { ComponentProps, ReactNode } from 'react';
import { trackEmailClick, trackOutboundClick, trackTelClick } from '@/lib/analytics';

export function TrackedTelAnchor({
  href,
  analyticsSource,
  className,
  children,
  ...rest
}: Omit<ComponentProps<'a'>, 'href' | 'onClick'> & {
  href: string;
  analyticsSource: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      className={className}
      onClick={() => trackTelClick(analyticsSource)}
      {...rest}
    >
      {children}
    </a>
  );
}

export function TrackedMailtoAnchor({
  href,
  analyticsSource,
  className,
  children,
  ...rest
}: Omit<ComponentProps<'a'>, 'href' | 'onClick'> & {
  href: string;
  analyticsSource: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      className={className}
      onClick={() => trackEmailClick(analyticsSource)}
      {...rest}
    >
      {children}
    </a>
  );
}

export function TrackedOutboundAnchor({
  href,
  label,
  analyticsSource,
  className,
  children,
  ...rest
}: Omit<ComponentProps<'a'>, 'href' | 'onClick'> & {
  href: string;
  label: string;
  analyticsSource: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackOutboundClick(href, label, analyticsSource)}
      {...rest}
    >
      {children}
    </a>
  );
}
