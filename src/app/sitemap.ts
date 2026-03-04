import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

/** Public marketing/content pages only; app routes (dashboard, history) excluded to avoid thin app screens in index. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];
}
