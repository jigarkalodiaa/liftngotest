import type { Metadata } from 'next';
import { SITE_NAME } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Trip options',
  description: `Choose vehicle and service for your ${SITE_NAME} trip.`,
  robots: { index: false, follow: true },
};

export default function TripOptionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
