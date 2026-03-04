import type { Metadata } from 'next';
import { SITE_NAME } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Payment',
  description: `Confirm your booking and payment details on ${SITE_NAME}.`,
  robots: { index: false, follow: true },
};

export default function PaymentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
