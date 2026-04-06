import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';
import { SITE_NAME } from '@/lib/site';

const PATH = '/noida/coconut/checkout';

/** Checkout is transactional — do not inherit marketing canonical from `/noida/coconut`. */
export const metadata: Metadata = generatePageMetadata({
  title: `Coconut checkout | ${SITE_NAME}`,
  description: 'Complete your fresh coconut water order for delivery in Noida.',
  path: PATH,
  noIndex: true,
  nofollow: true,
  useAbsoluteTitle: true,
});

export default function CoconutCheckoutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
