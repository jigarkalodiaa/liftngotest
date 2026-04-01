import { generatePageMetadata } from '@/lib/seo';
import { SITE_NAME } from '@/lib/site';

export const metadata = generatePageMetadata({
  title: `Ride request received | ${SITE_NAME}`,
  description: 'Your Khatu corridor ride quote is saved. Complete pickup details next.',
  path: '/booking/ride',
  noIndex: true,
  nofollow: true,
  useAbsoluteTitle: true,
});

export default function BookingRideLayout({ children }: { children: React.ReactNode }) {
  return children;
}
