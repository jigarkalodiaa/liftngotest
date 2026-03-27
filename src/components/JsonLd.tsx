import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, PROJECT_DESCRIPTION, LOGO_URL } from '@/lib/site';
import { FAQ_ITEMS } from '@/data/faq';
import { getOrganizationSameAs } from '@/lib/social';

interface JsonLdProps {
  /** Structured data – must be server/site-controlled only; never pass user input. */
  data: Record<string, unknown>;
}

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** WebSite only — no SearchAction (site has no /search route; invalid SearchAction breaks rich-result validation). */
export const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
};

const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

/** Organization with ImageObject logo and sameAs (required shape for Google). */
export function buildOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: LOGO_URL,
    },
    description: SITE_DESCRIPTION,
    sameAs: getOrganizationSameAs(),
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: ['English', 'Hindi'],
    },
  };
}

/** About page: AboutPage + WebSite + Organization + BreadcrumbList (single graph). */
export function buildAboutPageJsonLd({
  pageUrl,
  title,
  description,
  heroImageUrl,
}: {
  pageUrl: string;
  title: string;
  description: string;
  heroImageUrl: string;
}) {
  const aboutId = `${pageUrl}#webpage`;
  const graph: Record<string, unknown>[] = [
    {
      '@type': 'Organization',
      '@id': ORGANIZATION_ID,
      name: SITE_NAME,
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: LOGO_URL },
      description: PROJECT_DESCRIPTION,
      areaServed: [
        {
          '@type': 'Place',
          name: 'Khatu',
          address: {
            '@type': 'PostalAddress',
            addressRegion: 'Rajasthan',
            addressCountry: 'IN',
          },
        },
        {
          '@type': 'Country',
          name: 'India',
        },
      ],
      knowsAbout: [
        'Hyperlocal logistics',
        'Last-mile goods delivery',
        'EV cargo vehicles',
        'B2B transport',
        'Intra-city freight',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': WEBSITE_ID,
      name: SITE_NAME,
      url: SITE_URL,
      publisher: { '@id': ORGANIZATION_ID },
    },
    {
      '@type': 'AboutPage',
      '@id': aboutId,
      url: pageUrl,
      name: title,
      description,
      inLanguage: 'en-IN',
      isPartOf: { '@id': WEBSITE_ID },
      about: { '@id': ORGANIZATION_ID },
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: heroImageUrl,
      },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: SITE_URL,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'About',
          item: pageUrl,
        },
      ],
    },
  ];

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}

type BreadcrumbItem = { name: string; url: string };

/** Marketing detail pages: WebPage + breadcrumbs (+ optional FAQ in same graph). */
export function buildWebPageJsonLd({
  pageUrl,
  name,
  description,
  breadcrumb,
  faqMainEntity,
}: {
  pageUrl: string;
  name: string;
  description: string;
  breadcrumb: BreadcrumbItem[];
  faqMainEntity?: { question: string; answer: string }[];
}) {
  const pageId = `${pageUrl}#webpage`;
  const graph: Record<string, unknown>[] = [
    {
      '@type': 'WebPage',
      '@id': pageId,
      url: pageUrl,
      name,
      description,
      inLanguage: 'en-IN',
      isPartOf: { '@id': WEBSITE_ID },
      publisher: { '@id': ORGANIZATION_ID },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumb.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: item.name,
        item: item.url,
      })),
    },
  ];

  if (faqMainEntity?.length) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: faqMainEntity.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    });
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}

/** LocalBusiness schema for local/logistics SEO. */
export const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${SITE_URL}/#localBusiness`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: {
    '@type': 'ImageObject',
    url: LOGO_URL,
  },
  description: SITE_DESCRIPTION,
  image: LOGO_URL,
  priceRange: '₹₹',
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '00:00',
    closes: '23:59',
  },
};

/** FAQPage schema for FAQ section (rich results in search). */
export const faqPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
};
