import { generatePageMetadata } from '@/lib/seo';
import KhatuGuidePage from '@/features/khatu/guide/KhatuGuidePage';
import BreadcrumbsBar from '@/components/seo/BreadcrumbsBar';
import { BREADCRUMB_HOME } from '@/lib/breadcrumbsNav';

export const metadata = generatePageMetadata({
  title: 'Khatu Shyam Ji travel guide | Liftngo',
  description:
    'Temple history, best time to visit, how to reach via Ringus, peak rush timings, parking & stay tips for Khatu Shyam Ji.',
  path: '/khatu/guide',
  keywords: ['khatu shyam ji guide', 'khatu darshan timings', 'ringas to khatu', 'khatu travel tips'],
});

export default function Page() {
  return (
    <>
      <BreadcrumbsBar items={[BREADCRUMB_HOME, { name: 'Khatu guide', path: '/khatu/guide' }]} />
      <KhatuGuidePage />
    </>
  );
}
