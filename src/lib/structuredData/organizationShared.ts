import { getOrganizationSameAs } from '@/lib/social';
import {
  SITE_NAME,
  SITE_URL,
  LOGO_URL,
  LOGO_IMAGE_WIDTH,
  LOGO_IMAGE_HEIGHT,
  PROJECT_DESCRIPTION,
} from '@/lib/site';

export const ORGANIZATION_SCHEMA_ID = `${SITE_URL}/#organization`;
export const WEBSITE_SCHEMA_ID = `${SITE_URL}/#website`;

export function supportTelephoneE164(): string | undefined {
  const raw = process.env.NEXT_PUBLIC_SUPPORT_PHONE?.replace(/\D/g, '') ?? '';
  if (raw.length < 10) return undefined;
  return `+91${raw.slice(-10)}`;
}

/** `ImageObject` for Organization.logo — meets Google's logo structured-data shape. */
export function schemaOrgLogo(): Record<string, unknown> {
  return {
    '@type': 'ImageObject',
    url: LOGO_URL,
    width: LOGO_IMAGE_WIDTH,
    height: LOGO_IMAGE_HEIGHT,
  };
}

/**
 * Primary Organization node for JSON-LD @graph (and standalone scripts).
 * - No `openingHoursSpecification` here (use LocalBusiness for hours; avoids org-level validation noise).
 * - `contactPoint` only when a public phone exists (incomplete ContactPoint is a common crawler warning).
 */
export function buildPrimaryOrganizationNode(): Record<string, unknown> {
  const node: Record<string, unknown> = {
    '@type': 'Organization',
    '@id': ORGANIZATION_SCHEMA_ID,
    name: SITE_NAME,
    url: SITE_URL,
    logo: schemaOrgLogo(),
    description: PROJECT_DESCRIPTION,
  };

  const tel = supportTelephoneE164();
  if (tel) {
    node.contactPoint = [
      {
        '@type': 'ContactPoint',
        telephone: tel,
        contactType: 'customer service',
        availableLanguage: ['English', 'Hindi'],
        areaServed: 'IN',
      },
    ];
  }

  const sameAs = getOrganizationSameAs();
  if (sameAs.length > 0) {
    node.sameAs = sameAs;
  }

  return node;
}
