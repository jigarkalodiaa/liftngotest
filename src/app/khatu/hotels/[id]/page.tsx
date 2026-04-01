import { notFound } from 'next/navigation';
import { generatePageMetadata } from '@/lib/seo';
import { KHATU_HOTELS } from '@/data/khatuHotels';
import KhatuHotelDetailPage from '@/features/khatu/hotels/KhatuHotelDetailPage';
import { SITE_NAME } from '@/lib/site';
import BreadcrumbsBar from '@/components/seo/BreadcrumbsBar';
import { BREADCRUMB_HOME } from '@/lib/breadcrumbsNav';

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const hotel = KHATU_HOTELS.find((h) => h.id === id && h.liftngoVerified);
  if (!hotel) {
    return generatePageMetadata({
      title: `Stay | ${SITE_NAME}`,
      description: 'Verified hotels near Khatu Shyam Ji.',
      path: `/khatu/hotels/${id}`,
    });
  }
  return generatePageMetadata({
    title: `${hotel.name} | Khatu · ${SITE_NAME}`,
    description: `Verified stay ~${hotel.distanceKmFromTemple.toFixed(1)} km from Khatu Temple. From ₹${hotel.pricePerNight}/night.`,
    path: `/khatu/hotels/${id}`,
    keywords: ['khatu hotel', 'stay near khatu mandir', 'liftngo verified hotel'],
  });
}

export default async function KhatuHotelDetailRoute({ params }: PageProps) {
  const { id } = await params;
  const hotel = KHATU_HOTELS.find((h) => h.id === id && h.liftngoVerified);
  if (!hotel) notFound();
  return (
    <>
      <BreadcrumbsBar
        items={[
          BREADCRUMB_HOME,
          { name: 'Hotels near Khatu Shyam Ji', path: '/khatu/hotels' },
          { name: hotel.name, path: `/khatu/hotels/${id}` },
        ]}
      />
      <KhatuHotelDetailPage hotel={hotel} />
    </>
  );
}
