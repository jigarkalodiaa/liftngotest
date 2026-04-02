import ContentLayout from '@/components/layout/ContentLayout';
import B2BVerticalTemplate from '@/components/marketing/B2BVerticalTemplate';
import { generatePageMetadata } from '@/lib/seo';
import { ROUTES } from '@/lib/constants';
import { BREADCRUMB_HOME } from '@/lib/breadcrumbsNav';

const PATH = ROUTES.FOR_SUPPLIERS;

export const metadata = generatePageMetadata({
  title: 'Supplier & stockist delivery Khatu | Liftngo',
  description:
    'Khatu suppliers: reliable goods transport to shops, hotels & restaurants. ₹100+ corridor rates, B2B invoicing-friendly flows. Partner with Liftngo logistics.',
  path: PATH,
  keywords: [
    'supplier delivery khatu',
    'khatu goods transport B2B',
    'stockist logistics Khatu',
    'Khatu logistics suppliers',
  ],
});

export default function ForSuppliersPage() {
  return (
    <ContentLayout
      breadcrumbs={[BREADCRUMB_HOME, { name: 'For suppliers', path: PATH }]}
    >
      <B2BVerticalTemplate
        h1="Suppliers & stockists — Khatu delivery network"
        intro="Move cartons, replenishment, and ad-hoc B2B drops across the Khatu corridor with one logistics partner. Heavier lanes from ₹100+; we align on SLAs and recurring routes."
        bullets={[
          'Fewer missed drops — priority handling for recurring lanes',
          'Multi-stop friendly — align with your retail & HoReCa customers',
          'Goods / mini-truck options when weight or volume needs it',
          'Human support on WhatsApp — no ticket black holes',
        ]}
        trackSource="b2b_vertical_suppliers_whatsapp"
        whatsappPrefill="Hi Liftngo — we’re a supplier in Khatu and need B2B delivery support."
      />
    </ContentLayout>
  );
}
