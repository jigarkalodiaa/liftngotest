import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';
import { MARKETING_PATHS } from '@/data/marketingRoutes';
import { SEO_CITIES } from '@/data/seoCities';
import { getAllPosts } from '@/lib/blog';

function entry(
  path: string,
  priority: number,
  changeFrequency: MetadataRoute.Sitemap[0]['changeFrequency'],
): MetadataRoute.Sitemap[0] {
  return {
    url: `${SITE}${path === '/' ? '' : path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  };
}

const SITE = SITE_URL.replace(/\/$/, '');

/**
 * Built from `MARKETING_PATHS` (edit there when adding routes) plus city SEO slugs — deduped by path.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const seen = new Set<string>();
  const out: MetadataRoute.Sitemap = [];

  for (const row of MARKETING_PATHS) {
    const normalized = row.path === '' ? '/' : row.path;
    if (seen.has(normalized)) continue;
    seen.add(normalized);
    out.push(entry(normalized === '/' ? '/' : normalized, row.priority, row.changeFrequency));
  }

  for (const city of SEO_CITIES) {
    const path = `/${city.slug}`;
    if (seen.has(path)) continue;
    seen.add(path);
    out.push(entry(path, 0.9, 'weekly'));
  }

  for (const post of getAllPosts()) {
    const path = `/blog/${post.slug}`;
    if (seen.has(path)) continue;
    seen.add(path);
    out.push({
      url: `${SITE}${path}`,
      lastModified: new Date(post.modifiedAt ?? post.publishedAt),
      changeFrequency: 'monthly',
      priority: 0.65,
    });
  }

  return out;
}
