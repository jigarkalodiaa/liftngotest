import ContentLayout from '@/components/layout/ContentLayout';
import KhatuLogisticsPageView from '@/components/about/KhatuLogisticsPageView';
import JsonLd, { buildWebPageJsonLd } from '@/components/JsonLd';
import { KHATU_SUPPLY_CHAIN_FAQ } from '@/data/khatuLogisticsSeo';
import { generatePageMetadata } from '@/lib/seo';
import { BRAND, SITE_NAME, SITE_URL } from '@/lib/site';
import { ROUTES } from '@/lib/constants';
import { BREADCRUMB_HOME, BREADCRUMB_ABOUT } from '@/lib/breadcrumbsNav';

const PAGE_PATH = ROUTES.ABOUT_KHATU_SUPPLY_CHAIN;
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;

const PAGE_TITLE = `Khatu Shyam Ji logistics & trusted shops | ${SITE_NAME}`;

const PAGE_DESCRIPTION = `${BRAND.name} in Khatu, Rajasthan: hyperlocal goods transport for guest houses, restaurants, dharamshalas, prasad shops, and small businesses—plus curated dining and retail discovery to explore Khatu with less scam risk.`;

export const metadata = generatePageMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: PAGE_PATH,
  keywords: [
    'Khatu Shyam Ji logistics',
    'Khatu goods transport',
    'Rajasthan temple town delivery',
    'Khatu guest house supplies',
    'Khatu restaurant delivery',
    'dharamshala supply chain Khatu',
    'prasad shop transport Khatu',
    'trusted restaurants Khatu',
    'Khatu without scam',
    `${BRAND.name} Khatu`,
  ],
});

const faqForLd = KHATU_SUPPLY_CHAIN_FAQ.map((item) => ({
  question: item.question,
  answer: item.answer,
}));

export default function KhatuSupplyChainPage() {
  return (
    <ContentLayout
      breadcrumbs={[
        BREADCRUMB_HOME,
        BREADCRUMB_ABOUT,
        { name: 'Khatu supply chain', path: PAGE_PATH },
      ]}
    >
      <JsonLd
        data={buildWebPageJsonLd({
          pageUrl: PAGE_URL,
          name: PAGE_TITLE,
          description: PAGE_DESCRIPTION,
          faqMainEntity: faqForLd,
        })}
      />
      <KhatuLogisticsPageView />
    </ContentLayout>
  );
}
