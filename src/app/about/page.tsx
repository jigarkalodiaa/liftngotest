import ContentLayout from '@/components/layout/ContentLayout';
import AboutPageView from '@/components/about/AboutPageView';
import JsonLd, { buildAboutPageJsonLd } from '@/components/JsonLd';
import { ABOUT_HERO_IMAGE } from '@/config/aboutImages';
import { generatePageMetadata } from '@/lib/seo';
import { BRAND, SITE_NAME, SITE_URL } from '@/lib/site';

const ABOUT_PATH = '/about';
const PAGE_URL = `${SITE_URL}${ABOUT_PATH}`;
const PAGE_TITLE = `About ${SITE_NAME} | EV cargo & hyperlocal B2B logistics`;
const PAGE_DESCRIPTION = `${BRAND.name} is a hyperlocal logistics company for intra-city goods transport: electric three-wheel cargo and light modes, B2B-first lanes, and deep service in Khatu and nearby markets. Not a passenger cab app—built for last-mile delivery, wholesalers, and reliable handoffs.`;

export const metadata = generatePageMetadata({
  title: PAGE_TITLE,
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
    <ContentLayout>
      <JsonLd
        data={buildAboutPageJsonLd({
          pageUrl: PAGE_URL,
          title: PAGE_TITLE,
          description: PAGE_DESCRIPTION,
          heroImageUrl: ABOUT_HERO_IMAGE.src,
        })}
      />
      <AboutPageView />
    </ContentLayout>
  );
}
