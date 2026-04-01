import { generatePageMetadata } from '@/lib/seo';
import { SITE_NAME } from '@/lib/site';

export const metadata = generatePageMetadata({
  title: `History | ${SITE_NAME}`,
  description: `Your ride history on ${SITE_NAME}.`,
  path: '/history',
  noIndex: true,
  nofollow: true,
  useAbsoluteTitle: true,
});

export default function HistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
