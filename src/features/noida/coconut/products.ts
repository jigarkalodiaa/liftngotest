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
    id: 'tender-coconut',
    name: 'Nariyal Pani',
    shortDescription: 'Fresh green tender coconut with straw — chilled, naturally sweet, and hydrating.',
    priceInr: 60,
    image: '/images/coconut/tender.png',
    visual: '🌴🥥🧊',
    popular: true,
  },
  {
    id: 'malai-coconut',
    name: 'Malai Nariyal',
    shortDescription: 'Tender coconut with thick creamy malai scooped out — served with a spoon.',
    priceInr: 80,
    image: '/images/coconut/malai.png',
    visual: '🥥🍨',
    popular: true,
  },
  {
    id: 'coconut-milkshake',
    name: 'Coconut Milkshake',
    shortDescription: 'Blended coconut water with malai, ice, and a hint of rose. 300 ml glass.',
    priceInr: 100,
    image: '/images/coconut/milkshake.png',
    visual: '🥥🥤',
  },
  {
    id: 'dry-coconut',
    name: 'Dry Coconut (Copra)',
    shortDescription: 'Premium dried coconut — 250 g pack for cooking or direct snacking.',
    priceInr: 90,
    image: '/images/coconut/dry.png',
    visual: '🥥',
  },
  {
    id: 'coconut-chunks',
    name: 'Fresh Coconut Chunks',
    shortDescription: 'Ready-to-eat white coconut meat, diced and chilled. 200 g cup.',
    priceInr: 70,
    image: '/images/coconut/chunks.png',
    visual: '🥥🥣',
  },
  {
    id: 'nariyal-pani-pack-3',
    name: 'Nariyal Pani × 3',
    shortDescription: '3 fresh green coconuts with straw — perfect for the office or family. Save ₹30.',
    priceInr: 150,
    image: '/images/coconut/pack3.png',
    visual: '🥥🥥🥥',
    combo: true,
    tag: 'SAVE ₹30',
  },
  {
    id: 'malai-combo-2',
    name: 'Malai Nariyal × 2',
    shortDescription: '2 malai coconuts for sharing — creamy and refreshing. Save ₹20.',
    priceInr: 140,
    image: '/images/coconut/malai-combo.png',
    visual: '🥥🥥',
    combo: true,
    tag: 'SAVE ₹20',
  },
  {
    id: 'office-hydration-5',
    name: 'Nariyal Pani × 5',
    shortDescription: '5 fresh green coconuts with straw — delivered to your office desk. Save ₹50.',
    priceInr: 250,
    image: '/images/coconut/office5.png',
    visual: '🥥🥥🥥🥥🥥',
    combo: true,
    tag: 'BEST VALUE',
  },
];

export const COCONUT_VENDOR = {
  id: 'noida-coconut-sector53',
  name: 'Fresh Coconut Water',
  area: 'Sector 53, Noida',
  pickupAddress: 'Near Kanchanjunga Market, Sector 53, Noida',
  deliveryFlatInr: 29,
  estimatedMinutes: '15–25',
};
