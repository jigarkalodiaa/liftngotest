import type { Metadata } from 'next';
import { SITE_NAME } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Trip complete',
  description: `Complete payment and rate your driver on ${SITE_NAME}.`,
  robots: { index: false, follow: true },
};

export default function TripCompleteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
