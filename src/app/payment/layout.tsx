import { generatePageMetadata } from '@/lib/seo';
import { SITE_NAME } from '@/lib/site';

export const metadata = generatePageMetadata({
  title: `Payment | ${SITE_NAME}`,
  description: `Confirm your booking and payment details on ${SITE_NAME}.`,
  path: '/payment',
  noIndex: true,
  nofollow: true,
  useAbsoluteTitle: true,
});

export default function PaymentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
