import { generatePageMetadata } from '@/lib/seo';
import KhatuTravelPage from '@/features/khatu/travel/KhatuTravelPage';
import BreadcrumbsBar from '@/components/seo/BreadcrumbsBar';
import { BREADCRUMB_HOME } from '@/lib/breadcrumbsNav';

export const metadata = generatePageMetadata({
  title: 'Book rides: Khatu · Salasar · Ringus | Liftngo',
  description:
    'Book Liftngo hatchbacks, sedans & SUVs for Khatu–Salasar–Ringus routes. Upfront fare estimates for temple travellers.',
  path: '/khatu/travel',
  keywords: ['khatu to salasar cab', 'ringas to khatu taxi', 'khatu travel booking', 'liftngo rides'],
});

export default function Page() {
  return (
    <>
      <BreadcrumbsBar items={[BREADCRUMB_HOME, { name: 'Khatu travel', path: '/khatu/travel' }]} />
      <KhatuTravelPage />
    </>
  );
}
