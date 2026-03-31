import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from '@/lib/site';
import {
  ORGANIZATION_SCHEMA_ID,
  WEBSITE_SCHEMA_ID,
  buildPrimaryOrganizationNode,
} from '@/lib/structuredData/organizationShared';

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

/** Standalone Organization script (same node as homepage @graph; logo + optional phone + sameAs). */
export function buildOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    ...buildPrimaryOrganizationNode(),
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
      ...buildPrimaryOrganizationNode(),
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
      '@id': WEBSITE_SCHEMA_ID,
      name: SITE_NAME,
      url: SITE_URL,
      publisher: { '@id': ORGANIZATION_SCHEMA_ID },
    },
    {
      '@type': 'AboutPage',
      '@id': aboutId,
      url: pageUrl,
      name: title,
      description,
      inLanguage: 'en-IN',
      isPartOf: { '@id': WEBSITE_SCHEMA_ID },
      about: { '@id': ORGANIZATION_SCHEMA_ID },
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
      isPartOf: { '@id': WEBSITE_SCHEMA_ID },
      publisher: { '@id': ORGANIZATION_SCHEMA_ID },
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
      '@id': `${pageUrl}#faqpage`,
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
