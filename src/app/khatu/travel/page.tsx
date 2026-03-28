import { generatePageMetadata } from '@/lib/seo';
import KhatuTravelPage from '@/features/khatu/travel/KhatuTravelPage';

export const metadata = generatePageMetadata({
  title: 'Book rides: Khatu · Salasar · Ringus | Liftngo',
  description:
    'Book Liftngo hatchbacks, sedans & SUVs for Khatu–Salasar–Ringus routes. Upfront fare estimates for temple travellers.',
  path: '/khatu/travel',
  keywords: ['khatu to salasar cab', 'ringas to khatu taxi', 'khatu travel booking', 'liftngo rides'],
});

export default function Page() {
  return <KhatuTravelPage />;
}
