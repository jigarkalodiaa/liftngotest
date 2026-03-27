import { generatePageMetadata } from '@/lib/seo';
import { SITE_NAME } from '@/lib/site';

export const metadata = generatePageMetadata({
  title: `Add stop | ${SITE_NAME}`,
  description: `Add an intermediate stop to your ${SITE_NAME} trip.`,
  path: '/add-stop',
  noIndex: true,
  useAbsoluteTitle: true,
});

export default function AddStopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
