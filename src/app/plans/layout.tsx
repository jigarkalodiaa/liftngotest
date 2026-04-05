import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';
import PlansHeader from './PlansHeader';

export const metadata: Metadata = generatePageMetadata({
  title: 'Logistics Plans & Pricing — Subscription, Rent, Lease',
  description:
    'Compare Liftngo B2B plans: subscription delivery, vehicle rental, long-term lease, custom trip calculator, and GST billing. On-page info panels explain pack benefits, compliance, and per-plan inclusions; checkout confirms binding price. Serves Noida & NCR.',
  path: '/plans',
  keywords: [
    'logistics subscription plans',
    'delivery vehicle rental noida',
    'lease delivery vehicle ncr',
    'b2b logistics pricing',
    'gst billing logistics',
    'liftngo plans',
    'custom delivery plan',
    'vehicle with driver rental',
  ],
});

export default function PlansLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PlansHeader />
      {children}
    </>
  );
}
