import { generatePageMetadata } from '@/lib/seo';
import { OG_IMAGE_PATH } from '@/lib/site';
import NoidaJsonLd from './NoidaJsonLd';

const NOIDA_TITLE = 'Fast Logistics & Delivery Services in Noida | Liftngo';
const NOIDA_DESCRIPTION =
  'Book same-day delivery in Noida and NCR with Liftngo: 2W, 3W, 4W goods vehicles, subscription plans, GST-ready billing, live tracking. Mini truck booking, recurring routes, custom multi-vehicle quotes. From ₹39/trip 2W ad hoc short-distance base fare; 3W prepaid packs from ₹299/trip base fare starting.';

const NOIDA_KEYWORDS = [
  'logistics noida',
  'delivery service noida',
  'same day delivery noida',
  'goods transport noida',
  'mini truck booking noida',
  '2 wheeler delivery noida',
  '3 wheeler delivery noida',
  '4 wheeler delivery noida',
  'subscription logistics noida',
  'gst billing delivery noida',
  'b2b logistics noida',
];

export const metadata = generatePageMetadata({
  title: NOIDA_TITLE,
  description: NOIDA_DESCRIPTION,
  path: '/noida',
  useAbsoluteTitle: true,
  keywords: NOIDA_KEYWORDS,
  image: OG_IMAGE_PATH,
});

export default function NoidaLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NoidaJsonLd />
      {children}
    </>
  );
}
