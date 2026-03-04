import type { Metadata } from 'next';
import { SITE_NAME } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Finding driver',
  description: `Your ${SITE_NAME} booking is being confirmed.`,
  robots: { index: false, follow: true },
};

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
