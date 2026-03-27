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
  const desc =
    restaurant.description.length > 155 ? `${restaurant.description.slice(0, 152)}…` : restaurant.description;
  return {
    title: `${restaurant.name} – Menu & order | Food delivery Khatu Shyam Ji | LiftnGo`,
    description: `${desc} Order on LiftnGo and book delivery to your door.`,
  };
}
