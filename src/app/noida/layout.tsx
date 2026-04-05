import { generatePageMetadata } from '@/lib/seo';
import { OG_IMAGE_PATH } from '@/lib/site';
import NoidaJsonLd from './NoidaJsonLd';

const NOIDA_TITLE = 'B2B & Same-Day Logistics Noida & NCR | Liftngo';
const NOIDA_DESCRIPTION =
  'Corporate and same-day goods logistics in Noida and NCR: B2B subscription packs, long-term lease, GST-ready billing, 2W–4W vehicles, live tracking, recurring routes, and custom multi-vehicle quotes. From ₹39/trip 2W ad hoc short-distance base fare; 3W prepaid packs from ₹299/trip base fare starting.';

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
