import type { KhatuNearbyPlace } from '@/types/khatu';
import { indiaPhotoBangaloreLoadedTruck } from '@/config/indiaLogisticsImages';

export const KHATU_NEARBY_PLACES: KhatuNearbyPlace[] = [
  {
    id: 'jeen-mata',
    name: 'Jeen Mata Mandir',
    distanceFromKhatuKm: 18,
    shortDescription: 'Historic Śākta shrine in the Aravalli foothills — many combine darshan with Khatu & Salasar.',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80',
  },
  {
    id: 'salasar-balaji',
    name: 'Salasar Balaji',
    distanceFromKhatuKm: 28,
    shortDescription: 'Major Hanuman pilgrimage — coordinate cab timing with mela rush & highway traffic.',
    image: 'https://images.unsplash.com/photo-1565008576549-57569a49371d?w=800&q=80',
  },
  {
    id: 'ringas-junction',
    name: 'Ringas (rail & corridor)',
    distanceFromKhatuKm: 18,
    shortDescription: 'Primary railhead for Khatu — pre-book pickup for elders & heavy luggage.',
    image: indiaPhotoBangaloreLoadedTruck(800),
  },
];
