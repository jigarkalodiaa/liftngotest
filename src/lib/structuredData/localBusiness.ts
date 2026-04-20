/**
 * LocalBusiness structured data for Liftngo
 * Used on homepage and location-specific pages
 */

import { SITE_NAME, SITE_URL, LOGO_URL } from '@/lib/site';
import { supportTelephoneE164 } from './organizationShared';

export const LOCAL_BUSINESS_SCHEMA_ID = `${SITE_URL}/#localbusiness`;

/**
 * Service types offered by Liftngo
 */
export const SERVICE_TYPES = [
  'Goods Transport',
  'Home Shifting',
  'Packers and Movers',
  'Courier Service',
  'Same Day Delivery',
  'Express Delivery',
  'Mini Truck Booking',
  'Tempo Booking',
  'Bike Delivery',
  'Commercial Transport',
  'Office Shifting',
  'Furniture Shifting',
];

/**
 * Areas served by Liftngo
 */
export const AREAS_SERVED = [
  'Noida',
  'Delhi',
  'Gurgaon',
  'Greater Noida',
  'Ghaziabad',
  'Faridabad',
  'Delhi NCR',
  'Khatu Shyam Ji',
];

/**
 * Build LocalBusiness schema for homepage
 */
export function buildLocalBusinessSchema(): Record<string, unknown> {
  const tel = supportTelephoneE164();

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': LOCAL_BUSINESS_SCHEMA_ID,
    name: SITE_NAME,
    url: SITE_URL,
    logo: LOGO_URL,
    image: LOGO_URL,
    description:
      'Instant goods transport service in Noida & Delhi NCR — auto, mini truck, tempo, 2W delivery, home shifting, packers and movers. Same day delivery with live tracking.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Noida',
      addressRegion: 'Uttar Pradesh',
      postalCode: '201301',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 28.5355,
      longitude: 77.391,
    },
    ...(tel && { telephone: tel }),
    priceRange: '₹₹',
    currenciesAccepted: 'INR',
    paymentAccepted: 'Cash, UPI, Credit Card, Debit Card',
    areaServed: AREAS_SERVED.map((area) => ({
      '@type': 'City',
      name: area,
    })),
    serviceType: SERVICE_TYPES,
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '06:00',
        closes: '23:00',
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.7',
      reviewCount: '2500',
      bestRating: '5',
      worstRating: '1',
    },
  };
}

/**
 * Build Service schema for service pages
 */
export function buildServiceSchema(
  serviceName: string,
  serviceDescription: string,
  serviceType: string,
  areaServed: string[] = AREAS_SERVED
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: serviceName,
    description: serviceDescription,
    serviceType: serviceType,
    provider: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    areaServed: areaServed.map((area) => ({
      '@type': 'City',
      name: area,
    })),
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: SITE_URL,
      serviceSmsNumber: supportTelephoneE164(),
      servicePhone: {
        '@type': 'ContactPoint',
        telephone: supportTelephoneE164(),
        contactType: 'customer service',
      },
    },
  };
}

/**
 * Build city-specific LocalBusiness schema
 */
export function buildCityLocalBusinessSchema(
  cityName: string,
  cityState: string,
  services: string[]
): Record<string, unknown> {
  const tel = supportTelephoneE164();

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: `${SITE_NAME} ${cityName}`,
    url: `${SITE_URL}/${cityName.toLowerCase()}`,
    logo: LOGO_URL,
    description: `Goods transport and delivery service in ${cityName}. Book mini truck, tempo, auto, or bike for same day delivery. Packers and movers available.`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: cityName,
      addressRegion: cityState,
      addressCountry: 'IN',
    },
    ...(tel && { telephone: tel }),
    areaServed: {
      '@type': 'City',
      name: cityName,
    },
    serviceType: services,
  };
}
