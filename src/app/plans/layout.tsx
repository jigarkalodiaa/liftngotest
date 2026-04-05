import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';
import PlansHeader from './PlansHeader';

export const metadata: Metadata = generatePageMetadata({
  title: 'Logistics Plans & Pricing — Subscription, Rent, Lease',
  description:
    'Explore Liftngo logistics plans: subscription delivery, vehicle rental (with/without driver), long-term lease, custom trip builder, and GST billing. Subscription packs from ₹390/trip in Noida & NCR.',
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
