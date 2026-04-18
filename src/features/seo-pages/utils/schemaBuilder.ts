import { SITE_URL, SITE_NAME } from '@/lib/site';
import { SeoPageData, SeoPageFaq } from '../types';

export function buildServiceSchema(data: SeoPageData): Record<string, unknown> {
  const pageUrl = `${SITE_URL}${data.seo.path}`;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${pageUrl}/#service`,
    name: `${data.hero.title} — ${SITE_NAME}`,
    url: pageUrl,
    description: data.seo.description,
    serviceType: data.keyword,
    areaServed: data.city ? {
      '@type': 'Place',
      name: `${data.city}, Rajasthan`,
    } : {
      '@type': 'Country',
      name: 'India',
    },
    provider: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: '50',
      availability: 'https://schema.org/InStock',
    },
  };
}

export function buildBreadcrumbSchema(data: SeoPageData): Record<string, unknown> {
  const pageUrl = `${SITE_URL}${data.seo.path}`;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: data.hero.title, item: pageUrl },
    ],
  };
}

export function buildFaqSchema(faqs: SeoPageFaq[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function buildAllSchemas(data: SeoPageData): {
  service: Record<string, unknown>;
  breadcrumb: Record<string, unknown>;
  faq: Record<string, unknown>;
} {
  return {
    service: buildServiceSchema(data),
    breadcrumb: buildBreadcrumbSchema(data),
    faq: buildFaqSchema(data.faqs),
  };
}
