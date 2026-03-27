import { HOMEPAGE_FAQ_PREVIEW } from '@/data/faq';
import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  PROJECT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  LOGO_URL,
} from '@/lib/site';

const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const SERVICE_ID = `${SITE_URL}/#logistics-service`;

function supportTelephone(): string | undefined {
  const raw = process.env.NEXT_PUBLIC_SUPPORT_PHONE?.replace(/\D/g, '') ?? '';
  if (raw.length < 10) return undefined;
  return `+91${raw.slice(-10)}`;
}

/**
 * Single JSON-LD graph for homepage: WebSite, Organization, LocalBusiness, Service, FAQPage.
 * Avoids emitting duplicate standalone Organization scripts.
 */
export function buildHomepageSeoGraph() {
  const tel = supportTelephone();

  const organization: Record<string, unknown> = {
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: SITE_NAME,
    url: SITE_URL,
    logo: { '@type': 'ImageObject', url: LOGO_URL },
    description: PROJECT_DESCRIPTION,
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
  };

  if (tel) {
    organization.contactPoint = {
      '@type': 'ContactPoint',
      telephone: tel,
      contactType: 'customer service',
      availableLanguage: ['English', 'Hindi'],
      areaServed: 'IN',
    };
  }

  const localBusiness: Record<string, unknown> = {
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/#localBusiness`,
    name: SITE_NAME,
    image: DEFAULT_OG_IMAGE,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    priceRange: '₹₹',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Khatu',
      addressRegion: 'Rajasthan',
      addressCountry: 'IN',
    },
    areaServed: [
      { '@type': 'Place', name: 'Khatu Shyam Ji, Rajasthan' },
      { '@type': 'City', name: 'Noida' },
      { '@type': 'AdministrativeArea', name: 'Delhi NCR' },
    ],
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '00:00',
      closes: '23:59',
    },
    parentOrganization: { '@id': ORGANIZATION_ID },
  };

  if (tel) {
    localBusiness.telephone = tel;
  }

  const service: Record<string, unknown> = {
    '@type': 'Service',
    '@id': SERVICE_ID,
    name: `${SITE_NAME} — goods transport & B2B logistics`,
    serviceType: 'Logistics and transport service',
    description:
      'Focused goods transport: Khatu Shyam Ji hyperlocal (temple corridor, shops, food) and B2B logistics in Noida & Delhi NCR. Walk through 4W booking, EV where lanes fit—upfront pricing, not pan-India spray.',
    provider: { '@id': ORGANIZATION_ID },
    areaServed: [
      { '@type': 'Place', name: 'Khatu Shyam Ji' },
      { '@type': 'City', name: 'Noida' },
      { '@type': 'AdministrativeArea', name: 'Delhi NCR' },
    ],
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      url: `${SITE_URL}/book-delivery`,
    },
  };

  const website = {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    publisher: { '@id': ORGANIZATION_ID },
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
    '@graph': [website, organization, localBusiness, service, faq],
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
