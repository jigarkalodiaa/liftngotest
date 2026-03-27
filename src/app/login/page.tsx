import { Suspense } from 'react';
import type { Metadata } from 'next';
import ContentLayout from '@/components/layout/ContentLayout';
import LoginPageClient from './LoginPageClient';
import { SITE_NAME } from '@/lib/site';

export const metadata: Metadata = {
  title: `Login | ${SITE_NAME}`,
  description: 'Sign in to Liftngo to continue your delivery booking.',
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <ContentLayout>
      <Suspense
        fallback={
          <div className="flex min-h-[50vh] items-center justify-center text-gray-600 text-sm">Loading…</div>
        }
      >
        <LoginPageClient />
      </Suspense>
    </ContentLayout>
  );
}
