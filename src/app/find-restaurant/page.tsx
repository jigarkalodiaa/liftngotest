import { generatePageMetadata } from '@/lib/seo';
import { SITE_NAME } from '@/lib/site';
import FindRestaurantClient from './FindRestaurantClient';

export const metadata = generatePageMetadata({
  title: `Food Delivery Khatu Shyam Ji | Restaurants & Menu | ${SITE_NAME}`,
  description: `Order food from partner restaurants in Khatu Shyam Ji. Liftngo delivers from local kitchens to your doorstep—fast pickup near the temple.`,
  path: '/find-restaurant',
  keywords: [
    'Khatu Shyam Ji food delivery',
    'Khatushyam Ji restaurants',
    'veg restaurant Khatu',
    'temple area delivery',
    'Liftngo food',
  ],
});

export default function FindRestaurantPage() {
  return <FindRestaurantClient />;
}
