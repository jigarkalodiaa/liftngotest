import { notFound } from 'next/navigation';
import ContentLayout from '@/components/layout/ContentLayout';
import { getRestaurantById } from '@/data/restaurantsKhatushyam';
import RestaurantMenuContent from '../RestaurantMenuContent';

type Props = { params: Promise<{ id: string }> };

export default async function RestaurantMenuPage({ params }: Props) {
  const { id } = await params;
  const restaurant = getRestaurantById(id);
  if (!restaurant) notFound();
  return (
    <ContentLayout>
      <RestaurantMenuContent restaurant={restaurant} />
    </ContentLayout>
  );
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const restaurant = getRestaurantById(id);
  if (!restaurant) return { title: 'Restaurant not found' };
  return { title: `${restaurant.name} – Menu | Find Restaurant | LiftnGo` };
}
