import FirstBusinessDeliveryOfferView from '@/components/offers/FirstBusinessDeliveryOfferView';
import JsonLd from '@/components/JsonLd';
import { B2B_OFFER_LANDING_PATH } from '@/lib/b2bOffer';
import { generatePageMetadata } from '@/lib/seo';
import { SITE_NAME, SITE_URL } from '@/lib/site';

const PATH = B2B_OFFER_LANDING_PATH;
const PAGE_URL = `${SITE_URL}${PATH}`;

const TITLE = `First Business Delivery FREE | GST B2B Logistics Delhi NCR — ${SITE_NAME}`;
const DESCRIPTION =
  'GST-registered businesses in Delhi NCR: claim your first 3-wheeler delivery FREE (up to 7 KM). Limited daily slots. Fallback 70% off up to ₹250. WhatsApp LiftnGo to book.';

export const metadata = generatePageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
  keywords: [
    'first business delivery free',
    'B2B logistics Delhi NCR',
    'GST delivery Noida',
    '3 wheeler business delivery',
    'LiftnGo offer',
    'free logistics delivery business',
  ],
});

const offerSchema = {
  '@context': 'https://schema.org',
  '@type': 'Offer',
  name: 'First Business Delivery FREE',
  description: DESCRIPTION,
  url: PAGE_URL,
  eligibleCustomerType: 'Business',
  areaServed: { '@type': 'Place', name: 'Delhi NCR, India' },
  seller: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
};

export default function FirstBusinessDeliveryOfferPage() {
  return (
    <>
      <JsonLd data={offerSchema} />
      <FirstBusinessDeliveryOfferView />
    </>
  );
}
