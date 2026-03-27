import { generatePageMetadata } from '@/lib/seo';
import { SITE_NAME } from '@/lib/site';

export const metadata = generatePageMetadata({
  title: `Trip complete | ${SITE_NAME}`,
  description: `Complete payment and rate your driver on ${SITE_NAME}.`,
  path: '/trip-complete',
  noIndex: true,
  useAbsoluteTitle: true,
});

export default function TripCompleteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
