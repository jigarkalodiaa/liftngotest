import ContentLayout from '@/components/layout/ContentLayout';
import B2BVerticalTemplate from '@/components/marketing/B2BVerticalTemplate';
import { generatePageMetadata } from '@/lib/seo';
import { ROUTES } from '@/lib/constants';
import { BREADCRUMB_HOME } from '@/lib/breadcrumbsNav';

const PATH = ROUTES.FOR_HOTELS;

export const metadata = generatePageMetadata({
  title: 'Hotel delivery Khatu | Liftngo logistics partner',
  description:
    'Khatu hotel delivery & logistics: one partner for guest parcels, laundry, supplies & F&B runs. No in-house fleet — priority support with Liftngo.',
  path: PATH,
  keywords: [
    'hotel delivery khatu',
    'khatu logistics hotels',
    'Khatu Shyam Ji hotel partner',
    'B2B delivery Khatu',
  ],
});

export default function ForHotelsPage() {
  return (
    <ContentLayout
      breadcrumbs={[BREADCRUMB_HOME, { name: 'For hotels', path: PATH }]}
    >
      <B2BVerticalTemplate
        h1="Hotel delivery & logistics in Khatu"
        intro="Liftngo is your corridor partner for guest requests, internal stock, laundry handoffs, and restaurant supply — fixed ₹50 delivery where it applies, 15–25 minute focus, and WhatsApp-first booking so your front desk never waits on an app install."
        bullets={[
          'Dedicated lanes for recurring pickup & drop — fewer vendors to chase',
          'Transparent pricing: food runs, laundry, supplies, and goods in one place',
          'Priority support for properties with steady volume',
          'Scale down fixed delivery-headcount risk — we flex with demand',
        ]}
        trackSource="b2b_vertical_hotels_whatsapp"
        whatsappPrefill="Hi Liftngo — we run a hotel in Khatu and want to partner for deliveries."
      />
    </ContentLayout>
  );
}
