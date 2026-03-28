import { generatePageMetadata } from '@/lib/seo';
import MarketplaceLanding from '@/features/khatu/marketplace/MarketplaceLanding';

export const metadata = generatePageMetadata({
  title: 'Khatu marketplace — prasad & religious shops | Liftngo',
  description:
    'Liftngo-verified shops for prasad, pūjā supplies, and temple-town offerings. Browse vendors, build a cart, and checkout for rider delivery.',
  path: '/khatu/marketplace',
  keywords: ['khatu prasad', 'khatu shops', 'mandir offerings', 'liftngo marketplace khatu'],
});

export default function Page() {
  return <MarketplaceLanding />;
}
