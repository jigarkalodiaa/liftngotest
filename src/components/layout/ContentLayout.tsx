'use client';

import { ReactNode } from 'react';
import { Header, Footer, PageWrapper } from '@/components/landing';

/**
 * Shared layout for content pages (About, Careers, Blog, Services, Privacy, Terms).
 * Provides consistent header and footer with LiftnGo theme.
 */
export default function ContentLayout({ children }: { children: ReactNode }) {
  return (
    <PageWrapper headerSlot={<Header />}>
      <div className="min-h-screen flex flex-col bg-[var(--landing-bg)]">
        {children}
        <Footer />
      </div>
    </PageWrapper>
  );
}
