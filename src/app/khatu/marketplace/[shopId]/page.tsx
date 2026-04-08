import { notFound } from 'next/navigation';
import { generatePageMetadata } from '@/lib/seo';
import { getKhatuShopById } from '@/data/khatuShops';
import KhatuShopPage from '@/features/khatu/marketplace/KhatuShopPage';
import { SITE_NAME } from '@/lib/site';

type PageProps = { params: Promise<{ shopId: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { shopId } = await params;
  const shop = getKhatuShopById(shopId);
  if (!shop) {
    return generatePageMetadata({
      title: `Shop | ${SITE_NAME}`,
      description: 'Khatu marketplace shop',
      path: `/khatu/marketplace/${shopId}`,
    });
  }
  return generatePageMetadata({
    title: `${shop.name} | Khatu marketplace · ${SITE_NAME}`,
    description: `${shop.description} Verified by Liftngo. ~${shop.distanceKm.toFixed(1)} km from mandir zone.`,
    path: `/khatu/marketplace/${shopId}`,
    keywords: ['khatu shop', shop.name.toLowerCase(), 'prasad khatu'],
  });
}

export default async function ShopRoute({ params }: PageProps) {
  const { shopId } = await params;
  const shop = getKhatuShopById(shopId);
  if (!shop) notFound();
  return <KhatuShopPage shopId={shopId} />;
}
