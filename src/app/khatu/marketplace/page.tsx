import { generatePageMetadata } from '@/lib/seo';
import MarketplaceLanding from '@/features/khatu/marketplace/MarketplaceLanding';
import BreadcrumbsBar from '@/components/seo/BreadcrumbsBar';
import { BREADCRUMB_HOME } from '@/lib/breadcrumbsNav';

export const metadata = generatePageMetadata({
  title: 'Khatu marketplace — prasad & religious shops | Liftngo',
  description:
    'Liftngo-verified shops for prasad, pūjā supplies, and temple-town offerings. Browse vendors, build a cart, and checkout for rider delivery.',
  path: '/khatu/marketplace',
  keywords: ['khatu prasad', 'khatu shops', 'mandir offerings', 'liftngo marketplace khatu'],
});

export default function Page() {
  return (
    <>
      <BreadcrumbsBar
        items={[BREADCRUMB_HOME, { name: 'Khatu marketplace', path: '/khatu/marketplace' }]}
      />
      <MarketplaceLanding />
    </>
  );
}
