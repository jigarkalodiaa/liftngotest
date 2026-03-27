import ContentLayout from '@/components/layout/ContentLayout';
import B2bLogisticsPageView from '@/components/about/B2bLogisticsPageView';
import JsonLd, { buildWebPageJsonLd } from '@/components/JsonLd';
import { B2B_LOGISTICS_FAQ } from '@/data/b2bLogisticsSeo';
import { generatePageMetadata } from '@/lib/seo';
import { BRAND, SITE_NAME, SITE_URL } from '@/lib/site';
import { ROUTES } from '@/lib/constants';

const PAGE_PATH = ROUTES.ABOUT_B2B_LOGISTICS;
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;

const PAGE_TITLE = `B2B logistics & goods delivery | ${SITE_NAME}`;

const PAGE_DESCRIPTION = `${BRAND.name} serves manufacturers, wholesalers, distributors, shop owners, and household supply businesses with hyperlocal B2B goods transport and last-mile delivery. Electric cargo, upfront pricing, intra-city lanes—built for commercial stock, not passenger rides. India · Rajasthan · Khatu area focus.`;

export const metadata = generatePageMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: PAGE_PATH,
  keywords: [
    'B2B logistics India',
    'business goods delivery',
    'wholesale transport',
    'manufacturer to distributor delivery',
    'household supplies delivery',
    'FMCG last mile',
    'shop to shop delivery',
    'distributor logistics',
    'intra-city cargo',
    'hyperlocal freight',
    'commercial goods transport',
    'local B2B delivery Rajasthan',
    'Khatu goods transport',
    `${BRAND.name} B2B`,
  ],
});

const faqForLd = B2B_LOGISTICS_FAQ.map((item) => ({
  question: item.question,
  answer: item.answer,
}));

export default function B2bLogisticsPage() {
  return (
    <ContentLayout>
      <JsonLd
        data={buildWebPageJsonLd({
          pageUrl: PAGE_URL,
          name: PAGE_TITLE,
          description: PAGE_DESCRIPTION,
          breadcrumb: [
            { name: 'Home', url: SITE_URL },
            { name: 'About', url: `${SITE_URL}${ROUTES.ABOUT}` },
            { name: 'B2B logistics', url: PAGE_URL },
          ],
          faqMainEntity: faqForLd,
        })}
      />
      <B2bLogisticsPageView />
    </ContentLayout>
  );
}
