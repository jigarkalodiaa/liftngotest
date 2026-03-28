import { generatePageMetadata } from '@/lib/seo';
import KhatuGuidePage from '@/features/khatu/guide/KhatuGuidePage';

export const metadata = generatePageMetadata({
  title: 'Khatu Shyam Ji travel guide | Liftngo',
  description:
    'Temple history, best time to visit, how to reach via Ringus, peak rush timings, parking & stay tips for Khatu Shyam Ji.',
  path: '/khatu/guide',
  keywords: ['khatu shyam ji guide', 'khatu darshan timings', 'ringas to khatu', 'khatu travel tips'],
});

export default function Page() {
  return <KhatuGuidePage />;
}
