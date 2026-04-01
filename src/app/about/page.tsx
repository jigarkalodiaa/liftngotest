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
  'Intra-city goods transport with electric and fuel cargo, B2B-first lanes, and depth around Khatu Shyam Ji—not a passenger app. Built for shops, wholesalers, and reliable handoffs.';
/** Richer name for JSON-LD / social parity with on-page topic. */
const PAGE_SCHEMA_NAME = `About ${SITE_NAME} — EV cargo & hyperlocal B2B logistics`;

export const metadata = generatePageMetadata({
  title: PAGE_META_TITLE,
  description: PAGE_DESCRIPTION,
  path: ABOUT_PATH,
  image: ABOUT_HERO_IMAGE.src,
  keywords: [
    'Liftngo',
    'Liftngo about',
    'hyperlocal logistics India',
    'EV cargo delivery',
    'electric three wheeler cargo',
    'last mile goods transport',
    'B2B delivery Rajasthan',
    'Khatu goods transport',
    'intra-city cargo',
    'three wheeler cargo booking',
    'local wholesale delivery',
  ],
});

export default function AboutPage() {
  return (
    <ContentLayout breadcrumbs={[BREADCRUMB_HOME, BREADCRUMB_ABOUT]}>
      <JsonLd
        data={buildAboutPageJsonLd({
          pageUrl: PAGE_URL,
          title: PAGE_SCHEMA_NAME,
          description: PAGE_DESCRIPTION,
          heroImageUrl: ABOUT_HERO_IMAGE.src,
        })}
      />
      <AboutPageView />
    </ContentLayout>
  );
}
