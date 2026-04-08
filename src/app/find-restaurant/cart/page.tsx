import { generatePageMetadata } from '@/lib/seo';
import { SITE_NAME } from '@/lib/site';
import ContentLayout from '@/components/layout/ContentLayout';
import { BREADCRUMB_HOME, BREADCRUMB_FIND_RESTAURANT } from '@/lib/breadcrumbsNav';
import FoodMenuCartClient from './FoodMenuCartClient';

export const metadata = generatePageMetadata({
  title: `Cart | Food | ${SITE_NAME}`,
  description: 'Review your food order, see price details, and pay securely with Razorpay before booking delivery.',
  path: '/find-restaurant/cart',
});

export default function FoodMenuCartPage() {
  return (
    <ContentLayout
      variant="app"
      breadcrumbs={[BREADCRUMB_HOME, BREADCRUMB_FIND_RESTAURANT, { name: 'Cart', path: '/find-restaurant/cart' }]}
    >
      <FoodMenuCartClient />
    </ContentLayout>
  );
}
