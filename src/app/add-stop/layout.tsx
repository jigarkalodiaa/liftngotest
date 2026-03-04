import type { Metadata } from 'next';
import { SITE_NAME } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Add stop',
  description: `Add an intermediate stop to your ${SITE_NAME} trip.`,
  robots: { index: false, follow: true },
};

export default function AddStopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
