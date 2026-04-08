import { KhatuPackagePage } from '@/features/khatu';
import { generatePageMetadata } from '@/lib/seo';

export const metadata = generatePageMetadata({
  title: 'Khatu Yatra package | Liftngo',
  description:
    'Plan your Khatu Yatra with modular package options like cab, hotel, food, darshan support, and return trip with live trip progress UI.',
  path: '/khatu',
  keywords: ['khatu yatra package', 'khatu trip package', 'khatu travel booking', 'liftngo khatu'],
});

export default function Page() {
  return <KhatuPackagePage />;
}
