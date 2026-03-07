import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';
import { SEO_CITIES } from '@/data/seoCities';

/** Public marketing/content pages only; app routes (dashboard, history) excluded to avoid thin app screens in index. */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
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

  const cityPages: MetadataRoute.Sitemap = SEO_CITIES.map((city) => ({
    url: `${SITE_URL}/${city.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  return [...staticPages, ...cityPages];
}
