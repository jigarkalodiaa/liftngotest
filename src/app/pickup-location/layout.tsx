import type { Metadata } from 'next';
import { SITE_NAME } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Pickup & drop details',
  description: `Enter pickup and drop location and contact details for your ${SITE_NAME} booking.`,
  robots: { index: false, follow: true },
};

export default function PickupLocationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
