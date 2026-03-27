import { generatePageMetadata } from '@/lib/seo';
import { SITE_NAME } from '@/lib/site';

export const metadata = generatePageMetadata({
  title: `Pickup & drop details | ${SITE_NAME}`,
  description: `Enter pickup and drop location and contact details for your ${SITE_NAME} booking.`,
  path: '/pickup-location',
  noIndex: true,
  useAbsoluteTitle: true,
});

export default function PickupLocationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
