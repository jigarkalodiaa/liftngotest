import { generatePageMetadata } from '@/lib/seo';
import KhatuHotelsPage from '@/features/khatu/hotels/KhatuHotelsPage';
import BreadcrumbsBar from '@/components/seo/BreadcrumbsBar';
import { BREADCRUMB_HOME } from '@/lib/breadcrumbsNav';

export const metadata = generatePageMetadata({
  title: 'Trusted hotels near Khatu Shyam Ji | Liftngo',
  description:
    'Liftngo-verified hotels and guest houses. Filter by temple distance, price, parking, and AC — then view full details before you book.',
  path: '/khatu/hotels',
  keywords: [
    'khatu shyam ji hotel booking',
    'dharamshala khatu',
    'stay near khatu mandir',
    'liftngo khatu',
  ],
});

export default function Page() {
  return (
    <>
      <BreadcrumbsBar
        items={[BREADCRUMB_HOME, { name: 'Hotels near Khatu Shyam Ji', path: '/khatu/hotels' }]}
      />
      <KhatuHotelsPage />
    </>
  );
}
