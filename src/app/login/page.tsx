import { Suspense } from 'react';
import ContentLayout from '@/components/layout/ContentLayout';
import LoginPageClient from './LoginPageClient';
import { SITE_NAME } from '@/lib/site';
import { generatePageMetadata } from '@/lib/seo';
import { BREADCRUMB_HOME } from '@/lib/breadcrumbsNav';

export const metadata = generatePageMetadata({
  title: `Login | ${SITE_NAME}`,
  description: 'Sign in to Liftngo to continue your delivery booking.',
  path: '/login',
  noIndex: true,
  nofollow: true,
  useAbsoluteTitle: true,
});

export default function LoginPage() {
  return (
    <ContentLayout breadcrumbs={[BREADCRUMB_HOME, { name: 'Login', path: '/login' }]}>
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
