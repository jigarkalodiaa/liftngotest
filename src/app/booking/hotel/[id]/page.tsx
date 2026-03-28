import { notFound } from 'next/navigation';
import { generatePageMetadata } from '@/lib/seo';
import { KHATU_HOTELS } from '@/data/khatuHotels';
import BookHotelClient from '@/features/khatu/hotels/BookHotelClient';
import { SITE_NAME } from '@/lib/site';

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const hotel = KHATU_HOTELS.find((h) => h.id === id && h.liftngoVerified);
  if (!hotel) {
    return generatePageMetadata({
      title: `Stay | ${SITE_NAME}`,
      description: 'Book Liftngo-verified stays in Khatu.',
      path: `/booking/hotel/${id}`,
      noIndex: true,
      useAbsoluteTitle: true,
    });
  }
  return generatePageMetadata({
    title: `Book ${hotel.name} | ${SITE_NAME}`,
    description: `Liftngo-verified stay ~${hotel.distanceKmFromTemple.toFixed(1)} km from Khatu Mandir. From ₹${hotel.pricePerNight}/night.`,
    path: `/booking/hotel/${id}`,
    noIndex: true,
    useAbsoluteTitle: true,
  });
}

export default async function BookingHotelPage({ params }: PageProps) {
  const { id } = await params;
  const hotel = KHATU_HOTELS.find((h) => h.id === id && h.liftngoVerified);
  if (!hotel) notFound();
  return <BookHotelClient hotel={hotel} />;
}
