export interface CoconutProduct {
  id: string;
  name: string;
  shortDescription: string;
  priceInr: number;
  image: string;
  /** Visual emoji(s) shown on the card — use multiple coconuts for packs. */
  visual: string;
  popular?: boolean;
  combo?: boolean;
  tag?: string;
}

export const COCONUT_PRODUCTS: CoconutProduct[] = [
  {
    id: 'nariyal-pani',
    name: 'Nariyal Pani',
    shortDescription: 'Fresh green tender coconut with straw — naturally sweet and hydrating.',
    priceInr: 79,
    image: '/images/coconut/nariyal-pani.png',
    visual: '🌴',
    popular: true,
    tag: 'FREE DELIVERY',
  },
  {
    id: 'nariyal-pani-combo-4',
    name: 'Nariyal Pani × 4',
    shortDescription: '4 fresh green coconuts with straw — perfect for family or office. Best value!',
    priceInr: 299,
    image: '/images/coconut/nariyal-pani.png',
    visual: '🌴🌴🌴🌴',
    combo: true,
    tag: 'BEST VALUE',
  },
];

export const COCONUT_VENDOR = {
  id: 'noida-coconut-sector53',
  name: 'Kanchanjunga Fresh Nariyal',
  area: 'Sector 53, Noida',
  pickupAddress: 'Near Kanchanjunga Market, Sector 53, Noida',
  deliveryFlatInr: 0, // Free delivery
  handlingChargeInr: 2.5,
  platformFeeInr: 2.5,
  estimatedMinutes: '15–25',
};
