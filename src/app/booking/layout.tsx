import { generatePageMetadata } from '@/lib/seo';
import { SITE_NAME } from '@/lib/site';

export const metadata = generatePageMetadata({
  title: `Finding driver | ${SITE_NAME}`,
  description: `Your ${SITE_NAME} booking is being confirmed.`,
  path: '/booking',
  noIndex: true,
  nofollow: true,
  useAbsoluteTitle: true,
});

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
