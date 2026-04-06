import type { KhatuShop, KhatuShopProduct } from '@/types/khatu';
import {
  indiaPhotoFoodTable,
  indiaPhotoFreightBoxes,
  indiaPhotoRetailMarketGoods,
} from '@/config/indiaLogisticsImages';

/** Verified CDN URLs — legacy Unsplash hotlinks were removed upstream (404 in Semrush). */
const shopBannerAlt = indiaPhotoRetailMarketGoods(1200);

export const KHATU_SHOPS: KhatuShop[] = [
  {
    id: 'shyam-prasad-house',
    name: 'Shyam Prasad House',
    bannerImage: 'https://images.unsplash.com/photo-1587330979470-3595ac045ab0?w=1200&q=80',
    description: 'Prasad, ladoos & traditional offerings sourced for darshan. Counter checked by Liftngo partners.',
    distanceKm: 0.35,
    liftngoVerified: true,
    popular: true,
    rating: 4.7,
    merchantWhatsApp: '918588808581',
    pickupAddressLine: 'Shyam Prasad House — near Khatu Shyam Ji mandir main bazaar (Liftngo pickup point)',
  },
  {
    id: 'mandir-sacred-store',
    name: 'Mandir Sacred Store',
    bannerImage: shopBannerAlt,
    description: 'Malas, cholas & pūjā supplies for Khatu Shyam Ji. Straightforward pricing, verified shelf.',
    distanceKm: 0.45,
    liftngoVerified: true,
    rating: 4.5,
    merchantWhatsApp: '918588808581',
    pickupAddressLine: 'Mandir Sacred Store — Khatu Shyam Ji temple lane (Liftngo pickup)',
  },
  {
    id: 'khatu-devotion-bazaar',
    name: 'Khatu Devotion Bazaar',
    bannerImage: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=1200&q=80',
    description: 'Ittar, textiles & temple-town keepsakes — curated for travellers completing the corridor.',
    distanceKm: 0.85,
    liftngoVerified: true,
    popular: true,
    rating: 4.4,
    merchantWhatsApp: '918588808581',
    pickupAddressLine: 'Khatu Devotion Bazaar — corridor market, Khatu Shyam Ji (Liftngo pickup)',
  },
];

export const KHATU_SHOP_PRODUCTS: KhatuShopProduct[] = [
  {
    id: 'prasad-pinni',
    shopId: 'shyam-prasad-house',
    name: 'Khatu special pinni',
    shortDescription: '500g — dry prasad, travel-safe pack',
    priceInr: 280,
    image: 'https://images.unsplash.com/photo-1587330979470-3595ac045ab0?w=800&q=80',
    category: 'prasad',
    popular: true,
    fastSelling: true,
  },
  {
    id: 'laddu-gond',
    shopId: 'shyam-prasad-house',
    name: 'Desi ghee bundi ladoo',
    shortDescription: '1 kg — mandir-style prasad',
    priceInr: 420,
    image: indiaPhotoFoodTable(800),
    category: 'prasad',
    fastSelling: true,
  },
  {
    id: 'mala-rose',
    shopId: 'mandir-sacred-store',
    name: 'Rose offering mala',
    shortDescription: 'For temple archana & distribution',
    priceInr: 120,
    image: indiaPhotoRetailMarketGoods(800),
    category: 'religious',
    popular: true,
  },
  {
    id: 'chola-set',
    shopId: 'mandir-sacred-store',
    name: 'Yellow chola & dupatta set',
    shortDescription: 'Ready for Shyam Baba darshan',
    priceInr: 350,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80',
    category: 'religious',
  },
  {
    id: 'diya-cotton-wick',
    shopId: 'mandir-sacred-store',
    name: 'Brass diyā with cotton wicks',
    shortDescription: 'Compact set for hotel / room pūjā',
    priceInr: 165,
    image: indiaPhotoFreightBoxes(800),
    category: 'religious',
  },
  {
    id: 'ittar-khatu',
    shopId: 'khatu-devotion-bazaar',
    name: 'Ittar roll-on set',
    shortDescription: 'Travel pack — sober notes for yātrā',
    priceInr: 199,
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80',
    category: 'local',
    fastSelling: true,
  },
  {
    id: 'shawls-wrap',
    shopId: 'khatu-devotion-bazaar',
    name: 'Winter darshan shawl',
    shortDescription: 'Unisex — evening aarti comfort',
    priceInr: 799,
    image: indiaPhotoRetailMarketGoods(800),
    category: 'local',
  },
];

export function getKhatuShopById(id: string): KhatuShop | undefined {
  return KHATU_SHOPS.find((s) => s.id === id);
}

export function getProductsForShop(shopId: string): KhatuShopProduct[] {
  return KHATU_SHOP_PRODUCTS.filter((p) => p.shopId === shopId);
}
