import { generatePageMetadata } from '@/lib/seo';
import { SITE_NAME } from '@/lib/site';

export const metadata = generatePageMetadata({
  title: `Marketplace checkout | ${SITE_NAME}`,
  description: 'Complete your Khatu marketplace order for Liftngo delivery.',
  path: '/khatu/marketplace/checkout',
  noIndex: true,
  nofollow: true,
  useAbsoluteTitle: true,
});

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
