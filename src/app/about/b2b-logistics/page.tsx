import ContentLayout from '@/components/layout/ContentLayout';
import B2bLogisticsPageView from '@/components/about/B2bLogisticsPageView';
import MarketingPageShell from '@/components/marketing/MarketingPageShell';
import JsonLd, { buildWebPageJsonLd } from '@/components/JsonLd';
import { B2B_LOGISTICS_FAQ } from '@/data/b2bLogisticsSeo';
import { generatePageMetadata } from '@/lib/seo';
import { BRAND, SITE_NAME, SITE_URL } from '@/lib/site';
import { ROUTES } from '@/lib/constants';
import { BREADCRUMB_HOME, BREADCRUMB_ABOUT } from '@/lib/breadcrumbsNav';

const PAGE_PATH = ROUTES.ABOUT_B2B_LOGISTICS;
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;

const PAGE_TITLE = `B2B logistics & goods delivery | ${SITE_NAME}`;

const PAGE_DESCRIPTION = `${BRAND.name} serves manufacturers, wholesalers, distributors, and retailers with hyperlocal B2B goods transport, electric cargo where it fits, and upfront intra-city pricing—not passenger rides. India · Rajasthan · Khatu · Delhi NCR focus.`;

const PAGE_KEYWORDS = [
  'B2B logistics India',
  'business goods delivery',
  'wholesale transport booking',
  'manufacturer to distributor delivery',
  'FMCG last mile India',
  'intra-city cargo platform',
  'hyperlocal freight B2B',
  'commercial goods transport',
  'kirana stock transfer',
  'distributor logistics India',
  'Khatu goods transport',
  'Noida B2B delivery',
  `${BRAND.name} B2B`,
] as const;

export const metadata = generatePageMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: PAGE_PATH,
  keywords: [...PAGE_KEYWORDS],
});

const faqForLd = B2B_LOGISTICS_FAQ.map((item) => ({
  question: item.question,
  answer: item.answer,
}));

export default function B2bLogisticsPage() {
  return (
    <ContentLayout
      breadcrumbs={[
        BREADCRUMB_HOME,
        BREADCRUMB_ABOUT,
        { name: 'B2B logistics', path: PAGE_PATH },
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
            { name: 'Home', url: SITE_URL + '/' },
            { name: 'About', url: `${SITE_URL}${BREADCRUMB_ABOUT.path}` },
            { name: 'B2B logistics', url: PAGE_URL },
          ],
        })}
      />
      <MarketingPageShell
        badge="B2B goods transport · Last-mile · Hyperlocal"
        title={
          <>
            B2B logistics for <span className="text-emerald-300">every business</span> that moves stock
          </>
        }
        lead="Manufacturers, wholesalers, distributors, kirana, and household-supply sellers—dependable intra-city transport with electric three-wheel cargo where it fits, upfront fares, and cargo-first booking—not cabs."
        chips={['Manufacturers to retail', 'EV cargo + lighter modes', 'Rajasthan · NCR corridors']}
        links={[
          { href: ROUTES.PICKUP_LOCATION, label: 'Book B2B delivery' },
          { href: ROUTES.ABOUT, label: 'About' },
          { href: ROUTES.B2B_TRANSPORT, label: 'B2B transport hub' },
          { href: '/contact', label: 'Contact' },
        ]}
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'About', href: ROUTES.ABOUT },
          { label: 'B2B logistics' },
        ]}
      >
        <B2bLogisticsPageView />
      </MarketingPageShell>
    </ContentLayout>
  );
}
