import { HOMEPAGE_FAQ_PREVIEW } from '@/data/faq';
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, DEFAULT_OG_IMAGE } from '@/lib/site';
import {
  ORGANIZATION_SCHEMA_ID,
  WEBSITE_SCHEMA_ID,
  buildPrimaryOrganizationNode,
  supportTelephoneE164,
} from '@/lib/structuredData/organizationShared';

const SERVICE_ID = `${SITE_URL}/#logistics-service`;
const LOCAL_KHATU_ID = `${SITE_URL}/#localBusinessKhatu`;
const LOCAL_NOIDA_ID = `${SITE_URL}/#localBusinessNoida`;

/**
 * Homepage JSON-LD @graph: WebSite, Organization, LocalBusiness (Khatu + Noida), Service, FAQPage.
 * Avoids emitting duplicate standalone Organization scripts.
 */
export function buildHomepageSeoGraph() {
  const tel = supportTelephoneE164();

  const organization: Record<string, unknown> = {
    ...buildPrimaryOrganizationNode(),
    areaServed: [
      {
        '@type': 'Place',
        name: 'Khatu Shyam Ji',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Khatu',
          addressRegion: 'Rajasthan',
          addressCountry: 'IN',
        },
      },
      { '@type': 'City', name: 'Noida', containedInPlace: { '@type': 'AdministrativeArea', name: 'Delhi NCR' } },
      { '@type': 'AdministrativeArea', name: 'Delhi National Capital Region' },
    ],
    knowsAbout: [
      'B2B logistics India',
      'hyperlocal delivery service',
      'EV cargo delivery',
      'goods transport',
      'last-mile logistics',
    ],
    subOrganization: [{ '@id': LOCAL_KHATU_ID }, { '@id': LOCAL_NOIDA_ID }],
  };

  /** Khatu corridor — valid LocalBusiness (street + geo + ImageObject). */
  const localKhatu: Record<string, unknown> = {
    '@type': 'LocalBusiness',
    '@id': LOCAL_KHATU_ID,
    name: `${SITE_NAME} — Khatu Shyam Ji logistics`,
    url: `${SITE_URL}/khatu-shyam-logistics`,
    image: { '@type': 'ImageObject', url: DEFAULT_OG_IMAGE },
    description: SITE_DESCRIPTION,
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Khatu Shyam Ji area',
      addressLocality: 'Khatu',
      addressRegion: 'Rajasthan',
      addressCountry: 'IN',
    },
    geo: { '@type': 'GeoCoordinates', latitude: 27.7486, longitude: 75.3932 },
    areaServed: { '@type': 'Place', name: 'Khatu Shyam Ji, Rajasthan' },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '00:00',
      closes: '23:59',
    },
    parentOrganization: { '@id': ORGANIZATION_SCHEMA_ID },
  };
  if (tel) localKhatu.telephone = tel;

  /** Noida / NCR B2B — valid LocalBusiness with streetAddress. */
  const localNoida: Record<string, unknown> = {
    '@type': 'LocalBusiness',
    '@id': LOCAL_NOIDA_ID,
    name: `${SITE_NAME} — B2B logistics Noida & Delhi NCR`,
    url: `${SITE_URL}/noida-b2b-logistics`,
    image: { '@type': 'ImageObject', url: DEFAULT_OG_IMAGE },
    description: SITE_DESCRIPTION,
    priceRange: '$$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Noida & Delhi NCR service area',
      addressLocality: 'Noida',
      addressRegion: 'Uttar Pradesh',
      addressCountry: 'IN',
    },
    geo: { '@type': 'GeoCoordinates', latitude: 28.5355, longitude: 77.391 },
    areaServed: [
      { '@type': 'City', name: 'Noida' },
      { '@type': 'AdministrativeArea', name: 'Delhi National Capital Region' },
    ],
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '00:00',
      closes: '23:59',
    },
    parentOrganization: { '@id': ORGANIZATION_SCHEMA_ID },
  };
  if (tel) localNoida.telephone = tel;

  const service: Record<string, unknown> = {
    '@type': 'Service',
    '@id': SERVICE_ID,
    name: `${SITE_NAME} — goods transport & B2B logistics`,
    serviceType: 'Logistics and transport service',
    description:
      'Focused goods transport: Khatu Shyam Ji hyperlocal (temple corridor, shops, food) and B2B logistics in Noida & Delhi NCR. Walk through 4W booking, EV where lanes fit—upfront pricing, not pan-India spray.',
    provider: { '@id': ORGANIZATION_SCHEMA_ID },
    areaServed: [
      { '@type': 'Place', name: 'Khatu Shyam Ji' },
      { '@type': 'City', name: 'Noida' },
      { '@type': 'AdministrativeArea', name: 'Delhi NCR' },
    ],
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      priceCurrency: 'INR',
      url: `${SITE_URL}/book-delivery`,
    },
  };

  const website = {
    '@type': 'WebSite',
    '@id': WEBSITE_SCHEMA_ID,
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: 'en-IN',
    publisher: { '@id': ORGANIZATION_SCHEMA_ID },
  };

  const faq = {
    '@type': 'FAQPage',
    '@id': `${SITE_URL}/#faq`,
    mainEntity: HOMEPAGE_FAQ_PREVIEW.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [website, organization, localKhatu, localNoida, service, faq],
  };
}

/** BreadcrumbList for landing pages (JSON-LD). */
export function buildBreadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.path.startsWith('http') ? it.path : `${SITE_URL}${it.path}`,
    })),
  };
}
