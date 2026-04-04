import { SITE_URL, SITE_NAME, LOGO_URL } from '@/lib/site';
import { SUPPORT_PHONE, SUPPORT_EMAIL } from '@/config/env';

const NOIDA_PATH = '/noida';

/** LocalBusiness + Service JSON-LD for the Noida logistics dashboard URL. */
export default function NoidaJsonLd() {
  const pageUrl = `${SITE_URL}${NOIDA_PATH}`;
  const telephone = SUPPORT_PHONE ? SUPPORT_PHONE.replace(/\s/g, '') : undefined;

  const graph = [
    {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': `${pageUrl}#business`,
      name: SITE_NAME,
      url: pageUrl,
      image: LOGO_URL,
      description:
        'Same-day goods logistics and delivery in Noida and Delhi NCR. Book 2-wheeler, 3-wheeler, and 4-wheeler vehicles for business deliveries; subscription plans, recurring routes, custom multi-vehicle quotes, GST billing, and live tracking.',
      areaServed: {
        '@type': 'City',
        name: 'Noida',
        containedInPlace: { '@type': 'AdministrativeArea', name: 'Uttar Pradesh' },
      },
      priceRange: '₹₹',
      ...(telephone ? { telephone } : {}),
      ...(SUPPORT_EMAIL ? { email: SUPPORT_EMAIL } : {}),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      '@id': `${pageUrl}#service`,
      name: `Logistics and delivery services in Noida — ${SITE_NAME}`,
      serviceType: 'Logistics',
      provider: { '@id': `${pageUrl}#business` },
      areaServed: { '@type': 'City', name: 'Noida' },
      description:
        'On-demand and subscription-based goods transport in Noida: two-wheeler, three-wheeler, and four-wheeler cargo vehicles, same-day delivery, mini truck and fleet options, GST-compliant invoicing, and live tracking.',
      url: pageUrl,
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
