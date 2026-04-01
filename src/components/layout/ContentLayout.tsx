'use client';

import { ReactNode } from 'react';
import { Header, Footer, PageWrapper } from '@/components/landing';
import BreadcrumbsBar from '@/components/seo/BreadcrumbsBar';
import type { BreadcrumbNavItem } from '@/lib/breadcrumbsNav';

export type { BreadcrumbNavItem };

/**
 * Shared layout for content pages (About, Careers, Blog, Services, Privacy, Terms).
 * Provides consistent header and footer with LiftnGo theme.
 */
export default function ContentLayout({
  children,
  breadcrumbs,
  breadcrumbNavVisible = true,
}: {
  children: ReactNode;
  breadcrumbs?: BreadcrumbNavItem[];
  /** When false, only breadcrumb JSON-LD is emitted (hero may show the trail). */
  breadcrumbNavVisible?: boolean;
}) {
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
