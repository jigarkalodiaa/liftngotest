import { generatePageMetadata } from '@/lib/seo';
import { SITE_NAME } from '@/lib/site';

export const metadata = generatePageMetadata({
  title: `Trip options | ${SITE_NAME}`,
  description: `Choose vehicle and service for your ${SITE_NAME} trip.`,
  path: '/trip-options',
  noIndex: true,
  useAbsoluteTitle: true,
});

export default function TripOptionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
