import { notFound } from 'next/navigation';
import ContentLayout from '@/components/layout/ContentLayout';
import { getRestaurantById } from '@/data/restaurantsKhatushyam';
import { generatePageMetadata } from '@/lib/seo';
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
  return generatePageMetadata({
    /** No trailing brand — layout template adds `| Liftngo` once (avoids "| LiftnGo | Liftngo"). */
    title: `${restaurant.name} – Menu & food delivery | Khatu Shyam Ji`,
    description: `${desc} Order on Liftngo and book rider delivery to your door.`,
    path: `/find-restaurant/${id}`,
    keywords: ['Khatu Shyam Ji food', restaurant.name.toLowerCase(), 'restaurant menu khatu', 'liftngo food'],
  });
}
