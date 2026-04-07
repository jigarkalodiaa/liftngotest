import { generatePageMetadata } from '@/lib/seo';
import { SITE_NAME } from '@/lib/site';

export const metadata = generatePageMetadata({
  title: `Payment status | ${SITE_NAME}`,
  description: `Payment confirmation or status for your Liftngo order or plan.`,
  path: '/payment/result',
  noIndex: true,
  nofollow: true,
  useAbsoluteTitle: true,
});

export default function PaymentResultLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
