'use client';

import { ReactNode } from 'react';
import { Header, Footer, PageWrapper } from '@/components/landing';
import BreadcrumbsBar from '@/components/seo/BreadcrumbsBar';
import type { BreadcrumbNavItem } from '@/lib/breadcrumbsNav';

export type { BreadcrumbNavItem };

/**
 * Shared layout for content pages (About, Careers, Blog, Services, Privacy, Terms).
 * Provides consistent header and footer with LiftnGo theme.
 *
 * `variant="app"` — no marketing header/footer; JSON-LD breadcrumbs only (food listing, etc.).
 */
export default function ContentLayout({
  children,
  breadcrumbs,
  breadcrumbNavVisible = true,
  variant = 'marketing',
}: {
  children: ReactNode;
  breadcrumbs?: BreadcrumbNavItem[];
  /** When false, only breadcrumb JSON-LD is emitted (hero may show the trail). */
  breadcrumbNavVisible?: boolean;
  variant?: 'marketing' | 'app';
}) {
  if (variant === 'app') {
    return (
      <PageWrapper>
        <div className="flex min-h-[100dvh] min-h-screen flex-col bg-neutral-50">
          {breadcrumbs?.length ? <BreadcrumbsBar items={breadcrumbs} showNav={false} /> : null}
          {children}
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper headerSlot={<Header />}>
      <div className="flex min-h-[100dvh] min-h-screen flex-col bg-[var(--landing-bg)]">
        {breadcrumbs?.length ? (
          <BreadcrumbsBar items={breadcrumbs} showNav={breadcrumbNavVisible} />
        ) : null}
        {children}
        <Footer />
      </div>
    </PageWrapper>
  );
}
