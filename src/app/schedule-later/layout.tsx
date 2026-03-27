import { generatePageMetadata } from '@/lib/seo';
import { SITE_NAME } from '@/lib/site';

export const metadata = generatePageMetadata({
  title: `Schedule later | ${SITE_NAME}`,
  description: `Pick a future date and time for your ${SITE_NAME} goods delivery booking.`,
  path: '/schedule-later',
  noIndex: true,
  useAbsoluteTitle: true,
});

export default function ScheduleLaterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
