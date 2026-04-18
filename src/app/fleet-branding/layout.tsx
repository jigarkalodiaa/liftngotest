import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { generatePageMetadata } from '@/lib/seo';
import { SITE_URL, SITE_NAME } from '@/lib/site';

const PATH = '/fleet-branding';
const PAGE_URL = `${SITE_URL}${PATH}`;

export const metadata: Metadata = generatePageMetadata({
  title: 'Fleet Branding — Advertise on Liftngo Vehicles',
  description:
    'Brand Liftngo 3W EV and 4W cargo vehicles across Delhi NCR, Khatu, and active routes — moving billboards, live pricing calculator, and WhatsApp campaign quotes.',
  path: PATH,
  keywords: [
    'fleet branding India',
    'Delhi NCR vehicle advertising',
    'vehicle wrap logistics',
    'Liftngo branding',
    'EV fleet wrap',
    'Noida Ghaziabad delivery branding',
    'vehicle advertising Delhi',
    'cargo vehicle branding',
    'mobile billboard advertising',
  ],
});

const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  '@id': `${PAGE_URL}/#service`,
  name: 'Fleet Branding by Liftngo',
  url: PAGE_URL,
  description:
    'Brand your business on Liftngo 3W EV and 4W cargo vehicles across Delhi NCR, Khatu, and active delivery routes. Moving billboards with city-scale reach.',
  serviceType: 'Vehicle Advertising',
  areaServed: [
    { '@type': 'City', name: 'Noida' },
    { '@type': 'City', name: 'Delhi' },
    { '@type': 'AdministrativeArea', name: 'Delhi NCR' },
    { '@type': 'Place', name: 'Khatu Shyam Ji' },
  ],
  provider: {
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
  },
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'INR',
    lowPrice: '2000',
    highPrice: '15000',
    offerCount: '4',
    availability: 'https://schema.org/InStock',
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
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
      name: 'Services',
      item: `${SITE_URL}/services`,
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Fleet Branding',
      item: PAGE_URL,
    },
  ],
};

export default function FleetBrandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={serviceJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      {children}
    </>
  );
}
