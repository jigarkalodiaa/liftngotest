import ContentLayout from '@/components/layout/ContentLayout';
import ThreeWheelCargoPageView from '@/components/about/ThreeWheelCargoPageView';
import MarketingPageShell from '@/components/marketing/MarketingPageShell';
import JsonLd, { buildWebPageJsonLd } from '@/components/JsonLd';
import { THREE_WHEEL_CARGO_FAQ } from '@/data/threeWheelCargoSeo';
import { generatePageMetadata } from '@/lib/seo';
import { BRAND, SITE_NAME, SITE_URL } from '@/lib/site';
import { ROUTES } from '@/lib/constants';
import { BREADCRUMB_HOME, BREADCRUMB_ABOUT } from '@/lib/breadcrumbsNav';

const PAGE_PATH = ROUTES.ABOUT_THREE_WHEEL_CARGO;
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;

const PAGE_TITLE = `Electric three-wheel cargo & goods delivery | ${SITE_NAME}`;

const PAGE_DESCRIPTION = `${BRAND.name} three-wheel cargo for B2B last-mile: electric EV loaders plus CNG, diesel, and petrol when the lane demands it. When 3W beats 2W, upfront pricing, intra-city goods—India.`;

const PAGE_KEYWORDS = [
  'electric three wheeler cargo',
  'EV cargo loader India',
  'three wheeler goods transport',
  'last mile cargo booking',
  'CNG cargo three wheeler',
  'diesel tempo goods',
  'intra-city mini truck alternative',
  'B2B carton delivery',
  'temple town logistics EV',
  `${BRAND.name} three wheeler`,
] as const;

export const metadata = generatePageMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: PAGE_PATH,
  keywords: [...PAGE_KEYWORDS],
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
      breadcrumbNavVisible={false}
    >
      <JsonLd
        data={buildWebPageJsonLd({
          pageUrl: PAGE_URL,
          name: PAGE_TITLE,
          description: PAGE_DESCRIPTION,
          keywords: [...PAGE_KEYWORDS],
          faqMainEntity: faqForLd,
          breadcrumb: [
            { name: 'Home', url: `${SITE_URL}/` },
            { name: 'About', url: `${SITE_URL}${BREADCRUMB_ABOUT.path}` },
            { name: 'Electric three-wheel cargo', url: PAGE_URL },
          ],
        })}
      />
      <MarketingPageShell
        badge="3W cargo · Last mile · EV, CNG, diesel & petrol"
        title={
          <>
            <span className="text-emerald-300">Electric three-wheel cargo</span> &amp; fuel options for real lanes
          </>
        }
        lead={`${BRAND.name} uses compact three-wheel cargo for intra-city B2B—too big for a bike, smaller than a full truck. EV where charging fits; CNG, diesel, or petrol when the job demands—one booking flow either way.`}
        chips={['B2B cartons & sacks', 'EV + conventional mix', 'Same upfront estimate']}
        links={[
          { href: '/services/3-wheeler', label: '3W service' },
          { href: ROUTES.PICKUP_LOCATION, label: 'Book a load' },
          { href: ROUTES.ABOUT, label: 'About' },
          { href: ROUTES.B2B_TRANSPORT, label: 'B2B hub' },
        ]}
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'About', href: ROUTES.ABOUT },
          { label: '3W cargo' },
        ]}
      >
        <ThreeWheelCargoPageView />
      </MarketingPageShell>
    </ContentLayout>
  );
}
