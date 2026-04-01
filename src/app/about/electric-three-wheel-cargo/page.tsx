import ContentLayout from '@/components/layout/ContentLayout';
import ThreeWheelCargoPageView from '@/components/about/ThreeWheelCargoPageView';
import JsonLd, { buildWebPageJsonLd } from '@/components/JsonLd';
import { THREE_WHEEL_CARGO_FAQ } from '@/data/threeWheelCargoSeo';
import { generatePageMetadata } from '@/lib/seo';
import { BRAND, SITE_NAME, SITE_URL } from '@/lib/site';
import { ROUTES } from '@/lib/constants';
import { BREADCRUMB_HOME, BREADCRUMB_ABOUT } from '@/lib/breadcrumbsNav';

const PAGE_PATH = ROUTES.ABOUT_THREE_WHEEL_CARGO;
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;

const PAGE_TITLE = `Electric three-wheel cargo & goods delivery | ${SITE_NAME}`;

const PAGE_DESCRIPTION = `Liftngo three-wheel cargo for last-mile and intra-city goods: electric EV loaders plus CNG, diesel, and petrol options. When to choose 3-wheel vs 2-wheel, B2B cartons, transparent pricing—${BRAND.name}.`;

export const metadata = generatePageMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: PAGE_PATH,
  keywords: [
    'electric three wheeler cargo',
    'EV cargo loader',
    'three wheeler goods transport',
    'last mile cargo India',
    'CNG cargo three wheeler',
    'diesel tempo goods',
    'intra-city mini truck alternative',
    'B2B carton delivery',
    `${BRAND.name} three wheeler`,
  ],
});

const faqForLd = THREE_WHEEL_CARGO_FAQ.map((item) => ({
  question: item.question,
  answer: item.answer,
}));

export default function ElectricThreeWheelCargoPage() {
  return (
    <ContentLayout
      breadcrumbs={[
        BREADCRUMB_HOME,
        BREADCRUMB_ABOUT,
        { name: 'Electric three-wheel cargo', path: PAGE_PATH },
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
      <ThreeWheelCargoPageView />
    </ContentLayout>
  );
}
