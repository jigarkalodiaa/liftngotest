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

/** About page: AboutPage + WebSite + Organization (breadcrumb JSON-LD via `BreadcrumbsBar`). */
export function buildAboutPageJsonLd({
  pageUrl,
  title,
  description,
  heroImageUrl,
  keywords,
}: {
  pageUrl: string;
  title: string;
  description: string;
  heroImageUrl: string;
  keywords?: string[];
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
      ...(keywords?.length ? { keywords: keywords.join(', ') } : {}),
      inLanguage: 'en-IN',
      isPartOf: { '@id': WEBSITE_SCHEMA_ID },
      about: { '@id': ORGANIZATION_SCHEMA_ID },
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: heroImageUrl,
      },
    },
  ];

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}

type BreadcrumbItem = { name: string; url: string };

/** Contact page — `ContactPage` type helps Google understand support intent (sitelinks context). */
export function buildContactPageJsonLd({
  pageUrl,
  name,
  description,
  breadcrumb,
  faqMainEntity,
}: {
  pageUrl: string;
  name: string;
  description: string;
  /** Omit when using `BreadcrumbsBar` (avoids duplicate BreadcrumbList JSON-LD). */
  breadcrumb?: BreadcrumbItem[];
  faqMainEntity?: { question: string; answer: string }[];
}) {
  const pageId = `${pageUrl}#webpage`;
  const graph: Record<string, unknown>[] = [
    {
      '@type': 'ContactPage',
      '@id': pageId,
      url: pageUrl,
      name,
      description,
      inLanguage: 'en-IN',
      isPartOf: { '@id': WEBSITE_SCHEMA_ID },
      publisher: { '@id': ORGANIZATION_SCHEMA_ID },
    },
  ];

  if (breadcrumb?.length) {
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumb.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: item.name,
        item: item.url,
      })),
    });
  }

  if (faqMainEntity?.length) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${pageUrl}#faqpage`,
      mainEntity: faqMainEntity.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    });
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}

/** Marketing detail pages: WebPage + breadcrumbs (+ optional FAQ in same graph). */
export function buildWebPageJsonLd({
  pageUrl,
  name,
  description,
  breadcrumb,
  faqMainEntity,
  keywords,
}: {
  pageUrl: string;
  name: string;
  description: string;
  /** Omit when using `BreadcrumbsBar` (avoids duplicate BreadcrumbList JSON-LD). */
  breadcrumb?: BreadcrumbItem[];
  faqMainEntity?: { question: string; answer: string }[];
  /** Comma-separated string or array → joined for schema.org `keywords` on WebPage. */
  keywords?: string[] | string;
}) {
  const pageId = `${pageUrl}#webpage`;
  const keywordStr =
    typeof keywords === 'string'
      ? keywords
      : keywords?.length
        ? keywords.join(', ')
        : undefined;

  const graph: Record<string, unknown>[] = [
    {
      '@type': 'WebPage',
      '@id': pageId,
      url: pageUrl,
      name,
      description,
      ...(keywordStr ? { keywords: keywordStr } : {}),
      inLanguage: 'en-IN',
      isPartOf: { '@id': WEBSITE_SCHEMA_ID },
      publisher: { '@id': ORGANIZATION_SCHEMA_ID },
    },
  ];

  if (breadcrumb?.length) {
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumb.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: item.name,
        item: item.url,
      })),
    });
  }

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
