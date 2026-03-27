import { generatePageMetadata } from '@/lib/seo';
import { SITE_NAME } from '@/lib/site';

export const metadata = generatePageMetadata({
  title: `Dashboard | ${SITE_NAME}`,
  description: `Book goods transport, food delivery, and manage your trips on ${SITE_NAME}.`,
  path: '/dashboard',
  noIndex: true,
  useAbsoluteTitle: true,
});

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
