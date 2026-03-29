import type { KhatuHotel } from '@/types/khatu';

function availabilityLabel(a: KhatuHotel['availability']): string {
  switch (a) {
    case 'available':
      return 'Available';
    case 'few':
      return 'Limited rooms';
    case 'full':
      return 'Sold out (request only)';
    default:
      return String(a);
  }
}

export function buildHotelOwnerWhatsAppMessage(
  hotel: KhatuHotel,
  params: {
    checkIn: string;
    checkOut: string;
    guests: number;
    note: string;
    nights: number;
    estimatedTotalInr: number;
  }
): string {
  const lines = [
    `*Liftngo hotel booking request*`,
    `Property: *${hotel.name}*`,
    `Hotel ID: \`${hotel.id}\``,
    '————————————',
    `*Location & distance*`,
    `${hotel.addressLine}`,
    `${hotel.distanceKmFromTemple.toFixed(1)} km from Khatu Mandir`,
    '————————————',
    `*Property details*`,
    `Liftngo verified: ${hotel.liftngoVerified ? 'Yes' : 'No'}`,
    `Room availability (indicative): ${availabilityLabel(hotel.availability)}`,
    `Parking: ${hotel.parking ? 'Yes' : 'No'}`,
    `AC: ${hotel.ac ? 'Yes' : 'No'}`,
    `Family rooms: ${hotel.familyRooms ? 'Yes' : 'No'}`,
    hotel.rating != null ? `Guest rating: ${hotel.rating.toFixed(1)} / 5` : `Guest rating: —`,
    `Listed price: ₹${hotel.pricePerNight} / night`,
    '————————————',
    `*Guest request*`,
    `Check-in: ${params.checkIn}`,
    `Check-out: ${params.checkOut}`,
    `Nights: ${params.nights}`,
    `Guests: ${params.guests}`,
    `Estimated stay total: *₹${params.estimatedTotalInr.toLocaleString('en-IN')}* (${params.nights} × ₹${hotel.pricePerNight})`,
    params.note.trim() ? `Notes: ${params.note.trim()}` : `Notes: —`,
    '————————————',
    `Please confirm room type, final tariff, and payment. Thank you!`,
  ];
  return lines.join('\n');
}

export function hotelOwnerWhatsAppHref(phoneDigits: string, message: string): string | null {
  const digits = phoneDigits.replace(/\D/g, '');
  if (!digits || !message.trim()) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
