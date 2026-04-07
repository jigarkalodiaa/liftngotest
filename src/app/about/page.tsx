import ContentLayout from '@/components/layout/ContentLayout';
import AboutPageView from '@/components/about/AboutPageView';
import JsonLd, { buildAboutPageJsonLd } from '@/components/JsonLd';
import { ABOUT_HERO_IMAGE } from '@/config/aboutImages';
import { generatePageMetadata } from '@/lib/seo';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import { BREADCRUMB_HOME, BREADCRUMB_ABOUT } from '@/lib/breadcrumbsNav';

const ABOUT_PATH = '/about';
const PAGE_URL = `${SITE_URL}${ABOUT_PATH}`;
/** Title base only; root layout adds `| Liftngo` (~55 chars total). */
const PAGE_META_TITLE = 'About us | EV cargo & hyperlocal B2B';
const PAGE_DESCRIPTION =
  'Liftngo moves intra-city goods for B2B—electric & fuel three-wheel cargo, upfront pricing, Khatu Shyam Ji hyperlocal depth, and Noida/Delhi NCR wholesale lanes. Not a passenger app: commercial handoffs, POD, and ops-friendly booking.';
/** Richer name for JSON-LD / social parity with on-page topic. */
const PAGE_SCHEMA_NAME = `About ${SITE_NAME} — EV cargo & hyperlocal B2B logistics`;

const PAGE_KEYWORDS = [
  'Liftngo about',
  'Liftngo logistics company',
  'hyperlocal goods transport India',
  'intra-city B2B delivery',
  'EV three wheeler cargo India',
  'electric cargo loader booking',
  'last mile freight India',
  'Khatu Shyam Ji delivery',
  'Rajasthan B2B transport',
  'Noida B2B logistics',
  'Delhi NCR goods transport',
  'wholesale delivery platform',
  'commercial goods app India',
  'three wheeler cargo booking',
  'kirana stock transfer',
] as const;

export const metadata = generatePageMetadata({
  title: PAGE_META_TITLE,
  description: PAGE_DESCRIPTION,
  path: ABOUT_PATH,
  image: ABOUT_HERO_IMAGE.src,
  keywords: [...PAGE_KEYWORDS],
});

export default function AboutPage() {
  return (
    <ContentLayout breadcrumbs={[BREADCRUMB_HOME, BREADCRUMB_ABOUT]} breadcrumbNavVisible={false}>
      <JsonLd
        data={buildAboutPageJsonLd({
          pageUrl: PAGE_URL,
          title: PAGE_SCHEMA_NAME,
          description: PAGE_DESCRIPTION,
          heroImageUrl: ABOUT_HERO_IMAGE.src,
          keywords: [...PAGE_KEYWORDS],
        })}
      />
      <AboutPageView />
    </ContentLayout>
  );
}
