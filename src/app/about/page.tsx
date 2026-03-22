import ContentLayout from '@/components/layout/ContentLayout';
import AboutPageView from '@/components/about/AboutPageView';
import { generatePageMetadata } from '@/lib/seo';
import { BRAND, SITE_NAME } from '@/lib/site';

export const metadata = generatePageMetadata({
  title: `About ${SITE_NAME} | Goods-first logistics you can trust`,
  description:
    `${BRAND.name} helps businesses move goods with clarity: verified partners, upfront pricing, and live visibility from pickup to proof of delivery—not a passenger app pretending to understand freight.`,
  path: '/about',
  keywords: [
    'B2B logistics',
    'goods transport platform',
    'business delivery service',
    'last mile delivery',
    'Liftngo about',
    'verified drivers logistics',
  ],
});

export default function AboutPage() {
  return (
    <ContentLayout>
      <AboutPageView />
    </ContentLayout>
  );
}
