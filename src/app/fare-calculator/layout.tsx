import { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { SITE_URL, SITE_NAME } from '@/lib/site';

const PATH = '/fare-calculator';
const PAGE_URL = `${SITE_URL}${PATH}`;

export const metadata: Metadata = {
  title: 'Fare Calculator — Instant Delivery Cost Estimate',
  description:
    'Calculate logistics delivery cost instantly with Liftngo fare calculator. Get real-time pricing for 2W, 3W, and 4W goods transport in Delhi NCR and Khatu.',
  keywords: [
    'fare calculator',
    'delivery cost calculator',
    'logistics pricing',
    'transport fare estimate',
    'goods delivery cost',
    'Liftngo fare',
    '3 wheeler delivery cost',
    '4 wheeler transport price',
    'Delhi NCR delivery fare',
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: 'Fare Calculator — Instant Delivery Cost Estimate | Liftngo',
    description:
      'Calculate logistics delivery cost instantly. Get real-time pricing for 2W, 3W, and 4W goods transport.',
    url: PAGE_URL,
    siteName: SITE_NAME,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fare Calculator | Liftngo',
    description: 'Calculate delivery cost instantly with Liftngo fare calculator.',
  },
};

const webApplicationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  '@id': `${PAGE_URL}/#webapp`,
  name: 'Liftngo Fare Calculator',
  url: PAGE_URL,
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description:
    'Calculate logistics delivery cost instantly with real-time pricing for 2W, 3W, and 4W goods transport in Delhi NCR and Khatu.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'INR',
    availability: 'https://schema.org/InStock',
  },
  provider: {
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
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
      name: 'Tools',
      item: `${SITE_URL}/services`,
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Fare Calculator',
      item: PAGE_URL,
    },
  ],
};

export default function FareCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={webApplicationJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      {children}
    </>
  );
}
