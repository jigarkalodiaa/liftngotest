import { generatePageMetadata } from '@/lib/seo';
import { SITE_NAME } from '@/lib/site';

export const metadata = generatePageMetadata({
  title: `My details | ${SITE_NAME}`,
  description: `View and update your profile on ${SITE_NAME}.`,
  path: '/my-details',
  keywords: ['profile', 'my details', 'account'],
});

export default function MyDetailsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
