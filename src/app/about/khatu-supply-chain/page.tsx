import ContentLayout from '@/components/layout/ContentLayout';
import KhatuLogisticsPageView from '@/components/about/KhatuLogisticsPageView';
import MarketingPageShell from '@/components/marketing/MarketingPageShell';
import JsonLd, { buildWebPageJsonLd } from '@/components/JsonLd';
import { KHATU_SUPPLY_CHAIN_FAQ } from '@/data/khatuLogisticsSeo';
import { generatePageMetadata } from '@/lib/seo';
import { BRAND, SITE_NAME, SITE_URL } from '@/lib/site';
import { ROUTES } from '@/lib/constants';
import { BREADCRUMB_HOME, BREADCRUMB_ABOUT } from '@/lib/breadcrumbsNav';

const PAGE_PATH = ROUTES.ABOUT_KHATU_SUPPLY_CHAIN;
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;

const PAGE_TITLE = `Khatu Shyam Ji logistics & trusted shops | ${SITE_NAME}`;

const PAGE_DESCRIPTION = `${BRAND.name} in Khatu, Rajasthan: hyperlocal goods transport for guest houses, restaurants, dharamshalas, prasad shops—plus curated dining discovery. Upfront fares, cargo-first booking, less opaque street hustle.`;

const PAGE_KEYWORDS = [
  'Khatu Shyam Ji logistics',
  'Khatu goods transport',
  'Rajasthan temple town delivery',
  'Khatu guest house supplies',
  'Khatu restaurant delivery',
  'dharamshala supply Khatu',
  'prasad shop transport Khatu',
  'hyperlocal freight Rajasthan',
  'temple corridor delivery',
  `${BRAND.name} Khatu`,
] as const;

export const metadata = generatePageMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: PAGE_PATH,
  keywords: [...PAGE_KEYWORDS],
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
            { name: 'Khatu supply chain', url: PAGE_URL },
          ],
        })}
      />
      <MarketingPageShell
        badge="Khatu Shyam Ji · Rajasthan · Hyperlocal logistics"
        title={
          <>
            <span className="text-amber-200/95">Khatu &amp; nearby:</span> supply chain for corridor businesses
          </>
        }
        lead={`${BRAND.name} connects daily goods movement for guest houses, restaurants, dharamshalas, prasad and retail shops, and small businesses around Khatu Shyam Ji—walk, two-wheel, or three-wheel cargo (EV, CNG, diesel, petrol as the lane needs).`}
        chips={['Yatra ecosystem supply', 'Upfront fares', 'Trusted food & shops discovery']}
        links={[
          { href: ROUTES.PICKUP_LOCATION, label: 'Book in Khatu' },
          { href: ROUTES.FIND_RESTAURANT, label: 'Food & shops' },
          { href: ROUTES.KHATU_SHYAM_LOGISTICS, label: 'Khatu logistics' },
          { href: ROUTES.ABOUT, label: 'About' },
        ]}
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'About', href: ROUTES.ABOUT },
          { label: 'Khatu supply chain' },
        ]}
      >
        <KhatuLogisticsPageView />
      </MarketingPageShell>
    </ContentLayout>
  );
}
