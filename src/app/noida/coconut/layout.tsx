import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';
import JsonLd from '@/components/JsonLd';
import { SITE_URL, SITE_NAME, LOGO_URL } from '@/lib/site';

const PATH = '/noida/coconut';
const TITLE = 'Fresh Coconut Water Delivery in Noida | Order Online — Liftngo';
const DESCRIPTION =
  'Order fresh tender coconut water (nariyal pani), malai coconut, combos & office packs in Noida. Delivered to your door in 15–25 min via Liftngo riders. Starting ₹60.';

export const metadata: Metadata = generatePageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
  keywords: [
    'coconut water delivery noida',
    'nariyal pani order online',
    'fresh coconut noida',
    'tender coconut delivery',
    'malai coconut noida',
    'coconut water near me',
    'office coconut water delivery',
    'noida food delivery',
    'liftngo coconut',
    'coconut water sector 53 noida',
    'kanchanjunga market noida coconut',
  ],
});

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'LocalBusiness',
      name: 'Liftngo — Fresh Coconut Water Delivery',
      description: DESCRIPTION,
      url: `${SITE_URL}${PATH}`,
      image: LOGO_URL,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Near Kanchanjunga Market, Sector 53',
        addressLocality: 'Noida',
        addressRegion: 'Uttar Pradesh',
        addressCountry: 'IN',
      },
      priceRange: '₹60–₹250',
      servesCuisine: 'Beverages',
      areaServed: {
        '@type': 'City',
        name: 'Noida',
      },
    },
    {
      '@type': 'ItemList',
      name: 'Fresh Coconut Water Menu',
      description: 'Order tender coconut, malai coconut, milkshake, combos and packs.',
      url: `${SITE_URL}${PATH}`,
      numberOfItems: 8,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          item: {
            '@type': 'Product',
            name: 'Nariyal Pani (Tender Coconut Water)',
            description: 'Fresh green tender coconut with straw — chilled, naturally sweet.',
            offers: {
              '@type': 'Offer',
              price: '60',
              priceCurrency: 'INR',
              availability: 'https://schema.org/InStock',
            },
          },
        },
        {
          '@type': 'ListItem',
          position: 2,
          item: {
            '@type': 'Product',
            name: 'Malai Nariyal',
            description: 'Tender coconut with thick creamy malai scooped out.',
            offers: {
              '@type': 'Offer',
              price: '80',
              priceCurrency: 'INR',
              availability: 'https://schema.org/InStock',
            },
          },
        },
        {
          '@type': 'ListItem',
          position: 3,
          item: {
            '@type': 'Product',
            name: 'Nariyal Pani × 5 (Office Pack)',
            description: '5 fresh green coconuts delivered to your office desk. Best value.',
            offers: {
              '@type': 'Offer',
              price: '250',
              priceCurrency: 'INR',
              availability: 'https://schema.org/InStock',
            },
          },
        },
      ],
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Noida', item: `${SITE_URL}/noida-b2b-logistics` },
        { '@type': 'ListItem', position: 3, name: 'Fresh Coconut Water', item: `${SITE_URL}${PATH}` },
      ],
    },
    {
      '@type': 'WebPage',
      name: TITLE,
      description: DESCRIPTION,
      url: `${SITE_URL}${PATH}`,
      isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
    },
  ],
};

export default function NoidaCoconutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={jsonLd} />
      {children}
    </>
  );
}
