import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from '@/lib/site';
import {
  ORGANIZATION_SCHEMA_ID,
  WEBSITE_SCHEMA_ID,
  buildPrimaryOrganizationNode,
  supportTelephoneE164,
} from '@/lib/structuredData/organizationShared';

type FaqItem = { question: string; answer: string };
type BreadcrumbSchemaItem = { name: string; url: string };

/** Khatu Shyam Ji landing — LocalBusiness (place-focused) + WebPage + FAQ (breadcrumb via `BreadcrumbsBar`). */
export function buildKhatuShyamLogisticsGraph({
  pageUrl,
  title,
  description,
  faq,
  keywords,
  breadcrumb,
}: {
  pageUrl: string;
  title: string;
  description: string;
  faq: FaqItem[];
  keywords?: string[];
  breadcrumb?: BreadcrumbSchemaItem[];
}) {
  const pageId = `${pageUrl}#webpage`;
  const localId = `${pageUrl}#localBusiness`;
  const tel = supportTelephoneE164();
  const keywordStr = keywords?.length ? keywords.join(', ') : undefined;

  const local: Record<string, unknown> = {
    '@type': 'LocalBusiness',
    '@id': localId,
    name: `${SITE_NAME} — Khatu Shyam Ji logistics`,
    description:
      'Hyperlocal goods transport and delivery for Khatu Shyam Ji: temple corridor vendors, food outlets, shops, and small businesses. On-demand booking via Liftngo.',
    url: pageUrl,
    image: { '@type': 'ImageObject', url: DEFAULT_OG_IMAGE },
    /** ASCII — some validators flag non-Latin `priceRange` */
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Khatu Shyam Ji area',
      addressLocality: 'Khatu',
      addressRegion: 'Rajasthan',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 27.7486,
      longitude: 75.3932,
    },
    areaServed: {
      '@type': 'Place',
      name: 'Khatu Shyam Ji, Rajasthan',
    },
    parentOrganization: { '@id': ORGANIZATION_SCHEMA_ID },
  };
  if (tel) local.telephone = tel;

  const graph: Record<string, unknown>[] = [
    buildPrimaryOrganizationNode(),
    {
      '@type': 'WebSite',
      '@id': WEBSITE_SCHEMA_ID,
      name: SITE_NAME,
      url: SITE_URL,
      publisher: { '@id': ORGANIZATION_SCHEMA_ID },
    },
    {
      '@type': 'WebPage',
      '@id': pageId,
      url: pageUrl,
      name: title,
      description,
      ...(keywordStr ? { keywords: keywordStr } : {}),
      inLanguage: 'en-IN',
      isPartOf: { '@id': WEBSITE_SCHEMA_ID },
      about: { '@id': localId },
      publisher: { '@id': ORGANIZATION_SCHEMA_ID },
    },
    local,
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

  graph.push({
    '@type': 'FAQPage',
    '@id': `${pageUrl}#faqpage`,
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  });

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}

/** Noida / Delhi NCR B2B — Organization + LocalBusiness (Noida) + Service + WebPage + FAQ (breadcrumb via `BreadcrumbsBar`). */
export function buildNoidaB2bLogisticsGraph({
  pageUrl,
  title,
  description,
  faq,
  keywords,
  breadcrumb,
}: {
  pageUrl: string;
  title: string;
  description: string;
  faq: FaqItem[];
  keywords?: string[];
  breadcrumb?: BreadcrumbSchemaItem[];
}) {
  const pageId = `${pageUrl}#webpage`;
  const serviceId = `${pageUrl}#b2b-service`;
  const localNoidaId = `${pageUrl}#localBusinessNoida`;
  const tel = supportTelephoneE164();
  const keywordStr = keywords?.length ? keywords.join(', ') : undefined;

  const localNoida: Record<string, unknown> = {
    '@type': 'LocalBusiness',
    '@id': localNoidaId,
    name: `${SITE_NAME} — B2B logistics Noida & Delhi NCR`,
    description:
      'Corporate delivery solutions, bulk delivery services, and warehouse logistics for Noida and Delhi National Capital Region. Multi-vehicle cargo booking and verified vendor network.',
    url: pageUrl,
    image: { '@type': 'ImageObject', url: DEFAULT_OG_IMAGE },
    priceRange: '$$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Noida & Delhi NCR service area',
      addressLocality: 'Noida',
      addressRegion: 'Uttar Pradesh',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 28.5355,
      longitude: 77.391,
    },
    areaServed: [
      { '@type': 'City', name: 'Noida' },
      { '@type': 'AdministrativeArea', name: 'Delhi National Capital Region' },
    ],
    parentOrganization: { '@id': ORGANIZATION_SCHEMA_ID },
  };
  if (tel) localNoida.telephone = tel;

  const graph: Record<string, unknown>[] = [
    {
      ...buildPrimaryOrganizationNode(),
      description:
        'Liftngo operates hyperlocal and B2B goods logistics in Khatu Shyam Ji (Rajasthan) and Delhi NCR, starting from Noida—multi-vehicle booking and verified partner network.',
      areaServed: [
        { '@type': 'AdministrativeArea', name: 'Noida', containedInPlace: { '@type': 'AdministrativeArea', name: 'Uttar Pradesh' } },
        { '@type': 'AdministrativeArea', name: 'Delhi NCR' },
        { '@type': 'Place', name: 'Khatu Shyam Ji', address: { '@type': 'PostalAddress', addressRegion: 'Rajasthan', addressCountry: 'IN' } },
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
      '@type': 'WebPage',
      '@id': pageId,
      url: pageUrl,
      name: title,
      description,
      ...(keywordStr ? { keywords: keywordStr } : {}),
      inLanguage: 'en-IN',
      isPartOf: { '@id': WEBSITE_SCHEMA_ID },
      publisher: { '@id': ORGANIZATION_SCHEMA_ID },
      about: [{ '@id': serviceId }, { '@id': localNoidaId }],
    },
    localNoida,
    {
      '@type': 'Service',
      '@id': serviceId,
      name: `${SITE_NAME} — B2B logistics (Noida & Delhi NCR)`,
      serviceType: 'Business logistics and corporate delivery',
      description:
        'B2B logistics for Noida and Delhi NCR: dedicated delivery coordination, verified vendor ecosystem, multi-vehicle booking (2W, 3W, 4W), bulk and inventory movement for retail, electronics, and offices.',
      provider: { '@id': ORGANIZATION_SCHEMA_ID },
      areaServed: [
        { '@type': 'City', name: 'Noida' },
        { '@type': 'AdministrativeArea', name: 'Delhi National Capital Region' },
      ],
      offers: {
        '@type': 'Offer',
        url: pageUrl,
        availability: 'https://schema.org/InStock',
        priceCurrency: 'INR',
      },
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

  graph.push({
    '@type': 'FAQPage',
    '@id': `${pageUrl}#faqpage`,
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  });

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}
