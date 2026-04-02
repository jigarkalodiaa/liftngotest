import ContentLayout from '@/components/layout/ContentLayout';
import B2BVerticalTemplate from '@/components/marketing/B2BVerticalTemplate';
import { generatePageMetadata } from '@/lib/seo';
import { ROUTES } from '@/lib/constants';
import { BREADCRUMB_HOME } from '@/lib/breadcrumbsNav';

const PATH = ROUTES.FOR_RESTAURANTS;

export const metadata = generatePageMetadata({
  title: 'Restaurant delivery Khatu | Liftngo B2B',
  description:
    'Restaurant logistics in Khatu: ₹50 fixed delivery, fast runs for ingredients, cloud-kitchen handoffs & guest orders. Partner with Liftngo — WhatsApp booking.',
  path: PATH,
  keywords: [
    'restaurant delivery khatu',
    'khatu food logistics',
    'cloud kitchen delivery Khatu',
    'B2B restaurant partner',
  ],
});

export default function ForRestaurantsPage() {
  return (
    <ContentLayout
      breadcrumbs={[BREADCRUMB_HOME, { name: 'For restaurants', path: PATH }]}
    >
      <B2BVerticalTemplate
        h1="Restaurant & kitchen logistics in Khatu"
        intro="From last-mile guest orders to supplier runs and inter-outlet transfers — Liftngo keeps your kitchen moving without building a captive fleet. Book on WhatsApp or online; we assign drivers fast."
        bullets={[
          '₹50 fixed delivery for typical local food runs (see corridor terms)',
          '15–25 minute delivery positioning for hyperlocal orders',
          'One partner for stock, laundry handoffs, and ad-hoc goods',
          'Simple onboarding — share lanes on WhatsApp, we operationalise',
        ]}
        trackSource="b2b_vertical_restaurants_whatsapp"
        whatsappPrefill="Hi Liftngo — we’re a restaurant in Khatu and want delivery / logistics support."
      />
    </ContentLayout>
  );
}
