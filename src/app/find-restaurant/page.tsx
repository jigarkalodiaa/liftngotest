import { generatePageMetadata } from '@/lib/seo';
import { SITE_NAME } from '@/lib/site';
import FindRestaurantClient from './FindRestaurantClient';

export const metadata = generatePageMetadata({
  title: `Find Restaurant | Khatushyam Ji | ${SITE_NAME}`,
  description: `Find restaurants in Khatushyam Ji. View menus and order food from local vegetarian restaurants near Khatushyam Ji temple.`,
  path: '/find-restaurant',
  keywords: ['Khatushyam Ji restaurants', 'food near Khatushyam Ji', 'veg restaurant Khatushyam', 'Khatushyam Ji menu'],
});

export default function FindRestaurantPage() {
  return <FindRestaurantClient />;
}
