import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Fleet Branding — Advertise on Liftngo Vehicles',
  description:
    'Brand Liftngo 3W EV and 4W cargo vehicles across Delhi NCR, Khatu, and active routes — moving billboards, live pricing calculator, and WhatsApp campaign quotes.',
  path: '/fleet-branding',
  keywords: [
    'fleet branding India',
    'Delhi NCR vehicle advertising',
    'vehicle wrap logistics',
    'Liftngo branding',
    'EV fleet wrap',
    'Noida Ghaziabad delivery branding',
  ],
});

export default function FleetBrandingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
